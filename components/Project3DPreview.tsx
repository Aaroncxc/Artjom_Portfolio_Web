'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Project3DPreviewProps {
  modelPath: string;
  isHovered: boolean;
  mousePosition: { x: number; y: number };
  rotationX?: number;
  materialColor?: string;
  offsetY?: number;
  /** If load fails / times out, show this poster so the tile is not empty on hover. */
  fallbackPoster?: string | null;
  /** Modal-only: VERTICES / TRIANGLES HUD (matches standalone HTML viewers). */
  showMeshStatsOverlay?: boolean;
  /**
   * 0..1 progress along the first animation clip used for the static preview pose.
   * Default 0 (time = 0). Use 1 when the closed/finished state sits at clip.duration.
   */
  animationProgress?: number;
}

function countMeshStats(root: any): { vertices: number; triangles: number } {
  let vertices = 0;
  let triangles = 0;
  root.traverse?.((child: any) => {
    if (!child?.isMesh || !child.geometry) return;
    const g = child.geometry;
    const pos = g.attributes?.position;
    if (!pos?.count) return;
    vertices += pos.count;
    const idx = g.index;
    if (idx?.count) triangles += idx.count / 3;
    else triangles += pos.count / 3;
  });
  return { vertices: Math.round(vertices), triangles: Math.round(triangles) };
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

const PREVIEW_LOAD_TIMEOUT_MS = 60_000;

export function Project3DPreview({
  modelPath,
  isHovered,
  mousePosition,
  rotationX = -90,
  materialColor,
  offsetY = -0.3,
  fallbackPoster,
  showMeshStatsOverlay = false,
  animationProgress = 0,
}: Project3DPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const frameRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [meshStats, setMeshStats] = useState<{ vertices: number; triangles: number } | null>(null);
  const [error, setError] = useState(false);
  const loadFinishedRef = useRef(false);
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
    loadFinishedRef.current = false;
    setMeshStats(null);

    const loadTimeout = window.setTimeout(() => {
      if (!mounted || loadFinishedRef.current) return;
      console.warn('[Project3DPreview] Load timeout:', modelPath);
      setError(true);
    }, PREVIEW_LOAD_TIMEOUT_MS);

    const isGlb = /\.glb($|\?)/i.test(modelPath);


    const initScene = async () => {
      try {
        const THREE = await import('three');

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

        let loader: { load: (url: string, onLoad: (asset: unknown) => void, onProgress?: unknown, onError?: (err: unknown) => void) => void };
        if (isGlb) {
          const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
          const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');
          const draco = new DRACOLoader();
          draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
          draco.setDecoderConfig({ type: 'js' });
          const gltf = new GLTFLoader();
          gltf.setDRACOLoader(draco);
          loader = {
            load: (url, onLoad, onProgress, onError) => {
              gltf.load(url, (data: any) => {
                // GLTF animations live on the top-level result, not on `.scene`.
                // Attach them so downstream code (mixer setup) finds them at `asset.animations`.
                if (data && data.scene) data.scene.animations = data.animations || [];
                onLoad(data.scene);
              }, onProgress as any, onError as any);
            },
          };
        } else {
          const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js');
          loader = new FBXLoader();
        }

        loader.load(
          modelPath,
          (asset) => {
            if (!mounted) return;
            const fbx = asset as any;

            const box = new THREE.Box3().setFromObject(fbx);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            if (!Number.isFinite(maxDim) || maxDim < 1e-6) {
              console.warn('[Project3DPreview] Empty / invalid bounding box:', modelPath);
              loadFinishedRef.current = true;
              clearTimeout(loadTimeout);
              setError(true);
              return;
            }
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
            const isPultModel = modelPath.includes('pult-vacuum');

            fbx.traverse((child: any) => {
              if (child.isMesh && child.material) {

                if (isPultModel) {
                  // Transparent PNG decals on flat planes — same heuristic as `pult-vacuum/index.html`
                  const geo = child.geometry;
                  const vtxCount = geo?.attributes?.position?.count ?? 999;
                  const meshNameLc = (child.name || '').toLowerCase();
                  const nameHintPlane =
                    meshNameLc.includes('plane') ||
                    meshNameLc.includes('label') ||
                    meshNameLc.includes('logo') ||
                    meshNameLc.includes('sign') ||
                    meshNameLc.includes('decal') ||
                    meshNameLc.includes('bild');
                  const isActualPlane =
                    vtxCount <= (isGlb ? 48 : 6) &&
                    nameHintPlane;
                  const decalMatArr = Array.isArray(child.material) ? child.material : [child.material];
                  if (isActualPlane && decalMatArr.some((m: any) => m?.map)) {
                    const srcMat = decalMatArr.find((m: any) => m?.map);
                    if (srcMat?.map) {
                      const tex = srcMat.map;
                      tex.colorSpace = THREE.SRGBColorSpace;
                      child.material = new THREE.MeshBasicMaterial({
                        map: tex,
                        transparent: true,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                        alphaTest: 0.05,
                      });
                      child.castShadow = false;
                      child.renderOrder = 1;
                      return;
                    }
                  }

                  // Mirror /projects/pult-vacuum/index.html — keep tile preview colors
                  // consistent with the interactive Live 3D viewer.
                  const PULT_ORANGE = 0xFF8C00;
                  const mats = Array.isArray(child.material) ? child.material : [child.material];
                  const newMats = mats.map((mat: any) => {
                    const matName = (mat.name || '').toLowerCase();
                    const r = mat.color?.r ?? 0.5;
                    const g = mat.color?.g ?? 0.5;
                    const b = mat.color?.b ?? 0.5;

                    if (
                      matName.includes('orange') ||
                      matName.includes('accent') ||
                      matName.includes('copper') ||
                      matName.includes('gold') ||
                      (r > 0.6 && g > 0.3 && b < 0.35)
                    ) {
                      return new THREE.MeshStandardMaterial({
                        color: new THREE.Color(PULT_ORANGE),
                        roughness: 0.25,
                        metalness: 0.5,
                        side: THREE.DoubleSide,
                      });
                    }
                    if (
                      matName.includes('black') ||
                      matName.includes('dark') ||
                      (r < 0.2 && g < 0.2 && b < 0.2)
                    ) {
                      return new THREE.MeshStandardMaterial({
                        color: new THREE.Color(0x1a1a1a),
                        roughness: 0.35,
                        metalness: 0.6,
                        side: THREE.DoubleSide,
                      });
                    }
                    if (
                      matName.includes('gray') ||
                      matName.includes('grey') ||
                      matName.includes('metal') ||
                      matName.includes('gear')
                    ) {
                      return new THREE.MeshStandardMaterial({
                        color: new THREE.Color(0x888888),
                        roughness: 0.4,
                        metalness: 0.7,
                        side: THREE.DoubleSide,
                      });
                    }
                    if (
                      matName.includes('white') ||
                      matName.includes('body') ||
                      (r > 0.85 && g > 0.85 && b > 0.85)
                    ) {
                      return new THREE.MeshStandardMaterial({
                        color: new THREE.Color(0xf5f5f0),
                        roughness: 0.5,
                        metalness: 0.1,
                        side: THREE.DoubleSide,
                      });
                    }
                    const hasTex = !!mat.map;
                    if (hasTex && mat.map) {
                      mat.map.colorSpace = THREE.SRGBColorSpace;
                    }
                    return new THREE.MeshStandardMaterial({
                      color: hasTex ? new THREE.Color(0xffffff) : (mat.color ? mat.color.clone() : new THREE.Color(0xcccccc)),
                      map: hasTex ? mat.map : null,
                      transparent: hasTex,
                      alphaTest: hasTex ? 0.05 : 0,
                      side: THREE.DoubleSide,
                      roughness: 0.45,
                      metalness: hasTex ? 0.0 : 0.4,
                    });
                  });
                  child.material = Array.isArray(child.material) ? newMats : newMats[0];
                  return;
                }

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
                  // Only re-skin materials when the project explicitly opts in via `model3dMaterialColor`.
                  // Models without that flag (e.g. mask-sculpture, the-house) keep their authored PBR materials.
                  const allowPlasticOverride = !!materialColor;
                  mats.forEach((mat: any) => {
                    const matName = (mat.name || '').toLowerCase();
                    const isPlasticMaterial =
                      allowPlasticOverride && (matName.includes('plastic') || matName.includes('transparent'));

                    if (isPlasticMaterial) {
                      const plasticMat = new THREE.MeshPhysicalMaterial({
                        color: new THREE.Color(materialColor),
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
                      return;
                    }

                    if (allowPlasticOverride) {
                      mat.metalness = 0.1;
                      mat.roughness = 0.6;
                    }

                    if (mat.map) {
                      mat.map.needsUpdate = true;
                    }
                  });
                }
              }
            });

            if (showMeshStatsOverlay && mounted) {
              setMeshStats(countMeshStats(fbx));
            }

            if (fbx.animations && fbx.animations.length > 0) {
              const mixer = new THREE.AnimationMixer(fbx);
              const clip = fbx.animations[0];
              const action = mixer.clipAction(clip);
              action.setLoop(THREE.LoopOnce, 1);
              action.clampWhenFinished = true;
              action.enabled = true;
              action.play();
              action.paused = true;
              const clamped = Math.min(1, Math.max(0, animationProgress));
              action.time = clip.duration * clamped;
              mixer.update(0);
            }

            const pivotGroup = new THREE.Group();
            pivotGroup.add(fbx);
            scene.add(pivotGroup);
            modelRef.current = pivotGroup;

            loadFinishedRef.current = true;
            clearTimeout(loadTimeout);
            setIsLoaded(true);
          },
          undefined,
          (err) => {
            console.error('Error loading 3D preview:', err);
            loadFinishedRef.current = true;
            clearTimeout(loadTimeout);
            setError(true);
          }
        );

      } catch (err) {
        console.error('Failed to initialize 3D preview:', err);
        loadFinishedRef.current = true;
        clearTimeout(loadTimeout);
        setError(true);
      }
    };

    initScene();

    return () => {
      mounted = false;
      clearTimeout(loadTimeout);
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
  }, [modelPath, rotationX, materialColor, offsetY, fallbackPoster, showMeshStatsOverlay, animationProgress]);

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

  if (error && fallbackPoster) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 z-10 overflow-hidden bg-[linear-gradient(135deg,rgba(248,250,252,1)_0%,rgba(241,245,249,1)_100%)]"
      >
        <img src={fallbackPoster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-95" loading="lazy" />
        <p className="absolute bottom-2 left-2 right-2 rounded-lg bg-black/55 px-2 py-1.5 text-center text-[11px] font-medium leading-snug text-white backdrop-blur-sm">
          3D preview unavailable (file may be large or incompatible). Showing image.
        </p>
      </div>
    );
  }

  if (error) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10 opacity-100"
      style={{
        background: 'linear-gradient(135deg, rgba(248,250,252,1) 0%, rgba(241,245,249,1) 100%)'
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-accent-cyan rounded-full animate-spin" />
        </div>
      )}
      {showMeshStatsOverlay && meshStats && (
        <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 rounded-lg border border-[rgba(28,28,28,0.08)] bg-white/75 px-2.5 py-1 backdrop-blur-md">
            <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-mk-text-secondary">
              Vertices
            </span>
            <span className="tabular-nums text-xs font-semibold text-mk-text">
              {meshStats.vertices.toLocaleString('en-US')}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[rgba(28,28,28,0.08)] bg-white/75 px-2.5 py-1 backdrop-blur-md">
            <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-mk-text-secondary">
              Triangles
            </span>
            <span className="tabular-nums text-xs font-semibold text-mk-text">
              {meshStats.triangles.toLocaleString('en-US')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
