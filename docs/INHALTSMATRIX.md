# Inhaltsmatrix und Quellenübersicht

Stand: 16. Oktober 2026. Jede Angabe aus dem Auftrag wurde erneut geprüft. Legende zum Status:
**übernommen** = auf der Website · **intern** = nur in der Übergabe als Frage an das Studio · **verworfen** = nicht verwendbar.

## 1. Quellenprüfung

| Frage aus dem Auftrag | Ergebnis |
| --- | --- |
| Ist die Website erreichbar und zuzuordnen? | Ja. `newyorknails-schlieren.ch` ist eine einzelne Seite (Tailwind-CDN, Google-Ads-Tag `AW-18156373268`, Google-Maps-Iframe). Inhalt: Jubiläumsbanner als Bild, «Welcome / Willkommen», eine Leitzeile DE/EN, zwei Knöpfe (Buchung, 360°-Ansicht), Kartenabschnitt, Fusszeile mit Adresse, Telefon, E-Mail, Instagram, Facebook. Kein Impressum, keine Datenschutzerklärung, keine Preise, keine Öffnungszeiten, keine Unterseiten (alle Probeadressen 404). |
| Welche Leistungen sind bestätigt? | Die Buchungsseite bei Beauty Booking (Beprobooking) führt **4 Bereiche mit 31 buchbaren Positionen**, je mit Preis und Dauer. Zusätzlich 3 Positionen, die für die Buchung deaktiviert sind (siehe Abschnitt 4). Quelle doppelt geprüft: sichtbare Seite im Browser und die öffentliche Schnittstelle der Plattform (`api-v1.beprobooking.com/v1/business-object/url-name/new-york-nails-schlieren`). Beide stimmen überein. |
| Aktuelle Öffnungszeiten? | Buchungsseite: Mo bis Fr 09:30 bis 20:00, Sa 09:30 bis 17:45, So geschlossen. **Widerspruch:** Das Instagram-Profil nennt «Mo–Fr: 9:30–19:45, Sa: 9:30–17:45». Übernommen wurden die Zeiten der Buchungsseite (Entscheid von Nick, 16.10.2026); der Widerspruch steht als Frage in `docs/UEBERGABE.md`. Das Google-Maps-Profil konnte in dieser Sitzung nicht abgerufen werden (Werkzeug gesperrt, kein Anhang). |
| Varianten und Zusatzleistungen? | In der Buchungsplattform als eigene Positionen geführt («NeuSet» dreimal mit unterschiedlicher Beschreibung usw.). Auf der Website als Leistung mit Ausführungen zusammengefasst; jede Ausführung trägt die wörtliche Originalbezeichnung und -beschreibung (`originalName`, `originalBeschreibung` in `data/leistungen.json`). |
| Zahlungsmethoden? | Nirgends öffentlich belegt. Nicht auf der Website; Frage an das Studio. |
| Terminänderung und Stornierung? | Nirgends öffentlich belegt (die Bedingungen der Buchungsplattform erscheinen erst im Buchungsablauf, der nicht gestartet wurde). Nicht auf der Website; Frage an das Studio. |
| Social-Media-Profile? | Instagram `newyorknails.schlieren` existiert (283 Beiträge, Kategorie «Nagelstudio», verlinkt die Website). Facebook `newyorknails.schlieren` ist auf der Website verlinkt, war aber ohne Anmeldung nicht prüfbar (Fehlerseite). Beide nur als Links übernommen. |
| Rechtliche Betreiberangaben? | Keine. Zefix (Suche «New York Nails», alle Einträge) führt keine Firma mit Sitz Schlieren; Moneyhouse ebenso nicht. Rechtsform, Inhaberschaft und UID sind unbekannt und werden nicht erfunden; das Impressum sagt das ausdrücklich. |
| Verwechslungsgefahr? | Hoch: Zefix listet 28 Einträge «New York Nails» (Zürich, Winterthur, Uster, Spreitenbach, Dietikon usw.). Keiner gehört zum Studio in Schlieren. Von keinem wurde etwas übernommen. |

## 2. Quellen und ihre Verwendung

| Nr. | Quelle | Art | Verwendet für |
| --- | --- | --- | --- |
| Q1 | [newyorknails-schlieren.ch](https://newyorknails-schlieren.ch/) | eigene Website | Name, Adresse, Telefon, E-Mail, Leitzeile, Links (Buchung, 360°, Maps, Instagram, Facebook) |
| Q2 | [Jubiläumsbanner](https://newyorknails-schlieren.ch/img/10JahreNYN.jpeg) (einziges Bild der Website) | eigene Website | Wortmarke (Ausschnitt fürs Vorschaubild), Farbwelt (Schwarz, Gold), Aussage «10 Jahre Jubiläum» (Mai 2026) |
| Q3 | [Buchungsseite bei Beauty Booking](https://beprobooking.com/salon/new-york-nails-schlieren) | Buchungsplattform | alle Leistungen, Preise, Dauern, Öffnungszeiten, Telefon, virtuelle Ansicht, Logos; Fusszeile «Angetrieben von Lumxi GmbH» (Betreiberin der Plattform, nur in den Rechtstexten genannt) |
| Q4 | Öffentliche Schnittstelle der Buchungsplattform (`api-v1.beprobooking.com/v1/business-object/url-name/new-york-nails-schlieren`) | Buchungsplattform | Gegenprobe aller Positionen, deaktivierte Positionen, Koordinaten, Place-ID |
| Q5 | [Instagram-Profil](https://www.instagram.com/newyorknails.schlieren/) | eigenes Profil | Kategorie «Nagelstudio», Leistungsliste der Bio, abweichende Öffnungszeiten (nur intern), «24/24 Online» |
| Q6 | [360°-Ansicht in Google Maps](https://www.google.ch/maps/@47.3981719,8.4475567,3a,75y,358.15h,90.86t/data=!3m6!1e1!3m4!1sAF1QipOl9Z2rVcm9zTyXakgqsTpI8Lx-meSfaFkL_yz7!2e10!7i8000!8i4000) (Ziel des goo.gl-Links der Website) | eigenes Profil | nur als externer Link |
| Q7 | Google-Maps-Eintrag (Place-ID `ChIJoyoFHnQMkEcRo-3D0oGx4I4`) | Verzeichnis | nur als Routenlink; Inhalte nicht abrufbar |
| Q8 | [Zefix](https://www.zefix.ch/) (Suche «New York Nails»), Moneyhouse | amtlich / Verzeichnis | Negativbefund: kein Rechtsträger in Schlieren |

## 3. Inhaltsmatrix

| Inhalt | Quelle | Verifikation | Zielseite | Status | Offene Fragen |
| --- | --- | --- | --- | --- | --- |
| Name «New York Nails Schlieren» | Q1, Q3 | zweifach | alle | übernommen | – |
| Leitzeile «Nails, Lashes & Beauty Care» | Q2, Q3 (Logo) | zweifach | Start, Fusszeile | übernommen | – |
| «Professional nail care and premium beauty services in Schlieren» / «Professionelle Nagelpflege und hochwertige Schönheitsdienstleistungen in Schlieren» | Q1 | einfach | Start (Einstiegstext, umformuliert ohne Werbesuperlativ) | übernommen (sinngemäss) | – |
| Adresse Ringstrasse 1, 8952 Schlieren | Q1, Q3, Q5 | dreifach («Ringstr. 1» / «Ringstraße 1» / «Ringstrasse 1») | alle | übernommen | – |
| Telefon 044 557 50 67 | Q1, Q3, Q4 | dreifach | alle | übernommen | – |
| E-Mail info@newyorknails-schlieren.ch | Q1 | einfach | Kontakt, Fusszeile, Formular | übernommen | Ist das die Adresse für Anfragen? |
| Buchungslink beprobooking.com/salon/new-york-nails-schlieren | Q1, Q3 | zweifach | alle Buchungsknöpfe | übernommen | Direktlinks zu Behandlungen gibt es nicht (Angular-App ohne stabile Deep-Links); deshalb nur der Salonlink |
| 360°-Ansicht (goo.gl/maps → Google-Photosphere) | Q1, Q3 | zweifach | Start, Studio, Kontakt (Links) | übernommen als Link | – |
| Google-Maps-Iframe der alten Website | Q1 | – | – | verworfen (Einbettung ohne Einwilligung); ersetzt durch Routenlink | – |
| Google-Ads-Tag `AW-18156373268` | Q1 | – | – | verworfen (Tracker ohne Einwilligung; Demo hat keinen) | Will das Studio Conversion-Messung? Dann Consent nötig |
| Instagram, Facebook | Q1, Q5 | Instagram geprüft, Facebook nicht prüfbar | Fusszeile, Studio | übernommen als Links | Facebook-Seite noch aktiv? |
| Öffnungszeiten Mo–Fr 09:30–20:00, Sa 09:30–17:45, So geschlossen | Q3 | Buchungsseite; Instagram weicht ab (Fr bis 19:45) | Start, Kontakt, Fusszeile | übernommen | Welche Zeiten stimmen? |
| «24/24 Online» (Buchung rund um die Uhr) | Q5 | einfach | Start («Tag und Nacht») | übernommen | – |
| 4 Bereiche, 31 Positionen mit Preis und Dauer | Q3, Q4 | zweifach | Leistungen, 4 Bereichsseiten, Start (Spannen) | übernommen 1:1 | siehe Abschnitt 4 |
| «Preisabweichung je Bedarf» (17 Positionen) | Q3, Q4 | zweifach | Preisliste («je nach Aufwand») | übernommen | Was heisst «Bedarf» konkret (Länge, Design)? |
| «Preis Ab» (Korrektur), «ab» (WP Auffüllen Classic) | Q3, Q4 | zweifach | Preisliste («ab CHF») | übernommen | – |
| «Bei Schellack chf 20» (Entfernen) | Q3, Q4 | zweifach | Preisliste (Hinweis) | übernommen | Dauer der Shellack-Entfernung? |
| Kategorietext «Nagedesign, Wimpernverlängerung, Waxing» unter NAILS & MORE | Q3 | – | – | verworfen (Tippfehler, beschreibt alle Bereiche) | – |
| Bewertung 4.4 (732) auf der Buchungsseite | Q3 | – | – | verworfen (fremde, laufend wechselnde Kennzahl; keine Bewertungen auf der Website) | – |
| «10 Jahre Jubiläum», «Ein Jahrzehnt Schönheit & Vertrauen» (Mai 2026) | Q2 | einfach (eigene Aussage) | Studio («Zehn Jahre in Schlieren») | übernommen mit Quelle | Gründungsjahr bestätigen |
| Aktionen des Banners (CHF 10 Sofortrabatt, 10 % mit Freundin, Wheel of Fortune, Gewinne, 20.–23. Mai 2026) | Q2 | abgelaufen | – | verworfen | Künftige Aktionen nur mit Enddatum (`hinweis` in den Einstellungen) |
| WLAN «New York Nails-guest» | Q4 | – | – | verworfen (unnötig) | – |
| Logo: Wortmarke (schwarz), Signet «N» | Q3 (Bilder der Buchungsseite) | Download am 16.10.2026 von Nick freigegeben | Kopfzeile, Fusszeile, Start, Studio, 404 | übernommen, Nutzungsfreigabe offen | Freigabe und Vektordatei |
| Fotos (Instagram, Google Maps) | Q5, Q7 | – | – | verworfen (Rechte ungeklärt) | Fotos vom Studio, siehe `docs/BILDER.md` |
| Team | – | nicht belegt | – | nicht vorhanden (Modell vorbereitet) | Namen, Rollen, Fotos, Einverständnis |
| Häufige Fragen (Storno, Zahlung, Hygiene) | – | nicht belegt | – | nicht vorhanden (Modell vorbereitet) | Regeln liefern |
| Englische Fassung | Q1 (acht englische Begriffe) | – | – | nicht gebaut (siehe `docs/ENTSCHEIDUNGEN.md`) | Wird Englisch gewünscht? |
| Impressum, Datenschutzerklärung | – | neu für die Demo | Impressum, Datenschutz | neu geschrieben | Betreiberangaben des Studios |

## 4. Leistungen im Detail (Abgleich mit der Buchungsplattform, 16. Oktober 2026)

Website und Buchungssystem sind **getrennte Datenquellen**. Diese Tabelle ist der Abgleich zum Stand des Abrufs; eine Preisänderung auf der einen Seite erscheint nicht automatisch auf der anderen.

| Bereich (Original) | Position in der Plattform (wörtlich) | Beschreibung (wörtlich) | CHF | Min. | Auf der Website |
| --- | --- | --- | --- | --- | --- |
| NAILS & MORE | NeuSet ( New Set) | Verlängerung /Farbe/ Glitzer/ French preisabweichung je Bedarf | 85 | 60 | Neues Set: Verlängerung mit Farbe, Glitzer oder French |
| NAILS & MORE | NeuSet ( New Set) | Ombre/Babyboom preisabweichung je Bedarf | 95 | 60 | Neues Set: Ombre oder Babyboomer |
| NAILS & MORE | Neuset Natur | Inkl. Verlängerung -preisabweichung je Bedarf | 80 | 60 | Neues Set: Natur, inklusive Verlängerung |
| NAILS & MORE | Auffüllen (Refill) | Farbe -preisabweichung je Bedarf | 75 | 60 | Auffüllen: Mit Farbe |
| NAILS & MORE | Auffüllen (Refill) | French / Glitzer -preisabweichung je Bedarf | 80 | 60 | Auffüllen: French oder Glitzer |
| NAILS & MORE | Auffüllen (Refill) | Ombre / Babyboom -preisabweichung je Bedarf | 85 | 60 | Auffüllen: Ombre oder Babyboomer |
| NAILS & MORE | Auffüllen Natur | keine Verlängerung- preisabweichung je Bedarf | 70 | 60 | Auffüllen: Natur, ohne Verlängerung |
| NAILS & MORE | Maniküre ( classic manicure) | Handpflege Mann /Frau | 35 | 30 | Maniküre |
| NAILS & MORE | Shellack ( Gel Color) | Fingernagel oder Fusszehen -preisabweichung je Bedarf | 45 | 30 | Shellack: Fingernägel oder Fusszehen |
| NAILS & MORE | Shellack | French/Glitzer- preisabweichung je Bedarf | 50 | 60 | Shellack: French oder Glitzer |
| NAILS & MORE | Pediküre mit Farbe | Complete- preisabweichung je Bedarf | 85 | 60 | Pediküre: Mit Farbe (Complete) |
| NAILS & MORE | Pediküre␣␣( Classic Pedicure) (zwei Leerzeichen im Original) | Fusspflege Mann/Frau | 55 | 30 | Pediküre: Klassische Pediküre |
| NAILS & MORE | Pediküre mit Normal Lack | Ohne Gel-Farbe -preisabweichung je Bedarf | 75 | 75 | Pediküre: Mit Normallack, ohne Gelfarbe |
| NAILS & MORE | Zehnagel-Modellage | – | 90 | 60 | Zehennagel-Modellage |
| NAILS & MORE | Entfernen ( Remove ) | Bei Schellack chf 20 | 30 | 15 | Entfernen (Hinweis «Bei Shellack CHF 20») |
| NAILS & MORE | Fingernagel Korrektur (Correction) | Preis Ab | 10 | 15 | Fingernagel-Korrektur («ab CHF 10») |
| NAILS & MORE | Extra-Lang 1 (Overlong) | – | 10 | 15 | **nicht übernommen** (für Buchung deaktiviert) |
| NAILS & MORE | Extras lang 2 (Overlong) | – | 20 | 30 | **nicht übernommen** (für Buchung deaktiviert) |
| NAILS & MORE | Extra Design 2 | Freehand | 5 | 10 | **nicht übernommen** (für Buchung deaktiviert) |
| WIMPERNVERLÄNGERUNG (EYELASHES Extensions) | WIMPERN CLASSIC | – | 99 | 75 | Wimpernverlängerung: Classic |
| WIMPERNVERLÄNGERUNG | WIMPERN MASCARA | – | 120 | 75 | Wimpernverlängerung: Mascara |
| WIMPERNVERLÄNGERUNG | WIMPERN VOLUMEN | 3d- preisabweichung je Bedarf | 150 | 90 | Wimpernverlängerung: Volumen (3D) |
| WIMPERNVERLÄNGERUNG | WIMPERN EXTRA VOLUMEN | – | 180 | 120 | Wimpernverlängerung: Extra Volumen |
| WIMPERNVERLÄNGERUNG | WP Auffüllen Classic ab | preisabweichung je Bedarf | 70 | 60 | Wimpern auffüllen: Classic («ab CHF 70») |
| WIMPERNVERLÄNGERUNG | WP Auffüllen Volumen | preisabweichung je Bedarf | 80 | 75 | Wimpern auffüllen: Volumen |
| WIMPERNVERLÄNGERUNG | Wimpern-Lifting | preisabweichung je Bedarf | 85 | 60 | Wimpern-Lifting |
| WIMPERNVERLÄNGERUNG | Wimpern Entfernen | Remove | 30 | 25 | Wimpern entfernen |
| WAXING | Augenbraun | – | 20 | 10 | Augenbrauen |
| WAXING | Bikini | – | 80 | 60 | Bikinizone |
| WAXING | Beine␣␣(komplett ) (zwei Leerzeichen im Original) | preisabweichung je Bedarf | 90 | 60 | Beine komplett |
| WAXING | Achse | preisabweichung je Bedarf | 30 | 60 | Achseln (Dauer 60 Minuten wie in der Quelle; wirkt wie ein Platzhalter, bitte prüfen) |
| Massage | Kopf Massage | – | 55 | 30 | Kopfmassage: 30 Minuten |
| Massage | Kopf Massage | – | 85 | 60 | Kopfmassage: 60 Minuten |
| Massage | Gesicht Massage und Maske | – | 20 | 15 | Gesichtsmassage mit Maske |

Sprachliche Anpassungen ohne Faktenänderung: «Augenbraun» → «Augenbrauen», «Achse» → «Achseln», «Zehnagel» → «Zehennagel», «Babyboom» → «Babyboomer», «Normal Lack» → «Normallack», «Shellack» bleibt in der Schreibweise des Studios (kein Markenname unterstellt). Die englischen Bezeichnungen der Quelle (New Set, Refill, Classic Manicure, Gel Color, Classic Pedicure, Remove, Correction, Eyelash Extensions, Lash Lift) stehen als `titelEn` neben dem Titel.
