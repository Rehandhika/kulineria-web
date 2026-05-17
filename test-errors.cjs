const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

  console.log('--- Visiting /search ---');
  await page.goto('http://localhost:4322/search', { waitUntil: 'networkidle2' });
  let mainHTML = await page.evaluate(() => {
    const main = document.querySelector('main');
    return main ? main.innerHTML : 'No main tag';
  });
  console.log('Search Main length:', mainHTML.length);
  console.log('Search Main preview:', mainHTML);

  console.log('--- Visiting /quiz ---');
  await page.goto('http://localhost:4322/quiz', { waitUntil: 'networkidle2' });
  mainHTML = await page.evaluate(() => {
    const main = document.querySelector('main');
    return main ? main.innerHTML : 'No main tag';
  });
  console.log('Quiz Main length:', mainHTML.length);
  console.log('Quiz Main preview:', mainHTML);

  await browser.close();
})();