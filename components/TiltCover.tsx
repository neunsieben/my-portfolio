"use client";

import { useEffect, useRef } from "react";

const MAX_TILT = 16;

/** Black 4:3 frame with a square cover. The frame tilts toward the cursor. */
export function TiltCover({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const plane = planeRef.current;
    const glare = glareRef.current;
    if (!frame || !plane || !glare) return;
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
      const scale = active ? 1.03 : 1;
      plane.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
      const gx = (currentX + 0.5) * 100;
      const gy = (currentY + 0.5) * 100;
      glare.style.opacity = active ? "1" : "0";
      glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.55), rgba(255,255,255,0.08) 28%, transparent 58%)`;
      const stillMoving =
        Math.abs(targetX - currentX) > 0.001 ||
        Math.abs(targetY - currentY) > 0.001;
      if (active || stillMoving) {
        raf = requestAnimationFrame(paint);
      } else {
        raf = 0;
        plane.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
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
      frame.classList.add("is-active");
      kick();
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      active = false;
      frame.classList.remove("is-active");
      kick();
    };

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={frameRef} className={className ? `tilt-cover ${className}` : "tilt-cover"}>
      <div ref={planeRef} className="tilt-cover-plane">
        <img
          className="tilt-cover-art"
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
