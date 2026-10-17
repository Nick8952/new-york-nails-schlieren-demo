# Übergabe: offene Angaben und Freigaben

Stand: 17. Oktober 2026. Arbeitspapier für das Gespräch mit New York Nails Schlieren und für den Produktivbetrieb.

## Stand der Demo

- Repository: <https://github.com/Nick8952/new-york-nails-schlieren-demo> (öffentlich)
- Live: <https://nick8952.github.io/new-york-nails-schlieren-demo/> (noindex, als Entwurf gekennzeichnet)
- Inhalte: lokal in `data/`. Sanity und Vercel sind vorbereitet, aber nicht eingerichtet (`docs/SANITY-VERCEL-EINRICHTUNG.md`).

## Für Nick, vor dem Versand der Demo

1. **Postanschrift im Impressum der Demo.** Dort steht «wird auf Anfrage mitgeteilt» (`data/seiten/impressum.json`, `datenschutz.json`).
2. **Logo.** Die Demo zeigt Wortmarke und Signet des Studios ohne dessen Freigabe (Download von dir am 16.10.2026 freigegeben). Wer das
   nicht will, ersetzt die Bilder durch eine typografische Wortmarke.
3. **Google-Maps-Profil.** Es kam in dieser Sitzung nicht an; die Öffnungszeiten stammen von der Buchungsseite (dein Entscheid). Zeigt das
   Profil andere Zeiten, Kategorien oder Fotos, in `data/einstellungen.json` nachführen.
4. **Formular nicht testen mit echten Nachrichten.** Es öffnet das E-Mail-Programm mit `info@newyorknails-schlieren.ch` als Empfänger.

## Fragen an das Studio

### Betreiber und Recht

| Nr. | Frage | Warum |
| --- | --- | --- |
| 1 | Wer betreibt das Studio rechtlich (Firma oder Inhaberin/Inhaber, Rechtsform, UID, falls vorhanden)? | Impressum. Zefix führt keinen Eintrag mit Sitz Schlieren. Nichts davon wird erfunden. |
| 2 | Welche Person ist für Impressum und Datenschutz zu nennen? | Pflichtangabe nach DSG Art. 19 (Verantwortliche) |
| 3 | Dürfen Wortmarke und Signet verwendet werden? Gibt es eine Vektordatei? | Markenrecht, Darstellungsqualität |
| 4 | Ist Facebook noch aktiv? | Link ohne Anmeldung nicht prüfbar |

### Öffnungszeiten und Buchung

| Nr. | Frage | Warum |
| --- | --- | --- |
| 5 | Gilt Mo bis Fr bis 20:00 (Buchungsseite) oder bis 19:45 (Instagram)? | Widerspruch zwischen zwei eigenen Quellen |
| 6 | Gibt es Feiertags- oder Ferienregelungen? | Feld `sonderzeiten` vorbereitet |
| 7 | Welche Regeln gelten für Terminänderung, Verspätung und Stornierung? | Nirgends öffentlich; Kundinnen fragen das |
| 8 | Welche Zahlungsmittel werden angenommen (Bar, Karte, TWINT)? | Nirgends öffentlich |
| 9 | Soll die Website später direkt auf Behandlungen in der Buchung verlinken? | Beprobooking bietet keine stabilen Tiefenlinks; nur der Salonlink ist verlässlich |

### Leistungen und Preise

| Nr. | Frage | Warum |
| --- | --- | --- |
| 10 | Stimmen alle 31 Positionen (Preis, Dauer)? Liste: `docs/INHALTSMATRIX.md`, Abschnitt 4 | 1:1 übernommen, Stand 16.10.2026 |
| 11 | Was bedeutet «Preisabweichung je Bedarf» konkret (Länge, Design, Zustand)? Gibt es Zuschläge wie «Extra-Lang» (deaktiviert)? | Kundinnen sollen wissen, was den Preis verändert |
| 12 | Achseln mit 60 Minuten: korrekt oder Platzhalter? | Wirkt ungewöhnlich lang |
| 13 | Shellack entfernen (CHF 20): Dauer? | In der Quelle nur als Hinweis |
| 14 | Soll «Shellack» so geschrieben bleiben, oder ist CND Shellac gemeint (Marke)? | Keine Marken ohne Bestätigung |
| 15 | Welche Produkte und Marken werden verwendet, dürfen sie genannt werden? | Nur mit Bestätigung |
| 16 | Gibt es Gutscheine? | Betreffauswahl im Formular nennt «Gutschein» als Thema, verspricht aber nichts |

### Studio, Team, Bilder

| Nr. | Frage | Warum |
| --- | --- | --- |
| 17 | Gründungsjahr 2016 (zehn Jahre im Mai 2026)? | Studioseite nennt das Jubiläum mit Quelle (Banner) |
| 18 | Fotos vom Studio und von echten Arbeiten, mit Rechten? Aufnahmeliste: `docs/BILDER.md` | Demo hat keine Fotos |
| 19 | Team nennen (Namen, Rollen, Fotos, Einverständnis)? | Modell vorbereitet, leer |
| 20 | Hygiene-, Material- oder Qualitätsaussagen, die das Studio bestätigen will? | Nichts davon auf der Website, weil nicht belegt |
| 21 | Soll es eine englische Fassung geben? | Alte Website war zweisprachig mit acht Begriffen; Entscheid in `docs/ENTSCHEIDUNGEN.md` |

### Go-Live

| Nr. | Frage | Warum |
| --- | --- | --- |
| 22 | Domain `newyorknails-schlieren.ch`: Wer verwaltet sie (Registrar, DNS)? | Umhängen auf Vercel |
| 23 | Soll Conversion-Messung (Google Ads) wie bisher laufen? | Dann Einwilligungsbanner aktivieren (`texte.einwilligung.kategorien`) und Datenschutzerklärung anpassen |
| 24 | Wer pflegt Preise und Zeiten später (Studio selbst im Sanity-Studio)? | Redaktion, `docs/INHALTE-PFLEGEN.md` |

## Freigaben vor dem Produktivbetrieb (technisch erzwungen)

`npm run inhalt:pruefen -- --live` listet alles, was noch nicht freigegeben ist. Der Build bricht mit `INDEXIERUNG=1` auf einer echten
Domain ab, solange Punkte offen sind:

- Studioangaben (`einstellungen.freigabe`), 4 Bereiche und 18 Leistungen (`freigabe: "demo"` → `"live"` nach Bestätigung)
- Belege der Startseite, der Leistungsseite, der Studioseite, der Kontaktseite, des Impressums und der Datenschutzerklärung
- Impressum und Datenschutzerklärung beschreiben noch die Demo (Betreiber Nick, GitHub Pages); zusammen 31 Punkte
