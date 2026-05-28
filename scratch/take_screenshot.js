import { chromium } from 'playwright';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to a typical desktop size
  await page.setViewportSize({ width: 1280, height: 800 });
  
  console.log('Navigating to http://localhost:4322/ ...');
  await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
  
  console.log('Taking screenshot of map section...');
  const element = await page.$('.map-section');
  if (element) {
    await element.screenshot({ path: 'd:/Project/Kulineria/kulineria-astro/scratch/map_screenshot.png' });
    console.log('Screenshot saved to scratch/map_screenshot.png');
  } else {
    console.log('Map section element not found, taking full page screenshot...');
    await page.screenshot({ path: 'd:/Project/Kulineria/kulineria-astro/scratch/page_screenshot.png' });
  }
  
  await browser.close();
})();
