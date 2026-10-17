import { defineArrayMember, defineField, defineType } from "sanity";
import { freigabeFeld, schreibweise, seoFelder, seoGruppe, text } from "./objekte";

const reihenfolge = defineField({ name: "reihenfolge", title: "Reihenfolge", type: "number", description: "Kleinere Zahlen stehen weiter vorne (10, 20, 30 lässt Platz für Einschübe).", initialValue: 100, validation: (r) => r.required() });
const slug = (quelle: string) =>
  defineField({ name: "slug", title: "Adresse (letzter Teil)", type: "slug", description: "Wird aus dem Titel erzeugt. Nach der Veröffentlichung nicht mehr ändern, sonst brechen bestehende Links.", options: { source: quelle, maxLength: 60 }, validation: (r) => r.required() });
const herkunftFeld = (titel = "Quellen") => defineField({ name: "herkunft", title: titel, type: "array", of: [defineArrayMember({ type: "herkunft" })], validation: (r) => r.required().min(1).error("Mindestens eine Quelle angeben.") });

// ── Studio und Kontakt ─────────────────────────────────────────────────────
export const einstellungen = defineType({
  name: "einstellungen",
  title: "Studio und Kontakt",
  type: "document",
  groups: [{ name: "studio", title: "Studio", default: true }, { name: "kontakt", title: "Kontakt und Links" }, { name: "zeiten", title: "Öffnungszeiten" }, { name: "bilder", title: "Logo und Vorschaubild" }, { name: "quellen", title: "Quellen" }],
  fields: [
    defineField({ name: "name", title: "Name des Studios", type: "string", group: "studio", validation: (r) => r.required() }),
    defineField({ name: "kurzname", title: "Kurzname", type: "string", group: "studio", validation: (r) => r.required() }),
    defineField({ name: "claim", title: "Leitzeile", type: "string", description: "Steht im Logo: «Nails, Lashes & Beauty Care».", group: "studio", validation: (r) => r.required().custom(schreibweise) }),
    defineField({ name: "rechtstraeger", title: "Rechtsträger (optional)", type: "string", description: "Firma oder Inhaberin/Inhaber mit Rechtsform, so wie es im Impressum stehen soll. Leer lassen, solange nicht bestätigt.", group: "studio" }),
    defineField({
      name: "adresse", title: "Adresse", type: "object", group: "kontakt",
      fields: [
        defineField({ name: "strasse", title: "Strasse und Nummer", type: "string", validation: (r) => r.required() }),
        defineField({ name: "plz", title: "Postleitzahl", type: "string", validation: (r) => r.required().regex(/^\d{4}$/, { name: "vierstellige Postleitzahl" }) }),
        defineField({ name: "ort", title: "Ort", type: "string", validation: (r) => r.required() }),
        defineField({ name: "land", title: "Land", type: "string", initialValue: "Schweiz", validation: (r) => r.required() }),
      ],
    }),
    defineField({ name: "telefon", title: "Telefon", type: "string", description: "Im internationalen Format: +41 44 557 50 67. Die Website zeigt daraus «044 557 50 67».", group: "kontakt", validation: (r) => r.required().regex(/^\+41 \d{2} \d{3} \d{2} \d{2}$/, { name: "Format +41 44 123 45 67" }) }),
    defineField({ name: "email", title: "E-Mail", type: "string", description: "An diese Adresse richtet das Kontaktformular die vorbereitete E-Mail.", group: "kontakt", validation: (r) => r.required().email() }),
    defineField({
      name: "buchung", title: "Online-Buchung", type: "object", group: "kontakt",
      description: "Die Website verlinkt die Buchungsseite. Preise und Leistungen dort müssen separat gepflegt werden; die Website gleicht nichts automatisch ab.",
      fields: [
        defineField({ name: "url", title: "Adresse der Buchungsseite", type: "url", validation: (r) => r.required().uri({ scheme: ["https"] }) }),
        defineField({ name: "anbieter", title: "Name des Buchungsdienstes", type: "string", validation: (r) => r.required() }),
        text("hinweis", "Hinweis zur externen Buchung", "Erscheint bei den Buchungsknöpfen, zum Beispiel «Die Terminbuchung öffnet sich bei Beauty Booking».", 2),
      ],
    }),
    defineField({ name: "karteUrl", title: "Link zur Route (Google Maps)", type: "url", description: "Öffnet sich in einem neuen Fenster. Es wird keine Karte eingebettet.", group: "kontakt", validation: (r) => r.required().uri({ scheme: ["https"] }) }),
    defineField({ name: "tourUrl", title: "Link zur 360°-Ansicht (optional)", type: "url", description: "Öffnet sich in einem neuen Fenster bei Google Maps.", group: "kontakt", validation: (r) => r.uri({ scheme: ["https"] }) }),
    defineField({ name: "social", title: "Social-Media-Profile", type: "array", of: [defineArrayMember({ type: "socialLink" })], group: "kontakt", description: "Nur bestätigte Profile des Studios. Darf leer sein.", initialValue: [] }),
    defineField({
      name: "oeffnungszeiten", title: "Reguläre Öffnungszeiten", type: "array", group: "zeiten",
      description: "Ein Eintrag je Wochentag. Leer lassen, solange die Zeiten nicht feststehen: Der Abschnitt erscheint dann nirgends.",
      of: [defineArrayMember({ type: "oeffnungszeit" })],
      validation: (r) => r.max(7).custom((liste) => { const tage = (liste ?? []).map((o) => (o as { tag?: string }).tag); return new Set(tage).size === tage.length ? true : "Jeder Wochentag nur einmal."; }),
    }),
    defineField({ name: "oeffnungszeitenHinweis", title: "Hinweis zu den Öffnungszeiten (optional)", type: "string", description: "Zum Beispiel «Termine nach Vereinbarung».", group: "zeiten", validation: (r) => r.custom(schreibweise) }),
    defineField({ name: "sonderzeiten", title: "Abweichende Zeiten (Feiertage, Ferien)", type: "array", of: [defineArrayMember({ type: "sonderzeit" })], group: "zeiten", description: "Erscheinen bis zum Enddatum auf der Website (beim nächsten Build). Darf leer sein.", initialValue: [] }),
    defineField({ name: "hinweis", title: "Zeitlich begrenzter Hinweis", type: "hinweis", group: "zeiten", description: "Zum Beispiel für Betriebsferien. Erscheint oben auf jeder Seite, nur zwischen den beiden Daten." }),
    defineField({ name: "logo", title: "Wortmarke (für hellen Grund)", type: "bildMitText", description: "PNG oder WebP mit transparentem Hintergrund, Schrift schwarz.", group: "bilder", validation: (r) => r.required() }),
    defineField({ name: "logoDunkel", title: "Wortmarke (für dunklen Grund)", type: "bildMitText", description: "Die weisse Fassung für dunkle Flächen (Negativ, Form unverändert).", group: "bilder", validation: (r) => r.required() }),
    defineField({ name: "signet", title: "Signet (das N)", type: "bildMitText", group: "bilder", validation: (r) => r.required() }),
    defineField({ name: "signetDunkel", title: "Signet (für dunklen Grund)", type: "bildMitText", description: "Die weisse Fassung des Signets.", group: "bilder", validation: (r) => r.required() }),
    defineField({ name: "seoBild", title: "Vorschaubild für geteilte Links", type: "bildMitText", description: "1200 × 630 Pixel. Erscheint, wenn die Website in WhatsApp, LinkedIn usw. geteilt wird.", group: "bilder", validation: (r) => r.required() }),
    { ...herkunftFeld("Quellen der Studioangaben"), group: "quellen" },
    { ...freigabeFeld, group: "quellen" },
  ],
  preview: { select: { title: "name", subtitle: "email", media: "logo" } },
});

