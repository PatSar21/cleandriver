// Verifies the signed-in screens by seeding a session and stubbing the API.
// The real Google round-trip can't run in this sandbox (network policy),
// so this exercises everything downstream of it.
import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';

const REF = 'yfygdyeirrkrvczujxdd';
const TYPES = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.woff2':'font/woff2' };
const OUT = process.argv[2];

const server = createServer(async (req, res) => {
  let p = req.url.split('?')[0]; if (p === '/') p = '/index.html';
  try {
    const buf = await readFile(join('site', p));
    res.writeHead(200, { 'Content-Type': TYPES[extname(p)] || 'text/plain' }); res.end(buf);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(4396, r));

const b64url = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const jwt = (email, sub) =>
  `${b64url({ alg:'HS256', typ:'JWT' })}.${b64url({ sub, email, role:'authenticated', exp: Math.floor(Date.now()/1000)+86400 })}.sig`;

const sessionFor = (email, sub, name) => ({
  access_token: jwt(email, sub), token_type: 'bearer', expires_in: 86400,
  expires_at: Math.floor(Date.now()/1000) + 86400, refresh_token: 'r',
  user: { id: sub, aud:'authenticated', role:'authenticated', email,
          user_metadata: { full_name: name, name }, app_metadata: { provider:'google' },
          created_at: new Date().toISOString() }
});

const MESSAGES = {
  visitor: [
    { id:'1', sender_name:'Anna Weber', sender_email:'anna@beispiel.de', company:'Beispiel GmbH',
      body:'Hallo Patrick, wir suchen jemanden für den Aufbau unseres Enterprise-Vertriebs. Hätten Sie Zeit für ein Gespräch?',
      created_at:'2026-08-19T09:12:00Z' }
  ],
  owner: [
    { id:'1', sender_name:'Anna Weber', sender_email:'anna@beispiel.de', company:'Beispiel GmbH',
      body:'Hallo Patrick, wir suchen jemanden für den Aufbau unseres Enterprise-Vertriebs. Hätten Sie Zeit für ein Gespräch?',
      created_at:'2026-08-19T09:12:00Z' },
    { id:'2', sender_name:'Tom Ricci', sender_email:'tom@studio.io', company:null,
      body:'CleanDriver sieht stark aus. Ich baue etwas Ähnliches für Italien — Lust auf Austausch?',
      created_at:'2026-08-17T18:40:00Z' }
  ]
};

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const errors = [];

async function run(label, email, name, rows, viewport) {
  const ctx = await browser.newContext({ viewport });
  await ctx.addInitScript(([key, sess]) => {
    localStorage.setItem(key, JSON.stringify(sess));
    localStorage.setItem('ps-lang', 'de');
  }, [`sb-${REF}-auth-token`, sessionFor(email, email === 'patrick.sarpen21@gmail.com' ? 'owner-id' : 'visitor-id', name)]);

  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`[${label}] PAGEERROR ${e.message}`));
  page.on('console', m => { if (m.type() === 'error' && !m.text().includes('favicon')) errors.push(`[${label}] ${m.text()}`); });

  await page.route(`https://${REF}.supabase.co/**`, (route) => {
    const url = route.request().url();
    if (url.includes('/rest/v1/card_messages')) {
      if (route.request().method() === 'POST') return route.fulfill({ status: 201, contentType: 'application/json', body: '[]' });
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(rows) });
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  await page.goto('http://127.0.0.1:4396/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const text = await page.$eval('#exchange-body', n => n.innerText);
  console.log(`\n===== ${label} =====\n${text}`);

  const probe = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    form: !!document.querySelector('#ex-form'),
    msgs: document.querySelectorAll('.ex-msg').length
  }));
  console.log(label, JSON.stringify(probe));
  if (probe.overflow) errors.push(`[${label}] HORIZONTAL OVERFLOW`);

  await page.evaluate(() => document.querySelectorAll('.reveal').forEach(n => n.classList.add('in')));
  await page.waitForTimeout(400);
  await page.locator('#exchange').screenshot({ path: `${OUT}/${label}.png` });
  await ctx.close();
}

await run('signed-in-visitor', 'anna@beispiel.de', 'Anna Weber', MESSAGES.visitor, { width: 1000, height: 1000 });
await run('signed-in-owner', 'patrick.sarpen21@gmail.com', 'Patrick Sarpen', MESSAGES.owner, { width: 1000, height: 1000 });
await run('signed-in-visitor-mobile', 'anna@beispiel.de', 'Anna Weber', MESSAGES.visitor, { width: 390, height: 844, isMobile: true, hasTouch: true });

console.log(errors.length ? '\nERRORS:\n' + errors.join('\n') : '\nNO ERRORS');
await browser.close();
server.close();
