// Funktionsprüfungen im echten Browser (puppeteer-core). Vorschau-Server nötig: npm run vorschau:pages
// Geprüft wird, was ein Mensch bedienen würde: Erstbesuch ohne Dienste Dritter, Tastatur, Menü (Dialog), mobile Leiste,
// Preisliste (jede Position mit Preis und Dauer, kein horizontales Scrollen), Buchungslinks (immer die bestätigte Buchungsseite,
// neues Fenster, nie ein Widget), Öffnungszeiten, mailto-Formular (ohne je etwas zu versenden), Fehlerseite, Direktaufrufe,
// reduzierte Bewegung, dunkles Farbschema.
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { BASE, alleSeiten, browserStarten, externeAnfragen, warten } from "./chrome.mjs";
const ergebnisse = [];
const ok = (name, bedingung, detail = "") => { ergebnisse.push({ name, ok: !!bedingung, detail }); console.log(`${bedingung ? "✓" : "✗"} ${name}${detail ? " · " + detail : ""}`); };
const browser = await browserStarten();
const einstellungen = JSON.parse(readFileSync("data/einstellungen.json", "utf8"));
const leistungen = JSON.parse(readFileSync("data/leistungen.json", "utf8"));
const kategorien = JSON.parse(readFileSync("data/kategorien.json", "utf8"));
const BUCHUNG = einstellungen.buchung.url;
const EMAIL = einstellungen.email;
async function frisch({ breite = 1440, hoehe = 900, reduziert = false, dunkel = false } = {}) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: breite, height: hoehe });
  const medien = [];
  if (reduziert) medien.push({ name: "prefers-reduced-motion", value: "reduce" });
  if (dunkel) medien.push({ name: "prefers-color-scheme", value: "dark" });
  if (medien.length) await page.emulateMediaFeatures(medien);
  return { ctx, page, extern: externeAnfragen(page) };
}

// 1) Erstbesuch: nichts von Dritten, kein Banner, kein Speicher, Demo-Kennzeichnung
{
  const { ctx, page, extern } = await frisch();
  await page.goto(BASE + "/", { waitUntil: "networkidle0" }); await warten(400);
  ok("Erstbesuch: keine Anfragen an fremde Hosts", extern.length === 0, extern.join(","));
  ok("Erstbesuch: kein Einwilligungsbanner (keine einwilligungspflichtigen Dienste)", (await page.$('[role="region"][aria-label="Datenschutz-Einstellungen"]')) === null);
  ok("Erstbesuch: kein Speicher, keine Cookies", (await page.evaluate(() => Object.keys(localStorage).length + Object.keys(sessionStorage).length)) === 0 && (await page.evaluate(() => document.cookie)) === "");
  ok("Demo: Entwurfshinweis sichtbar", await page.evaluate(() => document.body.textContent.includes("nicht die offizielle Website")));
  ok("Demo: noindex auf der Startseite", await page.evaluate(() => document.querySelector("meta[name=robots]")?.content.includes("noindex")));
  ok("Demo: kein JSON-LD (erst mit INDEXIERUNG=1 auf der Kundendomain)", (await page.$('script[type="application/ld+json"]')) === null);
  ok("Keine Iframes, keine eingebetteten Karten oder Widgets", (await page.$$("iframe")).length === 0);
  const robots = await (await page.goto(BASE + "/robots.txt")).text();
  ok("Demo: robots.txt sperrt nicht (noindex bleibt lesbar), nennt keine Sitemap", !/Disallow:\s*\/\s*$/m.test(robots) && !/Sitemap:/.test(robots), robots.replaceAll("\n", " "));
  ok("Demo: keine sitemap.xml", (await page.goto(BASE + "/sitemap.xml")).status() === 404);
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  await page.evaluate(() => [...document.querySelectorAll("footer button")].find((b) => b.textContent.includes("Datenschutz-Einstellungen")).click()); await warten(250);
  ok("Footer: «Datenschutz-Einstellungen» öffnet einen Hinweis ohne Schalter (nichts einzustellen)", await page.evaluate(() => { const d = document.querySelector("dialog[open]"); return !!d && d.querySelectorAll('input[type="checkbox"]').length === 0 && d.textContent.includes("keine Cookies"); }));
  await page.keyboard.press("Escape"); await warten(200);
  ok("Footer: Escape schliesst den Hinweis", !(await page.$("dialog[open]")));
  await ctx.close();
}

