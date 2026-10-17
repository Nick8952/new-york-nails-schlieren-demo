import "server-only";
import type { Inhaltsquelle } from "./modell";
import { indexierungErlaubt, indexierungProbe } from "../deploy-ziel";
import { offeneFreigaben } from "./freigabe";

export * from "./modell";

/**
 * Auswahl der Inhaltsquelle.
 *
 * - Standard (keine Env-Variablen): lokale JSON-Dateien → GitHub-Pages-Demo.
 * - CONTENT_SOURCE=sanity: Sanity. Fehlen Projekt-ID oder Dataset, bricht der Build mit einer klaren Meldung ab;
 *   bewusst kein stiller Rückfall auf Demo-Inhalte.
 *
 * Die Sanity-Quelle wird erst im gewählten Zweig geladen, damit die Demo ohne Sanity-Konfiguration baut
 * und im Pages-Build kein Sanity-Code ausgeführt wird.
 */
const quelleRoh = (process.env.CONTENT_SOURCE ?? "").trim();
if (quelleRoh && quelleRoh !== "sanity" && quelleRoh !== "lokal") {
  throw new Error(`CONTENT_SOURCE=«${quelleRoh}» ist unbekannt. Erlaubt: leer/«lokal» (data/*.json) oder «sanity».`);
}

async function laden(): Promise<Inhaltsquelle> {
  if (quelleRoh === "sanity") {
    const { sanityQuelle } = await import("./sanity");
    return sanityQuelle;
  }
  const { lokaleQuelle } = await import("./local");
  return lokaleQuelle;
}

/**
 * Invarianten, die für beide Inhaltsquellen gelten und sich nicht in einem einzelnen Schema ausdrücken lassen (sie betreffen mehrere
 * Dokumente): Es gibt genau eine Buchungsadresse. Bereichslinks dürfen sie höchstens verlängern, der Buchungsknopf der Kopfzeile und
 * die mobile Leiste zeigen auf sie. Bricht den Build mit klarer Meldung ab, auch mit Inhalten aus Sanity.
 */
export async function invariantenPruefen(q: Inhaltsquelle): Promise<void> {
  const [e, t, kategorien] = await Promise.all([q.getEinstellungen(), q.getTexte(), q.getKategorien()]);
  const fehler: string[] = [];
  if (t.kopf.buchen.ziel !== e.buchung.url) fehler.push(`Der Buchungsknopf (texte.kopf.buchen) zeigt auf «${t.kopf.buchen.ziel}», die Buchungsadresse ist «${e.buchung.url}».`);
  for (const k of kategorien) if (k.buchungUrl && !k.buchungUrl.startsWith(e.buchung.url)) fehler.push(`Bereich «${k.slug}»: Buchungslink «${k.buchungUrl}» beginnt nicht mit der Buchungsadresse «${e.buchung.url}».`);
  if (fehler.length) throw new Error(`Inhalte verletzen die Buchungsregel:\n${fehler.map((f) => `  - ${f}`).join("\n")}`);
}

let invariantenGeprueft: Promise<void> | null = null;
let freigabeGeprueft: Promise<void> | null = null;
/**
 * Die Inhaltsquelle des Builds. Ist die Indexierung für eine echte Domain eingeschaltet (INDEXIERUNG=1), bricht der erste
 * Zugriff ab, solange Angaben nicht freigegeben sind oder die Rechtstexte noch die Demo beschreiben.
 * Ausgenommen ist nur der Probe-Build für eine reservierte Testdomain (siehe lib/deploy-ziel.ts).
 */
export async function inhaltsquelle(): Promise<Inhaltsquelle> {
  const q = await laden();
  invariantenGeprueft ??= invariantenPruefen(q);
  await invariantenGeprueft;
  if (indexierungErlaubt && !indexierungProbe) {
    freigabeGeprueft ??= offeneFreigaben(q).then((offen) => {
      if (offen.length) throw new Error(`INDEXIERUNG=1 ist gesetzt, aber ${offen.length} Punkt(e) sind nicht freigegeben:\n${offen.map((o) => `  - ${o}`).join("\n")}\nErst klären (docs/UEBERGABE.md), dann indexieren.`);
    });
    await freigabeGeprueft;
  }
  return q;
}

export const inhaltsquelleName = quelleRoh === "sanity" ? "sanity" : "lokal";
