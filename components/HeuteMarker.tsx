"use client";

import { useEffect } from "react";

const TAGE = ["sonntag", "montag", "dienstag", "mittwoch", "donnerstag", "freitag", "samstag"];

/**
 * Markiert nach dem Laden die Zeile des heutigen Wochentags (Zeit in Zürich) mit aria-current="date".
 * Der statische Export kennt kein «heute»; ohne JavaScript bleibt die Liste neutral und vollständig lesbar.
 */
export function HeuteMarker({ listeId }: { listeId: string }) {
  useEffect(() => {
    const liste = document.getElementById(listeId);
    if (!liste) return;
    const teile = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Zurich", weekday: "short" }).formatToParts(new Date());
    const kurz = teile.find((t) => t.type === "weekday")?.value ?? "";
    const index = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(kurz);
    if (index < 0) return;
    const zeile = liste.querySelector<HTMLElement>(`[data-tag="${TAGE[index]}"]`);
    zeile?.setAttribute("aria-current", "date");
    return () => zeile?.removeAttribute("aria-current");
  }, [listeId]);
  return null;
}
