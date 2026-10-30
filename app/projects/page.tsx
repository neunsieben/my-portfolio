"use client";

import { DotGrid } from "@/components/DotGrid";
import { SiteCursor } from "@/components/SiteCursor";
import { SiteNav } from "@/components/SiteNav";
import { getCanvasHeadFontStack } from "@/lib/canvasHeadFontStack";
import { PROJECT_DETAILS } from "@/lib/projectsData";
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
    dataImg: "url(/images/projects/donata_jan_trio/donata_cover_mockup.jpg)",
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
    name: "Resort 13 x PALLAS",
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
    dataImg: "url(/images/projects/cpxart/cpxart_yellow_jacket.jpg)",
    num: "006",
    name: "CPxArt x Forbes",
    desc: "Hand-painted bomber jackets for CPxArt, featured in Forbes — wearable art merging painting and fashion.",
    slides: [
      "url(/images/projects/cpxart/cpxart_yellow_jacket.jpg)",
      "url(/images/projects/cpxart/cpxart_red_jacket.jpg)",
      "url(/images/projects/cpxart/cpxart_yellow_jacket.jpg)",
      "url(/images/projects/cpxart/cpxart_red_jacket.jpg)",
    ],
  },
  {
    reveal: "reveal reveal-delay-6",
    slug: "carlitoz-way",
    dataImg: "url(/images/projects/carlitoz_way/carlitoz_box_top.jpg)",
    num: "007",
    name: "Carlitoz Way",
    desc: "Packaging design for a food catering brand.",
    slides: [
      "url(/images/projects/carlitoz_way/carlitoz_box_top.jpg)",
      "url(/images/projects/carlitoz_way/carlitoz_close_up.jpg)",
      "url(/images/projects/carlitoz_way/carlitoz_box_top.jpg)",
      "url(/images/projects/carlitoz_way/carlitoz_close_up.jpg)",
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
    dataImg: "url(/images/projects/koelsch/koelsch_kinema_spotify.jpg)",
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

function bgSrc(bg: string) {
  const m = bg.match(/^url\((.+)\)/);
  return m?.[1] ?? null;
}

type PreviewItem =
  | { kind: "image"; src: string }
  | { kind: "video"; src: string; poster?: string }
  | { kind: "bg"; bg: string };

const PREVIEW_DIR = "/images/previews/";
const ORIGINAL_DIR = "/images/projects/";

/** Lightweight copy from scripts/make-previews.sh; falls back on error. */
function previewSrc(src: string) {
  return src.startsWith(ORIGINAL_DIR) && src.endsWith(".jpg")
    ? PREVIEW_DIR + src.slice(ORIGINAL_DIR.length)
    : src;
}

function previewItems(slug: string, fallback: readonly string[]): PreviewItem[] {
  const fromMedia: PreviewItem[] = [];
  for (const m of PROJECT_DETAILS.find((p) => p.slug === slug)?.media ?? []) {
    if (!m.src) continue;
    if (m.type === "image")
      fromMedia.push({ kind: "image", src: previewSrc(m.src) });
    if (m.type === "video")
      fromMedia.push({ kind: "video", src: m.src, poster: m.poster });
  }
  if (fromMedia.length) return fromMedia;
  return fallback.map((bg) => {
    const src = bgSrc(bg);
    return src
      ? { kind: "image" as const, src: previewSrc(src) }
      : { kind: "bg" as const, bg };
  });
}

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
    bg: "url(/images/projects/donata_jan_trio/donata_cover_mockup.jpg)",
    cat: "Album Artwork",
    num: "003",
    name: "Donata Jan Trio",
  },
  {
    reveal: "reveal reveal-delay-3",
    slug: "studio-liebe",
    bg: "url(/images/projects/studio_liebe/studio_liebe_thumbnail.jpg)",
    cat: "Branding · Web Design",
    num: "004",
    name: "Studio Liebe",
  },
  {
    reveal: "reveal reveal-delay-4",
    slug: "resort-13",
    bg: "url(/images/projects/resort13/resort13_thumbnail_new.jpg)",
    cat: "Branding · Social Media",
    num: "005",
    name: "Resort 13 x PALLAS",
  },
  {
    reveal: "reveal reveal-delay-5",
    slug: "forbes-cpxart",
    bg: "url(/images/projects/cpxart/cpxart_yellow_jacket.jpg)",
    cat: "Art · Fashion",
    num: "006",
    name: "CPxArt x Forbes",
  },
  {
    reveal: "reveal reveal-delay-6",
    slug: "carlitoz-way",
    bg: "url(/images/projects/carlitoz_way/carlitoz_box_top.jpg)",
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
    bg: "url(/images/projects/koelsch/koelsch_kinema_spotify.jpg)",
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
    const root = document.documentElement;
    const prevScroll = root.style.scrollBehavior;
    const prevAnchor = root.style.overflowAnchor;
    root.style.scrollBehavior = "auto";
    root.style.overflowAnchor = "none";
    return () => {
      root.style.scrollBehavior = prevScroll;
      root.style.overflowAnchor = prevAnchor;
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
    let stopPreviewCycle: (() => void) | null = null;

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
      let previewCycleTimer: number | null = null;
      let previewCycleIdx = 0;
      let previewFront = 0;
      let previewGen = 0;
      let previewFirstPaint = true;
      let couplePreviewToAnim = false;
      let switchDrive: {
        incoming: HTMLElement;
        outgoing: HTMLElement | null;
        dir: 1 | -1;
        gen: number;
        travel: number;
        resolve: (ok: boolean) => void;
      } | null = null;
      const previewLayers = Array.from(
        stickyEl.querySelectorAll<HTMLElement>("[data-preview-layer]"),
      );
      const MAGNETIC_MS = 550;
      const PREVIEW_SLIDE_MS = 720;
      // Match the magnetic snap so the frame moves with the list.
      const PREVIEW_SWITCH_MS = MAGNETIC_MS;
      const PREVIEW_SLIDE_OVERLAP_PX = 2;
      const PREVIEW_CYCLE_MS = 3400;
      const PREVIEW_SLIDE_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";
      const reducePreviewMotion = () =>
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      function pauseLayer(layer: HTMLElement | undefined) {
        const vid = layer?.querySelector("video");
        vid?.pause();
      }

      function stopLayerAnims(layer: HTMLElement) {
        layer.getAnimations().forEach((anim) => anim.cancel());
      }

      stopPreviewCycle = () => {
        if (previewCycleTimer !== null) window.clearInterval(previewCycleTimer);
        previewCycleTimer = null;
        previewGen += 1;
        if (switchDrive) {
          const pending = switchDrive;
          switchDrive = null;
          pending.resolve(false);
        }
        previewLayers.forEach((layer) => {
          stopLayerAnims(layer);
          pauseLayer(layer);
        });
        warmVideos.forEach((v) => {
          v.removeAttribute("src");
          v.load();
        });
        warmVideos.length = 0;
      };

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
        if (wasLocked) pin(window.scrollY >= lockY - 1);
      }

      // While locked, the preview follows the page until it reaches the
      // viewport centre (scrollY === lockY) and only then stays fixed, so it
      // never covers the headline and the hand-off has no visual jump.
      function pin(on: boolean) {
        if (on) {
          panel.classList.add("locked");
          panel.style.top = window.innerHeight / 2 - imgH / 2 + "px";
        } else {
          panel.classList.remove("locked");
          panel.style.top = "";
        }
      }

      function enterFirstProject() {
        if (!magneticEnabled || !rows[0]) return;
        measure();
        mode = "locked";
        snapIdx = 0;
        lock();
        window.scrollTo(0, Math.max(0, Math.round(target(0))));
        const slug = rows[0].getAttribute("data-slug") ?? "";
        const bg = rows[0].getAttribute("data-img") ?? "";
        displayedImg = 0;
        startPreviewCycle(slug, bg);
      }

      function lock() {
        pin(window.scrollY >= lockY - 1);
        panel.style.display = "";
      }

      function unlock() {
        panel.classList.remove("locked");
        panel.style.top = "";
      }

      function target(idx: number) {
        const row = rows[idx];
        const r = row.getBoundingClientRect();
        const centered =
          r.top + r.height / 2 + window.scrollY - window.innerHeight / 2;
        if (idx !== 0) return centered;
        // The title itself is translated by its reveal animation, so measure
        // its untransformed container instead.
        const title = document.querySelector(
          ".projects-page .projects-header-top",
        );
        const nav = document.querySelector("nav");
        if (!title || !nav) return centered;
        const titleAbsTop = title.getBoundingClientRect().top + window.scrollY;
        const keepTitleBelow = nav.getBoundingClientRect().bottom + 20;
        const maxScroll = titleAbsTop - keepTitleBelow;
        return Math.min(centered, Math.max(0, maxScroll));
      }

      // Setting the same src again would restart the download, so only
      // assign when the layer holds something else.
      function fillPreviewLayer(
        layer: HTMLElement,
        item: PreviewItem,
        play = true,
      ) {
        const photo = layer.querySelector("img");
        const vid = layer.querySelector("video");
        layer.style.backgroundImage = "";
        if (item.kind === "image") {
          if (vid) {
            vid.pause();
            vid.style.display = "none";
          }
          if (photo) {
            if (photo.getAttribute("src") !== item.src) photo.src = item.src;
            photo.style.display = "block";
          }
        } else if (item.kind === "video") {
          if (photo) photo.style.display = "none";
          if (vid) {
            if (item.poster) vid.setAttribute("poster", item.poster);
            else vid.removeAttribute("poster");
            if (vid.getAttribute("src") !== item.src) {
              vid.src = item.src;
              vid.load();
            }
            vid.style.display = "block";
            if (play) vid.play().catch(() => {});
            else vid.pause();
          }
        } else {
          if (photo) photo.style.display = "none";
          if (vid) {
            vid.pause();
            vid.style.display = "none";
          }
          layer.style.backgroundImage = item.bg;
        }
      }

      // Resolves once the layer can paint a real frame (decoded image or
      // first video frame), or after timeoutMs as a last resort.
      function waitForPreviewMedia(
        layer: HTMLElement,
        item: PreviewItem,
        timeoutMs: number,
      ) {
        const timeout = new Promise<void>((resolve) =>
          window.setTimeout(resolve, timeoutMs),
        );
        if (item.kind === "image") {
          const photo = layer.querySelector("img");
          if (!photo) return Promise.resolve();
          const loaded =
            photo.complete && photo.naturalWidth > 0
              ? Promise.resolve()
              : new Promise<void>((resolve) => {
                  photo.addEventListener("load", () => resolve(), {
                    once: true,
                  });
                  photo.addEventListener("error", () => resolve(), {
                    once: true,
                  });
                });
          const ready = loaded
            .then(() => photo.decode?.())
            .catch(() => undefined);
          return Promise.race([ready, timeout]);
        }
        if (item.kind === "video") {
          const vid = layer.querySelector("video");
          if (!vid || vid.readyState >= 2) return Promise.resolve();
          return Promise.race([
            new Promise<void>((resolve) => {
              const done = () => resolve();
              vid.addEventListener("loadeddata", done, { once: true });
              vid.addEventListener("error", done, { once: true });
            }),
            timeout,
          ]);
        }
        return Promise.resolve();
      }

      const warmed = new Set<string>();
      const warmVideos: HTMLVideoElement[] = [];
      function warm(item: PreviewItem | undefined) {
        if (!item || item.kind === "bg" || warmed.has(item.src)) return;
        warmed.add(item.src);
        if (item.kind === "image") {
          const im = new Image();
          im.decoding = "async";
          im.src = item.src;
          im.decode?.().catch(() => {});
        } else {
          const v = document.createElement("video");
          v.muted = true;
          v.preload = "auto";
          v.src = item.src;
          v.load();
          warmVideos.push(v);
        }
      }

      function rowItems(idx: number) {
        const row = rows[idx];
        if (!row) return [];
        return previewItems(row.getAttribute("data-slug") ?? "", [
          row.getAttribute("data-img") ?? "",
        ]);
      }

      function warmAround(idx: number) {
        rowItems(idx).forEach(warm);
        [idx + 1, idx - 1, idx + 2].forEach((i) => warm(rowItems(i)[0]));
      }

      function hideLayer(layer: HTMLElement) {
        stopLayerAnims(layer);
        layer.style.opacity = "0";
        layer.style.transform = "scale(1.1)";
      }

      function showLayerOpen(layer: HTMLElement) {
        stopLayerAnims(layer);
        layer.style.opacity = "1";
        layer.style.transform = "scale(1)";
      }

      function nextFrame() {
        return new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
      }

      function applySwitchDrive(e: number) {
        const drive = switchDrive;
        if (!drive) return;
        const xIn = (1 - e) * drive.dir * drive.travel;
        const xOut = -e * drive.dir * drive.travel;
        drive.incoming.style.transform = `translate3d(${xIn}px, 0, 0)`;
        if (drive.outgoing) {
          drive.outgoing.style.transform = `translate3d(${xOut}px, 0, 0)`;
        }
      }

      function settleSwitchDrive(ok: boolean) {
        const drive = switchDrive;
        if (!drive) return;
        switchDrive = null;
        const current = drive.gen === previewGen;
        if (current) {
          showLayerOpen(drive.incoming);
          if (drive.outgoing && drive.outgoing !== drive.incoming) {
            hideLayer(drive.outgoing);
            pauseLayer(drive.outgoing);
          }
        }
        drive.resolve(ok && current);
      }

      // "slide" = next item inside a project; "switch" = first item of another
      // project, sliding in from the side the user is scrolling towards.
      async function transitionPreview(
        item: PreviewItem,
        mode: "cut" | "slide" | "switch",
        dir: 1 | -1 = 1,
      ): Promise<boolean> {
        const ms = mode === "switch" ? PREVIEW_SWITCH_MS : PREVIEW_SLIDE_MS;
        const waitMs = mode === "slide" ? 900 : 80;
        if (previewLayers.length < 2) return false;
        const gen = ++previewGen;

        const inFlight = previewLayers.flatMap((layer) => layer.getAnimations());
        if (inFlight.length) {
          if (mode === "switch") {
            // Start with the scroll, don't wait out a rest-cycle slide.
            inFlight.forEach((a) => a.finish());
          } else {
            await Promise.all(
              inFlight.map((a) => a.finished.catch(() => undefined)),
            );
            if (gen !== previewGen) return false;
          }
        }

        const incoming = previewLayers[1 - previewFront];
        const outgoing = previewLayers[previewFront];
        if (!incoming) return false;

        const instant =
          mode === "cut" || previewFirstPaint || reducePreviewMotion();
        previewFirstPaint = false;

        hideLayer(incoming);
        incoming.style.zIndex = "2";
        fillPreviewLayer(incoming, item);

        // Magnetic project-switches share the snap's rAF clock, so they
        // must not wait on decode. In-project slides still wait to paint.
        const couple = mode === "switch" && couplePreviewToAnim && !instant;
        if (!couple) {
          await waitForPreviewMedia(incoming, item, waitMs);
          if (gen !== previewGen) return false;
        }

        const hasOutgoing =
          !!outgoing &&
          outgoing !== incoming &&
          Number.parseFloat(getComputedStyle(outgoing).opacity) > 0.01;

        if (outgoing && outgoing !== incoming) {
          outgoing.style.zIndex = "1";
        }

        if (instant || !hasOutgoing) {
          showLayerOpen(incoming);
          if (outgoing && outgoing !== incoming) {
            hideLayer(outgoing);
            pauseLayer(outgoing);
          }
          previewFront = 1 - previewFront;
          return true;
        }

        // Both layers travel the same distance with a constant overlap, so
        // sub-pixel rounding can never open a seam between them.
        const SEAM = PREVIEW_SLIDE_OVERLAP_PX;
        const ahead = `translate3d(calc(100% - ${SEAM}px), 0, 0)`;
        const behind = `translate3d(calc(-100% + ${SEAM}px), 0, 0)`;
        const inFrom = dir === 1 ? ahead : behind;
        const outTo = dir === 1 ? behind : ahead;

        if (couple) {
          return new Promise<boolean>((resolve) => {
            if (switchDrive) {
              switchDrive.resolve(false);
              switchDrive = null;
            }
            const w = stickyEl.getBoundingClientRect().width || 1;
            incoming.style.opacity = "1";
            if (outgoing) stopLayerAnims(outgoing);
            previewFront = 1 - previewFront;
            switchDrive = {
              incoming,
              outgoing,
              dir,
              gen,
              travel: Math.max(1, w - SEAM),
              resolve,
            };
            applySwitchDrive(0);
          });
        }

        const timing: KeyframeAnimationOptions = {
          duration: ms,
          easing: PREVIEW_SLIDE_EASE,
          fill: "forwards",
        };
        incoming.style.opacity = "1";
        incoming.style.transform = inFrom;
        await nextFrame();
        if (gen !== previewGen) return false;

        const inAnim = incoming.animate(
          [{ transform: inFrom }, { transform: "translate3d(0, 0, 0)" }],
          timing,
        );

        if (hasOutgoing && outgoing) {
          stopLayerAnims(outgoing);
          outgoing.animate(
            [{ transform: "translate3d(0, 0, 0)" }, { transform: outTo }],
            timing,
          );
        }

        previewFront = 1 - previewFront;

        try {
          await inAnim.finished;
        } catch {
          return false;
        }
        if (gen !== previewGen) return false;
        showLayerOpen(incoming);
        if (outgoing && outgoing !== incoming) {
          hideLayer(outgoing);
          pauseLayer(outgoing);
        }
        return true;
      }

      function startPreviewCycle(
        slug: string,
        fallback: string,
        enterDir: 0 | 1 | -1 = 0,
      ) {
        if (previewCycleTimer !== null) window.clearInterval(previewCycleTimer);
        previewCycleTimer = null;
        const items = previewItems(slug, [fallback]);
        previewCycleIdx = 0;
        if (!items[0]) return;
        const rowIdx = rows.findIndex(
          (r) => r.getAttribute("data-slug") === slug,
        );
        if (rowIdx >= 0) warmAround(rowIdx);

        // Load the upcoming item into the hidden back layer while the
        // current one rests, so the next slide starts on a ready frame.
        const prefillNext = (done: boolean) => {
          if (!done || items.length < 2) return;
          const next = items[(previewCycleIdx + 1) % items.length];
          const back = previewLayers[1 - previewFront];
          if (next && back) fillPreviewLayer(back, next, false);
        };

        const entry =
          enterDir === 0
            ? transitionPreview(items[0], "cut")
            : transitionPreview(items[0], "switch", enterDir);
        void entry.then(prefillNext);
        if (items.length < 2) return;
        previewCycleTimer = window.setInterval(() => {
          previewCycleIdx = (previewCycleIdx + 1) % items.length;
          const next = items[previewCycleIdx];
          if (next) void transitionPreview(next, "slide").then(prefillNext);
        }, PREVIEW_CYCLE_MS);
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
          const dir = displayedImg < 0 ? 0 : best > displayedImg ? 1 : -1;
          displayedImg = best;
          const slug = rows[best]?.getAttribute("data-slug") ?? "";
          const bg = rows[best]?.getAttribute("data-img") ?? "";
          startPreviewCycle(slug, bg, dir);
        }
      }

      function anim(to: number, cb?: () => void) {
        animating = true;
        blocked = true;
        const from = window.scrollY;
        const diff = to - from;
        if (Math.abs(diff) < 1) {
          applySwitchDrive(1);
          settleSwitchDrive(true);
          animating = false;
          blocked = false;
          if (cb) cb();
          return;
        }
        const t0 = performance.now();
        function step(now: number) {
          if (pageDisposed) {
            settleSwitchDrive(false);
            animating = false;
            blocked = false;
            return;
          }
          const t = Math.min((now - t0) / MAGNETIC_MS, 1);
          const e =
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          window.scrollTo(0, from + diff * e);
          applySwitchDrive(e);
          if (t < 1) {
            requestAnimationFrame(step);
          } else {
            window.scrollTo(0, Math.round(to));
            applySwitchDrive(1);
            settleSwitchDrive(true);
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
          if (mode === "locked") {
            pin(sy >= lockY - 1);
            if (!animating && !blocked) swapImage();
          }
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
        displayedImg = next;
        const slug = rows[next]?.getAttribute("data-slug") ?? "";
        const bg = rows[next]?.getAttribute("data-img") ?? "";
        couplePreviewToAnim = true;
        startPreviewCycle(slug, bg, dir > 0 ? 1 : -1);
        couplePreviewToAnim = false;
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

      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      measure();
      let realignTimer: number | null = null;
      const realign = () => {
        if (pageDisposed || !magneticEnabled || mode !== "locked") return;
        if (animating) return;
        window.scrollTo(0, Math.max(0, Math.round(target(snapIdx))));
      };
      onResizeMeasure = () => {
        measure();
        if (mode === "locked") lock();
        if (realignTimer !== null) window.clearTimeout(realignTimer);
        realignTimer = window.setTimeout(() => {
          realignTimer = null;
          measure();
          realign();
        }, 120);
      };
      window.addEventListener("resize", onResizeMeasure);
      document.fonts?.ready.then(() => {
        measure();
        realign();
      });
      enterFirstProject();
      requestAnimationFrame(() => {
        if (!pageDisposed && magneticEnabled) enterFirstProject();
      });
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
        panel.style.display = "";
        enterFirstProject();
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
        el.querySelectorAll("video").forEach((v) => {
          const video = v as HTMLVideoElement;
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.play().catch(() => {});
        });
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

    const onPreviewImgError = (e: Event) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement)) return;
      const src = img.getAttribute("src") ?? "";
      if (!src.startsWith(PREVIEW_DIR)) return;
      img.src = ORIGINAL_DIR + src.slice(PREVIEW_DIR.length);
    };
    document.addEventListener("error", onPreviewImgError, true);

    return () => {
      pageDisposed = true;
      document.removeEventListener("error", onPreviewImgError, true);
      stopPreviewCycle?.();
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
      <DotGrid dotColor="rgba(10,10,10,0.12)" />
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
            <div className="projects-list-img" id="stickyImg">
              <div className="preview-layer" data-preview-layer="0">
                <img alt="" />
                <video muted loop playsInline preload="auto" />
              </div>
              <div className="preview-layer" data-preview-layer="1">
                <img alt="" />
                <video muted loop playsInline preload="auto" />
              </div>
            </div>
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
                      {previewItems(row.slug, row.slides).map((item, i) => {
                        if (item.kind === "image") {
                          return (
                            <img
                              key={i}
                              className="carousel-slide"
                              src={item.src}
                              alt=""
                            />
                          );
                        }
                        if (item.kind === "video") {
                          return (
                            <video
                              key={i}
                              className="carousel-slide"
                              src={item.src}
                              poster={item.poster}
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="metadata"
                            />
                          );
                        }
                        return (
                          <div
                            key={i}
                            className="carousel-slide"
                            style={{ backgroundImage: item.bg }}
                          />
                        );
                      })}
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
                {bgSrc(g.bg) ? (
                  <img
                    className="project-grid-img"
                    src={bgSrc(g.bg) ?? ""}
                    alt={g.name}
                  />
                ) : (
                  <div
                    className="project-grid-img"
                    style={{ backgroundImage: g.bg }}
                  />
                )}
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
