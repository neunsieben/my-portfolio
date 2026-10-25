"use client";

import { DotGrid } from "@/components/DotGrid";
import { SiteCursor } from "@/components/SiteCursor";
import { SiteNav } from "@/components/SiteNav";
import { getCanvasHeadFontStack } from "@/lib/canvasHeadFontStack";
import { CONTACT_MAILTO } from "@/lib/siteContact";
import { PROJECT_DETAILS } from "@/lib/projectsData";
import { initTerminalLinks } from "@/lib/terminalAnimation";
import { createVerticalGlassEffect } from "@/lib/verticalGlassEffect";
import Link from "next/link";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useEffect } from "react";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = PROJECT_DETAILS.find((p) => p.slug === slug);

  useEffect(() => {
    let disposed = false;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0, rootMargin: "0px 0px 80px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

    // Animate terminal-links in page content (nav links are handled by SiteNav)
    const intro = document.querySelector(".pd-intro");
    const gitSection = document.querySelector(".pd-page .get-in-touch");
    const cleanupIntro = intro
      ? initTerminalLinks(() => disposed, intro)
      : () => {};
    const cleanupGitLinks = gitSection
      ? initTerminalLinks(() => disposed, gitSection)
      : () => {};

    const getInTouchEl = document.getElementById("getInTouchCanvas");
    let gitInstance: ReturnType<typeof createVerticalGlassEffect> | null = null;
    let sweepObs: IntersectionObserver | null = null;

    if (getInTouchEl instanceof HTMLCanvasElement) {
      gitInstance = createVerticalGlassEffect(
        getInTouchEl,
        (tx, tc, dpr) => {
          const maxWidth = tc.width;
          let fs = Math.floor(300 * dpr);
          const ff = getCanvasHeadFontStack();
          tx.font = `700 ${fs}px ${ff}`;
          const measured = tx.measureText("Get in touch").width;
          fs = Math.floor(fs * (maxWidth / measured));
          tx.font = `700 ${fs}px ${ff}`;
          tx.textAlign = "center";
          tx.textBaseline = "middle";
          tx.fillStyle = "#0a0a0a";
          tx.fillText("Get in touch", tc.width / 2, tc.height * 0.5);
        },
        320,
        110,
        { shouldStop: () => disposed },
      );

      document.fonts.ready.then(() => {
        if (disposed) return;
        gitInstance?.resize();
        gitInstance?.render();
      });

      const touchCanvas = getInTouchEl;
      let triggered = false;
      sweepObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && !triggered) {
              triggered = true;
              sweepObs?.unobserve(touchCanvas);
              const duration = 1800;
              const holdStart = 200;
              const holdEnd = 400;
              const totalDuration = holdStart + duration + holdEnd;
              const startTime = performance.now();
              function step() {
                if (disposed) return;
                const elapsed = performance.now() - startTime;
                if (elapsed < holdStart) {
                  const rect = touchCanvas.getBoundingClientRect();
                  touchCanvas.dispatchEvent(
                    new MouseEvent("mousemove", {
                      clientX: rect.left + rect.width * 0.5,
                      clientY: rect.top + rect.height * 0.05,
                      bubbles: true,
                    }),
                  );
                  requestAnimationFrame(step);
                } else if (elapsed < holdStart + duration) {
                  const progress = (elapsed - holdStart) / duration;
                  const eased = progress * progress * (3 - 2 * progress);
                  const rect = touchCanvas.getBoundingClientRect();
                  const y = rect.top + rect.height * (0.05 + eased * 0.9);
                  touchCanvas.dispatchEvent(
                    new MouseEvent("mousemove", {
                      clientX: rect.left + rect.width * 0.5,
                      clientY: y,
                      bubbles: true,
                    }),
                  );
                  requestAnimationFrame(step);
                } else if (elapsed < totalDuration) {
                  requestAnimationFrame(step);
                } else {
                  touchCanvas.dispatchEvent(new MouseEvent("mouseleave"));
                }
              }
              requestAnimationFrame(step);
            }
          });
        },
        { threshold: 0.4 },
      );
      sweepObs.observe(touchCanvas);
    }

    return () => {
      disposed = true;
      obs.disconnect();
      sweepObs?.disconnect();
      cleanupIntro();
      cleanupGitLinks();
      if (gitInstance) {
        window.removeEventListener("resize", gitInstance.resize);
      }
    };
  }, []);

  if (!project) return notFound();

  return (
    <div className="pd-page">
      <DotGrid dotColor="rgba(10,10,10,0.12)" />
      <SiteCursor variant="home" />
      <SiteNav scrolledThreshold={40}>
        <li>
          <Link href="/projects" className="hoverable terminal-link">
            <span className="terminal-link-label">Projects</span>
          </Link>
        </li>
        <li>
          <Link href="/about" className="hoverable terminal-link">
            <span className="terminal-link-label">About</span>
          </Link>
        </li>
        <li>
          <a href={CONTACT_MAILTO} className="hoverable terminal-link">
            <span className="terminal-link-label">Get in Touch</span>
          </a>
        </li>
      </SiteNav>

      {/* ── Intro ───────────────────────────────────────────── */}
      <section className="pd-cols pd-intro">
        <div className="pd-left">
          <Link href="/projects" className="pd-back hoverable reveal">
            ← Projects
          </Link>
          <span className="pd-num reveal reveal-delay-3">{project.num}</span>
        </div>

        <div className="pd-right">
          <h1 className="pd-title reveal">{project.name}</h1>
          <div className="pd-desc reveal reveal-delay-1">
            {project.description.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="pd-desc pd-desc-de reveal reveal-delay-1" lang="de">
            {project.descriptionDe.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="pd-meta reveal reveal-delay-2">
            <div className="pd-meta-row">
              <span className="pd-meta-label">Year</span>
              <span className="pd-meta-value">{project.year}</span>
            </div>
            <div className="pd-meta-row">
              <span className="pd-meta-label">Category</span>
              <span className="pd-meta-value">{project.category}</span>
            </div>
            {project.client && (
              <div className="pd-meta-row">
                <span className="pd-meta-label">Client</span>
                <span className="pd-meta-value">{project.client}</span>
              </div>
            )}
            {project.role && (
              <div className="pd-meta-row">
                <span className="pd-meta-label">Role</span>
                <span className="pd-meta-value">{project.role}</span>
              </div>
            )}
            {project.visitUrl && (
              <div className="pd-meta-row">
                <span className="pd-meta-label">Website</span>
                <a
                  href={project.visitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="terminal-link hoverable"
                >
                  <span className="terminal-link-label">
                    {project.visitLabel ?? "Visit"} ↗
                  </span>
                </a>
              </div>
            )}
            {project.collaborators && (
              <div className="pd-meta-row">
                <span className="pd-meta-label">In Collaboration With</span>
                <span className="pd-meta-value">{project.collaborators}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Media ───────────────────────────────────────────── */}
      <section className="pd-cols pd-media-section">
        <div className="pd-left pd-media-left-col" aria-hidden="true" />
        <div className="pd-media-right">
          {project.media.map((item, i) => (
            <div
              key={i}
              className={`pd-media-item reveal${!item.src ? " pd-placeholder" : ""}`}
              style={!item.src && item.bg ? { background: item.bg } : {}}
            >
              {item.type === "image" && item.src && (
                <img src={item.src} alt={item.alt ?? project.name} />
              )}
              {item.type === "video" && item.src && (
                <video
                  src={item.src}
                  poster={item.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="get-in-touch">
        <a
          href={CONTACT_MAILTO}
          className="get-in-touch-headline-link reveal"
          aria-label="Send email to Leonard Semmler"
        >
          <canvas id="getInTouchCanvas" />
        </a>
        <ul className="get-in-touch-links reveal reveal-delay-2">
          <li>
            <a href="#" className="hoverable terminal-link">
              Instagram ↗
            </a>
          </li>
          <li>
            <a href="#" className="hoverable terminal-link">
              LinkedIn ↗
            </a>
          </li>
          <li>
            <a href={CONTACT_MAILTO} className="hoverable terminal-link">
              Email ↗
            </a>
          </li>
        </ul>
      </section>

      <footer className="footer">
        <div className="footer-bottom">
          © 2026 Leonard Semmler. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
