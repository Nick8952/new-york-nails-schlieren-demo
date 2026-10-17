// Prüft die lokalen Inhalte über das Schema hinaus (das Schema selbst prüft lib/content/local.ts beim Laden):
//  - Schweizer Schreibweise (kein «ß»), keine Gedankenstriche, keine geraden Anführungszeichen als Zitatzeichen
//  - keine unbelegten Behauptungen (Garantien, Superlative, Erfahrung in Jahren, Zertifikate, Bewertungen, Rabatte)
//  - Preise und Dauern nur im Leistungsmodell, nicht in freien Texten (Preise stehen genau einmal: data/leistungen.json)
//  - alle Linkziele erlaubt, interne Ziele und Sprungmarken vorhanden, Buchungslinks zeigen auf die bestätigte Buchungsseite
//  - ein Ziel, eine Beschriftung: jeder Buchungsknopf heisst «Termin buchen»
//  - Einstieg: Titel kurz, Text höchstens 20 Wörter
//  - Bilder: Alternativtext vorhanden, Bildnachweis vollständig, jedes Bild wird verwendet
//  - Leistungen: jede Variante hat Originalbezeichnung, Preis > 0, Dauer > 0; keine Kategorie ohne Leistung
//  - Öffnungszeiten: jeder Wochentag höchstens einmal
//  - Quellen: jede Leistung, jede Seite mit Belegen; mit --live zusätzlich: alles vom Studio freigegeben?
// Aufruf: npm run inhalt:pruefen   ·   vor dem Go-Live: npm run inhalt:pruefen -- --live
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { lokaleQuelle } from "../lib/content/local";
import { pfade } from "../lib/content/modell";
import { istErlaubtesLinkziel } from "../lib/assets";
import { offeneFreigaben } from "../lib/content/freigabe";

const live = process.argv.includes("--live");
const fehler: string[] = [];
const hinweise: string[] = [];
const q = lokaleQuelle;
const [e, t, start, kategorien, leistungen, lSeite, studio, kontakt, impressum, datenschutz, galerie, team, fragen] = await Promise.all([
  q.getEinstellungen(), q.getTexte(), q.getStartseite(), q.getKategorien(), q.getLeistungen(), q.getLeistungenSeite(), q.getStudioSeite(), q.getKontaktSeite(),
  q.getRechtSeite("impressum"), q.getRechtSeite("datenschutz"), q.getGalerie(), q.getTeam(), q.getFragen(),
]);
const alles = { e, t, start, kategorien, leistungen, lSeite, studio, kontakt, impressum, datenschutz, galerie, team, fragen };

// ── alle Zeichenketten und Links einsammeln ────────────────────────────────
type Fund = { pfad: string; text: string };
const texte: Fund[] = [];
const links: { pfad: string; ziel: string; text?: string }[] = [];
function gehen(wert: unknown, pfad: string) {
  if (typeof wert === "string") { texte.push({ pfad, text: wert }); return; }
  if (Array.isArray(wert)) { wert.forEach((v, i) => gehen(v, `${pfad}[${i}]`)); return; }
  if (wert && typeof wert === "object") {
    const o = wert as Record<string, unknown>;
    if (typeof o.ziel === "string") links.push({ pfad, ziel: o.ziel, text: typeof o.text === "string" ? o.text : undefined });
    if (typeof o.link === "string") links.push({ pfad, ziel: o.link, text: typeof o.text === "string" ? o.text : undefined });
    for (const [k, v] of Object.entries(o)) {
      if (["quellen", "nachweis", "url", "herkunft", "originalName", "originalBeschreibung", "karteUrl", "tourUrl", "buchungUrl"].includes(k)) continue;
      gehen(v, `${pfad}.${k}`);
    }
  }
}
for (const [name, wert] of Object.entries(alles)) gehen(wert, name);

// ── Schreibweise ───────────────────────────────────────────────────────────
for (const { pfad, text } of texte) {
  if (text.includes("ß")) fehler.push(`${pfad}: «ß» gefunden (Schweizer Schreibweise verlangt «ss»): ${text.slice(0, 60)}`);
  if (/[—–]/.test(text)) fehler.push(`${pfad}: Gedankenstrich gefunden (Satz umstellen oder Bindestrich verwenden): ${text.slice(0, 60)}`);
  if (/(^|\s)"[^"]+"/.test(text)) fehler.push(`${pfad}: gerade Anführungszeichen (stattdessen «…»): ${text.slice(0, 60)}`);
  if (/\s{2,}/.test(text.trim())) fehler.push(`${pfad}: doppelte Leerzeichen: ${text.slice(0, 60)}`);
}

