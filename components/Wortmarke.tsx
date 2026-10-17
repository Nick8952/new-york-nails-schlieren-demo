import type { Einstellungen } from "@/lib/content/modell";
import { Bild } from "./Bild";
import { BildHellDunkel } from "./BildHellDunkel";

/**
 * Die Wortmarke in der Fassung, die zur Fläche passt: schwarz auf hellem Grund, weiss auf dunklem Grund (Negativfassung, Form unverändert).
 * `dunkel` erzwingt die dunkle Fassung (Farbblock); sonst entscheidet das Farbschema des Systems über eine media-Abfrage im <picture>.
 */
export function Wortmarke({ einstellungen: e, dunkel = false, className = "", sizes = "180px", prio = false }: { einstellungen: Einstellungen; dunkel?: boolean; className?: string; sizes?: string; prio?: boolean }) {
  if (dunkel) return <Bild bild={e.logoDunkel} alt="" sizes={sizes} className={className} prio={prio} />;
  return <BildHellDunkel hell={e.logo} dunkel={e.logoDunkel} alt="" sizes={sizes} className={className} prio={prio} />;
}