// ── Kategorien und Leistungen ──────────────────────────────────────────────
export const kategorie = defineType({
  name: "kategorie",
  title: "Leistungsbereich",
  type: "document",
  groups: seoGruppe,
  fields: [
    defineField({ name: "titel", title: "Titel auf der Website", type: "string", group: "inhalt", validation: (r) => r.required().custom(schreibweise) }),
    { ...slug("titel"), group: "inhalt" },
    defineField({ name: "originalName", title: "Bezeichnung in der Buchungsplattform", type: "string", description: "Wörtlich, für den Abgleich.", group: "inhalt", validation: (r) => r.required() }),
    { ...text("kurz", "Ein Satz für Übersichten"), group: "inhalt" },
    { ...text("einleitung", "Einleitung auf der Bereichsseite", undefined, 3), group: "inhalt" },
    defineField({ name: "buchungUrl", title: "Buchungslink für diesen Bereich (optional)", type: "url", description: "Nur eintragen, wenn die Buchungsplattform einen stabilen Link direkt zu diesem Bereich bietet (muss mit der allgemeinen Buchungsadresse beginnen). Sonst gilt der allgemeine Buchungslink.", group: "inhalt", validation: (r) => r.uri({ scheme: ["https"] }) }),
    { ...herkunftFeld(), group: "inhalt" },
    { ...freigabeFeld, group: "inhalt" },
    { ...reihenfolge, group: "inhalt" },
    ...seoFelder,
  ],
  preview: { select: { title: "titel", subtitle: "originalName" } },
});

