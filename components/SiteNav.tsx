"use client";

import { initTerminalLinks } from "@/lib/terminalAnimation";
import Link from "next/link";
import { useEffect } from "react";

const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

export function SiteNav({
  logoHref = "/",
  scrolledThreshold = 50,
  children,
}: {
  logoHref?: string;
  scrolledThreshold?: number;
  children: React.ReactNode;
}) {
  useEffect(() => {
    let disposed = false;

    const navEl = document.querySelector("nav");

    // Set logo text (must happen before splitIntoChars runs on it)
    const logoEl = document.getElementById("navLogo");
    if (logoEl) {
      const n = new Date();
      logoEl.textContent = `LEONARDSEMMLER/PORTFOLIO/${n.getFullYear()}/${MONTHS[n.getMonth()]}`;
    }

    // Typewriter animation scoped to the nav — works on every page
    const cleanupLinks = navEl ? initTerminalLinks(() => disposed, navEl) : () => {};

    const onScroll = () => {
      navEl?.classList.toggle("scrolled", window.scrollY > scrolledThreshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      disposed = true;
      cleanupLinks();
      window.removeEventListener("scroll", onScroll);
    };
  }, [scrolledThreshold]);

  return (
    <nav>
      <Link
        href={logoHref}
        className="nav-logo terminal-link hoverable"
        id="navLogo"
        aria-label="Leonard Semmler portfolio home"
      />
      <ul className="nav-links">{children}</ul>
    </nav>
  );
}
