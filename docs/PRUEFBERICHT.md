# Prüfbericht

Stand: 17. Oktober 2026, nach Veröffentlichung und Codex-Abschlussprüfung. Alle Zahlen stammen aus tatsächlichen Läufen; nichts ist geschätzt.
Die Zahlen in Abschnitt 1 bis 3 sind die des letzten lokalen Laufs vor dem zweiten Push (nach der Abschlussprüfung).

## 1. Build und statische Prüfungen

| Prüfung | Befehl | Ergebnis |
| --- | --- | --- |
| Inhalte (Schema, Schreibweise, Behauptungen, Links, Bilder, Quellen, Preiskennzeichen) | `npm run inhalt:pruefen` | ✓ 555 Texte, 22 Links, 5 Bilder, 18 Leistungen mit 31 Positionen, 29 Belege mit Quelle |
| Lint, Typen | `npm run lint`, `npm run typecheck` | ✓ 0 Fehler, 0 Warnungen |
| Statischer Export | `npm run build` | ✓ 16 Routen (13 HTML-Seiten, robots.txt, zwei Icons), `404.html`, `.nojekyll`, Sitemap entfernt |
| Export (Unterpfad, noindex, fremde Hosts, Budgets, Canonical, h1, Beschreibungen) | `npm run export:pruefen` | ✓ 13 HTML-Dateien, 560 interne Verweise unter `/new-york-nails-schlieren-demo`, noindex überall, keine Sitemap, kein JSON-LD |
| Budgets | export:pruefen | JavaScript je Seite höchstens 594 KB (Budget 625 KB, unkomprimiert; Next-Grundlast), alle Bildvarianten 71 KB, kein vorgeladenes Bild über 59 KB |
| Import nach Sanity (Trockenlauf) | `npm run seed -- --probe` | ✓ 30 Dokumente, 5 Bilder; jedes Dokument besteht das Domainmodell und entspricht nach dem Zurücklesen den lokalen Inhalten (inklusive Sprungmarken) |
| Bild-Spiegel (Selbsttest ohne Sanity) | `npx tsx scripts/sanity-bilder.mts --probe …` | ✓ 2 WebP (transparentes Logo verlustfrei), nichts veröffentlicht |
| Studio | `cd studio && npm run typecheck && npm run schema:pruefen` | ✓ Typen ok, Schema 0 Fehler, 0 Warnungen |

## 2. Go-Live-Probe und Leitplanken

| Prüfung | Ergebnis |
| --- | --- |
| `INDEXIERUNG=1 SITE_URL=https://www.example.com npm run build:vercel` (reservierte Testdomain) | ✓ baut ohne Unterpfad; `export:pruefen` mit `DEPLOY_TARGET=vercel`: noindex aus, Sitemap mit 9 Adressen, JSON-LD `NailSalon` mit Adresse, Telefon, E-Mail, Öffnungszeiten, Social-Links, Buchungsaktion (keine Bewertungen, keine Preise) |
| `INDEXIERUNG=1` ohne SITE_URL | ✓ bricht ab |
| `INDEXIERUNG=1 SITE_URL=https://nick8952.github.io` (Unterpfad) | ✓ bricht ab |
| `INDEXIERUNG=1 DEPLOY_TARGET=vercel SITE_URL=https://nick8952.github.io` (Vorschau-Host) | ✓ bricht ab |
| `INDEXIERUNG=1 DEPLOY_TARGET=vercel SITE_URL=http://www.example.com` (http) | ✓ bricht ab (neu nach Codex-Befund 13) |
| `SITE_URL` ohne Vercel-Ziel (mit Unterpfad) | ✓ bricht ab |
| `INDEXIERUNG=1 SITE_URL=https://www.newyorknails-schlieren.ch` (echte Domain, Inhalte nicht freigegeben) | ✓ bricht ab mit 31 offenen Punkten (Studioangaben, 4 Bereiche, 18 Leistungen, 6 Seitenbelege inkl. Impressum und Datenschutz, Demo-Hinweise in beiden Rechtstexten) |

## 3. Browser-Prüfungen (puppeteer-core, Chrome, lokaler Vorschau-Server)

