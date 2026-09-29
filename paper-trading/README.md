# Das Prognosemarkt-Experiment mit Claude (statt Grok)

Umsetzung der Anleitung „The Grok Bot Trading Experiment“ (@seb.ai), aber mit Claude Code.
Getestet wird **nur auf Papier**: 100 $ Papiergeld, 7 Tage.

> ⚠ Die virale Behauptung „50 $ → 5.273 $ in 48 Stunden“ stammt vom ursprünglichen Creator und
> ist **nicht unabhängig überprüft**. Hier wird nichts versprochen. Prognosemärkte bergen
> finanzielle Risiken, KI kann falsch liegen, und simulierte Ergebnisse garantieren nichts.
> Das ist keine Finanzberatung. Vor echtem Handel: Nutzungsbedingungen der Plattform und
> lokale Regeln prüfen (für Personen in Deutschland ist das rechtlich nicht trivial).

## So funktioniert es

```
Claude-Routine (geplant) → Märkte scannen → öffentliche Infos recherchieren
→ Wahrscheinlichkeit schätzen → mit Marktpreis vergleichen → möglichen Vorsprung finden
→ Risikoregeln anwenden → Entscheidung protokollieren → wiederholen
```

| Datei | Zweck |
|---|---|
| `AGENT.md` | Der Prompt, den Claude bei jedem Durchlauf befolgt (entspricht Abschnitt 4 im Doc). |
| `pt.mjs` | Werkzeug ohne Abhängigkeiten. Holt Live-Preise von Polymarket, erzwingt die Risikoregeln und führt das Konto. |
| `data/ledger.json` | Alle Papier-Trades. Wird nur von `pt.mjs` geschrieben. |
| `data/journal.md` | Begründungen je Durchlauf, außerdem was richtig und was falsch lag. |
| `data/REPORT.md` | Die Auswertungstabelle aus Abschnitt 5 im Doc. |

Warum ein Skript statt nur Prompt? Weil das Skript die Preise selbst live abruft, kann der
Agent keine Kurse erfinden, und die Regeln (≥ 8 Prozentpunkte Vorsprung, ≤ 6 % Einsatz,
keine Trades nach Tag 7) werden technisch durchgesetzt statt nur erbeten.

## Befehle

```
node pt.mjs init              # Test starten: 100 $, 7 Tage
node pt.mjs scan              # aktuelle JA/NEIN-Märkte (Ende in ≤ 14 Tagen)
node pt.mjs open ...          # Papier-Trade eröffnen (siehe AGENT.md)
node pt.mjs resolve           # aufgelöste Märkte abrechnen
node pt.mjs report            # Auswertung → data/REPORT.md
node pt.mjs selftest          # Offline-Test der Rechenlogik
```

Gewinn oder Verlust zählt erst, wenn der Markt tatsächlich aufgelöst ist. Offen heißt: kein Ergebnis.
Rechnung: Wer JA zum Preis 0,40 mit 6 $ kauft, erhält bei JA 6 / 0,40 = 15 $ und bei NEIN 0 $.

## Voraussetzung: Netzwerkzugang

Die Cloud-Umgebung muss `gamma-api.polymarket.com` erreichen dürfen (Environment-Einstellungen
→ Network access → Domain freigeben). Ohne diesen Zugang eröffnet der Agent bewusst keine Trades.

Hinweis: Die Feldnamen der Polymarket-Gamma-API (`outcomes`, `outcomePrices`, `closed`, `endDate`)
wurden bisher nur gegen Beispieldaten getestet, weil die API von hier gesperrt war.
Nach der Freigabe sollte der erste `scan` kontrolliert werden.
