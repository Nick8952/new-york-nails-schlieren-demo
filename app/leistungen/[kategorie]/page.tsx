import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Buchungsknopf } from "@/components/Buchungsknopf";
import { Preisliste, laengsteDauer } from "@/components/Preisliste";
import { Seitenkopf } from "@/components/Seitenkopf";
import { inhaltsquelle, pfade } from "@/lib/content";
import { seitenMetadaten } from "@/lib/seo";

// Statischer Export: alle Bereichsseiten entstehen beim Build, unbekannte Adressen gibt es nicht.
export const dynamicParams = false;

export async function generateStaticParams() {
  const q = await inhaltsquelle();
  return (await q.getKategorien()).map((k) => ({ kategorie: k.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ kategorie: string }> }): Promise<Metadata> {
  const { kategorie } = await params;
  const q = await inhaltsquelle();
  const [e, t, k] = await Promise.all([q.getEinstellungen(), q.getTexte(), q.getKategorie(kategorie)]);
  if (!k) return {};
  return seitenMetadaten({ titel: k.seoTitel ?? k.titel, beschreibung: k.seoBeschreibung, pfad: pfade.kategorie(k.slug), einstellungen: e, texte: t });
}

/** Ein Bereich mit allen Positionen, Preisen und Dauern; am Schluss die anderen Bereiche. */
export default async function KategorieSeite({ params }: { params: Promise<{ kategorie: string }> }) {
  const { kategorie } = await params;
  const q = await inhaltsquelle();
  const [e, t, k, kategorien, leistungen, s] = await Promise.all([q.getEinstellungen(), q.getTexte(), q.getKategorie(kategorie), q.getKategorien(), q.getLeistungen(), q.getLeistungenSeite()]);
  if (!k) notFound();
  const liste = leistungen.filter((l) => l.kategorie === k.slug);
  const skala = laengsteDauer(leistungen);
  const andere = kategorien.filter((x) => x.slug !== k.slug);
  return (
    <>
      <Seitenkopf titel={k.titel} einleitung={k.einleitung} />
      <div className="behaelter">
        <p className="klein text-grau">
          <Link href={pfade.leistungen} className="textlink">{t.ui.alleLeistungen}</Link> · {k.originalName} · {liste.flatMap((l) => l.varianten).length} {t.ui.leistungenZaehler}
        </p>
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
          <Preisliste leistungen={liste} ui={t.ui} skala={skala} titelStufe={2} />
          <aside className="grid content-start gap-6 lg:sticky lg:top-24 lg:self-start">
            <div className="border border-linie-stark bg-flaeche p-6">
              <h2 className="titel-4">{s.buchungTitel}</h2>
              <p className="klein mt-2 text-tinte-2">{s.buchungText}</p>
              <div className="mt-5"><Buchungsknopf einstellungen={e} texte={t} url={k.buchungUrl} /></div>
            </div>
            <div className="border border-linie-stark p-6">
              <h2 className="titel-4">{s.preisHinweisTitel}</h2>
              <p className="klein mt-2 text-tinte-2">{s.preisHinweis}</p>
            </div>
          </aside>
        </div>
        <p className="klein mt-10 max-w-[70ch] text-grau">{t.ui.standQuelle}</p>
        <nav aria-label={t.ui.weitereKategorien} className="mt-12 border-t border-linie-stark pt-8">
          <h2 className="etikett">{t.ui.weitereKategorien}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {andere.map((x) => (
              <li key={x.slug}>
                <Link href={pfade.kategorie(x.slug)} className="zeile-link inline-flex min-h-11 items-center gap-2 font-[family-name:var(--font-titel)] font-semibold underline-offset-8 hover:underline">
                  {x.titel}
                  <ArrowRightIcon size={18} aria-hidden="true" className="zeile-pfeil" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