// 2) Buchung: jeder Buchungslink zeigt auf die bestätigte Buchungsseite, öffnet ein neues Fenster, heisst «Termin buchen»
{
  const { ctx, page } = await frisch();
  for (const seite of ["/", "/leistungen/", "/leistungen/naegel/", "/kontakt/"]) {
    await page.goto(BASE + seite, { waitUntil: "networkidle0" });
    const links = await page.evaluate((url) => [...document.querySelectorAll(`a[href^="${url.split("/salon")[0]}"]`)].map((a) => ({ href: a.href, target: a.target, rel: a.rel, text: a.textContent.replace(/\(.*?\)/g, "").trim() })), BUCHUNG);
    ok(`Buchung ${seite}: ${links.length} Links zur Buchungsseite, alle target=_blank + noopener, alle «Termin buchen»`, links.length >= 2 && links.every((l) => l.href === BUCHUNG && l.target === "_blank" && /noopener/.test(l.rel) && l.text === "Termin buchen"), links.map((l) => l.text).join(" | "));
  }
  ok("Buchung: kein Formular sendet an einen Server (keine action-Attribute, keine fremden Methoden)", await page.evaluate(() => [...document.querySelectorAll("form")].every((f) => !f.getAttribute("action") && (f.method === "dialog" || f.method === "get"))));
  await ctx.close();
}

// 3) Tastatur: Sprunglink, Fokusring, Reihenfolge, aktuelle Seite
{
  const { ctx, page } = await frisch();
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  await page.keyboard.press("Tab");
  ok("Tastatur: erster Tab = «Zum Inhalt springen»", await page.evaluate(() => document.activeElement?.textContent?.trim() === "Zum Inhalt springen"));
  ok("Tastatur: Sprunglink wird beim Fokus sichtbar", await page.evaluate(() => { const r = document.activeElement.getBoundingClientRect(); return r.width > 40 && r.height > 20 && r.top >= 0; }));
  await page.keyboard.press("Enter"); await warten(150);
  ok("Tastatur: Sprunglink setzt den Fokus auf <main>", await page.evaluate(() => location.hash === "#inhalt" && document.activeElement?.id === "inhalt"));
  await page.keyboard.press("Tab");
  const fokus = await page.evaluate(() => { const st = getComputedStyle(document.activeElement); return { stil: st.outlineStyle, breite: parseFloat(st.outlineWidth), tag: document.activeElement.tagName }; });
  ok("Tastatur: Fokusring sichtbar (Outline ≥ 2px)", fokus.stil !== "none" && fokus.breite >= 2, JSON.stringify(fokus));
  const reihenfolge = [];
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  for (let i = 0; i < 8; i++) { await page.keyboard.press("Tab"); reihenfolge.push(await page.evaluate(() => (document.activeElement.getAttribute("aria-label") || document.activeElement.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40))); }
  ok("Tastatur: Fokusreihenfolge folgt dem Aufbau (Sprunglink, Logo, Navigation, Telefon, Termin buchen)", /^Zum Inhalt/.test(reihenfolge[0]) && /zur Start/.test(reihenfolge[1]) && reihenfolge[2].startsWith("Leistungen") && reihenfolge[3] === "Studio" && reihenfolge[4] === "Kontakt" && /Anrufen/.test(reihenfolge[5]) && /^Termin buchen/.test(reihenfolge[6]), reihenfolge.join(" → "));
  await page.goto(BASE + "/studio/", { waitUntil: "networkidle0" });
  ok("Navigation: aria-current auf «Studio»", await page.evaluate(() => document.querySelector('header a[aria-current="page"]')?.textContent?.trim() === "Studio"));
  await page.goto(BASE + "/leistungen/wimpern/", { waitUntil: "networkidle0" });
  ok("Navigation: Bereichsseite markiert «Leistungen und Preise» als aktuell", await page.evaluate(() => document.querySelector('header a[aria-current="page"]')?.textContent?.trim() === "Leistungen und Preise"));
  await ctx.close();
}

