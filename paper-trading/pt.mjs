#!/usr/bin/env node
// Paper-Trading-Werkzeug fuer den 7-Tage-Test (Claude statt Grok).
// Kein echtes Geld, keine Boerse, keine Wallet. Preise kommen ausschliesslich
// live aus der oeffentlichen Polymarket-API; der Agent kann keine Preise eintragen.
//
//   node pt.mjs init [--start 100] [--days 7]
//   node pt.mjs scan [--limit 300] [--max-days 14]
//   node pt.mjs open --slug S --side YES|NO --estimate 0.62 --stake 5 \
//                    --confidence niedrig|mittel|hoch --reason "..." \
//                    [--for "..."] [--against "..."] [--sources "url1 url2"]
//   node pt.mjs resolve
//   node pt.mjs report
//   node pt.mjs selftest

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = process.env.PT_DATA_DIR || join(HERE, 'data');
const API = 'https://gamma-api.polymarket.com';

// ---------- Hilfsfunktionen ----------

function args(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) out[a.slice(2)] = true;
      else { out[a.slice(2)] = next; i++; }
    } else out._.push(a);
  }
  return out;
}

function fail(msg) {
  console.error(`FEHLER: ${msg}`);
  process.exit(1);
}

// curl statt fetch, weil curl den Proxy der Umgebung (HTTPS_PROXY) beachtet.
function fetchJson(path) {
  if (process.env.PT_FIXTURE) {
    const fx = JSON.parse(readFileSync(process.env.PT_FIXTURE, 'utf8'));
    const key = path.replace(/&end_date_(min|max)=[^&]*/g, '');
    return fx[key] ?? [];
  }
  const url = API + path;
  try {
    const body = execFileSync('curl', ['-sS', '--fail', '-m', '30', url], { encoding: 'utf8' });
    return JSON.parse(body);
  } catch (e) {
    throw new Error(`Abruf fehlgeschlagen (${url}): ${String(e.stderr || e.message).trim()}`);
  }
}

// Die Gamma-API liefert outcomes/outcomePrices als JSON-kodierte Strings.
function parseList(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') { try { return JSON.parse(v); } catch { return []; } }
  return [];
}

function binary(m) {
  const outcomes = parseList(m.outcomes).map(String);
  const prices = parseList(m.outcomePrices).map(Number);
  if (outcomes.length !== 2 || prices.length !== 2 || prices.some((p) => !Number.isFinite(p))) return null;
  const yi = outcomes.findIndex((o) => o.toLowerCase() === 'yes');
  const ni = outcomes.findIndex((o) => o.toLowerCase() === 'no');
  if (yi < 0 || ni < 0) return null;
  return { yes: prices[yi], no: prices[ni] };
}

// Die API liefert geschlossene Maerkte nur mit closed=true, offene nur ohne.
function getMarket(slug) {
  const q = `/markets?slug=${encodeURIComponent(slug)}`;
  for (const path of [q, `${q}&closed=true`]) {
    const res = fetchJson(path);
    const m = (Array.isArray(res) ? res : []).find((x) => x.slug === slug);
    if (m) return m;
  }
  throw new Error(`Markt "${slug}" nicht gefunden`);
}

const ledgerPath = () => join(DATA, 'ledger.json');

function load() {
  if (!existsSync(ledgerPath())) fail('Kein Test angelegt. Zuerst: node pt.mjs init');
  return JSON.parse(readFileSync(ledgerPath(), 'utf8'));
}

function save(l) {
  writeFileSync(ledgerPath(), JSON.stringify(l, null, 2) + '\n');
}

const money = (x) => `$${x.toFixed(2)}`;
const pct = (x) => `${(x * 100).toFixed(1)} %`;

function stats(l) {
  const t = l.trades;
  const open = t.filter((x) => x.status === 'offen');
  const done = t.filter((x) => x.status !== 'offen');
  const wins = done.filter((x) => x.status === 'gewonnen');
  const losses = done.filter((x) => x.status === 'verloren');
  const pnl = done.map((x) => x.payout - x.stake);
  const staked = t.reduce((s, x) => s + x.stake, 0);
  const paid = done.reduce((s, x) => s + x.payout, 0);
  const cash = l.config.startBalance - staked + paid;
  const openCost = open.reduce((s, x) => s + x.stake, 0);
  const balance = cash + openCost; // offene Positionen zum Einstandspreis
  return {
    trades: t.length, open: open.length, wins: wins.length, losses: losses.length,
    largestWin: Math.max(0, ...pnl), largestLoss: Math.min(0, ...pnl),
    cash, openCost, balance,
    ret: (balance - l.config.startBalance) / l.config.startBalance,
  };
}

