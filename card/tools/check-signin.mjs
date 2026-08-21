// Walks the email sign-in flow end to end with the Supabase call stubbed.
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';

const REF = 'yfygdyeirrkrvczujxdd';
const TYPES = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.woff2':'font/woff2', '.jpg':'image/jpeg', '.webp':'image/webp' };
const OUT = process.argv[2];

const server = createServer(async (req, res) => {
  let p = req.url.split('?')[0]; if (p === '/') p = '/index.html';
  try { const b = await readFile(join('site', p));
    res.writeHead(200, { 'Content-Type': TYPES[extname(p)] || 'text/plain' }); res.end(b);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(4388, r));

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const errors = [];
let otpCalls = [];

const ctx = await browser.newContext({ viewport: { width: 900, height: 900 } });
const page = await ctx.newPage();
page.on('pageerror', e => errors.push('PAGEERROR ' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

let failNext = false;
await page.route(`https://${REF}.supabase.co/**`, (route) => {
  const url = route.request().url();
  if (url.includes('/auth/v1/otp')) {
    otpCalls.push({ url: url, body: JSON.parse(route.request().postData() || '{}') });
    if (failNext) return route.fulfill({ status: 429, contentType: 'application/json',
      body: JSON.stringify({ error: 'over_email_send_rate_limit', message: 'rate limited' }) });
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  }
  return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
});

await page.goto('http://127.0.0.1:4388/', { waitUntil: 'networkidle' });
await page.click('.lang button[data-lang="de"]');
await page.waitForTimeout(500);

const step = async (label) => {
  const t = await page.$eval('#exchange-body', n => n.innerText.replace(/\n+/g, ' | '));
  console.log(`\n[${label}] ${t}`);
};

await step('signed out');
console.log('google button visible:', await page.$$eval('#ex-signin', n => n.length));

// 1. invalid address
await page.fill('#ex-mail-form input[name=email]', 'nonsense');
await page.click('#ex-mail-form button[type=submit]');
await page.waitForTimeout(300);
await step('invalid address');
console.log('network calls so far (must be 0):', otpCalls.length);

// 2. server refuses
failNext = true;
await page.fill('#ex-mail-form input[name=email]', 'anna@beispiel.de');
await page.click('#ex-mail-form button[type=submit]');
await page.waitForTimeout(600);
await step('server refused');

// 3. success
failNext = false;
await page.fill('#ex-mail-form input[name=email]', 'anna@beispiel.de');
await page.click('#ex-mail-form button[type=submit]');
await page.waitForTimeout(600);
await step('link sent');
console.log('otp request:', JSON.stringify(otpCalls.at(-1)));
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(n => n.classList.add('in')));
await page.locator('#exchange').screenshot({ path: `${OUT}/signin-sent.png` });

// 4. back to the form
await page.click('#ex-again');
await page.waitForTimeout(300);
await step('back to form');
await page.locator('#exchange').screenshot({ path: `${OUT}/signin-form.png` });

// 5. English
await page.click('.lang button[data-lang="en"]');
await page.waitForTimeout(400);
await step('english');

console.log(errors.length ? '\nERRORS:\n' + errors.join('\n') : '\nNO ERRORS');
await browser.close();
server.close();
