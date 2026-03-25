"use client";

import { DotGrid } from "@/components/DotGrid";
import { SiteCursor } from "@/components/SiteCursor";
import { SiteNav } from "@/components/SiteNav";
import { getCanvasHeadFontStack } from "@/lib/canvasHeadFontStack";
import { CONTACT_MAILTO } from "@/lib/siteContact";
import {
  createAboutVerticalGlassEffect,
  wrapText,
} from "@/lib/aboutVerticalGlassEffect";
import Link from "next/link";
import { useEffect } from "react";

const HERO_TEXT =
  "Enthusiastic about graphic design, typography, and the dynamic areas of motion and web-based animations. Specialized in translating brands into unique and immersive digital user experiences.";

export default function AboutPage() {
  useEffect(() => {
    let pageDisposed = false;

    const heroEl = document.getElementById("heroCanvas");
    const gitEl = document.getElementById("getInTouchCanvas");
    if (
      !heroEl ||
      !gitEl ||
      !(heroEl instanceof HTMLCanvasElement) ||
      !(gitEl instanceof HTMLCanvasElement)
    ) {
      return () => {};
    }
    const gitCanvas = gitEl;

    const heroInstance = createAboutVerticalGlassEffect(
      heroEl,
      (tx, tc, dpr) => {
        const maxWidth = tc.width * 0.95;
        let fs = Math.floor(80 * dpr);
        const ff = getCanvasHeadFontStack();
        tx.font = `700 ${fs}px ${ff}`;
        let lines = wrapText(tx, HERO_TEXT, maxWidth);
        while (lines.length * fs * 1.15 > tc.height * 0.9 && fs > 10) {
          fs -= 2;
          tx.font = `700 ${fs}px ${ff}`;
          lines = wrapText(tx, HERO_TEXT, maxWidth);
        }
        const lineH = fs * 1.15;
        const totalH = lines.length * lineH;
        const startY = (tc.height - totalH) / 2 + fs * 0.85;
        tx.fillStyle = "#0a0a0a";
        tx.textAlign = "center";
        tx.textBaseline = "alphabetic";
        lines.forEach((line, i) => {
          tx.fillText(line, tc.width / 2, startY + i * lineH);
        });
      },
      600,
      300,
      { shouldStop: () => pageDisposed },
    );

    const gitInstance = createAboutVerticalGlassEffect(
      gitCanvas,
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
      { shouldStop: () => pageDisposed },
    );

    let heroAnimTimer: number | null = null;

    document.fonts.ready.then(() => {
      if (pageDisposed) return;
      heroInstance.resize();
      heroInstance.render();
      gitInstance.resize();
      gitInstance.render();
      gitInstance.force(0.5, 0.5, 0, 1.2);

      heroAnimTimer = window.setTimeout(() => {
        const duration = 4000;
        const startTime = performance.now();

        function step() {
          if (pageDisposed) return;
          const elapsed = performance.now() - startTime;
          if (elapsed < duration) {
            const progress = elapsed / duration;
            const easeIn = Math.pow(progress, 1.4);
            const eased = 1 - Math.pow(1 - easeIn, 4.5);
            const y = -0.1 + eased * 1.2;
            heroInstance.force(0.5, y, 0.7, y + 0.08);
            requestAnimationFrame(step);
          } else {
            const fadeStart = performance.now();
            function fadeOut() {
              if (pageDisposed) return;
              const t = Math.min((performance.now() - fadeStart) / 800, 1);
              const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
              heroInstance.force(0.5, 1.1, 0.7 * (1 - ease), 1.2);
              if (t < 1) requestAnimationFrame(fadeOut);
            }
            requestAnimationFrame(fadeOut);
          }
        }
        requestAnimationFrame(step);
      }, 150);
    });

    let sweepObs: IntersectionObserver | null = null;
    (function () {
      const canvas = document.getElementById("getInTouchCanvas");
      if (!canvas) return;
      const c = canvas;
      let triggered = false;
      sweepObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && !triggered) {
              triggered = true;
              sweepObs?.unobserve(c);
              const duration = 1800;
              const holdStart = 200;
              const holdEnd = 400;
              const totalDuration = holdStart + duration + holdEnd;
              const startTime = performance.now();
              function stepSweep() {
                if (pageDisposed) return;
                const elapsed = performance.now() - startTime;
                if (elapsed < holdStart) {
                  const rect = c.getBoundingClientRect();
                  c.dispatchEvent(
                    new MouseEvent("mousemove", {
                      clientX: rect.left + rect.width * 0.5,
                      clientY: rect.top + rect.height * 0.05,
                      bubbles: true,
                    }),
                  );
                  requestAnimationFrame(stepSweep);
                } else if (elapsed < holdStart + duration) {
                  const progress = (elapsed - holdStart) / duration;
                  const eased = progress * progress * (3 - 2 * progress);
                  const rect = c.getBoundingClientRect();
                  c.dispatchEvent(
                    new MouseEvent("mousemove", {
                      clientX: rect.left + rect.width * 0.5,
                      clientY:
                        rect.top + rect.height * (0.05 + eased * 0.9),
                      bubbles: true,
                    }),
                  );
                  requestAnimationFrame(stepSweep);
                } else if (elapsed < totalDuration) {
                  requestAnimationFrame(stepSweep);
                } else {
                  c.dispatchEvent(new MouseEvent("mouseleave"));
                }
              }
              requestAnimationFrame(stepSweep);
            }
          });
        },
        { threshold: 0.4 },
      );
      sweepObs.observe(c);
    })();

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

    function splitIntoChars(el: HTMLElement) {
      const text = el.textContent || "";
      el.textContent = "";
      if (text.includes("/")) {
        const segments = text.split("/");
        segments.forEach((seg, idx) => {
          const wrapper = document.createElement("span");
          wrapper.style.whiteSpace = "nowrap";
          const fullSeg = idx < segments.length - 1 ? seg + "/" : seg;
          for (let i = 0; i < fullSeg.length; i++) {
            const span = document.createElement("span");
            span.className = "char";
            span.textContent =
              fullSeg[i] === " " ? "\u00A0" : fullSeg[i] ?? "";
            wrapper.appendChild(span);
          }
          el.appendChild(wrapper);
        });
      } else {
        for (let i = 0; i < text.length; i++) {
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = text[i] === " " ? "\u00A0" : text[i] ?? "";
          el.appendChild(span);
        }
      }
    }

    function sweepTerminal(
      el: HTMLElement,
      speed: number,
      onComplete?: () => void,
    ) {
      const chars = el.querySelectorAll(".char");
      let i = 0;
      function step() {
        if (pageDisposed) return;
        if (i > 0) chars[i - 1]?.classList.remove("active");
        if (i < chars.length) {
          chars[i]?.classList.add("active");
          i++;
          setTimeout(step, speed);
        } else {
          if (chars.length > 0)
            chars[chars.length - 1]?.classList.remove("active");
          if (onComplete) onComplete();
        }
      }
      step();
    }

    function terminalSweepTarget(link: HTMLElement) {
      return (link.querySelector(".terminal-link-label") as HTMLElement) ?? link;
    }

    const terminalCleanups: Array<() => void> = [];
    document.querySelectorAll(".terminal-link").forEach((el) => {
      const link = el as HTMLElement;
      const target = terminalSweepTarget(link);
      splitIntoChars(target);
      let isAnimating = false;
      const onEnter = () => {
        if (isAnimating) return;
        isAnimating = true;
        sweepTerminal(target, 70, () => {
          isAnimating = false;
        });
      };
      link.addEventListener("mouseenter", onEnter);
      terminalCleanups.push(() => {
        link.removeEventListener("mouseenter", onEnter);
      });
    });

    return () => {
      pageDisposed = true;
      if (heroAnimTimer !== null) window.clearTimeout(heroAnimTimer);
      window.removeEventListener("resize", heroInstance.resize);
      window.removeEventListener("resize", gitInstance.resize);
      sweepObs?.disconnect();
      obs.disconnect();
      terminalCleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="about-page">
      <DotGrid />
      <SiteCursor variant="home" />
      <SiteNav scrolledThreshold={50}>
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

      <section className="about-hero">
        <div className="about-hero-label reveal">
          Based in Hamburg, working globally
        </div>
        <div className="reveal reveal-delay-1">
          <canvas id="heroCanvas" />
        </div>
      </section>

      <section className="about-content">
        <div className="about-photo reveal">
          <img
            src="/images/leonard-semmler.png"
            alt="Leonard Semmler"
            className="about-photo-img"
          />
        </div>
        <div className="about-text-col">
          <p className="about-text-para reveal">
            My work covers wireframing, visual design, art direction, UI design,
            motion and interactive prototypes. This approach enables me to
            create thoughtful experiences by focusing on the brand&apos;s
            character and intent. Overall, I love to pay attention to detail and
            care for design execution and emphasizing collaboration with
            stakeholders throughout all project phases.
          </p>
          <p className="about-text-para reveal reveal-delay-1">
            I enjoy working with enthusiastic people so, within the last couple
            of years, I&apos;ve been working with multiple design teams, in person
            and remotely, but also I&apos;ve been fortunate to work and
            collaborate with some talented freelances, studios and agencies,
            crafting meaningful and remarkable digital experiences for various
            brands.
          </p>
          <p className="about-text-para reveal reveal-delay-2">
            My work has been recognized with various awards and features across
            different platforms, reinforcing my commitment to pushing creative
            boundaries and delivering work that resonates with audiences
            worldwide.
          </p>
        </div>
      </section>

      <section className="about-bio">
        <div className="about-bio-col reveal">
          <div className="about-bio-label">Background</div>
          <p className="about-bio-text">
            I&apos;m <strong>Leonard Semmler</strong>, a designer based in{" "}
            <strong>Hamburg, Germany</strong> with a B.Sc. in{" "}
            <strong>Human-Computer Interaction</strong>. My work lives at the
            intersection of strategy and aesthetics — I believe the best design
            doesn&apos;t just look good, it communicates clearly and moves
            people to action.
          </p>
        </div>
        <div className="about-bio-col reveal reveal-delay-1">
          <div className="about-bio-label">Approach</div>
          <p className="about-bio-text">
            From <strong>brand identities</strong> and{" "}
            <strong>packaging design</strong> to{" "}
            <strong>visual direction for music events</strong>, I approach every
            project as an opportunity to tell a compelling story. I work across
            diverse materials and formats, always grounded in research and
            driven by craft.
          </p>
        </div>
      </section>

      <section className="about-details">
        <div className="about-detail-block reveal">
          <div className="about-detail-label">Fields</div>
          <div className="about-detail-item">Graphic Design</div>
          <div className="about-detail-item">Branding/ Brand Identity</div>
          <div className="about-detail-item">Packaging Design</div>
          <div className="about-detail-item">Visual/ Art Direction</div>
          <div className="about-detail-item">UX/UI Design</div>
          <div className="about-detail-item">Motion Design</div>
        </div>
        <div className="about-detail-block reveal reveal-delay-1">
          <div className="about-detail-label">Favourite Tools</div>
          <div className="about-detail-item">Adobe Creative Cloud</div>
          <div className="about-detail-item about-detail-indent">Photoshop</div>
          <div className="about-detail-item about-detail-indent">Illustrator</div>
          <div className="about-detail-item about-detail-indent">XD</div>
          <div className="about-detail-item about-detail-indent">After Effects</div>
          <div className="about-detail-item about-detail-indent">Firefly</div>
          <div className="about-detail-item">Figma</div>
          <div className="about-detail-item">Axure RP</div>
          <div className="about-detail-item">Wordpress</div>
          <div className="about-detail-item">Current AI Tools</div>
        </div>
        <div className="about-detail-block reveal reveal-delay-2">
          <div className="about-detail-label">Education</div>
          <div className="about-detail-item">B.Sc. Human-Computer Interaction</div>
          <div className="about-detail-item">University of Hamburg</div>
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
