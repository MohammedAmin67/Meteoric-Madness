import { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Toggle } from "@/components/ui/toggle";
import { 
  Globe, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Target, 
  RotateCw,
  Camera,
  Settings,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  Shield
} from "lucide-react";

const OrbitalVisualization3D = ({ params, isSimulating, animationTime = 8000 }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const asteroidRef = useRef(null);
  const trailRef = useRef(null);
  const animationRef = useRef(null);
  const earthRef = useRef(null);
  const explosionParticlesRef = useRef([]);
  const atmosphereRef = useRef(null);

  // Enhanced state management
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [cameraMode, setCameraMode] = useState('orbital'); // orbital, follow, cinematic, free
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [qualityLevel, setQualityLevel] = useState('high'); // low, medium, high, ultra

  // Performance monitoring
  const [fps, setFps] = useState(60);
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() });

  // Get responsive dimensions
  const getResponsiveDimensions = useCallback(() => {
    if (!mountRef.current) return { width: 800, height: 600 };
    
    const container = mountRef.current;
    const containerWidth = container.clientWidth;
    
    // Responsive height calculation
    let height;
    if (window.innerWidth < 640) { // mobile
      height = Math.min(400, containerWidth * 0.8);
    } else if (window.innerWidth < 1024) { // tablet
      height = Math.min(500, containerWidth * 0.7);
    } else { // desktop
      height = Math.min(600, containerWidth * 0.65);
    }
    
    return { width: containerWidth, height };
  }, []);

  // Quality settings based on device performance
  const getQualitySettings = useCallback(() => {
    const settings = {
      low: {
        shadowMapSize: 1024,
        particleCount: 1000,
        asteroidDetail: 1,
        earthDetail: 32,
        trailLength: 50,
        explosionParticles: 50
      },
      medium: {
        shadowMapSize: 2048,
        particleCount: 2000,
        asteroidDetail: 2,
        earthDetail: 48,
        trailLength: 100,
        explosionParticles: 100
      },
      high: {
        shadowMapSize: 4096,
        particleCount: 3000,
        asteroidDetail: 3,
        earthDetail: 64,
        trailLength: 150,
        explosionParticles: 200
      },
      ultra: {
        shadowMapSize: 8192,
        particleCount: 5000,
        asteroidDetail: 4,
        earthDetail: 96,
        trailLength: 200,
        explosionParticles: 300
      }
    };
    
    // Auto-detect quality based on device
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    if (isMobile && qualityLevel === 'high') return settings.medium;
    if (isTablet && qualityLevel === 'ultra') return settings.high;
    
    return settings[qualityLevel] || settings.high;
  }, [qualityLevel]);

  // Enhanced scene initialization with professional lighting
  const initializeScene = useCallback(() => {
    if (!mountRef.current) return { scene: null, renderer: null, camera: null };

    const { width, height } = getResponsiveDimensions();
    const quality = getQualitySettings();

    // Scene with enhanced environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000008);
    scene.fog = new THREE.FogExp2(0x000011, 0.00015);

    // Professional camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
    camera.position.set(0, 100, 200);
    camera.lookAt(0, 0, 0);

    // Enhanced renderer with HDR and post-processing
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance",
      logarithmicDepthBuffer: true
    });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.physicallyCorrectLights = true;
    
    mountRef.current.appendChild(renderer.domElement);

    // Professional lighting setup
    const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.1);
    scene.add(ambientLight);

    // Sun light with realistic properties
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(200, 100, 100);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = quality.shadowMapSize;
    sunLight.shadow.mapSize.height = quality.shadowMapSize;
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 1000;
    sunLight.shadow.camera.left = -300;
    sunLight.shadow.camera.right = 300;
    sunLight.shadow.camera.top = 300;
    sunLight.shadow.camera.bottom = -300;
    sunLight.shadow.bias = -0.0001;
    scene.add(sunLight);

    // Rim lighting for dramatic effect
    const rimLight = new THREE.DirectionalLight(0x4a90e2, 0.8);
    rimLight.position.set(-100, -50, 150);
    scene.add(rimLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x6666aa, 0.3);
    fillLight.position.set(50, -100, -50);
    scene.add(fillLight);

    // Enhanced star field with nebula effects
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ 
      size: 2,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    const starsVertices = [];
    const starsColors = [];
    
    for (let i = 0; i < quality.particleCount; i++) {
      // Create star positions in sphere around scene
      const radius = 1000 + Math.random() * 2000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      starsVertices.push(x, y, z);
      
      // Varied star colors (blue giants, white dwarfs, red giants)
      const starType = Math.random();
      if (starType < 0.7) {
        // White/blue stars
        starsColors.push(0.9 + Math.random() * 0.1, 0.9 + Math.random() * 0.1, 1);
      } else if (starType < 0.9) {
        // Yellow stars
        starsColors.push(1, 0.9 + Math.random() * 0.1, 0.7 + Math.random() * 0.2);
      } else {
        // Red giants
        starsColors.push(1, 0.3 + Math.random() * 0.3, 0.1 + Math.random() * 0.2);
      }
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3));
    
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);

    // Professional Earth with realistic textures
    const earthGeometry = new THREE.SphereGeometry(35, quality.earthDetail, quality.earthDetail);
    
    // Create highly detailed Earth texture
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');
    
    // Create Earth base
    const gradient = context.createRadialGradient(400, 300, 0, 512, 512, 512);
    gradient.addColorStop(0, '#4a9eff');    // Ocean blue
    gradient.addColorStop(0.3, '#2563eb');  // Deep ocean
    gradient.addColorStop(0.7, '#1e40af');  // Deeper ocean
    gradient.addColorStop(1, '#1e3a8a');    // Ocean edges
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1024, 1024);
    
    // Add realistic continents
    context.fillStyle = '#059669';
    const continents = [
      // North America
      {x: 200, y: 300, w: 180, h: 120},
      // South America  
      {x: 250, y: 450, w: 80, h: 200},
      // Europe/Africa
      {x: 450, y: 250, w: 120, h: 300},
      // Asia
      {x: 600, y: 200, w: 200, h: 150},
      // Australia
      {x: 700, y: 500, w: 100, h: 60}
    ];
    
    continents.forEach(continent => {
      context.fillRect(continent.x, continent.y, continent.w, continent.h);
      // Add noise for realistic coastlines
      for (let i = 0; i < 50; i++) {
        const x = continent.x + Math.random() * continent.w;
        const y = continent.y + Math.random() * continent.h;
        const size = 5 + Math.random() * 15;
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fill();
      }
    });
    
    // Add ice caps
    context.fillStyle = '#f0f9ff';
    context.fillRect(0, 0, 1024, 100);      // North pole
    context.fillRect(0, 924, 1024, 100);    // South pole
    
    // Add cloud layer
    context.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = 20 + Math.random() * 80;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
    
    const earthTexture = new THREE.CanvasTexture(canvas);
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.RepeatWrapping;
    
    const earthMaterial = new THREE.MeshPhongMaterial({ 
      map: earthTexture,
      shininess: 100,
      transparent: false,
      bumpScale: 0.1
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(0, 0, 0);
    earth.castShadow = true;
    earth.receiveShadow = true;
    scene.add(earth);
    earthRef.current = earth;

    // Enhanced atmosphere with multiple layers
    const atmosphereGeometry = new THREE.SphereGeometry(37, 32, 32);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earth.add(atmosphere);
    atmosphereRef.current = atmosphere;

    // Outer atmosphere glow
    const outerAtmosphereGeometry = new THREE.SphereGeometry(42, 24, 24);
    const outerAtmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x4a90e2,
      transparent: true,
      opacity: 0.05,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const outerAtmosphere = new THREE.Mesh(outerAtmosphereGeometry, outerAtmosphereMaterial);
    earth.add(outerAtmosphere);

    // Enhanced orbital reference system
    const orbitGeometry = new THREE.RingGeometry(120, 122, 128);
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0x475569,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);

    // Add realistic moon with phases
    const moonGeometry = new THREE.SphereGeometry(9, 32, 32);
    const moonMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xcccccc,
      shininess: 10,
      bumpScale: 0.02
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(150, 40, 100);
    moon.castShadow = true;
    moon.receiveShadow = true;
    scene.add(moon);

    // Add space debris for realism
    for (let i = 0; i < 20; i++) {
      const debrisGeometry = new THREE.SphereGeometry(0.5 + Math.random() * 1, 6, 6);
      const debrisMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x666666,
        transparent: true,
        opacity: 0.6
      });
      const debris = new THREE.Mesh(debrisGeometry, debrisMaterial);
      
      const distance = 80 + Math.random() * 100;
      const angle = Math.random() * Math.PI * 2;
      debris.position.set(
        Math.cos(angle) * distance,
        (Math.random() - 0.5) * 60,
        Math.sin(angle) * distance
      );
      scene.add(debris);
    }

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    return { scene, renderer, camera };
  }, [getResponsiveDimensions, getQualitySettings]);

  // Enhanced asteroid creation with realistic physics
  const createAsteroid = useCallback((scene, params) => {
    if (!scene || !params) return null;

    const quality = getQualitySettings();
    const baseSize = parseFloat(params.asteroidSize || params.size) || 100;
    const size = Math.max(2, Math.min(25, baseSize / 10));
    
    // Composition-based realistic materials
    const compositionMaterials = {
      rock: new THREE.MeshPhongMaterial({ 
        color: 0x8b5cf6, 
        shininess: 20,
        transparent: false,
        roughness: 0.9,
        bumpScale: 0.3
      }),
      metal: new THREE.MeshPhongMaterial({ 
        color: 0x6b7280, 
        shininess: 150,
        reflectivity: 0.4,
        metalness: 0.8
      }),
      ice: new THREE.MeshPhongMaterial({ 
        color: 0x22d3ee, 
        shininess: 120,
        transparent: true,
        opacity: 0.9,
        refractionRatio: 0.9
      }),
      mixed: new THREE.MeshPhongMaterial({ 
        color: 0xf97316, 
        shininess: 60,
        bumpScale: 0.2
      })
    };

    const material = compositionMaterials[params.composition] || compositionMaterials.rock;
    
    // Create highly irregular asteroid shape
    const geometry = new THREE.IcosahedronGeometry(size, quality.asteroidDetail);
    
    // Advanced surface deformation for realism
    const positions = geometry.attributes.position;
    const vertex = new THREE.Vector3();
    
    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i);
      
      // Multiple noise layers for realistic surface
      const noise1 = (Math.sin(vertex.x * 0.1) + Math.cos(vertex.y * 0.1)) * 0.3;
      const noise2 = (Math.sin(vertex.x * 0.3) + Math.cos(vertex.z * 0.3)) * 0.2;
      const noise3 = Math.random() * 0.1;
      
      const deformation = 0.6 + noise1 + noise2 + noise3;
      vertex.multiplyScalar(deformation);
      
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    positions.needsUpdate = true;
    geometry.computeVertexNormals();

    const asteroid = new THREE.Mesh(geometry, material);
    asteroid.castShadow = true;
    asteroid.receiveShadow = true;

    // Enhanced velocity-based effects
    const velocity = parseFloat(params.velocity) || 20;
    
    // Atmospheric heating glow
    if (velocity > 10) {
      const glowIntensity = Math.min(1, velocity / 50);
      const glowGeometry = new THREE.SphereGeometry(size + (velocity / 8), 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.1 - glowIntensity * 0.1, 1, 0.5),
        transparent: true,
        opacity: glowIntensity * 0.6,
        blending: THREE.AdditiveBlending
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      asteroid.add(glow);
    }

    // Plasma trail for high-velocity asteroids
    if (velocity > 25) {
      const trailGeometry = new THREE.ConeGeometry(size / 3, size * 3, 8);
      const trailMaterial = new THREE.MeshBasicMaterial({
        color: 0xff2244,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
      });
      const trail = new THREE.Mesh(trailGeometry, trailMaterial);
      trail.position.z = size * 2;
      trail.rotation.x = Math.PI;
      asteroid.add(trail);
    }

    // Add surface details for close-up views
    const detailGeometry = new THREE.SphereGeometry(size * 0.3, 8, 8);
    const detailMaterial = new THREE.MeshBasicMaterial({
      color: material.color,
      transparent: true,
      opacity: 0.8
    });
    
    for (let i = 0; i < 5; i++) {
      const detail = new THREE.Mesh(detailGeometry, detailMaterial);
      detail.position.set(
        (Math.random() - 0.5) * size,
        (Math.random() - 0.5) * size,
        (Math.random() - 0.5) * size
      );
      detail.scale.setScalar(0.2 + Math.random() * 0.3);
      asteroid.add(detail);
    }

    scene.add(asteroid);
    asteroidRef.current = asteroid;

    return asteroid;
  }, [getQualitySettings]);

  // Enhanced trail system with particle physics
  const createTrail = useCallback((scene) => {
    if (!scene) return null;
    
    const trailMaterial = new THREE.LineBasicMaterial({
      color: 0xff6b35,
      transparent: true,
      opacity: 0.9,
      linewidth: 3,
      blending: THREE.AdditiveBlending
    });

    const trailGeometry = new THREE.BufferGeometry();
    const trailPoints = [];
    
    trailGeometry.setAttribute('position', new THREE.Float32BufferAttribute(trailPoints, 3));
    const trail = new THREE.Line(trailGeometry, trailMaterial);
    
    scene.add(trail);
    trailRef.current = trail;
    
    return trail;
  }, []);

  // Advanced trajectory calculation with orbital mechanics
  const calculateTrajectory = useCallback((params) => {
    if (!params) return { start: new THREE.Vector3(), end: new THREE.Vector3() };

    const angle = ((parseFloat(params.approachAngle || params.angle) || 45) * Math.PI) / 180;
    const velocity = parseFloat(params.velocity) || 20;
    const size = parseFloat(params.asteroidSize || params.size) || 100;
    
    // Realistic approach distance based on detection capabilities
    const startDistance = Math.max(300, size * 2 + velocity * 5);
    
    // Calculate entry point considering Earth's gravitational influence
    const start = new THREE.Vector3(
      Math.cos(angle) * startDistance,
      Math.sin(angle) * startDistance * 0.4,
      Math.sin(angle + Math.PI/6) * startDistance * 0.8
    );
    
    // Impact point with slight gravitational bending
    const gravitationalBend = velocity < 20 ? 0.1 : 0.05;
    const end = new THREE.Vector3(
      Math.cos(angle + Math.PI + gravitationalBend) * 36,
      Math.sin(angle + Math.PI + gravitationalBend) * 20,
      Math.sin(angle + Math.PI + gravitationalBend/2) * 36
    );

    return { start, end };
  }, []);

  // Spectacular impact effect with realistic physics
  const showImpactEffect = useCallback(() => {
    if (!sceneRef.current || !earthRef.current) return;

    const quality = getQualitySettings();
    const velocity = parseFloat(params?.velocity) || 20;
    const size = parseFloat(params?.asteroidSize || params?.size) || 100;
    
    // Calculate explosion intensity
    const explosionIntensity = Math.min(5, (velocity * size) / 1000);
    
    // Multiple explosion layers with realistic physics
    const explosionLayers = [
      { color: 0xffffff, size: 1, opacity: 1.0, duration: 1000 },
      { color: 0xffaa44, size: 2, opacity: 0.8, duration: 1500 },
      { color: 0xff4444, size: 3, opacity: 0.6, duration: 2000 },
      { color: 0xaa2222, size: 4, opacity: 0.4, duration: 2500 }
    ];
    
    explosionLayers.forEach((layer, layerIndex) => {
      const particleCount = Math.min(quality.explosionParticles, 50 + layerIndex * 25);
      
      for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(
          (1 + layerIndex) * explosionIntensity, 
          8, 8
        );
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          blending: THREE.AdditiveBlending
        });

        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        
        // Realistic explosion distribution
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 40 + layerIndex * 15 + Math.random() * 20;
        const height = (Math.random() - 0.5) * 30;
        
        particle.position.set(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        );
        
        sceneRef.current.add(particle);
        explosionParticlesRef.current.push(particle);

        // Advanced particle physics animation
        const startTime = Date.now();
        const initialScale = particle.scale.x;
        const velocity = new THREE.Vector3(
          (Math.random() - 0.5) * explosionIntensity,
          Math.random() * explosionIntensity,
          (Math.random() - 0.5) * explosionIntensity
        );

        const animateParticle = () => {
          const elapsed = Date.now() - startTime;
          const progress = elapsed / layer.duration;
          
          if (progress < 1) {
            // Physics-based motion with gravity
            particle.position.add(velocity.clone().multiplyScalar(0.1));
            velocity.y -= 0.05; // Gravity
            velocity.multiplyScalar(0.98); // Air resistance
            
            // Scale and fade
            const scale = initialScale * (1 + progress * (3 + layerIndex));
            particle.scale.setScalar(scale);
            particle.material.opacity = layer.opacity * (1 - progress);
            
            // Rotation for realism
            particle.rotation.x += 0.02;
            particle.rotation.y += 0.03;
            particle.rotation.z += 0.01;
            
            requestAnimationFrame(animateParticle);
          } else {
            sceneRef.current.remove(particle);
            const index = explosionParticlesRef.current.indexOf(particle);
            if (index > -1) explosionParticlesRef.current.splice(index, 1);
          }
        };
        
        setTimeout(animateParticle, layerIndex * 100);
      }
    });

    // Enhanced Earth shake with realistic physics
    const originalPosition = earthRef.current.position.clone();
    const originalRotation = earthRef.current.rotation.clone();
    let shakeCount = 0;
    const maxShakes = 30;
    const shakeIntensity = Math.min(15, explosionIntensity * 3);
    
    const shake = () => {
      if (shakeCount < maxShakes) {
        const intensity = (maxShakes - shakeCount) / maxShakes * shakeIntensity;
        const frequency = 1 + shakeCount * 0.1;
        
        earthRef.current.position.x = originalPosition.x + 
          Math.sin(shakeCount * frequency) * intensity * 0.3;
        earthRef.current.position.y = originalPosition.y + 
          Math.cos(shakeCount * frequency * 1.3) * intensity * 0.2;
        earthRef.current.position.z = originalPosition.z + 
          Math.sin(shakeCount * frequency * 0.7) * intensity * 0.1;
        
        earthRef.current.rotation.x = originalRotation.x + 
          (Math.random() - 0.5) * 0.01 * intensity;
        earthRef.current.rotation.z = originalRotation.z + 
          (Math.random() - 0.5) * 0.01 * intensity;
        
        shakeCount++;
        setTimeout(shake, 16); // 60fps shake
      } else {
        earthRef.current.position.copy(originalPosition);
        earthRef.current.rotation.copy(originalRotation);
      }
    };
    shake();

    // Atmospheric flash effect
    if (atmosphereRef.current) {
      const originalOpacity = atmosphereRef.current.material.opacity;
      let flashCount = 0;
      
      const flash = () => {
        if (flashCount < 10) {
          atmosphereRef.current.material.opacity = 
            originalOpacity + (Math.sin(flashCount * 2) * 0.3);
          flashCount++;
          setTimeout(flash, 50);
        } else {
          atmosphereRef.current.material.opacity = originalOpacity;
        }
      };
      flash();
    }
  }, [getQualitySettings, params]);

  // Advanced animation system with multiple camera modes
  const startAnimation = useCallback(() => {
    if (!sceneRef.current || !asteroidRef.current || !params) return;

    setIsPlaying(true);
    setCurrentTime(0);

    const { start, end } = calculateTrajectory(params);
    asteroidRef.current.position.copy(start);

    const velocity = parseFloat(params.velocity) || 20;
    const baseAnimationTime = animationTime / playbackSpeed;
    const duration = Math.max(3000, baseAnimationTime / Math.max(1, velocity / 20));

    const startTime = Date.now();
    const trailPoints = [];
    const quality = getQualitySettings();

    // Camera animation setup
    const originalCameraPos = cameraRef.current.position.clone();
    const originalCameraTarget = new THREE.Vector3(0, 0, 0);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setCurrentTime(progress * 100);

      // Advanced asteroid motion with realistic physics
      const currentPos = start.clone().lerp(end, progress);
      
      // Add gravitational curve for realism
      if (progress > 0.3) {
        const gravityInfluence = (progress - 0.3) / 0.7;
        currentPos.y -= gravityInfluence * 10;
      }
      
      asteroidRef.current.position.copy(currentPos);

      // Enhanced rotation with tumbling based on composition
      const rotationSpeed = 0.02 * (1 + velocity / 30);
      const tumbleEffect = params.composition === 'mixed' ? 1.5 : 1;
      
      asteroidRef.current.rotation.x += rotationSpeed * tumbleEffect;
      asteroidRef.current.rotation.y += rotationSpeed * 1.3 * tumbleEffect;
      asteroidRef.current.rotation.z += rotationSpeed * 0.7 * tumbleEffect;

      // Advanced camera system
      switch (cameraMode) {
        case 'follow':
          if (progress > 0.2 && progress < 0.9) {
            const followPos = currentPos.clone().add(new THREE.Vector3(60, 40, 100));
            cameraRef.current.position.lerp(followPos, 0.03);
            cameraRef.current.lookAt(currentPos);
          }
          break;
          
        case 'cinematic':
          if (progress < 0.3) {
            // Wide establishing shot
            const cinematicPos = new THREE.Vector3(0, 150, 300);
            cameraRef.current.position.lerp(cinematicPos, 0.02);
            cameraRef.current.lookAt(currentPos);
          } else if (progress < 0.7) {
            // Follow shot
            const followPos = currentPos.clone().add(new THREE.Vector3(80, 30, 120));
            cameraRef.current.position.lerp(followPos, 0.04);
            cameraRef.current.lookAt(currentPos);
          } else {
            // Impact close-up
            const closePos = new THREE.Vector3(20, 20, 80);
            cameraRef.current.position.lerp(closePos, 0.06);
            cameraRef.current.lookAt(0, 0, 0);
          }
          break;
          
        case 'free':
          // User can control manually
          break;
          
        default: // orbital
          if (progress > 0.4 && progress < 0.8) {
            const orbitalRadius = 180;
            const orbitalSpeed = 0.02;
            const angle = Date.now() * orbitalSpeed * 0.001;
            cameraRef.current.position.x = Math.cos(angle) * orbitalRadius;
            cameraRef.current.position.z = Math.sin(angle) * orbitalRadius;
            cameraRef.current.lookAt(currentPos);
          }
          break;
      }

      // Enhanced trail system with physics
      if (progress > 0.05) {
        trailPoints.push(currentPos.x, currentPos.y, currentPos.z);
        
        const maxTrailLength = quality.trailLength;
        if (trailPoints.length > maxTrailLength * 3) {
          trailPoints.splice(0, 3);
        }
        
        if (trailRef.current) {
          trailRef.current.geometry.setAttribute('position', 
            new THREE.Float32BufferAttribute(trailPoints, 3));
          trailRef.current.geometry.attributes.position.needsUpdate = true;
        }
      }

      // Update FPS counter
      fpsCounterRef.current.frames++;
      const now = Date.now();
      if (now - fpsCounterRef.current.lastTime >= 1000) {
        setFps(fpsCounterRef.current.frames);
        fpsCounterRef.current.frames = 0;
        fpsCounterRef.current.lastTime = now;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
        showImpactEffect();
        
        // Camera reset with smooth transition
        setTimeout(() => {
          const resetCamera = () => {
            cameraRef.current.position.lerp(originalCameraPos, 0.05);
            cameraRef.current.lookAt(originalCameraTarget);
            if (cameraRef.current.position.distanceTo(originalCameraPos) > 2) {
              requestAnimationFrame(resetCamera);
            }
          };
          resetCamera();
        }, 2000);
      }
    };

    animate();
  }, [params, animationTime, playbackSpeed, calculateTrajectory, showImpactEffect, cameraMode, getQualitySettings]);

  const pauseAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsPlaying(false);
  }, []);

  const resetAnimation = useCallback(() => {
    pauseAnimation();
    setCurrentTime(0);
    
    // Clear explosion particles
    explosionParticlesRef.current.forEach(particle => {
      sceneRef.current?.remove(particle);
    });
    explosionParticlesRef.current = [];
    
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
      cameraRef.current.position.set(0, 100, 200);
      cameraRef.current.lookAt(0, 0, 0);
    }
  }, [pauseAnimation, calculateTrajectory, params]);

  // Enhanced render loop with performance monitoring
  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    let frameId;
    
    const render = () => {
      // Earth rotation
      if (earthRef.current) {
        earthRef.current.rotation.y += 0.001;
      }

      // Auto-rotate camera when enabled and not playing
      if (isAutoRotate && cameraRef.current && !isPlaying && cameraMode === 'orbital') {
        const radius = 200;
        const time = Date.now() * 0.0002;
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
  }, [isAutoRotate, isPlaying, cameraMode]);

  // Enhanced responsive resize handler
  useEffect(() => {
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const { width, height } = getResponsiveDimensions();
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
      
      // Auto-adjust quality on mobile
      if (width < 768 && qualityLevel === 'ultra') {
        setQualityLevel('medium');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getResponsiveDimensions, qualityLevel]);

  // Initialize scene
  useEffect(() => {
    const result = initializeScene();
    if (result.scene) {
      createTrail(result.scene);
    }
    
    // Store the mount node reference to prevent stale closure
    const currentMount = mountRef.current;
    
    return () => {
      if (currentMount && result.renderer && 
          currentMount.contains(result.renderer.domElement)) {
        currentMount.removeChild(result.renderer.domElement);
      }
      result.renderer?.dispose();
    };
  }, [initializeScene, createTrail]);

  // Update asteroid when params change
  useEffect(() => {
    if (!sceneRef.current || !params) return;

    if (asteroidRef.current) {
      sceneRef.current.remove(asteroidRef.current);
    }

    createAsteroid(sceneRef.current, params);
    
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

  // Utility functions
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
    if (vel < 15) return { color: 'bg-mission-green', text: 'SLOW' };
    if (vel < 30) return { color: 'bg-plasma-orange', text: 'MODERATE' };
    if (vel < 50) return { color: 'bg-destructive', text: 'FAST' };
    return { color: 'bg-destructive', text: 'EXTREME' };
  }, []);

  return (
    <Card className="bg-card/60 backdrop-blur-xl border border-quantum-blue/30 shadow-command relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-16 h-16 sm:w-32 sm:h-32 bg-quantum-blue rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-4 left-4 w-12 h-12 sm:w-24 sm:h-24 bg-stellar-cyan rounded-full blur-2xl animate-float-gentle" />
      </div>

      <CardHeader className="relative z-10 pb-3 sm:pb-4 px-3 sm:px-6">
        <CardTitle className="flex flex-col space-y-3 sm:space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-quantum shadow-command animate-pulse-glow">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-base sm:text-lg lg:text-xl font-bold text-quantum-blue tracking-wide break-words">
                  ADVANCED ORBITAL SIMULATION
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 flex-wrap gap-1">
              <Badge 
                className="text-white border-0 text-xs flex-shrink-0"
                style={{ backgroundColor: getCompositionColor(params?.composition) }}
              >
                {params?.composition?.toUpperCase() || 'ROCK'}
              </Badge>
              {showDebugInfo && (
                <Badge variant="outline" className="text-xs text-mission-green border-mission-green/30">
                  {fps} FPS
                </Badge>
              )}
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 relative z-10 px-3 sm:px-6">
        {/* Enhanced 3D Visualization Container */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 rounded-lg border border-quantum-blue/30 overflow-hidden shadow-inner">
          <div 
            ref={mountRef} 
            className="w-full transition-all duration-300"
            style={{ 
              minHeight: window.innerWidth < 640 ? '300px' : '400px',
              height: window.innerWidth < 640 ? '400px' : 
                     window.innerWidth < 1024 ? '500px' : '600px'
            }}
          />
          
          {/* Enhanced Control Overlay */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col space-y-2">
            <div className="flex space-x-1 sm:space-x-2">
              <Toggle
                pressed={isAutoRotate}
                onPressedChange={setIsAutoRotate}
                className="bg-background/20 backdrop-blur-sm border-quantum-blue/30 w-8 h-8 sm:w-10 sm:h-10"
                size="sm"
              >
                <RotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
              </Toggle>
              
              <Toggle
                pressed={showDebugInfo}
                onPressedChange={setShowDebugInfo}
                className="bg-background/20 backdrop-blur-sm border-quantum-blue/30 w-8 h-8 sm:w-10 sm:h-10"
                size="sm"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              </Toggle>
            </div>
            
            <div className="flex space-x-1 sm:space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="bg-background/20 backdrop-blur-sm border border-quantum-blue/30 w-8 h-8 sm:w-10 sm:h-10 p-0"
                onClick={() => setCameraMode(cameraMode === 'orbital' ? 'follow' : 
                                          cameraMode === 'follow' ? 'cinematic' : 'orbital')}
              >
                <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              
              <Toggle
                pressed={audioEnabled}
                onPressedChange={setAudioEnabled}
                className="bg-background/20 backdrop-blur-sm border-quantum-blue/30 w-8 h-8 sm:w-10 sm:h-10"
                size="sm"
              >
                {audioEnabled ? 
                  <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" /> : 
                  <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" />
                }
              </Toggle>
            </div>
          </div>

          {/* Status and Info Overlay */}
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 space-y-2">
            <div className="bg-background/20 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 border border-quantum-blue/20">
              <div className="text-xs text-muted-foreground">
                {isPlaying ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                    <span className="hidden sm:inline">IMPACT TRAJECTORY ACTIVE</span>
                    <span className="sm:hidden">ACTIVE</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-mission-green rounded-full" />
                    <span className="hidden sm:inline">READY FOR SIMULATION</span>
                    <span className="sm:hidden">READY</span>
                  </span>
                )}
              </div>
            </div>
            
            {showDebugInfo && (
              <div className="bg-background/20 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 border border-quantum-blue/20">
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Camera: {cameraMode.toUpperCase()}</div>
                  <div>Quality: {qualityLevel.toUpperCase()}</div>
                  <div>FPS: {fps}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Progress and Controls */}
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Impact Progress</span>
              <span className="font-mono font-bold text-quantum-blue">
                {currentTime.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={currentTime} 
              className="h-2 sm:h-3 bg-muted/30"
            />
            {currentTime > 0 && currentTime < 100 && (
              <div className="text-xs text-center text-muted-foreground font-mono">
                T-{((100 - currentTime) / 100 * (animationTime / 1000 / playbackSpeed)).toFixed(1)}s to impact
              </div>
            )}
          </div>

          {/* Advanced Controls */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button
                onClick={isPlaying ? pauseAnimation : startAnimation}
                disabled={!params}
                className="bg-gradient-quantum hover:shadow-command hover:scale-105 transition-all duration-300 h-10 sm:h-12 px-4 sm:px-6 font-semibold"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="hidden sm:inline">PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="hidden sm:inline">BEGIN IMPACT</span>
                    <span className="sm:hidden">IMPACT</span>
                  </>
                )}
              </Button>
              
              <Button
                onClick={resetAnimation}
                disabled={!params}
                variant="outline"
                className="backdrop-blur-sm h-10 sm:h-12 px-3 sm:px-4"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">RESET</span>
              </Button>

              {/* Speed Control */}
              <div className="hidden sm:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPlaybackSpeed(Math.max(0.25, playbackSpeed - 0.25))}
                  className="w-8 h-8 p-0"
                >
                  <Rewind className="w-3 h-3" />
                </Button>
                <span className="text-xs font-mono">{playbackSpeed}x</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPlaybackSpeed(Math.min(4, playbackSpeed + 0.25))}
                  className="w-8 h-8 p-0"
                >
                  <FastForward className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
              {isPlaying ? 
                'Asteroid approaching Earth...' : 
                'Configure parameters and run simulation'
              }
            </div>
          </div>
        </div>

        {/* Enhanced Trajectory Information */}
        {params && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 bg-card/40 backdrop-blur-sm rounded-lg border border-quantum-blue/20">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-plasma-orange animate-pulse-glow" />
                <div className="text-xs text-muted-foreground">Approach Vector</div>
              </div>
              <div className="font-semibold text-sm sm:text-base break-words">
                {params.approachAngle || params.angle || '45'}° entry angle
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-stellar-cyan animate-pulse-glow" />
                <div className="text-xs text-muted-foreground">Impact Velocity</div>
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-sm sm:text-base">
                  {params.velocity || '20'} km/s
                </div>
                <Badge className={`${getVelocityBadge(params.velocity).color} text-white text-xs w-fit`}>
                  {getVelocityBadge(params.velocity).text}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-quantum-blue animate-pulse-glow" />
                <div className="text-xs text-muted-foreground">Threat Classification</div>
              </div>
              <div className="font-semibold text-sm sm:text-base break-words">
                {params.asteroidSize || params.size || '100'}m {params.composition || 'rocky'} asteroid
              </div>
            </div>
          </div>
        )}

        {/* Quality and Camera Controls (Mobile Responsive) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Camera Mode</label>
            <div className="grid grid-cols-2 gap-1">
              {['orbital', 'follow', 'cinematic', 'free'].map((mode) => (
                <Button
                  key={mode}
                  variant={cameraMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCameraMode(mode)}
                  className={`text-xs h-8 ${cameraMode === mode ? 'bg-gradient-quantum' : ''}`}
                >
                  {mode.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Quality Level</label>
            <div className="grid grid-cols-2 gap-1">
              {['low', 'medium', 'high', 'ultra'].map((quality) => (
                <Button
                  key={quality}
                  variant={qualityLevel === quality ? "default" : "outline"}
                  size="sm"
                  onClick={() => setQualityLevel(quality)}
                  className={`text-xs h-8 ${qualityLevel === quality ? 'bg-gradient-quantum' : ''}`}
                >
                  {quality.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>
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