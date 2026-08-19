"use client";

import { DotGrid } from "@/components/DotGrid";
import { SiteCursor } from "@/components/SiteCursor";
import { SiteNav } from "@/components/SiteNav";
import { getCanvasHeadFontStack } from "@/lib/canvasHeadFontStack";
import { CONTACT_MAILTO } from "@/lib/siteContact";
import { createVerticalGlassEffect } from "@/lib/verticalGlassEffect";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const LIST_ROWS = [
  {
    reveal: "reveal",
    slug: "zalazium-gmbh",
    dataImg:
      "linear-gradient(135deg,#c8c6c2,#d8d6d2,#bab8b4)",
    num: "001",
    name: "Zalazium GmbH",
    desc: "Interactive website and brand identity for a tech startup, introducing their platform through an engaging digital experience.",
    slides: [
      "linear-gradient(135deg,#c8c6c2,#d8d6d2,#bab8b4)",
      "linear-gradient(160deg,#d0ceca,#bab8b4,#c8c6c2)",
      "linear-gradient(135deg,#c8c6c2,#d8d6d2,#bab8b4)",
      "linear-gradient(160deg,#d0ceca,#bab8b4,#c8c6c2)",
    ],
  },
  {
    reveal: "reveal reveal-delay-1",
    slug: "daily-grind-coffee",
    dataImg: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)",
    num: "002",
    name: "Daily Grind Coffee",
    desc: "Complete brand identity and packaging design for a specialty coffee roastery based in Hamburg.",
    slides: [
      "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)",
      "linear-gradient(160deg,#0f3460,#1a1a2e,#16213e)",
      "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)",
      "linear-gradient(160deg,#0f3460,#1a1a2e,#16213e)",
    ],
  },
  {
    reveal: "reveal reveal-delay-2",
    slug: "donata-jan-trio",
    dataImg: "url(/images/projects/home/home-thumbnail.jpg)",
    num: "003",
    name: "Donata Jan Trio",
    desc: "Album artwork and visual identity for a contemporary jazz trio, capturing the essence of their sound through design.",
    slides: [
      "url(/images/projects/home/home-thumbnail.jpg)",
      "linear-gradient(160deg,#0a0604,#2a1a0e,#1a0e06)",
      "linear-gradient(135deg,#2a1a0e,#1a0e06,#0a0604)",
      "linear-gradient(160deg,#0a0604,#2a1a0e,#1a0e06)",
    ],
  },
  {
    reveal: "reveal reveal-delay-3",
    slug: "studio-liebe",
    dataImg: "url(/images/projects/studio_liebe/studio_liebe_thumbnail.jpg)",
    num: "004",
    name: "Studio Liebe",
    desc: "Visual branding and digital presence for a Hamburg-based design studio focused on culture and music.",
    slides: [
      "url(/images/projects/studio_liebe/studio_liebe_thumbnail.jpg)",
      "linear-gradient(160deg,#c0beba,#cccac6,#d4d2ce)",
      "linear-gradient(135deg,#cccac6,#d4d2ce,#c0beba)",
      "linear-gradient(160deg,#c0beba,#cccac6,#d4d2ce)",
    ],
  },
  {
    reveal: "reveal reveal-delay-4",
    slug: "resort-13",
    dataImg: "url(/images/projects/resort13/resort13_thumbnail_new.jpg)",
    num: "005",
    name: "Resort 13",
    desc: "Logo, brand identity and social media design for a house music DJ and live performance event series.",
    slides: [
      "url(/images/projects/resort13/resort13_thumbnail_new.jpg)",
      "url(/images/projects/resort13/resort13_july_bg.jpg)",
      "url(/images/projects/resort13/resort13_thumbnail_new.jpg)",
      "url(/images/projects/resort13/resort13_july_bg.jpg)",
    ],
  },
  {
    reveal: "reveal reveal-delay-5",
    slug: "forbes-cpxart",
    dataImg: "url(/images/projects/cpxart/cpxart_1.jpg)",
    num: "006",
    name: "Forbes x CPxArt",
    desc: "Hand-painted bomber jackets for CPxArt, featured in Forbes — wearable art merging painting and fashion.",
    slides: [
      "url(/images/projects/cpxart/cpxart_1.jpg)",
      "url(/images/projects/cpxart/cpxart_2.jpg)",
      "url(/images/projects/cpxart/cpxart_1.jpg)",
      "url(/images/projects/cpxart/cpxart_2.jpg)",
    ],
  },
  {
    reveal: "reveal reveal-delay-6",
    slug: "carlitoz-way",
    dataImg: "linear-gradient(135deg,#d4a96a,#e8c48a,#c8946a)",
    num: "007",
    name: "Carlitoz Way",
    desc: "Packaging design for a food catering brand.",
    slides: [
      "linear-gradient(135deg,#d4a96a,#e8c48a,#c8946a)",
      "linear-gradient(160deg,#c8946a,#d4a96a,#e8c48a)",
      "linear-gradient(135deg,#d4a96a,#e8c48a,#c8946a)",
      "linear-gradient(160deg,#c8946a,#d4a96a,#e8c48a)",
    ],
  },
  {
    reveal: "reveal reveal-delay-7",
    slug: "magic-mansion",
    dataImg: "linear-gradient(135deg,#1a0a2e,#2d1054,#3d1a6e)",
    num: "008",
    name: "Magic Mansion",
    desc: "Rebranding for a Hamburg-based event series.",
    slides: [
      "linear-gradient(135deg,#1a0a2e,#2d1054,#3d1a6e)",
      "linear-gradient(160deg,#3d1a6e,#1a0a2e,#2d1054)",
      "linear-gradient(135deg,#1a0a2e,#2d1054,#3d1a6e)",
      "linear-gradient(160deg,#3d1a6e,#1a0a2e,#2d1054)",
    ],
  },
  {
    reveal: "reveal reveal-delay-8",
    slug: "kolsch-ipso",
    dataImg: "linear-gradient(135deg,#0a0a12,#1a1a2e,#0d0d1a)",
    num: "009",
    name: "Kölsch / IPSO",
    desc: "Album cover artwork for the album \"Kinema\" and Europe Tour design for \"Kölsch and the Machine\".",
    slides: [
      "linear-gradient(135deg,#0a0a12,#1a1a2e,#0d0d1a)",
      "linear-gradient(160deg,#1a1a2e,#0a0a12,#0d0d1a)",
      "linear-gradient(135deg,#0a0a12,#1a1a2e,#0d0d1a)",
      "linear-gradient(160deg,#1a1a2e,#0a0a12,#0d0d1a)",
    ],
  },
] as const;

