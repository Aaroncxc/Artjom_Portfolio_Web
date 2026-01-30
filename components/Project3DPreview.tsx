'use client';

import { useEffect, useRef, useState } from 'react';

interface Project3DPreviewProps {
  modelPath: string;
  isHovered: boolean;
  mousePosition: { x: number; y: number };
}

export function Project3DPreview({ modelPath, isHovered, mousePosition }: Project3DPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const frameRef = useRef<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const threeRef = useRef<any>(null);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    const initScene = async () => {
      try {
        // Dynamic import Three.js
        const THREE = await import('three');
        const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js');
        
        if (!mounted || !containerRef.current) return;

        threeRef.current = THREE;

        // Scene
        const scene = new THREE.Scene();
        scene.background = null;
        sceneRef.current = scene;

        // Camera
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Lower for performance
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
        mainLight.position.set(3, 5, 4);
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-3, 2, -2);
        scene.add(fillLight);

        // Load model
        const loader = new FBXLoader();
        loader.load(
          modelPath,
          (fbx) => {
            if (!mounted) return;

            // First, calculate bounding box BEFORE any transforms
            const box = new THREE.Box3().setFromObject(fbx);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            
            // Scale to fit nicely in view (target size ~2 units)
            const targetSize = 1.8;
            const scale = targetSize / maxDim;
            fbx.scale.setScalar(scale);
            
            // Now center the model at origin
            // After scaling, we need to recalculate or just move by scaled center
            fbx.position.set(
              -center.x * scale,
              -center.y * scale,
              -center.z * scale
            );
            
            // Handle materials for plastic - match the red transparent look from project viewer
            fbx.traverse((child: any) => {
              if (child.isMesh && child.material) {
                const mat = child.material;
                if (mat.name && (mat.name.toLowerCase().includes('plastic') || mat.name.toLowerCase().includes('transparent'))) {
                  const newMat = new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color('#FF0000'),  // Red like in project viewer
                    transparent: true,
                    opacity: 0.35,
                    roughness: 0.05,
                    metalness: 0.0,
                    transmission: 0.6,
                    thickness: 0.5,
                    side: THREE.DoubleSide,
                    depthWrite: false,
                    envMapIntensity: 1.0,
                  });
                  child.material = newMat;
                }
              }
            });

            // Create a pivot group to rotate around center
            const pivotGroup = new THREE.Group();
            pivotGroup.add(fbx);
            scene.add(pivotGroup);
            modelRef.current = pivotGroup;
            
            console.log('3D Preview loaded:', { 
              originalSize: size, 
              scale, 
              center,
              finalPos: fbx.position 
            });
            
            setIsLoaded(true);
          },
          undefined,
          (err) => {
            console.error('Error loading 3D preview:', err);
            setError(true);
          }
        );

      } catch (err) {
        console.error('Failed to initialize 3D preview:', err);
        setError(true);
      }
    };

    initScene();

    return () => {
      mounted = false;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current && rendererRef.current.domElement) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [modelPath]);

  // Animation loop - always running, rotate based on mouse when hovered
  useEffect(() => {
    if (!isLoaded || !modelRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    let lastTime = performance.now();
    const baseRotationSpeed = 0.0003; // Slow rotation

    const animate = () => {
      if (!modelRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

      const now = performance.now();
      const delta = now - lastTime;
      lastTime = now;

      if (isHovered) {
        // Rotate based on mouse position when hovered
        const targetRotationY = (mousePosition.x - 0.5) * Math.PI * 0.6;
        const targetRotationX = (mousePosition.y - 0.5) * Math.PI * 0.2;
        
        // Smooth interpolation
        modelRef.current.rotation.y += (targetRotationY - modelRef.current.rotation.y) * 0.1;
        modelRef.current.rotation.x += (targetRotationX - modelRef.current.rotation.x) * 0.1;
      } else {
        // Slow auto-rotation when not hovered
        modelRef.current.rotation.y += baseRotationSpeed * delta;
        // Slowly return X rotation to 0
        modelRef.current.rotation.x *= 0.95;
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isLoaded, isHovered, mousePosition]);

  // Handle resize
  useEffect(() => {
    if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isLoaded]);

  if (error) return null;

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-10"
      style={{ 
        background: 'linear-gradient(135deg, rgba(248,250,252,1) 0%, rgba(241,245,249,1) 100%)'
      }}
    >
      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-accent-cyan rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