**DOM-Audit** (`werkzeuge/qa/audit.mjs`): 11 Seiten × 4 Breiten (360, 390, 768, 1440 px) im hellen und im dunklen Farbschema =
**88 Prüfungen, 0 Befunde.** Geprüft je Seite: Status 200 (Fehlerseite 404), kein horizontaler Überlauf, alle Links/Knöpfe/Felder ≥ 44 × 44 px
(Ausnahme: Links im Fliesstext), Alternativtexte, Breite/Höhe an jedem Bild, genau eine h1, keine Überschriftensprünge, noindex,
`lang="de-CH"`, keine Anfragen an fremde Hosts, keine fehlgeschlagenen Anfragen, keine Konsolenfehler, kein Speicher, keine Cookies,
Sprunglink und `main#inhalt`, Sprungziele nicht von der fixierten Kopfzeile verdeckt, kein Text unter 13 px.

**Funktionsprüfungen** (`werkzeuge/qa/funktionen.mjs`): **71 Prüfungen, 0 fehlgeschlagen.** Darunter:

- Erstbesuch: keine Anfragen an Dritte, kein Banner, kein Speicher, Entwurfshinweis, noindex, kein JSON-LD, keine Iframes, robots.txt ohne Sperre, keine Sitemap; Footer-Link «Datenschutz-Einstellungen» öffnet einen Hinweis ohne Schalter, Escape schliesst.
- Buchung: auf Start, Leistungen, Bereichsseite und Kontakt zeigen alle Buchungslinks (6/8/5/5) auf `https://beprobooking.com/salon/new-york-nails-schlieren`, öffnen ein neues Fenster mit `noopener noreferrer` und heissen «Termin buchen»; kein Formular hat ein `action`.
- Tastatur: erster Tab «Zum Inhalt springen», sichtbar, setzt den Fokus auf `main`; Fokusring 3 px; Reihenfolge Sprunglink → Logo → Navigation → Telefon → Termin buchen; `aria-current` auf der aktuellen Seite und auf «Leistungen und Preise» bei Bereichsseiten.
- Handy (360 × 740): Menüknopf 101 × 44 px, Menü als ganzflächiger Dialog mit 4 Seitenlinks, Telefon, E-Mail, Buchung; Fokus bleibt im Dialog (30 × Tab), Escape schliesst und gibt den Fokus zurück; Menülink navigiert; feste Leiste «Anrufen» (tel:) und «Termin buchen», beide ≥ 44 px, verdeckt die Fusszeile nicht; kein horizontales Scrollen auf Start, Leistungen, Kontakt; Titel und «Termin buchen» im ersten Bildschirm.
- Preisliste: alle 31 Positionen als Zeilen, jede mit CHF-Preis und Minuten; 17 Positionen «je nach Aufwand», 2 «ab CHF»; 4 Sprungmarken; Zeitmass `aria-hidden`; Standhinweis; mobil ohne horizontales Scrollen.
- Öffnungszeiten: 7 Zeilen, heutiger Tag markiert, Sonntag «geschlossen», Samstag bis 17:45.
- Formular: Knopf «E-Mail vorbereiten», Hinweis «keine Terminbuchung», Felder Name/E-Mail/Betreff/Nachricht mit Beschriftungen; leeres Absenden → 3 Fehlermeldungen am Feld, Fokus im ersten Feld, kein mailto; ungültige E-Mail → 2 Fehler, kein mailto; gültig → `mailto:info@newyorknails-schlieren.ch?subject=…` mit Name, Betreff und Nachricht, Sonderzeichen kodiert (`%0A`, `%26`, `%23`), Hinweis nennt das E-Mail-Programm, Kopieren-Knopf als Rückfall; nichts an einen Server gesendet.
- Fehlerseite 404 mit Link zur Startseite; alle 10 Seiten per Direktaufruf und nach Neuladen 200 mit genau einer h1.
- Reduzierte Bewegung: kein `scroll-behavior: smooth`. Dunkles Schema: dunkler Grund, helle Schrift, weisse Wortmarke in der Kopfzeile.

**Screenshots** (hell und dunkel, 390 und 1440 px): `pruefung/screenshots/` (lokal, nicht im Repository).

## 4. Mobiler Prüfbericht (Zusammenfassung für den Auftrag)

