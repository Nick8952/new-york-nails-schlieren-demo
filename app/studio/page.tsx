import type { Metadata } from "next";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Bild } from "@/components/Bild";
import { BildHellDunkel } from "@/components/BildHellDunkel";
import { Seitenkopf } from "@/components/Seitenkopf";
import { SmartLink } from "@/components/SmartLink";
import { inhaltsquelle, pfade } from "@/lib/content";
import { optionaleBereiche } from "@/lib/content/sichtbar";
import { seitenMetadaten } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const q = await inhaltsquelle();
  const [e, t, s] = await Promise.all([q.getEinstellungen(), q.getTexte(), q.getStudioSeite()]);
  return seitenMetadaten({ titel: s.seoTitel ?? s.titel, beschreibung: s.seoBeschreibung, pfad: pfade.studio, einstellungen: e, texte: t });
}

/** Studio: belegte Abschnitte, 360°-Ansicht als externer Link, Galerie/Team/Fragen nur mit freigegebenem Inhalt. */
export default async function StudioSeite() {
  const q = await inhaltsquelle();
  const [e, t, s, galerie, team, fragen] = await Promise.all([q.getEinstellungen(), q.getTexte(), q.getStudioSeite(), q.getGalerie(), q.getTeam(), q.getFragen()]);
  const sichtbar = optionaleBereiche({ einstellungen: e, galerie, team, fragen });
  return (
    <>
      <Seitenkopf titel={s.titel} einleitung={s.einleitung} />
      <div className="behaelter grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
        <div className="grid gap-10">
          {s.abschnitte.map((a) => (
            <section key={a._key} aria-labelledby={`abschnitt-${a._key}`}>
              <h2 id={`abschnitt-${a._key}`} className="titel-3">{a.titel}</h2>
              <p className="lauftext mt-3 text-tinte-2">{a.text}</p>
              {a.link ? <p className="mt-3"><SmartLink ziel={a.link.ziel} className="textlink">{a.link.text}</SmartLink></p> : null}
            </section>
          ))}
        </div>
        <div className="grid content-start gap-6">
          <BildHellDunkel hell={e.signet} dunkel={e.signetDunkel} sizes="(min-width: 64rem) 320px, 200px" className="mx-auto h-auto w-[200px] lg:w-[260px]" />
          {e.tourUrl ? (
            <a href={e.tourUrl} target="_blank" rel="noopener noreferrer" className="zeile-link grid gap-3 border border-linie-stark bg-flaeche p-6 hover:border-tinte">
              <span className="titel-3">{s.tourTitel}</span>
              <span className="klein text-tinte-2">{s.tourText}</span>
              <span className="inline-flex items-center gap-2 font-[family-name:var(--font-titel)] font-semibold text-gold-tief">
                {t.ui.tour}
                <ArrowUpRightIcon size={20} aria-hidden="true" className="zeile-pfeil" />
                <span className="nur-sr"> (öffnet in einem neuen Fenster)</span>
              </span>
            </a>
          ) : null}
        </div>
      </div>

      <section className="abschnitt" aria-labelledby="galerie-titel">
        <div className="behaelter">
          <h2 id="galerie-titel" className="titel-2">{s.galerieTitel}</h2>
          {sichtbar.galerie.length ? (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sichtbar.galerie.map((g) => (
                <li key={g._key}>
                  <figure>
                    <Bild bild={g.bild} sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 45vw, 90vw" className="aspect-[4/5] w-full object-cover" />
                    <figcaption className="klein mt-2 text-tinte-2">{g.titel}{g.bild.symbolbild ? ` (${t.ui.symbolbild})` : ""}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ) : (
            <p className="lauftext mt-4 text-tinte-2">
              {s.galerieText} {e.social.find((x) => x.plattform === "instagram") ? <SmartLink ziel={e.social.find((x) => x.plattform === "instagram")!.url} className="textlink">Instagram</SmartLink> : null}
            </p>
          )}
        </div>
      </section>

      {sichtbar.team ? (
        <section className="abschnitt border-t border-linie-stark" aria-labelledby="team-titel">
          <div className="behaelter">
            <h2 id="team-titel" className="titel-2">{s.teamTitel}</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m) => (
                <li key={m._key} className="grid gap-3">
                  {m.bild ? <Bild bild={m.bild} sizes="(min-width: 64rem) 30vw, 45vw" className="aspect-square w-full object-cover" /> : null}
                  <div><p className="titel-4">{m.name}</p>{m.rolle ? <p className="klein text-grau">{m.rolle}</p> : null}{m.text ? <p className="klein mt-2 text-tinte-2">{m.text}</p> : null}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {sichtbar.fragen ? (
        <section className="abschnitt border-t border-linie-stark" aria-labelledby="fragen-titel">
          <div className="behaelter">
            <h2 id="fragen-titel" className="titel-2">{s.fragenTitel}</h2>
            <div className="mt-6 max-w-[70ch]">
              {fragen.map((f) => (
                <details key={f._key} className="group border-b border-linie-stark first:border-t">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-[family-name:var(--font-titel)] font-semibold">
                    {f.frage}
                    <span aria-hidden="true" className="text-xl">+</span>
                  </summary>
                  <p className="pb-5 text-tinte-2">{f.antwort}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
