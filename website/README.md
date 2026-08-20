# CleanDriver – Rechtstexte für die Webseite

Statische, direkt einbindbare Seiten. Sie setzen die anwaltliche Stellungnahme
(siehe `docs/massnahmenplan-agb-v3.md`) um.

| Datei | Inhalt |
|---|---|
| `agb.html` | AGB v3 (vollständige Neufassung, §§ 1–14) |
| `widerruf.html` | Widerrufsbelehrung nach Art. 246a § 1 Abs. 2 EGBGB + Muster-Widerrufsformular |
| `impressum.html` | Impressum nach § 5 DDG (ohne OS-Plattform-Link) |
| `css/legal.css` | gemeinsames Stylesheet |

## Vor Veröffentlichung zwingend erledigen

1. Alle Platzhalter `[…]` (rot hinterlegt) ausfüllen: Firma, Rechtsform, Anschrift,
   Vertretung, Kontakt, Register, USt, Zahlungsdienstleister, Melde-E-Mail,
   VSBG-Variante (§ 13 AGB und Impressum identisch).
2. Texte durch den beauftragten Rechtsanwalt freigeben lassen.
3. Die gelben Entwurfs-Banner und die internen Vermerke entfernen
   (im HTML mit `ENTWURFSHINWEIS` kommentiert).
4. Footer-Link „Verträge hier kündigen" (derzeit `href="#"`) auf eine funktionierende
   Kündigungsseite nach § 312k BGB verlinken – der Button muss ständig verfügbar,
   gut sichtbar und ohne Login nutzbar sein und auf eine Bestätigungsseite führen.
5. Kostendeckel (0,25 €/km in § 6 AGB) gegen die aktuelle Fassung des
   § 5 Abs. 2 Satz 1 BRKG abgleichen.
6. Datenschutzerklärung erstellen und in § 11 Abs. 3 AGB sowie im Footer verlinken
   (liegt nicht in diesem Paket).

## Prozessseite (nicht in diesen Dateien, siehe Maßnahmenplan Phase 3)

Die AGB setzen voraus, dass der Buchungsflow Folgendes technisch abbildet:
Button „zahlungspflichtig bestätigen" (§ 312j Abs. 3 BGB), Checkbox zur
Zustimmung nach § 356 Abs. 4 BGB, beidseitige Zustimmung zur Haftungsbeschränkung
(§ 9 Abs. 3 AGB), Vorab-/Drittbuchung, harter Preisdeckel und fahrerseitige Gebühr.
