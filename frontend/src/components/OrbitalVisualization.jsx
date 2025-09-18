import { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Toggle } from "@/components/ui/toggle";
import { Globe, Play, Pause, RotateCcw, Zap, Target, Eye, RotateCw } from "lucide-react";

const OrbitalVisualization3D = ({ params, isSimulating, animationTime = 8000 }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const asteroidRef = useRef(null);
  const trailRef = useRef(null);
  const animationRef = useRef(null);
  const earthRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [is3DMode, setIs3DMode] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  // Initialize Three.js scene
  const initializeScene = useCallback(() => {
    if (!mountRef.current) return { scene: null, renderer: null, camera: null };

    const width = mountRef.current.clientWidth;
    const height = Math.min(400, width * 0.6);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
    camera.position.set(0, 200, 500);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(200, 200, 200);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Point light for dramatic effect
    const pointLight = new THREE.PointLight(0x4a90e2, 0.5, 1000);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Star field
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 2,
      transparent: true,
      opacity: 0.8
    });

    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 4000;
      const y = (Math.random() - 0.5) * 4000;
      const z = (Math.random() - 0.5) * 4000;
      starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Earth
    const earthGeometry = new THREE.SphereGeometry(20, 32, 32);
    
    // Create a simple Earth texture using canvas
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    // Create Earth-like gradient
    const gradient = context.createRadialGradient(80, 80, 0, 128, 128, 128);
    gradient.addColorStop(0, '#22d3ee');
    gradient.addColorStop(0.5, '#059669');
    gradient.addColorStop(1, '#1e40af');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    
    const earthTexture = new THREE.CanvasTexture(canvas);
    
    const earthMaterial = new THREE.MeshPhongMaterial({ 
      map: earthTexture,
      shininess: 100,
      transparent: true,
      opacity: 0.9
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(0, 0, 0);
    earth.castShadow = true;
    earth.receiveShadow = true;
    scene.add(earth);
    earthRef.current = earth;

    // Earth glow
    const earthGlowGeometry = new THREE.SphereGeometry(25, 32, 32);
    const earthGlowMaterial = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.1
    });
    const earthGlow = new THREE.Mesh(earthGlowGeometry, earthGlowMaterial);
    earth.add(earthGlow);

    // Orbit reference
    const orbitGeometry = new THREE.RingGeometry(180, 182, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0x475569,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    return { scene, renderer, camera };
  }, []);

  // Create asteroid based on parameters
  const createAsteroid = useCallback((scene, params) => {
    if (!scene || !params) return null;

    const size = Math.max(2, Math.min(10, (parseFloat(params.asteroidSize || params.size) || 100) / 20));
    
    // Composition-based materials
    const compositionMaterials = {
      rock: new THREE.MeshPhongMaterial({ 
        color: 0x8b5cf6, 
        shininess: 30,
        transparent: true,
        opacity: 0.9
      }),
      metal: new THREE.MeshPhongMaterial({ 
        color: 0x6b7280, 
        shininess: 100
      }),
      ice: new THREE.MeshPhongMaterial({ 
        color: 0x22d3ee, 
        shininess: 80,
        transparent: true,
        opacity: 0.7
      }),
      mixed: new THREE.MeshPhongMaterial({ 
        color: 0xf97316, 
        shininess: 50
      })
    };

    const material = compositionMaterials[params.composition] || compositionMaterials.rock;
    
    // Create irregular asteroid shape
    const geometry = new THREE.IcosahedronGeometry(size, 2);
    
    // Add some irregularity
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(positions, i);
      vertex.multiplyScalar(0.8 + Math.random() * 0.4);
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();

    const asteroid = new THREE.Mesh(geometry, material);
    asteroid.castShadow = true;
    asteroid.receiveShadow = true;

    // Add glow effect for high velocity
    const velocity = parseFloat(params.velocity) || 20;
    if (velocity > 25) {
      const glowGeometry = new THREE.SphereGeometry(size + 2, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: material.color,
        transparent: true,
        opacity: 0.3
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      asteroid.add(glow);
    }

    scene.add(asteroid);
    asteroidRef.current = asteroid;

    return asteroid;
  }, []);

  // Create trail system
  const createTrail = useCallback((scene) => {
    if (!scene) return null;

    const trailMaterial = new THREE.LineBasicMaterial({
      color: 0xff6b35,
      transparent: true,
      opacity: 0.6
    });

    const trailGeometry = new THREE.BufferGeometry();
    const trailPoints = [];
    
    trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(trailPoints, 3));
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    
    scene.add(trail);
    trailRef.current = trail;
    
    return trail;
  }, []);

  // Calculate trajectory
  const calculateTrajectory = useCallback((params) => {
    if (!params) return { start: new THREE.Vector3(), end: new THREE.Vector3() };

    const angle = ((parseFloat(params.approachAngle || params.angle) || 45) * Math.PI) / 180;
    const startDistance = 400;
    
    const start = new THREE.Vector3(
      Math.cos(angle) * startDistance,
      Math.sin(angle) * startDistance * 0.5,
      Math.sin(angle) * startDistance
    );
    
    const end = new THREE.Vector3(
      Math.cos(angle + Math.PI) * 25,
      Math.sin(angle + Math.PI) * 12,
      Math.sin(angle + Math.PI) * 25
    );

    return { start, end };
  }, []);

  // Show impact effect
  const showImpactEffect = useCallback(() => {
    if (!sceneRef.current || !earthRef.current) return;

    // Create explosion particles
    const explosionGeometry = new THREE.SphereGeometry(1, 8, 8);
    const explosionMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4444,
      transparent: true,
      opacity: 0.8
    });

    for (let i = 0; i < 20; i++) {
      const particle = new THREE.Mesh(explosionGeometry, explosionMaterial);
      const angle = (i / 20) * Math.PI * 2;
      particle.position.set(
        Math.cos(angle) * 30,
        Math.sin(angle) * 30,
        0
      );
      sceneRef.current.add(particle);

      // Animate particles
      const startTime = Date.now();
      const animateParticle = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / 2000;
        
        if (progress < 1) {
          particle.scale.setScalar(1 + progress * 5);
          particle.material.opacity = 0.8 * (1 - progress);
          requestAnimationFrame(animateParticle);
        } else {
          sceneRef.current.remove(particle);
        }
      };
      animateParticle();
    }

    // Earth shake effect
    const originalPosition = earthRef.current.position.clone();
    let shakeCount = 0;
    const shake = () => {
      if (shakeCount < 10) {
        earthRef.current.position.x = originalPosition.x + (Math.random() - 0.5) * 5;
        earthRef.current.position.y = originalPosition.y + (Math.random() - 0.5) * 5;
        shakeCount++;
        setTimeout(shake, 50);
      } else {
        earthRef.current.position.copy(originalPosition);
      }
    };
    shake();
  }, []);

  // Animation functions
  const startAnimation = useCallback(() => {
    if (!sceneRef.current || !asteroidRef.current || !params) return;

    setIsPlaying(true);
    setCurrentTime(0);

    const { start, end } = calculateTrajectory(params);
    asteroidRef.current.position.copy(start);

    const velocity = parseFloat(params.velocity) || 20;
    const duration = Math.max(3000, animationTime / Math.max(1, velocity / 20));

    const startTime = Date.now();
    const trailPoints = [];

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setCurrentTime(progress * 100);

      // Update asteroid position
      const currentPos = start.clone().lerp(end, progress);
      asteroidRef.current.position.copy(currentPos);

      // Add rotation
      asteroidRef.current.rotation.x += 0.01;
      asteroidRef.current.rotation.y += 0.02;

      // Update trail
      if (progress > 0.1) {
        trailPoints.push(currentPos.x, currentPos.y, currentPos.z);
        if (trailPoints.length > 300) { // Limit trail length
          trailPoints.splice(0, 3);
        }
        
        if (trailRef.current) {
          trailRef.current.geometry.setAttribute('position', 
            new THREE.Float32BufferAttribute(trailPoints, 3));
          trailRef.current.geometry.attributes.position.needsUpdate = true;
        }
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
        showImpactEffect();
      }
    };

    animate();
  }, [params, animationTime, calculateTrajectory, showImpactEffect]);

  const pauseAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsPlaying(false);
  }, []);

  const resetAnimation = useCallback(() => {
    pauseAnimation();
    setCurrentTime(0);
    
    if (trailRef.current) {
      trailRef.current.geometry.setAttribute('position', 
        new THREE.Float32BufferAttribute([], 3));
    }

    if (asteroidRef.current && params) {
      const { start } = calculateTrajectory(params);
      asteroidRef.current.position.copy(start);
    }
  }, [pauseAnimation, calculateTrajectory, params]);

  // Render loop
  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    let frameId;
    
    const render = () => {
      if (isAutoRotate && cameraRef.current && !isPlaying) {
        cameraRef.current.position.x = Math.cos(Date.now() * 0.0005) * 500;
        cameraRef.current.position.z = Math.sin(Date.now() * 0.0005) * 500;
        cameraRef.current.lookAt(0, 0, 0);
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isAutoRotate, isPlaying]);

  // Initialize scene
  useEffect(() => {
    const result = initializeScene();
    if (result.scene) {
      createTrail(result.scene);
    }
    
    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !result.renderer || !result.camera) return;
      
      const width = mountRef.current.clientWidth;
      const height = Math.min(400, width * 0.6);
      
      result.camera.aspect = width / height;
      result.camera.updateProjectionMatrix();
      result.renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && result.renderer && mountRef.current.contains(result.renderer.domElement)) {
        mountRef.current.removeChild(result.renderer.domElement);
      }
      result.renderer?.dispose();
    };
  }, [initializeScene, createTrail]);

  // Update asteroid when params change
  useEffect(() => {
    if (!sceneRef.current || !params) return;

    // Remove old asteroid
    if (asteroidRef.current) {
      sceneRef.current.remove(asteroidRef.current);
    }

    // Create new asteroid
    createAsteroid(sceneRef.current, params);
    
    // Reset position
    if (asteroidRef.current) {
      const { start } = calculateTrajectory(params);
      asteroidRef.current.position.copy(start);
    }
  }, [params, createAsteroid, calculateTrajectory]);

  // Handle simulation trigger
  useEffect(() => {
    if (isSimulating && !isPlaying) {
      startAnimation();
    } else if (!isSimulating && isPlaying) {
      pauseAnimation();
    }
  }, [isSimulating, isPlaying, startAnimation, pauseAnimation]);

  const getCompositionColor = useCallback((composition) => {
    const colors = {
      rock: '#8b5cf6',
      metal: '#6b7280', 
      ice: '#22d3ee',
      mixed: '#f97316'
    };
    return colors[composition] || colors.rock;
  }, []);

  const getVelocityBadge = useCallback((velocity) => {
    const vel = parseFloat(velocity) || 20;
    if (vel < 15) return { color: 'bg-success', text: 'Slow' };
    if (vel < 30) return { color: 'bg-cosmic-orange', text: 'Moderate' };
    if (vel < 50) return { color: 'bg-warning', text: 'Fast' };
    return { color: 'bg-destructive', text: 'Extreme' };
  }, []);

  return (
    <Card className="bg-card/60 border-border/50 backdrop-blur-sm shadow-cosmic">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-cosmic-blue to-primary">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <span>3D Orbital Trajectory</span>
              <div className="text-sm text-muted-foreground font-normal">
                Interactive 3D impact simulation
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge 
              className="text-white border-0"
              style={{ backgroundColor: getCompositionColor(params?.composition) }}
            >
              {params?.composition || 'rock'}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 3D Visualization Container */}
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg border border-border/50 overflow-hidden shadow-inner">
          <div 
            ref={mountRef} 
            className="w-full"
            style={{ minHeight: '300px', height: '400px' }}
          />
          
          {/* Overlay Controls */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <Toggle
              pressed={isAutoRotate}
              onPressedChange={setIsAutoRotate}
              className="bg-background/20 backdrop-blur-sm"
              size="sm"
            >
              <RotateCw className="w-4 h-4" />
            </Toggle>
            
            <Toggle
              pressed={is3DMode}
              onPressedChange={setIs3DMode}
              className="bg-background/20 backdrop-blur-sm"
              size="sm"
            >
              <Eye className="w-4 h-4" />
            </Toggle>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Impact Progress</span>
            <span className="font-mono font-bold text-primary">
              {currentTime.toFixed(0)}%
            </span>
          </div>
          <Progress 
            value={currentTime} 
            className="h-2 bg-muted/30"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <Button
              onClick={isPlaying ? pauseAnimation : startAnimation}
              disabled={!params}
              size="sm"
              className="bg-gradient-cosmic hover:shadow-glow h-10 px-4"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </>
              )}
            </Button>
            
            <Button
              onClick={resetAnimation}
              disabled={!params}
              variant="outline"
              size="sm"
              className="h-10 px-4"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            {isPlaying ? 'Simulation running...' : 'Ready to simulate'}
          </div>
        </div>

        {/* Trajectory Info - Responsive */}
        {params && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg border border-border/30">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-cosmic-orange" />
                <div className="text-xs text-muted-foreground">Approach Angle</div>
              </div>
              <div className="font-semibold text-lg">
                {params.approachAngle || params.angle || '45'}°
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-cosmic-orange" />
                <div className="text-xs text-muted-foreground">Impact Velocity</div>
              </div>
              <div className="font-semibold text-lg flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                <span>{params.velocity || '20'} km/s</span>
                <Badge className={`${getVelocityBadge(params.velocity).color} text-white text-xs w-fit`}>
                  {getVelocityBadge(params.velocity).text}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-cosmic-blue" />
                <div className="text-xs text-muted-foreground">Asteroid Size</div>
              </div>
              <div className="font-semibold text-lg">
                {params.asteroidSize || params.size || '100'}m diameter
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

OrbitalVisualization3D.propTypes = {
  params: PropTypes.shape({
    asteroidSize: PropTypes.string,
    size: PropTypes.string,
    velocity: PropTypes.string,
    composition: PropTypes.string,
    approachAngle: PropTypes.string,
    angle: PropTypes.string
  }),
  isSimulating: PropTypes.bool,
  animationTime: PropTypes.number
};

export default OrbitalVisualization3D;