/**
 * Converts every `public/projects/<slug>/model*.fbx` to a Draco-compressed `.glb`.
 *
 * Pipeline: FBX2glTF (Facebook) → gltf-pipeline (Draco compression).
 * Output sits beside the source: `model.fbx` -> `model.glb`, `model-preview.fbx` -> `model-preview.glb`.
 *
 * Run: `npm run convert:3d`
 * Re-run is safe: existing `.glb` files older than the source FBX are regenerated.
 */
const fs = require('fs');
const path = require('path');
const fbx2gltf = require('fbx2gltf');
const { processGlb } = require('gltf-pipeline');

const ROOT = path.join(__dirname, '..', 'public', 'projects');

async function convertOne(fbxPath) {
  const dir = path.dirname(fbxPath);
  const base = path.basename(fbxPath, '.fbx');
  const glbOut = path.join(dir, `${base}.glb`);

  if (fs.existsSync(glbOut)) {
    const srcMtime = fs.statSync(fbxPath).mtimeMs;
    const dstMtime = fs.statSync(glbOut).mtimeMs;
    if (dstMtime >= srcMtime) {
      console.log(`  skip (up to date): ${path.relative(ROOT, glbOut)}`);
      return;
    }
  }

  const tmp = path.join(dir, `${base}.tmp.glb`);
  console.log(`  converting: ${path.relative(ROOT, fbxPath)}`);

  await fbx2gltf(fbxPath, tmp, ['--binary']);
  if (!fs.existsSync(tmp)) throw new Error(`FBX2glTF produced no output for ${fbxPath}`);

  const glbBuffer = fs.readFileSync(tmp);
  const { glb } = await processGlb(glbBuffer, {
    dracoOptions: { compressionLevel: 7 },
  });
  fs.writeFileSync(glbOut, glb);
  fs.unlinkSync(tmp);

  const srcKB = (fs.statSync(fbxPath).size / 1024).toFixed(1);
  const dstKB = (fs.statSync(glbOut).size / 1024).toFixed(1);
  console.log(`  done:       ${path.relative(ROOT, glbOut)}  (${srcKB} KB -> ${dstKB} KB)`);
}

async function main() {
  if (!fs.existsSync(ROOT)) {
    console.error(`Projects directory not found: ${ROOT}`);
    process.exit(1);
  }
  const projects = fs.readdirSync(ROOT, { withFileTypes: true }).filter((d) => d.isDirectory());
  const targets = [];
  for (const dirent of projects) {
    const slugDir = path.join(ROOT, dirent.name);
    for (const file of fs.readdirSync(slugDir)) {
      if (file.toLowerCase().endsWith('.fbx')) targets.push(path.join(slugDir, file));
    }
  }
  if (targets.length === 0) {
    console.log('No FBX files found.');
    return;
  }
  console.log(`Converting ${targets.length} FBX file(s)...`);
  for (const fbx of targets) {
    try {
      await convertOne(fbx);
    } catch (err) {
      console.error(`  failed: ${fbx}\n    ${err && err.message ? err.message : err}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
