// Renders the link preview image (shown when the URL is shared in WhatsApp,
// LinkedIn, Slack, iMessage) by screenshotting a purpose-built card.
import { chromium } from 'playwright';
import { readFile, writeFile } from 'fs/promises';

const b64 = async (p) => (await readFile(p)).toString('base64');

const inter = await b64('site/assets/fonts/inter-latin-wght-normal.woff2');
const interTight = await b64('site/assets/fonts/inter-tight-latin-wght-normal.woff2');
const portrait = await b64('site/assets/portrait.jpg');

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:"Inter";font-weight:100 900;src:url(data:font/woff2;base64,${inter}) format("woff2-variations")}
@font-face{font-family:"Inter Tight";font-weight:100 900;src:url(data:font/woff2;base64,${interTight}) format("woff2-variations")}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#08090c;font-family:Inter,sans-serif;color:#f2f4f8;
  display:flex;align-items:center;gap:64px;padding:0 80px;position:relative;overflow:hidden}
body::before{content:"";position:absolute;inset:0;
  background:radial-gradient(60rem 40rem at 12% -20%,rgba(109,139,255,.28),transparent 60%),
             radial-gradient(46rem 34rem at 96% 10%,rgba(181,123,255,.20),transparent 62%)}
.txt{position:relative;flex:1}
.eyebrow{display:inline-block;padding:8px 18px;border-radius:99px;background:rgba(109,139,255,.16);
  border:1px solid rgba(109,139,255,.3);color:#c3cdff;font-size:19px;font-weight:600;
  letter-spacing:.09em;text-transform:uppercase}
h1{font-family:"Inter Tight";font-size:86px;line-height:.98;letter-spacing:-.04em;font-weight:700;margin:28px 0 0;
  background:linear-gradient(170deg,#fff 30%,#b8c1d9);-webkit-background-clip:text;color:transparent}
.role{margin-top:20px;font-size:30px;font-weight:500;color:#6d8bff;letter-spacing:-.01em}
.meta{margin-top:26px;font-size:23px;color:#a6adbb}
.pic{position:relative;flex:none}
.pic img{width:330px;height:330px;border-radius:50%;object-fit:cover;
  border:1px solid rgba(255,255,255,.18);display:block}
.pic::after{content:"";position:absolute;inset:-26px;border-radius:50%;z-index:-1;
  background:conic-gradient(from 160deg,rgba(109,139,255,.6),rgba(181,123,255,.4),transparent 55%,rgba(109,139,255,.6));
  filter:blur(34px)}
</style>
<div class="txt">
  <span class="eyebrow">Digitale Visitenkarte</span>
  <h1>Patrick Sarpen</h1>
  <div class="role">Senior Full Cycle Sales Manager &amp; Gründer</div>
  <div class="meta">Berlin · 20+ Jahre Vertrieb · CleanDriver, Rhythmus</div>
</div>
<div class="pic"><img src="data:image/jpeg;base64,${portrait}"></div>`;

await writeFile('/tmp/og.html', html);

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto('file:///tmp/og.html', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: 'site/assets/og.jpg', type: 'jpeg', quality: 88 });
await browser.close();
console.log('wrote site/assets/og.jpg');
