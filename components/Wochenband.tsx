import type { Einstellungen, Texte } from "@/lib/content/modell";
import { WOCHENTAGE } from "@/lib/content/modell";
import { datumText, minutenSeitMitternacht, WOCHENTAG_KURZ, WOCHENTAG_NAME } from "@/lib/format";
import { HeuteMarker } from "./HeuteMarker";

const SKALA_VON = 8 * 60;
const SKALA_BIS = 21 * 60;

/**
 * Wochenband: die Öffnungszeiten als Goldlinien auf einer Skala von 8 bis 21 Uhr, ein Tag je Zeile. Die Linie ist aria-hidden;
 * der Text nennt die Zeiten. Der heutige Tag wird nach dem Laden hervorgehoben (HeuteMarker).
 */
export function Wochenband({ einstellungen: e, ui, id, sonderzeiten, dunkel = true }: { einstellungen: Einstellungen; ui: Texte["ui"]; id: string; sonderzeiten: Einstellungen["sonderzeiten"]; dunkel?: boolean }) {
  const zeilen = WOCHENTAGE.map((tag) => e.oeffnungszeiten.find((o) => o.tag === tag)).filter((o): o is NonNullable<typeof o> => !!o);
  if (!zeilen.length) return null;
  return (
    <div>
      <ol id={id} className={`wochenband ${dunkel ? "" : "wochenband-hell"}`}>
        {zeilen.map((o) => {
          const von = o.geschlossen ? 0 : minutenSeitMitternacht(o.von as string);
          const bis = o.geschlossen ? 0 : minutenSeitMitternacht(o.bis as string);
          const links = Math.max(0, ((von - SKALA_VON) / (SKALA_BIS - SKALA_VON)) * 100);
          const breite = Math.max(0, ((bis - von) / (SKALA_BIS - SKALA_VON)) * 100);
          return (
            <li key={o.tag} className="wochenband-zeile" data-tag={o.tag}>
              <span className="wochenband-tag font-[family-name:var(--font-titel)] font-semibold">
                <span className="hidden min-[30rem]:inline">{WOCHENTAG_NAME[o.tag]}</span>
                <span className="min-[30rem]:hidden" aria-hidden="true">{WOCHENTAG_KURZ[o.tag]}</span>
                <span className="nur-sr min-[30rem]:hidden">{WOCHENTAG_NAME[o.tag]}</span>
              </span>
              <span className="wochenband-spur" aria-hidden="true">
                {o.geschlossen ? null : <span style={{ left: `${links}%`, width: `${breite}%` }} />}
              </span>
              <span className="klein zahl whitespace-nowrap">{o.geschlossen ? ui.geschlossen : `${o.von} bis ${o.bis} ${ui.uhr}`}</span>
            </li>
          );
        })}
      </ol>
      <HeuteMarker listeId={id} />
      {e.oeffnungszeitenHinweis ? <p className="klein mt-4 opacity-80">{e.oeffnungszeitenHinweis}</p> : null}
      {sonderzeiten.length ? (
        <div className="mt-5">
          <h3 className="etikett">{ui.sonderzeitenTitel}</h3>
          <ul className="klein mt-2 grid gap-1">
            {sonderzeiten.map((s) => (
              <li key={s._key}><strong>{s.titel}</strong>: {datumText(s.von)} bis {datumText(s.bis)}, {s.zeiten ?? ui.geschlossen}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
