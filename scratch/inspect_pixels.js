import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const mapDir = 'd:/Project/Kulineria/kulineria-astro/public/img/map';
const files = fs.readdirSync(mapDir).filter(f => f.endsWith('.png'));

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Analyzing image transparency bounds using browser canvas...');
  
  for (const file of files) {
    const filePath = path.join(mapDir, file);
    const dataUrl = `data:image/png;base64,${fs.readFileSync(filePath).toString('base64')}`;
    
    const bounds = await page.evaluate(async (src) => {
      const img = new Image();
      img.src = src;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = -1;
      let maxY = -1;
      
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const idx = (y * canvas.width + x) * 4;
          const alpha = data[idx + 3];
          if (alpha > 5) { // alpha > 5 to ignore compression noise
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
          }
        }
      }
      
      return {
        width: img.width,
        height: img.height,
        minX,
        minY,
        maxX,
        maxY,
        islandWidth: maxX - minX + 1,
        islandHeight: maxY - minY + 1,
      };
    }, dataUrl);
    
    console.log(`\n--- ${file} ---`);
    console.log(`File Size: ${bounds.width}x${bounds.height}`);
    console.log(`Non-transparent bounds: X:[${bounds.minX}, ${bounds.maxX}], Y:[${bounds.minY}, ${bounds.maxY}]`);
    console.log(`Island actual size: ${bounds.islandWidth}x${bounds.islandHeight} (aspect ratio: ${(bounds.islandWidth/bounds.islandHeight).toFixed(3)})`);
    console.log(`Padding: Left: ${bounds.minX}px, Right: ${bounds.width - 1 - bounds.maxX}px, Top: ${bounds.minY}px, Bottom: ${bounds.height - 1 - bounds.maxY}px`);
  }
  
  await browser.close();
})();
