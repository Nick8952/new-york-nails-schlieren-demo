import { defineArrayMember, defineField, defineType } from "sanity";

/** Dieselbe Regel wie lib/assets.ts (istErlaubtesLinkziel): interne Seite, Sprungmarke, https, E-Mail oder Telefon. */
export const linkzielErlaubt = (ziel: string | undefined) =>
  !ziel || /^\/(?!\/)/.test(ziel) || /^#[A-Za-z][\w-]*$/.test(ziel) || /^(https:\/\/[^\s]+|mailto:[^\s]+|tel:\+?[\d\s()-]+)$/.test(ziel) ? true : "Erlaubt sind interne Seiten («/kontakt/»), Sprungmarken («#anker»), https://-Adressen, mailto: und tel:.";

/** Schweizer Schreibweise und ruhige Satzzeichen: gilt für alle sichtbaren Texte. */
export const schreibweise = (text: string | undefined) => {
  if (!text) return true;
  if (text.includes("ß")) return "Bitte «ss» statt «ß» schreiben (Schweizer Schreibweise).";
  if (/[—–]/.test(text)) return "Bitte keinen Gedankenstrich verwenden: Satz umstellen oder einen Punkt setzen.";
  return true;
};

const FREIGABE = { list: [{ title: "Demo (belegt, nicht bestätigt)", value: "demo" }, { title: "Live (vom Studio freigegeben)", value: "live" }], layout: "radio" as const };

export const verweis = defineType({
  name: "verweis",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "text", title: "Beschriftung", type: "string", validation: (r) => r.required().custom(schreibweise) }),
    defineField({ name: "ziel", title: "Ziel", type: "string", description: "Interne Seite («/kontakt/»), Sprungmarke, https://-Adresse (zum Beispiel die Buchungsseite), mailto: oder tel:", validation: (r) => r.required().custom(linkzielErlaubt) }),
  ],
  preview: { select: { title: "text", subtitle: "ziel" } },
});

export const bildMitText = defineType({
  name: "bildMitText",
  title: "Bild",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({ name: "alt", title: "Bildbeschreibung (Alternativtext)", type: "string", description: "Beschreibt, was auf dem Bild zu sehen ist, für Menschen, die es nicht sehen. Zum Beispiel «French-Modellage mit feinem Glitzerstreifen».", validation: (r) => r.required().min(5).custom(schreibweise) }),
    defineField({ name: "legende", title: "Bildlegende", type: "string", description: "Kurzer Text unter dem Bild (optional).", validation: (r) => r.custom(schreibweise) }),
    defineField({ name: "symbolbild", title: "Symbolbild (keine Aufnahme aus dem Studio)", type: "boolean", description: "Eingeschaltet: Das Bild wird sichtbar als Symbolbild gekennzeichnet. Nur ausschalten, wenn das Bild eine eigene Arbeit, das Studio oder das Team zeigt.", initialValue: false }),
    defineField({
      name: "nachweis",
      title: "Bildnachweis",
      type: "object",
      description: "Erscheint im Impressum. Bei eigenen Fotos: Fotografin oder Fotograf und «eigenes Bild».",
      fields: [
        defineField({ name: "urheber", title: "Urheberin oder Urheber", type: "string", validation: (r) => r.required() }),
        defineField({ name: "quelle", title: "Quelle", type: "string", description: "Adresse der Bildquelle oder «eigenes Bild»", validation: (r) => r.required() }),
        defineField({ name: "lizenz", title: "Lizenz oder Nutzungsrecht", type: "string", description: "Zum Beispiel «Alle Rechte bei New York Nails Schlieren» oder eine Lizenzbezeichnung", validation: (r) => r.required() }),
      ],
      validation: (r) => r.required(),
    }),
  ],
});

