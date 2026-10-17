import Link from "next/link";
import { PhoneIcon } from "@phosphor-icons/react/dist/ssr";
import type { Einstellungen, Texte } from "@/lib/content/modell";
import { telLink } from "@/lib/assets";
import { telefonAnzeige } from "@/lib/format";
import { Buchungsknopf } from "./Buchungsknopf";
import { Menue } from "./Menue";
import { NavLink } from "./NavLink";
import { Wortmarke } from "./Wortmarke";

/** Kopfzeile: Wortmarke, drei Seitenlinks, Telefon, der eine Aufruf «Termin buchen», Menü. Darunter die Goldlinie. */
export function Kopfzeile({ einstellungen: e, texte: t }: { einstellungen: Einstellungen; texte: Texte }) {
  const anzeige = telefonAnzeige(e.telefon);
  return (
    <header className="sticky top-0 z-30 bg-grund/92 backdrop-blur-md">
      <div className="behaelter flex h-16 items-center gap-2 sm:gap-3 lg:h-[4.5rem]">
        <Link href="/" className="mr-auto flex min-h-11 shrink-0 items-center" aria-label={`${e.name}, zur Startseite`}>
          <Wortmarke einstellungen={e} className="h-8 w-auto sm:h-9 lg:h-11" sizes="180px" prio />
        </Link>
        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <ul className="flex items-center">
            {t.navigation.map((n) => (
              <li key={n.ziel}>
                <NavLink ziel={n.ziel} className="inline-flex min-h-11 items-center px-3.5 font-[family-name:var(--font-titel)] text-[0.95rem] font-semibold underline-offset-8 hover:underline" aktivKlasse="text-gold-tief underline">
                  {n.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <a href={telLink(e.telefon)} className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-1 font-[family-name:var(--font-titel)] text-[0.95rem] font-semibold hover:text-gold-tief xl:px-3" aria-label={`${t.kopf.telefonLabel}: ${anzeige}`}>
          <PhoneIcon size={22} aria-hidden="true" />
          <span className="hidden xl:inline">{anzeige}</span>
        </a>
        <Buchungsknopf einstellungen={e} texte={t} className="knopf knopf-primaer knopf-klein hidden sm:inline-flex" mitIcon={false} />
        <Menue texte={t.kopf} navigation={t.navigation} telefon={e.telefon} telefonAnzeige={anzeige} email={e.email} buchungUrl={e.buchung.url} buchungExtern={t.ui.buchungExtern} />
      </div>
      <div className="goldlinie" aria-hidden="true" />
    </header>
  );
}
