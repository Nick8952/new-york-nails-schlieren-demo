import "server-only";
import einstellungenRoh from "@/data/einstellungen.json";
import texteRoh from "@/data/texte.json";
import startseiteRoh from "@/data/startseite.json";
import kategorienRoh from "@/data/kategorien.json";
import leistungenRoh from "@/data/leistungen.json";
import galerieRoh from "@/data/galerie.json";
import teamRoh from "@/data/team.json";
import fragenRoh from "@/data/fragen.json";
import bilderRoh from "@/data/bilder.json";
import leistungenSeiteRoh from "@/data/seiten/leistungen.json";
import studioSeiteRoh from "@/data/seiten/studio.json";
import kontaktSeiteRoh from "@/data/seiten/kontakt.json";
import impressumRoh from "@/data/seiten/impressum.json";
import datenschutzRoh from "@/data/seiten/datenschutz.json";
import {
  einstellungenSchema, frageSchema, galerieBildSchema, kategorieSchema, kontaktSeiteSchema, leistungSchema, leistungenSeiteSchema, pruefen, rechtSeiteSchema,
  startseiteSchema, studioSeiteSchema, teamMitgliedSchema, texteSchema,
  type Bild, type Inhaltsquelle, type Kategorie, type Leistung,
} from "./modell";
import { bloecke, type RohBlock } from "./text";
import { z } from "zod";

/**
 * Lokale Inhaltsquelle: liest data/*.json, löst Bildkennungen auf und prüft alles gegen das Domainmodell.
 * Das ist der Inhaltsbestand der GitHub-Pages-Demo. Dieselben Dateien sind die Vorlage für den Import nach Sanity (scripts/seed.mts).
 */
type BildEintrag = { id: string; breite: number; hoehe: number; alt: string; legende: string | null; symbolbild: boolean; nachweis: { urheber: string; titel: string; quelle: string; lizenz: string }; quellen: Bild["quellen"] };
const bilder = bilderRoh as unknown as Record<string, BildEintrag>;

export function bild(id: string): Bild {
  const b = bilder[id];
  if (!b) throw new Error(`Bild «${id}» fehlt in data/bilder.json (npm run bilder ausführen oder Kennung korrigieren).`);
  return { alt: b.alt, breite: b.breite, hoehe: b.hoehe, quellen: b.quellen, symbolbild: b.symbolbild, legende: b.legende ?? undefined, nachweis: { urheber: b.nachweis.urheber, quelle: b.nachweis.quelle, lizenz: b.nachweis.lizenz } };
}

const kategorien: Kategorie[] = pruefen(z.array(kategorieSchema), kategorienRoh, "data/kategorien.json").sort((a, b) => a.reihenfolge - b.reihenfolge);
const leistungen: Leistung[] = pruefen(z.array(leistungSchema), leistungenRoh, "data/leistungen.json").sort((a, b) => a.reihenfolge - b.reihenfolge);
for (const l of leistungen) {
  if (!kategorien.some((k) => k.slug === l.kategorie)) throw new Error(`data/leistungen.json: Leistung «${l.slug}» verweist auf die Kategorie «${l.kategorie}», die es in data/kategorien.json nicht gibt.`);
}
{
  const slugs = new Set<string>();
  for (const l of leistungen) {
    if (slugs.has(l.slug)) throw new Error(`data/leistungen.json: Slug «${l.slug}» kommt doppelt vor.`);
    slugs.add(l.slug);
  }
}

const einstellungen = pruefen(
  einstellungenSchema,
  { ...einstellungenRoh, logo: bild(einstellungenRoh.logo), logoDunkel: bild(einstellungenRoh.logoDunkel), signet: bild(einstellungenRoh.signet), signetDunkel: bild(einstellungenRoh.signetDunkel), seoBild: bild(einstellungenRoh.seoBild) },
  "data/einstellungen.json",
);
const texte = pruefen(texteSchema, texteRoh, "data/texte.json");
const startseite = pruefen(startseiteSchema, startseiteRoh, "data/startseite.json");
const leistungenSeite = pruefen(leistungenSeiteSchema, leistungenSeiteRoh, "data/seiten/leistungen.json");
const studioSeite = pruefen(studioSeiteSchema, studioSeiteRoh, "data/seiten/studio.json");
const kontaktSeite = pruefen(kontaktSeiteSchema, kontaktSeiteRoh, "data/seiten/kontakt.json");
const impressum = pruefen(rechtSeiteSchema, { ...impressumRoh, bloecke: bloecke(impressumRoh.bloecke as RohBlock[]) }, "data/seiten/impressum.json");
const datenschutz = pruefen(rechtSeiteSchema, { ...datenschutzRoh, bloecke: bloecke(datenschutzRoh.bloecke as RohBlock[]) }, "data/seiten/datenschutz.json");
const galerie = pruefen(z.array(galerieBildSchema), (galerieRoh as { bild: string }[]).map((g) => ({ ...g, bild: bild(g.bild) })), "data/galerie.json");
const team = pruefen(z.array(teamMitgliedSchema), (teamRoh as { bild?: string }[]).map((t) => ({ ...t, bild: t.bild ? bild(t.bild) : undefined })), "data/team.json");
const fragen = pruefen(z.array(frageSchema), fragenRoh, "data/fragen.json");

export const lokaleQuelle: Inhaltsquelle = {
  getEinstellungen: async () => einstellungen,
  getTexte: async () => texte,
  getStartseite: async () => startseite,
  getKategorien: async () => kategorien,
  getKategorie: async (slug) => kategorien.find((k) => k.slug === slug) ?? null,
  getLeistungen: async () => leistungen,
  getLeistungenSeite: async () => leistungenSeite,
  getStudioSeite: async () => studioSeite,
  getKontaktSeite: async () => kontaktSeite,
  getRechtSeite: async (slug) => (slug === "impressum" ? impressum : datenschutz),
  getGalerie: async () => galerie,
  getTeam: async () => team,
  getFragen: async () => fragen,
  getBildnachweise: async () => {
    const gesehen = new Set<string>();
    return Object.values(bilder)
      .filter((b) => (gesehen.has(b.nachweis.quelle) ? false : (gesehen.add(b.nachweis.quelle), true)))
      .map((b) => ({ titel: b.nachweis.titel ?? b.legende ?? b.alt, urheber: b.nachweis.urheber, quelle: b.nachweis.quelle, lizenz: b.nachweis.lizenz }));
  },
};
