"use client";

import { useEffect, useRef } from "react";

const MAX_TILT = 16;
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
  const lightA = (strong ? 0.048 + lit * 0.014 : 0.16 + lit * 0.18).toFixed(3);
  const shadowA = (0.28 + (1 - shd) * 0.22).toFixed(3);
  if (strong) {
    return `linear-gradient(${angle.toFixed(2)}deg, rgba(255, 246, 232, 0) 0%, rgba(255, 246, 232, 0) 38%, rgba(255, 228, 196, 0.019) 70%, rgba(255, 248, 236, ${lightA}) 100%)`;
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let active = false;

    let follow = 0.16;

    const paint = () => {
      currentX += (targetX - currentX) * follow;
      currentY += (targetY - currentY) * follow;
      const rx = currentY * -MAX_TILT;
      const ry = currentX * MAX_TILT;
      plane.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      const shine = paperLight(rx, ry, lamp === "strong");
      light.style.backgroundImage =
        lamp === "strong" ? shine : `${shine}, var(--paper-grain)`;
      const stillMoving =
        Math.abs(targetX - currentX) > 0.001 ||
        Math.abs(targetY - currentY) > 0.001;
      if (active || stillMoving) {
        raf = requestAnimationFrame(paint);
      } else {
        raf = 0;
        plane.style.transform = "rotateX(0deg) rotateY(0deg)";
        light.style.backgroundImage = "";
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onMove = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      const touch = event.pointerType === "touch";
      // A finger stays nearer the middle than a mouse, so reach full tilt sooner.
      const gain = touch ? 1.7 : 1;
      follow = touch ? 0.34 : 0.16;
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
      targetX = 0;
      targetY = 0;
      active = false;
      kick();
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") frame.setPointerCapture(event.pointerId);
      onMove(event);
    };

    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      targetX = 0;
      targetY = 0;
      active = false;
      kick();
    };

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerdown", onDown);
    frame.addEventListener("pointerup", onUp);
    frame.addEventListener("pointercancel", onUp);
    frame.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerdown", onDown);
      frame.removeEventListener("pointerup", onUp);
      frame.removeEventListener("pointercancel", onUp);
      frame.removeEventListener("pointerleave", onLeave);
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
