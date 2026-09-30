# 04 – Forschung für die Zyklusvorhersage

**Stand:** 30.09.2026

Veröffentlichte Studien, die für die Vorhersage in Rhythmus (nächste Periode, erwartete Schwankung) nützlich sind.

> **Wichtig:** Die Zahlen stammen aus Suchergebnissen und Zusammenfassungen. Die Originale (nature.com, PubMed Central) waren in der Rechercheumgebung gesperrt. **Vor jeder Verwendung im Code oder in Texten am Original prüfen.**

## Korrektur

In einer früheren Antwort wurden drei Studien pauschal als „Clue-Studien" genannt. Das stimmt nur für eine davon:

| Studie | Datenquelle |
|---|---|
| Li et al. 2020 | **Clue** |
| Bull et al. 2019 | **Natural Cycles** (nicht Clue) |
| Apple Women's Health Study 2023 | **Apple Women's Health Study** (nicht Clue) |
| Li, Urteaga et al. 2022 | **Clue** |

## Normwerte (Referenz)

**FIGO AUB System 1** (Munro et al. 2018, Int J Gynecol Obstet 143: 393–408):
- Zykluslänge normal: **24–38 Tage** (Alter 18–45; 5.–95. Perzentil)
- Regelmäßigkeit: Differenz zwischen kürzestem und längstem Zyklus normal **≤ 7–9 Tage**. Nach den Suchergebnissen gelten ≤ 7 Tage für 18–25 und 42–45 Jahre, ≤ 9 Tage für 26–41 Jahre. Am Original prüfen.
- Blutungsdauer normal: **≤ 8 Tage**
- Link: https://obgyn.onlinelibrary.wiley.com/doi/10.1002/ijgo.12666

## Studien

### Bull et al. 2019 – Natural Cycles
„Real-world menstrual cycle characteristics of more than 600,000 menstrual cycles", npj Digital Medicine.
https://www.nature.com/articles/s41746-019-0152-7
- ungefähr 612.613 Zyklen mit Eisprung von 124.648 Nutzerinnen
- mittlere Zykluslänge ungefähr 29,3 Tage
- mittlere Follikelphase ungefähr 16,9 Tage (95-%-Bereich 10–30)
- mittlere Lutealphase ungefähr 12,4 Tage (95-%-Bereich 7–17)
- Zykluslänge sinkt zwischen 25 und 45 Jahren um ungefähr 0,18 Tage pro Lebensjahr
- **Folgerung:** Der Eisprung liegt selten fest an „Tag 14". Rhythmus sollte nirgends einen festen Eisprungtag behaupten.

### Li et al. 2020 – Clue
„Characterizing physiological and symptomatic variation in menstrual cycles using self-tracked mobile-health data", npj Digital Medicine 3, 79.
https://www.nature.com/articles/s41746-020-0269-8
- ungefähr 378.000 Nutzerinnen, ungefähr 4,9 Mio. natürliche Zyklen
- Vergleich von Nutzerinnen mit dauerhaft stark schwankender und dauerhaft gleichmäßiger Zykluslänge
- statistisch signifikante Zusammenhänge zwischen Schwankung der Zykluslänge und berichteten Symptomen
- **Folgerung:** Schwankung ist ein eigenes Merkmal einer Person. Rhythmus sollte sie pro Nutzerin schätzen und anzeigen.

### Apple Women's Health Study 2023
„Menstrual cycle length variation by demographic characteristics from the Apple Women's Health Study", npj Digital Medicine.
https://www.nature.com/articles/s41746-023-00848-1
- ungefähr 165.668 Zyklen von 12.608 Teilnehmenden (USA)
- Zykluslänge sinkt mit dem Alter bis etwa 50 und steigt danach
- Schwankung am geringsten bei 35–39 Jahren; unter 20 um ungefähr 46 % höher, bei 45–49 um ungefähr 45 % höher
- BMI ≥ 40: Zyklen im Mittel ungefähr 1,5 Tage länger als bei BMI 18,5–25
- **Folgerung:** Bei wenigen eigenen Daten kann das Alter die Startwerte für die erwartete Schwankung verbessern. Das wäre ein Datenschutzthema, siehe 06.

### Li, Urteaga et al. 2022 – Clue
„A predictive model for next cycle start date that accounts for adherence in menstrual self-tracking", JAMIA 29(1).
https://academic.oup.com/jamia/article/29/1/3/6371799
- Modell unterscheidet echte lange Zyklen von vergessenen Einträgen
- übertraf nach Angaben der Autoren Mittelwert, Median und neuronale Netze (CNN, RNN, LSTM)
- Code offen unter **MIT-Lizenz**: https://github.com/iurteaga/menstrual_cycle_analysis (nur Code und Beispieldaten, keine Clue-Daten)
- **Folgerung:** Ein scheinbar doppelt langer Zyklus ist oft ein vergessener Eintrag. Rhythmus sollte nachfragen statt einen Ausreißer still zu übernehmen.

## Empfehlungen für die Vorhersage-Logik

Diese Punkte konnten nicht gegen den aktuellen Rhythmus-Code geprüft werden. Sie sind als Prüfliste gedacht.

1. **Spanne statt Punkt:** Den nächsten Periodenbeginn als Zeitraum anzeigen, zum Beispiel „ca. 3.–6. Oktober". Die Breite ergibt sich aus der eigenen Schwankung der Nutzerin.
2. **Startwerte bei wenigen Daten:** Bis etwa drei Zyklen erfasst sind, mit einem Mittelwert um 29 Tage und breiter Spanne starten. Werte am Original prüfen, siehe Bull et al. 2019.
3. **Median der letzten Zyklen** statt Mittelwert – robuster gegen einzelne Ausreißer. Das ist eine einfache Heuristik und nicht aus den Studien übernommen.
4. **Vergessene Einträge erkennen:** Ist ein Zyklus ungefähr doppelt so lang wie üblich, nachfragen: „Hast du eine Periode nicht eingetragen?"
5. **Hinweis bei Auffälligkeiten:** Liegen Zyklen wiederholt außerhalb der FIGO-Normwerte, freundlich auf ärztliche Abklärung hinweisen. Das ist eine Information und keine Diagnose.
6. **Kein fruchtbares Fenster, kein Eisprungtag** als Entscheidungshilfe (siehe 07).
7. **Hormonelle Verhütung berücksichtigen:** Bei Pille und Co. ist die Blutung eine Abbruchblutung. Die Vorhersage sollte das wissen, sonst werden falsche Muster gelernt.
