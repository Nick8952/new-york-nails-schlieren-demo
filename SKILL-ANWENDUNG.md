# Skill-Anwendung

Ehrliche Übersicht, welche installierten Skills für dieses Projekt geprüft und wie sie angewendet wurden.

- **Digest** = die `SKILL.md` wurde vollständig von einem Hilfsagenten gelesen und in einen 35-KB-Regelauszug überführt (29 Skills,
  19 Konflikte, von Codex stichprobenartig gegen die Quellen geprüft); ich habe den Auszug vollständig gelesen und die Regeln von Hand befolgt.
- **ausgeführt** = das Werkzeug des Skills wurde tatsächlich gestartet.
- **Kopf** = nur Name und Kurzbeschreibung im Inventar beurteilt.

Konfliktregel des Auftrags: `design-taste-frontend` (v2) ist der Standard; die Gestaltung muss zur tatsächlichen Marke passen; widersprechende
Stile werden nicht vermischt; kein Brutalismus wegen eines Skills; keine App-Oberfläche auf dem Handy; Animationen dürfen Buchung, Lesbarkeit
und Leistung nicht beeinträchtigen; generierte Bilder nie als echte Arbeiten.

## Inventar

- Persönliche Skills (`~/.claude/skills`, gespiegelt in `~/.agents/skills`): 14, alle im Auftrag genannt
- Projekt-Skills (`.claude/skills`, gespiegelt in `.agents/skills`): 33, dazu `emil-design-eng` und `stop-slop` nur in `.agents/skills`
- Plugin-Skills: `design:*` (7), `vercel:*`, `anthropic-skills:*`, eingebaute Skills

## Im Auftrag genannte Skills