| Punkt | 360 px | 390 px | 768 px | 1440 px |
| --- | --- | --- | --- | --- |
| Kein horizontales Scrollen | ✓ alle 11 Seiten | ✓ | ✓ | ✓ |
| Touch-Ziele ≥ 44 × 44 px | ✓ (Audit, 0 Befunde) | ✓ | ✓ | ✓ |
| Leistungen und Preise lesbar, Varianten und Zuschläge eindeutig zugeordnet | ✓ Zeilen untereinander: Ausführung, Dauer, Preis, Hinweis | ✓ | ✓ dreispaltig | ✓ |
| Buchungsknopf erreichbar | ✓ Kopfzeile (ab 640 px) + feste Leiste unten (bis 1024 px) + Einstieg | ✓ | ✓ | ✓ Kopfzeile |
| Telefonlink | ✓ `tel:+41445575067` in Kopfzeile, Leiste, Menü, Kontakt, Fusszeile | ✓ | ✓ | ✓ |
| Mobile Navigation | ✓ Dialog mit Fokusfalle, Escape, Rückgabe des Fokus | ✓ | ✓ | Navigation in der Kopfzeile |
| Galerie ohne Hover-Zwang | entfällt (keine freigegebenen Bilder); Hover-Effekte nur unter `(hover: hover) and (pointer: fine)` | | | |
| Sichtbarer Tastaturfokus, Fokusreihenfolge | ✓ 3-px-Ring, Reihenfolge geprüft | ✓ | ✓ | ✓ |
| Kontraste | ✓ alle Textpaare AA, siehe Tabelle unten | | | |
| Semantische Überschriften | ✓ genau eine h1, keine Sprünge | ✓ | ✓ | ✓ |
| Alternativtexte | ✓ jedes Bild mit alt (Logos im Link: leer + aria-label des Links) | ✓ | ✓ | ✓ |
| Dialoge und Akkordeons zugänglich | ✓ natives `<dialog>` (Menü, Hinweis); Fragen-Akkordeon (`<details>`) vorbereitet, derzeit ohne Inhalt | | | |
| Keine verdeckten Inhalte | ✓ `scroll-padding-top`, Leiste mit Platz unter dem Inhalt | ✓ | ✓ | ✓ |
| `prefers-reduced-motion` | ✓ keine Scrollführung, Animationen nur ohne Reduktion | | | |

Nicht möglich war ein Test mit echten Geräten oder einem Screenreader (VoiceOver); geprüft wurde im headless Chrome.

## 5. Kontraste (gerechnet nach WCAG 2.1)

| Paar | Werte | Verhältnis | Stufe |
| --- | --- | --- | --- |
| Text (Tinte) auf Grund, hell | `#151617` auf `#f6f6f4` | 16.7:1 | AA |
| Text 2. Ordnung auf Grund, hell | `#44464a` auf `#f6f6f4` | 8.7:1 | AA |
| Grau (Etiketten) auf Grund, hell | `#5f6166` auf `#f6f6f4` | 5.7:1 | AA |
| Grau auf Fläche, hell | `#5f6166` auf `#fcfcfb` | 6.0:1 | AA |
| Gold-tief (Links, Fokus) auf Grund, hell | `#8a5f14` auf `#f6f6f4` | 5.2:1 | AA |
| Knopftext auf Knopf, hell | `#f6f6f4` auf `#151617` | 16.7:1 | AA |
| Knopftext auf Gold-tief (Hover), hell | `#f6f6f4` auf `#8a5f14` | 5.2:1 | AA |
| Nacht-Text auf Nacht (Farbblock) | `#f2f1ec` auf `#121211` | 16.6:1 | AA |
| Nacht-Text-2 auf Nacht | `#bdbcb4` auf `#121211` | 9.8:1 | AA |
| Gold auf Nacht (Linien, Links) | `#c9922b` auf `#121211` | 6.8:1 | AA |
| Nacht auf Gold (Knopf im Farbblock) | `#121211` auf `#c9922b` | 6.8:1 | AA |
| Text auf Grund, dunkel | `#f2f1ec` auf `#121211` | 16.6:1 | AA |
| Text 2. Ordnung, dunkel | `#c6c5be` auf `#121211` | 10.8:1 | AA |
| Grau, dunkel | `#a3a29b` auf `#121211` | 7.3:1 | AA |
| Gold-tief (Links), dunkel | `#d9a648` auf `#121211` | 8.5:1 | AA |
| Knopftext auf Knopf, dunkel | `#121211` auf `#d9a648` | 8.5:1 | AA |
| Fehler auf Grund, hell | `#a3261b` auf `#f6f6f4` | 6.8:1 | AA |
| Fehler auf Grund, dunkel | `#f09a8f` auf `#121211` | 8.7:1 | AA |