// 4) Handy (360 px): Menü als Dialog, Leiste, Touch-Ziele, kein horizontales Scrollen
{
  const { ctx, page } = await frisch({ breite: 360, hoehe: 740 });
  await page.goto(BASE + "/leistungen/naegel/", { waitUntil: "networkidle0" });
  const knopf = await page.$('header button[aria-haspopup="dialog"]');
  const box = await knopf.boundingBox();
  ok("Mobil: Menüknopf ≥ 44 × 44 px, beschriftet «Menü»", box.height >= 44 && box.width >= 44 && (await page.evaluate((b) => b.textContent.trim(), knopf)) === "Menü", `${Math.round(box.width)}×${Math.round(box.height)}`);
  ok("Mobil: Leiste mit «Anrufen» (tel:) und «Termin buchen» (Buchungsseite), beide ≥ 44 px hoch", await page.evaluate((url) => { const l = document.querySelector("nav.leiste"); const a = [...l.querySelectorAll("a")]; return a.length === 2 && a[0].href.startsWith("tel:+41445575067") && a[1].href === url && a.every((x) => x.getBoundingClientRect().height >= 44) && getComputedStyle(l).position === "fixed"; }, BUCHUNG));
  ok("Mobil: Leiste verdeckt die Fusszeile nicht (Platz unter dem Inhalt)", await page.evaluate(() => { window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }); const f = document.querySelector("footer").getBoundingClientRect(); const l = document.querySelector("nav.leiste").getBoundingClientRect(); return f.bottom <= l.top + 1; }));
  await page.evaluate(() => window.scrollTo(0, 0));
  await knopf.click(); await warten(400);
  ok("Mobil: Menü füllt den Bildschirm, Seitenlinks, Telefon, E-Mail und Buchung vorhanden, Fokus im Dialog", await page.evaluate((url) => { const d = document.querySelector("dialog.menue[open]"); const r = d.getBoundingClientRect(); return r.width >= innerWidth - 1 && r.height >= innerHeight - 1 && d.querySelectorAll("nav a").length === 4 && !!d.querySelector('a[href^="tel:"]') && !!d.querySelector('a[href^="mailto:"]') && !!d.querySelector(`a[href="${url}"]`) && d.contains(document.activeElement); }, BUCHUNG));
  const kleine = await page.evaluate(() => [...document.querySelectorAll("dialog.menue[open] nav a, dialog.menue[open] button, dialog.menue[open] a")].filter((e) => e.getBoundingClientRect().height > 0 && e.getBoundingClientRect().height < 44).length);
  ok("Mobil: alle Menüziele ≥ 44 px hoch", kleine === 0, `${kleine} zu klein`);
  let draussen = 0;
  for (let i = 0; i < 30; i++) { await page.keyboard.press("Tab"); if (!(await page.evaluate(() => document.querySelector("dialog.menue[open]").contains(document.activeElement) || document.activeElement === document.body))) draussen++; }
  ok("Mobil: Fokus bleibt im Menü (30-mal Tab)", draussen === 0, `${draussen} ausserhalb`);
  await page.keyboard.press("Escape"); await warten(250);
  ok("Mobil: Escape schliesst das Menü, Fokus zurück auf dem Knopf", await page.evaluate(() => !document.querySelector("dialog[open]") && document.activeElement?.getAttribute("aria-haspopup") === "dialog" && document.activeElement.getAttribute("aria-expanded") === "false"));
  await knopf.click(); await warten(300);
  await page.evaluate(() => document.querySelector('dialog.menue[open] nav a[href$="/kontakt/"]').click()); await warten(900);
  ok("Mobil: Menülink navigiert und schliesst das Menü", page.url().endsWith("/kontakt/") && !(await page.$("dialog[open]")), page.url().replace(BASE, ""));
  for (const s of ["/", "/leistungen/", "/kontakt/"]) {
    await page.goto(BASE + s, { waitUntil: "networkidle0" });
    ok(`Mobil ${s}: kein horizontales Scrollen`, await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
  }
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  ok("Mobil: Einstieg zeigt Titel und «Termin buchen» im ersten Bildschirm (360 × 740)", await page.evaluate(() => { const h = document.querySelector("h1").getBoundingClientRect(); const k = [...document.querySelectorAll("main a")].find((a) => a.textContent.trim().startsWith("Termin buchen")).getBoundingClientRect(); return h.top >= 0 && k.bottom <= innerHeight; }));
  await ctx.close();
}

// 5) Preisliste: Vollständigkeit und Lesbarkeit
{
  const { ctx, page } = await frisch();
  await page.goto(BASE + "/leistungen/", { waitUntil: "networkidle0" });
  const soll = leistungen.reduce((s, l) => s + l.varianten.length, 0);
  ok(`Preisliste: alle ${soll} Positionen stehen als Zeilen auf /leistungen/`, (await page.$$("li.position")).length === soll, `${(await page.$$("li.position")).length}`);
  const zeilen = await page.evaluate(() => [...document.querySelectorAll("li.position")].map((li) => li.textContent));
  ok("Preisliste: jede Zeile nennt CHF-Preis und Minuten", zeilen.every((z) => /CHF \d/.test(z) && /\d+ Min\./.test(z)));
  const abweichungen = leistungen.flatMap((l) => l.varianten).filter((v) => v.preis.abweichung).length;
  ok(`Preisliste: ${abweichungen} Positionen mit «je nach Aufwand» gekennzeichnet`, zeilen.filter((z) => z.includes("je nach Aufwand")).length === abweichungen);
  const ab = leistungen.flatMap((l) => l.varianten).filter((v) => v.preis.ab).length;
  ok(`Preisliste: ${ab} Positionen als «ab CHF» gekennzeichnet`, zeilen.filter((z) => /\bab CHF/.test(z)).length === ab);
  for (const k of kategorien) ok(`Preisliste: Sprungmarke #bereich-${k.slug} vorhanden und Bereichsseite verlinkt`, (await page.$(`#bereich-${k.slug}`)) !== null);
  ok("Preisliste: Zeitmass-Linien rein visuell (aria-hidden), Text nennt die Dauer", await page.evaluate(() => [...document.querySelectorAll(".zeitmass")].every((z) => z.getAttribute("aria-hidden") === "true")));
  ok("Preisliste: Stand- und Quellenhinweis sichtbar", await page.evaluate(() => document.body.textContent.includes("Massgebend ist die Buchungsseite")));
  await page.setViewport({ width: 360, height: 740 });
  await page.goto(BASE + "/leistungen/", { waitUntil: "networkidle0" });
  ok("Preisliste mobil: kein horizontales Scrollen, Preis und Dauer unter der Ausführung lesbar", await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1 && [...document.querySelectorAll("li.position")].every((li) => li.getBoundingClientRect().width <= innerWidth)));
  await ctx.close();
}

// 6) Öffnungszeiten: Wochenband vollständig, heutiger Tag markiert
{
  const { ctx, page } = await frisch();
  await page.goto(BASE + "/", { waitUntil: "networkidle0" }); await warten(200);
  const band = await page.evaluate(() => { const l = document.getElementById("wochenband-start"); return { zeilen: l.querySelectorAll("li").length, heute: l.querySelector('[aria-current="date"]')?.dataset.tag, so: l.querySelector('[data-tag="sonntag"]').textContent }; });
  const heute = ["sonntag", "montag", "dienstag", "mittwoch", "donnerstag", "freitag", "samstag"][new Date().getDay()];
  ok("Öffnungszeiten: 7 Zeilen, heutiger Tag markiert, Sonntag «geschlossen»", band.zeilen === 7 && band.heute === heute && band.so.includes("geschlossen"), JSON.stringify(band));
  ok("Öffnungszeiten: Samstag bis 17:45 wie auf der Buchungsseite", await page.evaluate(() => document.querySelector('#wochenband-start [data-tag="samstag"]').textContent.includes("09:30 bis 17:45")));
  await ctx.close();
}

