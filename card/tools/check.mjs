import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname, join, normalize } from 'path';

const ROOT = process.argv[2];
const OUT = process.argv[3];
const TYPES = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.woff2':'font/woff2', '.vcf':'text/vcard', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml' };

const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  try {
    const buf = await readFile(join(ROOT, normalize(p)));
    res.writeHead(200, { 'Content-Type': TYPES[extname(p)] || 'application/octet-stream' });
    res.end(buf);
  } catch { res.writeHead(404); res.end('nf'); }
});
await new Promise(r => server.listen(4321, r));

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const errors = [];

async function shot(name, opts) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') errors.push(`[${name}] ${m.text()}`); });
  page.on('pageerror', e => errors.push(`[${name}] PAGEERROR ${e.message}`));
  page.on('requestfailed', r => errors.push(`[${name}] FAILED ${r.url()} ${r.failure()?.errorText}`));
  await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.evaluate(() => { document.querySelectorAll('.reveal').forEach(n => n.classList.add('in')); });
  await page.waitForTimeout(300);
  const tg = await page.$('.tl-toggle');
  if (tg) { await tg.click(); await page.waitForTimeout(250); }
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  // sanity probes
  const probe = await page.evaluate(() => ({
    docW: document.documentElement.scrollWidth,
    winW: window.innerWidth,
    qr: !!document.querySelector('#qr svg'),
    projects: document.querySelectorAll('.proj').length,
    timeline: document.querySelectorAll('.tl-item').length,
    stats: document.querySelectorAll('.stat').length,
    tagline: (document.querySelector('.tagline')||{}).textContent?.length || 0,
    about: document.querySelectorAll('#about-body p').length,
    fontLoaded: document.fonts.check('700 40px "Inter Tight"'),
    timelineHidden: document.querySelectorAll('.tl-more .tl-item').length,
    toggle: !!document.querySelector('.tl-toggle')
  }));
  console.log(name, JSON.stringify(probe));
  if (probe.docW > probe.winW + 1) errors.push(`[${name}] HORIZONTAL OVERFLOW ${probe.docW} > ${probe.winW}`);
  await ctx.close();
}

await shot('desktop', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await shot('mobile', { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });

// language switch check
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on('pageerror', e => errors.push(`[lang] PAGEERROR ${e.message}`));
await page.goto('http://127.0.0.1:4321/', { waitUntil: 'networkidle' });
await page.click('.lang button[data-lang="en"]');
await page.waitForTimeout(400);
const en = await page.evaluate(() => ({ role: document.querySelector('.role').textContent, lang: document.documentElement.lang, title: document.title }));
console.log('after-EN', JSON.stringify(en));
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(n => n.classList.add('in')));
await page.screenshot({ path: `${OUT}/desktop-en.png`, fullPage: true });
await ctx.close();

console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'NO CONSOLE ERRORS');
await browser.close();
server.close();
