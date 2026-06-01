import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = path.resolve('public');
const IMAGES_TO_OPTIMIZE = [
  // Nara Mascot
  'img/nara/NARA 1.png',
  'img/nara/NARA 2.png',
  'img/nara/NARA 3.png',
  'img/nara/NARA 4.png',
  'img/nara/NARA 5.png',
  // Food Arch
  'img/makanan/Gado22.png',
  'img/makanan/Rendang2.png',
  'img/makanan/Sate2.png',
  'img/makanan/Sup Iga.png'
];

async function optimize() {
  console.log('--- Starting Image Optimization ---');
  for (const relPath of IMAGES_TO_OPTIMIZE) {
    const fullPath = path.join(PUBLIC_DIR, relPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`[WARN] File not found: ${fullPath}`);
      continue;
    }

    const statsBefore = fs.statSync(fullPath);
    const sizeMbBefore = (statsBefore.size / (1024 * 1024)).toFixed(2);
    console.log(`Optimizing: ${relPath} (${sizeMbBefore} MB)`);

    const tempPath = fullPath + '.tmp';

    try {
      // Read PNG, resize to max 800px width (since they are rendered small anyways)
      // Compress with palette-based PNG quant and strip metadata
      await sharp(fullPath)
        .resize({ width: 800, withoutEnlargement: true })
        .png({ quality: 80, compressionLevel: 9, palette: true })
        .toFile(tempPath);

      const statsAfter = fs.statSync(tempPath);
      const sizeMbAfter = (statsAfter.size / 1024).toFixed(1);
      const ratio = ((1 - statsAfter.size / statsBefore.size) * 100).toFixed(1);

      fs.renameSync(tempPath, fullPath);
      console.log(`  -> Completed: ${sizeMbAfter} KB (Reduced by ${ratio}%)`);
    } catch (err) {
      console.error(`  -> Failed: ${relPath}`, err);
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }
  console.log('--- Image Optimization Completed ---');
}

optimize();
