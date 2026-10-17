import type { Bild as BildTyp } from "@/lib/content/modell";
import { assetUrl } from "@/lib/assets";

const srcset = (varianten: { breite: number; url: string }[]) => varianten.map((v) => `${assetUrl(v.url)} ${v.breite}w`).join(", ");

/**
 * Ein Bild mit zwei Fassungen (hell, dunkel): genau EIN <img>, die Fassung wählt der Browser über die media-Abfrage der <source>-Elemente.
 * So wird nur die passende Fassung geladen (keine zwei priorisierten Downloads), und es gibt keinen Sprung beim Wechsel des Farbschemas.
 * Beide Fassungen haben dieselben Abmessungen (Negativfassung desselben Originals).
 */
export function BildHellDunkel({ hell, dunkel, sizes, className, prio = false, alt }: { hell: BildTyp; dunkel: BildTyp; sizes: string; className?: string; prio?: boolean; alt?: string }) {
  const groesste = hell.quellen.webp[hell.quellen.webp.length - 1];
  return (
    <picture className="contents">
      {dunkel.quellen.avif.length ? <source media="(prefers-color-scheme: dark)" type="image/avif" srcSet={srcset(dunkel.quellen.avif)} sizes={sizes} /> : null}
      <source media="(prefers-color-scheme: dark)" type="image/webp" srcSet={srcset(dunkel.quellen.webp)} sizes={sizes} />
      {hell.quellen.avif.length ? <source type="image/avif" srcSet={srcset(hell.quellen.avif)} sizes={sizes} /> : null}
      <source type="image/webp" srcSet={srcset(hell.quellen.webp)} sizes={sizes} />
      <img src={assetUrl(groesste.url)} alt={alt ?? hell.alt} width={hell.breite} height={hell.hoehe} loading={prio ? "eager" : "lazy"} decoding="async" fetchPriority={prio ? "high" : undefined} className={className} />
    </picture>
  );
}
