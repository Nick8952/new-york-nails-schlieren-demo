import { CalendarCheckIcon, PhoneIcon } from "@phosphor-icons/react/dist/ssr";
import type { Einstellungen, Texte } from "@/lib/content/modell";
import { telLink } from "@/lib/assets";

/** Feste Leiste am unteren Rand (nur unter 64 rem): «Termin buchen» und «Anrufen». Der Seiteninhalt bekommt unten Platz (body padding). */
export function MobileLeiste({ einstellungen: e, texte: t }: { einstellungen: Einstellungen; texte: Texte }) {
  return (
    <nav className="leiste" aria-label="Schnellkontakt">
      <a href={telLink(e.telefon)}>
        <PhoneIcon size={20} aria-hidden="true" />
        {t.leiste.anrufen}
      </a>
      <a href={e.buchung.url} target="_blank" rel="noopener noreferrer" className="leiste-buchen">
        <CalendarCheckIcon size={20} aria-hidden="true" />
        {t.leiste.buchen}
        <span className="nur-sr"> ({t.ui.buchungExtern})</span>
      </a>
    </nav>
  );
}