const GRID_ITEMS = [
  {
    reveal: "reveal",
    slug: "zalazium-gmbh",
    bg: "linear-gradient(135deg,#c8c6c2,#d8d6d2,#bab8b4)",
    cat: "UX · Branding · Motion",
    num: "001",
    name: "Zalazium GmbH",
  },
  {
    reveal: "reveal reveal-delay-1",
    slug: "daily-grind-coffee",
    bg: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)",
    cat: "Branding · Packaging",
    num: "002",
    name: "Daily Grind Coffee",
  },
  {
    reveal: "reveal reveal-delay-2",
    slug: "donata-jan-trio",
    bg: "url(/images/projects/home/home-thumbnail.jpg) center/cover no-repeat",
    cat: "Album Artwork",
    num: "003",
    name: "Donata Jan Trio",
  },
  {
    reveal: "reveal reveal-delay-3",
    slug: "studio-liebe",
    bg: "url(/images/projects/studio_liebe/studio_liebe_thumbnail.jpg) center/cover no-repeat",
    cat: "Branding · Web Design",
    num: "004",
    name: "Studio Liebe",
  },
  {
    reveal: "reveal reveal-delay-4",
    slug: "resort-13",
    bg: "url(/images/projects/resort13/resort13_thumbnail_new.jpg) center/cover",
    cat: "Branding · Social Media",
    num: "005",
    name: "Resort 13",
  },
  {
    reveal: "reveal reveal-delay-5",
    slug: "forbes-cpxart",
    bg: "url(/images/projects/cpxart/cpxart_1.jpg) center/cover",
    cat: "Art · Fashion",
    num: "006",
    name: "Forbes x CPxArt",
  },
  {
    reveal: "reveal reveal-delay-6",
    slug: "carlitoz-way",
    bg: "linear-gradient(135deg,#d4a96a,#e8c48a,#c8946a)",
    cat: "Packaging Design",
    num: "007",
    name: "Carlitoz Way",
  },
  {
    reveal: "reveal reveal-delay-7",
    slug: "magic-mansion",
    bg: "linear-gradient(135deg,#1a0a2e,#2d1054,#3d1a6e)",
    cat: "Branding",
    num: "008",
    name: "Magic Mansion",
  },
  {
    reveal: "reveal reveal-delay-8",
    slug: "kolsch-ipso",
    bg: "linear-gradient(135deg,#0a0a12,#1a1a2e,#0d0d1a)",
    cat: "Album Artwork · Tour Design",
    num: "009",
    name: "Kölsch / IPSO",
  },
] as const;

