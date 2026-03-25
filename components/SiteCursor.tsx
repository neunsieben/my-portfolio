"use client";

import { useEffect } from "react";

type CursorVariant = "home" | "projects";

/**
 * Custom cursor: home matches homepage (ring follows one smoothed point, dot raw).
 * Projects matches projects.html (ring 0.15 lerp, dot 0.45 lerp).
 */
export function SiteCursor({ variant }: { variant: CursorVariant }) {
  useEffect(() => {
    let pageDisposed = false;

    const cursor = document.querySelector(".cursor") as HTMLElement | null;
    const dot = document.querySelector(".cursor-dot") as HTMLElement | null;
    if (!cursor || !dot) return;
    const curEl = cursor;
    const dotEl = dot;

    let mx = 0,
      my = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    document.addEventListener("mousemove", onMove);

    if (variant === "home") {
      let dx2 = 0,
        dy2 = 0;
      function ac() {
        if (pageDisposed) return;
        dx2 += (mx - dx2) * 0.12;
        dy2 += (my - dy2) * 0.12;
        curEl.style.left = dx2 - 9 + "px";
        curEl.style.top = dy2 - 9 + "px";
        dotEl.style.left = mx - 2 + "px";
        dotEl.style.top = my - 2 + "px";
        requestAnimationFrame(ac);
      }
      ac();
    } else {
      let cx = 0,
        cy = 0,
        dx = 0,
        dy = 0;
      function loop() {
        if (pageDisposed) return;
        cx += (mx - cx) * 0.15;
        cy += (my - cy) * 0.15;
        dx += (mx - dx) * 0.45;
        dy += (my - dy) * 0.45;
        curEl.style.left = cx - 9 + "px";
        curEl.style.top = cy - 9 + "px";
        dotEl.style.left = dx - 2 + "px";
        dotEl.style.top = dy - 2 + "px";
        requestAnimationFrame(loop);
      }
      loop();
      if (window.innerWidth <= 768) {
        curEl.style.display = "none";
        dotEl.style.display = "none";
      }
    }

    const onEnter = () => curEl.classList.add("hovering");
    const onLeave = () => curEl.classList.remove("hovering");
    const hoverSel =
      variant === "home"
        ? ".hoverable,.project-card,.btn,a"
        : ".hoverable";
    document.querySelectorAll(hoverSel).forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      pageDisposed = true;
      document.removeEventListener("mousemove", onMove);
      document.querySelectorAll(hoverSel).forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [variant]);

  return (
    <>
      <div className="cursor" />
      <div className="cursor-dot" />
    </>
  );
}
