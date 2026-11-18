"use client";

import type { ProjectMedia, StoryAccount } from "@/lib/projectsData";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** Pointer held longer than this pauses instead of tapping. */
const HOLD_MS = 180;
/** A second tap within this window counts as a double tap (like). */
const DOUBLE_TAP_MS = 260;

type Props = {
  item: ProjectMedia;
  name: string;
  account?: StoryAccount;
};

const fmt = (s: number) => {
  if (!Number.isFinite(s)) return "00:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
};

/**
 * A 9:16 video presented as a reel: plays muted while on screen, tap for
 * sound, hold to pause, double-tap to like, drag the bar to scrub.
 */
export function ReelPlayer({ item, name, account }: Props) {
  const handle = account?.handle ?? name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const reel = item.reel ?? {};

  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(false);
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(0);
  const [flash, setFlash] = useState<{ id: number; kind: "sound" | "mute" | "play" | "pause" } | null>(null);
  const [captionOpen, setCaptionOpen] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [time, setTime] = useState({ now: 0, total: 0 });

  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const progress = useRef(0);
  const holdTimer = useRef<number | null>(null);
  const tapTimer = useRef<number | null>(null);
  const didHold = useRef(false);
  const lastTap = useRef(0);
  // Mirrors so delayed taps (timeouts) read the latest state.
  const mutedRef = useRef(muted);
  const pausedRef = useRef(paused);
  useEffect(() => {
    mutedRef.current = muted;
    pausedRef.current = paused;
  }, [muted, paused]);

  const playing = inView && !paused && !held && !scrubbing;

  // Only play while at least half the player is visible and the tab is active.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let visible = false;
    let first = true;
    const update = () => setInView(visible && document.visibilityState === "visible");
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
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

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.play().catch(() => {
        // Sound was blocked: fall back to muted so the reel still runs.
        v.muted = true;
        setMuted(true);
        v.play().catch(() => {});
      });
    } else {
      v.pause();
    }
  }, [playing]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  // Progress bar is written to the DOM every frame; restore it after renders.
  useLayoutEffect(() => {
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress.current})`;
  });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let raf = 0;
    let lastSecond = -1;
    const tick = () => {
      if (v.duration) {
        progress.current = v.currentTime / v.duration;
        if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress.current})`;
        const second = Math.floor(v.currentTime);
        if (second !== lastSecond) {
          lastSecond = second;
          setTime({ now: v.currentTime, total: v.duration });
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const showFlash = (kind: "sound" | "mute" | "play" | "pause") =>
    setFlash({ id: performance.now(), kind });

  const toggleMute = () => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    showFlash(next ? "mute" : "sound");
  };

  const togglePause = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    showFlash(next ? "pause" : "play");
  };

  const like = () => {
    setLiked(true);
    setBurst((b) => b + 1);
  };

  const clearTimers = () => {
    if (holdTimer.current !== null) window.clearTimeout(holdTimer.current);
    holdTimer.current = null;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    didHold.current = false;
    clearTimers();
    holdTimer.current = window.setTimeout(() => {
      didHold.current = true;
      setHeld(true);
    }, HOLD_MS);
  };

  const onPointerUp = () => {
    clearTimers();
    if (didHold.current) {
      didHold.current = false;
      setHeld(false);
      return;
    }
    const now = performance.now();
    if (now - lastTap.current < DOUBLE_TAP_MS) {
      // Second tap: like, and cancel the pending sound toggle.
      lastTap.current = 0;
      if (tapTimer.current !== null) window.clearTimeout(tapTimer.current);
      tapTimer.current = null;
      like();
      return;
    }
    lastTap.current = now;
    tapTimer.current = window.setTimeout(() => {
      tapTimer.current = null;
      toggleMute();
    }, DOUBLE_TAP_MS);
  };

  const onPointerCancel = () => {
    clearTimers();
    didHold.current = false;
    setHeld(false);
  };

  useEffect(
    () => () => {
      if (holdTimer.current !== null) window.clearTimeout(holdTimer.current);
      if (tapTimer.current !== null) window.clearTimeout(tapTimer.current);
    },
    [],
  );

  // Scrub bar: press anywhere on it and drag.
  const seekTo = (clientX: number, bar: HTMLElement) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = bar.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    v.currentTime = p * v.duration;
    progress.current = p;
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
    setTime({ now: v.currentTime, total: v.duration });
  };

  const onScrubDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* A synthetic pointer has no browser id to capture. */
    }
    setScrubbing(true);
    seekTo(e.clientX, e.currentTarget);
  };

  const onScrubMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (scrubbing) seekTo(e.clientX, e.currentTarget);
  };

  const onScrubUp = () => setScrubbing(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const v = videoRef.current;
    if (e.key === " " || e.key === "k") togglePause();
    else if (e.key === "m") toggleMute();
    else if (e.key === "l") setLiked((l) => !l);
    else if (v && e.key === "ArrowRight") v.currentTime = Math.min(v.duration || 0, v.currentTime + 5);
    else if (v && e.key === "ArrowLeft") v.currentTime = Math.max(0, v.currentTime - 5);
    else return;
    e.preventDefault();
  };

  const audio = reel.audio ?? `${handle} · Original audio`;
  const avatar = account?.avatar ? (
    <img src={account.avatar} alt="" draggable={false} />
  ) : (
    <span>{handle.slice(0, 1)}</span>
  );

  return (
    <div className="story-stage reel-stage reveal" ref={stageRef}>
      <div
        className={`story-frame reel-frame${held ? " is-held" : ""}${playing ? " is-playing" : ""}${
          scrubbing ? " is-scrubbing" : ""
        }`}
        role="region"
        aria-roledescription="video player"
        aria-label={`${name}: reel`}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <video
          ref={videoRef}
          className="reel-video"
          src={item.src}
          poster={item.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={item.alt ?? name}
        />

        <div className="story-shade story-shade-top" aria-hidden="true" />
        <div className="story-shade reel-shade-bottom" aria-hidden="true" />

        <div
          className="story-tap hoverable"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onPointerLeave={onPointerCancel}
          onContextMenu={(e) => e.preventDefault()}
          aria-hidden="true"
        />

        {flash ? (
          <span key={flash.id} className="reel-flash" aria-hidden="true">
            <ReelIcon kind={flash.kind} />
          </span>
        ) : null}

        {burst > 0 ? (
          <span key={burst} className="reel-burst" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 20.3 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9A4.6 4.6 0 0 1 19.4 13z" fill="currentColor" />
            </svg>
          </span>
        ) : null}

        <div className="reel-top">
          <span className="reel-title">Reels</span>
          <button
            type="button"
            className="story-icon-btn hoverable"
            onClick={toggleMute}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            aria-pressed={!muted}
          >
            <ReelIcon kind={muted ? "mute" : "sound"} />
          </button>
        </div>

        <div className="reel-rail">
          <button
            type="button"
            className={`reel-rail-btn story-like hoverable${liked ? " is-liked" : ""}`}
            onClick={() => (liked ? setLiked(false) : like())}
            aria-pressed={liked}
            aria-label="Like reel"
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
            {reel.likes ? <span className="reel-count">{reel.likes}</span> : null}
          </button>
          <span className="reel-rail-btn" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path
                d="M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            {reel.comments ? <span className="reel-count">{reel.comments}</span> : null}
          </span>
          <span className="reel-rail-btn" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M21 3 10.2 13.8M21 3l-6.8 18-4-7.2L3 9.8z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="reel-disc" aria-hidden="true">
            {avatar}
          </span>
        </div>

        <div className="reel-bottom">
          <div className="reel-account">
            <span className="story-avatar">{avatar}</span>
            <span className="story-handle">{handle}</span>
            <span className="reel-follow" aria-hidden="true">
              Follow
            </span>
          </div>
          {reel.caption ? (
            <button
              type="button"
              className={`reel-caption hoverable${captionOpen ? " is-open" : ""}`}
              onClick={() => setCaptionOpen((o) => !o)}
              aria-expanded={captionOpen}
            >
              {reel.caption}
            </button>
          ) : null}
          <div className="reel-audio" aria-label={`Audio: ${audio}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="6" cy="18" r="3" fill="currentColor" />
              <circle cx="17" cy="16" r="3" fill="currentColor" />
            </svg>
            <span className="reel-audio-track">
              <span className="reel-audio-text">
                {audio}
                <span aria-hidden="true">{audio}</span>
              </span>
            </span>
          </div>
        </div>

        <div
          className="reel-scrub hoverable"
          onPointerDown={onScrubDown}
          onPointerMove={onScrubMove}
          onPointerUp={onScrubUp}
          onPointerCancel={onScrubUp}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(time.total)}
          aria-valuenow={Math.round(time.now)}
          aria-valuetext={`${fmt(time.now)} of ${fmt(time.total)}`}
        >
          <span className="reel-scrub-track">
            <span ref={fillRef} className="reel-scrub-fill" />
          </span>
        </div>
      </div>

      <div className="story-caption" aria-hidden="true">
        <span>
          Reel {fmt(time.now)} / {fmt(time.total)}
        </span>
        <span className="story-hint">Tap for sound · Hold to pause · Double-tap to like</span>
      </div>
    </div>
  );
}

function ReelIcon({ kind }: { kind: "sound" | "mute" | "play" | "pause" }) {
  if (kind === "play")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
      </svg>
    );
  if (kind === "pause")
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4.5h3.5v15H7zM13.5 4.5H17v15h-3.5z" fill="currentColor" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
      {kind === "sound" ? (
        <path d="M15.5 8.8a4.5 4.5 0 0 1 0 6.4M18 6.3a8 8 0 0 1 0 11.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <path d="m15.5 9.5 5 5m0-5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </svg>
  );
}
