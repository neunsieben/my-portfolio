"use client";

import { DotGrid } from "@/components/DotGrid";
import { SiteCursor } from "@/components/SiteCursor";
import { SiteNav } from "@/components/SiteNav";
import { getCanvasHeadFontStack } from "@/lib/canvasHeadFontStack";
import { CONTACT_MAILTO } from "@/lib/siteContact";
import { createVerticalGlassEffect } from "@/lib/verticalGlassEffect";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    let pageDisposed = false;

    // ========================================================
    // SHARED FLUTED GLASS SHADER — used for both canvases
    // ========================================================
    const vSrc = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

    const fSrc = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_motionValue;
uniform float u_segments;
uniform vec2 u_mouse;
uniform float u_hover;

#define PI 3.14159265

void main(){
  vec2 uv = v_uv;
  float numSlices = u_segments;

  // Horizontal-only distance from mouse X — forms a vertical band, not a circle
  float distX = abs(uv.x - u_mouse.x);
  float bandWidth = 0.2;
  float falloff = smoothstep(bandWidth, 0.0, distX) * u_hover;

  // Extreme amplitude — breaks/tears the letters
  float baseAmplitude = 0.25;
  float amplitude = baseAmplitude * falloff;

  float sliceProgress = fract(uv.x * numSlices + u_motionValue * falloff);
  uv.x += amplitude * sin(sliceProgress * PI * 2.0) * (1.0 - 0.5 * abs(sliceProgress - 0.5));

  vec2 tileIndex = floor(uv);
  vec2 oddTile = mod(tileIndex, 2.0);
  vec2 mirroredUV = mix(fract(uv), 1.0 - fract(uv), oddTile);
  vec4 color = texture2D(u_tex, mirroredUV);

  if (color.a > 0.01 && falloff > 0.01) {
    float blackOverlayAlpha = 0.1 * (1.0 - abs(sin(sliceProgress * PI * 0.5 + 1.57))) * falloff;
    color.rgb *= (1.0 - blackOverlayAlpha);
    float whiteOverlayAlpha = 0.25 * (1.0 - abs(sin(sliceProgress * PI * 0.7 - 0.7))) * falloff;
    color.rgb = mix(color.rgb, vec3(1.0), whiteOverlayAlpha);
  }
  gl_FragColor = color;
}`;

    // ========================================================
    // GLASS INSTANCE FACTORY
    // ========================================================
    function createGlassEffect(
      canvasEl: HTMLCanvasElement,
      textRenderer: (
        tx: CanvasRenderingContext2D,
        tc: HTMLCanvasElement,
        dpr: number,
      ) => void,
      heightDesktop: number,
      heightMobile: number,
    ) {
      const gl = canvasEl.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: false,
      });
      if (!gl) {
        return {
          resize: () => {},
          render: () => {},
        };
      }
      const glc = gl;
      const dpr = Math.max(window.devicePixelRatio || 1, 2) * 1.5;
      const tc = document.createElement("canvas");
      const tx = tc.getContext("2d");
      if (!tx) {
        return { resize: () => {}, render: () => {} };
      }
      const tcx = tx;

      function resize() {
        const W = Math.min(window.innerWidth * 0.9, 1100);
        const t = Math.min(1, Math.max(0, (window.innerWidth - 480) / (1200 - 480)));
        const H = Math.round(heightMobile + (heightDesktop - heightMobile) * t);
        canvasEl.width = W * dpr;
        canvasEl.height = H * dpr;
        canvasEl.style.width = W + "px";
        canvasEl.style.height = H + "px";
        glc.viewport(0, 0, canvasEl.width, canvasEl.height);
        tc.width = canvasEl.width;
        tc.height = canvasEl.height;
        tcx.clearRect(0, 0, tc.width, tc.height);
        textRenderer(tcx, tc, dpr);
        glc.bindTexture(glc.TEXTURE_2D, tex);
        glc.texImage2D(glc.TEXTURE_2D, 0, glc.RGBA, glc.RGBA, glc.UNSIGNED_BYTE, tc);
      }

      function mkS(t: number, s: string) {
        const sh = glc.createShader(t);
        if (!sh) return null;
        glc.shaderSource(sh, s);
        glc.compileShader(sh);
        if (!glc.getShaderParameter(sh, glc.COMPILE_STATUS))
          console.error(glc.getShaderInfoLog(sh));
        return sh;
      }
      const prog = glc.createProgram();
      const vs = mkS(glc.VERTEX_SHADER, vSrc);
      const fs = mkS(glc.FRAGMENT_SHADER, fSrc);
      if (!prog || !vs || !fs) {
        return { resize: () => {}, render: () => {} };
      }
      glc.attachShader(prog, vs);
      glc.attachShader(prog, fs);
      glc.linkProgram(prog);
      glc.useProgram(prog);
      const buf = glc.createBuffer();
      glc.bindBuffer(glc.ARRAY_BUFFER, buf);
      glc.bufferData(
        glc.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        glc.STATIC_DRAW,
      );
      const aP = glc.getAttribLocation(prog, "a_pos");
      glc.enableVertexAttribArray(aP);
      glc.vertexAttribPointer(aP, 2, glc.FLOAT, false, 0, 0);
      const uMotion = glc.getUniformLocation(prog, "u_motionValue");
      const uSegs = glc.getUniformLocation(prog, "u_segments");
      const uMouse = glc.getUniformLocation(prog, "u_mouse");
      const uHover = glc.getUniformLocation(prog, "u_hover");
      const tex = glc.createTexture();
      glc.bindTexture(glc.TEXTURE_2D, tex);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_S, glc.CLAMP_TO_EDGE);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_WRAP_T, glc.CLAMP_TO_EDGE);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MIN_FILTER, glc.NEAREST);
      glc.texParameteri(glc.TEXTURE_2D, glc.TEXTURE_MAG_FILTER, glc.NEAREST);
      glc.enable(glc.BLEND);
      glc.blendFunc(glc.SRC_ALPHA, glc.ONE_MINUS_SRC_ALPHA);

      let motionValue = 0.5,
        targetMotion = 0.5;
      let mouseUVx = 0.5,
        mouseUVy = 0.5,
        tMouseUVx = 0.5,
        tMouseUVy = 0.5;
      let hoverStr = 0,
        tHoverStr = 0;
      const motionFactor = -8;

      canvasEl.addEventListener("mousemove", (e) => {
        const r = canvasEl.getBoundingClientRect();
        tMouseUVx = (e.clientX - r.left) / r.width;
        tMouseUVy = (e.clientY - r.top) / r.height;
        targetMotion = 0.5 + tMouseUVx * motionFactor * 0.1;
        tHoverStr = 1.0;
      });
      canvasEl.addEventListener("mouseleave", () => {
        targetMotion = 0.5;
        tHoverStr = 0;
      });
      function handleTouch(e: TouchEvent) {
        e.preventDefault();
        const t = e.touches[0];
        const r = canvasEl.getBoundingClientRect();
        tMouseUVx = (t.clientX - r.left) / r.width;
        tMouseUVy = (t.clientY - r.top) / r.height;
        // Snap mouse position instantly on touch for immediate response
        mouseUVx = tMouseUVx;
        mouseUVy = tMouseUVy;
        targetMotion = 0.5 + tMouseUVx * motionFactor * 0.1;
        tHoverStr = 1.0;
        hoverStr = 0.5; // Kick-start visibility
      }
      canvasEl.addEventListener("touchstart", handleTouch, { passive: false });
      canvasEl.addEventListener("touchmove", handleTouch, { passive: false });
      canvasEl.addEventListener("touchend", () => {
        targetMotion = 0.5;
        tHoverStr = 0;
      });

      function render() {
        if (pageDisposed) return;
        motionValue += (targetMotion - motionValue) * 0.035;
        mouseUVx += (tMouseUVx - mouseUVx) * 0.06;
        mouseUVy += (tMouseUVy - mouseUVy) * 0.06;
        hoverStr += (tHoverStr - hoverStr) * 0.04;
        glc.clearColor(0, 0, 0, 0);
        glc.clear(glc.COLOR_BUFFER_BIT);
        if (uMotion) glc.uniform1f(uMotion, motionValue);
        if (uSegs) glc.uniform1f(uSegs, 1.0);
        if (uMouse) glc.uniform2f(uMouse, mouseUVx, mouseUVy);
        if (uHover) glc.uniform1f(uHover, hoverStr);
        glc.drawArrays(glc.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(render);
      }

      window.addEventListener("resize", resize);
      return { resize, render };
    }

    const leonardEl = document.getElementById("leonardCanvas");
    const semmlerEl = document.getElementById("semmlerCanvas");
    const getInTouchEl = document.getElementById("getInTouchCanvas");
    if (!leonardEl || !semmlerEl || !getInTouchEl) {
      return () => {};
    }

    // ========================================================
    // HERO — "Leonard" canvas (independent effect)
    // ========================================================
    const leonardInstance = createGlassEffect(
      leonardEl as HTMLCanvasElement,
      (tx, tc, dpr) => {
        const vw = window.innerWidth;
        const fs = Math.floor(Math.min(220, Math.max(56, vw * 0.14)) * dpr);
        const padding = tc.width * 0.03;
        const ff = getCanvasHeadFontStack();
        tx.font = `700 ${fs}px ${ff}`;
        tx.textAlign = "left";
        tx.textBaseline = "middle";
        tx.fillStyle = "#0a0a0a";
        tx.fillText("Leonard", padding, tc.height * 0.55);
      },
      260,
      75,
    );

    // ========================================================
    // HERO — "Semmler" canvas (independent effect)
    // ========================================================
    const semmlerInstance = createGlassEffect(
      semmlerEl as HTMLCanvasElement,
      (tx, tc, dpr) => {
        const vw = window.innerWidth;
        const fs = Math.floor(Math.min(220, Math.max(56, vw * 0.14)) * dpr);
        const padding = tc.width * 0.03;
        const ff = getCanvasHeadFontStack();
        tx.font = `700 ${fs}px ${ff}`;
        tx.textAlign = "left";
        tx.textBaseline = "middle";
        tx.fillStyle = "#0a0a0a";
        tx.fillText("Semmler", padding, tc.height * 0.55);
      },
      260,
      75,
    );

    // ========================================================
    // GET IN TOUCH — vertical glass, 1 segment, extreme
    // ========================================================
    const getInTouchInstance = createVerticalGlassEffect(
      getInTouchEl as HTMLCanvasElement,
      (tx, tc, dpr) => {
        // Auto-size: measure text and scale font to fill canvas width with padding
        const maxWidth = tc.width;
        let fs = Math.floor(300 * dpr);
        const ff = getCanvasHeadFontStack();
        tx.font = `700 ${fs}px ${ff}`;
        const measured = tx.measureText("Get in touch").width;
        // Scale down until it fits
        fs = Math.floor(fs * (maxWidth / measured));
        tx.font = `700 ${fs}px ${ff}`;
        tx.textAlign = "center";
        tx.textBaseline = "middle";
        tx.fillStyle = "#f0eee9";
        tx.fillText("Get in touch", tc.width / 2, tc.height * 0.5);
      },
      320,
      110,
      { shouldStop: () => pageDisposed },
    );

    // Start all after fonts load
    document.fonts.ready.then(() => {
      if (pageDisposed) return;
      leonardInstance.resize();
      leonardInstance.render();
      semmlerInstance.resize();
      semmlerInstance.render();
      getInTouchInstance.resize();
      getInTouchInstance.render();
    });

    // AUTO-SWEEP — simulate slow cursor top-to-bottom on Get in touch
    let sweepObs: IntersectionObserver | null = null;
    (function () {
      const canvas = document.getElementById("getInTouchCanvas");
      if (!canvas) return;
      const touchCanvas = canvas;
      let triggered = false;

      sweepObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting && !triggered) {
              triggered = true;
              sweepObs?.unobserve(touchCanvas);

              const duration = 1800;
              const holdStart = 200;
              const holdEnd = 400;
              const totalDuration = holdStart + duration + holdEnd;
              const startTime = performance.now();

              function step() {
                if (pageDisposed) return;
                const elapsed = performance.now() - startTime;

                if (elapsed < holdStart) {
                  const rect = touchCanvas.getBoundingClientRect();
                  touchCanvas.dispatchEvent(
                    new MouseEvent("mousemove", {
                      clientX: rect.left + rect.width * 0.5,
                      clientY: rect.top + rect.height * 0.05,
                      bubbles: true,
                    }),
                  );
                  requestAnimationFrame(step);
                } else if (elapsed < holdStart + duration) {
                  const progress = (elapsed - holdStart) / duration;
                  const eased = progress * progress * (3 - 2 * progress);
                  const rect = touchCanvas.getBoundingClientRect();
                  const y = rect.top + rect.height * (0.05 + eased * 0.9);
                  touchCanvas.dispatchEvent(
                    new MouseEvent("mousemove", {
                      clientX: rect.left + rect.width * 0.5,
                      clientY: y,
                      bubbles: true,
                    }),
                  );
                  requestAnimationFrame(step);
                } else if (elapsed < totalDuration) {
                  requestAnimationFrame(step);
                } else {
                  touchCanvas.dispatchEvent(new MouseEvent("mouseleave"));
                }
              }

              requestAnimationFrame(step);
            }
          });
        },
        { threshold: 0.4 },
      );

      sweepObs.observe(touchCanvas);
    })();

    (function () {
      const text = "Visual Storytelling";
      const el = document.getElementById("typewriterText");
      if (!el) return;
      const typeEl = el;
      let i = 0;
      function type() {
        if (pageDisposed) return;
        if (i <= text.length) {
          typeEl.textContent = text.slice(0, i);
          i++;
          setTimeout(type, 80 + Math.random() * 60);
        }
      }
      // Start after fadeUp animation completes
      setTimeout(type, 2600);
    })();

    // ========================================================
    // SCROLL-DRIVEN CURVED TRANSITION
    // ========================================================
    (function () {
      const about = document.getElementById("about");
      if (!about) return;

      function update() {
        if (pageDisposed) return;
        const rect = about!.getBoundingClientRect();
        const viewH = window.innerHeight;
        const raw = (viewH - rect.top) / (viewH + rect.height);
        const progress = Math.max(0, Math.min(1, raw * 3.5));

        const scale = 1 + progress * 4.0;
        about!.style.setProperty("--curve-scale", String(scale));

        requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    })();

    // ========================================================
    // SIMULATED GLASS SWEEP — hint at interactivity on load
    // ========================================================
    function simulateGlassSweep() {
      const canvases = [
        document.getElementById("leonardCanvas"),
        document.getElementById("semmlerCanvas"),
      ].filter(Boolean) as HTMLCanvasElement[];
      const duration = 350;
      const steps = 25;
      const stepTime = duration / steps;
      let step = 0;

      function tick() {
        if (pageDisposed) return;
        if (step > steps + 4) {
          canvases.forEach((c) => {
            c.dispatchEvent(new MouseEvent("mouseleave"));
          });
          return;
        }

        const progress = Math.min(step / steps, 1);
        // Quick cubic ease-out — fast start, gentle end
        const eased = 1 - Math.pow(1 - progress, 3);

        canvases.forEach((c) => {
          const rect = c.getBoundingClientRect();
          const x = rect.left + rect.width * (0.03 + eased * 0.8);
          const y = rect.top + rect.height * 0.5;
          c.dispatchEvent(
            new MouseEvent("mousemove", {
              clientX: x,
              clientY: y,
              bubbles: true,
            }),
          );
        });

        step++;
        setTimeout(tick, stepTime);
      }

      setTimeout(tick, 50);
    }

    // ========================================================
    // LOADING SCREEN
    // ========================================================
    const loader = document.getElementById("loader");
    const counter = document.getElementById("loaderCounter");
    if (loader && counter) {
      const loaderEl = loader;
      const counterEl = counter;
      let current = 0;
      let target = 0;

      document.body.style.overflow = "hidden";

      const totalDuration = 1500;

      function simulateProgress() {
        const phases = [
          { to: 40, duration: 300 },
          { to: 75, duration: 500 },
          { to: 100, duration: 300 },
        ];
        let delay = 100;
        phases.forEach((phase) => {
          setTimeout(() => {
            target = phase.to;
          }, delay);
          delay += phase.duration;
        });
        setTimeout(() => {
          // Brief hold showing 100, then curtain slides up
          setTimeout(() => {
            loaderEl.classList.add("phase2");
            setTimeout(() => {
              loaderEl.classList.add("done");
              document.body.style.overflow = "";
              simulateGlassSweep();
            }, 800);
          }, 400);
        }, delay + 50);
      }

      // Typewriter synced to total duration
      const months = [
        "JANUARY",
        "FEBRUARY",
        "MARCH",
        "APRIL",
        "MAY",
        "JUNE",
        "JULY",
        "AUGUST",
        "SEPTEMBER",
        "OCTOBER",
        "NOVEMBER",
        "DECEMBER",
      ];
      const now = new Date();
      const loaderText = `LEONARDSEMMLER/PORTFOLIO/${now.getFullYear()}/${months[now.getMonth()]}`;
      const typeEl = document.getElementById("loaderTypeText");
      const charDelay = (totalDuration - 400) / loaderText.length;
      let ti = 0;
      function typeLoader() {
        if (pageDisposed) return;
        if (ti <= loaderText.length && typeEl) {
          typeEl.textContent = loaderText.slice(0, ti);
          ti++;
          setTimeout(typeLoader, charDelay);
        }
      }
      setTimeout(typeLoader, 300);

      function animate() {
        if (pageDisposed) return;
        current += (target - current) * 0.08;
        const rounded = Math.round(current);
        counterEl.textContent = String(rounded);
        if (rounded < 100 || !loaderEl.classList.contains("done")) {
          requestAnimationFrame(animate);
        }
      }

      simulateProgress();
      requestAnimationFrame(animate);
    }

    // TILT
    document.querySelectorAll("[data-tilt]").forEach((c) => {
      c.addEventListener("mousemove", (e) => {
        const me = e as MouseEvent;
        const r = c.getBoundingClientRect();
        const x = (me.clientX - r.left) / r.width - 0.5;
        const y = (me.clientY - r.top) / r.height - 0.5;
        const inner = c.querySelector(".project-card-inner") as HTMLElement;
        if (inner)
          inner.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
      });
      c.addEventListener("mouseleave", () => {
        const inner = c.querySelector(".project-card-inner") as HTMLElement;
        if (inner)
          inner.style.transform =
            "perspective(1000px) rotateY(0) rotateX(0)";
      });
    });

    // REVEAL
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

    // ========================================================
    // TERMINAL BLOCK SWEEP EFFECT
    // ========================================================

    // Split text into individual char spans
    function splitIntoChars(el: HTMLElement) {
      const text = el.textContent || "";
      el.textContent = "";
      // Check if text contains slashes — if so, group into nowrap segments
      if (text.includes("/")) {
        const segments = text.split("/");
        segments.forEach((seg, idx) => {
          const wrapper = document.createElement("span");
          wrapper.style.whiteSpace = "nowrap";
          const fullSeg = idx < segments.length - 1 ? seg + "/" : seg;
          for (let i = 0; i < fullSeg.length; i++) {
            const span = document.createElement("span");
            span.className = "char";
            span.textContent =
              fullSeg[i] === " " ? "\u00A0" : fullSeg[i] ?? "";
            wrapper.appendChild(span);
          }
          el.appendChild(wrapper);
        });
      } else {
        for (let i = 0; i < text.length; i++) {
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = text[i] === " " ? "\u00A0" : text[i] ?? "";
          el.appendChild(span);
        }
      }
    }

    // Sweep animation: activate chars one by one left-to-right
    function sweepTerminal(
      el: HTMLElement,
      speed: number,
      onComplete?: () => void,
    ) {
      const chars = el.querySelectorAll(".char");
      let i = 0;
      function step() {
        if (pageDisposed) return;
        if (i > 0) chars[i - 1]?.classList.remove("active");
        if (i < chars.length) {
          chars[i]?.classList.add("active");
          i++;
          setTimeout(step, speed);
        } else {
          // Remove last
          if (chars.length > 0)
            chars[chars.length - 1]?.classList.remove("active");
          if (onComplete) onComplete();
        }
      }
      step();
    }

    /** Split text inside optional .terminal-link-label so Next.js <Link> keeps a valid <a href>. */
    function terminalSweepTarget(link: HTMLElement) {
      return (link.querySelector(".terminal-link-label") as HTMLElement) ?? link;
    }

    // Apply to all terminal-link elements (hover triggered)
    document.querySelectorAll(".terminal-link").forEach((el) => {
      const link = el as HTMLElement;
      const target = terminalSweepTarget(link);
      splitIntoChars(target);
      let isAnimating = false;
      link.addEventListener("mouseenter", () => {
        if (isAnimating) return;
        isAnimating = true;
        sweepTerminal(target, 70, () => {
          isAnimating = false;
        });
      });
    });

    // Scroll to explore — looping terminal sweep
    const scrollEl = document.getElementById("scrollExplore");
    if (scrollEl) {
      const exploreEl = scrollEl;
      splitIntoChars(exploreEl);
      function loopScrollSweep() {
        if (pageDisposed) return;
        sweepTerminal(exploreEl, 80, () => {
          setTimeout(loopScrollSweep, 5000);
        });
      }
      setTimeout(loopScrollSweep, 5000);
    }

    return () => {
      pageDisposed = true;
      window.removeEventListener("resize", leonardInstance.resize);
      window.removeEventListener("resize", semmlerInstance.resize);
      window.removeEventListener("resize", getInTouchInstance.resize);
      sweepObs?.disconnect();
      obs.disconnect();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <div className="loader" id="loader">
        <div className="loader-content">
          <div className="loader-counter" id="loaderCounter">
            0
          </div>
          <div className="loader-type">
            <span id="loaderTypeText"></span>
            <span className="typewriter-cursor"></span>
          </div>
        </div>
      </div>
      <DotGrid />
      <SiteCursor variant="home" />
      <SiteNav scrolledThreshold={50}>
        <li>
          <Link href="/projects" className="hoverable terminal-link">
            <span className="terminal-link-label">Projects</span>
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hoverable terminal-link"
          >
            <span className="terminal-link-label">About</span>
          </Link>
        </li>
        <li>
          <a href={CONTACT_MAILTO} className="hoverable terminal-link">
            <span className="terminal-link-label">Get in Touch</span>
          </a>
        </li>
      </SiteNav>

      <section className="hero">
        <div className="hero-liquid-container">
          <div className="hero-inner">
            <div className="hero-canvas-wrap">
              <canvas id="leonardCanvas"></canvas>
            </div>
            <div className="hero-canvas-wrap">
              <canvas id="semmlerCanvas"></canvas>
            </div>
            <div className="hero-name">
              <span id="typewriterText"></span>
              <span className="typewriter-cursor"></span>
            </div>
          </div>
        </div>
        <div className="scroll-explore">
          <div className="hero-social">
            <a href="#" className="hoverable terminal-link">
              Instagram ↗
            </a>
            <a href="#" className="hoverable terminal-link">
              LinkedIn ↗
            </a>
          </div>
          <div className="scroll-explore-text" id="scrollExplore">
            [SCROLL TO EXPLORE]
          </div>
        </div>
      </section>

      <section className="featured-works" id="selected-work">
        <h2 className="section-title reveal">Selected work</h2>
      </section>

      <section className="projects-section">
        <div className="projects-editorial">
          <div className="project-row">
            <a href="#" className="project-item project-left reveal hoverable">
              <div
                className="project-img"
                style={{
                  background:
                    "linear-gradient(135deg,#c8c6c2,#d8d6d2,#bab8b4)",
                }}
              ></div>
              <div className="project-meta">
                <span className="project-name">
                  001&nbsp;&nbsp;&nbsp;&nbsp;Zalazium GmbH
                </span>
                <span className="project-cat">UX · Branding · Motion</span>
              </div>
            </a>
            <a
              href="#"
              className="project-item project-right reveal reveal-delay-2 hoverable"
            >
              <div
                className="project-img"
                style={{
                  background:
                    "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)",
                }}
              ></div>
              <div className="project-meta">
                <span className="project-name">
                  002&nbsp;&nbsp;&nbsp;&nbsp;Daily Grind Coffee
                </span>
                <span className="project-cat">Branding · Packaging</span>
              </div>
            </a>
          </div>
          <div className="project-row project-row-offset">
            <a href="#" className="project-item project-center reveal hoverable">
              <div
                className="project-img project-img-wide"
                style={{
                  background: "url(/images/donata-jan-trio.png) center/cover no-repeat",
                }}
              ></div>
              <div className="project-meta">
                <span className="project-name">
                  003&nbsp;&nbsp;&nbsp;&nbsp;Donata Jan Trio
                </span>
                <span className="project-cat">Album Artwork</span>
              </div>
            </a>
          </div>
        </div>
        <div className="projects-more reveal">
          <Link href="/projects" className="hoverable terminal-link">
            More Projects ↗
          </Link>
        </div>
      </section>

      <section className="about-teaser" id="about">
        <h2 className="section-title section-title-light reveal">
          Bridging Design & Strategy
        </h2>
        <div className="reveal reveal-delay-1">
          <p className="about-teaser-text">
            Designer based in Hamburg with a B.Sc. in Human-Computer
            Interaction. Crafting brand identities, conceptualizing packaging
            design, and spearheading visual direction for music events — always
            telling a compelling story through diverse materials and formats.
          </p>
          <Link
            href="/about"
            className="hoverable terminal-link"
          >
            More About Me ↗
          </Link>
        </div>
      </section>

      <section className="get-in-touch" id="contact">
        <a
          href={CONTACT_MAILTO}
          className="get-in-touch-headline-link reveal"
          aria-label="Send email to Leonard Semmler"
        >
          <canvas id="getInTouchCanvas"></canvas>
        </a>
        <ul className="get-in-touch-links reveal reveal-delay-2">
          <li>
            <a href="#" className="hoverable terminal-link">
              Instagram ↗
            </a>
          </li>
          <li>
            <a href="#" className="hoverable terminal-link">
              LinkedIn ↗
            </a>
          </li>
          <li>
            <a href={CONTACT_MAILTO} className="hoverable terminal-link">
              Email ↗
            </a>
          </li>
        </ul>
      </section>

      <footer className="footer">
        <div className="footer-bottom">
          © 2026 Leonard Semmler. All Rights Reserved.
        </div>
      </footer>
    </>
  );
}
