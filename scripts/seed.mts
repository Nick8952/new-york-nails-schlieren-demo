// Import der lokalen Inhalte (data/*.json, public/bilder) nach Sanity.
//
//   npm run seed -- --probe     Trockenlauf ohne Zugang: baut alle Dokumente, prüft sie gegen das Domainmodell und vergleicht
//                               sie mit den lokalen Inhalten (Parität). Schreibt nichts, braucht kein Sanity-Projekt.
//   npm run seed                legt fehlende Dokumente an (bestehende bleiben unangetastet)
//   npm run seed -- --force     überschreibt bestehende Dokumente mit dem lokalen Stand
//
// Der echte Lauf braucht SANITY_PROJECT_ID, SANITY_DATASET und SANITY_API_WRITE_TOKEN (Token mit Schreibrecht, nur lokal in
// .env.local, nie im Repository). Die Dokumente entstehen als veröffentlichte Dokumente. Anleitung: docs/SANITY-VERCEL-EINRICHTUNG.md
import { createReadStream, readFileSync } from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { z } from "zod";
import { createClient } from "@sanity/client";
import { lokaleQuelle } from "../lib/content/local";
import {
  einstellungenSchema, frageSchema, galerieBildSchema, kategorieSchema, kontaktSeiteSchema, leistungSchema, leistungenSeiteSchema, pruefen, rechtSeiteSchema,
  startseiteSchema, studioSeiteSchema, teamMitgliedSchema, texteSchema,
} from "../lib/content/modell";
import { normalisieren, portableTextZuBloecken } from "../lib/content/sanity";
import { inline, type RohBlock } from "../lib/content/text";

const probe = process.argv.includes("--probe");
const force = process.argv.includes("--force");
const lesen = (datei: string) => JSON.parse(readFileSync(path.join("data", datei), "utf8"));
type Doc = { _id: string; _type: string } & Record<string, unknown>;
type Roh = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any -- frei geformte JSON-Dateien

const bilder = lesen("bilder.json") as Record<string, { breite: number; hoehe: number; alt: string; legende: string | null; symbolbild: boolean; nachweis: { urheber: string; quelle: string; lizenz: string }; quellen: { webp: { breite: number; url: string }[] } }>;
const assetIds = new Map<string, string>();

let zaehler = 0;
const key = (praefix: string) => `${praefix}${(zaehler++).toString(36)}`;
/** Array-Einträge brauchen in Sanity `_key` und (in gemischten Arrays) `_type`. */
const liste = <T extends Roh>(eintraege: T[] | undefined, typ: string) => (eintraege ?? []).map((e) => ({ _type: typ, _key: e._key ?? key(typ.slice(0, 3)), ...e }));
const verweis = (l: Roh | undefined) => (l ? { _type: "verweis", text: l.text, ziel: l.ziel } : undefined);
const ohneReihenfolge = (o: Roh) => { const r = { ...o }; delete r.reihenfolge; return r; };
const ohneLeer = (o: Roh) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
const herkunft = (h: Roh[]) => liste(h, "herkunft");
const belege = (b: Roh) => ({ _type: "belege", herkunft: herkunft(b.herkunft), freigabe: b.freigabe });
const slug = (current: string) => ({ _type: "slug", current });
function bildFeld(id: string) {
  const b = bilder[id];
  if (!b) throw new Error(`Bild «${id}» fehlt in data/bilder.json.`);
  const ref = assetIds.get(id) ?? `image-probe${id.replace(/[^a-z0-9]/g, "")}-${b.breite}x${b.hoehe}-webp`;
  return { _type: "bildMitText", asset: { _type: "reference", _ref: ref }, alt: b.alt, ...(b.legende ? { legende: b.legende } : {}), symbolbild: b.symbolbild, nachweis: { urheber: b.nachweis.urheber, quelle: b.nachweis.quelle, lizenz: b.nachweis.lizenz } };
}

