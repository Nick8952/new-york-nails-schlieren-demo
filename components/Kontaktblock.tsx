import { ArrowUpRightIcon, EnvelopeSimpleIcon, MapPinIcon, PhoneIcon } from "@phosphor-icons/react/dist/ssr";
import type { Einstellungen, Texte } from "@/lib/content/modell";
import { telLink } from "@/lib/assets";
import { telefonAnzeige } from "@/lib/format";

const zeile = "inline-flex min-h-11 items-center gap-2.5 font-semibold underline-offset-4 hover:underline";

/** Adresse, Telefon, E-Mail und die externen Links (Route, 360°-Ansicht). Karte und Ansicht werden nicht eingebettet. */
export function Kontaktblock({ einstellungen: e, ui, mitTour = true }: { einstellungen: Einstellungen; ui: Texte["ui"]; mitTour?: boolean }) {
  return (
    <address className="not-italic">
      <p className="flex items-start gap-2.5">
        <MapPinIcon size={22} aria-hidden="true" className="mt-1 shrink-0" />
        <span><span className="nur-sr">{ui.adresse}: </span>{e.name}<br />{e.adresse.strasse}<br />{e.adresse.plz} {e.adresse.ort}</span>
      </p>
      <ul className="mt-3 grid">
        <li><a href={telLink(e.telefon)} className={zeile}><PhoneIcon size={20} aria-hidden="true" /><span className="nur-sr">{ui.telefon}: </span>{telefonAnzeige(e.telefon)}</a></li>
        <li><a href={`mailto:${e.email}`} className={zeile}><EnvelopeSimpleIcon size={20} aria-hidden="true" /><span className="nur-sr">{ui.email}: </span>{e.email}</a></li>
        <li>
          <a href={e.karteUrl} target="_blank" rel="noopener noreferrer" className={zeile}>
            <ArrowUpRightIcon size={20} aria-hidden="true" />
            {ui.karte}<span className="nur-sr"> (öffnet in einem neuen Fenster)</span>
          </a>
        </li>
        {mitTour && e.tourUrl ? (
          <li>
            <a href={e.tourUrl} target="_blank" rel="noopener noreferrer" className={zeile}>
              <ArrowUpRightIcon size={20} aria-hidden="true" />
              {ui.tour}<span className="nur-sr"> (öffnet in einem neuen Fenster)</span>
            </a>
          </li>
        ) : null}
      </ul>
    </address>
  );
}