export const herkunft = defineType({
  name: "herkunft",
  title: "Quelle",
  type: "object",
  fields: [
    defineField({ name: "quelle", title: "Bezeichnung der Quelle", type: "string", description: "Zum Beispiel «Buchungsseite bei Beauty Booking» oder «Bestätigung von Frau Muster, E-Mail vom 3. März»", validation: (r) => r.required().min(3) }),
    defineField({
      name: "url", title: "Adresse der Quelle", type: "url",
      description: "Pflicht bei Website, Buchungsplattform, eigenem Profil und amtlichen Quellen. Bei eigenen Angaben des Studios darf sie fehlen; dann steht in der Bezeichnung, wer wann bestätigt hat.",
      validation: (r) => r.uri({ scheme: ["https"] }).custom((url, kontext) => (url || (kontext.parent as { art?: string } | undefined)?.art === "eigene-quelle" ? true : "Bitte die Adresse der Quelle angeben.")),
    }),
    defineField({ name: "abgerufen", title: "Abgerufen oder bestätigt am", type: "date", validation: (r) => r.required() }),
    defineField({
      name: "art",
      title: "Art der Quelle",
      type: "string",
      description: "Verzeichniseinträge und automatisch erzeugte Texte sind keine zulässige Quelle.",
      options: { list: [{ title: "Eigene Website des Studios", value: "eigene-website" }, { title: "Buchungsplattform des Studios", value: "buchungsplattform" }, { title: "Eigenes Profil (Instagram, Facebook, Google)", value: "eigenes-profil" }, { title: "Eigene Angabe des Studios", value: "eigene-quelle" }, { title: "Amtlich (Handelsregister)", value: "amtlich" }], layout: "radio" },
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: "quelle", subtitle: "abgerufen" } },
});

export const belege = defineType({
  name: "belege",
  title: "Belege für die Texte dieser Seite",
  type: "object",
  description: "Einleitungen und freie Texte dieser Seite sagen etwas über das Studio. Hier steht, worauf sie sich stützen und ob das Studio sie freigegeben hat.",
  fields: [
    defineField({ name: "herkunft", title: "Quellen", type: "array", of: [defineArrayMember({ type: "herkunft" })], validation: (r) => r.required().min(1).error("Mindestens eine Quelle angeben.") }),
    defineField({ name: "freigabe", title: "Freigabe", type: "string", description: "«Live» erst, wenn das Studio die Texte dieser Seite bestätigt hat. Vorher lässt sich die Website nicht für Suchmaschinen freigeben.", options: FREIGABE, initialValue: "demo", validation: (r) => r.required() }),
  ],
});

export const preis = defineType({
  name: "preis",
  title: "Preis",
  type: "object",
  fields: [
    defineField({ name: "chf", title: "Betrag in Franken", type: "number", description: "Genau so wie in der Buchungsplattform. Eine Änderung hier ändert den Preis bei Beauty Booking nicht.", validation: (r) => r.required().positive() }),
    defineField({ name: "ab", title: "«ab»-Preis", type: "boolean", description: "Eingeschaltet: Die Website zeigt «ab CHF …». Nur, wenn die Buchungsplattform den Preis auch als «ab» führt.", initialValue: false, validation: (r) => r.required() }),
    defineField({ name: "abweichung", title: "Preis kann je nach Aufwand abweichen", type: "boolean", description: "Eingeschaltet: Die Website vermerkt bei dieser Ausführung «je nach Aufwand». Entspricht «Preisabweichung je Bedarf» in der Buchungsplattform.", initialValue: false, validation: (r) => r.required() }),
  ],
  preview: { select: { chf: "chf", ab: "ab" }, prepare: ({ chf, ab }) => ({ title: `${ab ? "ab " : ""}CHF ${chf}` }) },
});

export const variante = defineType({
  name: "variante",
  title: "Ausführung",
  type: "object",
  description: "Eine buchbare Position mit Preis und Dauer. Leistungen mit nur einer Position haben genau eine Ausführung.",
  fields: [
    defineField({ name: "titel", title: "Bezeichnung auf der Website", type: "string", description: "Verständlich formuliert, zum Beispiel «Ombre oder Babyboomer».", validation: (r) => r.required().custom(schreibweise) }),
    defineField({ name: "originalName", title: "Bezeichnung in der Buchungsplattform", type: "string", description: "Wörtlich, damit sich die Position beim Abgleich wiederfinden lässt.", validation: (r) => r.required() }),
    defineField({ name: "originalBeschreibung", title: "Beschreibung in der Buchungsplattform", type: "string", description: "Wörtlich (optional)." }),
    defineField({ name: "preis", title: "Preis", type: "preis", validation: (r) => r.required() }),
    defineField({ name: "dauerMinuten", title: "Dauer in Minuten", type: "number", validation: (r) => r.required().integer().positive() }),
    defineField({ name: "hinweis", title: "Hinweis zu dieser Ausführung (optional)", type: "string", validation: (r) => r.custom(schreibweise) }),
  ],
  preview: { select: { title: "titel", chf: "preis.chf", dauer: "dauerMinuten" }, prepare: ({ title, chf, dauer }) => ({ title, subtitle: `CHF ${chf} · ${dauer} Min.` }) },
});

export const abschnitt = defineType({
  name: "abschnitt",
  title: "Abschnitt",
  type: "object",
  fields: [
    defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required().custom(schreibweise) }),
    defineField({ name: "text", title: "Text", type: "text", rows: 4, validation: (r) => r.required().custom(schreibweise) }),
  ],
  preview: { select: { title: "titel", subtitle: "text" } },
});

