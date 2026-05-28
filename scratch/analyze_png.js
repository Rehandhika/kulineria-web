import fs from 'fs';
import path from 'path';

const mapDir = 'd:/Project/Kulineria/kulineria-astro/public/img/map';
const files = fs.readdirSync(mapDir).filter(f => f.endsWith('.png'));

files.forEach(file => {
  const filepath = path.join(mapDir, file);
  const buffer = fs.readFileSync(filepath);
  // Read PNG dimensions from IHDR chunk
  // IHDR starts at byte 12 (length 4 bytes for width, 4 bytes for height)
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  console.log(`${file}: ${width}x${height} (aspect ratio: ${(width/height).toFixed(3)})`);
});
