import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import "./globals.css";
import { Einwilligung } from "@/components/Einwilligung";
import { Fusszeile } from "@/components/Fusszeile";
import { Hinweisleiste } from "@/components/Hinweisleiste";
import { Kopfzeile } from "@/components/Kopfzeile";
import { MobileLeiste } from "@/components/MobileLeiste";
import { inhaltsquelle, pfade } from "@/lib/content";
import { optionaleBereiche } from "@/lib/content/sichtbar";
import { siteUrl } from "@/lib/deploy-ziel";
import { indexierungErlaubt, jsonLdSicher, studioJsonLd } from "@/lib/seo";

// Schriften lokal aus den fontsource-Paketen (SIL Open Font License); keine Anfragen an fremde Server.
const schriftTitel = localFont({ src: "../node_modules/@fontsource-variable/outfit/files/outfit-latin-wght-normal.woff2", weight: "100 900", variable: "--schrift-titel", display: "swap" });
const schriftText = localFont({ src: "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2", weight: "200 800", variable: "--schrift-text", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const q = await inhaltsquelle();
  const [e, t] = await Promise.all([q.getEinstellungen(), q.getTexte()]);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: e.name, template: `%s | ${t.seo.titelZusatz}` },
    description: t.seo.beschreibung,
    robots: indexierungErlaubt ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f6f6f4" }, { media: "(prefers-color-scheme: dark)", color: "#121211" }] };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const q = await inhaltsquelle();
  const [e, t, galerie, team, fragen] = await Promise.all([q.getEinstellungen(), q.getTexte(), q.getGalerie(), q.getTeam(), q.getFragen()]);
  const sichtbar = optionaleBereiche({ einstellungen: e, galerie, team, fragen });
  return (
    <html lang="de-CH" className={`${schriftTitel.variable} ${schriftText.variable}`}>
      <body>
        <a href="#inhalt" className="nur-sr fixed left-4 top-4 z-50 bg-knopf px-4 py-3 font-semibold text-knopf-text focus:not-sr-only focus:[clip:auto] focus:[height:auto] focus:[width:auto] focus:[position:fixed] focus:[white-space:normal] focus:[margin:0] focus:[overflow:visible]">
          {t.ui.zumInhalt}
        </a>
        {!indexierungErlaubt && t.demoHinweis ? <p className="klein border-b border-linie-stark bg-flaeche-2 px-4 py-1.5 text-center text-tinte-2">{t.demoHinweis}</p> : null}
        <Kopfzeile einstellungen={e} texte={t} />
        <Hinweisleiste hinweis={sichtbar.hinweis} />
        <main id="inhalt" tabIndex={-1} className="w-full max-w-full overflow-x-hidden outline-none">
          {children}
        </main>
        <Fusszeile einstellungen={e} texte={t} zeigeDemoHinweis={!indexierungErlaubt} zeigeZeiten={sichtbar.oeffnungszeiten} />
        <MobileLeiste einstellungen={e} texte={t} />
        <Einwilligung texte={t.einwilligung} datenschutzPfad={pfade.datenschutz} schliessen={t.kopf.schliessen} />
        {indexierungErlaubt ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSicher(studioJsonLd(e)) }} /> : null}
      </body>
    </html>
  );
}
