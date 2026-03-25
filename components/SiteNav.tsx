"use client";

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
    const el = document.getElementById("navLogo");
    if (el) {
      const n = new Date();
      el.textContent = `LEONARDSEMMLER/PORTFOLIO/${n.getFullYear()}/${MONTHS[n.getMonth()]}`;
    }

    const onScroll = () => {
      document
        .querySelector("nav")
        ?.classList.toggle("scrolled", window.scrollY > scrolledThreshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