// ── Unbelegte Behauptungen ─────────────────────────────────────────────────
// Rechtsseiten, Formular- und Einwilligungstexte sind ausgenommen; geprüft werden Inhalte, die etwas über das Studio oder das Angebot sagen.
const VERBOTEN: [RegExp, string][] = [
  [/kostenlos|gratis|rabatt|\baktion\b|sofortrabatt|gutschein(e)? im wert/i, "Rabatt oder Aktion (nur mit Enddatum als Hinweis, nicht im Fliesstext)"],
  [/garantie|garantiert|perfekte Nägel/i, "Garantie oder Wirkversprechen"],
  [/seit (über )?\d+ Jahren|Jahre Erfahrung|erfahrene[sn]? Team|langjährig/i, "Erfahrung in Jahren"],
  [/zertifiziert|Zertifikat|ausgezeichnet|diplomiert/i, "Zertifizierung oder Auszeichnung"],
  [/\d+ zufriedene|Bewertungen|Sterne\b|\b4[.,]\d\b/i, "Bewertungen"],
  [/marktführend|\bführende[rn]? |Nr\. ?1\b|\bbeste[nrs]? (Nagelstudio|Studio)|\bbestes\b/i, "Superlativ"],
  [/hygienisch|steril|desinfiziert/i, "Hygieneversprechen (nur mit Bestätigung des Studios)"],
  [/\b(OPI|CND|Gelish|Shellac\b)/, "Produktmarke (nur mit Bestätigung des Studios)"],
];
for (const { pfad, text } of texte) {
  if (/^(impressum|datenschutz|t\.einwilligung|t\.formular)/.test(pfad)) continue;
  for (const [muster, was] of VERBOTEN) if (muster.test(text)) fehler.push(`${pfad}: unbelegte Behauptung (${was}): «${text.slice(0, 80)}»`);
}
// Preise und Minuten stehen genau einmal, im Leistungsmodell. Freie Texte dürfen keine Beträge nennen (sonst laufen zwei Stände auseinander).
for (const { pfad, text } of texte) {
  if (/^(leistungen\[\d+\]\.varianten|impressum|datenschutz|t\.ui\.(standQuelle|preisAbweichung)|lSeite\.preisHinweis|leistungen\[\d+\]\.hinweise)/.test(pfad)) continue;
  if (/\bCHF\s?\d|\bFr\.\s?\d|\d+ Franken/.test(text)) fehler.push(`${pfad}: Preis im Fliesstext (Preise stehen nur in data/leistungen.json): «${text.slice(0, 80)}»`);
}

