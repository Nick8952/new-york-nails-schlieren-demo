# Gestaltung «Goldlinie»

## Lesart (Design Read)

Gelesen als: Verkaufs-Demo für ein Nagelstudio, Zielgruppe sind Kundinnen und Kunden in Schlieren und Umgebung, die eine
Behandlung buchen wollen; Sprache der Gestaltung ist «gepflegt, präzise, zurückhaltend luxuriös», gelehnt an die eigene Marke des Studios
(schwarze geometrische Wortmarke, auf dem eigenen Banner weiss und gold auf Schwarz). Stellwerte: **Varianz 6, Bewegung 3, Dichte 4.**
Die Aufgabe der Seite: Preise verständlich zeigen und ohne Umweg zur bestehenden Buchung führen.

Stack (geprüft in `package.json`): Next.js 16, Tailwind v4 über `@tailwindcss/postcss`, eigene CSS-Klassen in `@layer components`,
keine Motion-Bibliothek (Bewegung 3 kommt mit CSS aus), Icons nur aus `@phosphor-icons/react` (Regular, eine Stärke).

## Annahmen

- Das Logo ist die Marke: schwarz auf weiss (Buchungsseite), weiss und gold auf schwarz (Jubiläumsbanner). Gold ist deshalb kein
  beliebiges Beauty-Klischee, sondern die eigene Kampagnenfarbe des Studios; die gemessenen Töne liegen zwischen `#D08020` und `#905000`.
- Keine Fotos mit geklärten Rechten. Das Design trägt deshalb ohne Bilder: Typografie, die beiden Logofassungen und Daten (Zeiten, Dauern).
- Rosa, Glitzer und Schreibschrift fehlen bewusst; sie kommen in der Marke nicht vor (das Banner nutzt zwar eine Schreibschrift für
  «10 Jahre», aber nur als Jubiläumsschmuck).

## Farben (Tokens, `app/globals.css`)

| Token | Hell | Dunkel | Rolle |
| --- | --- | --- | --- |
| `--color-grund` | `#f6f6f4` | `#121211` | Seitenfläche (nie reines Weiss oder Schwarz) |
| `--color-flaeche` | `#fcfcfb` | `#1d1d1b` | Karten, Fusszeile, Formularfelder |
| `--color-flaeche-2` | `#efefec` | `#262624` | Hinweiszeilen |
| `--color-tinte` | `#151617` | `#f2f1ec` | Text, Knöpfe auf hellem Grund |
| `--color-tinte-2` | `#44464a` | `#c6c5be` | Lauftext zweiter Ordnung |
| `--color-grau` | `#5f6166` | `#a3a29b` | Etiketten, Hinweise (Kontrast 5.6:1 bzw. 8.3:1) |
| `--color-linie` / `-stark` | `#dcdcd8` / `#b4b4ae` | `#2f2f2c` / `#4d4d48` | Trennlinien, Zeitmass-Spur |
| `--color-gold` | `#c9922b` | gleich | der eine Akzent: Goldlinie, Zeitmass, Wochenband, Knopf auf dunkler Fläche (Sättigung 65 %) |
| `--color-gold-tief` | `#8a5f14` | `#d9a648` | Gold als Text und Fokusring auf hellem Grund (5.5:1), auf dunklem Grund heller |
| `--color-nacht` | `#121211` | `#0b0b0a` | der eine Farbblock (Öffnungszeiten und Buchung) |

Gemessene Kontraste (hell): Tinte auf Grund 16.9:1, Tinte-2 8.6:1, Grau 5.6:1, Gold-tief 5.5:1, Knopftext `#f6f6f4` auf `#151617` 16.9:1.
Dunkel: Nacht-Text `#f2f1ec` auf `#121211` 17.3:1, Gold `#c9922b` auf `#121211` 7.4:1, Nacht auf Gold (Knopf) 7.4:1.
Prüfung: `werkzeuge/qa/audit.mjs` misst Textgrössen; die Kontraste wurden mit einem WCAG-Rechner nachgerechnet (siehe Prüfbericht).

Nicht verwendet: die Beige-Töne und Messing-Akzente der Vorlagen (`#f5f1ea`, `#b08947` …). Das Gold hier ist aus dem Banner des Studios
gemessen und auf eine Rolle beschränkt.

## Schrift

