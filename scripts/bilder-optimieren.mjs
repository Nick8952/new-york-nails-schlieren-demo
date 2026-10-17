// Erzeugt aus den Originalen in assets/originale/ die Web-Varianten in public/bilder/
// und schreibt das Bildverzeichnis data/bilder.json (Masse, Varianten, Alternativtext, Bildnachweis).
// Aufruf: npm run bilder   (idempotent: public/bilder wird neu aufgebaut)
//
// Zuordnung id → Originaldatei samt Nachweis: scripts/bilder-liste.json. Herkunft jeder Datei: assets/originale/HERKUNFT.md
// Arten:
//   "kachel"  quadratische, nahtlos wiederholbare Textur (Bodenfläche, Handmuster). Mit "nahtlos": true wird ein Foto erst
//             kachelbar gemacht: grossflächige Helligkeitsunterschiede ausgleichen, Ränder mit dem versetzten Bild überblenden.
//   "foto"    Foto mit festem Seitenverhältnis ("verhaeltnis": "3:2")
//   "logo"    unverändertes Firmenlogo mit transparentem Grund (PNG), nur verkleinert; verlustfreies WebP, kein AVIF
//   "logo-negativ"  Negativfassung eines transparenten Logos: Alpha bleibt, alle Farben werden Weiss (für dunkle Flächen)
// Dateinamen tragen einen Inhalts-Hash, damit Browser nach Bildwechseln nichts Altes zeigen. Es wird nie hochskaliert.
import sharp from "sharp";
import { mkdir, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const WURZEL = path.resolve(import.meta.dirname, "..");
const QUELLE = path.join(WURZEL, "assets/originale");
const ZIEL = path.join(WURZEL, "public/bilder");
const BILDER = JSON.parse(await readFile(path.join(WURZEL, "scripts/bilder-liste.json"), "utf8"));

/** Foto in eine nahtlos kachelbare Textur überführen (für gleichmässige Oberflächen wie Teppich oder Kork). */
async function nahtlosMachen(eingabe, kante) {
  const { data, info } = await eingabe.resize(kante, kante, { fit: "cover" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const weich = await sharp(data, { raw: info }).blur(kante / 14).raw().toBuffer();
  const n = info.width * info.height;
  const mittel = [0, 0, 0];
  for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) mittel[k] += data[i * 3 + k];
  for (let k = 0; k < 3; k++) mittel[k] /= n;
  // 1) Helligkeit ausgleichen: Bild minus stark weichgezeichnetes Bild plus Mittelwert
  const flach = new Float32Array(n * 3);
  for (let i = 0; i < n * 3; i++) flach[i] = data[i] - weich[i] + mittel[i % 3];
  // 2) Ränder überblenden: an den Kanten zeigt sich das um die halbe Kante versetzte Bild, in der Mitte das Original
  const aus = Buffer.alloc(n * 3);
  const halb = kante / 2;
  const stufe = (t) => t * t * (3 - 2 * t);
  for (let y = 0; y < kante; y++) {
    for (let x = 0; x < kante; x++) {
      const rand = Math.min(x, kante - 1 - x, y, kante - 1 - y) / (kante * 0.22);
      const w = stufe(Math.max(0, Math.min(1, rand)));
      const i = (y * kante + x) * 3;
      const j = (((y + halb) % kante) * kante + ((x + halb) % kante)) * 3;
      for (let k = 0; k < 3; k++) aus[i + k] = Math.max(0, Math.min(255, Math.round(flach[i + k] * w + flach[j + k] * (1 - w))));
    }
  }
  return sharp(aus, { raw: { width: kante, height: kante, channels: 3 } });
}

/**
 * Logo auf weissem Grund (JPEG) → Logo mit transparentem Grund. Je Bildpunkt gilt: Deckkraft = 1 − hellster Kanal,
 * die Farbe wird so zurückgerechnet, dass das Logo auf Weiss exakt gleich aussieht wie die Vorlage. Formen und Farben bleiben unverändert.
 */
async function weissZuTransparent(eingabe) {
  const { data, info } = await eingabe.removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height;
  const aus = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const a = 1 - Math.min(r, g, b) / 255;
    const zurueck = (c) => (a < 0.004 ? 0 : Math.max(0, Math.min(255, Math.round((c - 255 * (1 - a)) / a))));
    aus[i * 4] = zurueck(r); aus[i * 4 + 1] = zurueck(g); aus[i * 4 + 2] = zurueck(b); aus[i * 4 + 3] = Math.round(a * 255);
  }
  return sharp(aus, { raw: { width: info.width, height: info.height, channels: 4 } });
}

/** true, wenn ein Bild zwar einen Alphakanal hat, aber überall deckend ist (dann liegt das Logo auf weissem Grund). */
async function istDeckend(eingabe) {
  const meta = await eingabe.clone().metadata();
  if (!meta.hasAlpha) return true;
  const st = await eingabe.clone().stats();
  return (st.channels[3]?.min ?? 255) === 255;
}

/** Negativfassung: Deckkraft bleibt, jede sichtbare Farbe wird Weiss. Die Form des Logos ändert sich nicht. Deckende Logos auf Weiss werden vorher freigestellt. */
async function negativ(eingabe) {
  const quelle = (await istDeckend(eingabe)) ? await weissZuTransparent(eingabe) : eingabe;
  const { data, info } = await quelle.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height;
  const aus = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) { aus[i * 4] = 255; aus[i * 4 + 1] = 255; aus[i * 4 + 2] = 255; aus[i * 4 + 3] = data[i * 4 + 3]; }
  return sharp(aus, { raw: { width: info.width, height: info.height, channels: 4 } });
}

