import type { MetadataRoute } from "next";
import { inhaltsquelle, pfade } from "@/lib/content";
import { siteUrl } from "@/lib/deploy-ziel";

export const dynamic = "force-static";

/** Wird nur ausgeliefert, wenn die Indexierung erlaubt ist (scripts/export-nachbereiten.mjs entfernt sie sonst). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const q = await inhaltsquelle();
  const kategorien = await q.getKategorien();
  const seiten = [pfade.start, pfade.leistungen, ...kategorien.map((k) => pfade.kategorie(k.slug)), pfade.studio, pfade.kontakt, pfade.impressum, pfade.datenschutz];
  return seiten.map((p) => ({ url: `${siteUrl}${p}`, lastModified: new Date() }));
}