| Rolle | Schrift | Gewicht | Grössen |
| --- | --- | --- | --- |
| Titel, Knöpfe, Navigation, Etiketten | Outfit (variabel, lokal via `next/font/local`, OFL) | 500 bis 600 | `.titel-1` clamp(2.375rem … 4.5rem), `.titel-2` bis 2.9rem, `.titel-3` bis 1.55rem, `.titel-4` 1.0625rem |
| Lauftext, Zahlen | Manrope (variabel, lokal, OFL) | 400 bis 700, `tabular-nums` für Preise und Zeiten | 1.0625rem / 1.6, `.klein` 0.9rem |

Outfit, weil die Wortmarke des Studios eine geometrische Grotesk ist; Manrope, weil sie Zahlenkolonnen ruhig setzt. Keine Serife (die Marke
nennt keine), keine Google-Fonts-Einbindung. Emphase durch Gewicht derselben Familie.

## Formen und Flächen

- Radius 0 überall (Knöpfe, Felder, Karten, Dialog): passend zur kantigen Wortmarke. Ein System, keine Mischung.
- Keine Schlagschatten. Trennung durch 1-px-Linien in `--color-linie`, Flächen durch Tonstufen derselben Familie.
- Genau ein Farbblock je Seite: der dunkle Abschnitt «Öffnungszeiten und Termin buchen» auf der Startseite. Alle anderen Abschnitte bleiben
  in einer Familie; es wechseln sich keine hellen und dunklen Streifen ab.
- Dunkles Theme über `prefers-color-scheme` mit denselben Tokens; die Logos wechseln auf ihre Negativfassung (`dark:hidden` / `dark:contents`).

## Signatur: die Goldlinie

Ein 2-px-Goldstrich, der nur dort erscheint, wo er etwas bedeutet:

1. **Unter der Kopfzeile** und über der Fusszeile: der Rahmen der Seite.
2. **Zeitmass** in der Preisliste: jede Position zeigt ihre Dauer als Goldlinie auf einer gemeinsamen Skala (längste Position = volle
   Länge, hier 120 Minuten). Encodiert echte Daten; aria-hidden, der Text nennt die Minuten.
3. **Wochenband** bei den Öffnungszeiten: jeder Tag eine Linie von 8 bis 21 Uhr, der heutige Tag wird nach dem Laden hervorgehoben.

Kein dekorativer Einsatz: keine Goldlinie unter Titeln, keine Goldrahmen, kein Glitzer.

## Aufbau der Startseite

```text
┌──────────────────────────────────────────────────────────────┐
│ Entwurfshinweis (nur in der Demo)                            │
│ Wortmarke   Leistungen und Preise  Studio  Kontakt  ☎  [Termin buchen] │
│ ═══════════════════════ Goldlinie ═══════════════════════════ │
│ Adresse (Etikett)                              ┌──────────┐  │
│ Nails, Lashes                                  │  Signet  │  │
│ & Beauty Care                                  │    N     │  │
│ Text (17 Wörter)                               └──────────┘  │
│ [Termin buchen] [Leistungen und Preise]                      │
├──────────────────────────────────────────────────────────────┤
│ Vier Bereiche, eine Adresse          Text                    │
│ ─ Nägel      Satz · 16 Positionen · CHF 10 bis 95  Nägel ansehen → │
│ ─ Wimpern …  ─ Waxing …  ─ Massage …                         │
│ Preise auf einen Blick … [Alle Leistungen und Preise]        │
├────────────────────── dunkler Farbblock ─────────────────────┤
│ Öffnungszeiten (Wochenband)      │ Wortmarke weiss           │
│ Mo ━━━━━━━━━━ 09:30 bis 20:00    │ Termin buchen             │
│ …                                │ [Termin buchen] [Anrufen] │
├──────────────────────────────────────────────────────────────┤
│ Das Studio an der Ringstrasse    │ ┌ 360°-Ansicht (Link) ┐   │
├──────────────────────────────────────────────────────────────┤
│ Kontakt und Anfahrt              │ Adresse, Telefon, E-Mail, Route │
├──────────────── Goldlinie ───────────────────────────────────┤
│ Leitsatz  Wortmarke · Kontakt · Zeiten · Seiten · Rechtliches │
└──────────────────────────────────────────────────────────────┘
Mobil (< 64 rem): eine Spalte; feste Leiste unten mit «Anrufen» und «Termin buchen».
```

Sechs Abschnitte, fünf Layoutfamilien (Split mit Bildmarke, Zeilenliste, Farbblock mit Datenband, Text mit Linkkarte, Kontaktraster),
eine Überzeile (Adresse im Einstieg), keine Abschnittsnummern, keine Drei-Kacheln-Reihe, keine Bewertungen, kein Preis-Teaser im Einstieg.

## Bewegung (Bewegung 3)

