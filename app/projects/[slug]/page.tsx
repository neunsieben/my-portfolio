"use client";

import { DotGrid } from "@/components/DotGrid";
import { SiteCursor } from "@/components/SiteCursor";
import { SiteNav } from "@/components/SiteNav";
import { CONTACT_MAILTO } from "@/lib/siteContact";
import { PROJECT_DETAILS } from "@/lib/projectsData";
import Link from "next/link";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useEffect } from "react";

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = PROJECT_DETAILS.find((p) => p.slug === slug);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.05 },
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  if (!project) return notFound();

  return (
    <div className="pd-page">
      <DotGrid />
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
            {project.collaborators && (
              <div className="pd-meta-row">
                <span className="pd-meta-label">In Collaboration With</span>
                <span className="pd-meta-value">{project.collaborators}</span>
              </div>
            )}
          </div>

          {project.visitUrl && (
            <a
              href={project.visitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pd-visit hoverable reveal reveal-delay-3"
            >
              Visit Site ↗
            </a>
          )}
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
                <video src={item.src} autoPlay muted loop playsInline />
              )}
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-bottom">
          © 2026 Leonard Semmler. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