export const leistung = defineType({
  name: "leistung",
  title: "Leistung",
  type: "document",
  description: "Eine Leistung mit einer oder mehreren buchbaren Ausführungen (Preis und Dauer je Ausführung).",
  fields: [
    defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required().custom(schreibweise) }),
    slug("titel"),
    defineField({ name: "kategorie", title: "Bereich", type: "reference", to: [{ type: "kategorie" }], validation: (r) => r.required() }),
    defineField({ name: "titelEn", title: "Englische Bezeichnung (optional)", type: "string", description: "Wenn die Buchungsplattform eine nennt, zum Beispiel «New Set»." }),
    text("beschreibung", "Beschreibung", "Ein bis zwei verständliche Sätze. Keine Wirkversprechen, keine Marken, die nicht bestätigt sind.", 3),
    defineField({ name: "varianten", title: "Ausführungen (Preis und Dauer)", type: "array", of: [defineArrayMember({ type: "variante" })], validation: (r) => r.required().min(1).error("Mindestens eine Ausführung mit Preis und Dauer.") }),
    defineField({ name: "hinweise", title: "Hinweise (gelten für alle Ausführungen)", type: "array", of: [defineArrayMember({ type: "string", validation: (r) => r.custom(schreibweise) })], description: "Zum Beispiel «Bei Shellack CHF 20».", initialValue: [] }),
    herkunftFeld(),
    freigabeFeld,
    reihenfolge,
  ],
  preview: { select: { title: "titel", kategorie: "kategorie.titel", varianten: "varianten" }, prepare: ({ title, kategorie, varianten }) => ({ title, subtitle: `${kategorie ?? "ohne Bereich"} · ${(varianten as unknown[] | undefined)?.length ?? 0} Ausführung(en)` }) },
});

// ── Optionale Inhalte ──────────────────────────────────────────────────────
export const galerieBild = defineType({
  name: "galerieBild",
  title: "Galeriebild (echte Arbeit)",
  type: "document",
  description: "Nur eigene Fotos von echten Arbeiten, dem Studio oder dem Team, mit geklärten Rechten.",
  fields: [
    defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required().custom(schreibweise) }),
    defineField({ name: "bild", title: "Bild", type: "bildMitText", validation: (r) => r.required() }),
    defineField({ name: "leistung", title: "Gezeigte Leistung (optional)", type: "reference", to: [{ type: "leistung" }] }),
    herkunftFeld("Herkunft des Bildes (wer hat es wann freigegeben?)"),
    freigabeFeld,
    reihenfolge,
  ],
  preview: { select: { title: "titel", media: "bild", subtitle: "freigabe" } },
});

export const teamMitglied = defineType({
  name: "teamMitglied",
  title: "Teammitglied",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "rolle", title: "Rolle (optional)", type: "string", validation: (r) => r.custom(schreibweise) }),
    defineField({ name: "text", title: "Kurztext (optional)", type: "text", rows: 3, validation: (r) => r.custom(schreibweise) }),
    defineField({ name: "bild", title: "Foto (optional)", type: "bildMitText" }),
    herkunftFeld("Herkunft (Einverständnis der Person)"),
    freigabeFeld,
    reihenfolge,
  ],
  preview: { select: { title: "name", subtitle: "rolle", media: "bild" } },
});

