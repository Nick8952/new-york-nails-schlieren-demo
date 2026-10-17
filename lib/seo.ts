import type { Metadata } from "next";
import type { Bild, Einstellungen, Texte } from "./content/modell";
import { indexierungErlaubt, siteUrl } from "./deploy-ziel";
import { telLink } from "./assets";

export { indexierungErlaubt };

const robots = () => (indexierungErlaubt ? { index: true, follow: true } : { index: false, follow: false });
/** Lokale Pfade bekommen die Site-URL (samt Unterpfad auf GitHub Pages). */
const absolut = (url: string) => (/^https?:\/\//.test(url) ? url : `${siteUrl}${url}`);

/**
 * Metadaten einer Seite. `pfad` ist der Pfad ohne Unterpfad («/kontakt/»); Canonical und Open Graph zeigen immer auf die
 * tatsächliche Adresse der laufenden Installation (Demo: GitHub Pages, später: SITE_URL der Kundendomain).
 * Open-Graph-Angaben werden vollständig je Seite gesetzt, weil Next sie nicht mit denen des Layouts zusammenführt.
 */
export function seitenMetadaten(opt: { titel: string; beschreibung?: string; pfad: string; bild?: Bild; einstellungen: Einstellungen; texte: Texte; istStart?: boolean }): Metadata {
  const { titel, pfad, einstellungen: e, texte: t } = opt;
  const beschreibung = opt.beschreibung ?? t.seo.beschreibung;
  const b = opt.bild ?? e.seoBild;
  const groesste = b.quellen.webp[b.quellen.webp.length - 1];
  return {
    title: opt.istStart ? { absolute: `${e.name}: ${titel}` } : titel,
    description: beschreibung,
    alternates: { canonical: `${siteUrl}${pfad}` },
    openGraph: {
      title: opt.istStart ? `${e.name}: ${titel}` : `${titel} | ${t.seo.titelZusatz}`,
      description: beschreibung,
      url: `${siteUrl}${pfad}`,
      siteName: e.name,
      locale: "de_CH",
      type: "website",
      images: [{ url: absolut(groesste.url), width: b.breite, height: b.hoehe, alt: b.alt }],
    },
    robots: robots(),
  };
}

const TAG_SCHEMA: Record<string, string> = { montag: "Monday", dienstag: "Tuesday", mittwoch: "Wednesday", donnerstag: "Thursday", freitag: "Friday", samstag: "Saturday", sonntag: "Sunday" };

/**
 * Strukturierte Daten für das Studio (schema.org/NailSalon). Sie werden nur ausgegeben, wenn die Indexierung freigegeben ist
 * (INDEXIERUNG=1 auf der Kundendomain). In der Demo würden sie das Studio maschinenlesbar als Betreiber einer inoffiziellen Seite ausweisen.
 *
 * Enthalten sind ausschliesslich belegte Angaben: Name, Adresse, Telefon, E-Mail, Öffnungszeiten (aus der Buchungsseite),
 * Social-Media-Profile. Keine Bewertungen, keine Preisspannen, kein Gründungsjahr.
 */
export function studioJsonLd(e: Einstellungen) {
  const offen = e.oeffnungszeiten.filter((o) => !o.geschlossen);
  return {
    "@context": "https://schema.org",
    "@type": "NailSalon",
    "@id": `${siteUrl}/#studio`,
    name: e.name,
    url: `${siteUrl}/`,
    image: absolut(e.seoBild.quellen.webp[e.seoBild.quellen.webp.length - 1].url),
    telephone: telLink(e.telefon).replace("tel:", ""),
    email: e.email,
    address: { "@type": "PostalAddress", streetAddress: e.adresse.strasse, postalCode: e.adresse.plz, addressLocality: e.adresse.ort, addressCountry: "CH" },
    ...(offen.length ? { openingHoursSpecification: offen.map((o) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: TAG_SCHEMA[o.tag], opens: o.von, closes: o.bis })) } : {}),
    ...(e.social.length ? { sameAs: e.social.map((s) => s.url) } : {}),
    potentialAction: { "@type": "ReserveAction", target: e.buchung.url, name: "Termin buchen" },
  };
}

/** JSON für ein <script type="application/ld+json">: «<» wird maskiert, damit Inhalte das Skript nicht beenden können. */
export function jsonLdSicher(daten: unknown): string {
  return JSON.stringify(daten).replace(/</g, "\\u003c");
}
