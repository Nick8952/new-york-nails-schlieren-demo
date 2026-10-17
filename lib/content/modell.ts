import { z } from "zod";

/**
 * Das eine Domainmodell der Website. Komponenten kennen nur diese Typen.
 * Beide Inhaltsquellen (lokale JSON-Dateien, später Sanity) normalisieren in dieses Modell und werden beim Build
 * gegen diese Schemas geprüft: fehlerhafte Inhalte brechen den Build mit einer klaren Meldung ab.
 *
 * Grundsatz: Alles, was etwas über das Studio behauptet (Angaben, Leistungen, Preise, Öffnungszeiten), trägt eine Herkunft.
 * Preise und Dauern stammen aus der Buchungsplattform und werden dort nicht automatisch abgeglichen: Website und
 * Buchungssystem sind getrennte Datenquellen (siehe docs/INHALTE-PFLEGEN.md).
 */

/** Zugelassene Herkunftsarten. «Verzeichnis» fehlt absichtlich: Verzeichniseinträge sind keine Quelle für Website-Inhalte. */
export const HERKUNFT_ARTEN = ["eigene-website", "buchungsplattform", "eigenes-profil", "eigene-quelle", "amtlich"] as const;
export const herkunftSchema = z
  .object({
    quelle: z.string().min(3),
    /** Adresse der Quelle. Pflicht, ausser bei eigenen Angaben des Studios (dann nennt `quelle`, wer wann bestätigt hat). */
    url: z.url().optional(),
    abgerufen: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Datum als JJJJ-MM-TT"),
    art: z.enum(HERKUNFT_ARTEN),
  })
  .refine((h) => h.art === "eigene-quelle" || !!h.url, { message: "Die Quelle braucht eine Adresse (nur bei eigenen Angaben des Studios darf sie fehlen).", path: ["url"] });
export type Herkunft = z.infer<typeof herkunftSchema>;

/** «demo»: für die Verkaufs-Demo belegt. «live»: zusätzlich vom Studio für den Produktivbetrieb freigegeben. */
export const freigabeSchema = z.enum(["demo", "live"]);
export type Freigabe = z.infer<typeof freigabeSchema>;

/** Belege für freie Texte einer Seite, die etwas über das Studio sagen: dieselbe Regel wie bei Einzelangaben, für die Seite als Ganzes. */
export const belegeSchema = z.object({ herkunft: z.array(herkunftSchema).min(1, "Mindestens eine Quelle angeben."), freigabe: freigabeSchema });
export type Belege = z.infer<typeof belegeSchema>;

