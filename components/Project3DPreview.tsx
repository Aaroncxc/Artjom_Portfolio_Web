'use client';

import { useEffect, useRef, useState } from 'react';

interface Project3DPreviewProps {
  modelPath: string;
  isHovered: boolean;
  mousePosition: { x: number; y: number };
  rotationX?: number; // Rotation in degrees on X axis (default: -90)
  materialColor?: string; // Override color for plastic/transparent materials
}

export function Project3DPreview({ modelPath, isHovered, mousePosition, rotationX = -90, materialColor }: Project3DPreviewProps) {
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

        // Camera - positioned to see the full model centered
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
        camera.position.set(0, 0, 5.5); // Centered, further back to see full model
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Renderer - EXACT same settings as 3D viewer for transmission to work
        const renderer = new THREE.WebGLRenderer({ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        // These are important for MeshPhysicalMaterial with transmission
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting - EXACT same as 3D viewer (index.html)
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.4);
        mainLight.position.set(2, 12, 4);  // Light from above
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
        fillLight.position.set(-5, 5, -5);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0x88ccff, 0.25);
        rimLight.position.set(0, -5, -10);
        scene.add(rimLight);

        // Load model
        const loader = new FBXLoader();
        loader.load(
          modelPath,
          (fbx) => {
            if (!mounted) return;

            // 1) First, calculate bounding box BEFORE any transforms
            const box = new THREE.Box3().setFromObject(fbx);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            
            // 2) Scale to fit nicely in view
            const targetSize = 2.4;
            const scale = targetSize / maxDim;
            
            // 3) Apply rotation first (same as 3D viewer), then scale
            fbx.rotation.x = (rotationX * Math.PI) / 180;  // Convert degrees to radians
            fbx.scale.setScalar(scale);
            fbx.position.set(0, 0, 0);
            fbx.updateMatrixWorld(true);
            
            // 4) Recalculate bounding box after rotation + scale, then center
            const boxRotated = new THREE.Box3().setFromObject(fbx);
            const centerRotated = boxRotated.getCenter(new THREE.Vector3());
            fbx.position.set(-centerRotated.x, -centerRotated.y - 0.3, -centerRotated.z);
            
            // Handle materials - apply red transparent look to plastic/transparent parts (same as viewer)
            fbx.traverse((child: any) => {
              if (child.isMesh && child.material) {
                const mats = Array.isArray(child.material) ? child.material : [child.material];
                let hasPlasticMaterial = false;

                const newMats = mats.map((mat: any, idx: number) => {
                  const matName = (mat.name || '').toLowerCase();
                  
                  const hasPlasticName = 
                    matName.includes('plastic') ||
                    matName.includes('transparent') ||
                    matName.includes('clear') ||
                    matName.includes('glass') ||
                    matName.includes('visor');
                  
                  const isTransparentProps = 
                    mat.transparent === true ||
                    (mat.opacity !== undefined && mat.opacity < 0.99);
                  
                  let isLightColor = false;
                  if (mat.color) {
                    const r = mat.color.r || 0;
                    const g = mat.color.g || 0;
                    const b = mat.color.b || 0;
                    isLightColor = (r > 0.9 && g > 0.9 && b > 0.9);
                  }
                  
                  const isPlasticMaterial = hasPlasticName || isTransparentProps || isLightColor;
                  
                  if (isPlasticMaterial) {
                    hasPlasticMaterial = true;
                    
                    // Use custom material color if provided, otherwise default to red transparent
                    if (materialColor) {
                      // Solid material with custom color
                      const solidMat = new THREE.MeshStandardMaterial({
                        color: new THREE.Color(materialColor),
                        roughness: 0.3,
                        metalness: 0.0,
                        side: THREE.DoubleSide,
                      });
                      return solidMat;
                    } else {
                      // Default: Red transparent plastic
                      const plasticColor = '#FF0000';
                      const plasticOpacity = 0.35;
                      const plasticTransmission = 0.6;
                      const plasticRoughness = 0.05;
                      const plasticThickness = 0.5;
                      
                      const plasticMat = new THREE.MeshPhysicalMaterial({
                        color: new THREE.Color(plasticColor),
                        transparent: true,
                        opacity: plasticOpacity,
                        roughness: plasticRoughness,
                        metalness: 0.0,
                        transmission: plasticTransmission,
                        thickness: plasticThickness,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                        envMapIntensity: 1.0,
                      });
                      (plasticMat as any).renderOrder = 1;
                      return plasticMat;
                    }
                  }
                  
                  mat.metalness = 0.1;
                  mat.roughness = 0.6;
                  return mat;
                });
                
                child.material = Array.isArray(child.material) ? newMats : newMats[0];
                if (hasPlasticMaterial) {
                  child.renderOrder = 1;
                }
              }
            });

            // Setup animation - set to initial pose (time 0, closed state)
            if (fbx.animations && fbx.animations.length > 0) {
              const mixer = new THREE.AnimationMixer(fbx);
              const clip = fbx.animations[0];
              const action = mixer.clipAction(clip);
              action.setLoop(THREE.LoopOnce, 1);
              action.clampWhenFinished = true;
              action.play();
              action.paused = true;
              action.time = 0;  // Start at beginning (closed pose)
              mixer.update(0);  // Apply the pose
            }

            // Create a pivot group to rotate around center
            const pivotGroup = new THREE.Group();
            pivotGroup.add(fbx);
            scene.add(pivotGroup);
            modelRef.current = pivotGroup;
            
            console.log('3D Preview loaded:', { 
              originalSize: size, 
              scale, 
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
  }, [modelPath, rotationX, materialColor]);

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
