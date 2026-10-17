import type { Preis, Texte, Wochentag } from "./content/modell";

/** «+41 44 557 50 67» → «044 557 50 67» (Anzeige für Besucherinnen und Besucher in der Schweiz) */
export function telefonAnzeige(telefon: string): string {
  return telefon.replace(/^\+41\s?/, "0");
}

/** Preis genau wie in der Quelle: «CHF 85», «ab CHF 10». Rappen nur, wenn die Quelle welche nennt. */
export function preisText(p: Preis, ui: Texte["ui"]): string {
  const betrag = Number.isInteger(p.chf) ? String(p.chf) : p.chf.toFixed(2);
  return `${p.ab ? `${ui.ab} ` : ""}CHF ${betrag}`;
}

export function dauerText(minuten: number, ui: Texte["ui"]): string {
  return `${minuten} ${ui.minuten}`;
}

export const WOCHENTAG_NAME: Record<Wochentag, string> = { montag: "Montag", dienstag: "Dienstag", mittwoch: "Mittwoch", donnerstag: "Donnerstag", freitag: "Freitag", samstag: "Samstag", sonntag: "Sonntag" };
export const WOCHENTAG_KURZ: Record<Wochentag, string> = { montag: "Mo", dienstag: "Di", mittwoch: "Mi", donnerstag: "Do", freitag: "Fr", samstag: "Sa", sonntag: "So" };

/** «09:30» → Minuten seit Mitternacht */
export function minutenSeitMitternacht(uhrzeit: string): number {
  const [h, m] = uhrzeit.split(":").map(Number);
  return h * 60 + m;
}

/** «2026-10-16» → «16. Oktober 2026» */
export function datumText(iso: string): string {
  const [j, m, t] = iso.split("-").map(Number);
  const monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
  return `${t}. ${monate[m - 1]} ${j}`;
}