Formularfeld-Ränder: ursprünglich `#b4b4ae` auf `#f6f6f4` (1.9:1); geändert auf `--color-grau` (6.0:1 hell, 7.3:1 dunkel). Trennlinien
zwischen Abschnitten sind dekorativ und von 1.4.11 ausgenommen.

## 6. Lighthouse (lokaler Vorschau-Server, Chrome, `werkzeuge/qa/lighthouse.mjs`)

| Seite | Modus | Leistung | Barrierefreiheit | Best Practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | Desktop | 99 | 100 | 100 | 66 | 1.0 s | 0 | 0 ms |
| / | Mobil | 82 | 100 | 100 | 66 | 5.0 s | 0 | 20 ms |
| /leistungen/ | Desktop | 99 | 100 | 100 | 66 | 0.9 s | 0 | 0 ms |
| /leistungen/ | Mobil | 81 | 100 | 100 | 66 | 5.0 s | 0 | 10 ms |
| /leistungen/naegel/ | Desktop | 99 | 100 | 100 | 66 | 0.9 s | 0 | 0 ms |
| /leistungen/naegel/ | Mobil | 82 | 100 | 100 | 66 | 4.9 s | 0 | 20 ms |
| /kontakt/ | Desktop | 99 | 100 | 100 | 66 | 0.9 s | 0 | 0 ms |
| /kontakt/ | Mobil | 82 | 100 | 100 | 66 | 4.9 s | 0 | 10 ms |

Einordnung: SEO 66 ist beabsichtigt (Lighthouse wertet `noindex` als «nicht auffindbar»; einziger durchgefallener Punkt `is-crawlable`).
Die Mobilwerte entstehen am lokalen Server ohne Komprimierung bei simuliertem langsamem 4G; der LCP von rund 5 s ist dort der Textblock
nach dem JavaScript-Start (Next-Grundlast 593 KB unkomprimiert, etwa 170 KB komprimiert). Auf GitHub Pages mit Komprimierung fällt er
niedriger aus; die Messung auf der Live-Adresse steht in Abschnitt 8.

## 7. Codex-Prüfungen

**Architekturprüfung** (Codex CLI 0.154, `--sandbox read-only`, 17. Oktober 2026): 15 Befunde (2 hoch, 7 mittel, 6 niedrig), dazu
17 Bereiche «geprüft, keine Beanstandung» (Export, Unterpfad, noindex, Canonical/OG, Referenzen, mailto-Kodierung, JSON-LD-Maskierung,
externe Links, Vorschau-Server, Menüdialog, Sprunglink, HeuteMarker, ruhende Einwilligung, Rechtstexte, keine Geheimnisse, CI-Rechte).
Ein erster Lauf scheiterte an meiner Anweisung «kein Werkzeug aufrufen» (Codex konnte keine Dateien lesen) und wurde mit korrigierter
Anweisung wiederholt.