export default function ProjectsPage() {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    const prevScroll = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    return () => {
      document.documentElement.style.scrollBehavior = prevScroll;
    };
  }, []);

  useEffect(() => {
    let pageDisposed = false;

    // VIEW TOGGLE
    const btnList = document.getElementById("btnList");
    const btnGrid = document.getElementById("btnGrid");
    const listView = document.getElementById("listView");
    const gridView = document.getElementById("gridView");

    function setView(v: "list" | "grid") {
      if (!listView || !gridView || !btnList || !btnGrid) return;
      if (v === "list") {
        listView.classList.remove("view-hidden");
        gridView.classList.add("view-hidden");
        btnList.classList.add("active");
        btnGrid.classList.remove("active");
      } else {
        gridView.classList.remove("view-hidden");
        listView.classList.add("view-hidden");
        btnGrid.classList.add("active");
        btnList.classList.remove("active");
      }
      document.querySelectorAll(".reveal").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add("visible");
        }
      });
    }

    let magneticUnlock: (() => void) | null = null;
    let magneticRemeasure: (() => void) | null = null;

    const onList = () => {
      setView("list");
      magneticRemeasure?.();
    };
    const onGrid = () => {
      setView("grid");
      magneticUnlock?.();
    };
    btnList?.addEventListener("click", onList);
    btnGrid?.addEventListener("click", onGrid);

    function syncViewForMobile() {
      if (window.innerWidth > 768) return;
      if (!listView || !gridView || !btnList || !btnGrid) return;
      listView.classList.remove("view-hidden");
      gridView.classList.add("view-hidden");
      btnList.classList.add("active");
      btnGrid.classList.remove("active");
    }
    syncViewForMobile();
    window.addEventListener("resize", syncViewForMobile);

    // IMAGE LOCK + SWAP + MAGNETIC SCROLL
    // Ported 1:1 from projects.html prototype (proven stable).
    let rafMagnetic = 0;
    let onWheel: ((e: WheelEvent) => void) | null = null;
    let onTouchStart: ((e: TouchEvent) => void) | null = null;
    let onTouchEnd: ((e: TouchEvent) => void) | null = null;
    let onResizeMeasure: (() => void) | null = null;
    let onPanelClick: (() => void) | null = null;

    const imgPanel = document.getElementById("imgPanel");
    const stickyImg = document.getElementById("stickyImg");
    const rows = Array.from(
      document.querySelectorAll(".project-row-entry"),
    ) as HTMLElement[];

    if (imgPanel && stickyImg && rows.length && window.innerWidth > 768) {
      const panel = imgPanel;
      const stickyEl = stickyImg;
      let imgH = 0;
      let lockY = 0;
      let unlockY = 0;
      let snapIdx = 0;
      let displayedImg = -1;
      let animating = false;
      let blocked = false;
      let mode: "free-top" | "locked" | "free-bottom" = "free-top";
      let magneticEnabled = true;

      function measure() {
        const wasLocked = mode === "locked";
        if (wasLocked) {
          panel.classList.remove("locked");
          panel.style.top = "";
        }
        const r = panel.getBoundingClientRect();
        imgH = r.height;
        const absTop = r.top + window.scrollY;
        lockY = absTop - (window.innerHeight / 2 - imgH / 2);
        const lastRow = rows[rows.length - 1];
        const lr = lastRow.getBoundingClientRect();
        unlockY = lr.bottom + window.scrollY - window.innerHeight * 0.3;
        if (wasLocked) {
          panel.classList.add("locked");
          panel.style.top = window.innerHeight / 2 - imgH / 2 + "px";
        }
      }

      function lock() {
        panel.classList.add("locked");
        panel.style.top = window.innerHeight / 2 - imgH / 2 + "px";
        panel.style.display = "";
      }

      function unlock() {
        panel.classList.remove("locked");
        panel.style.top = "";
      }

      function target(idx: number) {
        const row = rows[idx];
        const r = row.getBoundingClientRect();
        return r.top + r.height / 2 + window.scrollY - window.innerHeight / 2;
      }

      function swapImage() {
        const cy = window.innerHeight / 2;
        let best = 0;
        let bd = Infinity;
        rows.forEach((row, i) => {
          const r = row.getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - cy);
          if (d < bd) {
            bd = d;
            best = i;
          }
        });
        if (best !== displayedImg) {
          displayedImg = best;
          const bg = rows[best]?.getAttribute("data-img");
          stickyEl.classList.add("fading");
          setTimeout(() => {
            if (bg) {
              stickyEl.style.background = bg;
              stickyEl.style.backgroundSize = "cover";
              stickyEl.style.backgroundPosition = "center";
            }
            stickyEl.classList.remove("fading");
          }, 120);
        }
      }

      function anim(to: number, cb?: () => void) {
        animating = true;
        blocked = true;
        const from = window.scrollY;
        const diff = to - from;
        if (Math.abs(diff) < 1) {
          animating = false;
          blocked = false;
          if (cb) cb();
          return;
        }
        const t0 = performance.now();
        function step(now: number) {
          if (pageDisposed) {
            animating = false;
            blocked = false;
            return;
          }
          const t = Math.min((now - t0) / 550, 1);
          const e =
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          window.scrollTo(0, from + diff * e);
          if (t < 1) {
            requestAnimationFrame(step);
          } else {
            window.scrollTo(0, Math.round(to));
            animating = false;
            setTimeout(() => {
              blocked = false;
            }, 150);
            if (cb) cb();
          }
        }
        requestAnimationFrame(step);
      }

      function tick() {
        if (pageDisposed) return;
        if (magneticEnabled) {
          const sy = window.scrollY;
          if (mode === "free-top" && sy >= lockY) {
            mode = "locked";
            lock();
            snapIdx = 0;
            requestAnimationFrame(() => {
              if (pageDisposed || mode !== "locked") return;
              window.scrollTo(0, Math.round(target(0)));
            });
          }
          if (mode === "locked") swapImage();
          if (mode === "free-bottom" && sy <= unlockY && !animating) {
            mode = "locked";
            lock();
            snapIdx = rows.length - 1;
            anim(target(snapIdx));
          }
        }
        if (!pageDisposed) {
          rafMagnetic = requestAnimationFrame(tick);
        }
      }

      function go(dir: number) {
        if (animating || blocked) return;
        const next = snapIdx + dir;
        if (next < 0) return;
        if (next >= rows.length) {
          anim(unlockY + 100, () => {
            mode = "free-bottom";
            unlock();
            panel.style.display = "none";
          });
          return;
        }
        snapIdx = next;
        anim(target(snapIdx));
      }

      let lastW = 0;
      onWheel = (e: WheelEvent) => {
        if (!magneticEnabled || mode !== "locked") return;
        e.preventDefault();
        if (animating || blocked) return;
        const now = performance.now();
        if (now - lastW < 100) return;
        lastW = now;
        if (Math.abs(e.deltaY) > 5) go(e.deltaY > 0 ? 1 : -1);
      };
      window.addEventListener("wheel", onWheel, { passive: false });

      let ty0 = 0;
      onTouchStart = (e: TouchEvent) => {
        ty0 = e.touches[0].clientY;
      };
      onTouchEnd = (e: TouchEvent) => {
        if (!magneticEnabled || mode !== "locked" || animating || blocked)
          return;
        const d = ty0 - e.changedTouches[0].clientY;
        if (Math.abs(d) < 40) return;
        go(d > 0 ? 1 : -1);
      };
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });

      measure();
      onResizeMeasure = measure;
      window.addEventListener("resize", measure);
      rafMagnetic = requestAnimationFrame(tick);

      // Make the sticky image panel navigate to the active project on click
      const slugs = LIST_ROWS.map((r) => r.slug);
      onPanelClick = () => {
        const slug = slugs[displayedImg];
        if (slug) routerRef.current.push(`/projects/${slug}`);
      };
      panel.addEventListener("click", onPanelClick);
      panel.style.cursor = "pointer";

      magneticUnlock = () => {
        magneticEnabled = false;
        mode = "free-top";
        unlock();
        panel.style.display = "";
      };
      magneticRemeasure = () => {
        magneticEnabled = true;
        mode = "free-top";
        panel.style.display = "";
        measure();
      };
    }

    // GET IN TOUCH — vertical glass
    const getInTouchEl = document.getElementById("getInTouchCanvas");
    let sweepObs: IntersectionObserver | null = null;
    let gitInstance: ReturnType<typeof createVerticalGlassEffect> | null = null;

    if (getInTouchEl && getInTouchEl instanceof HTMLCanvasElement) {
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
        { shouldStop: () => pageDisposed },
      );

      document.fonts.ready.then(() => {
        if (pageDisposed) return;
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
                if (pageDisposed) return;
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

    // REVEAL
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

    // TERMINAL — projects.html split + interval sweep
    function splitIntoChars(el: HTMLElement) {
      const text = el.textContent || "";
      el.textContent = "";
      const segments = text.split("/");
      segments.forEach((seg, si) => {
        const wrapper = document.createElement("span");
        wrapper.style.whiteSpace = "nowrap";
        for (let i = 0; i < seg.length; i++) {
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = seg[i] === " " ? "\u00A0" : seg[i];
          wrapper.appendChild(span);
        }
        el.appendChild(wrapper);
        if (si < segments.length - 1) {
          const slash = document.createElement("span");
          slash.className = "char";
          slash.textContent = "/";
          el.appendChild(slash);
        }
      });
    }

    function terminalSweepTarget(link: HTMLElement) {
      return (link.querySelector(".terminal-link-label") as HTMLElement) ?? link;
    }

    const terminalCleanups: Array<() => void> = [];
    document.querySelectorAll(".terminal-link").forEach((link) => {
      const el = link as HTMLElement;
      const target = terminalSweepTarget(el);
      splitIntoChars(target);
      const chars = target.querySelectorAll(".char");
      let ht: ReturnType<typeof setInterval> | undefined;
      const onEnter = () => {
        let i = 0;
        if (ht) clearInterval(ht);
        ht = setInterval(() => {
          if (i > 0) chars[i - 1]?.classList.remove("active");
          if (i < chars.length) {
            chars[i]?.classList.add("active");
            i++;
          } else {
            if (ht) clearInterval(ht);
            setTimeout(
              () => chars[chars.length - 1]?.classList.remove("active"),
              70,
            );
          }
        }, 70);
      };
      const onLeave = () => {
        if (ht) clearInterval(ht);
        chars.forEach((c) => c.classList.remove("active"));
      };
      link.addEventListener("mouseenter", onEnter);
      link.addEventListener("mouseleave", onLeave);
      terminalCleanups.push(() => {
        link.removeEventListener("mouseenter", onEnter);
        link.removeEventListener("mouseleave", onLeave);
        if (ht) clearInterval(ht);
      });
    });

    // MOBILE CONTINUOUS SLIDESHOW (prototype: clone + RAF; run on mobile load & when resizing into mobile)
    const carouselInited = new WeakSet<HTMLElement>();
    const carouselRafByIdx: number[] = [];
    let carouselTimeout: number | null = null;
    let resizeCarouselTimer: number | null = null;

    function startMobileCarousels() {
      if (pageDisposed || window.innerWidth > 768) return;
      document.querySelectorAll(".carousel-track-inner").forEach((track, idx) => {
        const el = track as HTMLElement;
        if (carouselInited.has(el)) return;
        const originalWidth = el.scrollWidth;
        if (originalWidth <= 0) return;
        carouselInited.add(el);
        const originalHTML = el.innerHTML;
        el.innerHTML = originalHTML + originalHTML;
        const speed = 1.2 + (idx % 3) * 0.4;
        let pos = 0;
        function animate() {
          if (pageDisposed) return;
          pos -= speed;
          if (Math.abs(pos) >= originalWidth) {
            pos += originalWidth;
          }
          el.style.transform = `translateX(${pos}px)`;
          carouselRafByIdx[idx] = requestAnimationFrame(animate);
        }
        carouselRafByIdx[idx] = requestAnimationFrame(animate);
      });
    }

    function scheduleMobileCarousels() {
      if (window.innerWidth > 768) return;
      if (carouselTimeout !== null) window.clearTimeout(carouselTimeout);
      carouselTimeout = window.setTimeout(() => {
        carouselTimeout = null;
        startMobileCarousels();
      }, 100);
    }
    scheduleMobileCarousels();

    function onResizeCarousels() {
      if (resizeCarouselTimer !== null) window.clearTimeout(resizeCarouselTimer);
      resizeCarouselTimer = window.setTimeout(() => {
        resizeCarouselTimer = null;
        scheduleMobileCarousels();
      }, 150);
    }
    window.addEventListener("resize", onResizeCarousels);

    // ROW / GRID CLICK NAVIGATION
    // Attach click handlers to every [data-slug] element so the full row is
    // navigable. This is done in JS rather than <Link> to avoid any conflicts
    // with the magnetic scroll mechanism.
    const slugEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-slug]"),
    );
    const slugClickHandlers: Array<{ el: HTMLElement; fn: EventListener }> = [];
    slugEls.forEach((el) => {
      const slug = el.getAttribute("data-slug");
      if (!slug) return;
      el.style.cursor = "pointer";
      const fn: EventListener = () => {
        if (window.getSelection()?.toString()) return;
        routerRef.current.push(`/projects/${slug}`);
      };
      el.addEventListener("click", fn);
      slugClickHandlers.push({ el, fn });
    });

    return () => {
      pageDisposed = true;
      cancelAnimationFrame(rafMagnetic);
      carouselRafByIdx.forEach((id) => {
        if (id) cancelAnimationFrame(id);
      });
      if (carouselTimeout !== null) window.clearTimeout(carouselTimeout);
      if (resizeCarouselTimer !== null) window.clearTimeout(resizeCarouselTimer);
      window.removeEventListener("resize", syncViewForMobile);
      window.removeEventListener("resize", onResizeCarousels);
      btnList?.removeEventListener("click", onList);
      btnGrid?.removeEventListener("click", onGrid);
      if (onWheel) window.removeEventListener("wheel", onWheel);
      if (onResizeMeasure) window.removeEventListener("resize", onResizeMeasure);
      if (onTouchStart)
        window.removeEventListener("touchstart", onTouchStart);
      if (onTouchEnd) window.removeEventListener("touchend", onTouchEnd);
      if (onPanelClick) {
        const panelEl = document.getElementById("imgPanel");
        if (panelEl) panelEl.removeEventListener("click", onPanelClick);
      }
      if (gitInstance) {
        window.removeEventListener("resize", gitInstance.resize);
      }
      sweepObs?.disconnect();
      obs.disconnect();
      terminalCleanups.forEach((fn) => fn());
      slugClickHandlers.forEach(({ el, fn }) =>
        el.removeEventListener("click", fn),
      );
    };
  }, []);

  return (
    <div className="projects-page">
      <DotGrid dotColor="rgba(10,10,10,0.05)" />
      <SiteCursor variant="projects" />
      <SiteNav scrolledThreshold={40}>
        <li>
          <Link href="/projects" className="hoverable terminal-link">
            <span className="terminal-link-label">Projects</span>
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hoverable terminal-link"
          >
            <span className="terminal-link-label">About</span>
          </Link>
        </li>
        <li>
          <a href={CONTACT_MAILTO} className="hoverable terminal-link">
            <span className="terminal-link-label">Get in Touch</span>
          </a>
        </li>
      </SiteNav>

      <section className="projects-header">
        <div className="projects-header-top">
          <span className="projects-title reveal">Projects</span>
          <div className="view-toggle reveal reveal-delay-1">
            <span>[</span>
            <span>View</span>
            <button
              type="button"
              className="view-btn active hoverable"
              id="btnList"
            >
              List
            </button>
            <button type="button" className="view-btn hoverable" id="btnGrid">
              Grid
            </button>
            <span>]</span>
          </div>
        </div>
      </section>

      <section className="projects-container">
        <div className="projects-list" id="listView">
          <div className="projects-list-image" id="imgPanel">
            <div
              className="projects-list-img"
              id="stickyImg"
              style={{
                background:
                  "linear-gradient(135deg,#c8c6c2,#d8d6d2,#bab8b4)",
              }}
            />
          </div>
          <div className="projects-list-rows" id="listRows">
            {LIST_ROWS.map((row) => (
              <div
                key={row.num}
                className={`project-row-entry ${row.reveal} hoverable`}
                data-img={row.dataImg}
                data-slug={row.slug}
              >
                <div className="project-row-num">{row.num}</div>
                <div className="project-row-info">
                  <div className="project-row-name">{row.name}</div>
                  <div className="project-row-desc">{row.desc}</div>
                </div>
                <div className="project-row-carousel">
                  <div className="carousel-track">
                    <div className="carousel-track-inner">
                      {row.slides.map((bg, i) => (
                        <div
                          key={i}
                          className="carousel-slide"
                          style={{ background: bg }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="projects-grid view-hidden" id="gridView">
          {GRID_ITEMS.map((g) => (
            <div
              key={g.name}
              className={`project-grid-item ${g.reveal} hoverable`}
              data-slug={g.slug}
            >
              <div className="project-grid-img-wrap">
                <div
                  className="project-grid-img"
                  style={{ background: g.bg }}
                />
              </div>
              <div className="project-grid-meta">
                <span className="project-grid-name">
                  {g.num}&nbsp;&nbsp;&nbsp;&nbsp;{g.name}
                </span>
                <span className="project-grid-cat">{g.cat}</span>
              </div>
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
