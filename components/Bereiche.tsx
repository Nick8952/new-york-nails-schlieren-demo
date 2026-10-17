import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import type { Kategorie, Leistung, Texte } from "@/lib/content/modell";
import { pfade } from "@/lib/content/pfade";

/** Kennzahlen eines Bereichs aus den tatsächlichen Positionen: Anzahl, Preisspanne, Dauerspanne. */
export function bereichKennzahlen(k: Kategorie, leistungen: Leistung[]) {
  const varianten = leistungen.filter((l) => l.kategorie === k.slug).flatMap((l) => l.varianten);
  const preise = varianten.map((v) => v.preis.chf);
  const dauern = varianten.map((v) => v.dauerMinuten);
  const preisMin = Math.min(...preise);
  return {
    anzahl: varianten.length,
    preisMin, preisMax: Math.max(...preise), dauerMin: Math.min(...dauern), dauerMax: Math.max(...dauern),
    /** Der günstigste Preis ist ein «ab»-Preis */
    minAb: varianten.some((v) => v.preis.chf === preisMin && v.preis.ab),
    /** Mindestens eine Position kann je nach Aufwand abweichen */
    abweichung: varianten.some((v) => v.preis.abweichung),
  };
}

/**
 * Die Leistungsbereiche als Zeilen: Titel, ein Satz, Anzahl Positionen, Preis- und Dauerspanne (aus den Daten gerechnet, nicht
 * behauptet). Jede Zeile führt zur Bereichsseite. Bewusst keine Kacheln mit Bildern: Es gibt keine freigegebenen Fotos.
 */
export function Bereiche({ kategorien, leistungen, ui }: { kategorien: Kategorie[]; leistungen: Leistung[]; ui: Texte["ui"] }) {
  return (
    <ol className="grid border-t border-linie-stark">
      {kategorien.map((k) => {
        const z = bereichKennzahlen(k, leistungen);
        return (
          <li key={k.slug} className="border-b border-linie-stark">
            <Link href={pfade.kategorie(k.slug)} className="zeile-link grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto] sm:items-center lg:py-8">
              <span className="titel-2">{k.titel}</span>
              <span className="grid gap-1">
                <span className="text-tinte-2">{k.kurz}</span>
                <span className="klein zahl text-grau">
                  {z.anzahl} {ui.leistungenZaehler} · {z.minAb ? `${ui.ab} ` : ""}CHF {z.preisMin} bis {z.preisMax}{z.abweichung ? `, teils ${ui.preisAbweichungKurz}` : ""} · {z.dauerMin} bis {z.dauerMax} {ui.minuten}
                </span>
              </span>
              <span className="inline-flex min-h-11 items-center gap-2 font-[family-name:var(--font-titel)] font-semibold text-gold-tief">
                {k.titel} ansehen
                <ArrowRightIcon size={20} aria-hidden="true" className="zeile-pfeil" />
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
