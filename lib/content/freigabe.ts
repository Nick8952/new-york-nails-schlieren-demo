import type { Block, Inhaltsquelle } from "./modell";

const blockText = (b: Block): string => (b.art === "titel" ? b.text : b.art === "liste" ? b.punkte.flat().map((t) => (typeof t === "string" ? t : t.text)).join(" ") : b.inhalt.map((t) => (typeof t === "string" ? t : t.text)).join(""));

/**
 * Was vor dem Go-Live noch offen ist, gelesen aus der Inhaltsquelle, die der Build tatsächlich verwendet (lokal oder Sanity):
 *  - Studioangaben, Bereiche, Leistungen, Seitenbelege, Galerie, Team und Fragen, die das Studio noch nicht freigegeben hat (`freigabe` ist nicht «live»)
 *  - Rechtstexte, die noch die Demo beschreiben
 * Die Liste benutzt `npm run inhalt:pruefen -- --live`, und der Build bricht mit ihr ab, sobald INDEXIERUNG=1 für eine echte
 * Domain gesetzt ist: Eine indexierbare Website mit unbestätigten Angaben kann so nicht entstehen.
 */
export async function offeneFreigaben(q: Inhaltsquelle): Promise<string[]> {
  const [e, start, kategorien, leistungen, leistungenSeite, studio, kontakt, galerie, team, fragen, impressum, datenschutz] = await Promise.all([
    q.getEinstellungen(), q.getStartseite(), q.getKategorien(), q.getLeistungen(), q.getLeistungenSeite(), q.getStudioSeite(), q.getKontaktSeite(), q.getGalerie(), q.getTeam(), q.getFragen(), q.getRechtSeite("impressum"), q.getRechtSeite("datenschutz"),
  ]);
  const offen: string[] = [];
  const pruefe = (wo: string, titel: string, freigabe: string) => { if (freigabe !== "live") offen.push(`Noch nicht vom Studio freigegeben: ${wo}, «${titel}»`); };
  pruefe("Studioangaben", "Adresse, Telefon, E-Mail, Öffnungszeiten, Links", e.freigabe);
  pruefe("Startseite", "Texte im Einstieg und in den Abschnitten", start.belege.freigabe);
  pruefe("Kontakt und Anfahrt", "Einleitung und Anfahrtstext", kontakt.belege.freigabe);
  for (const k of kategorien) pruefe("Leistungsbereiche", k.titel, k.freigabe);
  pruefe("Leistungen und Preise", "Einleitung und Preishinweis", leistungenSeite.belege.freigabe);
  pruefe("Studio", "Einleitung und Abschnitte", studio.belege.freigabe);
  for (const l of leistungen) pruefe("Leistungen", l.titel, l.freigabe);
  for (const g of galerie) pruefe("Galerie", g.titel, g.freigabe);
  for (const t of team) pruefe("Team", t.name, t.freigabe);
  for (const f of fragen) pruefe("Fragen", f.frage, f.freigabe);
  if (impressum.bloecke.some((b) => /\bDemo\b/.test(blockText(b)))) offen.push("Das Impressum beschreibt noch die Demo (Betreiber, Zweck): für den Produktivbetrieb neu schreiben.");
  if (datenschutz.bloecke.some((b) => /\bDemo\b|GitHub Pages/.test(blockText(b)))) offen.push("Die Datenschutzerklärung beschreibt noch die Demo auf GitHub Pages: an das produktive Hosting anpassen.");
  return offen;
}
