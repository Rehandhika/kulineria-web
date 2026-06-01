import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const FOODS_DIR = path.resolve('public/img/foods');

async function optimizeFoods() {
  console.log('--- Starting Foods Image Optimization ---');
  if (!fs.existsSync(FOODS_DIR)) {
    console.error(`Directory not found: ${FOODS_DIR}`);
    return;
  }

  const files = fs.readdirSync(FOODS_DIR).filter(file => file.endsWith('.png'));
  console.log(`Found ${files.length} PNG food images to optimize.`);

  let totalSaved = 0;

  for (const file of files) {
    const fullPath = path.join(FOODS_DIR, file);
    const statsBefore = fs.statSync(fullPath);
    const sizeKbBefore = statsBefore.size / 1024;

    // Skip if already very small (e.g. < 50KB) to avoid double compression
    if (sizeKbBefore < 50) {
      console.log(`Skipping ${file} - already optimized (${sizeKbBefore.toFixed(1)} KB)`);
      continue;
    }

    const tempPath = fullPath + '.tmp';

    try {
      // Resize to 480px width (since they render inside 300px-400px columns)
      // Apply palette-based PNG quantization, compressionLevel 9, quality 75
      await sharp(fullPath)
        .resize({ width: 480, withoutEnlargement: true })
        .png({ quality: 75, compressionLevel: 9, palette: true })
        .toFile(tempPath);

      const statsAfter = fs.statSync(tempPath);
      const sizeKbAfter = statsAfter.size / 1024;
      const saved = sizeKbBefore - sizeKbAfter;
      totalSaved += saved;

      fs.renameSync(tempPath, fullPath);
      console.log(`Optimized ${file}: ${sizeKbBefore.toFixed(1)} KB -> ${sizeKbAfter.toFixed(1)} KB (Saved ${saved.toFixed(1)} KB)`);
    } catch (err) {
      console.error(`Failed to optimize ${file}:`, err);
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }

  console.log(`--- Foods Image Optimization Completed ---`);
  console.log(`Total Space Saved: ${(totalSaved / 1024).toFixed(2)} MB`);
}

optimizeFoods();