// ---------- Befehle ----------

function cmdInit(a) {
  if (existsSync(ledgerPath()) && !a.force) fail('Test existiert bereits (mit --force ueberschreiben).');
  mkdirSync(join(DATA, 'snapshots'), { recursive: true });
  const start = new Date();
  const days = Number(a.days ?? 7);
  const l = {
    config: {
      startBalance: Number(a.start ?? 100),
      maxStakePct: Number(a['max-stake-pct'] ?? 0.06),
      minEdge: Number(a['min-edge'] ?? 0.08),
      start: start.toISOString(),
      end: new Date(start.getTime() + days * 864e5).toISOString(),
    },
    trades: [],
  };
  save(l);
  console.log(`Test angelegt: ${money(l.config.startBalance)} Papiergeld, ${days} Tage bis ${l.config.end}`);
}

function cmdScan(a) {
  load();
  const limit = Number(a.limit ?? 1000);
  const maxDays = Number(a['max-days'] ?? 14);
  const horizon = Date.now() + maxDays * 864e5;
  const range = `&end_date_min=${new Date().toISOString()}&end_date_max=${new Date(horizon).toISOString()}`;
  // Die API liefert hoechstens 100 Maerkte pro Seite.
  const all = [];
  for (let offset = 0; offset < limit; offset += 100) {
    const page = fetchJson(`/markets?active=true&closed=false&limit=100&offset=${offset}&order=volume24hr&ascending=false${range}`);
    if (!Array.isArray(page)) break;
    all.push(...page);
    if (page.length < 100) break;
  }
  const rows = [];
  for (const m of all) {
    const p = binary(m);
    const end = Date.parse(m.endDate);
    if (!p || !m.slug || !Number.isFinite(end) || end > horizon || end < Date.now()) continue;
    if (p.yes < 0.03 || p.yes > 0.97) continue;
    rows.push({ slug: m.slug, question: m.question, yes: p.yes, no: p.no, endDate: m.endDate, volume24hr: Number(m.volume24hr) || 0 });
  }
  const stamp = new Date().toISOString().slice(0, 16).replace(':', '-');
  mkdirSync(join(DATA, 'snapshots'), { recursive: true });
  writeFileSync(join(DATA, 'snapshots', `${stamp}.json`), JSON.stringify(rows, null, 2) + '\n');
  console.log(`${all.length} Maerkte geladen, davon ${rows.length} (binaer, Ende in <= ${maxDays} Tagen), Snapshot data/snapshots/${stamp}.json`);
  for (const r of rows.slice(0, 60)) {
    console.log(`- ${r.slug} | JA ${pct(r.yes)} | Ende ${r.endDate.slice(0, 10)} | ${r.question}`);
  }
}

function cmdOpen(a) {
  const l = load();
  const now = Date.now();
  if (now > Date.parse(l.config.end)) fail('Testzeitraum ist vorbei, keine neuen Positionen.');
  for (const k of ['slug', 'side', 'estimate', 'stake', 'confidence', 'reason']) {
    if (a[k] === undefined || a[k] === true) fail(`--${k} fehlt`);
  }
  const side = String(a.side).toUpperCase();
  if (side !== 'YES' && side !== 'NO') fail('--side muss YES oder NO sein');
  const estimate = Number(a.estimate);
  const stake = Number(a.stake);
  if (!(estimate > 0 && estimate < 1)) fail('--estimate muss zwischen 0 und 1 liegen (Wahrscheinlichkeit fuer JA)');
  if (!(stake > 0)) fail('--stake muss > 0 sein');
  if (l.trades.some((t) => t.slug === a.slug && t.status === 'offen')) fail('Auf diesen Markt gibt es schon eine offene Position.');

  const m = getMarket(a.slug);
  if (m.closed || m.active === false) fail('Markt ist nicht mehr aktiv.');
  const p = binary(m);
  if (!p) fail('Markt ist kein JA/NEIN-Markt.');
  const price = side === 'YES' ? p.yes : p.no;
  const myProb = side === 'YES' ? estimate : 1 - estimate;
  const edge = myProb - price;
  if (edge < l.config.minEdge) fail(`Vorsprung ${pct(edge)} liegt unter der Schwelle ${pct(l.config.minEdge)}. Nicht handeln.`);

  const s = stats(l);
  const cap = s.balance * l.config.maxStakePct;
  if (stake > cap + 1e-9) fail(`Einsatz ${money(stake)} > ${pct(l.config.maxStakePct)} des Kontos (${money(cap)}).`);
  if (stake > s.cash + 1e-9) fail(`Nicht genug freies Papiergeld (${money(s.cash)}).`);

  const trade = {
    id: l.trades.length + 1,
    openedAt: new Date(now).toISOString(),
    slug: m.slug,
    question: m.question,
    endDate: m.endDate,
    side,
    price,            // live abgerufen, nicht vom Agenten angegeben
    marketYes: p.yes,
    estimateYes: estimate,
    edge,
    stake,
    shares: stake / price,
    confidence: String(a.confidence),
    reason: String(a.reason),
    evidenceFor: a.for ? String(a.for) : '',
    evidenceAgainst: a.against ? String(a.against) : '',
    sources: a.sources ? String(a.sources).split(/\s+/).filter(Boolean) : [],
    status: 'offen',
    payout: 0,
  };
  l.trades.push(trade);
  save(l);
  console.log(`#${trade.id} eroeffnet: ${side} "${m.question}" zu ${pct(price)}, Einsatz ${money(stake)}, Vorsprung ${pct(edge)}`);
}