function verhaeltnis(text) {
  const [b, h] = text.split(":").map(Number);
  if (!b || !h) throw new Error(`Seitenverhältnis «${text}» ist ungültig (erwartet z. B. "3:2").`);
  return b / h;
}

// Erst alle Quellen prüfen, in einen temporären Ordner rendern und zum Schluss atomar austauschen (kein halber Bestand bei Fehlern).
for (const [id, cfg] of Object.entries(BILDER)) {
  const meta = await sharp(path.join(QUELLE, cfg.datei)).metadata().catch(() => null);
  if (!meta?.width || !meta?.height) throw new Error(`Bild «${id}»: ${cfg.datei} fehlt oder ist nicht lesbar.`);
  if (typeof cfg.alt !== "string") throw new Error(`Bild «${id}»: Alternativtext fehlt (leer "" nur für rein dekorative Bilder).`);
  if (!cfg.nachweis?.urheber || !cfg.nachweis?.quelle || !cfg.nachweis?.lizenz) throw new Error(`Bild «${id}»: Bildnachweis (urheber, quelle, lizenz) ist unvollständig.`);
}
const TEMP = `${ZIEL}.neu`;
await rm(TEMP, { recursive: true, force: true });
await mkdir(TEMP, { recursive: true });

async function schreiben(id, pipe, format) {
  const fertig = format === "avif" ? pipe.avif({ quality: 50, effort: 6 }) : format === "jpg" ? pipe.jpeg({ quality: 84, mozjpeg: true }) : (format === "webp-logo" ? pipe.webp({ lossless: true }) : pipe.webp({ quality: 72 }));
  const { data, info } = await fertig.toBuffer({ resolveWithObject: true });
  const endung = format === "avif" ? "avif" : format === "jpg" ? "jpg" : "webp";
  const hash = createHash("sha1").update(data).digest("hex").slice(0, 8);
  const dateiname = `${id}-${info.width}-${hash}.${endung}`;
  await writeFile(path.join(TEMP, dateiname), data);
  return { breite: info.width, hoehe: info.height, url: `/bilder/${dateiname}`, bytes: data.length };
}

const verzeichnis = {};
for (const [id, cfg] of Object.entries(BILDER)) {
  const pfad = path.join(QUELLE, cfg.datei);
  const meta = await sharp(pfad).metadata();
  let basis = sharp(pfad).rotate();
  let quellBreite = meta.width;
  let quellHoehe = meta.height;
  if (cfg.ausschnitt) {
    basis = sharp(await basis.extract(cfg.ausschnitt).toBuffer());
    quellBreite = cfg.ausschnitt.width;
    quellHoehe = cfg.ausschnitt.height;
  }
  const ratio = cfg.art === "kachel" ? 1 : cfg.verhaeltnis ? verhaeltnis(cfg.verhaeltnis) : quellBreite / quellHoehe;
  const maxBreite = Math.floor(Math.min(quellBreite, quellHoehe * ratio));
  const breiten = [...new Set(cfg.breiten.map((b) => Math.min(b, maxBreite)))].sort((a, b) => a - b);
  const avif = [];
  const webp = [];
  for (const b of breiten) {
    const h = Math.round(b / ratio);
    let pipe;
    if (cfg.art === "kachel" && cfg.nahtlos) pipe = await nahtlosMachen(basis.clone(), b);
    else pipe = basis.clone().resize({ width: b, height: h, fit: "cover", position: cfg.position ?? "centre", withoutEnlargement: true });
    const puffer = await pipe.png().toBuffer();
    if (cfg.art === "logo") {
      // Logos mit echtem transparentem Grund bleiben, wie sie sind; deckende Logos auf Weiss werden freigestellt (Form und Farbe unverändert).
      webp.push(await schreiben(id, (await istDeckend(sharp(puffer))) ? await weissZuTransparent(sharp(puffer)) : sharp(puffer), "webp-logo"));
    } else if (cfg.art === "logo-negativ") {
      webp.push(await schreiben(id, await negativ(sharp(puffer)), "webp-logo"));
    } else {
      avif.push(await schreiben(id, sharp(puffer), "avif"));
      webp.push(await schreiben(id, sharp(puffer), "webp"));
    }
  }
  const groesste = webp[webp.length - 1];
  verzeichnis[id] = {
    id,
    art: cfg.art,
    original: `assets/originale/${cfg.datei}`,
    breite: groesste.breite,
    hoehe: groesste.hoehe,
    alt: cfg.alt,
    legende: cfg.legende ?? null,
    symbolbild: cfg.symbolbild === true,
    nachweis: cfg.nachweis,
    abgerufen: cfg.abgerufen,
    bearbeitung: cfg.bearbeitung ?? null,
    quellen: {
      avif: avif.map(({ breite, url }) => ({ breite, url })),
      webp: webp.map(({ breite, url }) => ({ breite, url })),
    },
    bytes: { avif: avif.map((v) => v.bytes), webp: webp.map((v) => v.bytes) },
  };
}