| Skill | Geprüft | Anwendung | Nichtanwendung oder Konflikt | Abschlusskontrolle |
| --- | --- | --- | --- | --- |
| `design-taste-frontend` (v2) | Digest | **angewendet.** Lesart und Stellwerte (Varianz 6, Bewegung 3, Dichte 4) in `docs/DESIGN.md`. Einstieg im ersten Bildschirm, Titel zwei Zeilen, Text 17 Wörter, ein primärer + ein sekundärer Knopf, höchstens vier Textelemente, kein Preis-Teaser und keine Vertrauensleiste im Einstieg. Ein Akzent (Gold, 65 % Sättigung), eine Farbfamilie, genau ein Farbblock, ein Radiussystem (0), dunkles Theme über Tokens in beiden Schemata getestet. Eine Überzeile bei sechs Abschnitten (Obergrenze 2), fünf Layoutfamilien, keine Drei-Kacheln-Reihe, keine Abschnittsnummern, keine Scroll-Hinweise, kein Gedankenstrich (maschinell geprüft), ein Wortlaut je Absicht («Termin buchen», maschinell geprüft). Icons nur Phosphor. Schriften lokal, kein Google-Fonts-Link. Lighthouse ausgeführt. | Abweichungen mit Grund: **Serife und Fraunces** waren der erste Entwurf und wurden nach dem Digest verworfen (v2 bannt Fraunces als Standard; die Marke nennt keine Serife) → Outfit. **Keine Motion-Bibliothek** (Bewegung 3: CSS genügt). **Keine Bildgenerierung** (Auftrag: keine KI-Nägel als Arbeiten; es gibt keine freigegebenen Fotos). **Dunkler Farbblock** ist der eine erlaubte Themewechsel, vom Auftrag ausdrücklich verlangt («helle und dunkle Flächen»). | Pre-Flight-Liste durchgegangen; maschinell belegt in `docs/PRUEFBERICHT.md` (Titelzeilen, Knöpfe im ersten Bildschirm, Kontraste, Wortlaut, Gedankenstriche, Touch-Ziele, beide Farbschemata). |
| `design-taste-frontend-v1` | Digest | nicht angewendet | Kein Kompatibilitätsbedarf; v2 ist Standard. Die v1-Verbote (Inter, zentrierter Hero, Dauerschleifen) binden nicht. | – |
| `full-output-enforcement` | Digest | **angewendet.** Alle Seiten, Komponenten, Schemas, Skripte und Dokumente sind vollständig ausgeschrieben. | – | Suche nach `TODO`, `FIXME`, «…» als Auslassung und Platzhaltertext im Quelltext: keine Treffer. |
| `high-end-visual-design` | Digest | **teilweise.** Übernommen: eigene Easing-Kurve statt `linear`/`ease-in-out`, keine Schlagschatten, `backdrop-blur` nur auf der fixierten Kopfzeile, `active:scale(0.98)`, z-Ebenen nur systemisch, Phosphor statt Lucide. | Verworfen: Doppelrand-Karten, Pillen-Navigation, 800-ms-Einblendungen, Überzeilen-Pillen vor jedem Titel, grosse Radien, Mesh-Hintergründe. Sie widersprechen der ruhigen Richtung und dem Standard-Skill. | Kontrolle im CSS: keine `box-shadow`, kein `linear`, kein `ease-in-out`. |
| `minimalist-ui` | Digest | **teilweise.** Übernommen: 1-px-Linien statt Kästen, Text nie reines Schwarz/Weiss, keine Emojis, keine Werbefloskeln, Akkordeon mit Plus-Zeichen (vorbereitet für Fragen), Zeilenhöhe 1.6. | Verworfen: Bone-Canvas `#F7F6F3`, Pastell-Etiketten, Serifen-Titel, 4-bis-6-px-Radien (Radiussystem ist 0). | Kontrolle im CSS: keine Verläufe, keine Pastelle. |
| `redesign-existing-projects` | Digest | **teilweise, als Prüfliste.** Rechtsseiten, gestaltete 404, Sprunglink, Formularprüfung, Favicon aus dem echten Signet, Metadaten und Open-Graph-Bild, aktuelle Seite markiert, Fokusring, Hover- und Druckzustände, semantisches HTML, `100dvh`. | Der eigentliche Zweck (bestehende Oberfläche auditieren) griff kaum: Die alte Website ist eine einzelne Seite mit Banner, Karte und Fusszeile. Ihr Audit steht in `docs/INHALTSMATRIX.md`, Abschnitt 1. | Alle Punkte der Liste erfüllt; Nachweis im Prüfbericht. |
| `gpt-taste` | Digest | **teilweise.** Übernommen: H1 nie über zwei Zeilen im breiten Container, kein Stempel/Badge und keine Statistik im Einstieg, keine Meta-Etiketten («SECTION 01»), `main` mit `overflow-x-hidden`, Hover-Vergrösserungen nur hover-gated (hier gar nicht nötig), keine Emojis. | Verworfen: GSAP-Pflicht, Pinning, Scrub-Reveals, Kartenstapel, Zufallsauswahl von Paradigmen, `py-32 md:py-48` pauschal, «Cinematic Center». Widerspricht «dezent, wenig JavaScript, keine Scrollführung». | – |
| `industrial-brutalist-ui` | Digest | nicht angewendet | Brutalismus passt nicht zu einem Nagelstudio; der Auftrag verbietet, ihn nur wegen des Skills zu verwenden. | – |
| `stitch-design-taste` | Digest | **teilweise.** Die siebenteilige Struktur der `DESIGN.md` (Atmosphäre, Farben mit Rollen, Typografie, Komponenten, Layout, Bewegung, Anti-Muster) ist in `docs/DESIGN.md` übernommen; Zahlen: max. ein Akzent < 80 % Sättigung, kein `#000000`, 65ch, `clamp()`-Titel, Touch 44 px, einspaltig < 768 px. | Verworfen: Dauerschleifen auf Komponenten, «nur ein CTA, kein sekundärer», Serifen-Whitelist (Fraunces, Instrument Serif), Google Stitch selbst. | – |
| `brandkit` | Digest | nicht angewendet | Bildgenerierung für Markenbretter; das Studio hat ein Logo, KI-Bilder sind ausgeschlossen. Die Markenanalyse (gemessene Farben, Wortmarke, Signet) steht in `docs/DESIGN.md`. | – |
| `image-to-code` | Digest | **teilweise.** Umsetzungsregeln: Titel 1 bis 3 Zeilen, erster Bildschirm auf kleinem Laptop lesbar (Titel, Text, Knopf, Signet), keine Karten in Karten, keine Pillen und Pseudo-Labels, Medien in festen Rahmen, variierter Abschnittsrhythmus. | Der Kern (zuerst Entwurfsbilder generieren und nachbauen) entfällt: keine KI-Bilder (Auftrag), stattdessen Screenshots des echten Builds als Prüfgrundlage. | Screenshots in vier Breiten und zwei Farbschemata gesichtet. |
| `imagegen-frontend-web` | Digest | nicht angewendet (nur Richtungsregeln) | Bildgenerierung ausgeschlossen. Übernommen ohne Bilder: nicht links-Text/rechts-Bild als Reflex (hier Text links, Signet rechts, weil das Signet hochformatig ist), eine Palette über alle Abschnitte, Hook → Beleg → Aktion (Einstieg → Bereiche mit echten Spannen → Buchung). | – |
| `imagegen-frontend-mobile` | Digest | nicht relevant | App-Bildschirme im Gerätrahmen; der Auftrag will ausdrücklich keine künstliche App-Oberfläche. Die mobile Leiste ist ein Website-Muster (zwei Links), keine Tab-Bar. | – |
| `find-skills` | Digest | nicht angewendet | Es fehlte kein Skill; nichts gesucht oder installiert, keine kostenpflichtigen Werkzeuge. | – |