/** Dieselbe Regel wie lib/assets.ts (istErlaubtesLinkziel): interne Seite, Sprungmarke, https, mailto, tel. Gilt für lokale Daten und Sanity. */
export const LINKZIEL = /^(\/(?!\/)[^\s]*|#[A-Za-z][\w-]*|https:\/\/[^\s]+|mailto:[^\s]+|tel:\+?[\d\s()-]+)$/;
export const linkSchema = z.object({ text: z.string().min(1), ziel: z.string().regex(LINKZIEL, "Erlaubt sind interne Seiten («/kontakt/»), Sprungmarken («#anker»), https://-Adressen, mailto: und tel:.") });
export type Link = z.infer<typeof linkSchema>;

const varianteBildSchema = z.object({ breite: z.number().int().positive(), url: z.string().min(1) });
export const bildSchema = z.object({
  /** Alternativtext; leer nur bei rein dekorativen Bildern */
  alt: z.string(),
  breite: z.number().int().positive(),
  hoehe: z.number().int().positive(),
  quellen: z.object({ avif: z.array(varianteBildSchema), webp: z.array(varianteBildSchema).min(1) }),
  /** true = kein Bild des Studios, seiner Räume oder seiner Arbeiten (wird sichtbar gekennzeichnet) */
  symbolbild: z.boolean(),
  legende: z.string().optional(),
  nachweis: z.object({ urheber: z.string(), quelle: z.string(), lizenz: z.string() }).optional(),
});
export type Bild = z.infer<typeof bildSchema>;

// ── Fliesstext ─────────────────────────────────────────────────────────────
const inlineSchema = z.union([z.string(), z.object({ text: z.string(), fett: z.boolean().optional(), link: z.string().optional() })]);
export type Inline = z.infer<typeof inlineSchema>;
export const blockSchema = z.discriminatedUnion("art", [
  z.object({ art: z.literal("absatz"), inhalt: z.array(inlineSchema) }),
  z.object({ art: z.literal("titel"), stufe: z.union([z.literal(2), z.literal(3)]), text: z.string().min(1), anker: z.string().optional() }),
  z.object({ art: z.literal("liste"), punkte: z.array(z.array(inlineSchema)).min(1) }),
]);
export type Block = z.infer<typeof blockSchema>;

// ── Öffnungszeiten ─────────────────────────────────────────────────────────
export const WOCHENTAGE = ["montag", "dienstag", "mittwoch", "donnerstag", "freitag", "samstag", "sonntag"] as const;
export type Wochentag = (typeof WOCHENTAGE)[number];
const uhrzeit = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Uhrzeit als HH:MM");
export const oeffnungszeitSchema = z
  .object({ _key: z.string().min(1), tag: z.enum(WOCHENTAGE), geschlossen: z.boolean(), von: uhrzeit.optional(), bis: uhrzeit.optional() })
  .refine((o) => o.geschlossen || (!!o.von && !!o.bis && o.von < o.bis), { message: "Offene Tage brauchen «von» und «bis» (von < bis).", path: ["bis"] });
export type Oeffnungszeit = z.infer<typeof oeffnungszeitSchema>;

/** Abweichende Zeiten (Feiertage, Ferien): nur sichtbar, solange `bis` nicht vorbei ist. */
export const sonderzeitSchema = z.object({
  _key: z.string().min(1),
  titel: z.string().min(1),
  von: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  bis: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** Leer = an diesen Tagen geschlossen; sonst zum Beispiel «10:00 bis 16:00 Uhr» */
  zeiten: z.string().optional(),
});
export type Sonderzeit = z.infer<typeof sonderzeitSchema>;

/** Zeitlich begrenzter Hinweis (zum Beispiel Ferien): erscheint nur zwischen `von` und `bis`. */
export const hinweisSchema = z.object({
  text: z.string().min(1),
  von: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  bis: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  link: linkSchema.optional(),
});
export type Hinweis = z.infer<typeof hinweisSchema>;

// ── Leistungen ─────────────────────────────────────────────────────────────
export const kategorieSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  titel: z.string().min(1),
  /** Bezeichnung in der Buchungsplattform, wörtlich */
  originalName: z.string().min(1),
  /** Ein Satz für Übersichten */
  kurz: z.string().min(1),
  einleitung: z.string().min(1),
  /** Link zur Kategorie in der Buchungsplattform; fehlt er, gilt der allgemeine Buchungslink */
  buchungUrl: z.string().startsWith("https://").optional(),
  /** Einleitung und Kurztext sagen etwas über das Angebot: Quelle und Freigabe wie bei Leistungen */
  herkunft: z.array(herkunftSchema).min(1),
  freigabe: freigabeSchema,
  seoTitel: z.string().optional(),
  seoBeschreibung: z.string().optional(),
  reihenfolge: z.number(),
});
export type Kategorie = z.infer<typeof kategorieSchema>;

/**
 * Preisangabe: Betrag in Franken wie in der Quelle. `ab` = die Quelle nennt einen «ab»-Preis. `abweichung` = die Quelle sagt,
 * dass der Preis je nach Aufwand abweichen kann. Beides wird sichtbar gemacht; ein solcher Preis ist kein garantierter Endpreis.
 */
export const preisSchema = z.object({ chf: z.number().positive(), ab: z.boolean(), abweichung: z.boolean() });
export type Preis = z.infer<typeof preisSchema>;

export const varianteSchema = z.object({
  _key: z.string().min(1),
  titel: z.string().min(1),
  /** Bezeichnung und Beschreibung in der Buchungsplattform, wörtlich (für die Nachprüfung) */
  originalName: z.string().min(1),
  originalBeschreibung: z.string().optional(),
  preis: preisSchema,
  dauerMinuten: z.number().int().positive(),
  hinweis: z.string().optional(),
});
export type Variante = z.infer<typeof varianteSchema>;

