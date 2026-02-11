'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Project3DPreviewProps {
  modelPath: string;
  isHovered: boolean;
  mousePosition: { x: number; y: number };
  rotationX?: number;
  materialColor?: string;
  offsetY?: number;
}

/** Dispose all GPU resources from a Three.js scene */
function deepDispose(obj: any) {
  if (!obj) return;
  // Traverse the object tree
  if (obj.traverse) {
    obj.traverse((node: any) => {
      if (node.isMesh) {
        // Geometry
        if (node.geometry) {
          node.geometry.dispose();
        }
        // Materials (single or array)
        const mats = Array.isArray(node.material) ? node.material : [node.material];
        mats.forEach((mat: any) => {
          if (!mat) return;
          // Dispose all texture maps
          const texProps = ['map', 'lightMap', 'bumpMap', 'normalMap', 'specularMap',
            'emissiveMap', 'metalnessMap', 'roughnessMap', 'alphaMap', 'aoMap',
            'displacementMap', 'envMap', 'transmissionMap', 'thicknessMap'];
          texProps.forEach(prop => {
            if (mat[prop]) {
              mat[prop].dispose();
            }
          });
          // ShaderMaterial uniforms
          if (mat.uniforms) {
            Object.values(mat.uniforms).forEach((u: any) => {
              if (u?.value?.isTexture) u.value.dispose();
            });
          }
          mat.dispose();
        });
      }
    });
  }
}

