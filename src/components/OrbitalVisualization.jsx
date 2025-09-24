import React from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Toggle } from "@/components/ui/toggle";
import { 
  Globe, 
  Zap, 
  Target, 
  RotateCw,
  Camera,
  Settings,
  Minimize,
  Maximize,
  Shield,
  Eye,
  Gauge
} from "lucide-react";

const OrbitalVisualization3D = ({ params, isSimulating, animationTime = 8000, showDebugInfo, setShowDebugInfo, onAnimationEnd }) => {

  const fullscreenContainerRef = useRef(null);

  const mountRef = useRef(null);

  const sceneRef = useRef(null);

  const rendererRef = useRef(null);

  const cameraRef = useRef(null);

  const asteroidRef = useRef(null);

  const trailRef = useRef(null);

  const animationRef = useRef(null);

  const earthRef = useRef(null);

  const explosionParticlesRef = useRef([]);

  const shockwaveRef = useRef(null);

  const atmosphereRef = useRef(null);

  const moonRef = useRef(null);

  // OrbitControls instance
  const controlsRef = useRef(null);

  // Enhanced state management
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [cameraMode, setCameraMode] = useState('orbital'); // orbital, follow, cinematic
  const [qualityLevel, setQualityLevel] = useState('high'); // medium, high, ultra
  const [texturesLoaded, setTexturesLoaded] = useState(false);

  // State to track if the user is interacting with the canvas
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Performance monitoring
  const [fps, setFps] = useState(60);
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() });

  // Track if simulation has already been started for current params
  const lastSimulationParamsRef = useRef(null);

  // Texture loading cache
  const texturesRef = useRef({});

  // Get responsive dimensions that perfectly fit the container
  const getResponsiveDimensions = useCallback(() => {
    if (!mountRef.current) return { width: 800, height: 600 };
    
    const container = mountRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width || container.clientWidth;
    const containerHeight = containerRect.height || container.clientHeight;
    
    // Use exact container dimensions to prevent gaps
    return { 
      width: Math.floor(containerWidth), 
      height: Math.floor(containerHeight) 
    };
  }, []);

  // Quality settings optimized for performance
  const getQualitySettings = useCallback(() => {
    const settings = {
      medium: {
        shadowMapSize: 2048,
        particleCount: 1000,
        asteroidDetail: 5,
        earthDetail: 48,
        trailLength: 60,
        explosionParticles: 50,
        enableShadows: true,
        antialiasing: true
      },
      high: {
        shadowMapSize: 4096,
        particleCount: 2000,
        asteroidDetail: 6,
        earthDetail: 64,
        trailLength: 100,
        explosionParticles: 100,
        enableShadows: true,
        antialiasing: true
      },
      ultra: {
        shadowMapSize: 8192,
        particleCount: 3000,
        asteroidDetail: 7,
        earthDetail: 96,
        trailLength: 150,
        explosionParticles: 150,
        enableShadows: true,
        antialiasing: true
      }
    };
    
    // Auto-adjust quality based on device capabilities
    const isMobile = window.innerWidth < 768;
    
    if (isMobile && qualityLevel === 'ultra') return settings.high;
    
    return settings[qualityLevel] || settings.high;
  }, [qualityLevel]);

  // Realistic textures 
 const loadTextures = useCallback(() => {
  const basePath = import.meta.env.BASE_URL;

  return new Promise((resolve) => {
    const loader = new THREE.TextureLoader();
    
    const textures = {};
    let loadedCount = 0;
    const totalTextures = 8;

    const checkComplete = () => {
      loadedCount++;
      if (loadedCount === totalTextures) {
        Object.values(textures).forEach(texture => {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.anisotropy = 16;
        });
        texturesRef.current = textures;
        setTexturesLoaded(true);
        resolve(textures);
      }
    };

    // Prepending basePath to each texture path
    loader.load(
      `${basePath}textures/2k_earth_daymap.jpg`,
      (texture) => { textures.earthDay = texture; checkComplete(); },
      undefined,
      (error) => { console.warn('Earth daymap failed to load:', error); checkComplete(); }
    );

    loader.load(
      `${basePath}textures/2k_earth_nightmap.jpg`,
      (texture) => {
        textures.earthNight = texture;
        checkComplete();
      },
      undefined,
      (error) => {
        console.warn('Earth night map failed to load:', error);
        checkComplete();
      }
    );

    loader.load(
      `${basePath}textures/2k_earth_normal_map.jpg`,
      (texture) => { textures.earthNormal = texture; checkComplete(); },
      undefined,
      (error) => { console.warn('Earth normal map failed to load:', error); checkComplete(); }
    );

    loader.load(
      `${basePath}textures/2k_earth_specular_map.jpg`,
      (texture) => { textures.earthSpecular = texture; checkComplete(); },
      undefined,
      (error) => { console.warn('Earth specular map failed to load:', error); checkComplete(); }
    );

    loader.load(
      `${basePath}textures/2k_earth_clouds.jpg`,
      (texture) => { textures.earthClouds = texture; checkComplete(); },
      undefined,
      (error) => { console.warn('Earth clouds failed to load:', error); checkComplete(); }
    );
    
    loader.load(
      `${basePath}textures/2k_moon.jpg`,
      (texture) => { textures.moon = texture; checkComplete(); },
      undefined,
      (error) => { console.warn('Moon texture failed to load:', error); checkComplete(); }
    );
    
    loader.load(
      `${basePath}textures/2k_stars_milky_way.jpg`,
      (texture) => { textures.stars = texture; checkComplete(); },
      undefined,
      (error) => { console.warn('Stars texture failed to load:', error); checkComplete(); }
    );

    loader.load(
      `${basePath}textures/ground_0010_color_2k.jpg`,
      (texture) => {
        textures.asteroid = texture;
        checkComplete();
      },
      undefined,
      (error) => {
        console.warn('Asteroid texture failed to load:', error);
        checkComplete();
      }
    );
  });
}, []);

  // Enhanced scene initialization with proper texture loading
  const initializeScene = useCallback(async () => {
    if (!mountRef.current) return { scene: null, renderer: null, camera: null };

    const { width, height } = getResponsiveDimensions();
    const quality = getQualitySettings();

    // Clean up existing renderer
    if (rendererRef.current) {
      rendererRef.current.dispose();
      if (mountRef.current.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    }

    // Load textures first and wait for completion
    const textures = await loadTextures();

    // Scene with proper space environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000011); // Dark space fallback

    // Professional camera setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 5000);
    camera.position.set(0, 80, 180);
    camera.lookAt(0, 0, 0);

    // Enhanced renderer with exact container fitting
    const renderer = new THREE.WebGLRenderer({ 
      antialias: quality.antialiasing,
      alpha: false,
      powerPreference: "high-performance",
      stencil: false,
      depth: true
    });
    
    renderer.setSize(width, height, false); // Prevent CSS styling
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = quality.enableShadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0; // Adjusted for better lighting
    
    // Ensure renderer canvas fits exactly
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    
    mountRef.current.appendChild(renderer.domElement);

    // MODIFICATION: Initialize OrbitControls for free navigation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 45; // Prevent zooming inside the Earth
    controls.maxDistance = 600; // Prevent zooming too far out
    controls.enablePan = true;
    controlsRef.current = controls;

    // MODIFICATION: Add event listeners to detect user interaction to pause auto-rotation
    controls.addEventListener('start', () => setIsUserInteracting(true));
    controls.addEventListener('end', () => setIsUserInteracting(false));

    // Create realistic starscape sphere (NOT scene.background)
    if (textures.stars) {
      const starsGeometry = new THREE.SphereGeometry(2000, 64, 64);
      const starsMaterial = new THREE.MeshBasicMaterial({
        map: textures.stars,
        side: THREE.BackSide, // Render inside of sphere
        fog: false
      });
      const starSphere = new THREE.Mesh(starsGeometry, starsMaterial);
      scene.add(starSphere);
    }

    // Enhanced lighting setup for proper illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3); // Increased ambient
    scene.add(ambientLight);

    // Main sun light (enhanced and properly positioned)
    const sunLight = new THREE.DirectionalLight(0xffffff, 3.0); // Increased intensity
    sunLight.position.set(200, 100, 100);
    if (quality.enableShadows) {
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
    }
    scene.add(sunLight);

    // Additional fill lighting for better visibility
    const fillLight = new THREE.DirectionalLight(0x4a90e2, 0.8);
    fillLight.position.set(-100, -50, 150);
    scene.add(fillLight);

    // Rim light for atmospheric effect
    const rimLight = new THREE.DirectionalLight(0x6666aa, 0.5);
    rimLight.position.set(50, -100, -50);
    scene.add(rimLight);

    // Realistic Earth with FIXED materials (only after textures loaded)
    const earthGeometry = new THREE.SphereGeometry(30, quality.earthDetail, quality.earthDetail);
    
    const earthMaterial = new THREE.MeshPhongMaterial({ 
      map: textures.earthDay || null,           // Day texture
      normalMap: textures.earthNormal || null,
      specularMap: textures.earthSpecular || null,
      shininess: 100,
      specular: 0x111111,

      // Night Map
      emissiveMap: textures.earthNight || null, 
      emissive: new THREE.Color(0xffffff),      
      emissiveIntensity: 1.0                  
    });
    
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(0, 0, 0);
    if (quality.enableShadows) {
      earth.castShadow = true;
      earth.receiveShadow = true;
    }
    scene.add(earth);
    earthRef.current = earth;

    // Realistic cloud layer (only if texture loaded)
    if (textures.earthClouds) {
      const cloudsGeometry = new THREE.SphereGeometry(30.5, quality.earthDetail, quality.earthDetail);
      const cloudsMaterial = new THREE.MeshLambertMaterial({
        map: textures.earthClouds,
        transparent: true,
        opacity: 0.4,
        blending: THREE.NormalBlending // Changed from AdditiveBlending
      });
      const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
      earth.add(clouds);
    }

    // Multi-layered atmosphere (enhanced for realism)
    const atmosphereGeometry = new THREE.SphereGeometry(32, 32, 32);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x44aaff,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earth.add(atmosphere);
    atmosphereRef.current = atmosphere;

    // Outer atmosphere glow
    const outerAtmosphereGeometry = new THREE.SphereGeometry(36, 24, 24);
    const outerAtmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x2288dd,
      transparent: true,
      opacity: 0.03,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const outerAtmosphere = new THREE.Mesh(outerAtmosphereGeometry, outerAtmosphereMaterial);
    earth.add(outerAtmosphere);

    // Orbital reference grid
    const orbitGeometry = new THREE.RingGeometry(90, 91, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0x444466,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);

    // FIXED Moon material (only color map, no bump map)
    const moonGeometry = new THREE.SphereGeometry(8, 32, 32);
    const moonMaterial = new THREE.MeshPhongMaterial({ 
      map: textures.moon || null, // ONLY use as color map
      shininess: 5,
      specular: 0x111111
      // REMOVED: bumpMap and bumpScale (these were causing black moon)
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    // Sets initial position to be on the orbit ring (radius 90)
    moon.position.set(90, 0, 0); 
    if (quality.enableShadows) {
      moon.castShadow = true;
      moon.receiveShadow = true;
    }
    scene.add(moon);
    moonRef.current = moon; 

    // Enhanced particle stars for depth (reduced since we have background sphere)
    const particleStarsGeometry = new THREE.BufferGeometry();
    const particleStarsMaterial = new THREE.PointsMaterial({ 
      size: 1.2,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });

    const starsVertices = [];
    const starsColors = [];
    
    for (let i = 0; i < quality.particleCount / 4; i++) { // Further reduced
      // Create realistic star distribution
      const radius = 800 + Math.random() * 1000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      starsVertices.push(x, y, z);
      
      // Realistic star colors
      const starType = Math.random();
      if (starType < 0.6) {
        starsColors.push(0.9 + Math.random() * 0.1, 0.9 + Math.random() * 0.1, 1);
      } else if (starType < 0.85) {
        starsColors.push(1, 0.95, 0.8 + Math.random() * 0.2);
      } else {
        starsColors.push(1, 0.4 + Math.random() * 0.3, 0.2 + Math.random() * 0.2);
      }
    }
    
    if (starsVertices.length > 0) {
      particleStarsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      particleStarsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3));
      
      const particleStarField = new THREE.Points(particleStarsGeometry, particleStarsMaterial);
      scene.add(particleStarField);
    }

    // Add space debris for realism (reduced for performance)
    if (quality.particleCount > 1000) {
      for (let i = 0; i < 12; i++) {
        const debrisGeometry = new THREE.SphereGeometry(0.3 + Math.random() * 0.5, 6, 6);
        const debrisMaterial = new THREE.MeshBasicMaterial({ 
          color: 0x555555,
          transparent: true,
          opacity: 0.7
        });
        const debris = new THREE.Mesh(debrisGeometry, debrisMaterial);
        
        const distance = 60 + Math.random() * 80;
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 40;
        
        debris.position.set(
          Math.cos(angle) * distance,
          height,
          Math.sin(angle) * distance
        );
        scene.add(debris);
      }
    }

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    return { scene, renderer, camera };
  }, [getResponsiveDimensions, getQualitySettings, loadTextures]);

  // Enhanced asteroid creation with better materials
  const createAsteroid = useCallback((scene, params) => {
    if (!scene || !params) return null;

    const quality = getQualitySettings();
    const baseSize = parseFloat(params.asteroidSize || params.size) || 100;
    const size = Math.max(1.5, Math.min(20, baseSize / 12));
    
    // Composition-based realistic materials
    const asteroidTexture = texturesRef.current.asteroid;

    // Define base properties for the material
    const materialProps = {
      map: asteroidTexture || null, // Apply the detailed rock texture
      shininess: 10,
      specular: 0x111111,
    };

    // Add color tinting based on the composition parameter
    switch (params.composition) {
      case 'metal':
        materialProps.color = new THREE.Color(0x999999); // Grey tint for metal
        materialProps.shininess = 150; // More reflective
        materialProps.specular = new THREE.Color(0x777777);
        break;
      case 'ice':
        materialProps.color = new THREE.Color(0xaaddff); // Icy blue tint
        materialProps.shininess = 100;
        materialProps.specular = new THREE.Color(0xeeeeff);
        break;
      case 'mixed':
        materialProps.color = new THREE.Color(0xc2a892); // Brownish tint
        break;
      case 'rock':
      default:
        // No tint for standard rock, use the texture's natural color
        break;
    }

const material = new THREE.MeshPhongMaterial(materialProps);
    
    // Create irregular asteroid shape
    const geometry = new THREE.IcosahedronGeometry(size, quality.asteroidDetail);
    
    // Surface deformation for realism
    const positions = geometry.attributes.position;
    const vertex = new THREE.Vector3();
    
    for (let i = 0; i < positions.count; i++) {
      vertex.fromBufferAttribute(positions, i);
      
      
      // A more complex noise function for a more irregular shape
      const p = vertex.clone().normalize();
      // Large, sweeping bumps for an overall irregular shape
      const largeBumps = Math.sin(p.x * 3) * Math.sin(p.y * 4) * Math.sin(p.z * 5) * 0.4;
      // Smaller, crater-like features
      const craters = Math.pow(Math.sin(p.x * 10) * Math.sin(p.y * 10), 2) * -0.2;
      // Tiny, random noise for a rough surface
      const fineNoise = (Math.random() - 0.5) * 0.1;

const deformation = 1.0 + largeBumps + craters + fineNoise;
      vertex.multiplyScalar(deformation);
      
      positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    
    positions.needsUpdate = true;
    geometry.computeVertexNormals();

    const asteroid = new THREE.Mesh(geometry, material);
    if (quality.enableShadows) {
      asteroid.castShadow = true;
      asteroid.receiveShadow = true;
    }

    // Velocity-based atmospheric effects
    const velocity = parseFloat(params.velocity) || 20;

    // Plasma trail for extreme velocity
    if (velocity > 30) {
      const trailGeometry = new THREE.ConeGeometry(size / 4, size * 2.5, 6);
      const trailMaterial = new THREE.MeshBasicMaterial({
        color: 0xff3366,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      const trail = new THREE.Mesh(trailGeometry, trailMaterial);
      trail.position.z = size * 1.5;
      trail.rotation.x = Math.PI;
      asteroid.add(trail);
    }

    scene.add(asteroid);
    asteroidRef.current = asteroid;

    return asteroid;
  }, [getQualitySettings]);

  // Enhanced trail system
  const createTrail = useCallback((scene) => {
    if (!scene) return null;
    
    const trailMaterial = new THREE.LineBasicMaterial({
      color: 0xff6b35,
      transparent: true,
      opacity: 0.8,
      linewidth: 2,
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

  // Realistic trajectory calculation
  const calculateTrajectory = useCallback((params) => {
    if (!params) return { start: new THREE.Vector3(), end: new THREE.Vector3() };

    const angle = ((parseFloat(params.approachAngle || params.angle) || 45) * Math.PI) / 180;
    const velocity = parseFloat(params.velocity) || 20;
    const size = parseFloat(params.asteroidSize || params.size) || 100;
    
    // Start position based on detection range
    const startDistance = Math.max(250, size * 1.5 + velocity * 3);
    
    const start = new THREE.Vector3(
      Math.cos(angle) * startDistance,
      Math.sin(angle) * startDistance * 0.3,
      Math.sin(angle + Math.PI/4) * startDistance * 0.7
    );
    
    // Impact point with gravitational deflection
    const gravitationalBend = velocity < 25 ? 0.08 : 0.03;
    const end = new THREE.Vector3(
      Math.cos(angle + Math.PI + gravitationalBend) * 31,
      Math.sin(angle + Math.PI + gravitationalBend) * 15,
      Math.sin(angle + Math.PI + gravitationalBend/2) * 31
    );

    return { start, end };
  }, []);

  // Enhanced impact effects
  const showImpactEffect = useCallback(() => {
    if (!sceneRef.current || !earthRef.current) return;

    const quality = getQualitySettings();
    const velocity = parseFloat(params?.velocity) || 20;
    const size = parseFloat(params?.asteroidSize || params?.size) || 100;
    
    const explosionIntensity = Math.min(8, (velocity * size) / 800); // Capped intensity
    
    // Multi-stage explosion
    const explosionStages = [
      { color: 0xffffff, size: 0.8, opacity: 1.0, delay: 0 },
      { color: 0xffcc44, size: 1.5, opacity: 0.9, delay: 100 },
      { color: 0xff6644, size: 2.2, opacity: 0.7, delay: 200 },
      { color: 0xcc3322, size: 3.0, opacity: 0.5, delay: 300 }
    ];
    
    explosionStages.forEach((stage, stageIndex) => {
      setTimeout(() => {
        const particleCount = quality.explosionParticles * 2; // Create much more debris

        for (let i = 0; i < particleCount; i++) {
          // Use an irregular shape for more realistic rock debris
          const particleGeometry = new THREE.IcosahedronGeometry(
            Math.random() * stage.size * explosionIntensity * 0.5, 0 
          );
          const particleMaterial = new THREE.MeshBasicMaterial({
            color: stage.color,
            transparent: true,
            opacity: stage.opacity,
            blending: THREE.AdditiveBlending
          });

          const particle = new THREE.Mesh(particleGeometry, particleMaterial);
          
          const angle = (i / particleCount) * Math.PI * 2;
          const radius = 35 + stageIndex * 10 + Math.random() * 15;
          const height = (Math.random() - 0.5) * 20;
          
          particle.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
          );
          
          sceneRef.current.add(particle);
          explosionParticlesRef.current.push(particle);

          // Particle animation
          const startTime = Date.now();
          const duration = 1500 + stageIndex * 300;
          const initialScale = particle.scale.x;
          const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * explosionIntensity * 0.8,
            Math.random() * explosionIntensity * 0.6,
            (Math.random() - 0.5) * explosionIntensity * 0.8
          );

          const animateParticle = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
              particle.position.add(velocity.clone().multiplyScalar(0.08));
              velocity.y -= 0.03; // Gravity
              velocity.multiplyScalar(0.985); // Air resistance
              
              const scale = initialScale * (1 + progress * (2 + stageIndex));
              particle.scale.setScalar(scale);
              particle.material.opacity = stage.opacity * (1 - progress);
              
              particle.rotation.x += 0.015;
              particle.rotation.y += 0.02;
              
              requestAnimationFrame(animateParticle);
            } else {
              sceneRef.current.remove(particle);
              const index = explosionParticlesRef.current.indexOf(particle);
              if (index > -1) explosionParticlesRef.current.splice(index, 1);
            }
          };
          
          animateParticle();
        }
      }, stage.delay);
    });

    // --- Cinematic Camera Shake Effect ---
if (cameraRef.current) {
    const shakeIntensity = Math.min(10, explosionIntensity * 2.5);
    gsap.to(cameraRef.current.position, {
        // Shake on x, y, and z axes for a more violent feel
        x: `+=${(Math.random() - 0.5) * shakeIntensity}`,
        y: `+=${(Math.random() - 0.5) * shakeIntensity}`,
        z: `+=${(Math.random() - 0.5) * shakeIntensity}`,
        duration: 0.05, // How fast each jolt is
        repeat: 20,    // How many jolts
        yoyo: true,    // Return to the original position after each jolt
        ease: "power2.inOut"
    });
}

    // Shockwave effect
    const shockwaveGeometry = new THREE.RingGeometry(0.1, 1, 128);
    const shockwaveMaterial = new THREE.MeshBasicMaterial({
        color: 0xffa500, // Orange-gold color
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide
    });
    shockwaveRef.current = new THREE.Mesh(shockwaveGeometry, shockwaveMaterial);

    // Position the shockwave at the impact point and orient it correctly
    if (asteroidRef.current) {
        shockwaveRef.current.position.copy(asteroidRef.current.position);
    }
    shockwaveRef.current.lookAt(0, 0, 0); // Point it away from the Earth's center
    sceneRef.current.add(shockwaveRef.current);

    // Animate the shockwave's scale and fade it out over time
    gsap.to(shockwaveRef.current.scale, {
        x: 100,
        y: 100,
        z: 100,
        duration: 3, // 3-second expansion
        ease: "power1.out"
    });
    gsap.to(shockwaveRef.current.material, {
        opacity: 0,
        duration: 3,
        ease: "power1.out",
        onComplete: () => {
            if (shockwaveRef.current && sceneRef.current) {
                sceneRef.current.remove(shockwaveRef.current);
                shockwaveRef.current = null;
            }
        }
    });

    // Atmospheric flash
    if (atmosphereRef.current) {
      const originalOpacity = atmosphereRef.current.material.opacity;
      let flashCount = 0;
      
      const flash = () => {
        if (flashCount < 8) {
          atmosphereRef.current.material.opacity = 
            originalOpacity + Math.sin(flashCount * 1.5) * 0.15;
          flashCount++;
          setTimeout(flash, 60);
        } else {
          atmosphereRef.current.material.opacity = originalOpacity;
        }
      };
      flash();
    }
  }, [getQualitySettings, params]);

  // Enhanced animation system
  const startAnimation = useCallback(() => {
    if (!sceneRef.current || !asteroidRef.current || !params) return;

    // Prevent multiple simultaneous animations
    if (isPlaying) return;

    // MODIFICATION: Disable OrbitControls during the scripted animation
    if (controlsRef.current) {
      controlsRef.current.enabled = false;
    }

    setIsPlaying(true);
    setCurrentTime(0);

    const { start, end } = calculateTrajectory(params);
    asteroidRef.current.position.copy(start);

    const velocity = parseFloat(params.velocity) || 20;
    const duration = Math.max(4000, animationTime / Math.max(1, velocity / 25));

    const startTime = Date.now();
    const trailPoints = [];
    const quality = getQualitySettings();

    const originalCameraPos = cameraRef.current.position.clone();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setCurrentTime(progress * 100);

      // Asteroid motion with realistic physics
      const currentPos = start.clone().lerp(end, progress);
      
      // Add gravitational curve
      if (progress > 0.25) {
        const gravityInfluence = (progress - 0.25) / 0.75;
        currentPos.y -= gravityInfluence * 8;
      }
      
      asteroidRef.current.position.copy(currentPos);

      // Asteroid rotation with composition-based tumbling
      const rotationSpeed = 0.02 * (1 + velocity / 50);
      asteroidRef.current.rotation.x += rotationSpeed * 0.7;
      asteroidRef.current.rotation.y += rotationSpeed * 1.2;
      asteroidRef.current.rotation.z += rotationSpeed * 0.5;

      // Enhanced camera modes
      switch (cameraMode) {
        case 'follow':
          if (progress > 0.15 && progress < 0.85) {
            const followPos = currentPos.clone().add(new THREE.Vector3(50, 35, 80));
            cameraRef.current.position.lerp(followPos, 0.025);
            cameraRef.current.lookAt(currentPos);
          }
          break;
          
        case 'cinematic':
          if (progress < 0.25) {
            const widePos = new THREE.Vector3(0, 120, 250);
            cameraRef.current.position.lerp(widePos, 0.015);
            cameraRef.current.lookAt(currentPos);
          } else if (progress < 0.65) {
            const followPos = currentPos.clone().add(new THREE.Vector3(70, 25, 100));
            cameraRef.current.position.lerp(followPos, 0.03);
            cameraRef.current.lookAt(currentPos);
          } else {
            const closePos = new THREE.Vector3(15, 15, 60);
            cameraRef.current.position.lerp(closePos, 0.05);
            cameraRef.current.lookAt(0, 0, 0);
          }
          break;
          
        default: // orbital
          if (progress > 0.3 && progress < 0.75) {
            const orbitalRadius = 150;
            const angle = Date.now() * 0.0015;
            cameraRef.current.position.x = Math.cos(angle) * orbitalRadius;
            cameraRef.current.position.z = Math.sin(angle) * orbitalRadius;
            cameraRef.current.lookAt(currentPos);
          }
          break;
      }

      // Enhanced trail with fade effect
      if (progress > 0.03) {
        trailPoints.push(currentPos.x, currentPos.y, currentPos.z);
        
        const maxTrailLength = quality.trailLength;
        if (trailPoints.length > maxTrailLength * 3) {
          trailPoints.splice(0, 6); // Remove 2 points at a time for smoother fade
        }
        
        if (trailRef.current) {
          trailRef.current.geometry.setAttribute('position', 
            new THREE.Float32BufferAttribute(trailPoints, 3));
          trailRef.current.geometry.attributes.position.needsUpdate = true;
        }
      }

      // FPS monitoring
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
        
        // Smooth camera reset
        setTimeout(() => {
          const resetCamera = () => {
            cameraRef.current.position.lerp(originalCameraPos, 0.04);
            cameraRef.current.lookAt(0, 0, 0);
            if (cameraRef.current.position.distanceTo(originalCameraPos) > 3) {
              requestAnimationFrame(resetCamera);
            } else {
              // MODIFICATION: Re-enable OrbitControls after the animation is complete
              if (controlsRef.current) {
                controlsRef.current.enabled = true;
              }
              onAnimationEnd?.();
            }
          };
          resetCamera();
        }, 1800);
      }
    };

    animate();
  }, [params, animationTime, calculateTrajectory, showImpactEffect, cameraMode, getQualitySettings, isPlaying, onAnimationEnd]);

  // Enhanced render loop with realistic Earth/cloud rotation
  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    let frameId;
    
    const render = () => {
      // Earth rotation (24-hour cycle scaled down)
      if (earthRef.current) {
        earthRef.current.rotation.y += 0.0008;
        
        // Clouds rotate slightly faster for realism
        const clouds = earthRef.current.children.find(child => 
          child.material && child.material.map === texturesRef.current.earthClouds
        );
        if (clouds) {
          clouds.rotation.y += 0.001;
        }
      }

       if (moonRef.current) {
      const time = Date.now() * 0.0001; // Controls the speed of revolution
      const orbitRadius = 90;
      moonRef.current.position.x = Math.cos(time) * orbitRadius;
      moonRef.current.position.z = Math.sin(time) * orbitRadius;

       moonRef.current.rotation.y += 0.002; // Moon's own rotation
       }

      // MODIFICATION: Check for user interaction before auto-rotating
      if (isAutoRotate && !isUserInteracting && cameraRef.current && !isPlaying && cameraMode === 'orbital') {
        const radius = 180;
        const time = Date.now() * 0.0003;
        cameraRef.current.position.x = Math.cos(time) * radius;
        cameraRef.current.position.z = Math.sin(time) * radius;
        cameraRef.current.lookAt(0, 0, 0);
      }

      // MODIFICATION: Update controls on each frame for smooth damping
      if (controlsRef.current) {
        controlsRef.current.update();
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
  }, [isAutoRotate, isPlaying, cameraMode, isUserInteracting]);

  // Enhanced responsive resize handler
  const handleResize = useCallback(() => {
  if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;

  const { width, height } = getResponsiveDimensions();

  cameraRef.current.aspect = width / height;
  cameraRef.current.updateProjectionMatrix();
  rendererRef.current.setSize(width, height, false);

  if (width < 600 && qualityLevel === 'ultra') {
    setQualityLevel('high');
  }
}, [getResponsiveDimensions, qualityLevel]); // Added dependencies

useEffect(() => {
  const resizeObserver = new ResizeObserver(handleResize);
  if (mountRef.current) {
    resizeObserver.observe(mountRef.current);
  }
  window.addEventListener('resize', handleResize);

  return () => {
    resizeObserver.disconnect();
    window.removeEventListener('resize', handleResize);
  };
}, [handleResize]);

  // Initialize scene only after component mount
  useEffect(() => {
    const initScene = async () => {
      const result = await initializeScene();
      if (result.scene) {
        createTrail(result.scene);
      }
    };
    
    initScene();
    
    return () => {
      // MODIFICATION: Dispose of controls on component unmount
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      // Cleanup textures
      Object.values(texturesRef.current).forEach(texture => {
        if (texture.dispose) texture.dispose();
      });
    };
  }, [initializeScene, createTrail]);

  // Update asteroid when params change (only if textures loaded)
  useEffect(() => {
    if (!sceneRef.current || !params || !texturesLoaded) return;

    if (asteroidRef.current) {
      sceneRef.current.remove(asteroidRef.current);
    }

    createAsteroid(sceneRef.current, params);
    
    if (asteroidRef.current) {
      const { start } = calculateTrajectory(params);
      asteroidRef.current.position.copy(start);
    }
  }, [params, createAsteroid, calculateTrajectory, texturesLoaded]);

  // Fixed simulation trigger - prevent multiple runs
  useEffect(() => {
    if (!params || !texturesLoaded) return;

    // Create a unique identifier for current simulation parameters
    const currentParamsId = JSON.stringify({
      size: params.asteroidSize || params.size,
      velocity: params.velocity,
      composition: params.composition,
      angle: params.approachAngle || params.angle,
      isSimulating
    });

    // Only start animation if simulation is triggered and parameters have changed
    if (isSimulating && !isPlaying && currentParamsId !== lastSimulationParamsRef.current) {
      lastSimulationParamsRef.current = currentParamsId;
      startAnimation();
    }
    
    // Update the reference when simulation stops
    if (!isSimulating) {
      lastSimulationParamsRef.current = null;
    }
  }, [isSimulating, isPlaying, startAnimation, params, texturesLoaded]);

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

  const getSizeThreat = useCallback((size) => {
    const sizeNum = parseInt(size);
    if (sizeNum < 25) return { level: "Atmospheric", color: "text-mission-green", icon: "🔥" };
    if (sizeNum < 140) return { level: "Local", color: "text-plasma-orange", icon: "🏘️" };
    if (sizeNum < 1000) return { level: "Regional", color: "text-destructive", icon: "🏙️" };
    return { level: "Global", color: "text-destructive", icon: "🌍" };
  }, []);

  const handleToggleFullscreen = () => {
  if (fullscreenContainerRef.current) { // Use the correct ref here
    if (!document.fullscreenElement) {
      fullscreenContainerRef.current.requestFullscreen().catch((err) => {
        alert(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
};
// Add this useEffect hook
useEffect(() => {
  const onFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
    setTimeout(handleResize, 50); 
  };
  document.addEventListener('fullscreenchange', onFullscreenChange);
  return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
}, [handleResize]);


  return (
    <Card className="bg-card/60 backdrop-blur-xl border border-quantum-blue/30 shadow-command relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4 w-16 h-16 sm:w-32 sm:h-32 bg-quantum-blue rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-4 left-4 w-12 h-12 sm:w-24 sm:h-24 bg-stellar-cyan rounded-full blur-2xl animate-float-gentle" />
      </div>

      <CardHeader className="relative z-10 pb-2 sm:pb-3 px-3 sm:px-6">
        <CardTitle className="flex flex-col space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-quantum shadow-command">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-sm sm:text-base lg:text-lg font-bold text-quantum-blue tracking-wide">
                  ORBITAL SIMULATION
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
              <Badge variant="outline" className={`text-xs ${texturesLoaded ? 'text-mission-green border-mission-green/30' : 'text-plasma-orange border-plasma-orange/30'}`}>
                {texturesLoaded ? 'READY' : 'LOADING'}
              </Badge>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 relative z-10 px-3 sm:px-6 pb-4">
        {/* 3D Visualization Container - Fixed Sizing */}
        <div ref={fullscreenContainerRef} className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 rounded-lg border border-quantum-blue/30 overflow-hidden shadow-inner">
         <div 
            ref={mountRef} 
            className="w-full h-full" 
            style={{ 
              height: isFullscreen 
                ? '100%' 
                : (window.innerWidth < 640 ? '320px' : window.innerWidth < 1024 ? '400px' : '480px')
            }}
          />
          
          {/* Enhanced Control Overlay */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col space-y-2">
            <div className="flex space-x-1 sm:space-x-2">

              

              <Toggle
                pressed={isAutoRotate}
                onPressedChange={setIsAutoRotate}
                className="bg-background/25 backdrop-blur-sm border-quantum-blue/30 w-8 h-8 sm:w-10 sm:h-10"
                size="sm"
              >
                <RotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
              </Toggle>

              
              
              <Toggle
                pressed={showDebugInfo}
                onPressedChange={setShowDebugInfo}
                className="bg-background/25 backdrop-blur-sm border-quantum-blue/30 w-8 h-8 sm:w-10 sm:h-10"
                size="sm"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              </Toggle>
            </div>
            
            <div className="flex space-x-1 sm:space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="bg-background/25 backdrop-blur-sm border border-quantum-blue/30 w-8 h-8 sm:w-10 sm:h-10 p-0"
                onClick={() => setCameraMode(cameraMode === 'orbital' ? 'follow' : 
                                          cameraMode === 'follow' ? 'cinematic' : 'orbital')}
              >
                <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              
               <Toggle
                  pressed={isFullscreen}
                  onPressedChange={handleToggleFullscreen}
                  className="bg-background/25 backdrop-blur-sm border-quantum-blue/30 w-8 h-8 sm:w-10 sm:h-10"
                  size="sm"
                >
                  {isFullscreen ? <Minimize className="w-3 h-3 sm:w-4 sm:h-4" /> : <Maximize className="w-3 h-3 sm:w-4 sm:h-4" />}
                </Toggle>
            </div>
          </div>

          {/* Status Overlay */}
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 space-y-2">
            <div className="bg-background/25 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 border border-quantum-blue/20">
              <div className="text-xs text-white font-medium">
                {!texturesLoaded ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-plasma-orange rounded-full animate-pulse" />
                    <span className="hidden sm:inline">LOADING TEXTURES</span>
                    <span className="sm:hidden">LOADING</span>
                  </span>
                ) : isPlaying ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                    <span className="hidden sm:inline">IMPACT SIMULATION</span>
                    <span className="sm:hidden">SIMULATING</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-mission-green rounded-full" />
                    <span className="hidden sm:inline">VISUALIZATION READY</span>
                    <span className="sm:hidden">READY</span>
                  </span>
                )}
              </div>
            </div>
            
            {showDebugInfo && (
              <div className="bg-background/25 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1 sm:py-2 border border-quantum-blue/20">
                <div className="text-xs text-white space-y-1">
                  <div>Camera: {cameraMode.toUpperCase()}</div>
                  <div>Quality: {qualityLevel.toUpperCase()}</div>
                  <div>FPS: {fps}</div>
                  <div>Textures: {texturesLoaded ? 'LOADED' : 'LOADING'}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Simplified Progress Display */}
        {isPlaying && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">Simulation Progress</span>
              <span className="font-mono font-bold text-quantum-blue">
                {currentTime.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={currentTime} 
              className="h-2 sm:h-3 bg-muted/30"
            />
            <div className="text-xs text-center text-muted-foreground font-mono">
              T-{((100 - currentTime) / 100 * (animationTime / 1000)).toFixed(1)}s to impact
            </div>
          </div>
        )}

        {/* Enhanced Trajectory Information */}
        {params && (
          <div className="bg-gradient-to-r from-card/60 via-card/40 to-card/60 backdrop-blur-sm rounded-xl border border-quantum-blue/20 p-4 space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <Eye className="w-4 h-4 text-quantum-blue" />
              <span className="text-sm font-bold text-quantum-blue uppercase tracking-wide">Trajectory Analysis</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Entry Angle */}
              <div className="flex flex-col space-y-2 p-3 bg-plasma-orange/10 rounded-lg border border-plasma-orange/20">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-plasma-orange" />
                  <span className="text-xs font-medium text-plasma-orange uppercase">Entry Angle</span>
                </div>
                <div className="text-xl font-bold text-foreground">
                  {params.approachAngle || params.angle || '45'}°
                </div>
                <div className="text-xs text-muted-foreground">
                  Impact trajectory angle
                </div>
              </div>
              
              {/* Velocity */}
              <div className="flex flex-col space-y-2 p-3 bg-stellar-cyan/10 rounded-lg border border-stellar-cyan/20">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-stellar-cyan" />
                  <span className="text-xs font-medium text-stellar-cyan uppercase">Velocity</span>
                </div>
                <div className="text-xl font-bold text-foreground">
                  {params.velocity || '20'} km/s
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getVelocityBadge(params.velocity).color} text-white text-xs`}>
                    {getVelocityBadge(params.velocity).text}
                  </Badge>
                </div>
              </div>
              
              {/* Object Classification */}
              <div className="flex flex-col space-y-2 p-3 bg-quantum-blue/10 rounded-lg border border-quantum-blue/20">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-quantum-blue" />
                  <span className="text-xs font-medium text-quantum-blue uppercase">Object</span>
                </div>
                <div className="text-lg font-bold text-foreground">
                  {params.asteroidSize || params.size || '100'}m
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    className="text-white text-xs"
                    style={{ backgroundColor: getCompositionColor(params.composition) }}
                  >
                    {params.composition?.toUpperCase() || 'ROCKY'}
                  </Badge>
                  <Badge className={`${getSizeThreat(params.asteroidSize || params.size).color.replace('text-', 'bg-')} text-white text-xs`}>
                    {getSizeThreat(params.asteroidSize || params.size).level}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Threat Assessment */}
            <div className="p-3 bg-muted/10 rounded-lg border border-border/30">
              <div className="flex items-center space-x-2 mb-2">
                <Gauge className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase">Threat Assessment</span>
              </div>
              <div className="text-sm text-foreground">
                {getSizeThreat(params.asteroidSize || params.size).icon} {getSizeThreat(params.asteroidSize || params.size).level} impact threat with {getVelocityBadge(params.velocity).text.toLowerCase()} velocity approach
              </div>
            </div>
          </div>
        )}

        {/* Original Camera and Quality Controls - Compact Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Camera</label>
            <div className="grid grid-cols-3 gap-1">
              {['orbit', 'follow', 'cinematic'].map((mode) => (
                <Button
                  key={mode}
                  variant={cameraMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCameraMode(mode)}
                  className={`text-xs h-8 ${cameraMode === mode ? 'bg-gradient-quantum' : ''}`}
                >
                  <span className="hidden sm:inline">{mode.toUpperCase()}</span>
                  <span className="sm:hidden">{mode.toUpperCase().slice(0, 6)}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Quality</label>
            <div className="grid grid-cols-3 gap-1">
              {['med', 'high', 'ultra'].map((quality) => (
                <Button
                  key={quality}
                  variant={qualityLevel === quality ? "default" : "outline"}
                  size="sm"
                  onClick={() => setQualityLevel(quality)}
                  className={`text-xs h-8 ${qualityLevel === quality ? 'bg-gradient-quantum' : ''}`}
                >
                  <span className="hidden sm:inline">{quality.toUpperCase()}</span>
                  <span className="sm:hidden">{quality.toUpperCase().slice(0, 5)}</span>
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