import { ArrowUpRightIcon, FacebookLogoIcon, InstagramLogoIcon } from "@phosphor-icons/react/dist/ssr";
import type { Einstellungen, Texte } from "@/lib/content/modell";
import { telLink } from "@/lib/assets";
import { telefonAnzeige, WOCHENTAG_KURZ } from "@/lib/format";
import { EinwilligungFussLink } from "./Einwilligung";
import { SmartLink } from "./SmartLink";
import { Wortmarke } from "./Wortmarke";

const zeile = "inline-flex min-h-11 min-w-11 items-center underline-offset-4 hover:underline";

/**
 * Fusszeile: Wortmarke und Leitsatz, dann vier ruhige Spalten (Kontakt, Öffnungszeiten, Seiten, Rechtliches).
 * Der Demo-Hinweis steht am Schluss, solange die Seite nicht indexiert werden darf.
 */
export function Fusszeile({ einstellungen: e, texte: t, zeigeDemoHinweis, zeigeZeiten }: { einstellungen: Einstellungen; texte: Texte; zeigeDemoHinweis: boolean; zeigeZeiten: boolean }) {
  const f = t.footer;
  return (
    <footer className="mt-20 bg-flaeche lg:mt-28">
      <div className="goldlinie" aria-hidden="true" />
      <div className="behaelter pb-10 pt-12 lg:pt-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <p className="titel-2 max-w-[16ch]">{f.leitsatz}</p>
          <Wortmarke einstellungen={e} className="h-auto w-[180px] lg:w-[220px]" sizes="220px" />
        </div>

        <div className="klein mt-12 grid gap-10 border-t border-linie-stark pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="etikett">{f.kontaktTitel}</h2>
            <address className="mt-3 not-italic">
              <p className="font-semibold">{e.adresse.strasse}<br />{e.adresse.plz} {e.adresse.ort}</p>
              <ul className="mt-3 grid">
                <li><a href={telLink(e.telefon)} className={zeile}>{telefonAnzeige(e.telefon)}</a></li>
                <li><a href={`mailto:${e.email}`} className={zeile}>{e.email}</a></li>
                <li>
                  <a href={e.karteUrl} target="_blank" rel="noopener noreferrer" className={`${zeile} gap-1.5`}>
                    {f.route}
                    <ArrowUpRightIcon size={16} aria-hidden="true" />
                    <span className="nur-sr"> (öffnet in einem neuen Fenster)</span>
                  </a>
                </li>
              </ul>
            </address>
            {e.social.length ? (
              <div className="mt-5">
                <h2 className="etikett">{f.folgen}</h2>
                <ul className="mt-2 flex gap-1">
                  {e.social.map((s) => (
                    <li key={s._key}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 pr-2 hover:text-gold-tief" aria-label={`${s.plattform === "instagram" ? "Instagram" : "Facebook"}: ${s.handle} (öffnet in einem neuen Fenster)`}>
                        {s.plattform === "instagram" ? <InstagramLogoIcon size={24} aria-hidden="true" /> : <FacebookLogoIcon size={24} aria-hidden="true" />}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          {zeigeZeiten ? (
            <div>
              <h2 className="etikett">{f.zeitenTitel}</h2>
              <ul className="zahl mt-3 grid gap-0.5">
                {e.oeffnungszeiten.map((o) => (
                  <li key={o._key} className="grid grid-cols-[2.5rem_1fr]">
                    <span className="font-semibold">{WOCHENTAG_KURZ[o.tag]}</span>
                    <span>{o.geschlossen ? t.ui.geschlossen : `${o.von} bis ${o.bis}`}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <nav aria-label={f.seitenTitel}>
            <h2 className="etikett">{f.seitenTitel}</h2>
            <ul className="mt-3 grid">
              {t.navigation.map((n) => (
                <li key={n.ziel}><SmartLink ziel={n.ziel} className={zeile}>{n.text}</SmartLink></li>
              ))}
              <li>
                <a href={e.buchung.url} target="_blank" rel="noopener noreferrer" className={`${zeile} gap-1.5`}>
                  {t.kopf.buchen.text}
                  <ArrowUpRightIcon size={16} aria-hidden="true" />
                  <span className="nur-sr"> ({t.ui.buchungExtern})</span>
                </a>
              </li>
            </ul>
          </nav>
          <nav aria-label={f.rechtlichesTitel}>
            <h2 className="etikett">{f.rechtlichesTitel}</h2>
            <ul className="mt-3 grid">
              {f.rechtliches.map((n) => (
                <li key={n.ziel}><SmartLink ziel={n.ziel} className={zeile}>{n.text}</SmartLink></li>
              ))}
              <li><SmartLink ziel={f.bildnachweis.ziel} className={zeile}>{f.bildnachweis.text}</SmartLink></li>
              <li><EinwilligungFussLink titel={t.einwilligung.fussLink} /></li>
            </ul>
          </nav>
        </div>

        <p className="klein mt-10 border-t border-linie-stark pt-6 text-grau">{zeigeDemoHinweis ? f.demoHinweis : `© ${new Date().getFullYear()} ${f.copyright}`}</p>
      </div>
    </footer>
  );
}