// ── Links ──────────────────────────────────────────────────────────────────
const seiten = new Set<string>([pfade.start, pfade.leistungen, pfade.studio, pfade.kontakt, pfade.impressum, pfade.datenschutz, ...kategorien.map((k) => pfade.kategorie(k.slug))]);
const anker: Record<string, Set<string>> = {
  [pfade.leistungen]: new Set(kategorien.map((k) => `bereich-${k.slug}`)),
  [pfade.impressum]: new Set(impressum.bloecke.flatMap((b) => (b.art === "titel" && b.anker ? [b.anker] : []))),
  [pfade.datenschutz]: new Set(datenschutz.bloecke.flatMap((b) => (b.art === "titel" && b.anker ? [b.anker] : []))),
};
for (const l of links) {
  if (!istErlaubtesLinkziel(l.ziel)) { fehler.push(`${l.pfad}: Linkziel nicht erlaubt: ${l.ziel}`); continue; }
  if (!l.ziel.startsWith("/")) continue;
  const [seite, marke] = l.ziel.split("#");
  if (!seiten.has(seite)) fehler.push(`${l.pfad}: interne Seite gibt es nicht: ${l.ziel}`);
  else if (marke && !anker[seite]?.has(marke)) fehler.push(`${l.pfad}: Sprungmarke gibt es nicht: ${l.ziel}`);
}
// Ein Ziel, eine Beschriftung: jeder Link auf die Buchungsseite heisst wie der Knopf in der Kopfzeile.
const buchen = t.kopf.buchen;
if (buchen.ziel !== e.buchung.url) fehler.push(`t.kopf.buchen zeigt auf «${buchen.ziel}», die Buchungsseite ist «${e.buchung.url}»`);
for (const l of links) {
  if (l.ziel !== e.buchung.url || !l.text) continue;
  if (l.text !== buchen.text) fehler.push(`${l.pfad}: Buchungslink heisst «${l.text}», überall sonst «${buchen.text}»`);
}
if (t.leiste.buchen !== buchen.text) fehler.push(`t.leiste.buchen heisst «${t.leiste.buchen}», der Knopf in der Kopfzeile «${buchen.text}»`);
// Es gibt genau eine Buchungsadresse. Bereichslinks dürfen sie höchstens verlängern (Unterseite oder Parameter), nie ersetzen.
for (const k of kategorien) if (k.buchungUrl && !k.buchungUrl.startsWith(e.buchung.url)) fehler.push(`Kategorie «${k.slug}»: Buchungslink «${k.buchungUrl}» beginnt nicht mit der Buchungsadresse ${e.buchung.url}`);
// Kontaktangaben in freien Texten (Rechtstexte, Studioseite) müssen mit den Einstellungen übereinstimmen: eine Wahrheit, keine zweite.
{
  const telefonAnzeige = e.telefon.replace(/^\+41\s?/, "0");
  for (const { pfad, text } of texte) {
    if (/^(e\.|t\.)/.test(pfad)) continue;
    for (const m of text.matchAll(/\b0\d{2} \d{3} \d{2} \d{2}\b|\+41 \d{2} \d{3} \d{2} \d{2}/g)) if (m[0] !== telefonAnzeige && m[0] !== e.telefon) fehler.push(`${pfad}: Telefonnummer «${m[0]}» weicht von einstellungen.telefon ab`);
    for (const m of text.matchAll(/[\w.+-]+@newyorknails[\w.-]*/g)) if (m[0] !== e.email) fehler.push(`${pfad}: E-Mail «${m[0]}» weicht von einstellungen.email ab`);
    for (const m of text.matchAll(/Ringstr(?:asse|\.)\s*\d+[a-z]?/g)) if (m[0] !== e.adresse.strasse) fehler.push(`${pfad}: Adresse «${m[0]}» weicht von einstellungen.adresse ab`);
  }
}

// ── Einstieg ───────────────────────────────────────────────────────────────
const woerter = start.hero.text.trim().split(/\s+/).length;
if (woerter > 20) fehler.push(`start.hero.text: ${woerter} Wörter (höchstens 20, damit der Einstieg auf einen Blick lesbar bleibt)`);
if (start.hero.titel.length > 44) fehler.push(`start.hero.titel: ${start.hero.titel.length} Zeichen (höchstens 44, sonst bricht der Titel auf mehr als zwei Zeilen)`);

// ── Leistungen ─────────────────────────────────────────────────────────────
for (const k of kategorien) if (!leistungen.some((l) => l.kategorie === k.slug)) fehler.push(`Kategorie «${k.slug}» hat keine Leistung: entfernen oder Leistungen zuordnen`);
for (const l of leistungen) {
  const keys = new Set<string>();
  for (const v of l.varianten) {
    if (keys.has(v._key)) fehler.push(`Leistung «${l.slug}»: Varianten-Key «${v._key}» doppelt`);
    keys.add(v._key);
    if (!v.originalName.trim()) fehler.push(`Leistung «${l.slug}», «${v.titel}»: Originalbezeichnung fehlt`);
    // Die Preiskennzeichen müssen zur Originalbeschreibung der Plattform passen
    const original = `${v.originalName} ${v.originalBeschreibung ?? ""}`;
    const quelleAbweichung = /preisabweichung/i.test(original);
    const quelleAb = /\bpreis ab\b|\bab$/i.test(v.originalName.trim()) || /\bpreis ab\b/i.test(v.originalBeschreibung ?? "");
    if (quelleAbweichung !== v.preis.abweichung) fehler.push(`Leistung «${l.slug}», «${v.titel}»: preis.abweichung=${v.preis.abweichung}, die Quelle sagt ${quelleAbweichung ? "«Preisabweichung»" : "nichts davon"}`);
    if (quelleAb !== v.preis.ab) fehler.push(`Leistung «${l.slug}», «${v.titel}»: preis.ab=${v.preis.ab}, die Quelle ${quelleAb ? "nennt «ab»" : "nennt kein «ab»"}`);
  }
}
{
  const tage = e.oeffnungszeiten.map((o) => o.tag);
  if (new Set(tage).size !== tage.length) fehler.push("einstellungen.oeffnungszeiten: ein Wochentag kommt doppelt vor");
}

