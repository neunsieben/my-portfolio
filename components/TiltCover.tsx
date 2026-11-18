"use client";

import { useEffect, useRef } from "react";

const MAX_TILT = 16;
/*
 * Feel. Lower follow values = heavier: the cover eases after the hand
 * instead of snapping to it. Momentum keeps a released drag gliding.
 */
const TILT_FOLLOW_MOUSE = 0.075;
const TILT_FOLLOW_TOUCH = 0.16;
const ZOOM_FOLLOW = 0.085;
const PAN_FOLLOW = 0.14;
const WHEEL_SPEED = 0.0009;
const PINCH_WHEEL_SPEED = 0.0045;
/** Share of glide speed kept each frame after release. */
const MOMENTUM_DECAY = 0.9;

/** Never smaller than the cover first appears. */
const MIN_ZOOM = 1;
const MAX_ZOOM = 2.6;

function clampZoom(scale: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale));
}
/** Fixed lamp: left of the frame, above it, and in front. It never follows the pointer. */
const LAMP = [-0.9, -0.78, 1.15] as const;
/** The cover only tips a few degrees. Shade a little more so the paper still reads. */
const SHADE_GAIN = 2.2;

function shadePoint(u: number, v: number, rx: number, ry: number) {
  rx *= SHADE_GAIN;
  ry *= SHADE_GAIN;
  const ryR = (ry * Math.PI) / 180;
  const rxR = (rx * Math.PI) / 180;
  const cy = Math.cos(ryR);
  const sy = Math.sin(ryR);
  const x1 = u * cy;
  const z1 = -u * sy;
  const cx = Math.cos(rxR);
  const sx = Math.sin(rxR);
  const y2 = v * cx - z1 * sx;
  const z2 = v * sx + z1 * cx;
  const lx = LAMP[0] - x1;
  const ly = LAMP[1] - y2;
  const lz = LAMP[2] - z2;
  const dist = Math.hypot(lx, ly, lz) || 1;
  const ndotl = Math.max(
    0,
    (sy * lx + -sx * cy * ly + cx * cy * lz) / dist,
  );
  return ndotl / (1 + dist * dist * 0.11);
}

/** Broad paper falloff from the fixed lamp. No specular hotspot. */
function paperLight(rx: number, ry: number, strong: boolean) {
  const samples = [-0.5, 0, 0.5].flatMap((v) =>
    [-0.5, 0, 0.5].map((u) => shadePoint(u, v, rx, ry)),
  );
  const left = shadePoint(-0.5, 0, rx, ry);
  const right = shadePoint(0.5, 0, rx, ry);
  const top = shadePoint(0, -0.5, rx, ry);
  const bottom = shadePoint(0, 0.5, rx, ry);
  const angle = (Math.atan2(right - left, -(bottom - top)) * 180) / Math.PI;
  const maxB = Math.max(...samples);
  const minB = Math.min(...samples);
  const lit = Math.min(1, Math.max(0, (maxB - 0.15) / 0.7));
  const shd = Math.min(1, Math.max(0, (minB - 0.15) / 0.7));
  const lightA = (strong ? 0.058 + lit * 0.017 : 0.16 + lit * 0.18).toFixed(3);
  const shadowA = (0.28 + (1 - shd) * 0.22).toFixed(3);
  if (strong) {
    return `linear-gradient(${angle.toFixed(2)}deg, rgba(255, 246, 232, 0) 0%, rgba(255, 246, 232, 0) 38%, rgba(255, 228, 196, 0.023) 70%, rgba(255, 248, 236, ${lightA}) 100%)`;
  }
  return `linear-gradient(${angle.toFixed(2)}deg, rgba(36, 26, 20, ${shadowA}) 0%, rgba(150, 136, 120, 0.06) 48%, rgba(255, 246, 232, ${lightA}) 100%)`;
}