function cmdResolve() {
  const l = load();
  let changed = 0;
  for (const t of l.trades.filter((x) => x.status === 'offen')) {
    let m;
    try { m = getMarket(t.slug); } catch (e) { console.log(`#${t.id}: ${e.message}`); continue; }
    const p = binary(m);
    // Nur als aufgeloest werten, wenn der Markt geschlossen ist und eindeutig 1/0 steht.
    if (!m.closed || !p || (m.umaResolutionStatus && m.umaResolutionStatus !== 'resolved')) { console.log(`#${t.id}: noch offen`); continue; }
    const yesWon = p.yes >= 0.99 && p.no <= 0.01;
    const noWon = p.no >= 0.99 && p.yes <= 0.01;
    if (!yesWon && !noWon) { console.log(`#${t.id}: geschlossen, aber Ergebnis nicht eindeutig (${p.yes}/${p.no}) - bleibt offen`); continue; }
    const won = (t.side === 'YES' && yesWon) || (t.side === 'NO' && noWon);
    t.status = won ? 'gewonnen' : 'verloren';
    t.payout = won ? t.shares : 0;
    t.resolvedAt = new Date().toISOString();
    t.outcome = yesWon ? 'YES' : 'NO';
    changed++;
    console.log(`#${t.id}: ${t.status} (${money(t.payout - t.stake)})`);
  }
  save(l);
  console.log(`${changed} Position(en) aufgeloest.`);
}

function cmdReport() {
  const l = load();
  const s = stats(l);
  const lines = [
    '# 7-Tage-Test: Auswertung',
    '',
    `Stand: ${new Date().toISOString()} · Zeitraum ${l.config.start.slice(0, 10)} bis ${l.config.end.slice(0, 10)}`,
    '',
    '| Kennzahl | Wert |',
    '|---|---|',
    `| Startguthaben | ${money(l.config.startBalance)} |`,
    `| Simulierte Trades | ${s.trades} |`,
    `| Gewonnen | ${s.wins} |`,
    `| Verloren | ${s.losses} |`,
    `| Noch offen (kein Ergebnis) | ${s.open} (${money(s.openCost)} gebunden) |`,
    `| Groesster Gewinn | ${money(s.largestWin)} |`,
    `| Groesster Verlust | ${money(s.largestLoss)} |`,
    `| Kontostand (offene zum Einstand) | ${money(s.balance)} |`,
    `| Rendite | ${pct(s.ret)} |`,
    '',
    'Gewinn/Verlust zaehlt erst, wenn der Markt tatsaechlich aufgeloest ist. Offen = kein Ergebnis.',
    '',
    '## Alle Positionen',
    '',
    '| # | Markt | Seite | Preis | Schaetzung JA | Einsatz | Status | G/V |',
    '|---|---|---|---|---|---|---|---|',
    ...l.trades.map((t) => `| ${t.id} | ${t.question.replace(/\|/g, '/')} | ${t.side} | ${pct(t.price)} | ${pct(t.estimateYes)} | ${money(t.stake)} | ${t.status} | ${t.status === 'offen' ? '-' : money(t.payout - t.stake)} |`),
    '',
    'Was die KI richtig / falsch lag: siehe `journal.md`.',
    '',
  ];
  writeFileSync(join(DATA, 'REPORT.md'), lines.join('\n'));
  console.log(lines.join('\n'));
}

