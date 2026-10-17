/**
 * Adressen der Seiten (ohne Unterpfad; den setzt next/link bzw. assetUrl).
 * Bewusst ohne Abhängigkeiten: Diese Datei darf in Client-Komponenten landen.
 */
export const LEISTUNGEN_BASIS = "leistungen";
export const pfade = {
  start: "/",
  leistungen: `/${LEISTUNGEN_BASIS}/`,
  kategorie: (slug: string) => `/${LEISTUNGEN_BASIS}/${slug}/`,
  studio: "/studio/",
  kontakt: "/kontakt/",
  impressum: "/impressum/",
  datenschutz: "/datenschutz/",
} as const;