/** Lokaler Fliesstext → Portable Text */
function portableText(roh: RohBlock[]) {
  const block = (style: string, text: string, extra: Roh = {}) => {
    const markDefs: Roh[] = [];
    const children = inline(text).map((t) => {
      if (typeof t === "string") return { _type: "span", _key: key("s"), text: t, marks: [] };
      if (t.link) { const k = key("l"); markDefs.push({ _key: k, _type: "link", href: t.link }); return { _type: "span", _key: key("s"), text: t.text, marks: [k] }; }
      return { _type: "span", _key: key("s"), text: t.text, marks: t.fett ? ["strong"] : [] };
    });
    return { _type: "block", _key: key("b"), style, markDefs, children, ...extra };
  };
  return roh.flatMap((b) => {
    if (typeof b === "string") return [block("normal", b)];
    if ("liste" in b) return b.liste.map((p) => block("normal", p, { listItem: "bullet", level: 1 }));
    return [block(b.stufe === 3 ? "h3" : "h2", b.titel)];
  });
}

function dokumenteBauen(): Doc[] {
  const e = lesen("einstellungen.json"), t = lesen("texte.json"), s = lesen("startseite.json");
  const ls = lesen("seiten/leistungen.json"), st = lesen("seiten/studio.json"), ks = lesen("seiten/kontakt.json");
  const docs: Doc[] = [];
  docs.push(ohneLeer({
    _id: "einstellungen", _type: "einstellungen", ...e,
    social: liste(e.social, "socialLink"), oeffnungszeiten: liste(e.oeffnungszeiten, "oeffnungszeit"), sonderzeiten: liste(e.sonderzeiten, "sonderzeit"),
    hinweis: e.hinweis ? { ...e.hinweis, link: verweis(e.hinweis.link) } : undefined,
    logo: bildFeld(e.logo), logoDunkel: bildFeld(e.logoDunkel), signet: bildFeld(e.signet), signetDunkel: bildFeld(e.signetDunkel), seoBild: bildFeld(e.seoBild), herkunft: herkunft(e.herkunft),
  }) as Doc);
  docs.push({
    _id: "texte", _type: "texte", demoHinweis: t.demoHinweis, navigation: liste(t.navigation, "verweis"),
    kopf: { ...t.kopf, buchen: verweis(t.kopf.buchen) },
    leiste: t.leiste,
    footer: { ...t.footer, rechtliches: liste(t.footer.rechtliches, "verweis"), bildnachweis: verweis(t.footer.bildnachweis) },
    ui: { ...t.ui, nichtGefundenLink: verweis(t.ui.nichtGefundenLink) },
    formular: { ...t.formular, betreffOptionen: liste(t.formular.betreffOptionen, "betreffOption"), datenschutzLink: verweis(t.formular.datenschutzLink) },
    einwilligung: { ...t.einwilligung, kategorien: liste(t.einwilligung.kategorien, "einwilligungKategorie") },
    seo: t.seo,
  });
  docs.push({
    _id: "startseite", _type: "startseite", ...s,
    hero: { ...s.hero, knopf: verweis(s.hero.knopf), zweiterKnopf: verweis(s.hero.zweiterKnopf) },
    leistungen: { ...s.leistungen, link: verweis(s.leistungen.link) }, preise: { ...s.preise, link: verweis(s.preise.link) }, studio: { ...s.studio, link: verweis(s.studio.link) },
    belege: belege(s.belege),
  });
  docs.push({ _id: "leistungenSeite", _type: "leistungenSeite", ...ls, belege: belege(ls.belege) });
  docs.push({ _id: "studioSeite", _type: "studioSeite", ...st, abschnitte: liste(st.abschnitte, "abschnittMitLink").map((a) => ohneLeer({ ...a, link: verweis(a.link) })), belege: belege(st.belege) });
  docs.push({ _id: "kontaktSeite", _type: "kontaktSeite", ...ks, belege: belege(ks.belege) });
  for (const name of ["impressum", "datenschutz"]) {
    const { bloecke, slug: s2, ...rest } = lesen(`seiten/${name}.json`);
    docs.push({ _id: `rechtSeite-${name}`, _type: "rechtSeite", ...rest, slug: slug(s2), inhalt: portableText(bloecke) });
  }
  for (const k of lesen("kategorien.json") as Roh[]) {
    const { slug: s2, herkunft: h, ...rest } = k;
    docs.push({ _id: `kategorie-${s2}`, _type: "kategorie", ...rest, slug: slug(s2), herkunft: herkunft(h) });
  }
  for (const l of lesen("leistungen.json") as Roh[]) {
    const { slug: s2, kategorie, varianten, herkunft: h, ...rest } = l;
    docs.push({ _id: `leistung-${s2}`, _type: "leistung", ...rest, slug: slug(s2), kategorie: { _type: "reference", _ref: `kategorie-${kategorie}` }, varianten: liste(varianten, "variante").map((v) => ({ ...v, preis: { _type: "preis", ...v.preis } })), herkunft: herkunft(h) });
  }
  for (const g of lesen("galerie.json") as Roh[]) docs.push(ohneLeer({ _id: `galerieBild-${g._key}`, _type: "galerieBild", titel: g.titel, bild: bildFeld(g.bild), leistung: g.leistung ? { _type: "reference", _ref: `leistung-${g.leistung}` } : undefined, herkunft: herkunft(g.herkunft), freigabe: g.freigabe, reihenfolge: g.reihenfolge ?? 100 }) as Doc);
  for (const m of lesen("team.json") as Roh[]) docs.push(ohneLeer({ _id: `teamMitglied-${m._key}`, _type: "teamMitglied", name: m.name, rolle: m.rolle, text: m.text, bild: m.bild ? bildFeld(m.bild) : undefined, herkunft: herkunft(m.herkunft), freigabe: m.freigabe, reihenfolge: m.reihenfolge ?? 100 }) as Doc);
  for (const f of lesen("fragen.json") as Roh[]) docs.push({ _id: `frage-${f._key}`, _type: "frage", frage: f.frage, antwort: f.antwort, herkunft: herkunft(f.herkunft), freigabe: f.freigabe, reihenfolge: f.reihenfolge ?? 100 });
  return docs;
}

