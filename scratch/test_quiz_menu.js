import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  console.log("Navigating to localhost:4321/kuis ...");
  try {
    await page.goto('http://localhost:4321/kuis', { waitUntil: 'networkidle' });
    console.log("Navigation complete. Waiting a bit for JS to execute...");
    await page.waitForTimeout(2000);
  } catch (err) {
    console.error("Navigation failed:", err);
  }
  
  await browser.close();
  console.log("Done.");
})();
