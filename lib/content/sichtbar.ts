import type { Einstellungen, Frage, GalerieBild, TeamMitglied } from "./modell";

/**
 * Die eine Regel dafür, welche optionalen Bereiche erscheinen. Seiten, Navigation, Fusszeile, Sitemap und strukturierte
 * Daten fragen alle hier nach, damit nie ein leerer Abschnitt oder ein Link ins Leere entsteht.
 *
 * Ein Bereich erscheint, sobald er mindestens einen Eintrag hat. Galeriebilder brauchen zusätzlich geklärte Rechte (`freigabe`).
 * Zeitlich begrenzte Inhalte (Hinweis, Sonderzeiten) gelten nur bis zum Enddatum; `heute` ist das Build-Datum in Zürich (statischer
 * Export: Abgelaufenes verschwindet erst mit dem nächsten Build, siehe docs/INHALTE-PFLEGEN.md).
 */
/** Kalenderdatum in Zürich (JJJJ-MM-TT), unabhängig von der Zeitzone des Build-Servers. */
export function zuercherDatum(zeitpunkt = new Date()): string {
  const teile = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zurich", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(zeitpunkt);
  const w = (t: string) => teile.find((x) => x.type === t)?.value ?? "";
  return `${w("year")}-${w("month")}-${w("day")}`;
}

export function optionaleBereiche(daten: { einstellungen: Einstellungen; galerie: GalerieBild[]; team: TeamMitglied[]; fragen: Frage[] }, heute = new Date()) {
  const tag = zuercherDatum(heute);
  const e = daten.einstellungen;
  return {
    oeffnungszeiten: e.oeffnungszeiten.length > 0,
    sonderzeiten: e.sonderzeiten.filter((s) => s.bis >= tag),
    hinweis: e.hinweis && e.hinweis.von <= tag && e.hinweis.bis >= tag ? e.hinweis : null,
    galerie: daten.galerie.filter((g) => g.freigabe === "live" || g.freigabe === "demo"),
    team: daten.team.length > 0,
    fragen: daten.fragen.length > 0,
  };
}
