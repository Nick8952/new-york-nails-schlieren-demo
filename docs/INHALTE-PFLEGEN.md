# Inhalte pflegen: Leistungen, Preise, Öffnungszeiten, Bilder

Für zwei Situationen: **heute** (Demo, Inhalte in `data/`, Änderung durch Nick) und **später** (Sanity Studio, Änderung durch das Studio
ohne Programmierkenntnisse). Die Felder heissen an beiden Orten gleich.

## Grundregel: zwei Systeme, zwei Pflegen

Die Website zeigt Preise und Dauern. Gebucht wird bei Beauty Booking. **Es gibt keine Schnittstelle zwischen beiden.** Wer einen Preis
ändert, ändert ihn

1. in der Buchungsplattform (Beauty Booking, Saloneinstellungen) **und**
2. auf der Website (heute `data/leistungen.json`, später im Sanity Studio unter «Leistungen und Preise»).

Die Website nennt unter jeder Preisliste das Datum des letzten Abgleichs (`texte.ui.standQuelle`). Nach jeder Preisänderung dieses
Datum anpassen.

## Leistungen und Preise

Eine **Leistung** (zum Beispiel «Neues Set») hat eine oder mehrere **Ausführungen** (zum Beispiel «Natur», «Mit Farbe», «Ombre»). Jede
Ausführung ist eine buchbare Position mit Preis und Dauer. Felder je Ausführung:

| Feld | Bedeutung | Beispiel |
| --- | --- | --- |
| Bezeichnung auf der Website | verständlich | Ombre oder Babyboomer |
| Bezeichnung in der Buchungsplattform | wörtlich, für den Abgleich | NeuSet ( New Set) |
| Beschreibung in der Buchungsplattform | wörtlich (optional) | Ombre/Babyboom preisabweichung je Bedarf |
| Preis: Betrag in Franken | genau wie gebucht | 95 |
| Preis: «ab»-Preis | nur wenn die Plattform «ab» sagt | aus |
| Preis: kann je nach Aufwand abweichen | entspricht «Preisabweichung je Bedarf» | ein |
| Dauer in Minuten | Buchungsdauer | 60 |
| Hinweis | optional, nur für diese Ausführung | – |

Heute: `data/leistungen.json` bearbeiten, dann `npm run inhalt:pruefen` (meldet Tippfehler, «ß», fehlende Quellen, Preise im Fliesstext),
`npm run build`, `npm run export:pruefen`. Später: Sanity Studio → «Leistungen und Preise» → Leistung öffnen → Ausführung ändern →
**Veröffentlichen**. Zwei Minuten warten, Website neu laden.

Neue Leistung anlegen: Titel, Bereich wählen, mindestens eine Ausführung, **Quelle** (woher die Angabe stammt, zum Beispiel
«Buchungsseite bei Beauty Booking, 17. Oktober 2026») und Freigabe «Live», sobald das Studio den Preis bestätigt. Leistung entfernen:
Dokument löschen (Sanity) oder Eintrag aus der JSON-Datei nehmen. Reihenfolge: Zahl im Feld «Reihenfolge» (10, 20, 30 …).

Bereiche (Nägel, Wimpern, Waxing, Massage) sind eigene Dokumente; eine neue Bereichsseite entsteht automatisch beim Build
(`/leistungen/<adresse>/`). Ein Bereich ohne Leistungen bricht den Build mit einer Meldung ab.

## Öffnungszeiten

Unter «Studio, Kontakt und Öffnungszeiten»:

- **Reguläre Öffnungszeiten**: ein Eintrag je Wochentag, «von» und «bis» als `HH:MM` oder «geschlossen». Erscheinen auf der Startseite
  (Wochenband), der Kontaktseite und in der Fusszeile. Ohne Einträge erscheint der Abschnitt nirgends.
- **Abweichende Zeiten** (Feiertage, Ferien): Bezeichnung, von, bis, optional geänderte Zeiten. Verschwinden nach dem Enddatum von selbst
  (beim nächsten Build; die Website rechnet mit dem Build-Datum, nicht mit der Uhr der Besucherin).
- **Zeitlich begrenzter Hinweis**: ein Satz oben auf jeder Seite, sichtbar nur zwischen zwei Daten (zum Beispiel «Vom 24. Dezember bis
  2. Januar geschlossen»). Aktionen nur hier und nur mit Enddatum.

Heute: `data/einstellungen.json`, Felder `oeffnungszeiten`, `sonderzeiten`, `hinweis`. Nach dem Enddatum eines Hinweises muss die Website
**neu gebaut** werden, damit er verschwindet (GitHub Pages baut nur bei Push; Vercel bei Webhook oder von Hand).

## Kontakt, Links, Social Media

`data/einstellungen.json` bzw. «Studio, Kontakt und Öffnungszeiten»: Adresse, Telefon (`+41 44 557 50 67`), E-Mail, Buchungslink,
Routenlink, 360°-Ansicht, Social-Media-Profile. Alle Links werden vor dem Build geprüft (nur https, mailto, tel erlaubt).

## Bilder

Heute: Original in `assets/originale/` ablegen, Eintrag in `scripts/bilder-liste.json` (Alternativtext, Urheber, Quelle, Lizenz,
Abrufdatum), `npm run bilder`, dann die Kennung in `data/galerie.json` (echte Arbeiten), `data/team.json` oder `data/einstellungen.json`
verwenden. Herkunft in `assets/originale/HERKUNFT.md` nachführen.

Später: im Studio hochladen (JPG oder PNG, mindestens 1600 Pixel lang). Pflichtfelder: Bildbeschreibung (Alternativtext), Bildnachweis
(Urheber, Quelle, Lizenz), Schalter «Symbolbild» nur für Bilder, die nicht aus dem Studio stammen. Galeriebilder brauchen eine Quelle
(wer hat das Bild wann freigegeben) und die Freigabe. Der Build erzeugt AVIF und WebP selbst.

## Texte

- Startseite, Leistungsseite, Studioseite, Kontaktseite: je ein Dokument mit Titel, Einleitung, Abschnitten.
- Navigation, Fusszeile, Formulartexte, Fehlerseite, Knöpfe: Dokument «Navigation, Fusszeile und Formulartexte». Der Buchungsknopf heisst
  überall gleich («Termin buchen»); der Prüfbefehl meldet Abweichungen.
- Impressum und Datenschutzerklärung: Fliesstext mit Zwischentiteln und Aufzählungen.

Schreibweise: Schweizer Hochdeutsch, «ss» statt «ß», Anführungszeichen «…», keine Gedankenstriche. Das Studio-Backend lehnt «ß» und
Gedankenstriche beim Speichern ab; der Prüfbefehl ebenso.

## Was nicht in die Texte gehört

Keine Preise in freien Texten (nur in den Ausführungen), keine Rabatte ohne Enddatum, keine Garantien, keine «seit X Jahren», keine
Bewertungen, keine Marken ohne Bestätigung, keine Hygieneversprechen ohne Bestätigung. `npm run inhalt:pruefen` meldet solche Stellen.
