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
const js = await readFile(`${SITE}/assets/app.js`, 'utf8');
const html = await readFile(`${SITE}/index.html`, 'utf8');

const body = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'))
  .replace('<script src="assets/app.js" defer></script>', '');

const page = `<title>Patrick Sarpen</title>
<style>${css}</style>
${body}
<script>${js}</script>
`;
await writeFile(out, page);
console.log('wrote', out, (page.length / 1024).toFixed(0) + 'kb');
