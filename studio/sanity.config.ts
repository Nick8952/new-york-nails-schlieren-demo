import { defineConfig } from "sanity";
import { structureTool, type StructureBuilder } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { deDELocale } from "@sanity/locale-de-de";
import { schemaTypes, EINZELDOKUMENTE } from "./schemas";
import { dataset, projectId } from "./env";

/**
 * Studio der Website von New York Nails Schlieren. Die Seitenleiste ist nach dem geordnet, was das Studio am häufigsten pflegt:
 * zuerst Leistungen und Preise, dann Öffnungszeiten und Kontakt, dann die Seiten, zuletzt optionale Inhalte und Texte.
 * Seiten, Einstellungen und Texte gibt es je genau einmal; sie lassen sich weder doppelt anlegen noch löschen.
 */
const einzel = (S: StructureBuilder, typ: string, titel: string, id = typ) => S.listItem().title(titel).id(id).child(S.document().schemaType(typ).documentId(id).title(titel));

export default defineConfig({
  name: "new-york-nails",
  title: "New York Nails Schlieren",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Inhalte")
          .items([
            S.documentTypeListItem("leistung").title("Leistungen und Preise"),
            S.documentTypeListItem("kategorie").title("Leistungsbereiche"),
            S.divider(),
            einzel(S, "einstellungen", "Studio, Kontakt und Öffnungszeiten"),
            S.divider(),
            S.listItem().title("Seiten").child(
              S.list().title("Seiten").items([
                einzel(S, "startseite", "Startseite"),
                einzel(S, "leistungenSeite", "Leistungen und Preise"),
                einzel(S, "studioSeite", "Studio"),
                einzel(S, "kontaktSeite", "Kontakt und Anfahrt"),
                einzel(S, "rechtSeite", "Impressum", "rechtSeite-impressum"),
                einzel(S, "rechtSeite", "Datenschutzerklärung", "rechtSeite-datenschutz"),
              ]),
            ),
            S.divider(),
            S.documentTypeListItem("galerieBild").title("Galerie (echte Arbeiten)"),
            S.documentTypeListItem("teamMitglied").title("Team"),
            S.documentTypeListItem("frage").title("Häufige Fragen"),
            S.divider(),
            einzel(S, "texte", "Navigation, Fusszeile und Formulartexte"),
          ]),
    }),
    visionTool({ defaultApiVersion: "2025-02-19" }),
    deDELocale(),
  ],
  schema: {
    types: schemaTypes,
    // Einzeldokumente nicht über «Neu anlegen» anbieten
    templates: (vorlagen) => vorlagen.filter((v) => !EINZELDOKUMENTE.includes(v.schemaType)),
  },
  document: {
    // Einzeldokumente: nur bearbeiten und veröffentlichen, nicht duplizieren oder löschen
    actions: (aktionen, kontext) => (EINZELDOKUMENTE.includes(kontext.schemaType) ? aktionen.filter((a) => a.action && ["publish", "discardChanges", "restore"].includes(a.action)) : aktionen),
  },
});
