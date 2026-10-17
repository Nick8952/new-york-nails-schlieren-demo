import type { Leistung, Texte } from "@/lib/content/modell";
import { dauerText, preisText } from "@/lib/format";
import { Zeitmass } from "./Zeitmass";

/** Längste Dauer über alle übergebenen Leistungen: gemeinsame Skala des Zeitmasses. */
export function laengsteDauer(leistungen: Leistung[]): number {
  return Math.max(60, ...leistungen.flatMap((l) => l.varianten.map((v) => v.dauerMinuten)));
}

/**
 * Preisliste eines Bereichs: je Leistung ein Titel, eine Beschreibung und eine Zeile je Ausführung mit Dauer (Zeitmass) und Preis.
 * Auf dem Handy stehen Ausführung, Dauer und Preis untereinander (kein horizontales Scrollen). Alles ist Text, nichts ist ein Bild.
 */
export function Preisliste({ leistungen, ui, skala, titelStufe = 3 }: { leistungen: Leistung[]; ui: Texte["ui"]; skala: number; titelStufe?: 2 | 3 }) {
  const Titel = titelStufe === 2 ? "h2" : "h3";
  return (
    <div className="grid gap-10">
      {leistungen.map((l) => (
        <article key={l.slug} id={`leistung-${l.slug}`} className="scroll-mt-24">
          <Titel className="titel-3">
            {l.titel}
            {l.titelEn ? <span className="etikett ml-2 font-normal">({l.titelEn})</span> : null}
          </Titel>
          <p className="lauftext mt-1.5 text-tinte-2">{l.beschreibung}</p>
          <ul className="mt-4">
            {l.varianten.map((v) => (
              <li key={v._key} className="position">
                <span className="font-medium">{v.titel}</span>
                <span className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <Zeitmass minuten={v.dauerMinuten} skala={skala} />
                  <span className="klein zahl text-tinte-2"><span className="nur-sr">{ui.dauer}: </span>{dauerText(v.dauerMinuten, ui)}</span>
                </span>
                <span className="zahl font-[family-name:var(--font-titel)] text-lg font-semibold sm:text-right">
                  <span className="nur-sr">{ui.preis}: </span>
                  {preisText(v.preis, ui)}
                  {v.preis.abweichung ? <span className="klein block font-normal text-grau sm:whitespace-nowrap">{ui.preisAbweichungKurz}</span> : null}
                </span>
                {v.hinweis ? <span className="klein text-grau sm:col-span-3">{v.hinweis}</span> : null}
              </li>
            ))}
          </ul>
          {l.hinweise.length ? (
            <ul className="klein mt-3 grid gap-1 text-grau">
              {l.hinweise.map((h) => <li key={h}>{h}</li>)}
            </ul>
          ) : null}
        </article>
      ))}
    </div>
  );
}
