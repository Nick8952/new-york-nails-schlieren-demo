"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Interner Seitenlink, der die aktuelle Seite (und ihre Unterseiten) mit aria-current kennzeichnet. */
export function NavLink({ ziel, className, aktivKlasse, children, onClick }: { ziel: string; className?: string; aktivKlasse: string; children: ReactNode; onClick?: () => void }) {
  const pfad = usePathname() ?? "/";
  const aktiv = ziel === "/" ? pfad === "/" : pfad === ziel || pfad.startsWith(ziel);
  return (
    <Link href={ziel} className={`${className ?? ""} ${aktiv ? aktivKlasse : ""}`.trim()} aria-current={aktiv ? "page" : undefined} onClick={onClick}>
      {children}
    </Link>
  );
}
