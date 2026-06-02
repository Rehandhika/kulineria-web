const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser to connect to running server...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  let url = 'http://localhost:4322/';
  console.log('Connecting to production preview server on', url);
  await page.goto(url);

  await page.waitForTimeout(2000);

  // Print initial hero section opacity
  let heroOpacity = await page.evaluate(() => {
    const hero = document.getElementById('hero-section');
    if (!hero) return 'Not found';
    const bg = hero.querySelector('.hero-bg');
    return bg ? window.getComputedStyle(bg).opacity : 'bg not found';
  });
  console.log('Initial Home page Hero BG opacity:', heroOpacity);

  console.log('\n=== STEP 2: Clicking Quiz CTA Link ===');
  // Wait for the visible qcta button to be ready and click it
  await page.waitForSelector('.qcta-btn');
  await page.click('.qcta-btn');
  await page.waitForTimeout(2000);
  console.log('Current URL after navigating to Quiz:', page.url());

  console.log('\n=== STEP 3: Navigating BACK via history.goBack() ===');
  await page.goBack();
  await page.waitForTimeout(2000);
  console.log('Current URL after going back:', page.url());

  // Check final hero section opacity and attributes
  const heroState = await page.evaluate(() => {
    const hero = document.getElementById('hero-section');
    if (!hero) return { found: false };
    const bg = hero.querySelector('.hero-bg');
    const nara = hero.querySelector('.hero-nara-img');
    return {
      found: true,
      animatedAttr: hero.getAttribute('data-animated'),
      bgOpacity: bg ? window.getComputedStyle(bg).opacity : 'N/A',
      naraOpacity: nara ? window.getComputedStyle(nara).opacity : 'N/A',
    };
  });
  console.log('Final Home page Hero state:', JSON.stringify(heroState, null, 2));

  await browser.close();
  console.log('Test completed.');
  process.exit(0);
})();