| Element | Auslöser | Dauer / Kurve | Begründung |
| --- | --- | --- | --- |
| Knöpfe | Hover, Druck | 180 ms `--ease-aus`, `scale(0.98)` beim Druck | Rückmeldung |
| Zeilenpfeile (Bereiche, Links) | Hover, nur `(hover: hover) and (pointer: fine)` | 200 ms, 4 px | zeigt die Richtung des Links |
| Menü-Dialog | Öffnen | 240 ms Einblenden von oben, nur ohne `prefers-reduced-motion` | Herkunft des Menüs |
| Textlinks | Hover | 160 ms Linienstärke | Rückmeldung |

Keine Scroll-Animationen, kein Pinning, keine Laufbänder, keine Einblendungen beim Laden. `scroll-behavior: smooth` nur ohne reduzierte Bewegung.
Nur `transform`, `opacity` und Farben werden animiert.

## Zustände und Bedienung

| Element | Standard | Hover | Fokus | Aktiv | Deaktiviert |
| --- | --- | --- | --- | --- | --- |
| Knopf primär (hell) | Tinte auf Grund-Text | Gold-tief | 3-px-Ring Gold-tief, Abstand 3 px | scale 0.98 | 60 % Deckkraft, `cursor-not-allowed` (nur Formular ohne JavaScript) |
| Knopf primär (dunkler Block / dunkles Theme) | Gold, Text Nacht | Nacht-Text | Ring Gold | scale 0.98 | – |
| Knopf sekundär | Rand Tinte, transparent | gefüllt | Ring | scale 0.98 | – |
| Navigation | Text | Unterstrich | Ring | – | aktuelle Seite: Gold-tief, Unterstrich, `aria-current` |
| Formularfeld | Rand Linie-stark | – | Rand Gold-tief + Ring | – | Fehler: Rand Rot, Meldung `role="alert"` darunter |

Touch-Ziele mindestens 44 × 44 px (geprüft), Textgrösse nie unter 14 px, Fokus immer sichtbar, Dialog mit Fokusfalle und Escape.

## Breakpoints und Randfälle

- `< 40 rem`: Preiszeilen untereinander (Ausführung, Zeitmass + Minuten, Preis). Wochenband mit Kurznamen (Mo, Di …).
- `40 bis 64 rem`: Preiszeilen dreispaltig, Startseite einspaltig, Menü im Dialog, feste Leiste unten.
- `≥ 64 rem`: Navigation in der Kopfzeile, zweispaltige Abschnitte, Leiste ausgeblendet.
- Lange Wörter («Wimpernverlängerung», «Datenschutzerklärung») dürfen in Titeln getrennt werden (`hyphens: auto`).
- Fehlende Bilder: Galerie, Team und Fragen erscheinen erst mit Inhalt (`lib/content/sichtbar.ts`); bis dahin ein ehrlicher Satz.
- Sehr lange Nachrichten im Formular: Kurzfassung im E-Mail-Link, voller Text in der Zwischenablage oder zum Kopieren.

## Selbstkritik nach den Screenshots

- Erster Blick (2 Sekunden): Marke, Ort, Angebot und der Buchungsknopf sind da; nichts lenkt ab. Gut.
- Bedienbarkeit: «Termin buchen» ist auf jeder Seite an derselben Stelle (Kopfzeile) und auf dem Handy in der Leiste. Gut.
- Hierarchie: Der Einstieg hatte drei Titelzeilen; «in Schlieren» ist in die Überzeile und den Text gewandert, der Titel hat zwei Zeilen.
- Konsistenz: Die Wortmarke in der Kopfzeile war klein (40 px); jetzt 44 px auf grossen Bildschirmen.
- Was fehlt und bewusst fehlt: Fotos. Sobald das Studio welche freigibt, trägt die Galerie sie (Aufnahmeliste in `docs/BILDER.md`).
- Entfernt: der Gedanke an eine Goldlinie unter jedem Abschnittstitel (Dekoration ohne Bedeutung).

## Vorlagen und Werkzeuge, die bewusst nicht gefolgt wurden

Das Suchwerkzeug des Skills `ui-ux-pro-max` schlug für «nail salon beauty studio premium» Rosa/Lavendel (`#EC4899`, `#8B5CF6`, Grund
`#FDF2F8`) mit Playfair Display/Inter vor. Das ist genau die beliebige Beauty-Kombination, die der Auftrag ausschliesst, und widerspricht der
Marke. Übernommen wurden nur die Prüfpunkte (Kontrast 4.5:1, Fokus, reduzierte Bewegung, Breiten 375/768/1024/1440).
