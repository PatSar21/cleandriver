// Packs the site into one self-contained HTML file (fonts, CSS and JS inlined),
// for previewing the exact live page where external files can't be loaded.
import { readFile, writeFile } from 'fs/promises';

const SITE = 'site';
const out = process.argv[2];

let css = await readFile(`${SITE}/assets/styles.css`, 'utf8');
for (const f of ['inter-latin-wght-normal', 'inter-tight-latin-wght-normal']) {
  const b64 = (await readFile(`${SITE}/assets/fonts/${f}.woff2`)).toString('base64');
  css = css.replace(`url("fonts/${f}.woff2")`, `url("data:font/woff2;base64,${b64}")`);
}
let js = await readFile(`${SITE}/assets/app.js`, 'utf8');

// Inline the portrait so the preview needs no external files.
const portraitJpg = (await readFile(`${SITE}/assets/portrait.jpg`)).toString('base64');
const portraitWebp = (await readFile(`${SITE}/assets/portrait.webp`)).toString('base64');
js = js
  .replace('assets/portrait.jpg', `data:image/jpeg;base64,${portraitJpg}`)
  .replace('assets/portrait.webp', `data:image/webp;base64,${portraitWebp}`);
const html = await readFile(`${SITE}/index.html`, 'utf8');

let body = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'))
  .replace('<script src="assets/app.js" defer></script>', '');

// The preview can't reach Supabase, so the sign-in panel is replaced by a note
// instead of shipping a button that would do nothing.
body = body.replace(
  '<div class="ex-panel" id="exchange-body"></div>',
  `<div class="ex-panel">
     <p class="ex-intro">Melden Sie sich mit Google an und schreiben Sie mir. Was Sie schreiben, sehen nur Sie und ich — niemand sonst.</p>
     <p class="ex-notice is-ok" style="max-width:56ch">Dieser Bereich funktioniert nur auf der echten Seite — in dieser Vorschau ist die Verbindung zur Datenbank gesperrt.<br><span style="opacity:.8">This part only works on the live site; the preview cannot reach the database.</span></p>
   </div>`);

const page = `<title>Patrick Sarpen</title>
<script>
  // The wrapper supplies its own <head>; make sure a mobile viewport is set.
  if (!document.querySelector('meta[name="viewport"]')) {
    var m = document.createElement('meta');
    m.name = 'viewport';
    m.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
    document.head.appendChild(m);
  }
</script>
<style>${css}</style>
${body}
<script>${js}</script>
`;
await writeFile(out, page);
console.log('wrote', out, (page.length / 1024).toFixed(0) + 'kb');