export const frage = defineType({
  name: "frage",
  title: "Häufige Frage",
  type: "document",
  description: "Nur Fragen, deren Antwort das Studio bestätigt hat (zum Beispiel zu Stornierung oder Zahlung).",
  fields: [
    text("frage", "Frage"),
    text("antwort", "Antwort", undefined, 4),
    herkunftFeld(),
    freigabeFeld,
    reihenfolge,
  ],
  preview: { select: { title: "frage", subtitle: "freigabe" } },
});

// ── Navigation, Fusszeile und Formulartexte ────────────────────────────────
export const texte = defineType({
  name: "texte",
  title: "Navigation, Fusszeile und Formulartexte",
  type: "document",
  groups: [{ name: "navigation", title: "Navigation", default: true }, { name: "fuss", title: "Fusszeile" }, { name: "ui", title: "Kleine Texte" }, { name: "formular", title: "Kontaktformular" }, { name: "einwilligung", title: "Datenschutz-Einstellungen" }, { name: "seo", title: "Suchmaschinen" }],
  fields: [
    defineField({ name: "demoHinweis", title: "Hinweis «Entwurf»", type: "string", description: "Schmale Zeile über der Kopfzeile. Sie erscheint nur, solange die Website nicht für Suchmaschinen freigegeben ist.", group: "navigation" }),
    defineField({ name: "navigation", title: "Seiten in der Navigation", type: "array", of: [defineArrayMember({ type: "verweis" })], group: "navigation", validation: (r) => r.required().min(1).max(5) }),
    defineField({
      name: "kopf", title: "Kopfzeile", type: "object", group: "navigation",
      fields: [
        defineField({ name: "buchen", title: "Knopf «Termin buchen»", type: "verweis", description: "Der eine Aufruf der Website. Alle Buchungsknöpfe heissen gleich und führen zur Buchungsseite.", validation: (r) => r.required() }),
        text("anrufen", "Beschriftung «Anrufen»"), text("menueKnopf", "Knopf «Menü»"), text("menueTitel", "Titel des Menüs"), text("schliessen", "Knopf «Schliessen»"), text("telefonLabel", "Beschriftung des Telefon-Links (für Screenreader)"),
      ],
    }),
    defineField({ name: "leiste", title: "Mobile Kontaktleiste", type: "object", group: "navigation", fields: [text("buchen", "Knopf «Termin buchen»"), text("anrufen", "Knopf «Anrufen»")] }),
    defineField({
      name: "footer", title: "Fusszeile", type: "object", group: "fuss",
      fields: [
        text("leitsatz", "Leitsatz"), text("kontaktTitel", "Titel «Kontakt»"), text("zeitenTitel", "Titel «Öffnungszeiten»"), text("seitenTitel", "Titel «Seiten»"), text("rechtlichesTitel", "Titel «Rechtliches»"),
        defineField({ name: "rechtliches", title: "Rechtliche Seiten", type: "array", of: [defineArrayMember({ type: "verweis" })], validation: (r) => r.required().min(1) }),
        text("route", "Beschriftung des Routenlinks"), text("folgen", "Titel über den Social-Media-Links"),
        defineField({ name: "bildnachweis", title: "Link zum Bildnachweis", type: "verweis", validation: (r) => r.required() }),
        text("copyright", "Copyright-Inhaber"), text("demoHinweis", "Hinweis in der Fusszeile, solange die Website ein Entwurf ist", undefined, 2),
      ],
    }),
    defineField({
      name: "ui", title: "Kleine Texte", type: "object", group: "ui",
      fields: [
        text("zumInhalt", "Sprunglink"), text("symbolbild", "Kennzeichnung von Symbolbildern"), text("telefon", "«Telefon»"), text("email", "«E-Mail»"), text("adresse", "«Adresse»"),
        text("buchungExtern", "Hinweis für Screenreader bei Buchungsknöpfen"), text("tour", "Link «360°-Ansicht»"), text("karte", "Link «Route»"),
        text("minuten", "Kurzform «Min.»"), text("ab", "«ab» (vor Mindestpreisen)"), text("preisAbweichung", "Erklärung «Preis kann abweichen»", undefined, 2), text("preisAbweichungKurz", "Kurzform «je nach Aufwand»"),
        text("dauer", "«Dauer»"), text("preis", "«Preis»"), text("variante", "«Ausführung»"), text("alleLeistungen", "Link «Alle Leistungen und Preise»"), text("zurUebersicht", "Link zurück zur Übersicht"),
        text("weitereKategorien", "Titel «Weitere Bereiche»"), text("leistungenZaehler", "«Positionen» (Zähler)"), text("quellen", "«Quelle»"), text("standQuelle", "Standhinweis unter der Preisliste", undefined, 2),
        text("heute", "«Heute»"), text("geschlossen", "«geschlossen»"), text("geoeffnet", "«geöffnet»"), text("uhr", "«Uhr»"), text("sonderzeitenTitel", "Titel «Abweichende Zeiten»"),
        text("nichtGefundenTitel", "Fehlerseite: Titel"), text("nichtGefundenText", "Fehlerseite: Text", undefined, 2),
        defineField({ name: "nichtGefundenLink", title: "Fehlerseite: Link", type: "verweis", validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: "formular", title: "Kontaktformular", type: "object", group: "formular",
      description: "Das Formular versendet nichts. Es bereitet eine E-Mail im E-Mail-Programm der Besucherin oder des Besuchers vor. Die Texte müssen das ehrlich sagen. Es ist keine Terminbuchung.",
      fields: [
        text("titel", "Titel"), text("einleitung", "Einleitung", "Muss erklären, dass sich das E-Mail-Programm öffnet, die Website nichts sendet und Termine online gebucht werden.", 3),
        text("name", "Feld «Name»"), text("email", "Feld «E-Mail»"), text("betreff", "Feld «Betreff»"),
        defineField({ name: "betreffOptionen", title: "Auswahl «Betreff»", type: "array", of: [defineArrayMember({ type: "object", name: "betreffOption", fields: [defineField({ name: "wert", title: "Kennung (klein, ohne Leerzeichen)", type: "string", validation: (r) => r.required().regex(/^[a-z0-9-]+$/, { name: "Kleinbuchstaben, Ziffern, Bindestrich" }) }), defineField({ name: "titel", title: "Beschriftung", type: "string", validation: (r) => r.required() })], preview: { select: { title: "titel", subtitle: "wert" } } })], validation: (r) => r.required().min(1) }),
        text("nachricht", "Feld «Nachricht»"), text("nachrichtHilfe", "Hilfetext unter der Nachricht"), text("pflicht", "Hinweis auf Pflichtfelder"), text("datenschutzHinweis", "Hinweis vor dem Link zur Datenschutzerklärung"),
        defineField({ name: "datenschutzLink", title: "Link zur Datenschutzerklärung", type: "verweis", validation: (r) => r.required() }),
        text("absenden", "Knopf", "Ehrlich beschriften, zum Beispiel «E-Mail vorbereiten». Nicht «Senden»."), text("hinweisNachher", "Hinweis nach dem Klick", "Keine Versandbestätigung: Die Website weiss nicht, ob die E-Mail gesendet wurde.", 3),
        text("kopieren", "Knopf «Nachricht kopieren»"), text("kopiert", "Meldung nach dem Kopieren"), text("kopierenFehler", "Meldung, wenn das Kopieren nicht geht", undefined, 2),
        text("zuLangFehler", "Meldung bei sehr langer Nachricht ohne Zwischenablage", undefined, 3), text("volltextLabel", "Beschriftung der Nachricht zum Kopieren"), text("betreffPraefix", "Betreff der E-Mail (Anfang)"),
        text("fehlerName", "Fehlermeldung Name"), text("fehlerEmail", "Fehlermeldung E-Mail"), text("fehlerNachricht", "Fehlermeldung Nachricht"), text("ohneJavascript", "Text ohne JavaScript"), text("keinTermin", "Hinweis «keine Terminbuchung»", undefined, 2),
      ],
    }),
    defineField({
      name: "einwilligung", title: "Datenschutz-Einstellungen", type: "object", group: "einwilligung",
      description: "Solange keine Kategorie eingetragen ist, erscheint kein Banner. Eine Kategorie nur eintragen, wenn die Website tatsächlich einen einwilligungspflichtigen Dienst einbindet (das braucht eine Entwicklerin oder einen Entwickler).",
      fields: [
        text("fussLink", "Link in der Fusszeile"), text("ruhendTitel", "Titel, wenn nichts einzustellen ist"), text("ruhendText", "Text, wenn nichts einzustellen ist", undefined, 3),
        text("bannerTitel", "Banner: Titel"), text("bannerText", "Banner: Text", undefined, 3), text("alleAkzeptieren", "Knopf «Alle akzeptieren»"), text("nurNotwendige", "Knopf «Nur notwendige»"), text("einstellungen", "Knopf «Einstellungen»"),
        text("auswahlSpeichern", "Knopf «Auswahl speichern»"), text("widerrufen", "Knopf «Einwilligung widerrufen»"), text("notwendigTitel", "Kategorie «Notwendig»: Titel"), text("notwendigText", "Kategorie «Notwendig»: Text"), text("datenschutzerklaerung", "Link «Datenschutzerklärung»"),
        defineField({ name: "kategorien", title: "Optionale Kategorien", type: "array", of: [defineArrayMember({ type: "object", name: "einwilligungKategorie", fields: [defineField({ name: "kennung", title: "Kennung (Kleinbuchstaben)", type: "string", validation: (r) => r.required().regex(/^[a-z]+$/, { name: "nur Kleinbuchstaben" }) }), defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }), defineField({ name: "beschreibung", title: "Beschreibung", type: "text", rows: 2, validation: (r) => r.required() })], preview: { select: { title: "titel", subtitle: "kennung" } } })] }),
      ],
    }),
    defineField({ name: "seo", title: "Suchmaschinen (Standard)", type: "object", group: "seo", fields: [text("titelZusatz", "Zusatz im Seitentitel", "Wird an jeden Seitentitel angehängt, zum Beispiel «New York Nails Schlieren»."), text("beschreibung", "Standardbeschreibung", "Gilt für Seiten ohne eigene Beschreibung.", 3)] }),
  ],
  preview: { prepare: () => ({ title: "Navigation, Fusszeile und Formulartexte" }) },
});

// ── Seiten ─────────────────────────────────────────────────────────────────
const abschnittText = (name: string, title: string, mitLink = false) =>
  defineField({ name, title, type: "object", group: "inhalt", fields: [text("titel", "Titel"), text("text", "Text", undefined, 3), ...(mitLink ? [defineField({ name: "link", title: "Link", type: "verweis", validation: (r) => r.required() })] : [])] });
const belegeFeld = defineField({ name: "belege", title: "Belege für die Texte dieser Seite", type: "belege", group: "inhalt", validation: (r) => r.required() });

export const startseite = defineType({
  name: "startseite",
  title: "Startseite",
  type: "document",
  groups: seoGruppe,
  fields: [
    defineField({
      name: "hero", title: "Einstieg", type: "object", group: "inhalt",
      fields: [
        text("ueberzeile", "Überzeile", "Zum Beispiel die Adresse. Kurz."),
        text("titel", "Titel", "Höchstens zwei Zeilen."),
        text("text", "Text", "Höchstens 20 Wörter.", 2),
        defineField({ name: "knopf", title: "Knopf (Termin buchen)", type: "verweis", validation: (r) => r.required() }),
        defineField({ name: "zweiterKnopf", title: "Zweiter Knopf", type: "verweis", validation: (r) => r.required() }),
      ],
    }),
    abschnittText("leistungen", "Abschnitt «Bereiche»", true),
    abschnittText("preise", "Abschnitt «Preise»", true),
    abschnittText("studio", "Abschnitt «Studio»", true),
    abschnittText("zeiten", "Abschnitt «Öffnungszeiten»"),
    abschnittText("buchung", "Abschnitt «Termin buchen»"),
    abschnittText("kontakt", "Abschnitt «Kontakt»"),
    belegeFeld,
    ...seoFelder,
  ],
  preview: { prepare: () => ({ title: "Startseite" }) },
});

export const leistungenSeite = defineType({
  name: "leistungenSeite",
  title: "Leistungen und Preise",
  type: "document",
  groups: seoGruppe,
  fields: [
    { ...text("titel", "Titel"), group: "inhalt" },
    { ...text("einleitung", "Einleitung", undefined, 3), group: "inhalt" },
    { ...text("preisHinweisTitel", "Titel des Preishinweises"), group: "inhalt" },
    { ...text("preisHinweis", "Preishinweis", "Erklärt «ab» und «je nach Aufwand». Keine Preise hier eintragen.", 4), group: "inhalt" },
    { ...text("buchungTitel", "Titel «Online buchen»"), group: "inhalt" },
    { ...text("buchungText", "Text «Online buchen»", undefined, 3), group: "inhalt" },
    belegeFeld,
    ...seoFelder,
  ],
  preview: { prepare: () => ({ title: "Leistungen und Preise" }) },
});

export const studioSeite = defineType({
  name: "studioSeite",
  title: "Studio",
  type: "document",
  groups: seoGruppe,
  fields: [
    { ...text("titel", "Titel"), group: "inhalt" },
    { ...text("einleitung", "Einleitung", undefined, 3), group: "inhalt" },
    defineField({ name: "abschnitte", title: "Abschnitte", type: "array", of: [defineArrayMember({ type: "abschnittMitLink" })], group: "inhalt", validation: (r) => r.required().min(1) }),
    { ...text("tourTitel", "Titel «360°-Ansicht»"), group: "inhalt" },
    { ...text("tourText", "Text «360°-Ansicht»", undefined, 2), group: "inhalt" },
    { ...text("galerieTitel", "Titel «Galerie»"), group: "inhalt" },
    { ...text("galerieText", "Text, solange keine Galeriebilder freigegeben sind", undefined, 2), group: "inhalt" },
    { ...text("teamTitel", "Titel «Team»"), group: "inhalt" },
    { ...text("fragenTitel", "Titel «Gut zu wissen»"), group: "inhalt" },
    belegeFeld,
    ...seoFelder,
  ],
  preview: { prepare: () => ({ title: "Studio" }) },
});

export const kontaktSeite = defineType({
  name: "kontaktSeite",
  title: "Kontakt und Anfahrt",
  type: "document",
  groups: seoGruppe,
  fields: [
    { ...text("titel", "Titel"), group: "inhalt" },
    { ...text("einleitung", "Einleitung", undefined, 2), group: "inhalt" },
    { ...text("buchungTitel", "Titel «Termin buchen»"), group: "inhalt" },
    { ...text("buchungText", "Text «Termin buchen»", undefined, 2), group: "inhalt" },
    { ...text("direktTitel", "Titel «Direkt erreichen»"), group: "inhalt" },
    { ...text("anfahrtTitel", "Titel «Anfahrt»"), group: "inhalt" },
    { ...text("anfahrtText", "Text «Anfahrt»", undefined, 3), group: "inhalt" },
    { ...text("zeitenTitel", "Titel «Öffnungszeiten»"), group: "inhalt" },
    belegeFeld,
    ...seoFelder,
  ],
  preview: { prepare: () => ({ title: "Kontakt und Anfahrt" }) },
});

export const rechtSeite = defineType({
  name: "rechtSeite",
  title: "Rechtsseite",
  type: "document",
  groups: seoGruppe,
  fields: [
    defineField({ name: "slug", title: "Kennung", type: "slug", group: "inhalt", options: { source: "titel" }, validation: (r) => r.required().custom((s) => (s?.current === "impressum" || s?.current === "datenschutz" ? true : "Erlaubt sind «impressum» und «datenschutz».")) }),
    { ...text("titel", "Titel"), group: "inhalt" },
    defineField({ name: "einleitung", title: "Einleitung (optional)", type: "text", rows: 3, group: "inhalt", validation: (r) => r.custom(schreibweise) }),
    { ...text("stand", "Stand", "Zum Beispiel «16. Oktober 2026»"), group: "inhalt" },
    defineField({
      name: "inhalt", title: "Inhalt", type: "array", group: "inhalt",
      of: [defineArrayMember({ type: "block", styles: [{ title: "Absatz", value: "normal" }, { title: "Zwischentitel", value: "h2" }, { title: "Untertitel", value: "h3" }], lists: [{ title: "Aufzählung", value: "bullet" }], marks: { decorators: [{ title: "Fett", value: "strong" }], annotations: [{ name: "link", type: "object", title: "Link", fields: [defineField({ name: "href", title: "Ziel", type: "string", validation: (r) => r.required() })] }] } })],
      validation: (r) => r.required().min(1),
    }),
    ...seoFelder,
  ],
  preview: { select: { title: "titel", subtitle: "stand" } },
});