// Vorschaubild für geteilte Links (Open Graph, 1200 × 630): dunkler Grund wie im Einstieg der Website, darauf die unveränderte
// Wortmarke aus dem Jubiläumsbanner und darunter die Goldlinie der Gestaltung. Keine Texte, die eine Schrift bräuchten.
{
  const grund = "#0b0b0a";
  const gold = "#c9a24a";
  // Die Wortmarke stammt hier direkt aus dem Jubiläumsbanner des Studios (weiss und gold auf Schwarz, Ausschnitt ohne Aktionsangaben).
  const cfg = { datei: "jubilaeumsbanner-10JahreNYN.jpeg", ausschnitt: { left: 520, top: 38, width: 560, height: 112 }, abgerufen: "2026-10-16" };
  const marke = await sharp(path.join(QUELLE, cfg.datei)).extract(cfg.ausschnitt).resize({ width: 820 }).toBuffer();
  const markeMeta = await sharp(marke).metadata();
  const linie = await sharp({ create: { width: 160, height: 3, channels: 3, background: gold } }).png().toBuffer();
  const og = sharp({ create: { width: 1200, height: 630, channels: 3, background: grund } }).composite([
    { input: marke, left: Math.round((1200 - markeMeta.width) / 2), top: Math.round((630 - markeMeta.height) / 2) - 30 },
    { input: linie, left: 520, top: Math.round((630 - markeMeta.height) / 2) + markeMeta.height + 20 },
  ]);
  const { breite, hoehe, url, bytes } = await schreiben("og-new-york-nails", og, "jpg");
  verzeichnis["og-new-york-nails"] = {
    id: "og-new-york-nails", art: "foto", original: "erzeugt aus assets/originale/jubilaeumsbanner-10JahreNYN.jpeg (Ausschnitt Wortmarke)", breite, hoehe,
    alt: "New York Nails, Nails, Lashes & Beauty Care, Schlieren", legende: null, symbolbild: false,
    nachweis: { urheber: "New York Nails Schlieren (Wortmarke aus dem Jubiläumsbanner)", titel: "Vorschaubild", quelle: "https://newyorknails-schlieren.ch/img/10JahreNYN.jpeg, Ausschnitt; erzeugt von scripts/bilder-optimieren.mjs", lizenz: "Marke und Logo vorbehaltlich Freigabe" },
    abgerufen: cfg.abgerufen, bearbeitung: "Montage aus der Wortmarke auf dunklem Grund",
    quellen: { avif: [], webp: [{ breite, url }] }, bytes: { avif: [], webp: [bytes] },
  };
}

const ALT = `${ZIEL}.alt`;
await rm(ALT, { recursive: true, force: true });
let hatteAlt = false;
try { await rename(ZIEL, ALT); hatteAlt = true; } catch { /* noch kein Bestand */ }
try {
  await rename(TEMP, ZIEL);
} catch (err) {
  if (hatteAlt) await rename(ALT, ZIEL);
  throw err;
}
await rm(ALT, { recursive: true, force: true });
await mkdir(path.join(WURZEL, "data"), { recursive: true });
await writeFile(path.join(WURZEL, "data/bilder.json"), JSON.stringify(verzeichnis, null, 2) + "\n");
const summe = Object.values(verzeichnis).reduce((s, b) => s + [...b.bytes.avif, ...b.bytes.webp].reduce((a, c) => a + c, 0), 0);
console.log(`${Object.keys(verzeichnis).length} Bilder → data/bilder.json, ${(await readdir(ZIEL)).length} Dateien in public/bilder (${Math.round(summe / 1024)} KB)`);
for (const b of Object.values(verzeichnis)) console.log(`  ${b.id.padEnd(22)} ${b.breite}×${b.hoehe}  avif ${b.bytes.avif.map((x) => Math.round(x / 1024) + "KB").join("/") || "-"}  webp ${b.bytes.webp.map((x) => Math.round(x / 1024) + "KB").join("/")}`);