export function Project3DPreview({ modelPath, isHovered, mousePosition, rotationX = -90, materialColor, offsetY = -0.3 }: Project3DPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const frameRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const threeRef = useRef<any>(null);
  const startTimeRef = useRef(performance.now());

  // Single combined render function (avoids multiple rAF loops)
  const renderFrame = useCallback(() => {
    if (!modelRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    const elapsed = (performance.now() - startTimeRef.current) * 0.001;

    if (isHovered) {
      const targetRotationY = (mousePosition.x - 0.5) * Math.PI * 0.5;
      const targetRotationX = (mousePosition.y - 0.5) * Math.PI * 0.15;
      modelRef.current.rotation.y += (targetRotationY - modelRef.current.rotation.y) * 0.08;
      modelRef.current.rotation.x += (targetRotationX - modelRef.current.rotation.x) * 0.08;
    } else {
      const idleY = Math.sin(elapsed * 0.6) * 0.08;
      const idleX = Math.sin(elapsed * 0.4) * 0.03;
      modelRef.current.rotation.y += (idleY - modelRef.current.rotation.y) * 0.04;
      modelRef.current.rotation.x += (idleX - modelRef.current.rotation.x) * 0.04;
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, [isHovered, mousePosition]);

  // Animation loop – only runs when visible (IntersectionObserver)
  useEffect(() => {
    if (!isLoaded) return;

    const loop = () => {
      if (!isVisibleRef.current) {
        // Not visible → stop, will restart from observer callback
        frameRef.current = 0;
        return;
      }
      renderFrame();
      frameRef.current = requestAnimationFrame(loop);
    };

    // Start loop
    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
    };
  }, [isLoaded, renderFrame]);

  // IntersectionObserver – pause/resume animation loop when not in viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisibleRef.current;
        isVisibleRef.current = entry.isIntersecting;

        // Restart loop if becoming visible and loaded
        if (entry.isIntersecting && !wasVisible && isLoaded && !frameRef.current) {
          const loop = () => {
            if (!isVisibleRef.current) {
              frameRef.current = 0;
              return;
            }
            renderFrame();
            frameRef.current = requestAnimationFrame(loop);
          };
          frameRef.current = requestAnimationFrame(loop);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isLoaded, renderFrame]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    const initScene = async () => {
      try {
        const THREE = await import('three');
        const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js');
        
        if (!mounted || !containerRef.current) return;

        threeRef.current = THREE;

        const scene = new THREE.Scene();
        scene.background = null;
        sceneRef.current = scene;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
        camera.position.set(0, 0, 5.5);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.5);
        hemiLight.position.set(0, 20, 0);
        scene.add(hemiLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.4);
        mainLight.position.set(-5, 12, 8);
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
        fillLight.position.set(5, 5, 5);
        scene.add(fillLight);

        const rimLight = new THREE.DirectionalLight(0x88ccff, 0.4);
        rimLight.position.set(0, 5, -10);
        scene.add(rimLight);

        // Load model
        const loader = new FBXLoader();
        loader.load(
          modelPath,
          (fbx) => {
            if (!mounted) return;

            const box = new THREE.Box3().setFromObject(fbx);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetSize = 2.4;
            const scale = targetSize / maxDim;
            
            fbx.rotation.x = (rotationX * Math.PI) / 180;
            fbx.scale.setScalar(scale);
            fbx.position.set(0, 0, 0);
            fbx.updateMatrixWorld(true);
            
            const boxRotated = new THREE.Box3().setFromObject(fbx);
            const centerRotated = boxRotated.getCenter(new THREE.Vector3());
            fbx.position.set(-centerRotated.x, -centerRotated.y + offsetY, -centerRotated.z);
            
            const isRovoltoModel = modelPath.includes('rovolto');
            
            fbx.traverse((child: any) => {
              if (child.isMesh && child.material) {
                
                if (isRovoltoModel) {
                  const textureLoader = new THREE.TextureLoader();
                  const logoTexture = textureLoader.load('/multikunst-logo.png');
                  logoTexture.colorSpace = THREE.SRGBColorSpace;
                  logoTexture.flipY = true;
                  logoTexture.wrapS = THREE.RepeatWrapping;
                  logoTexture.repeat.x = -1;
                  logoTexture.offset.x = 1;
                  
                  const logoMaterial = new THREE.ShaderMaterial({
                    uniforms: { map: { value: logoTexture } },
                    vertexShader: `
                      varying vec2 vUv;
                      void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                      }
                    `,
                    fragmentShader: `
                      uniform sampler2D map;
                      varying vec2 vUv;
                      void main() {
                        vec4 texColor = texture2D(map, vUv);
                        float whiteness = (texColor.r + texColor.g + texColor.b) / 3.0;
                        float alpha = 1.0 - smoothstep(0.3, 0.5, whiteness);
                        gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
                      }
                    `,
                    transparent: true,
                    side: THREE.DoubleSide,
                    depthWrite: false,
                  });
                  
                  const meshName = (child.name || '').toLowerCase();
                  const isLogoPlane = meshName.includes('logo') || meshName.includes('label') || 
                    meshName.includes('sign') || meshName.includes('plane') || 
                    meshName.includes('schild') || meshName.includes('text') || meshName.includes('multi');
                  
                  if (isLogoPlane) {
                    child.material = logoMaterial;
                    return;
                  }
                  
                  const mats = Array.isArray(child.material) ? child.material : [child.material];
                  const newMats = mats.map((mat: any) => {
                    const matName = (mat.name || '').toLowerCase();
                    
                    if (matName.includes('logo') || matName.includes('label') || matName.includes('sign')) {
                      return logoMaterial;
                    }
                    if (matName.includes('yellow') || matName.includes('orange') || matName.includes('gold') ||
                        matName.includes('plastic') || matName.includes('transparent') || matName.includes('clear')) {
                      return new THREE.MeshStandardMaterial({ color: 0xD4940A, roughness: 0.25, metalness: 0.6, side: THREE.DoubleSide });
                    }
                    if (matName.includes('cyan') || matName.includes('turquoise') || matName.includes('glow')) {
                      return new THREE.MeshStandardMaterial({ color: 0x00E5E5, roughness: 0.1, metalness: 0.3, emissive: new THREE.Color(0x00AAAA), emissiveIntensity: 0.5, side: THREE.DoubleSide });
                    }
                    if (matName.includes('black') || matName.includes('dark')) {
                      return new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.7, side: THREE.DoubleSide });
                    }
                    
                    const r = mat.color?.r || 0.5, g = mat.color?.g || 0.5, b = mat.color?.b || 0.5;
                    if ((r > 0.6 && g > 0.3 && b < 0.3) || (r > 0.9 && g > 0.9 && b > 0.9) || mat.transparent) {
                      return new THREE.MeshStandardMaterial({ color: 0xD4940A, roughness: 0.25, metalness: 0.6, side: THREE.DoubleSide });
                    }
                    if (b > 0.5 && g > 0.5 && r < 0.3) {
                      return new THREE.MeshStandardMaterial({ color: 0x00E5E5, roughness: 0.1, metalness: 0.3, emissive: new THREE.Color(0x00AAAA), emissiveIntensity: 0.5, side: THREE.DoubleSide });
                    }
                    return new THREE.MeshStandardMaterial({ color: mat.color || 0x888888, roughness: 0.4, metalness: 0.5, side: THREE.DoubleSide });
                  });
                  child.material = Array.isArray(child.material) ? newMats : newMats[0];
                  
                } else {
                  const mats = Array.isArray(child.material) ? child.material : [child.material];
                  mats.forEach((mat: any) => {
                    mat.metalness = 0.1;
                    mat.roughness = 0.6;
                    
                    const matName = (mat.name || '').toLowerCase();
                    const isPlasticMaterial = matName.includes('plastic') || matName.includes('transparent');
                    
                    if (isPlasticMaterial) {
                      const plasticMat = new THREE.MeshPhysicalMaterial({
                        color: new THREE.Color('#FF0000'),
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
                      child.material = plasticMat;
                    }
                    
                    if (mat.map) {
                      mat.map.needsUpdate = true;
                    }
                  });
                }
              }
            });

            if (fbx.animations && fbx.animations.length > 0) {
              const mixer = new THREE.AnimationMixer(fbx);
              const clip = fbx.animations[0];
              const action = mixer.clipAction(clip);
              action.setLoop(THREE.LoopOnce, 1);
              action.clampWhenFinished = true;
              action.play();
              action.paused = true;
              action.time = 0;
              mixer.update(0);
            }

            const pivotGroup = new THREE.Group();
            pivotGroup.add(fbx);
            scene.add(pivotGroup);
            modelRef.current = pivotGroup;
            
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
      // Stop animation
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
      // Deep dispose all GPU resources (geometries, materials, textures)
      if (sceneRef.current) {
        deepDispose(sceneRef.current);
        sceneRef.current.clear();
        sceneRef.current = null;
      }
      // Dispose renderer (frees WebGL context)
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current && rendererRef.current.domElement) {
          try { containerRef.current.removeChild(rendererRef.current.domElement); } catch (_) {}
        }
        rendererRef.current = null;
      }
      cameraRef.current = null;
      modelRef.current = null;
      threeRef.current = null;
    };
  }, [modelPath, rotationX, materialColor, offsetY]);

  // Handle resize
  useEffect(() => {
    if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;

    const el = containerRef.current;
    const handleResize = () => {
      if (!el || !rendererRef.current || !cameraRef.current) return;
      const width = el.clientWidth;
      const height = el.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(el);

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
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-accent-cyan rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
