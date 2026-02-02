'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

interface Model3DViewerProps {
  modelPath: string;
  backgroundColor?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  initialRotation?: { x: number; y: number; z: number };
  cameraDistance?: number;
  className?: string;
}

export function Model3DViewer({
  modelPath,
  backgroundColor = 'transparent',
  autoRotate = false,
  autoRotateSpeed = 1,
  initialRotation = { x: 0, y: 0, z: 0 },
  cameraDistance = 5,
  className = '',
}: Model3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const wireframeMeshRef = useRef<THREE.Group | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showWireframe, setShowWireframe] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    if (backgroundColor === 'transparent') {
      scene.background = null;
    } else {
      scene.background = new THREE.Color(backgroundColor);
    }

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, cameraDistance);

    // Renderer - with settings for MeshPhysicalMaterial transmission
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: backgroundColor === 'transparent',
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Important for transmission
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.enablePan = false;
    controls.minDistance = cameraDistance * 0.5;
    controls.maxDistance = cameraDistance * 3;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(5, 10, 7);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    // Subtle rim light
    const rimLight = new THREE.DirectionalLight(0x88ccff, 0.3);
    rimLight.position.set(0, -5, -10);
    scene.add(rimLight);

    // Load FBX Model
    const loader = new FBXLoader();
    loader.load(
      modelPath,
      (fbx) => {
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(fbx);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        fbx.scale.setScalar(scale);
        
        fbx.position.sub(center.multiplyScalar(scale));
        
        // Apply initial rotation
        fbx.rotation.x = initialRotation.x;
        fbx.rotation.y = initialRotation.y;
        fbx.rotation.z = initialRotation.z;

        // Enable shadows and set materials - with red plastic for transparent parts
        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            
            // Handle materials - apply red transparent look to plastic/transparent parts
            if (child.material) {
              const mats = Array.isArray(child.material) ? child.material : [child.material];
              let hasPlasticMaterial = false;

              const newMats = mats.map((mat: THREE.Material) => {
                const matName = (mat.name || '').toLowerCase();
                
                const hasPlasticName = 
                  matName.includes('plastic') ||
                  matName.includes('transparent') ||
                  matName.includes('clear') ||
                  matName.includes('glass') ||
                  matName.includes('visor');
                
                const isTransparentProps = 
                  (mat as any).transparent === true ||
                  ((mat as any).opacity !== undefined && (mat as any).opacity < 0.99);
                
                let isLightColor = false;
                if ((mat as any).color) {
                  const r = (mat as any).color.r || 0;
                  const g = (mat as any).color.g || 0;
                  const b = (mat as any).color.b || 0;
                  isLightColor = (r > 0.9 && g > 0.9 && b > 0.9);
                }
                
                const isPlasticMaterial = hasPlasticName || isTransparentProps || isLightColor;
                
                if (isPlasticMaterial) {
                  hasPlasticMaterial = true;
                  // ========== PLASTIC MATERIAL - Red transparent plastic ==========
                  const plasticColor = '#FF0000';
                  const plasticOpacity = 0.35;
                  const plasticTransmission = 0.6;
                  const plasticRoughness = 0.05;
                  const plasticThickness = 0.5;
                  // ==============================================================
                  
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
                
                // Improve non-plastic materials
                if (mat instanceof THREE.MeshPhongMaterial || mat instanceof THREE.MeshLambertMaterial) {
                  (mat as any).shininess = 30;
                }
                (mat as any).metalness = 0.1;
                (mat as any).roughness = 0.6;
                return mat;
              });
              
              child.material = Array.isArray(child.material) ? newMats : newMats[0];
              if (hasPlasticMaterial) {
                child.renderOrder = 1;
              }
            }
          }
        });

        scene.add(fbx);
        modelRef.current = fbx;

        // Create wireframe version
        const wireframeGroup = new THREE.Group();
        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const wireframeGeometry = new THREE.WireframeGeometry(child.geometry);
            const wireframeMaterial = new THREE.LineBasicMaterial({ 
              color: 0x14B8A6,
              transparent: true,
              opacity: 0.6,
            });
            const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
            wireframe.position.copy(child.position);
            wireframe.rotation.copy(child.rotation);
            wireframe.scale.copy(child.scale);
            wireframeGroup.add(wireframe);
          }
        });
        wireframeGroup.scale.copy(fbx.scale);
        wireframeGroup.position.copy(fbx.position);
        wireframeGroup.rotation.copy(fbx.rotation);
        wireframeGroup.visible = false;
        scene.add(wireframeGroup);
        wireframeMeshRef.current = wireframeGroup;

        setIsLoading(false);
      },
      (progress) => {
        if (progress.total > 0) {
          setLoadProgress(Math.round((progress.loaded / progress.total) * 100));
        }
      },
      (error) => {
        console.error('Error loading FBX:', error);
        setLoadError('Failed to load 3D model');
        setIsLoading(false);
      }
    );

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      
      // Sync wireframe with model rotation
      if (modelRef.current && wireframeMeshRef.current) {
        wireframeMeshRef.current.rotation.copy(modelRef.current.rotation);
        wireframeMeshRef.current.position.copy(modelRef.current.position);
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelPath, backgroundColor, autoRotate, autoRotateSpeed, cameraDistance, initialRotation]);

  // Toggle wireframe visibility
  useEffect(() => {
    if (wireframeMeshRef.current) {
      wireframeMeshRef.current.visible = showWireframe;
    }
  }, [showWireframe]);

  return (
    <div className={`relative ${className}`}>
      {/* 3D Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full min-h-[300px] rounded-2xl overflow-hidden"
        style={{ touchAction: 'none' }}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(250,250,255,0.8)] backdrop-blur-sm rounded-2xl">
          <div className="w-12 h-12 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-mk-text-secondary text-sm">Loading 3D Model...</p>
          {loadProgress > 0 && (
            <p className="text-mk-text-muted text-xs mt-1">{loadProgress}%</p>
          )}
        </div>
      )}

      {/* Error State */}
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(250,250,255,0.9)] rounded-2xl">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-mk-text-secondary">{loadError}</p>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      {!isLoading && !loadError && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          {/* Wireframe Toggle */}
          <button
            onClick={() => setShowWireframe(!showWireframe)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 backdrop-blur-md ${
              showWireframe
                ? 'bg-accent-cyan text-white shadow-lg'
                : 'bg-white/80 text-mk-text-secondary hover:bg-white hover:text-mk-text border border-[rgba(28,28,28,0.1)]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Wireframe
          </button>

          {/* Interaction Hint */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm text-xs text-mk-text-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Drag to rotate
          </div>
        </div>
      )}
    </div>
  );
}
