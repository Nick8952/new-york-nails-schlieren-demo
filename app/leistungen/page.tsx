import type { Metadata } from "next";
import { Buchungsknopf } from "@/components/Buchungsknopf";
import { Preisliste, laengsteDauer } from "@/components/Preisliste";
import { Seitenkopf } from "@/components/Seitenkopf";
import { inhaltsquelle, pfade } from "@/lib/content";
import { seitenMetadaten } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const q = await inhaltsquelle();
  const [e, t, s] = await Promise.all([q.getEinstellungen(), q.getTexte(), q.getLeistungenSeite()]);
  return seitenMetadaten({ titel: s.seoTitel ?? s.titel, beschreibung: s.seoBeschreibung, pfad: pfade.leistungen, einstellungen: e, texte: t });
}

/** Alle Leistungen und Preise auf einer Seite, nach Bereichen gegliedert, mit Sprungmarken je Bereich. */
export default async function LeistungenSeite() {
  const q = await inhaltsquelle();
  const [e, t, s, kategorien, leistungen] = await Promise.all([q.getEinstellungen(), q.getTexte(), q.getLeistungenSeite(), q.getKategorien(), q.getLeistungen()]);
  const skala = laengsteDauer(leistungen);
  return (
    <>
      <Seitenkopf titel={s.titel} einleitung={s.einleitung} />
      <div className="behaelter">
        <nav aria-label="Bereiche" className="border-y border-linie-stark py-3">
          <ul className="flex flex-wrap gap-x-1 gap-y-1">
            {kategorien.map((k) => (
              <li key={k.slug}>
                <a href={`#bereich-${k.slug}`} className="inline-flex min-h-11 items-center px-3 font-[family-name:var(--font-titel)] font-semibold underline-offset-8 hover:underline">
                  {k.titel}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 grid gap-6 border border-linie-stark bg-flaeche p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:p-8">
          <div>
            <h2 className="titel-4">{s.preisHinweisTitel}</h2>
            <p className="klein mt-2 max-w-[60ch] text-tinte-2">{s.preisHinweis}</p>
          </div>
          <div>
            <h2 className="titel-4">{s.buchungTitel}</h2>
            <p className="klein mt-2 max-w-[60ch] text-tinte-2">{s.buchungText}</p>
          </div>
        </div>
      </div>
      {kategorien.map((k) => {
        const liste = leistungen.filter((l) => l.kategorie === k.slug);
        return (
          <section key={k.slug} id={`bereich-${k.slug}`} className="abschnitt scroll-mt-20" aria-labelledby={`bereich-${k.slug}-titel`}>
            <div className="behaelter grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <h2 id={`bereich-${k.slug}-titel`} className="titel-2">{k.titel}</h2>
                <p className="klein mt-1 text-grau">{k.originalName}</p>
                <p className="lauftext mt-4 text-tinte-2">{k.einleitung}</p>
                <div className="mt-6">
                  <Buchungsknopf einstellungen={e} texte={t} url={k.buchungUrl} />
                </div>
              </div>
              <Preisliste leistungen={liste} ui={t.ui} skala={skala} />
            </div>
          </section>
        );
      })}
      <div className="behaelter">
        <p className="klein max-w-[70ch] border-t border-linie-stark pt-6 text-grau">{t.ui.standQuelle}</p>
      </div>
    </>
  );
}