## Zusätzlich genannte Skills

| Skill | Geprüft | Anwendung | Abschlusskontrolle |
| --- | --- | --- | --- |
| `frontend-design` | Digest | **angewendet.** Thema aus der Welt des Studios (die Goldlinie des eigenen Banners, Dauer und Zeiten als Linien), Plan vor Code (Farben mit Hex, Schriftrollen, Aufbau als Skizze, eine Signatur), Abgleich mit den drei KI-Standardlooks (Creme + Serife + Terrakotta, Schwarz + Neon, Broadsheet) und bewusster Abstand, «ein Zubehör entfernen» (Goldlinie unter Titeln gestrichen), Texte als Material («E-Mail vorbereiten», «Termin buchen»). | Selbstkritik in `docs/DESIGN.md`. |
| `ui-ux-pro-max` | Digest + **ausgeführt** | **teilweise.** `scripts/search.py` mit `--design-system`, `--domain color/typography/landing/ux` und `--stack nextjs` ausgeführt. Vorschlag (Rosa/Lavendel, Playfair/Inter, Testimonial-Karussell) bewusst **nicht** übernommen: widerspricht Marke, Auftrag und v2. Übernommen: Prüfpunkte (Kontrast 4.5:1, Touch 44 px + 8 px Abstand, Fokus, reduzierte Bewegung, Breiten 375/768/1024/1440, Textumbruch ohne feste Höhen), Stack-Regel `generateStaticParams`, Metadata-API. `next/image` wurde bewusst nicht verwendet (statischer Export ohne Optimierer; Varianten sind vorgerendert). | Ergebnisse im Prüfbericht; Begründung in `docs/DESIGN.md`. |
| `design:accessibility-review` | Digest | **angewendet** als Prüfliste nach WCAG 2.1 AA (1.1.1, 1.3.1, 1.4.3, 1.4.11, 2.1.1, 2.4.3, 2.4.7, 2.5.5, 3.3.1, 3.3.2, 4.1.2). Fund: Formularfeld-Ränder lagen bei 1.9:1 → auf 6.0:1 angehoben. | Kontrasttabelle, Tastaturprüfung, Touch-Ziele im Prüfbericht. Nicht möglich: Screenreader auf echtem Gerät. |
| `design:ux-copy` | Digest | **angewendet.** Knöpfe nennen das Ergebnis («Termin buchen», «E-Mail vorbereiten», «Nachricht kopieren»), ein Wort je Sache, Fehlermeldungen sagen, was fehlt und wie es richtig ist, keine Erfolgsmeldung ohne Erfolg, Leerzustände mit Weg («Sobald das Studio Fotos freigibt … Instagram»). | Wortlaut-Prüfung in `npm run inhalt:pruefen`. |
| `design:design-critique` | Digest | **angewendet** als Selbstkritik nach den ersten Screenshots: drei Titelzeilen → zwei; Wortmarke zu klein → 44 px; brauner Kasten der Banner-Wortmarke → Negativfassung. | Abschnitt «Selbstkritik» in `docs/DESIGN.md`. |
| `design:design-handoff` | Digest | **angewendet.** Tokens, Zustände, Breakpoints, Randfälle und Bewegung als Tabellen in `docs/DESIGN.md`. | – |
| `design:design-system` | Digest | **angewendet** als Audit der Tokens: Farben nur in `@theme` und im Dark-Mode-Block; in Komponenten keine Hex-Werte (Ausnahme: `themeColor` in `layout.tsx`, bewusst, weil Metadaten keine CSS-Variablen kennen). | Suche nach Hex-Werten in `components/` und `app/*.tsx`: nur `themeColor`. |
| `stop-slop` | Digest | **angewendet** auf alle deutschen Texte: keine Gedankenstriche, keine «nicht X, sondern Y»-Floskeln, aktive Sätze, konkrete Angaben statt «immer/jeder», Anrede «Sie». | `npm run inhalt:pruefen` (Gedankenstriche, Superlative). |
| `emil-design-eng` | Digest | **angewendet.** Häufigkeitstest: Knöpfe und Links (oft) nur 140 bis 200 ms Rückmeldung; Menü (gelegentlich) 240 ms Einblenden; nichts Dauerhaftes. `ease-out` für Eintritte, nie `ease-in`, nie `transition: all`, nur `transform`/`opacity`/Farben, Hover nur unter `(hover: hover) and (pointer: fine)`, Tastaturaktionen nicht animiert. | Kontrolle im CSS. |
| `frontend-ui-engineering` | Digest | **angewendet.** Komponenten unter 200 Zeilen, einfache lokale Zustände, semantisches HTML (`<dialog>`, `<address>`, `<ol>` für Wochentage), `aria-label` an Icon-Links, `role="alert"`/`role="status"`, Tests in vier Breiten, keine Konsolenfehler. | Audit und Funktionsprüfungen. |
| `using-agent-skills` | Digest | **angewendet.** Annahmen vor der Arbeit festgehalten (`docs/DESIGN.md`), Rückfragen gebündelt gestellt (Bilder, Repository, Google Maps), Nachweise durch Build- und Laufzeitprüfungen. | – |