export const abschnittMitLink = defineType({
  name: "abschnittMitLink",
  title: "Abschnitt mit Link",
  type: "object",
  fields: [
    defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required().custom(schreibweise) }),
    defineField({ name: "text", title: "Text", type: "text", rows: 4, validation: (r) => r.required().custom(schreibweise) }),
    defineField({ name: "link", title: "Link (optional)", type: "verweis" }),
  ],
  preview: { select: { title: "titel", subtitle: "text" } },
});

export const oeffnungszeit = defineType({
  name: "oeffnungszeit",
  title: "Öffnungszeit",
  type: "object",
  fields: [
    defineField({ name: "tag", title: "Wochentag", type: "string", options: { list: [{ title: "Montag", value: "montag" }, { title: "Dienstag", value: "dienstag" }, { title: "Mittwoch", value: "mittwoch" }, { title: "Donnerstag", value: "donnerstag" }, { title: "Freitag", value: "freitag" }, { title: "Samstag", value: "samstag" }, { title: "Sonntag", value: "sonntag" }] }, validation: (r) => r.required() }),
    defineField({ name: "geschlossen", title: "An diesem Tag geschlossen", type: "boolean", initialValue: false, validation: (r) => r.required() }),
    defineField({ name: "von", title: "Geöffnet von", type: "string", description: "Uhrzeit als HH:MM, zum Beispiel 09:30", validation: (r) => r.regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "Uhrzeit HH:MM" }).custom((wert, kontext) => ((kontext.parent as { geschlossen?: boolean } | undefined)?.geschlossen || wert ? true : "Offene Tage brauchen eine Zeit «von».")) }),
    defineField({ name: "bis", title: "Geöffnet bis", type: "string", description: "Uhrzeit als HH:MM, zum Beispiel 20:00", validation: (r) => r.regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "Uhrzeit HH:MM" }).custom((wert, kontext) => { const p = kontext.parent as { geschlossen?: boolean; von?: string } | undefined; if (p?.geschlossen) return true; if (!wert) return "Offene Tage brauchen eine Zeit «bis»."; return p?.von && wert <= p.von ? "«bis» muss nach «von» liegen." : true; }) }),
  ],
  preview: { select: { tag: "tag", geschlossen: "geschlossen", von: "von", bis: "bis" }, prepare: ({ tag, geschlossen, von, bis }) => ({ title: tag, subtitle: geschlossen ? "geschlossen" : `${von} bis ${bis} Uhr` }) },
});

