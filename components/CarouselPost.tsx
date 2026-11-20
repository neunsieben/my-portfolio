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
 * Square slides presented as a carousel post. Slides designed as one
 * continuous panorama line up while dragging, two side by side.
 */
export function CarouselPost({ items, name, account }: Props) {
  const count = items.length;
  const single = count === 1;
  const handle = account?.handle ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const post = items[0]?.post ?? {};
  const portrait = post.format === "portrait";
  const hasVideo = items.some((item) => item.type === "video");

  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [burst, setBurst] = useState(0);
  const [captionOpen, setCaptionOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [inView, setInView] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
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

  // ── Drag / swipe ───────────────────────────────────────────
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
    if (!el) return;
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
  }, [count]);

  // Video slides play only while the post is on screen.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !hasVideo) return;
    let visible = false;
    const update = () => setInView(visible && document.visibilityState === "visible");
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
        update();
      },
      { threshold: 0.5 },
    );
    io.observe(stage);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [hasVideo]);

  // The visible video plays from the start; the rest wait, rewound.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i !== index) {
        v.pause();
        v.currentTime = 0;
        return;
      }
      v.muted = muted;
      if (!inView) {
        v.pause();
        return;
      }
      v.play().catch(() => {
        // Sound needs a gesture in some browsers: keep playing, muted.
        if (!v.muted) {
          v.muted = true;
          setMuted(true);
          v.play().catch(() => {});
        }
      });
    });
  }, [index, inView, muted]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(index + 1);
    else if (e.key === "ArrowLeft") go(index - 1);
    else if (e.key === "l") setLiked((l) => !l);
    else if (e.key === "m" && items[index]?.type === "video") setMuted((m) => !m);
    else return;
    e.preventDefault();
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  const avatar = account?.avatar ? (
    <img src={account.avatar} alt="" draggable={false} />
  ) : account?.avatarColor ? (
    <span className="story-avatar-fill" style={{ background: account.avatarColor }} />
  ) : (
    <span>{handle.slice(0, 1)}</span>
  );

  return (
    <div
      ref={stageRef}
      className="story-stage carousel-stage reveal"
      style={portrait ? ({ "--slide-ratio": 0.8, "--slide-aspect": "4 / 5" } as React.CSSProperties) : undefined}
    >
      <article
        className="carousel-card"
        aria-roledescription={single ? undefined : "carousel"}
        aria-label={`${name}: ${single ? "post" : "carousel post"}`}
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
                {item.type === "video" ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    src={item.src}
                    poster={item.poster}
                    aria-label={item.alt ?? `${name}, slide ${i + 1}`}
                    muted
                    loop
                    playsInline
                    preload={i === index ? "auto" : Math.abs(i - index) === 1 ? "metadata" : "none"}
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt ?? `${name}, slide ${i + 1}`}
                    loading={Math.abs(i - index) <= 1 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                  />
                )}
              </div>
            ))}
          </div>

          {single ? null : (
            <span className="carousel-count" aria-hidden="true">
              {index + 1}/{count}
            </span>
          )}

          {items[index]?.type === "video" ? (
            <button
              type="button"
              className="carousel-sound hoverable"
              onClick={() => setMuted((m) => !m)}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label={muted ? "Turn sound on" : "Turn sound off"}
              aria-pressed={!muted}
            >
              {muted ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
                  <path d="m16 9.5 5 5m0-5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
                  <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                </svg>
              )}
            </button>
          ) : null}

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
            {single
              ? null
              : items.map((item, i) => (
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

        <div className="carousel-meta">
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
        </div>

        {single ? null : (
          <span className="sr-only" aria-live="polite">{`Slide ${index + 1} of ${count}`}</span>
        )}
      </article>

      <div className="story-caption carousel-bar" aria-hidden="true">
        <span>{single ? "Post" : `Carousel ${pad(index + 1)} / ${pad(count)}`}</span>
        <span className="story-hint">{single ? "Double-tap to like" : "Swipe · Double-tap to like"}</span>
      </div>
    </div>
  );
}
