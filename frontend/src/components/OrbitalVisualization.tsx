import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Orbit } from "lucide-react";

interface OrbitParams {
  asteroidSize: number;
  velocity: number;
  approachAngle: number;
  composition: string;
}

interface OrbitalVisualizationProps {
  params?: OrbitParams;
  isSimulating?: boolean;
}

const OrbitalVisualization: React.FC<OrbitalVisualizationProps> = ({ 
  params, 
  isSimulating = false 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const earthRef = useRef<THREE.Mesh>();
  const asteroidRef = useRef<THREE.Mesh>();
  const orbitLineRef = useRef<THREE.Line>();
  const animationIdRef = useRef<number>();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationTime, setAnimationTime] = useState(0);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(15, 10, 15);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Add starfield
    createStarfield(scene);

    // Create Earth
    createEarth(scene);

    // Create asteroid if params exist
    if (params) {
      createAsteroid(scene, params);
      createOrbitPath(scene, params);
    }

    // Controls for camera
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDragging) return;

      const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };

      const spherical = new THREE.Spherical();
      spherical.setFromVector3(camera.position);
      spherical.theta -= deltaMove.x * 0.01;
      spherical.phi += deltaMove.y * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 0, 0);

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (event: WheelEvent) => {
      const distance = camera.position.length();
      const newDistance = Math.max(5, Math.min(50, distance + event.deltaY * 0.01));
      camera.position.normalize().multiplyScalar(newDistance);
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel);

    // Animation loop
    const animate = () => {
      if (!scene || !camera || !renderer) return;

      // Rotate Earth
      if (earthRef.current) {
        earthRef.current.rotation.y += 0.005;
      }

      // Animate asteroid if playing
      if (isPlaying && asteroidRef.current && orbitLineRef.current) {
        const time = Date.now() * 0.001 * 0.5; // Slow down animation
        const position = getAsteroidPosition(time, params);
        asteroidRef.current.position.copy(position);
        
        // Add rotation to asteroid
        asteroidRef.current.rotation.x += 0.02;
        asteroidRef.current.rotation.y += 0.01;
      }

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [params, isPlaying]);

  // Create starfield background
  const createStarfield = (scene: THREE.Scene) => {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff,
      size: 0.5,
      sizeAttenuation: false
    });

    const starVertices = [];
    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
  };

  // Create Earth
  const createEarth = (scene: THREE.Scene) => {
    const earthGeometry = new THREE.SphereGeometry(2, 32, 32);
    
    // Create Earth material with a blue/green appearance
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x6B93D6,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    });

    // Add Earth atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(2.1, 32, 32);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x87CEEB,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    
    earth.add(atmosphere);
    earth.castShadow = true;
    earth.receiveShadow = true;
    
    earthRef.current = earth;
    scene.add(earth);
  };

  // Create asteroid
  const createAsteroid = (scene: THREE.Scene, params: OrbitParams) => {
    const size = Math.max(0.05, Math.min(0.5, params.asteroidSize / 1000)); // Scale size
    
    // Create irregular asteroid shape
    const asteroidGeometry = new THREE.DodecahedronGeometry(size, 1);
    
    // Modify vertices for irregular shape
    const vertices = asteroidGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      vertices[i] *= 0.8 + Math.random() * 0.4;     // x
      vertices[i + 1] *= 0.8 + Math.random() * 0.4; // y  
      vertices[i + 2] *= 0.8 + Math.random() * 0.4; // z
    }
    asteroidGeometry.attributes.position.needsUpdate = true;
    asteroidGeometry.computeVertexNormals();

    // Material based on composition
    let color = 0x8B7D6B; // Default rocky
    if (params.composition === 'metal') color = 0xC0C0C0;
    else if (params.composition === 'ice') color = 0xE6F3FF;

    const asteroidMaterial = new THREE.MeshPhongMaterial({
      color: color,
      shininess: 10,
      transparent: true,
      opacity: 0.9
    });

    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    asteroid.castShadow = true;
    
    asteroidRef.current = asteroid;
    scene.add(asteroid);
  };

  // Create orbit path
  const createOrbitPath = (scene: THREE.Scene, params: OrbitParams) => {
    const points = [];
    const segments = 100;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const position = getAsteroidPosition(t * Math.PI * 2, params);
      points.push(position);
    }

    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0x9333EA,
      transparent: true,
      opacity: 0.6
    });

    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitLineRef.current = orbitLine;
    scene.add(orbitLine);
  };

  // Calculate asteroid position based on orbital parameters
  const getAsteroidPosition = (time: number, params?: OrbitParams) => {
    if (!params) return new THREE.Vector3(8, 0, 0);
    
    const radius = 8 + (params.velocity / 30) * 5; // Elliptical orbit based on velocity
    const angleOffset = (params.approachAngle * Math.PI) / 180;
    
    const x = Math.cos(time + angleOffset) * radius;
    const y = Math.sin(time * 0.3) * 2; // Slight inclination
    const z = Math.sin(time + angleOffset) * radius * 0.8; // Elliptical
    
    return new THREE.Vector3(x, y, z);
  };

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  const resetAnimation = () => {
    setIsPlaying(false);
    setAnimationTime(0);
    if (asteroidRef.current && params) {
      const startPosition = getAsteroidPosition(0, params);
      asteroidRef.current.position.copy(startPosition);
    }
  };

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Orbit className="w-5 h-5 text-cosmic-blue" />
            <span>3D Orbital Visualization</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAnimation}
              className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue hover:text-white"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={resetAnimation}
              className="border-border hover:border-primary"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div 
          ref={mountRef} 
          className="w-full h-96 rounded-lg overflow-hidden bg-gradient-to-br from-background to-card"
          style={{ cursor: 'grab' }}
        />
        
        <div className="p-4 border-t border-border/50">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>🌍 Earth</span>
            <span>☄️ Asteroid</span>
            <span>━ Orbital Path</span>
            <span>🖱️ Drag to rotate • 🖲️ Scroll to zoom</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrbitalVisualization;