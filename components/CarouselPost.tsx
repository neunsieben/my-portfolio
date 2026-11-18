"use client";

import type { ProjectMedia, StoryAccount } from "@/lib/projectsData";
import { useEffect, useRef, useState } from "react";

/** Share of the slide width a drag must travel to change slide. */
const SWIPE_DISTANCE = 0.18;
/** Or a flick faster than this (px per ms). */
const SWIPE_SPEED = 0.45;
/** How much a drag past the first or last slide is allowed to move. */
const EDGE_RESIST = 0.3;
const DOUBLE_TAP_MS = 280;

type Props = {
  items: ProjectMedia[];
  name: string;
  account?: StoryAccount;
};

/**
 * Square slides presented as a carousel post. The slides can be designed as
 * one continuous panorama: dragging shows two slides side by side, and the
 * panorama view lays the whole strip out at once.
 */
export function CarouselPost({ items, name, account }: Props) {
  const count = items.length;
  const handle = account?.handle ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const post = items[0]?.post ?? {};

  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [view, setView] = useState<"post" | "panorama">("post");
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [burst, setBurst] = useState(0);
  const [captionOpen, setCaptionOpen] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const panoRef = useRef<HTMLDivElement>(null);
  const start = useRef({ x: 0, y: 0, t: 0, id: -1, axis: "" as "" | "x" | "y" });
  const lastTap = useRef(0);
  const lastTouchLike = useRef(-1e9);
  const wheelLock = useRef(0);
  const wheelSum = useRef(0);

  const go = (next: number) => setIndex(Math.max(0, Math.min(count - 1, next)));

  const like = () => {
    setLiked(true);
    setBurst((b) => b + 1);
  };

  // ── Post view: drag / swipe ────────────────────────────────
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    start.current = { x: e.clientX, y: e.clientY, t: e.timeStamp, id: e.pointerId, axis: "" };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = start.current;
    if (s.id !== e.pointerId) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (!s.axis) {
      if (Math.hypot(dx, dy) < 6) return;
      // Decide once: sideways drags swipe, vertical ones scroll the page.
      s.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (s.axis === "x") {
        setDragging(true);
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          /* A synthetic pointer has no browser id to capture. */
        }
      }
    }
    if (s.axis !== "x") return;
    const atEdge = (index === 0 && dx > 0) || (index === count - 1 && dx < 0);
    setDrag(atEdge ? dx * EDGE_RESIST : dx);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = start.current;
    if (s.id !== e.pointerId) return;
    start.current.id = -1;
    const width = viewportRef.current?.clientWidth || 1;
    const dx = e.clientX - s.x;
    if (s.axis === "x") {
      const speed = Math.abs(dx) / Math.max(1, e.timeStamp - s.t);
      if (Math.abs(dx) > width * SWIPE_DISTANCE || speed > SWIPE_SPEED) {
        go(index + (dx < 0 ? 1 : -1));
      }
      setDrag(0);
      setDragging(false);
      return;
    }
    if (s.axis === "" && e.pointerType === "touch") {
      // A tap: two in a row likes the post. Mouse uses dblclick instead.
      if (e.timeStamp - lastTap.current < DOUBLE_TAP_MS) {
        lastTap.current = 0;
        lastTouchLike.current = e.timeStamp;
        like();
      } else {
        lastTap.current = e.timeStamp;
      }
    }
  };

  const onPointerCancel = () => {
    start.current.id = -1;
    setDrag(0);
    setDragging(false);
  };

  // Trackpads: a sideways two-finger swipe steps one slide.
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || view !== "post") return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (performance.now() < wheelLock.current) return;
      wheelSum.current += e.deltaX;
      if (Math.abs(wheelSum.current) > 40) {
        setIndex((i) => Math.max(0, Math.min(count - 1, i + (wheelSum.current > 0 ? 1 : -1))));
        wheelSum.current = 0;
        wheelLock.current = performance.now() + 450;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [view, count]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (view !== "post") return;
    if (e.key === "ArrowRight") go(index + 1);
    else if (e.key === "ArrowLeft") go(index - 1);
    else if (e.key === "l") setLiked((l) => !l);
    else return;
    e.preventDefault();
  };

  // ── Panorama view: drag the strip with a mouse ─────────────
  const pano = useRef({ x: 0, left: 0, id: -1 });
  const onPanoDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = panoRef.current;
    if (!el) return;
    pano.current = { x: e.clientX, left: el.scrollLeft, id: e.pointerId };
    el.classList.add("is-dragging");
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* A synthetic pointer has no browser id to capture. */
    }
  };
  const onPanoMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = panoRef.current;
    if (!el || pano.current.id !== e.pointerId) return;
    el.scrollLeft = pano.current.left - (e.clientX - pano.current.x);
  };
  const onPanoUp = () => {
    pano.current.id = -1;
    panoRef.current?.classList.remove("is-dragging");
  };

  // Open the panorama at the slide the post was showing.
  useEffect(() => {
    const el = panoRef.current;
    if (view !== "panorama" || !el) return;
    const slide = el.querySelector<HTMLElement>(".carousel-pano-slide");
    if (slide) el.scrollLeft = Math.max(0, slide.offsetWidth * index - el.clientWidth / 2 + slide.offsetWidth / 2);
  }, [view, index]);

  const pad = (n: number) => String(n).padStart(2, "0");
  const avatar = account?.avatar ? (
    <img src={account.avatar} alt="" draggable={false} />
  ) : account?.avatarColor ? (
    <span className="story-avatar-fill" style={{ background: account.avatarColor }} />
  ) : (
    <span>{handle.slice(0, 1)}</span>
  );

  return (
    // The class list stays fixed: the page's reveal observer adds "visible" to it.
    <div className="story-stage carousel-stage reveal" data-view={view}>
      {view === "post" ? (
        <article
          className="carousel-card"
          aria-roledescription="carousel"
          aria-label={`${name}: carousel post`}
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          <header className="carousel-head">
            <span className="story-avatar">{avatar}</span>
            <span className="carousel-handle">{handle}</span>
            <span className="carousel-more" aria-hidden="true">
              •••
            </span>
          </header>

          <div
            ref={viewportRef}
            className={`carousel-viewport hoverable${dragging ? " is-dragging" : ""}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onDoubleClick={(e) => {
              // Touch double taps are handled in pointerup; skip the dblclick they also fire.
              if (e.timeStamp - lastTouchLike.current > 600) like();
            }}
          >
            <div
              className="carousel-track"
              style={{ transform: `translate3d(calc(${-index * 100}% + ${drag}px), 0, 0)` }}
            >
              {items.map((item, i) => (
                <div className="carousel-slide" key={item.src} aria-hidden={i !== index}>
                  <img
                    src={item.src}
                    alt={item.alt ?? `${name}, slide ${i + 1}`}
                    loading={Math.abs(i - index) <= 1 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                  />
                </div>
              ))}
            </div>

            <span className="carousel-count" aria-hidden="true">
              {index + 1}/{count}
            </span>

            {index > 0 ? (
              <button
                type="button"
                className="carousel-nav carousel-nav-prev hoverable"
                onClick={() => go(index - 1)}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label="Previous slide"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m14.5 6-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : null}
            {index < count - 1 ? (
              <button
                type="button"
                className="carousel-nav carousel-nav-next hoverable"
                onClick={() => go(index + 1)}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label="Next slide"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m9.5 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : null}

            {burst > 0 ? (
              <span key={burst} className="reel-burst" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13z" fill="currentColor" />
                </svg>
              </span>
            ) : null}
          </div>

          <div className="carousel-actions">
            <div className="carousel-actions-left">
              <button
                type="button"
                className={`carousel-action story-like hoverable${liked ? " is-liked" : ""}`}
                onClick={() => (liked ? setLiked(false) : like())}
                aria-pressed={liked}
                aria-label="Like post"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13z"
                    fill={liked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="carousel-action" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="carousel-action" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M21 3 10.2 13.8M21 3l-6.8 18-4-7.2L3 9.8z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </span>
            </div>

            <div className="carousel-dots" aria-hidden="true">
              {items.map((item, i) => (
                <span key={item.src} className={`carousel-dot${i === index ? " is-active" : ""}`} />
              ))}
            </div>

            <button
              type="button"
              className={`carousel-action carousel-save hoverable${saved ? " is-saved" : ""}`}
              onClick={() => setSaved((v) => !v)}
              aria-pressed={saved}
              aria-label="Save post"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 3.5h12v17l-6-4.5-6 4.5z" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {post.likes || liked ? (
            <p className="carousel-likes">{post.likes ? `${post.likes} likes` : "Liked by you"}</p>
          ) : null}

          {post.caption ? (
            <button
              type="button"
              className={`carousel-caption hoverable${captionOpen ? " is-open" : ""}`}
              onClick={() => setCaptionOpen((o) => !o)}
              aria-expanded={captionOpen}
            >
              <strong>{handle}</strong> {post.caption}
            </button>
          ) : null}

          <span className="sr-only" aria-live="polite">{`Slide ${index + 1} of ${count}`}</span>
        </article>
      ) : (
        <div
          ref={panoRef}
          className="carousel-pano hoverable"
          onPointerDown={onPanoDown}
          onPointerMove={onPanoMove}
          onPointerUp={onPanoUp}
          onPointerCancel={onPanoUp}
          tabIndex={0}
          aria-label={`${name}: all ${count} slides as one panorama`}
        >
          <div className="carousel-pano-strip">
            {items.map((item, i) => (
              <div className="carousel-pano-slide" key={item.src}>
                <img src={item.src} alt={item.alt ?? `${name}, slide ${i + 1}`} draggable={false} decoding="async" />
                <span className="carousel-pano-num" aria-hidden="true">
                  {pad(i + 1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="story-caption carousel-bar">
        <span aria-hidden="true">
          {view === "post" ? `Carousel ${pad(index + 1)} / ${pad(count)}` : `Panorama · ${count} slides · Drag to explore`}
        </span>
        <span className="carousel-toggle" role="group" aria-label="View">
          <button
            type="button"
            className={`hoverable${view === "post" ? " is-active" : ""}`}
            onClick={() => setView("post")}
            aria-pressed={view === "post"}
          >
            Post
          </button>
          <span aria-hidden="true">/</span>
          <button
            type="button"
            className={`hoverable${view === "panorama" ? " is-active" : ""}`}
            onClick={() => setView("panorama")}
            aria-pressed={view === "panorama"}
          >
            Panorama
          </button>
        </span>
      </div>
    </div>
  );
}
