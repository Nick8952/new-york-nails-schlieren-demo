import type { Hinweis } from "@/lib/content/modell";
import { SmartLink } from "./SmartLink";

/** Zeitlich begrenzter Hinweis (zum Beispiel Ferien): erscheint nur, wenn er zum Build-Zeitpunkt gültig ist (lib/content/sichtbar.ts). */
export function Hinweisleiste({ hinweis }: { hinweis: Hinweis | null }) {
  if (!hinweis) return null;
  return (
    <div className="border-b border-linie-stark bg-flaeche-2">
      <p className="behaelter klein py-2.5">
        {hinweis.text}
        {hinweis.link ? <> <SmartLink ziel={hinweis.link.ziel} className="textlink">{hinweis.link.text}</SmartLink></> : null}
      </p>
    </div>
  );
}
