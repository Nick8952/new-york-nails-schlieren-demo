import type { Block, Inline } from "@/lib/content/modell";
import { SmartLink } from "./SmartLink";

function Teile({ teile }: { teile: Inline[] }) {
  return (
    <>
      {teile.map((t, i) => {
        if (typeof t === "string") return t;
        if (t.link) return <SmartLink key={i} ziel={t.link}>{t.text}</SmartLink>;
        if (t.fett) return <strong key={i}>{t.text}</strong>;
        return t.text;
      })}
    </>
  );
}

/** Fliesstext der Rechtsseiten aus dem Blockmodell (Absätze, Zwischentitel mit Sprungmarke, Aufzählungen). */
export function RichText({ bloecke }: { bloecke: Block[] }) {
  return (
    <div className="richtext">
      {bloecke.map((b, i) => {
        if (b.art === "titel") {
          const Tag = b.stufe === 3 ? "h3" : "h2";
          return <Tag key={i} id={b.anker} className="scroll-mt-24">{b.text}</Tag>;
        }
        if (b.art === "liste") return <ul key={i}>{b.punkte.map((p, j) => <li key={j}><Teile teile={p} /></li>)}</ul>;
        return <p key={i}><Teile teile={b.inhalt} /></p>;
      })}
    </div>
  );
}