export const leistungSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  kategorie: z.string().regex(/^[a-z0-9-]+$/),
  titel: z.string().min(1),
  /** Englische Bezeichnung, falls die Quelle sie nennt (zum Beispiel «New Set») */
  titelEn: z.string().optional(),
  beschreibung: z.string().min(1),
  varianten: z.array(varianteSchema).min(1),
  /** Gilt für alle Varianten, zum Beispiel «Bei Shellack CHF 20» */
  hinweise: z.array(z.string()),
  herkunft: z.array(herkunftSchema).min(1, "Jede Leistung braucht eine Quelle."),
  freigabe: freigabeSchema,
  reihenfolge: z.number(),
});
export type Leistung = z.infer<typeof leistungSchema>;

// ── Optionale Bereiche (erscheinen erst mit Inhalt) ────────────────────────
export const galerieBildSchema = z.object({
  _key: z.string().min(1),
  bild: bildSchema,
  titel: z.string().min(1),
  /** Welche Leistung zu sehen ist (Slug), optional */
  leistung: z.string().optional(),
  /** Nutzungsrecht geklärt? Ohne Freigabe erscheint das Bild nicht in der öffentlichen Website. */
  freigabe: freigabeSchema,
  herkunft: z.array(herkunftSchema).min(1),
});
export type GalerieBild = z.infer<typeof galerieBildSchema>;

export const teamMitgliedSchema = z.object({
  _key: z.string().min(1),
  name: z.string().min(1),
  rolle: z.string().optional(),
  text: z.string().optional(),
  bild: bildSchema.optional(),
  herkunft: z.array(herkunftSchema).min(1),
  freigabe: freigabeSchema,
});
export type TeamMitglied = z.infer<typeof teamMitgliedSchema>;

export const frageSchema = z.object({
  _key: z.string().min(1),
  frage: z.string().min(1),
  antwort: z.string().min(1),
  herkunft: z.array(herkunftSchema).min(1),
  freigabe: freigabeSchema,
});
export type Frage = z.infer<typeof frageSchema>;

// ── Einstellungen (Studioangaben) ──────────────────────────────────────────
export const SOCIAL_PLATTFORMEN = ["instagram", "facebook"] as const;
export const einstellungenSchema = z.object({
  name: z.string().min(1),
  kurzname: z.string().min(1),
  /** Leitzeile aus dem Logo: «Nails, Lashes & Beauty Care» */
  claim: z.string().min(1),
  /** Rechtsträger, falls bekannt; sonst leer (die Demo erfindet keine Rechtsform) */
  rechtstraeger: z.string().optional(),
  adresse: z.object({ strasse: z.string(), plz: z.string().regex(/^\d{4}$/), ort: z.string(), land: z.string() }),
  telefon: z.string().regex(/^\+41 \d{2} \d{3} \d{2} \d{2}$/),
  email: z.email(),
  buchung: z.object({
    url: z.string().startsWith("https://"),
    anbieter: z.string().min(1),
    /** Kurzer Hinweis, dass die Buchung bei einem externen Dienst erfolgt */
    hinweis: z.string().min(1),
  }),
  /** Externe Ziele, die nur per Klick geöffnet werden (keine Einbettung) */
  karteUrl: z.string().startsWith("https://"),
  tourUrl: z.string().startsWith("https://").optional(),
  social: z.array(z.object({ _key: z.string().min(1), plattform: z.enum(SOCIAL_PLATTFORMEN), url: z.string().startsWith("https://"), handle: z.string().min(1) })),
  /** Leer = nicht bestätigt: Öffnungszeiten erscheinen dann nirgends, auch nicht in den strukturierten Daten. */
  oeffnungszeiten: z.array(oeffnungszeitSchema).max(7),
  oeffnungszeitenHinweis: z.string().optional(),
  sonderzeiten: z.array(sonderzeitSchema),
  hinweis: hinweisSchema.optional(),
  logo: bildSchema,
  logoDunkel: bildSchema,
  signet: bildSchema,
  signetDunkel: bildSchema,
  seoBild: bildSchema,
  herkunft: z.array(herkunftSchema).min(1),
  /** Adresse, Telefon, E-Mail, Öffnungszeiten: belegt (demo) oder vom Studio bestätigt (live) */
  freigabe: freigabeSchema,
});
export type Einstellungen = z.infer<typeof einstellungenSchema>;