/** Black 4:3 window. Only the square cover inside it tilts. */
export function TiltCover({
  src,
  alt,
  className,
  lamp,
}: {
  src: string;
  alt: string;
  className?: string;
  lamp?: "strong";
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const plane = planeRef.current;
    const light = lightRef.current;
    if (!frame || !plane || !light) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let targetScale = 1;
    let currentScale = 1;
    // Pan offset in px, from the frame centre. Only non-zero while zoomed in.
    let targetPanX = 0;
    let targetPanY = 0;
    let currentPanX = 0;
    let currentPanY = 0;
    let active = false;
    let pinching = false;
    let pinchStartDist = 0;
    let pinchStartScale = 1;
    let pinchStartMid = { x: 0, y: 0 };
    let pinchStartPan = { x: 0, y: 0 };
    let dragging = false;
    let dragStart = { x: 0, y: 0 };
    let dragStartPan = { x: 0, y: 0 };
    // Drag velocity (px per frame) and the glide that continues after release.
    let lastDrag = { x: 0, y: 0, t: 0 };
    let velX = 0;
    let velY = 0;
    let glideX = 0;
    let glideY = 0;
    const pointers = new Map<number, { x: number; y: number }>();
    let tapStart = { x: 0, y: 0, t: 0 };
    let lastTap = 0;

    let follow = TILT_FOLLOW_MOUSE;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const coverTransform = (rx: number, ry: number, scale: number) =>
      `translate(${currentPanX}px, ${currentPanY}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;

    const zoomed = () => targetScale > MIN_ZOOM + 0.001;

    /** Keep the cover's edges from being dragged past the frame's edges. */
    const clampPan = () => {
      const side = plane.offsetWidth * targetScale;
      const maxX = Math.max(0, (side - frame.clientWidth) / 2);
      const maxY = Math.max(0, (side - frame.clientHeight) / 2);
      targetPanX = Math.max(-maxX, Math.min(maxX, targetPanX));
      targetPanY = Math.max(-maxY, Math.min(maxY, targetPanY));
    };

    /** Point relative to the frame centre, in px. */
    const local = (x: number, y: number) => {
      const rect = frame.getBoundingClientRect();
      return { x: x - rect.left - rect.width / 2, y: y - rect.top - rect.height / 2 };
    };

    /** Change scale while keeping the cover point under `at` in place. */
    const zoomAt = (scale: number, at: { x: number; y: number }, fromScale: number, fromPan: { x: number; y: number }) => {
      targetScale = clampZoom(scale);
      const k = targetScale / fromScale;
      targetPanX = at.x - (at.x - fromPan.x) * k;
      targetPanY = at.y - (at.y - fromPan.y) * k;
      clampPan();
    };

    const startDrag = (x: number, y: number) => {
      dragging = true;
      dragStart = { x, y };
      dragStartPan = { x: targetPanX, y: targetPanY };
      lastDrag = { x, y, t: performance.now() };
      velX = velY = glideX = glideY = 0;
      frame.classList.add("is-panning");
    };

    const stopDrag = (release = false) => {
      if (dragging && release && !reduce) {
        // Ignore a drag that had already come to rest before the release.
        const stale = performance.now() - lastDrag.t > 80;
        glideX = stale ? 0 : velX;
        glideY = stale ? 0 : velY;
      }
      dragging = false;
      frame.classList.remove("is-panning");
    };

    const paint = () => {
      const zoomFollow = reduce ? 1 : ZOOM_FOLLOW;
      currentX += (targetX - currentX) * follow;
      currentY += (targetY - currentY) * follow;
      currentScale += (targetScale - currentScale) * zoomFollow;
      if (!dragging && (Math.abs(glideX) > 0.05 || Math.abs(glideY) > 0.05)) {
        targetPanX += glideX;
        targetPanY += glideY;
        const beforeX = targetPanX;
        const beforeY = targetPanY;
        clampPan();
        // Hitting an edge stops the glide on that axis.
        glideX = targetPanX === beforeX ? glideX * MOMENTUM_DECAY : 0;
        glideY = targetPanY === beforeY ? glideY * MOMENTUM_DECAY : 0;
      } else {
        glideX = glideY = 0;
      }
      const panFollow = reduce ? 1 : PAN_FOLLOW;
      currentPanX += (targetPanX - currentPanX) * panFollow;
      currentPanY += (targetPanY - currentPanY) * panFollow;
      const rx = currentY * -MAX_TILT;
      const ry = currentX * MAX_TILT;
      plane.style.transform = coverTransform(rx, ry, currentScale);
      const shine = paperLight(rx, ry, lamp === "strong");
      light.style.backgroundImage =
        lamp === "strong" ? shine : `${shine}, var(--paper-grain)`;
      const stillMoving =
        Math.abs(targetX - currentX) > 0.001 ||
        Math.abs(targetY - currentY) > 0.001 ||
        Math.abs(targetScale - currentScale) > 0.001 ||
        Math.abs(targetPanX - currentPanX) > 0.1 ||
        Math.abs(targetPanY - currentPanY) > 0.1 ||
        glideX !== 0 ||
        glideY !== 0;
      if (active || stillMoving) {
        raf = requestAnimationFrame(paint);
      } else {
        raf = 0;
        currentPanX = targetPanX;
        currentPanY = targetPanY;
        plane.style.transform = coverTransform(0, 0, currentScale);
        light.style.backgroundImage = "";
      }
    };

    const kick = () => {
      frame.classList.toggle("is-zoomed", zoomed());
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const pointerDistance = () => {
      const pts = [...pointers.values()];
      if (pts.length < 2) return 0;
      return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    };

    const onMove = (event: PointerEvent) => {
      if (pointers.has(event.pointerId)) {
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      }
      if (pointers.size >= 2) {
        const distance = pointerDistance();
        const pts = [...pointers.values()];
        const mid = local((pts[0].x + pts[1].x) / 2, (pts[0].y + pts[1].y) / 2);
        if (!pinching) {
          pinching = true;
          stopDrag();
          glideX = glideY = 0;
          pinchStartDist = distance;
          pinchStartScale = targetScale;
          pinchStartMid = mid;
          pinchStartPan = { x: targetPanX, y: targetPanY };
        } else if (pinchStartDist > 8) {
          // Scale around where the fingers started, and follow them as they move.
          const scale = pinchStartScale * (distance / pinchStartDist);
          zoomAt(scale, pinchStartMid, pinchStartScale, pinchStartPan);
          targetPanX += mid.x - pinchStartMid.x;
          targetPanY += mid.y - pinchStartMid.y;
          clampPan();
        }
        targetX = 0;
        targetY = 0;
        active = true;
        kick();
        return;
      }
      if (dragging) {
        targetPanX = dragStartPan.x + event.clientX - dragStart.x;
        targetPanY = dragStartPan.y + event.clientY - dragStart.y;
        const now = performance.now();
        const dt = Math.max(1, now - lastDrag.t);
        // Smoothed speed, scaled to one 60 fps frame.
        velX = velX * 0.6 + ((event.clientX - lastDrag.x) / dt) * 16.7 * 0.4;
        velY = velY * 0.6 + ((event.clientY - lastDrag.y) / dt) * 16.7 * 0.4;
        lastDrag = { x: event.clientX, y: event.clientY, t: now };
        clampPan();
        // Hold the cover flat while it is being moved.
        targetX = 0;
        targetY = 0;
        active = true;
        kick();
        return;
      }
      if (reduce) return;
      const rect = frame.getBoundingClientRect();
      const touch = event.pointerType === "touch";
      // A finger stays nearer the middle than a mouse, so reach full tilt sooner.
      const gain = touch ? 1.7 : 1;
      follow = touch ? TILT_FOLLOW_TOUCH : TILT_FOLLOW_MOUSE;
      targetX = Math.max(
        -0.5,
        Math.min(0.5, ((event.clientX - rect.left) / rect.width - 0.5) * gain),
      );
      targetY = Math.max(
        -0.5,
        Math.min(0.5, ((event.clientY - rect.top) / rect.height - 0.5) * gain),
      );
      active = true;
      kick();
    };

    const onLeave = (event?: PointerEvent) => {
      if (event?.pointerType === "touch") return;
      if (dragging) return;
      targetX = 0;
      targetY = 0;
      active = false;
      kick();
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 1) tapStart = { x: event.clientX, y: event.clientY, t: event.timeStamp };
      const capture = event.pointerType === "touch" || zoomed();
      if (capture) {
        try {
          frame.setPointerCapture(event.pointerId);
        } catch {
          /* A synthetic pointer has no browser id to capture. */
        }
      }
      // Zoomed in: a mouse drag or a single finger moves the cover around.
      if (pointers.size === 1 && zoomed()) {
        startDrag(event.clientX, event.clientY);
      }
      onMove(event);
    };

    const endPointer = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2 && pinching) {
        pinching = false;
        // One finger left after a pinch: carry on moving from where it is.
        const rest = [...pointers.values()][0];
        if (rest && zoomed()) startDrag(rest.x, rest.y);
      }
      if (pointers.size === 0) {
        stopDrag(true);
        kick();
      }
      if (event.pointerType !== "touch") return;
      if (pointers.size > 0) return;
      // Touch has no reliable dblclick here (touch-action: none), so spot a double tap.
      const quick =
        event.timeStamp - tapStart.t < 250 &&
        Math.hypot(event.clientX - tapStart.x, event.clientY - tapStart.y) < 10;
      if (quick && event.timeStamp - lastTap < 320) {
        lastTap = 0;
        onDoubleClick();
      } else if (quick) {
        lastTap = event.timeStamp;
      }
      targetX = 0;
      targetY = 0;
      active = false;
      kick();
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      let delta = event.deltaY;
      if (event.deltaMode === 1) delta *= 16;
      else if (event.deltaMode === 2) delta *= frame.clientHeight;
      const speed = event.ctrlKey ? PINCH_WHEEL_SPEED : WHEEL_SPEED;
      zoomAt(
        targetScale * Math.exp(-delta * speed),
        local(event.clientX, event.clientY),
        targetScale,
        { x: targetPanX, y: targetPanY },
      );
      kick();
    };

    /** Double-click or double-tap returns to the starting view. */
    const onDoubleClick = () => {
      targetScale = MIN_ZOOM;
      targetPanX = 0;
      targetPanY = 0;
      glideX = glideY = 0;
      stopDrag();
      kick();
    };

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerdown", onDown);
    frame.addEventListener("pointerup", endPointer);
    frame.addEventListener("pointercancel", endPointer);
    frame.addEventListener("pointerleave", onLeave);
    frame.addEventListener("wheel", onWheel, { passive: false });
    frame.addEventListener("dblclick", onDoubleClick);
    return () => {
      cancelAnimationFrame(raf);
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerdown", onDown);
      frame.removeEventListener("pointerup", endPointer);
      frame.removeEventListener("pointercancel", endPointer);
      frame.removeEventListener("pointerleave", onLeave);
      frame.removeEventListener("wheel", onWheel);
      frame.removeEventListener("dblclick", onDoubleClick);
    };
  }, [lamp]);

  return (
    <div
      ref={frameRef}
      className={`tilt-cover${lamp === "strong" ? " tilt-cover-strong" : ""}${className ? ` ${className}` : ""}`}
    >
      <div ref={planeRef} className="tilt-cover-art">
        <img
          src={src}
          alt={alt}
          draggable={false}
          onError={(event) => {
            event.currentTarget.style.visibility = "hidden";
          }}
        />
        <div ref={lightRef} className="tilt-cover-light" />
      </div>
    </div>
  );
}
