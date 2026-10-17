# Entscheidungen

Kurz begründete Entscheidungen dieser Demo (Stand 17. Oktober 2026). Wer etwas ändert, ergänzt hier den Grund.

## 1. Technischer Ausgangspunkt: casatex-zuerich-demo, Gestaltung neu

Übernommen (angepasst): Unterpfad-Logik (`lib/deploy-ziel.ts`), Export-Nachbereitung und -Prüfung, Vorschau-Server, QA-Gerüst mit
puppeteer-core, Einwilligungslogik (ruhend), Bildpipeline mit sharp, Sanity-Muster «statisch + Rebuild bei Publish», Import-Trockenlauf.
Neu: Domainmodell (Bereiche, Leistungen mit Ausführungen, Öffnungszeiten als Struktur, Sonderzeiten, Hinweis, Galerie/Team/Fragen),
alle Komponenten, Texte, Design «Goldlinie». Kein Reskin: Es gibt keine Bodenfläche, kein Materialregister, keine Dielen.

## 2. Inhalte nur aus eigenen Quellen des Studios

Website, Buchungsplattform (sichtbar und über die öffentliche Schnittstelle), Instagram-Profil, Jubiläumsbanner. Verzeichnisse (Google Maps,
local.ch, Moneyhouse) dienen nur dem Abgleich oder Negativbefund. Bewertungen (4.4 bei 732 Stimmen auf der Buchungsseite) werden nicht gezeigt:
fremde, laufend wechselnde Zahl.

## 3. Preise als Leistung mit Ausführungen

Die Plattform führt 31 Einzelpositionen («NeuSet» dreimal). Die Website fasst sie zu 18 Leistungen mit Ausführungen zusammen, damit die
Liste lesbar ist. Jede Ausführung trägt die wörtliche Originalbezeichnung und -beschreibung, damit der Abgleich mit der Plattform jederzeit
möglich ist. Preise stehen genau einmal (`data/leistungen.json`); freie Texte dürfen keine Beträge nennen (`npm run inhalt:pruefen`).

«Preisabweichung je Bedarf» wird als «je nach Aufwand» gezeigt und auf der Leistungsseite erklärt; «ab» bleibt «ab». Drei deaktivierte
Positionen der Plattform (Extra-Lang 1/2, Extra Design 2) erscheinen nicht: Sie sind nicht buchbar.

## 4. Öffnungszeiten von der Buchungsseite

Instagram nennt Mo bis Fr bis 19:45, die Buchungsseite bis 20:00. Entscheid von Nick (16.10.2026): Buchungsseite. Der Widerspruch steht
in der Übergabe. Das Google-Maps-Profil war nicht abrufbar (im Browser-Werkzeug gesperrt, kein Anhang in der Sitzung).

## 5. Keine englische Fassung

Die alte Website war zweisprachig, aber nur mit acht Begriffen («Welcome», «Book Your Appointment» …). Die Buchungsplattform ist deutsch.
Eine englische Fassung aller neuen Texte, Rechtstexte und 31 Positionen wäre ein eigener Auftrag; eine halbe englische Oberfläche verbietet
der Auftrag. Deshalb: Deutsch als einzige Sprache, die englischen Bezeichnungen der Plattform stehen als `titelEn` neben den Titeln, die
Leitzeile «Nails, Lashes & Beauty Care» bleibt englisch (Logo). Eine spätere Zweisprachigkeit ist über das Modell möglich (alle UI-Texte in
`texte.json`), siehe das Muster der Praxis-am-Zürichberg-Demo.

## 6. Buchung nur als Link

Kein Widget, kein Iframe, keine Deep-Links: Beauty Booking ist eine Angular-App ohne stabile Adressen je Behandlung. Jeder Buchungsknopf
heisst «Termin buchen», öffnet die Salonseite in einem neuen Fenster und sagt Screenreadern, dass ein externer Dienst folgt. Die Website
zeigt keine Verfügbarkeit und keine Bestätigung.

## 7. Kein Cookie-Banner

Die Website lädt nichts von Dritten (Schriften lokal, keine Karte, kein Video, keine Analyse, kein Google-Ads-Tag der alten Website).
Deshalb kein Banner; der Footer-Link «Datenschutz-Einstellungen» zeigt einen Hinweis. Die Einwilligungskomponente ist fertig und wird aktiv,
sobald `texte.einwilligung.kategorien` einen Eintrag hat (dann: Banner mit «Alle akzeptieren», «Nur notwendige», «Einstellungen», Widerruf im Footer).

## 8. Formular als vorbereitete E-Mail

Kein Backend, kein Dienst Dritter. Felder: Name, E-Mail, Betreff, Nachricht (kein Telefon, keine Gesundheitsangaben). Knopf
«E-Mail vorbereiten», Hinweis statt Bestätigung, deutlicher Satz «keine Terminbuchung».

## 9. Design: Gold aus dem Banner, sonst Schwarz und Neutral

Das Logo ist schwarz, das Banner des Studios weiss und gold auf Schwarz. Gold ist der eine Akzent (Goldlinie, Zeitmass, Wochenband), nie
Dekor. Keine Serife, kein Rosa, kein Glitzer. Dunkles Theme über Tokens, weil die Marke beide Fassungen hat. Begründung und Werte:
`docs/DESIGN.md`.

## 10. Logo-Negativfassung

Die Buchungsseite liefert nur die schwarze Wortmarke und das dunkelgraue Signet. Für dunkle Flächen erzeugt `scripts/bilder-optimieren.mjs`
eine Negativfassung (Form unverändert, Weiss statt Schwarz), wie sie das Studio auf dem Banner selbst zeigt. Der Banner-Ausschnitt mit
Goldschimmer wird nur für das Vorschaubild (Open Graph) genutzt; als Logo im Seitenkopf wirkte er wie ein brauner Kasten.

## 11. Strukturierte Daten erst nach Freigabe

`schema.org/NailSalon` mit Adresse, Telefon, E-Mail, Öffnungszeiten und Social-Links entsteht nur mit `INDEXIERUNG=1` auf der Kundendomain.
Keine Bewertungen, keine Preisspannen. In der Demo gibt es kein JSON-LD, keine Sitemap, `noindex` auf jeder Seite.

## 12. CMS-Modell «statisch + Rebuild bei Publish»

Wie bei Casatex: Studio getrennt in `studio/`, Website immer statisch, Sanity-Webhook ruft einen Vercel-Deploy-Hook. Kein `/studio` auf der
Kundendomain, kein `/api/revalidate`, keine Serverfunktionen. Preis: Änderungen sind erst nach dem Build sichtbar. Dokumentiert:
`docs/SANITY-VERCEL-EINRICHTUNG.md`.
