import { CalendarCheckIcon } from "@phosphor-icons/react/dist/ssr";
import type { Einstellungen, Texte } from "@/lib/content/modell";

/**
 * Der eine Aufruf der Website: «Termin buchen». Immer derselbe Wortlaut, immer ein gewöhnlicher Link auf die bestehende
 * Buchungsseite (externer Dienst, neues Fenster). Kein Widget, keine eigene Buchung, keine Bestätigung.
 */
export function Buchungsknopf({ einstellungen: e, texte: t, url, className = "knopf knopf-primaer", mitIcon = true }: { einstellungen: Einstellungen; texte: Texte; url?: string; className?: string; mitIcon?: boolean }) {
  return (
    <a href={url ?? e.buchung.url} target="_blank" rel="noopener noreferrer" className={className}>
      {mitIcon ? <CalendarCheckIcon size={20} aria-hidden="true" /> : null}
      {t.kopf.buchen.text}
      <span className="nur-sr"> ({t.ui.buchungExtern})</span>
    </a>
  );
}