## Weitere Projekt-Skills

| Skill | Geprüft | Anwendung |
| --- | --- | --- |
| `code-review-and-quality`, `doubt-driven-development` | Kopf | Zwei unabhängige Codex-Prüfungen (Architektur, Abschluss) statt eigener Checkliste; Befunde in `docs/PRUEFBERICHT.md` |
| `security-and-hardening` | Kopf | Vertrauensgrenze «Inhalte aus dem CMS»: Linkziel-Regel im Domainmodell (nach Codex-Befund 2), maskiertes JSON-LD, kodierte mailto-Links, keine Geheimnisse, Vorschau-Server ohne Pfadausbruch, minimale CI-Rechte, https-Pflicht bei Indexierung |
| `ci-cd-and-automation` | Kopf | Ablauf: Inhalte, Lint, Typen, Import-Trockenlauf, Build, Export-Prüfung, Browser-Prüfungen, erst dann Veröffentlichung; eigener Job für das Studio |
| `performance-optimization` | Kopf | Erst messen (Lighthouse, Budgets), dann handeln: zod nicht im Browser-Bundle, eine Bildquelle je Farbschema, lokale Schriften, Bildbudgets |
| `api-and-interface-design` | Kopf | Eine Schnittstelle `Inhaltsquelle`, ein Domainmodell, zwei Adapter, Prüfung an der Grenze |
| `documentation-and-adrs` | Kopf | `docs/ENTSCHEIDUNGEN.md` hält das Warum fest |
| `git-workflow-and-versioning` | Kopf | Fünf thematische Commits (Inhalte/Modell, Website, Sanity-Vorbereitung, Prüfungen/CI, Dokumentation) |
| `shipping-and-launch` | Kopf | Go-Live-Liste in `docs/SANITY-VERCEL-EINRICHTUNG.md` (Abschnitt 7) und `docs/UEBERGABE.md` |
| `vercel:*` | Kopf | Nicht angewendet: Vercel wird vom Auftraggeber später eingerichtet; `vercel.json` mit Build-Befehl vorbereitet |
| `design`, `banner-design`, `slides`, `brand`, `design-system`, `ui-styling` | Kopf | Nicht angewendet (Logo-/Banner-Generierung, Folien, shadcn): nichts davon im Auftrag. `brand`: Logoregeln (kein Umfärben in andere Farben, Negativfassung nur Weiss) in `docs/BILDER.md` |
| Übrige (`test-driven-development`, `spec-driven-development`, `interview-me`, `idea-refine`, `incremental-implementation`, `observability-and-instrumentation`, `deprecation-and-migration`, `context-engineering`, `code-simplification`, `constraint-driven-development`, `source-driven-development`, `browser-testing-with-devtools`, `planning-and-task-breakdown`, `debugging-and-error-recovery`) | Kopf | Nicht gesondert angewendet; ihre Anliegen sind durch die Prüfskripte (Tests), die Inhaltsmatrix (Spezifikation) und die Browser-Prüfungen mit puppeteer-core (statt Chrome-DevTools-MCP) abgedeckt |

## Ergebnis der Abschlussprüfung

- v2-Pre-Flight: alle Punkte erfüllt oder mit Grund abgewichen (siehe oben).
- Barrierefreiheit: 88 Audit-Prüfungen und 71 Funktionsprüfungen ohne Befund, Kontraste AA, Formularränder nachgebessert.
- Design-System-Audit: keine Hex-Werte in Komponenten (Ausnahme `themeColor`).
- stop-slop: Texte ohne Gedankenstriche und Superlative (maschinell), von Hand gegengelesen.
- Keine kostenpflichtigen Werkzeuge installiert, nichts generiert, keine Bilder als Studioarbeiten ausgegeben.
