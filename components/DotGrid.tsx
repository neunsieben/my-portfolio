"use client";

import { useEffect } from "react";

/** Figma-style dot grid with subtle random pulse (same logic as homepage). */
export function DotGrid() {
  useEffect(() => {
    let pageDisposed = false;

    const canvas = document.getElementById("dotGrid");
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) return;
    const dotCanvas = canvas;
    const ctx = dotCanvas.getContext("2d");
    if (!ctx) return;
    const dotCtx = ctx;
    const spacing = 24;
    const baseSize = 1.5;
    let cols: number,
      rows: number,
      pulses: {
        col: number;
        row: number;
        phase: number;
        speed: number;
        maxScale: number;
      }[] = [];
    let currentDpr = 1;

    function resize() {
      currentDpr = window.devicePixelRatio || 1;
      dotCanvas.width = window.innerWidth * currentDpr;
      dotCanvas.height = window.innerHeight * currentDpr;
      dotCanvas.style.width = window.innerWidth + "px";
      dotCanvas.style.height = window.innerHeight + "px";
      cols = Math.ceil(window.innerWidth / spacing) + 1;
      rows = Math.ceil(window.innerHeight / spacing) + 1;
      pulses = [];
      const totalDots = cols * rows;
      const pulseCount = Math.floor(totalDots * 0.02);
      for (let i = 0; i < pulseCount; i++) {
        pulses.push({
          col: Math.floor(Math.random() * cols),
          row: Math.floor(Math.random() * rows),
          phase: Math.random() * Math.PI * 2,
          speed: 0.15 + Math.random() * 0.25,
          maxScale: 1.15 + Math.random() * 0.35,
        });
      }
    }

    let pulseMap: Record<string, (typeof pulses)[0]> = {};
    function buildPulseMap() {
      pulseMap = {};
      for (let i = 0; i < pulses.length; i++) {
        pulseMap[pulses[i].col + "," + pulses[i].row] = pulses[i];
      }
    }

    let lastShuffle = 0;
    function shufflePulses(time: number) {
      if (time - lastShuffle > 5000) {
        lastShuffle = time;
        for (let i = 0; i < pulses.length; i++) {
          if (Math.random() < 0.25) {
            pulses[i].col = Math.floor(Math.random() * cols);
            pulses[i].row = Math.floor(Math.random() * rows);
            pulses[i].phase = Math.random() * Math.PI * 2;
          }
        }
        buildPulseMap();
      }
    }

    function render(time: number) {
      if (pageDisposed) return;
      dotCtx.setTransform(currentDpr, 0, 0, currentDpr, 0, 0);
      dotCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const t = time * 0.001;
      shufflePulses(time);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing;
          const y = r * spacing;
          const p = pulseMap[c + "," + r];
          let size = baseSize;
          if (p) {
            const wave = (Math.sin(t * p.speed + p.phase) + 1) * 0.5;
            size = baseSize * (1 + (p.maxScale - 1) * wave);
          }
          const half = size * 0.5;
          dotCtx.fillStyle = "rgba(255,255,255,0.12)";
          dotCtx.fillRect(
            Math.round(x - half),
            Math.round(y - half),
            Math.round(size),
            Math.round(size),
          );
        }
      }
      requestAnimationFrame(render);
    }

    const onResize = () => {
      resize();
      buildPulseMap();
    };

    resize();
    buildPulseMap();
    window.addEventListener("resize", onResize);
    requestAnimationFrame(render);

    return () => {
      pageDisposed = true;
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas id="dotGrid" />;
}
