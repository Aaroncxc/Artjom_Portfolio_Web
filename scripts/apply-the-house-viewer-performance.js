/**
 * Patches public/projects/the-house/index.html:
 * - Lazy-load 3D after user click (lighter first paint).
 * - Load compressed model.glb via GLTFLoader + MeshoptDecoder + DRACOLoader (was 58 MB FBX).
 */
const fs = require('fs');

const INDEX = require('path').join(__dirname, '../public/projects/the-house/index.html');

const CSS_BLOCK = `
    #lazy-load-overlay {
      position: absolute;
      inset: 0;
      z-index: 30;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 24px;
      background: linear-gradient(135deg, rgba(245, 247, 250, 0.95) 0%, rgba(232, 236, 241, 0.98) 100%);
      backdrop-filter: blur(8px);
      text-align: center;
    }
    #lazy-load-overlay.hidden {
      display: none;
    }
    #lazy-load-overlay .poster-wrap {
      width: min(92vw, 520px);
      aspect-ratio: 16 / 10;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(28, 28, 28, 0.12);
      border: 1px solid rgba(28, 28, 28, 0.08);
    }
    #lazy-load-overlay img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    #lazy-load-overlay .lazy-copy {
      max-width: 420px;
      color: rgba(28, 28, 28, 0.65);
      font-size: 14px;
      line-height: 1.5;
    }
    #lazy-load-overlay #lazy-load-btn {
      pointer-events: auto;
      margin-top: 4px;
      padding: 14px 28px;
      border-radius: 999px;
      border: none;
      background: #14B8A6;
      color: white;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(20, 184, 166, 0.35);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    #lazy-load-overlay #lazy-load-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(20, 184, 166, 0.45);
    }
`;

const NEW_LOAD_MODEL = `    async function loadModel() {
      await MeshoptDecoder.ready;

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);
      loader.setMeshoptDecoder(MeshoptDecoder);

      await new Promise((resolve, reject) => {
        loader.load(
          './model.glb',
          (gltf) => {
            const root = gltf.scene;

            const box = new THREE.Box3().setFromObject(root);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 5 / maxDim;

            root.scale.setScalar(scale);
            root.updateMatrixWorld(true);

            const boxScaled = new THREE.Box3().setFromObject(root);
            const center = boxScaled.getCenter(new THREE.Vector3());
            root.position.set(-center.x, -boxScaled.min.y, -center.z);

            root.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;

                const meshName = (child.name || '').toUpperCase();
                if (meshName.includes('DACH') || meshName.includes('ROOF') || meshName.includes('AUSBLENDEN')) {
                  console.log('Found roof mesh:', child.name);
                  roofMesh = child;
                  if (child.material) {
                    const mats = Array.isArray(child.material) ? child.material : [child.material];
                    mats.forEach((mat) => {
                      mat.transparent = true;
                      mat.opacity = 1.0;
                    });
                  }
                }

                if (child.material) {
                  const mats = Array.isArray(child.material) ? child.material : [child.material];
                  mats.forEach((mat) => {
                    mat.metalness = 0.1;
                    mat.roughness = 0.7;
                    if (mat.map) mat.map.needsUpdate = true;
                  });
                }
              }
            });

            if (!roofMesh) {
              console.log('No roof mesh found. Available meshes:');
              root.traverse((child) => {
                if (child.isMesh) console.log('  -', child.name);
              });
            }

            scene.add(root);
            model = root;

            const stats = countGeometry(root);
            vertexCountEl.textContent = formatNumber(stats.vertices);
            triangleCountEl.textContent = formatNumber(stats.triangles);

            wireframeGroup = new THREE.Group();
            root.updateMatrixWorld(true);
            root.traverse((child) => {
              if (child.isMesh) {
                const wireGeo = new THREE.WireframeGeometry(child.geometry);
                const wireMat = new THREE.LineBasicMaterial({ color: 0x14B8A6, transparent: true, opacity: 0.7 });
                const wire = new THREE.LineSegments(wireGeo, wireMat);
                wire.matrix.copy(child.matrixWorld);
                wire.matrixAutoUpdate = false;
                wireframeGroup.add(wire);
              }
            });
            wireframeGroup.visible = false;
            scene.add(wireframeGroup);

            collisionMeshes = [];
            root.traverse((child) => {
              if (child.isMesh && child !== roofMesh) {
                collisionMeshes.push(child);
              }
            });
            console.log('Collision meshes:', collisionMeshes.length);

            loadingEl.classList.add('hidden');
            resolve();
          },
          (progress) => {
            if (progress.total > 0) {
              progressEl.textContent = Math.round((progress.loaded / progress.total) * 100) + '%';
            }
          },
          (error) => {
            console.error('Error loading model:', error);
            progressEl.textContent = 'Failed to load model';
            reject(error);
          }
        );
      });
    }

`;