| Nr | Schwere | Befund | Umsetzung |
| --- | --- | --- | --- |
| 1 | hoch | Live-Freigabesperre erfasste Studioangaben, Bereiche und Kontaktseite nicht | ✓ `freigabe` für Einstellungen und Bereiche, `belege` für die Kontaktseite; `offeneFreigaben()` prüft alles (jetzt 29 Punkte) |
| 2 | hoch | Domainmodell akzeptierte jedes Linkziel; Komponenten reichten Ziele direkt an `Link` | ✓ `linkSchema.ziel` mit derselben Regel wie `istErlaubtesLinkziel` validiert; Inhaltslinks laufen über `SmartLink` |
| 3 | mittel | Bereichs-Buchungslinks nur auf Origin geprüft | ✓ müssen mit der einen Buchungsadresse beginnen (Prüfung und Studio-Hilfetext) |
| 4 | mittel | Sprungmarken der Rechtsseiten gingen beim Import verloren, Probevergleich blendete sie aus | ✓ Anker werden lokal und in Sanity aus dem Titel abgeleitet (`anker()` in `lib/content/text.ts`); Vergleich ohne Ausnahme |
| 5 | mittel | Pflichtfelder in Sanity nicht `required`, fehlende Arrays brächen den Build | ✓ `coalesce(…, [])` und `coalesce(…, false)` in den GROQ-Abfragen; Schalter in Sanity `required`, Listen mit Initialwert |
| 6 | mittel | Bereichsübersicht verlor «ab» und «Abweichung» | ✓ «ab CHF 10 bis 95, teils je nach Aufwand» |
| 7 | mittel | «fester Preis» im Studiotext | ✓ umformuliert |
| 8 | mittel | Kontaktdaten zusätzlich in freien Texten | ✓ Telefonnummer aus dem Studiotext entfernt; Prüfung vergleicht verbleibende Telefon-, E-Mail- und Adressangaben mit den Einstellungen |
| 9 | mittel | Zeitlich begrenzte Inhalte nur am Build-Tag, UTC | ✓ Zürcher Kalenderdatum (`zuercherDatum()`); Rebuild-Bedarf in `docs/INHALTE-PFLEGEN.md` dokumentiert. Nicht umgesetzt: täglicher Rebuild (kein Dienst eingerichtet) |
| 10 | niedrig | Probevergleich nutzt eigene Projektion statt der GROQ-Abfragen | nicht umgesetzt (bewusst): Die echten Abfragen laufen nur gegen ein Sanity-Projekt; dokumentiert als Grenze in `docs/SANITY-VERCEL-EINRICHTUNG.md` |
| 11 | niedrig | `aktion` ohne Wortgrenze; Preiskennzeichen nicht gegen Originaltext geprüft | ✓ `\baktion\b`; `ab`/`abweichung` werden mit `originalName`/`originalBeschreibung` plausibilisiert |
| 12 | niedrig | Impressum versprach «vollständige Liste», Code dedupliziert und liess das Vorschaubild weg | ✓ Text sagt «Bildquellen, je Datei einmal», Vorschaubild aufgenommen |
| 13 | niedrig | http-`SITE_URL` bei Indexierung erlaubt | ✓ nur https |
| 14 | niedrig | Hell- und Dunkelfassung als zwei eager geladene Bilder | ✓ `BildHellDunkel`: ein `<picture>` mit `media="(prefers-color-scheme: dark)"`, ein `<img>` |
| 15 | niedrig | Spiegel lädt alle Assets; Budgets nur für AVIF | ✓ nur referenzierte Assets; WebP- und Gesamtbudget |

## 8. Live (GitHub Pages, 17. Oktober 2026)

Workflow-Lauf 39045795403: Job «studio» 1 min 0 s, «build» (Inhalte, Lint, Typen, Import-Trockenlauf, Build, Export-Prüfung, Browser-Prüfungen)
2 min 50 s, «deploy» 8 s. Alle 10 Seiten per Direktaufruf 200, `/gibt-es-nicht/` 404 mit gestalteter Seite, `robots.txt` 200 ohne Sperre,
`sitemap.xml` 404, `noindex, nofollow` und Canonical auf `https://nick8952.github.io/new-york-nails-schlieren-demo/`.

Browser-Prüfungen gegen die Live-Adresse: DOM-Audit 44 + 44 Prüfungen (hell, dunkel) ohne Befund, Funktionsprüfungen 71/71.

| Seite | Modus | Leistung | Barrierefreiheit | Best Practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | Desktop | 100 | 100 | 100 | 66 | 0.5 s | 0 | 0 ms |
| / | Mobil | 99 | 100 | 100 | 66 | 2.3 s | 0 | 20 ms |
| /leistungen/ | Desktop | 100 | 100 | 100 | 66 | 0.5 s | 0 | 0 ms |
| /leistungen/ | Mobil | 99 | 100 | 100 | 66 | 2.2 s | 0 | 30 ms |
| /leistungen/naegel/ | Desktop | 100 | 100 | 100 | 66 | 0.5 s | 0 | 0 ms |
| /leistungen/naegel/ | Mobil | 99 | 100 | 100 | 66 | 2.0 s | 0 | 10 ms |
| /kontakt/ | Desktop | 100 | 100 | 100 | 66 | 0.4 s | 0 | 0 ms |
| /kontakt/ | Mobil | 99 | 100 | 100 | 66 | 2.1 s | 0 | 10 ms |

