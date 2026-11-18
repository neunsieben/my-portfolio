"use client";

import type { ProjectMedia, StoryAccount } from "@/lib/projectsData";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/** How long a still story stays up before advancing, like the real app. */
const IMAGE_SECONDS = 5;
/** Pointer held longer than this pauses instead of navigating. */
const HOLD_MS = 180;

type Props = {
  items: ProjectMedia[];
  name: string;
  account?: StoryAccount;
};

/**
 * 9:16 media presented as a story: segmented progress, tap left/right to step,
 * hold to pause. Plays only while on screen and loops back to the first story.
 */
export function StoryPlayer({ items, name, account }: Props) {
  const count = items.length;
  const handle = account?.handle ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "");

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(false);
  const [liked, setLiked] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const progress = useRef(0);
  const elapsed = useRef(0);
  const holdTimer = useRef<number | null>(null);
  const didHold = useRef(false);

  const playing = inView && !paused && !held;
  const current = items[index];

  const go = useCallback(
    (next: number) => {
      elapsed.current = 0;
      progress.current = 0;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  // Only run while at least half the player is visible and the tab is active.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let visible = false;
    let first = true;
    const update = () => setInView(visible && document.visibilityState === "visible");
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
        // Respect reduced motion: start paused, the viewer steps through by hand.
        if (first && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setPaused(true);
        }
        first = false;
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
  }, []);

  // Videos: restart the current one when it comes up, keep the rest still.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i !== index) {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [index]);

  useEffect(() => {
    const v = videoRefs.current[index];
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing, index]);

  // The active segment is written straight to the DOM; restore it after any render.
  useLayoutEffect(() => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${progress.current})`;
  });

  // Drive the active progress segment.
  useEffect(() => {
    const bar = barRef.current;
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const v = videoRefs.current[index];
      if (current?.type === "video" && v) {
        progress.current = v.duration ? v.currentTime / v.duration : 0;
      } else {
        elapsed.current += now - last;
        const seconds = current?.duration ?? IMAGE_SECONDS;
        progress.current = Math.min(1, elapsed.current / (seconds * 1000));
      }
      last = now;
      if (bar) bar.style.transform = `scaleX(${progress.current})`;
      if (current?.type !== "video" && progress.current >= 1) {
        go(index + 1);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, index, current, go]);

  const clearHold = () => {
    if (holdTimer.current !== null) window.clearTimeout(holdTimer.current);
    holdTimer.current = null;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    didHold.current = false;
    clearHold();
    holdTimer.current = window.setTimeout(() => {
      didHold.current = true;
      setHeld(true);
    }, HOLD_MS);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    clearHold();
    if (didHold.current) {
      didHold.current = false;
      setHeld(false);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    go(x < 0.3 ? index - 1 : index + 1);
  };

  const onPointerCancel = () => {
    clearHold();
    didHold.current = false;
    setHeld(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(index + 1);
    else if (e.key === "ArrowLeft") go(index - 1);
    else if (e.key === " " || e.key === "k") setPaused((p) => !p);
    else return;
    e.preventDefault();
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="story-stage reveal" ref={stageRef}>
      <button
        type="button"
        className="story-arrow story-arrow-prev hoverable"
        onClick={() => go(index - 1)}
        aria-label="Previous story"
      >
        ←
      </button>

      <div
        className={`story-frame${held ? " is-held" : ""}`}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${name}: stories`}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div className="story-media">
          {items.map((item, i) => (
            <div
              key={item.src}
              className={`story-slide${i === index ? " is-active" : ""}`}
              aria-hidden={i !== index}
            >
              {item.type === "video" ? (
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  src={item.src}
                  poster={item.poster}
                  muted
                  playsInline
                  preload={i === 0 ? "auto" : "metadata"}
                  onEnded={() => go(index + 1)}
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.alt ?? name}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
              )}
            </div>
          ))}
        </div>

        <div className="story-shade story-shade-top" aria-hidden="true" />
        <div className="story-shade story-shade-bottom" aria-hidden="true" />

        {/* Tap layer sits under the controls so buttons stay clickable. */}
        <div
          className="story-tap hoverable"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onPointerLeave={onPointerCancel}
          onContextMenu={(e) => e.preventDefault()}
          aria-hidden="true"
        />

        <div className="story-top">
          <div className="story-progress" aria-hidden="true">
            {items.map((item, i) => (
              <span className="story-progress-track" key={item.src}>
                <span
                  ref={i === index ? barRef : undefined}
                  className="story-progress-fill"
                  style={
                    i === index
                      ? undefined
                      : { transform: `scaleX(${i < index ? 1 : 0})` }
                  }
                />
              </span>
            ))}
          </div>

          <div className="story-header">
            <span className="story-avatar">
              {account?.avatar ? (
                <img src={account.avatar} alt="" draggable={false} />
              ) : (
                <span>{handle.slice(0, 1)}</span>
              )}
            </span>
            <span className="story-handle">{handle}</span>
            {account?.time ? <span className="story-time">{account.time}</span> : null}
            <button
              type="button"
              className="story-icon-btn hoverable"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play stories" : "Pause stories"}
            >
              {paused ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 4.5h3.5v15H7zM13.5 4.5H17v15h-3.5z" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="story-bottom">
          <span className="story-reply" aria-hidden="true">
            Reply to {handle}…
          </span>
          <button
            type="button"
            className={`story-icon-btn story-like hoverable${liked ? " is-liked" : ""}`}
            onClick={() => setLiked((l) => !l)}
            aria-pressed={liked}
            aria-label="Like story"
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
        </div>

        <span className="sr-only" aria-live="polite">
          {`Story ${index + 1} of ${count}${current?.alt ? `: ${current.alt}` : ""}`}
        </span>
      </div>

      <button
        type="button"
        className="story-arrow story-arrow-next hoverable"
        onClick={() => go(index + 1)}
        aria-label="Next story"
      >
        →
      </button>

      <div className="story-caption" aria-hidden="true">
        <span>
          Story {pad(index + 1)} / {pad(count)}
        </span>
        <span className="story-hint">Tap to skip · Hold to pause</span>
      </div>
    </div>
  );
}