export const sonderzeit = defineType({
  name: "sonderzeit",
  title: "Abweichende Zeiten (Feiertag, Ferien)",
  type: "object",
  fields: [
    defineField({ name: "titel", title: "Bezeichnung", type: "string", description: "Zum Beispiel «Betriebsferien» oder «Weihnachten»", validation: (r) => r.required().custom(schreibweise) }),
    defineField({ name: "von", title: "Von (Datum)", type: "date", validation: (r) => r.required() }),
    defineField({ name: "bis", title: "Bis (Datum)", type: "date", description: "Nach diesem Datum verschwindet der Eintrag von der Website.", validation: (r) => r.required() }),
    defineField({ name: "zeiten", title: "Geänderte Zeiten", type: "string", description: "Leer lassen = an diesen Tagen geschlossen. Sonst zum Beispiel «10:00 bis 16:00 Uhr».", validation: (r) => r.custom(schreibweise) }),
  ],
  preview: { select: { title: "titel", von: "von", bis: "bis" }, prepare: ({ title, von, bis }) => ({ title, subtitle: `${von} bis ${bis}` }) },
});

export const hinweis = defineType({
  name: "hinweis",
  title: "Zeitlich begrenzter Hinweis",
  type: "object",
  description: "Erscheint nur zwischen den beiden Daten, zum Beispiel für Ferien oder eine Aktion. Aktionen nur mit Enddatum.",
  fields: [
    defineField({ name: "text", title: "Text", type: "text", rows: 2, validation: (r) => r.required().custom(schreibweise) }),
    defineField({ name: "von", title: "Sichtbar ab", type: "date", validation: (r) => r.required() }),
    defineField({ name: "bis", title: "Sichtbar bis", type: "date", validation: (r) => r.required() }),
    defineField({ name: "link", title: "Link (optional)", type: "verweis" }),
  ],
});

export const socialLink = defineType({
  name: "socialLink",
  title: "Social-Media-Profil",
  type: "object",
  fields: [
    defineField({ name: "plattform", title: "Plattform", type: "string", options: { list: [{ title: "Instagram", value: "instagram" }, { title: "Facebook", value: "facebook" }] }, validation: (r) => r.required() }),
    defineField({ name: "url", title: "Adresse des Profils", type: "url", validation: (r) => r.required().uri({ scheme: ["https"] }) }),
    defineField({ name: "handle", title: "Profilname", type: "string", description: "Zum Beispiel «newyorknails.schlieren»", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "plattform", subtitle: "handle" } },
});

export const freigabeFeld = defineField({ name: "freigabe", title: "Freigabe", type: "string", description: "«Demo»: belegt, aber vom Studio noch nicht bestätigt. «Live»: vom Studio freigegeben.", options: FREIGABE, initialValue: "demo", validation: (r) => r.required() });

/** Kurzform für ein einfaches Pflicht-Textfeld mit Schreibweise-Prüfung (einzeilig, mit `zeilen` mehrzeilig). */
export function text(name: string, title: string, description?: string, zeilen?: number) {
  return zeilen
    ? defineField({ name, title, description, type: "text", rows: zeilen, validation: (r) => r.required().custom(schreibweise) })
    : defineField({ name, title, description, type: "string", validation: (r) => r.required().custom(schreibweise) });
}

export const seoFelder = [
  defineField({ name: "seoTitel", title: "Seitentitel für Suchmaschinen", type: "string", description: "Erscheint im Browser-Tab und in Suchergebnissen. Der Studioname wird automatisch angehängt.", group: "seo", validation: (r) => r.max(55).custom(schreibweise) }),
  defineField({ name: "seoBeschreibung", title: "Beschreibung für Suchmaschinen", type: "text", rows: 3, description: "Ein bis zwei Sätze, 50 bis 170 Zeichen.", group: "seo", validation: (r) => r.min(50).max(170).custom(schreibweise) }),
];
export const seoGruppe = [{ name: "inhalt", title: "Inhalt", default: true }, { name: "seo", title: "Suchmaschinen" }];
