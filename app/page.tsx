import type { Metadata } from "next";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Bereiche } from "@/components/Bereiche";
import { BildHellDunkel } from "@/components/BildHellDunkel";
import { Buchungsknopf } from "@/components/Buchungsknopf";
import { Kontaktblock } from "@/components/Kontaktblock";
import { SmartLink } from "@/components/SmartLink";
import { Wochenband } from "@/components/Wochenband";
import { Wortmarke } from "@/components/Wortmarke";
import { inhaltsquelle, pfade } from "@/lib/content";
import { optionaleBereiche } from "@/lib/content/sichtbar";
import { telLink } from "@/lib/assets";
import { telefonAnzeige } from "@/lib/format";
import { seitenMetadaten } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const q = await inhaltsquelle();
  const [e, t, s] = await Promise.all([q.getEinstellungen(), q.getTexte(), q.getStartseite()]);
  return seitenMetadaten({ titel: s.seoTitel ?? s.hero.titel, beschreibung: s.seoBeschreibung, pfad: pfade.start, einstellungen: e, texte: t, istStart: true });
}

export default async function Startseite() {
  const q = await inhaltsquelle();
  const [e, t, s, kategorien, leistungen, galerie, team, fragen] = await Promise.all([q.getEinstellungen(), q.getTexte(), q.getStartseite(), q.getKategorien(), q.getLeistungen(), q.getGalerie(), q.getTeam(), q.getFragen()]);
  const sichtbar = optionaleBereiche({ einstellungen: e, galerie, team, fragen });

  return (
    <>
      {/* Einstieg: Adresse als Überzeile, Titel aus der Leitzeile des Logos, zwei Knöpfe. Rechts das Signet (das einzige freigegebene Bild). */}
      <section className="behaelter grid items-center gap-10 pb-14 pt-10 lg:min-h-[calc(100dvh-7rem)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16 lg:pb-20 lg:pt-6" aria-labelledby="einstieg-titel">
        <div>
          <p className="etikett">{s.hero.ueberzeile}</p>
          <h1 id="einstieg-titel" className="titel-1 mt-4 max-w-[16ch]">{s.hero.titel}</h1>
          <p className="vorspann mt-6">{s.hero.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Buchungsknopf einstellungen={e} texte={t} />
            <SmartLink ziel={s.hero.zweiterKnopf.ziel} className="knopf knopf-sekundaer">{s.hero.zweiterKnopf.text}</SmartLink>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[18rem] lg:max-w-[24rem]">
          <BildHellDunkel hell={e.signet} dunkel={e.signetDunkel} sizes="(min-width: 64rem) 384px, 288px" className="h-auto w-full" prio />
        </div>
      </section>

      {/* Bereiche als Zeilen mit Kennzahlen aus den Daten */}
      <section className="abschnitt" aria-labelledby="bereiche-titel">
        <div className="behaelter">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-end">
            <h2 id="bereiche-titel" className="titel-2">{s.leistungen.titel}</h2>
            <p className="vorspann lg:justify-self-end lg:max-w-[52ch]">{s.leistungen.text}</p>
          </div>
          <div className="mt-8 lg:mt-12">
            <Bereiche kategorien={kategorien} leistungen={leistungen} ui={t.ui} />
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <p className="lauftext text-tinte-2"><strong>{s.preise.titel}.</strong> {s.preise.text}</p>
            <SmartLink ziel={s.preise.link.ziel} className="knopf knopf-sekundaer">{s.preise.link.text}</SmartLink>
          </div>
        </div>
      </section>

      {/* Der eine Farbblock der Seite: Öffnungszeiten als Wochenband und der Aufruf zur Buchung */}
      <section className="nacht abschnitt border-y border-nacht-linie" aria-labelledby="zeiten-titel">
        <div className="behaelter grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 id="zeiten-titel" className="titel-2">{s.zeiten.titel}</h2>
            <p className="vorspann mt-4">{s.zeiten.text}</p>
            <div className="mt-8">
              {sichtbar.oeffnungszeiten ? <Wochenband einstellungen={e} ui={t.ui} id="wochenband-start" sonderzeiten={sichtbar.sonderzeiten} /> : null}
            </div>
          </div>
          <div className="lg:border-l lg:border-nacht-linie lg:pl-16">
            <Wortmarke einstellungen={e} dunkel className="h-auto w-[200px]" sizes="200px" />
            <h2 className="titel-2 mt-8">{s.buchung.titel}</h2>
            <p className="vorspann mt-4">{s.buchung.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Buchungsknopf einstellungen={e} texte={t} />
              <a href={telLink(e.telefon)} className="knopf knopf-sekundaer">{t.kopf.anrufen}: {telefonAnzeige(e.telefon)}</a>
            </div>
            <p className="klein mt-5 text-nacht-text-2">{e.buchung.hinweis}</p>
          </div>
        </div>
      </section>

      {/* Studio: Text und der Link in die 360°-Ansicht (extern, kein Iframe) */}
      <section className="abschnitt" aria-labelledby="studio-titel">
        <div className="behaelter grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h2 id="studio-titel" className="titel-2">{s.studio.titel}</h2>
            <p className="vorspann mt-4">{s.studio.text}</p>
            <SmartLink ziel={s.studio.link.ziel} className="knopf knopf-sekundaer mt-8">{s.studio.link.text}</SmartLink>
          </div>
          {e.tourUrl ? (
            <a href={e.tourUrl} target="_blank" rel="noopener noreferrer" className="zeile-link grid min-h-[12rem] content-end gap-3 border border-linie-stark bg-flaeche p-6 hover:border-tinte lg:p-8">
              <span className="etikett">Google Maps</span>
              <span className="titel-3">{t.ui.tour}</span>
              <span className="inline-flex items-center gap-2 font-[family-name:var(--font-titel)] font-semibold text-gold-tief">
                Öffnet in einem neuen Fenster
                <ArrowUpRightIcon size={20} aria-hidden="true" className="zeile-pfeil" />
              </span>
            </a>
          ) : null}
        </div>
      </section>

      {/* Kontakt */}
      <section className="abschnitt border-t border-linie-stark" aria-labelledby="kontakt-titel">
        <div className="behaelter grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 id="kontakt-titel" className="titel-2">{s.kontakt.titel}</h2>
            <p className="vorspann mt-4">{s.kontakt.text}</p>
            <p className="mt-6"><SmartLink ziel={pfade.kontakt} className="textlink">Kontaktseite mit Nachrichtenformular</SmartLink></p>
          </div>
          <Kontaktblock einstellungen={e} ui={t.ui} mitTour={false} />
        </div>
      </section>
    </>
  );
}
