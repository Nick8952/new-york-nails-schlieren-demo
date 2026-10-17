# Anweisungen für Codex

Für dieses Projekt gelten `CLAUDE.md` in diesem Ordner (Architektur, Regeln, Befehle) und `../AGENTS.md` (Workspace, Obsidian-Brain).
Kurzfassung der harten Regeln:

- Statischer Export, keine Serverfunktionen, keine Anfragen an Dritte beim Seitenaufruf, Demo bleibt `noindex`.
- Nichts erfinden: Preise und Dauern nur aus `data/leistungen.json` (wörtliche Originalbezeichnungen aus der Buchungsplattform), jede
  Angabe mit Quelle. Website und Buchungssystem sind getrennte Datenquellen.
- Buchung nur als Link auf die bestehende Buchungsseite; Knopf heisst überall «Termin buchen». Keine Testbuchung.
- Formular nur als vorbereitete E-Mail; keine Nachrichten an das Studio senden.
- Schweizer Hochdeutsch ohne «ß», keine Gedankenstriche.
- Prüfen vor Abschluss: `npm run pruefen && npm run build && npm run export:pruefen`; Browser-Prüfungen mit `npm run vorschau:pages` + `npm run qa`.
- Reviews lesend ausführen, keine Sanity- oder Vercel-Projekte anlegen, keine Tokens anfordern.