// ── Trockenlauf: Dokumente so lesen, wie die Website sie aus Sanity bekäme, und mit dem lokalen Stand vergleichen ──
function projizieren(wert: unknown, docs: Map<string, Doc>): unknown {
  if (Array.isArray(wert)) return wert.map((v) => projizieren(v, docs));
  if (!wert || typeof wert !== "object") return wert;
  const o = wert as Roh;
  if (o._type === "slug") return o.current;
  if (o._type === "block") return o; // Portable Text bleibt, wie er ist (die Website wandelt ihn selbst um)
  if (o._type === "reference") {
    const ziel = docs.get(o._ref);
    if (!ziel) throw new Error(`Verweis auf ein Dokument, das nicht angelegt wird: ${o._ref}`);
    // Die GROQ-Abfragen lösen Verweise nur auf den Slug auf (kategorie->slug.current, leistung->slug.current)
    return (ziel.slug as Roh).current;
  }
  if (o._type === "bildMitText") {
    const m = /-(\d+)x(\d+)-/.exec(o.asset._ref);
    return { assetId: o.asset._ref, url: `https://cdn.sanity.io/images/probe/production/${o.asset._ref}.webp`, breite: Number(m?.[1]), hoehe: Number(m?.[2]), alt: o.alt, legende: o.legende ?? null, symbolbild: o.symbolbild, nachweis: o.nachweis };
  }
  const aus: Roh = {};
  for (const [k, v] of Object.entries(o)) if (k !== "_type" && k !== "_id") aus[k] = projizieren(v, docs);
  return aus;
}
/** Für den Vergleich: Bilder (andere Adressen im CDN) ausblenden. Sprungmarken werden lokal und in Sanity gleich aus dem Titel abgeleitet und deshalb mitverglichen. */
function vergleichbar(wert: unknown): unknown {
  if (Array.isArray(wert)) return wert.map(vergleichbar);
  if (!wert || typeof wert !== "object") return wert;
  const o = wert as Roh;
  if ("quellen" in o && "breite" in o) return { alt: o.alt, legende: o.legende, symbolbild: o.symbolbild, nachweis: o.nachweis };
  const aus: Roh = {};
  for (const [k, v] of Object.entries(o)) if (v !== undefined) aus[k] = vergleichbar(v);
  return aus;
}
async function trockenlauf(liste2: Doc[]) {
  const docs = new Map(liste2.map((d) => [d._id, d]));
  const proj = (id: string) => normalisieren(projizieren(docs.get(id), docs));
  const q = lokaleQuelle;
  const unterschiede: string[] = [];
  const abgleich = new Map<string, [unknown, unknown]>();
  const gleich = (name: string, ausSanity: unknown, lokal: unknown) => { abgleich.set(name, [ausSanity, lokal]); if (!isDeepStrictEqual(vergleichbar(ausSanity), vergleichbar(lokal))) unterschiede.push(name); };
  gleich("Einstellungen", pruefen(einstellungenSchema, proj("einstellungen"), "Import: Einstellungen"), await q.getEinstellungen());
  gleich("Texte", pruefen(texteSchema, proj("texte"), "Import: Texte"), await q.getTexte());
  gleich("Startseite", pruefen(startseiteSchema, proj("startseite"), "Import: Startseite"), await q.getStartseite());
  gleich("Seite Leistungen", pruefen(leistungenSeiteSchema, proj("leistungenSeite"), "Import: Seite Leistungen"), await q.getLeistungenSeite());
  gleich("Seite Studio", pruefen(studioSeiteSchema, proj("studioSeite"), "Import: Seite Studio"), await q.getStudioSeite());
  gleich("Seite Kontakt", pruefen(kontaktSeiteSchema, proj("kontaktSeite"), "Import: Seite Kontakt"), await q.getKontaktSeite());
  const kategorien = liste2.filter((d) => d._type === "kategorie").map((d) => proj(d._id) as Roh).sort((a, b) => a.reihenfolge - b.reihenfolge);
  gleich("Kategorien", pruefen(z.array(kategorieSchema), kategorien, "Import: Kategorien"), await q.getKategorien());
  // Die Website sortiert nach Reihenfolge (lokal und in GROQ); hier gleich sortieren, damit der Vergleich die Reihenfolge nicht als Abweichung meldet
  const leistungen = liste2.filter((d) => d._type === "leistung").map((d) => proj(d._id) as Roh).sort((a, b) => a.reihenfolge - b.reihenfolge);
  gleich("Leistungen", pruefen(z.array(leistungSchema), leistungen, "Import: Leistungen"), await q.getLeistungen());
  for (const name of ["impressum", "datenschutz"] as const) {
    const { inhalt, ...rest } = proj(`rechtSeite-${name}`) as Roh;
    gleich(`Rechtsseite ${name}`, pruefen(rechtSeiteSchema, { ...rest, bloecke: portableTextZuBloecken(inhalt) }, `Import: ${name}`), await q.getRechtSeite(name));
  }
  const galerie = liste2.filter((d) => d._type === "galerieBild").map((d) => ({ ...(proj(d._id) as Roh), _key: d._id }));
  gleich("Galerie", pruefen(z.array(galerieBildSchema), galerie.map((g: Roh) => ohneReihenfolge(g)), "Import: Galerie"), (await q.getGalerie()).map((g) => ({ ...g, _key: `galerieBild-${g._key}` })));
  const team = liste2.filter((d) => d._type === "teamMitglied").map((d) => ({ ...(proj(d._id) as Roh), _key: d._id }));
  gleich("Team", pruefen(z.array(teamMitgliedSchema), team.map((m: Roh) => ohneReihenfolge(m)), "Import: Team"), (await q.getTeam()).map((m) => ({ ...m, _key: `teamMitglied-${m._key}` })));
  const fragen = liste2.filter((d) => d._type === "frage").map((d) => ({ ...(proj(d._id) as Roh), _key: d._id }));
  gleich("Fragen", pruefen(z.array(frageSchema), fragen.map((f: Roh) => ohneReihenfolge(f)), "Import: Fragen"), (await q.getFragen()).map((f) => ({ ...f, _key: `frage-${f._key}` })));
  if (unterschiede.length) {
    for (const u of unterschiede) if (process.env.DEBUG) console.error(u, JSON.stringify(vergleichbar(abgleich.get(u)?.[0]), null, 1), JSON.stringify(vergleichbar(abgleich.get(u)?.[1]), null, 1));
    throw new Error(`Import weicht vom lokalen Stand ab: ${unterschiede.join(", ")}. scripts/seed.mts und lib/content/sanity.ts abgleichen (DEBUG=1 zeigt beide Stände).`);
  }
}

