# New York Nails Schlieren: Verkaufs-Demo

Entwurf einer neuen Website für New York Nails Schlieren (Nagelstudio, Ringstrasse 1, 8952 Schlieren). **Nicht die offizielle Website des
Studios.** Betreiber der Demo: Nick Holzbecher.

- Live (Entwurf, noindex): <https://nick8952.github.io/new-york-nails-schlieren-demo/>
- Technik: Next.js 16, TypeScript, Tailwind v4, statischer Export; Inhalte in `data/`; Sanity und Vercel vorbereitet, nicht eingerichtet.
- Anleitungen: `CLAUDE.md` (Architektur und Regeln), `docs/SANITY-VERCEL-EINRICHTUNG.md`, `docs/INHALTE-PFLEGEN.md`, `docs/UEBERGABE.md`.

```bash
npm install
npm run dev            # http://localhost:3000/new-york-nails-schlieren-demo/
npm run pruefen && npm run build && npm run export:pruefen
npm run vorschau:pages # http://localhost:4321/new-york-nails-schlieren-demo/
npm run qa
```

Alle Preise, Dauern und Öffnungszeiten stammen von der Buchungsseite des Studios bei Beauty Booking (Stand 16. Oktober 2026). Website
und Buchungssystem sind getrennte Datenquellen; eine Änderung auf der einen Seite erscheint nicht automatisch auf der anderen.