SEO 66 bleibt beabsichtigt (`noindex`, Punkt `is-crawlable`). Die Werte gelten für den Stand vor der Abschlussprüfung; die danach
geänderten Texte und die Einwilligungskomponente ändern nichts an Grösse oder Ladeverhalten.

## 9. Codex-Abschlussprüfung

Codex CLI, `--sandbox read-only`, nach dem ersten Push. 9 Befunde (2 hoch, 5 mittel, 2 niedrig), 15 Bereiche ohne Beanstandung,
Gesamturteil vor der Einarbeitung: «nicht freigabefähig». Alle neun wurden umgesetzt; danach liefen alle Prüfungen erneut grün.

| Nr | Schwere | Befund | Umsetzung |
| --- | --- | --- | --- |
| 1 | hoch | Unbelegte Aussagen: «nach drei bis vier Wochen», «fachgerecht», Gründe für Preisabweichungen, «wenige Schritte vom Bahnhof», Lumxi GmbH ohne Quelle | ✓ alle neutralisiert; Lumxi GmbH mit Quelle (Fusszeile der Buchungsseite) in den Rechtstexten und in der Inhaltsmatrix |
| 2 | hoch | Texte versprachen freie Zeiten und Terminbestätigung | ✓ Buchungstexte sagen nur noch, dass der Knopf den externen Dienst öffnet und Behandlung und Zeit dort gewählt werden |
| 3 | mittel | Rechtsseiten ohne `belege`; Live-Sperre nur per Stichwort | ✓ `belege` im Modell, in den Daten, im Studio-Schema, in GROQ und im Import; Sperre prüft beide Rechtsseiten (jetzt 31 Punkte); Stichwortprüfung bleibt zusätzlich |
| 4 | mittel | Ruhende Einwilligung las trotzdem `localStorage` | ✓ zwei Komponenten: ruhend (nur Hinweisdialog, kein Speicherzugriff) und aktiv (Hook nur mit Kategorien) |
| 5 | mittel | Buchungsregel für Bereichslinks nur im lokalen Prüfskript | ✓ `invariantenPruefen()` in `lib/content/index.ts` läuft im Build für lokale und Sanity-Inhalte (Buchungsknopf = Buchungsadresse, Bereichslinks beginnen mit ihr) |
| 6 | mittel | Inhaltsprüfung prüfte immer die JSON-Dateien | ✓ prüft die konfigurierte Quelle (`CONTENT_SOURCE`); Bildprüfungen nur lokal |
| 7 | mittel | Pflicht-Objekte im Studio nicht `required` | ✓ Adresse, Buchung, Kopfzeile, Leiste, Fusszeile, UI, Formular, Einwilligung, SEO, Einstieg und Abschnitte `required` |
| 8 | niedrig | Inline-Links ohne zentrale Linkregel | ✓ `LINKZIEL` im Inline-Schema, `linkzielErlaubt` an der Sanity-Annotation |
| 9 | niedrig | Zwei Originalbezeichnungen mit doppeltem Leerzeichen weichen von der Matrix ab | ✓ Matrix nennt die doppelten Leerzeichen (JSON ist wörtlich, Quelle enthält sie) |

Prüfstatus laut Codex: Lint, Typen, Inhaltsprüfung, Trockenlauf und Export-Prüfung bestanden; `npm run build` konnte in der
read-only-Sandbox nicht laufen (`tsx` ohne Schreibrecht für ein temporäres Socket), kein Projektfehler.

## 10. Nicht durchführbar

- Test mit echten Geräten und Screenreader (VoiceOver, TalkBack).
- Echter Sanity-Import, Build mit `CONTENT_SOURCE=sanity`, Webhook: Es existiert kein Projekt (Vorgabe des Auftraggebers).
- Abgleich mit dem Google-Maps-Profil (nicht abrufbar).
- Facebook-Seite (ohne Anmeldung nicht erreichbar).
