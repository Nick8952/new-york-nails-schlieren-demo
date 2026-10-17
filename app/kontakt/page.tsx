import type { Metadata } from "next";
import { Anfrageformular } from "@/components/Anfrageformular";
import { Buchungsknopf } from "@/components/Buchungsknopf";
import { Kontaktblock } from "@/components/Kontaktblock";
import { Seitenkopf } from "@/components/Seitenkopf";
import { Wochenband } from "@/components/Wochenband";
import { inhaltsquelle, pfade } from "@/lib/content";
import { optionaleBereiche } from "@/lib/content/sichtbar";
import { seitenMetadaten } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const q = await inhaltsquelle();
  const [e, t, s] = await Promise.all([q.getEinstellungen(), q.getTexte(), q.getKontaktSeite()]);
  return seitenMetadaten({ titel: s.seoTitel ?? s.titel, beschreibung: s.seoBeschreibung, pfad: pfade.kontakt, einstellungen: e, texte: t });
}

/** Kontakt: Buchung (extern), direkte Wege, Anfahrt als Link, Öffnungszeiten, Nachricht per vorbereiteter E-Mail. */
export default async function KontaktSeite() {
  const q = await inhaltsquelle();
  const [e, t, s, galerie, team, fragen] = await Promise.all([q.getEinstellungen(), q.getTexte(), q.getKontaktSeite(), q.getGalerie(), q.getTeam(), q.getFragen()]);
  const sichtbar = optionaleBereiche({ einstellungen: e, galerie, team, fragen });
  return (
    <>
      <Seitenkopf titel={s.titel} einleitung={s.einleitung} />
      <div className="behaelter grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="grid content-start gap-10">
          <section aria-labelledby="buchung-titel" className="border border-linie-stark bg-flaeche p-6 lg:p-8">
            <h2 id="buchung-titel" className="titel-3">{s.buchungTitel}</h2>
            <p className="lauftext mt-3 text-tinte-2">{s.buchungText}</p>
            <div className="mt-5"><Buchungsknopf einstellungen={e} texte={t} /></div>
          </section>
          <section aria-labelledby="direkt-titel">
            <h2 id="direkt-titel" className="titel-3">{s.direktTitel}</h2>
            <div className="mt-4"><Kontaktblock einstellungen={e} ui={t.ui} /></div>
          </section>
          <section aria-labelledby="anfahrt-titel">
            <h2 id="anfahrt-titel" className="titel-3">{s.anfahrtTitel}</h2>
            <p className="lauftext mt-3 text-tinte-2">{s.anfahrtText}</p>
          </section>
          {sichtbar.oeffnungszeiten ? (
            <section aria-labelledby="zeiten-titel">
              <h2 id="zeiten-titel" className="titel-3">{s.zeitenTitel}</h2>
              <div className="mt-4"><Wochenband einstellungen={e} ui={t.ui} id="wochenband-kontakt" sonderzeiten={sichtbar.sonderzeiten} dunkel={false} /></div>
            </section>
          ) : null}
        </div>
        <div className="border-t border-linie-stark pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
          <Anfrageformular texte={t.formular} empfaenger={e.email} />
        </div>
      </div>
    </>
  );
}
