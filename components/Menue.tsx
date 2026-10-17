"use client";

import { useId, useRef, useState } from "react";
import { ListIcon, XIcon, PhoneIcon, EnvelopeSimpleIcon, CalendarCheckIcon } from "@phosphor-icons/react";
import type { Link as LinkTyp, Texte } from "@/lib/content/modell";
import { telLink } from "@/lib/assets";
import { NavLink } from "./NavLink";

/**
 * Menü als natives <dialog>: auf dem Handy ganzflächig, am Bildschirm ein Blatt von oben. Fokus bleibt im Dialog, Escape schliesst,
 * der Fokus kehrt zum Knopf zurück. Enthält die Seiten, Telefon, E-Mail und den Buchungslink.
 */
export function Menue({ texte, navigation, telefon, telefonAnzeige, email, buchungUrl, buchungExtern }: { texte: Texte["kopf"]; navigation: LinkTyp[]; telefon: string; telefonAnzeige: string; email: string; buchungUrl: string; buchungExtern: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [offen, setOffen] = useState(false);
  const titelId = useId();
  const schliessen = () => dialog.current?.close();

  return (
    <>
      <button type="button" className="knopf knopf-sekundaer knopf-klein lg:hidden" aria-haspopup="dialog" aria-expanded={offen} onClick={() => { dialog.current?.showModal(); setOffen(true); }}>
        <ListIcon size={20} aria-hidden="true" />
        <span>{texte.menueKnopf}</span>
      </button>

      <dialog ref={dialog} className="menue" aria-labelledby={titelId} onClose={() => setOffen(false)} onClick={(ev) => { if (ev.target === dialog.current) schliessen(); }}>
        <div className="behaelter flex min-h-full flex-col pb-10 pt-4">
          <div className="flex items-center justify-between gap-4">
            <h2 id={titelId} className="titel-3">{texte.menueTitel}</h2>
            <button type="button" className="knopf knopf-sekundaer knopf-klein" onClick={schliessen}>
              <XIcon size={18} aria-hidden="true" />
              {texte.schliessen}
            </button>
          </div>
          <nav aria-label="Seiten" className="mt-8">
            <ul className="grid">
              {[{ text: "Startseite", ziel: "/" }, ...navigation].map((n) => (
                <li key={n.ziel} className="border-b border-linie-stark first:border-t">
                  <NavLink ziel={n.ziel} onClick={schliessen} className="titel-3 flex min-h-14 items-center py-2" aktivKlasse="text-gold-tief">
                    {n.text}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="mt-6 grid gap-1">
            <li>
              <a href={telLink(telefon)} className="inline-flex min-h-11 items-center gap-2.5 font-semibold">
                <PhoneIcon size={20} aria-hidden="true" />
                {telefonAnzeige}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center gap-2.5 font-semibold">
                <EnvelopeSimpleIcon size={20} aria-hidden="true" />
                {email}
              </a>
            </li>
          </ul>
          <a href={buchungUrl} target="_blank" rel="noopener noreferrer" className="knopf knopf-primaer mt-6 self-start" onClick={schliessen}>
            <CalendarCheckIcon size={20} aria-hidden="true" />
            {texte.buchen.text}
            <span className="nur-sr"> ({buchungExtern})</span>
          </a>
        </div>
      </dialog>
    </>
  );
}