// ── Wiederkehrende Texte (Navigation, Fusszeile, Formular, Einwilligung) ───
export const texteSchema = z.object({
  demoHinweis: z.string(),
  navigation: z.array(linkSchema).min(1),
  kopf: z.object({ buchen: linkSchema, anrufen: z.string(), menueKnopf: z.string(), menueTitel: z.string(), schliessen: z.string(), telefonLabel: z.string() }),
  leiste: z.object({ buchen: z.string(), anrufen: z.string() }),
  footer: z.object({ leitsatz: z.string(), kontaktTitel: z.string(), zeitenTitel: z.string(), seitenTitel: z.string(), rechtlichesTitel: z.string(), rechtliches: z.array(linkSchema), route: z.string(), folgen: z.string(), bildnachweis: linkSchema, copyright: z.string(), demoHinweis: z.string() }),
  ui: z.object({
    zumInhalt: z.string(), symbolbild: z.string(), telefon: z.string(), email: z.string(), adresse: z.string(), buchungExtern: z.string(), tour: z.string(), karte: z.string(),
    minuten: z.string(), ab: z.string(), preisAbweichung: z.string(), preisAbweichungKurz: z.string(), dauer: z.string(), preis: z.string(), variante: z.string(),
    alleLeistungen: z.string(), zurUebersicht: z.string(), weitereKategorien: z.string(), leistungenZaehler: z.string(), quellen: z.string(), standQuelle: z.string(),
    heute: z.string(), geschlossen: z.string(), geoeffnet: z.string(), uhr: z.string(), sonderzeitenTitel: z.string(),
    nichtGefundenTitel: z.string(), nichtGefundenText: z.string(), nichtGefundenLink: linkSchema,
  }),
  formular: z.object({
    titel: z.string(), einleitung: z.string(), name: z.string(), email: z.string(), betreff: z.string(),
    betreffOptionen: z.array(z.object({ wert: z.string(), titel: z.string() })).min(1),
    nachricht: z.string(), nachrichtHilfe: z.string(), pflicht: z.string(), datenschutzHinweis: z.string(), datenschutzLink: linkSchema,
    absenden: z.string(), hinweisNachher: z.string(), kopieren: z.string(), kopiert: z.string(), kopierenFehler: z.string(), zuLangFehler: z.string(), volltextLabel: z.string(), betreffPraefix: z.string(),
    fehlerName: z.string(), fehlerEmail: z.string(), fehlerNachricht: z.string(), ohneJavascript: z.string(), keinTermin: z.string(),
  }),
  einwilligung: z.object({
    fussLink: z.string(), ruhendTitel: z.string(), ruhendText: z.string(),
    bannerTitel: z.string(), bannerText: z.string(), alleAkzeptieren: z.string(), nurNotwendige: z.string(), einstellungen: z.string(),
    auswahlSpeichern: z.string(), widerrufen: z.string(), notwendigTitel: z.string(), notwendigText: z.string(), datenschutzerklaerung: z.string(),
    /** Leer = keine einwilligungspflichtigen Dienste: kein Banner. Mit Einträgen wird der Banner aktiv. */
    kategorien: z.array(z.object({ kennung: z.string().regex(/^[a-z]+$/), titel: z.string(), beschreibung: z.string() })),
  }),
  seo: z.object({ titelZusatz: z.string(), beschreibung: z.string() }),
});
export type Texte = z.infer<typeof texteSchema>;

// ── Seiten ─────────────────────────────────────────────────────────────────
const seoSchema = { seoTitel: z.string().optional(), seoBeschreibung: z.string().optional() };
const abschnittSchema = z.object({ titel: z.string().min(1), text: z.string().min(1) });

export const startseiteSchema = z.object({
  hero: z.object({ ueberzeile: z.string().min(1), titel: z.string().min(1), text: z.string().min(1), knopf: linkSchema, zweiterKnopf: linkSchema }),
  leistungen: abschnittSchema.extend({ link: linkSchema }),
  preise: abschnittSchema.extend({ link: linkSchema }),
  studio: abschnittSchema.extend({ link: linkSchema }),
  zeiten: abschnittSchema,
  buchung: abschnittSchema,
  kontakt: abschnittSchema,
  belege: belegeSchema,
  ...seoSchema,
});
export type Startseite = z.infer<typeof startseiteSchema>;

