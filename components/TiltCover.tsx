"use client";

import { useEffect, useRef } from "react";

const MAX_TILT = 16;

/** Black 4:3 window. Only the square cover inside it tilts. */
export function TiltCover({
  src,
  alt,
  className,
  static: isStatic = false,
}: {
  src: string;
  alt: string;
  className?: string;
  /** Flat preview. Same size and placement, no cursor tilt. */
  static?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const plane = planeRef.current;
    const glare = glareRef.current;
    if (!frame || !plane || !glare || isStatic) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let active = false;

    const paint = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      const rx = currentY * -MAX_TILT;
      const ry = currentX * MAX_TILT;
      plane.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      // Light stays above and in front of the frame. The sheen slides
      // across the cover only because the cover's angle changes.
      const hx = Math.min(88, Math.max(12, 50 + (ry / MAX_TILT) * 38));
      const hy = Math.min(88, Math.max(12, 30 + (-rx / MAX_TILT) * 38));
      glare.style.background = `radial-gradient(circle at ${hx}% ${hy}%, rgba(255,255,255,0.5), rgba(255,255,255,0.08) 26%, transparent 56%)`;
      const stillMoving =
        Math.abs(targetX - currentX) > 0.001 ||
        Math.abs(targetY - currentY) > 0.001;
      if (active || stillMoving) {
        raf = requestAnimationFrame(paint);
      } else {
        raf = 0;
        plane.style.transform = "rotateX(0deg) rotateY(0deg)";
      }
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = frame.getBoundingClientRect();
      targetX = Math.max(
        -0.5,
        Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5),
      );
      targetY = Math.max(
        -0.5,
        Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5),
      );
      active = true;
      kick();
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      active = false;
      kick();
    };

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
    };
  }, [isStatic]);

  return (
    <div ref={frameRef} className={className ? `tilt-cover ${className}` : "tilt-cover"}>
      <div ref={planeRef} className="tilt-cover-art">
        <img
          src={src}
          alt={alt}
          draggable={false}
          onError={(event) => {
            event.currentTarget.style.visibility = "hidden";
          }}
        />
        <div ref={glareRef} className="tilt-cover-glare" />
      </div>
    </div>
  );
}
