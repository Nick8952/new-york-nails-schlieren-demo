import { abschnitt, abschnittMitLink, belege, bildMitText, herkunft, hinweis, oeffnungszeit, preis, socialLink, sonderzeit, variante, verweis } from "./objekte";
import { einstellungen, frage, galerieBild, kategorie, kontaktSeite, leistung, leistungenSeite, rechtSeite, startseite, studioSeite, teamMitglied, texte } from "./dokumente";

/** Dokumente, die es genau einmal gibt (feste Kennung, kein «Neu anlegen», kein Löschen). */
export const EINZELDOKUMENTE = ["einstellungen", "texte", "startseite", "leistungenSeite", "studioSeite", "kontaktSeite", "rechtSeite"];

export const schemaTypes = [
  // Objekte
  verweis, bildMitText, herkunft, belege, preis, variante, abschnitt, abschnittMitLink, oeffnungszeit, sonderzeit, hinweis, socialLink,
  // Dokumente
  einstellungen, texte, startseite, leistungenSeite, studioSeite, kontaktSeite, rechtSeite, kategorie, leistung, galerieBild, teamMitglied, frage,
];