export const leistungenSeiteSchema = z.object({
  titel: z.string().min(1), einleitung: z.string().min(1),
  preisHinweisTitel: z.string().min(1), preisHinweis: z.string().min(1),
  buchungTitel: z.string().min(1), buchungText: z.string().min(1),
  belege: belegeSchema,
  ...seoSchema,
});
export type LeistungenSeite = z.infer<typeof leistungenSeiteSchema>;

export const studioSeiteSchema = z.object({
  titel: z.string().min(1), einleitung: z.string().min(1),
  abschnitte: z.array(z.object({ _key: z.string().min(1), titel: z.string().min(1), text: z.string().min(1), link: linkSchema.optional() })).min(1),
  tourTitel: z.string().min(1), tourText: z.string().min(1),
  galerieTitel: z.string().min(1), galerieText: z.string().min(1),
  teamTitel: z.string().min(1), fragenTitel: z.string().min(1),
  belege: belegeSchema,
  ...seoSchema,
});
export type StudioSeite = z.infer<typeof studioSeiteSchema>;

export const kontaktSeiteSchema = z.object({
  titel: z.string().min(1), einleitung: z.string().min(1),
  buchungTitel: z.string().min(1), buchungText: z.string().min(1),
  direktTitel: z.string().min(1), anfahrtTitel: z.string().min(1), anfahrtText: z.string().min(1), zeitenTitel: z.string().min(1),
  belege: belegeSchema,
  ...seoSchema,
});
export type KontaktSeite = z.infer<typeof kontaktSeiteSchema>;

export const rechtSeiteSchema = z.object({
  slug: z.enum(["impressum", "datenschutz"]),
  titel: z.string().min(1), einleitung: z.string().optional(), stand: z.string().min(1),
  bloecke: z.array(blockSchema).min(1),
  ...seoSchema,
});
export type RechtSeite = z.infer<typeof rechtSeiteSchema>;

// ── Schnittstelle der Inhaltsquellen ───────────────────────────────────────
export interface Inhaltsquelle {
  getEinstellungen(): Promise<Einstellungen>;
  getTexte(): Promise<Texte>;
  getStartseite(): Promise<Startseite>;
  getKategorien(): Promise<Kategorie[]>;
  getKategorie(slug: string): Promise<Kategorie | null>;
  getLeistungen(): Promise<Leistung[]>;
  getLeistungenSeite(): Promise<LeistungenSeite>;
  getStudioSeite(): Promise<StudioSeite>;
  getKontaktSeite(): Promise<KontaktSeite>;
  getRechtSeite(slug: "impressum" | "datenschutz"): Promise<RechtSeite>;
  getGalerie(): Promise<GalerieBild[]>;
  getTeam(): Promise<TeamMitglied[]>;
  getFragen(): Promise<Frage[]>;
  /** Alle Bilder mit Nachweis, für den Bildnachweis im Impressum */
  getBildnachweise(): Promise<{ titel: string; urheber: string; quelle: string; lizenz: string }[]>;
}

/** Prüft Daten gegen ein Schema und bricht mit einer lesbaren Meldung ab (Pfad und Grund je Fehler). */
export function pruefen<T extends z.ZodTypeAny>(schema: T, daten: unknown, wo: string): z.infer<T> {
  const ergebnis = schema.safeParse(daten);
  if (ergebnis.success) return ergebnis.data;
  const zeilen = ergebnis.error.issues.map((i) => `  - ${i.path.join(".") || "(Wurzel)"}: ${i.message}`);
  throw new Error(`${wo}: Inhalt entspricht nicht dem Domainmodell:\n${zeilen.join("\n")}`);
}

// ── Pfade ──────────────────────────────────────────────────────────────────
// Liegen in einer eigenen Datei ohne zod, damit Client-Komponenten sie einbinden können, ohne die Schemas mitzuladen.
export { LEISTUNGEN_BASIS, pfade } from "./pfade";
