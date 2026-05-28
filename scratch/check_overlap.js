import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
  
  // Inject some CSS to highlight the region wrappers and actual images
  await page.evaluate(() => {
    // Let's draw a border around each map-region-path button
    const paths = document.querySelectorAll('.map-region-path');
    paths.forEach((p, idx) => {
      const colors = ['red', 'green', 'blue', 'orange', 'purple', 'cyan'];
      const color = colors[idx % colors.length];
      
      // Add a border to the button itself
      p.style.outline = `2px dashed ${color}`;
      p.style.outlineOffset = '2px';
      
      // Create a label
      const label = document.createElement('div');
      label.innerText = p.id.replace('region-wrap-', '');
      label.style.position = 'absolute';
      label.style.top = '0';
      label.style.left = '0';
      label.style.background = 'white';
      label.style.color = color;
      label.style.padding = '2px 4px';
      label.style.fontSize = '10px';
      label.style.fontWeight = 'bold';
      label.style.zIndex = '999';
      p.appendChild(label);
    });
  });
  
  console.log('Taking overlapping borders screenshot...');
  const element = await page.$('.map-section');
  if (element) {
    await element.screenshot({ path: 'd:/Project/Kulineria/kulineria-astro/scratch/overlap_highlight.png' });
    console.log('Highlight screenshot saved to scratch/overlap_highlight.png');
  }
  
  await browser.close();
})();
