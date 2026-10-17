import type { Metadata } from "next";
import { RechtSeite } from "@/components/RechtSeite";
import { inhaltsquelle, pfade } from "@/lib/content";
import { seitenMetadaten } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const q = await inhaltsquelle();
  const [e, t, s] = await Promise.all([q.getEinstellungen(), q.getTexte(), q.getRechtSeite("impressum")]);
  return seitenMetadaten({ titel: s.seoTitel ?? s.titel, beschreibung: s.seoBeschreibung, pfad: pfade.impressum, einstellungen: e, texte: t });
}

export default function Impressum() {
  return <RechtSeite slug="impressum" />;
}
