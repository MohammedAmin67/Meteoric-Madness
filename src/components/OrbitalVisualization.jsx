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

  // Initialize Three.js scene with enhanced settings
  const initializeScene = useCallback(() => {
    if (!mountRef.current) return { scene: null, renderer: null, camera: null };

    const width = mountRef.current.clientWidth;
    const height = Math.min(500, width * 0.7); // Increased height for better view

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510); // Darker space background

    // Camera - MUCH closer for zoomed-in effect
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 80, 150); // Much closer to Earth
    camera.lookAt(0, 0, 0);

    // Enhanced Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.15);
    scene.add(ambientLight);

    // Main directional light (Sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(100, 100, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -200;
    sunLight.shadow.camera.right = 200;
    sunLight.shadow.camera.top = 200;
    sunLight.shadow.camera.bottom = -200;
    scene.add(sunLight);

    // Blue rim light for dramatic effect
    const rimLight = new THREE.DirectionalLight(0x4a90e2, 0.8);
    rimLight.position.set(-50, -50, 100);
    scene.add(rimLight);

    // Enhanced Star field - closer and denser
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 1.5,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    });

    const starsVertices = [];
    const starsColors = [];
    for (let i = 0; i < 3000; i++) { // More stars, closer range
      const x = (Math.random() - 0.5) * 800; // Smaller range for zoomed view
      const y = (Math.random() - 0.5) * 800;
      const z = (Math.random() - 0.5) * 800;
      starsVertices.push(x, y, z);
      
      // Varied star colors
      const starBrightness = 0.5 + Math.random() * 0.5;
      starsColors.push(starBrightness, starBrightness, 1);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3));
    
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Enhanced Earth with realistic details
    const earthGeometry = new THREE.SphereGeometry(35, 64, 64); // Larger, higher detail
    
    // Create enhanced Earth texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    // Create realistic Earth with continents
    const gradient = context.createRadialGradient(150, 150, 0, 256, 256, 256);
    gradient.addColorStop(0, '#22d3ee'); // Ocean blue
    gradient.addColorStop(0.3, '#059669'); // Land green
    gradient.addColorStop(0.7, '#1e40af'); // Deep ocean
    gradient.addColorStop(1, '#0f172a'); // Atmosphere edge
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);
    
    // Add continent-like shapes
    context.fillStyle = '#065f46';
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = 20 + Math.random() * 40;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
    
    // Add cloud layer
    context.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 12; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const radius = 10 + Math.random() * 30;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
    
    const earthTexture = new THREE.CanvasTexture(canvas);
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.RepeatWrapping;
    
    const earthMaterial = new THREE.MeshPhongMaterial({ 
      map: earthTexture,
      shininess: 80,
      transparent: false,
      bumpScale: 0.05
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(0, 0, 0);
    earth.castShadow = true;
    earth.receiveShadow = true;
    scene.add(earth);
    earthRef.current = earth;

    // Enhanced Earth atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(37, 32, 32);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earth.add(atmosphere);

    // Orbital reference rings - closer and more visible
    const orbitGeometry = new THREE.RingGeometry(90, 92, 64); // Closer orbit
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0x475569,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);

    // Add moon for reference (smaller, in background)
    const moonGeometry = new THREE.SphereGeometry(8, 32, 32);
    const moonMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x888888,
      shininess: 10
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(120, 30, 80);
    moon.castShadow = true;
    moon.receiveShadow = true;
    scene.add(moon);

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    return { scene, renderer, camera };
  }, []);

  // Enhanced asteroid creation
  const createAsteroid = useCallback((scene, params) => {
    if (!scene || !params) return null;

    const size = Math.max(3, Math.min(15, (parseFloat(params.asteroidSize || params.size) || 100) / 15)); // Larger asteroids
    
    // Enhanced composition-based materials
    const compositionMaterials = {
      rock: new THREE.MeshPhongMaterial({ 
        color: 0x8b5cf6, 
        shininess: 20,
        transparent: false,
        roughness: 0.8
      }),
      metal: new THREE.MeshPhongMaterial({ 
        color: 0x6b7280, 
        shininess: 120,
        reflectivity: 0.3
      }),
      ice: new THREE.MeshPhongMaterial({ 
        color: 0x22d3ee, 
        shininess: 100,
        transparent: true,
        opacity: 0.8,
        refractionRatio: 0.9
      }),
      mixed: new THREE.MeshPhongMaterial({ 
        color: 0xf97316, 
        shininess: 60
      })
    };

    const material = compositionMaterials[params.composition] || compositionMaterials.rock;
    
    // Create more irregular asteroid shape
    const geometry = new THREE.IcosahedronGeometry(size, 3); // Higher detail
    
    // Add more pronounced irregularity
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const vertex = new THREE.Vector3();
      vertex.fromBufferAttribute(positions, i);
      vertex.multiplyScalar(0.6 + Math.random() * 0.8); // More variation
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    positions.needsUpdate = true;
    geometry.computeVertexNormals();

    const asteroid = new THREE.Mesh(geometry, material);
    asteroid.castShadow = true;
    asteroid.receiveShadow = true;

    // Enhanced glow effect based on velocity
    const velocity = parseFloat(params.velocity) || 20;
    if (velocity > 15) { // Lower threshold for glow
      const glowGeometry = new THREE.SphereGeometry(size + (velocity / 10), 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: material.color,
        transparent: true,
        opacity: Math.min(0.6, velocity / 50) // Velocity-based opacity
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      asteroid.add(glow);

      // Add particle trail for high velocity
      if (velocity > 30) {
        const trailGeometry = new THREE.ConeGeometry(size / 2, size * 2, 8);
        const trailMaterial = new THREE.MeshBasicMaterial({
          color: 0xff4444,
          transparent: true,
          opacity: 0.4
        });
        const trail = new THREE.Mesh(trailGeometry, trailMaterial);
        trail.position.z = size * 1.5;
        trail.rotation.x = Math.PI;
        asteroid.add(trail);
      }
    }

    scene.add(asteroid);
    asteroidRef.current = asteroid;

    return asteroid;
  }, []);

  // Enhanced trail system
  const createTrail = useCallback((scene) => {
    if (!scene) return null;

    const trailMaterial = new THREE.LineBasicMaterial({
      color: 0xff6b35,
      transparent: true,
      opacity: 0.8,
      linewidth: 3
    });

    const trailGeometry = new THREE.BufferGeometry();
    const trailPoints = [];
    
    trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(trailPoints, 3));
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    
    scene.add(trail);
    trailRef.current = trail;
    
    return trail;
  }, []);

  // Enhanced trajectory calculation - closer to Earth
  const calculateTrajectory = useCallback((params) => {
    if (!params) return { start: new THREE.Vector3(), end: new THREE.Vector3() };

    const angle = ((parseFloat(params.approachAngle || params.angle) || 45) * Math.PI) / 180;
    const startDistance = 200; // Much closer start distance
    
    const start = new THREE.Vector3(
      Math.cos(angle) * startDistance,
      Math.sin(angle) * startDistance * 0.3, // Less vertical spread
      Math.sin(angle) * startDistance * 0.7
    );
    
    const end = new THREE.Vector3(
      Math.cos(angle + Math.PI) * 35, // Impact on Earth surface
      Math.sin(angle + Math.PI) * 18,
      Math.sin(angle + Math.PI) * 35
    );

    return { start, end };
  }, []);

  // Enhanced impact effect
  const showImpactEffect = useCallback(() => {
    if (!sceneRef.current || !earthRef.current) return;

    // Create massive explosion with multiple layers
    const explosionColors = [0xffffff, 0xff8844, 0xff4444, 0xaa2222];
    
    for (let layer = 0; layer < 4; layer++) {
      const explosionGeometry = new THREE.SphereGeometry(2 + layer, 16, 16);
      const explosionMaterial = new THREE.MeshBasicMaterial({
        color: explosionColors[layer],
        transparent: true,
        opacity: 0.9 - layer * 0.2
      });

      for (let i = 0; i < 15; i++) {
        const particle = new THREE.Mesh(explosionGeometry, explosionMaterial);
        const angle = (i / 15) * Math.PI * 2;
        const radius = 45 + layer * 10;
        particle.position.set(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 20
        );
        sceneRef.current.add(particle);

        // Enhanced particle animation
        const startTime = Date.now();
        const animateParticle = () => {
          const elapsed = Date.now() - startTime;
          const progress = elapsed / (2500 + layer * 500);
          
          if (progress < 1) {
            particle.scale.setScalar(1 + progress * (8 + layer * 2));
            particle.material.opacity = (0.9 - layer * 0.2) * (1 - progress);
            particle.rotation.x += 0.02;
            particle.rotation.y += 0.03;
            requestAnimationFrame(animateParticle);
          } else {
            sceneRef.current.remove(particle);
          }
        };
        animateParticle();
      }
    }

    // Enhanced Earth shake with rotation
    const originalPosition = earthRef.current.position.clone();
    const originalRotation = earthRef.current.rotation.clone();
    let shakeCount = 0;
    
    const shake = () => {
      if (shakeCount < 20) {
        const intensity = (20 - shakeCount) / 20;
        earthRef.current.position.x = originalPosition.x + (Math.random() - 0.5) * 8 * intensity;
        earthRef.current.position.y = originalPosition.y + (Math.random() - 0.5) * 8 * intensity;
        earthRef.current.position.z = originalPosition.z + (Math.random() - 0.5) * 4 * intensity;
        
        earthRef.current.rotation.x = originalRotation.x + (Math.random() - 0.5) * 0.02 * intensity;
        earthRef.current.rotation.z = originalRotation.z + (Math.random() - 0.5) * 0.02 * intensity;
        
        shakeCount++;
        setTimeout(shake, 30);
      } else {
        earthRef.current.position.copy(originalPosition);
        earthRef.current.rotation.copy(originalRotation);
      }
    };
    shake();
  }, []);

  // Enhanced animation with better camera work
  const startAnimation = useCallback(() => {
    if (!sceneRef.current || !asteroidRef.current || !params) return;

    setIsPlaying(true);
    setCurrentTime(0);

    const { start, end } = calculateTrajectory(params);
    asteroidRef.current.position.copy(start);

    const velocity = parseFloat(params.velocity) || 20;
    const duration = Math.max(4000, animationTime / Math.max(1, velocity / 25));

    const startTime = Date.now();
    const trailPoints = [];

    // Camera following animation
    const originalCameraPos = cameraRef.current.position.clone();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setCurrentTime(progress * 100);

      // Update asteroid position
      const currentPos = start.clone().lerp(end, progress);
      asteroidRef.current.position.copy(currentPos);

      // Enhanced rotation with tumbling
      asteroidRef.current.rotation.x += 0.02 * (1 + velocity / 30);
      asteroidRef.current.rotation.y += 0.03 * (1 + velocity / 30);
      asteroidRef.current.rotation.z += 0.01 * (1 + velocity / 30);

      // Dynamic camera following
      if (progress > 0.3 && progress < 0.9) {
        const followPos = currentPos.clone().add(new THREE.Vector3(50, 30, 80));
        cameraRef.current.position.lerp(followPos, 0.02);
        cameraRef.current.lookAt(currentPos);
      }

      // Enhanced trail with fade
      if (progress > 0.05) {
        trailPoints.push(currentPos.x, currentPos.y, currentPos.z);
        if (trailPoints.length > 150) { // Longer trail
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
        
        // Reset camera after impact
        setTimeout(() => {
          const resetCamera = () => {
            cameraRef.current.position.lerp(originalCameraPos, 0.05);
            cameraRef.current.lookAt(0, 0, 0);
            if (cameraRef.current.position.distanceTo(originalCameraPos) > 1) {
              requestAnimationFrame(resetCamera);
            }
          };
          resetCamera();
        }, 1000);
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

    // Reset camera
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 80, 150);
      cameraRef.current.lookAt(0, 0, 0);
    }
  }, [pauseAnimation, calculateTrajectory, params]);

  // Enhanced render loop with Earth rotation
  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    let frameId;
    
    const render = () => {
      // Rotate Earth slowly
      if (earthRef.current) {
        earthRef.current.rotation.y += 0.002;
      }

      // Auto-rotate camera when enabled
      if (isAutoRotate && cameraRef.current && !isPlaying) {
        const radius = 150;
        const time = Date.now() * 0.0003;
        cameraRef.current.position.x = Math.cos(time) * radius;
        cameraRef.current.position.z = Math.sin(time) * radius;
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
    
    // Enhanced resize handler
    const handleResize = () => {
      if (!mountRef.current || !result.renderer || !result.camera) return;
      
      const width = mountRef.current.clientWidth;
      const height = Math.min(500, width * 0.7);
      
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
              <span>Enhanced 3D Trajectory</span>
              <div className="text-sm text-muted-foreground font-normal">
                Immersive impact visualization
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
        {/* Enhanced 3D Visualization Container */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 rounded-lg border border-border/50 overflow-hidden shadow-inner">
          <div 
            ref={mountRef} 
            className="w-full"
            style={{ minHeight: '400px', height: '500px' }} // Increased height
          />
          
          {/* Enhanced Overlay Controls */}
          <div className="absolute top-3 right-3 flex space-x-2">
            <Toggle
              pressed={isAutoRotate}
              onPressedChange={setIsAutoRotate}
              className="bg-background/20 backdrop-blur-sm border-primary/30"
              size="sm"
            >
              <RotateCw className="w-4 h-4" />
            </Toggle>
            
            <Toggle
              pressed={is3DMode}
              onPressedChange={setIs3DMode}
              className="bg-background/20 backdrop-blur-sm border-primary/30"
              size="sm"
            >
              <Eye className="w-4 h-4" />
            </Toggle>
          </div>

          {/* Status overlay */}
          <div className="absolute bottom-3 left-3 bg-background/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/30">
            <div className="text-xs text-muted-foreground">
              {isPlaying ? (
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  <span>Impact in progress</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span>Ready to simulate</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Impact Progress</span>
            <span className="font-mono font-bold text-primary">
              {currentTime.toFixed(0)}%
            </span>
          </div>
          <Progress 
            value={currentTime} 
            className="h-3 bg-muted/30"
          />
          {currentTime > 0 && currentTime < 100 && (
            <div className="text-xs text-center text-muted-foreground">
              T-{((100 - currentTime) / 100 * (animationTime / 1000)).toFixed(1)}s to impact
            </div>
          )}
        </div>

        {/* Enhanced Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <Button
              onClick={isPlaying ? pauseAnimation : startAnimation}
              disabled={!params}
              size="sm"
              className="bg-gradient-cosmic hover:shadow-glow h-12 px-6"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause Simulation
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Begin Impact
                </>
              )}
            </Button>
            
            <Button
              onClick={resetAnimation}
              disabled={!params}
              variant="outline"
              size="sm"
              className="h-12 px-4 border-primary/30 hover:border-primary"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Reset View</span>
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            {isPlaying ? 'Asteroid approaching Earth...' : 'Configure parameters and run simulation'}
          </div>
        </div>

        {/* Enhanced Trajectory Info */}
        {params && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg border border-border/30">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-cosmic-orange" />
                <div className="text-xs text-muted-foreground">Approach Trajectory</div>
              </div>
              <div className="font-semibold text-lg">
                {params.approachAngle || params.angle || '45'}° entry angle
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
                <div className="text-xs text-muted-foreground">Asteroid Classification</div>
              </div>
              <div className="font-semibold text-lg">
                {params.asteroidSize || params.size || '100'}m {params.composition || 'rocky'} asteroid
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