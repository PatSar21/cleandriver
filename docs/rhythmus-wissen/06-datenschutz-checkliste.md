# 06 – Datenschutz-Checkliste

**Stand:** 30.09.2026

> **Hinweis:** Keine Rechtsberatung. Vor Livegang von einer Fachperson für Datenschutzrecht prüfen lassen. Der Code von Rhythmus lag für diese Checkliste nicht vor; alle Punkte sind am Code zu prüfen.

## Warum das wichtig ist: der Fall Flo

- **2021:** Flo Health schloss einen Vergleich mit der US-Handelsbehörde FTC. Vorwurf war, sensible Zyklusdaten an Analyse-Dienste weitergegeben zu haben.
- **Juli 2025:** In einer US-Sammelklage einigten sich Flo und Google mit den Klägern. Laut Bericht zahlt Google 48 Mio. $, Flo 8 Mio. $, ohne Schuldeingeständnis (https://www.malwarebytes.com/blog/news/2025/09/google-and-flo-to-pay-56-million-after-misusing-users-health-data).
- **August 2025:** Eine Jury befand Meta für haftbar, weil es über das Flo-SDK Gesundheitsdaten ohne Einwilligung erfasst habe (https://natlawreview.com/article/jury-finds-meta-liable-collecting-private-reproductive-health-data).

Der Stand kann sich seitdem geändert haben. Die Lehre: **Zyklusdaten sind hochsensibel, und schon eingebundene Dritt-SDKs können genügen, um Daten abfließen zu lassen.**

## Rechtlicher Rahmen (DE/EU) – zu prüfen

- **DSGVO Art. 9:** Zyklus- und Gesundheitsdaten sind besondere Kategorien. Verarbeitung in der Regel nur mit **ausdrücklicher Einwilligung** (Art. 9 Abs. 2 lit. a).
- **DSGVO Art. 35:** Bei umfangreicher Verarbeitung von Gesundheitsdaten ist vermutlich eine **Datenschutz-Folgenabschätzung** nötig.
- **TDDDG § 25:** Zugriff auf das Endgerät (Cookies, SDKs, lokale Speicherung, die nicht unbedingt erforderlich ist) braucht eine Einwilligung.
- **Auftragsverarbeitung (Art. 28)** und **Drittlandtransfer (Art. 44 ff.)** für jeden Dienstleister, z. B. Hosting, Datenbank, Login.

## Checkliste für Rhythmus

### Drittanbieter
- [ ] Liste aller eingebundenen SDKs und Skripte (Analyse, Werbung, Absturzberichte, Schriften, Karten)
- [ ] **Keine Werbe- und Tracking-SDKs** (z. B. Meta, Google Analytics) in Bereichen mit Gesundheitsdaten
- [ ] Keine Gesundheitsdaten in Ereignisnamen, URLs oder Log-Zeilen, die an Dritte gehen
- [ ] Schriften und Bibliotheken selbst hosten statt von fremden Servern laden
- [ ] Für jeden Dienstleister: Vertrag zur Auftragsverarbeitung, Serverstandort, Rechtsgrundlage für Drittlandtransfer

### Speicherung
- [ ] Datensparsamkeit: nur erfassen, was eine Funktion wirklich braucht
- [ ] Prüfen, ob Zyklusdaten lokal auf dem Gerät bleiben können; Cloud-Sync nur optional
- [ ] Verschlüsselung bei Übertragung und Speicherung
- [ ] Zugriffsregeln in der Datenbank (z. B. Row Level Security), sodass jede Nutzerin nur ihre eigenen Daten sieht

### Nutzerrechte
- [ ] Eigene, verständliche Einwilligung für Gesundheitsdaten, getrennt von AGB
- [ ] Export aller Daten (Art. 20)
- [ ] Vollständige Löschung des Kontos und aller Daten, einfach auffindbar (Art. 17)
- [ ] Datenschutzerklärung nennt jeden Empfänger

### Kommunikation
- [ ] Datenschutz sichtbar als Versprechen formulieren, z. B. „Deine Zyklusdaten werden nicht verkauft und nicht für Werbung genutzt". **Nur, wenn das technisch nachweisbar stimmt.**
