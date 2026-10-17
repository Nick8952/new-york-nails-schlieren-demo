import type { Metadata } from "next";
import { BildHellDunkel } from "@/components/BildHellDunkel";
import { SmartLink } from "@/components/SmartLink";
import { inhaltsquelle } from "@/lib/content";

export const metadata: Metadata = { title: "Seite nicht gefunden", robots: { index: false, follow: false } };

/** Fehlerseite: GitHub Pages liefert sie als 404.html aus (scripts/export-nachbereiten.mjs). */
export default async function NichtGefunden() {
  const q = await inhaltsquelle();
  const [e, t] = await Promise.all([q.getEinstellungen(), q.getTexte()]);
  return (
    <div className="behaelter grid gap-10 py-16 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center lg:py-24">
      <div>
        <h1 className="titel-1">{t.ui.nichtGefundenTitel}</h1>
        <p className="vorspann mt-5">{t.ui.nichtGefundenText}</p>
        <SmartLink ziel={t.ui.nichtGefundenLink.ziel} className="knopf knopf-primaer mt-8">{t.ui.nichtGefundenLink.text}</SmartLink>
      </div>
      <BildHellDunkel hell={e.signet} dunkel={e.signetDunkel} sizes="200px" className="mx-auto h-auto w-[160px] opacity-70 lg:w-[200px]" alt="" />
    </div>
  );
}