// Offline-Test mit Beispieldaten, ohne Netz.
function cmdSelftest() {
  const dir = mkdtempSync(join(tmpdir(), 'pt-'));
  const fxPath = join(dir, 'fx.json');
  const soon = new Date(Date.now() + 3 * 864e5).toISOString();
  const mk = (slug, yes, closed = false) => ({ slug, question: `Frage ${slug}?`, outcomes: '["Yes","No"]', outcomePrices: JSON.stringify([String(yes), String(1 - yes)]), endDate: soon, active: !closed, closed, volume24hr: 1000 });
  const write = (fx) => writeFileSync(fxPath, JSON.stringify(fx));
  const list = `/markets?active=true&closed=false&limit=100&offset=0&order=volume24hr&ascending=false`;
  write({ [list]: [mk('a', 0.4), mk('b', 0.7)], '/markets?slug=a': [mk('a', 0.4)], '/markets?slug=b': [mk('b', 0.7)] });

  const run = (cmd, expectFail = false) => {
    try {
      const out = execFileSync(process.execPath, [fileURLToPath(import.meta.url), ...cmd], { encoding: 'utf8', stdio: 'pipe', env: { ...process.env, PT_FIXTURE: fxPath, PT_DATA_DIR: dir } });
      if (expectFail) throw new Error(`erwarteter Fehler blieb aus: ${cmd.join(' ')}`);
      return out;
    } catch (e) {
      if (!expectFail || e.message.startsWith('erwarteter')) throw e;
      return String(e.stderr);
    }
  };
  const assert = (c, m) => { if (!c) throw new Error(`selftest: ${m}`); };

  run(['init']);
  assert(run(['scan']).includes('davon 2 '), 'scan findet 2 Maerkte');
  assert(run(['open', '--slug', 'a', '--side', 'YES', '--estimate', '0.45', '--stake', '5', '--confidence', 'mittel', '--reason', 'x'], true).includes('unter der Schwelle'), 'zu kleiner Vorsprung abgelehnt');
  assert(run(['open', '--slug', 'a', '--side', 'YES', '--estimate', '0.6', '--stake', '7', '--confidence', 'mittel', '--reason', 'x'], true).includes('des Kontos'), '6-%-Grenze greift');
  run(['open', '--slug', 'a', '--side', 'YES', '--estimate', '0.6', '--stake', '6', '--confidence', 'mittel', '--reason', 'x']);
  run(['open', '--slug', 'b', '--side', 'NO', '--estimate', '0.5', '--stake', '5', '--confidence', 'niedrig', '--reason', 'y']);
  assert(run(['open', '--slug', 'a', '--side', 'YES', '--estimate', '0.6', '--stake', '1', '--confidence', 'mittel', '--reason', 'x'], true).includes('schon eine offene'), 'doppelte Position abgelehnt');

  // a loest JA auf (gewonnen), b loest JA auf (NEIN-Wette verloren)
  write({ '/markets?slug=a&closed=true': [mk('a', 1, true)], '/markets?slug=b&closed=true': [mk('b', 1, true)] });
  run(['resolve']);
  const l = JSON.parse(readFileSync(join(dir, 'ledger.json'), 'utf8'));
  assert(l.trades[0].status === 'gewonnen' && Math.abs(l.trades[0].payout - 15) < 1e-9, 'a gewonnen, 6 $ / 0,40 = 15 $ Auszahlung');
  assert(l.trades[1].status === 'verloren' && l.trades[1].payout === 0, 'b verloren');
  const rep = run(['report']);
  assert(rep.includes('| Kontostand (offene zum Einstand) | $104.00 |'), 'Kontostand 100 - 11 + 15 = 104');
  assert(rep.includes('| Rendite | 4.0 % |'), 'Rendite 4 %');
  rmSync(dir, { recursive: true, force: true });
  console.log('selftest ok');
}

const a = args(process.argv.slice(2));
const cmds = { init: cmdInit, scan: cmdScan, open: cmdOpen, resolve: cmdResolve, report: cmdReport, selftest: cmdSelftest };
const fn = cmds[a._[0]];
if (!fn) fail(`Unbekannter Befehl. Moeglich: ${Object.keys(cmds).join(', ')}`);
try { fn(a); } catch (e) { fail(e.message); }