const docs = dokumenteBauen();
const zaehlung = docs.reduce<Record<string, number>>((z2, d) => ((z2[d._type] = (z2[d._type] ?? 0) + 1), z2), {});
const uebersicht = Object.entries(zaehlung).map(([t, n]) => `${n} × ${t}`).join(", ");

if (probe) {
  await trockenlauf(docs);
  console.log(`✓ Trockenlauf: ${docs.length} Dokumente gebaut (${uebersicht}), ${Object.keys(bilder).length} Bilder zugeordnet.`);
  console.log("  Jedes Dokument besteht das Domainmodell und entspricht nach dem Zurücklesen den lokalen Inhalten. Es wurde nichts geschrieben.");
} else {
  const projectId = (process.env.SANITY_PROJECT_ID ?? "").trim(), dataset = (process.env.SANITY_DATASET ?? "").trim(), token = (process.env.SANITY_API_WRITE_TOKEN ?? "").trim();
  if (!/^[a-z0-9]{8,}$/.test(projectId) || !dataset || !token) {
    console.error("✗ Für den Import fehlen SANITY_PROJECT_ID, SANITY_DATASET oder SANITY_API_WRITE_TOKEN (siehe .env.example).\n  Ohne Zugang lässt sich der Import mit «npm run seed -- --probe» prüfen.");
    process.exit(1);
  }
  const client = createClient({ projectId, dataset, token, apiVersion: "2025-02-19", useCdn: false });
  // Bilder hochladen (grösste WebP-Variante, so wie die Demo sie zeigt), dann die Dokumente mit den echten Bildkennungen neu bauen.
  // Wiederholte Läufe erzeugen keine Duplikate: Sanity vergibt die Asset-Kennung aus dem Inhalt der Datei.
  for (const [id, b] of Object.entries(bilder)) {
    const datei = path.join("public", b.quellen.webp[b.quellen.webp.length - 1].url);
    const asset = await client.assets.upload("image", createReadStream(datei), { filename: path.basename(datei) });
    assetIds.set(id, asset._id);
    console.log(`  Bild ${id} → ${asset._id}`);
  }
  zaehler = 0;
  const fertig = dokumenteBauen();
  let tx = client.transaction();
  for (const d of fertig) tx = force ? tx.createOrReplace(d) : tx.createIfNotExists(d);
  await tx.commit();
  console.log(`✓ ${fertig.length} Dokumente ${force ? "geschrieben (bestehende überschrieben)" : "angelegt (bestehende unverändert)"}: ${uebersicht}.`);
}