// 7) mailto-Formular: Prüfung, kodierter Link, kein Versand. Die Navigation zu mailto: wird über das Chrome-Protokoll
//    beobachtet (Page.frameRequestedNavigation); es öffnet sich kein Programm, und es wird nichts gesendet.
{
  const { ctx, page, extern } = await frisch();
  const cdp = await page.createCDPSession();
  await cdp.send("Page.enable");
  const navigationen = [];
  cdp.on("Page.frameRequestedNavigation", (e) => navigationen.push(e.url));
  cdp.on("Page.frameScheduledNavigation", (e) => navigationen.push(e.url));
  const gesendet = [];
  page.on("request", (r) => { if (!["GET", "HEAD", "OPTIONS"].includes(r.method())) gesendet.push(`${r.method()} ${r.url()}`); });
  await page.goto(BASE + "/kontakt/", { waitUntil: "networkidle0" });
  ok("Formular: Knopf heisst «E-Mail vorbereiten», keine Versandbestätigung im Text", await page.evaluate(() => document.querySelector('form button[type="submit"]').textContent.trim() === "E-Mail vorbereiten" && !/gesendet|verschickt/.test(document.querySelector("form").textContent)));
  ok("Formular: Hinweis «keine Terminbuchung» sichtbar", await page.evaluate(() => document.querySelector("form").textContent.includes("keine Terminbuchung")));
  ok("Formular: Felder Name, E-Mail, Betreff, Nachricht mit sichtbaren Beschriftungen; keine Gesundheits- oder Telefonfelder", await page.evaluate(() => { const f = document.querySelector("form"); const namen = [...f.querySelectorAll("input,select,textarea")].map((i) => i.name); return namen.join(",") === "Name,E-Mail,Betreff,Nachricht" && [...f.querySelectorAll("input,select,textarea")].every((i) => !!f.querySelector(`label[for="${i.id}"]`)); }));
  await page.evaluate(() => document.querySelector('form button[type="submit"]').click()); await warten(200);
  const fehler = await page.evaluate(() => [...document.querySelectorAll('form [role="alert"]')].map((e) => e.textContent));
  ok("Formular: leeres Absenden zeigt drei Fehlermeldungen am Feld, Fokus im ersten Feld, kein mailto", fehler.length === 3 && (await page.evaluate(() => document.activeElement?.name === "Name" && document.activeElement.getAttribute("aria-invalid") === "true")) && !navigationen.some((u) => u.startsWith("mailto:")), fehler.join(" | "));
  await page.type('form input[name="Name"]', "Testperson Fiktiv & Co");
  await page.type('form input[name="E-Mail"]', "keine-adresse");
  await page.evaluate(() => document.querySelector('form button[type="submit"]').click()); await warten(200);
  ok("Formular: ungültige E-Mail → Fehlermeldungen nur für E-Mail und Nachricht, kein mailto", (await page.$$('form [role="alert"]')).length === 2 && !navigationen.some((u) => u.startsWith("mailto:")));
  await page.click('form input[name="E-Mail"]', { clickCount: 3 }); await page.type('form input[name="E-Mail"]', "test@example.com");
  await page.select('form select[name="Betreff"]', "gutschein");
  await page.type('form textarea[name="Nachricht"]', "Prüfung & Test, Zeile 1\nZeile 2 mit #Raute?");
  await page.evaluate(() => document.querySelector('form button[type="submit"]').click()); await warten(700);
  const mailto = navigationen.find((u) => u.startsWith("mailto:")) ?? "";
  const dekodiert = (() => { try { return decodeURIComponent(mailto); } catch { return ""; } })();
  ok(`Formular: gültig absenden erzeugt mailto an ${EMAIL} mit Name, Betreff und Nachricht`, mailto.startsWith(`mailto:${EMAIL}?subject=`) && dekodiert.includes("Testperson Fiktiv & Co") && dekodiert.includes("Betreff: Gutschein") && dekodiert.includes("Zeile 2 mit #Raute?"), dekodiert.slice(0, 110).replaceAll("\n", " ⏎ "));
  ok("Formular: Sonderzeichen kodiert (kein rohes «&», «#», Leerzeichen oder Zeilenumbruch im Link)", !/[\s#]/.test(mailto) && (mailto.match(/&/g) ?? []).length === 1 && mailto.includes("%0A") && mailto.includes("%26") && mailto.includes("%23"));
  const status = await page.evaluate(() => document.querySelector('form [role="status"]').textContent);
  ok("Formular: Hinweis nach dem Klick nennt das E-Mail-Programm und die Adresse (keine Erfolgsmeldung)", /E-Mail-Programm/.test(status) && status.includes(EMAIL) && !/gesendet/.test(status), status.slice(0, 80));
  ok("Formular: Knopf «Nachricht kopieren» erscheint als Rückfall", (await page.$$("main form button")).length === 2);
  ok("Formular: nichts an einen Server gesendet, keine Anfragen an fremde Hosts", gesendet.length === 0 && extern.length === 0, [...gesendet, ...extern].join(","));
  await ctx.close();
}

// 8) Fehlerseite, Direktaufrufe, Neuladen
{
  const { ctx, page } = await frisch();
  const r = await page.goto(BASE + "/diese-seite-gibt-es-nicht/", { waitUntil: "networkidle0" });
  ok("Fehlerseite: 404 mit gestalteter Seite und Link zur Startseite", r.status() === 404 && (await page.evaluate(() => document.querySelector("h1")?.textContent.includes("gibt es nicht") && !!document.querySelector('main a[href$="/new-york-nails-schlieren-demo/"], main a[href="/"]'))));
  for (const s of alleSeiten()) {
    const r2 = await page.goto(BASE + s, { waitUntil: "networkidle0" });
    await page.reload({ waitUntil: "networkidle0" });
    ok(`Direktaufruf + Neuladen ${s}: 200, genau eine h1`, r2.status() === 200 && (await page.evaluate(() => document.querySelectorAll("main h1").length === 1)));
  }
  await ctx.close();
}

// 9) Reduzierte Bewegung und dunkles Schema
{
  const { ctx, page } = await frisch({ reduziert: true });
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  ok("Reduzierte Bewegung: kein scroll-behavior smooth", (await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)) === "auto");
  await ctx.close();
  const d = await frisch({ dunkel: true });
  await d.page.goto(BASE + "/", { waitUntil: "networkidle0" });
  const farben = await d.page.evaluate(() => ({ bg: getComputedStyle(document.body).backgroundColor, text: getComputedStyle(document.body).color, logo: [...document.querySelectorAll("header img")].find((i) => i.getBoundingClientRect().width > 0)?.currentSrc ?? "" }));
  ok("Dunkles Schema: dunkler Grund, helle Schrift, weisse Wortmarke in der Kopfzeile", /rgb\(18, 18, 17\)/.test(farben.bg) && /rgb\(242, 241, 236\)/.test(farben.text) && /logo-wortmarke-weiss/.test(farben.logo), JSON.stringify(farben));
  await d.ctx.close();
}

await browser.close();
mkdirSync("pruefung", { recursive: true });
writeFileSync("pruefung/funktionen.json", JSON.stringify(ergebnisse, null, 1));
const fehler = ergebnisse.filter((e) => !e.ok);
console.log(`\n${ergebnisse.length} Prüfungen, ${fehler.length} fehlgeschlagen → pruefung/funktionen.json`);
process.exitCode = fehler.length ? 1 : 0;