function main() {
  let html = fs.readFileSync(INDEX, 'utf8');

  if (html.includes('id="lazy-load-overlay"')) {
    console.log('Already patched; skipping.');
    return;
  }

  html = html.replace(
    '<!DOCTYPE html>',
    '<!DOCTYPE html>\n<!-- Perf: the-house viewer — baseline model.glb ~7.1 MB (2026-05); optimized glb ~3.52 MB; viewer previously fetched model.fbx ~58 MB on load. -->'
  );

  html = html.replace(
    '#canvas-container canvas {\r\n      display: block;\r\n    }\r\n    \r\n    .top-bar',
    `#canvas-container canvas {\r\n      display: block;\r\n    }\r\n${CSS_BLOCK}\r\n    .top-bar`
  );

  html = html.replace(
    '<div id="canvas-container"></div>\r\n    \r\n    <div class="loading" id="loading">',
    '<div id="canvas-container"></div>\r\n    \r\n    <div id="lazy-load-overlay">\r\n      <div class="poster-wrap">\r\n        <img src="./The_House_Thumbnail.png" alt="" width="960" height="600" decoding="async" fetchpriority="high" />\r\n      </div>\r\n      <p class="lazy-copy">Das interaktive 3D-Modell lädt erst beim Tippen — weniger Daten beim ersten Laden.</p>\r\n      <button type="button" id="lazy-load-btn">3D-Ansicht laden</button>\r\n    </div>\r\n    \r\n    <div class="loading hidden" id="loading">'
  );

  html = html.replace(
    "import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';",
    "import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';\r\n    import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';\r\n    import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';"
  );

  html = html.replace(
    'const triangleCountEl = document.getElementById(\'triangle-count\');\r\n\r\n    function init()',
    "const triangleCountEl = document.getElementById('triangle-count');\r\n\r\n    function wireLazyModelLoad() {\r\n      const lazyOverlay = document.getElementById('lazy-load-overlay');\r\n      const lazyBtn = document.getElementById('lazy-load-btn');\r\n      lazyBtn.addEventListener('click', async () => {\r\n        lazyOverlay.classList.add('hidden');\r\n        loadingEl.classList.remove('hidden');\r\n        try {\r\n          await loadModel();\r\n        } catch (_) {\r\n          loadingEl.classList.add('hidden');\r\n          lazyOverlay.classList.remove('hidden');\r\n        }\r\n      });\r\n    }\r\n\r\n    function init()"
  );

  html = html.replace(
    '      loadModel();\r\n      window.addEventListener(\'resize\', onResize);',
    "      vertexCountEl.textContent = '\\u2014';\r\n      triangleCountEl.textContent = '\\u2014';\r\n      wireLazyModelLoad();\r\n      window.addEventListener('resize', onResize);"
  );

  const start = html.indexOf('function loadModel()');
  const end = html.indexOf('function onResize()', start);
  if (start === -1 || end === -1) {
    throw new Error('Could not locate loadModel / onResize boundaries');
  }
  html = html.slice(0, start) + NEW_LOAD_MODEL + html.slice(end);

  fs.writeFileSync(INDEX, html);
  console.log('Patched', INDEX);
}

main();