// ── Bilder ─────────────────────────────────────────────────────────────────
const verzeichnis = JSON.parse(readFileSync("data/bilder.json", "utf8")) as Record<string, { alt: string; symbolbild: boolean; nachweis?: { urheber?: string; quelle?: string; lizenz?: string }; quellen: { avif: { url: string }[]; webp: { url: string }[] } }>;
const vorhanden = new Set(readdirSync("public/bilder"));
for (const [id, b] of Object.entries(verzeichnis)) {
  if (!b.alt.trim()) fehler.push(`Bild «${id}»: Alternativtext fehlt`);
  if (!b.nachweis?.urheber || !b.nachweis.quelle || !b.nachweis.lizenz) fehler.push(`Bild «${id}»: Bildnachweis unvollständig`);
  for (const v of [...b.quellen.avif, ...b.quellen.webp]) if (!vorhanden.has(path.basename(v.url))) fehler.push(`Bild «${id}»: Datei fehlt in public/bilder: ${v.url} (npm run bilder)`);
}
const rohInhalte = ["einstellungen", "startseite", "galerie", "team"].map((d) => readFileSync(`data/${d}.json`, "utf8")).join("\n");
for (const id of Object.keys(verzeichnis)) if (!rohInhalte.includes(`"${id}"`)) fehler.push(`Bild «${id}» wird nirgends verwendet: aus scripts/bilder-liste.json entfernen oder einsetzen`);

// ── Quellen und Freigaben ──────────────────────────────────────────────────
type Beleg = { wo: string; titel: string; herkunft: { url?: string; art: string; quelle: string }[]; freigabe: string };
const belege: Beleg[] = [
  ...leistungen.map((l) => ({ wo: "Leistungen", titel: l.titel, herkunft: l.herkunft, freigabe: l.freigabe })),
  ...galerie.map((g) => ({ wo: "Galerie", titel: g.titel, herkunft: g.herkunft, freigabe: g.freigabe })),
  ...team.map((m) => ({ wo: "Team", titel: m.name, herkunft: m.herkunft, freigabe: m.freigabe })),
  ...fragen.map((f) => ({ wo: "Fragen", titel: f.frage, herkunft: f.herkunft, freigabe: f.freigabe })),
  { wo: "Startseite", titel: "Belege der Seite", ...start.belege },
  { wo: "Leistungen und Preise", titel: "Belege der Seite", ...lSeite.belege },
  { wo: "Studio", titel: "Belege der Seite", ...studio.belege },
  { wo: "Studioangaben", titel: "Einstellungen", herkunft: e.herkunft, freigabe: e.freigabe },
  ...kategorien.map((k) => ({ wo: "Leistungsbereiche", titel: k.titel, herkunft: k.herkunft, freigabe: k.freigabe })),
  { wo: "Kontakt und Anfahrt", titel: "Belege der Seite", ...kontakt.belege },
];
for (const b of belege) for (const h of b.herkunft) if (!h.url && h.art !== "eigene-quelle") fehler.push(`${b.wo}, «${b.titel}»: Quelle «${h.quelle}» ohne Adresse`);
const offen = await offeneFreigaben(q);
if (live) {
  fehler.push(...offen);
  if (!e.oeffnungszeiten.length) hinweise.push("Öffnungszeiten sind leer: Abschnitt erscheint nicht. Beim Studio erfragen.");
} else if (offen.length) {
  hinweise.push(`${offen.length} Punkte sind für die Demo belegt, aber noch nicht für den Produktivbetrieb freigegeben (Liste: npm run inhalt:pruefen -- --live).`);
}

for (const h of hinweise) console.log(`· ${h}`);
if (fehler.length) {
  console.error(`✗ ${fehler.length} Problem(e) in den Inhalten:\n` + fehler.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}
const varianten = leistungen.reduce((s, l) => s + l.varianten.length, 0);
console.log(`✓ Inhalte in Ordnung: ${texte.length} Texte, ${links.length} Links, ${Object.keys(verzeichnis).length} Bilder, ${leistungen.length} Leistungen mit ${varianten} Positionen, ${belege.length} Belege mit Quelle${live ? ", alles freigegeben" : ""}.`);
