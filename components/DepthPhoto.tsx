"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
uniform sampler2D u_image;
uniform sampler2D u_depth;
uniform vec2 u_pointer;
uniform float u_strength;
varying vec2 v_uv;
void main() {
  vec2 base = (v_uv - 0.5) / 1.05 + 0.5;
  float d = texture2D(u_depth, base).r;
  vec2 shifted = clamp(base + (d - 0.28) * u_pointer * u_strength, 0.001, 0.999);
  gl_FragColor = texture2D(u_image, shifted);
}`;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(src));
    image.src = src;
  });
}

/** Cursor shifts a photo by its depth, so the jacket moves apart from the wall. */
export function DepthPhoto({
  src,
  depth,
  alt,
}: {
  src: string;
  depth: string;
  alt: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let raf = 0;
    let follow = 0.16;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let active = false;
    let gl: WebGLRenderingContext | null = null;
    let pointerLoc: WebGLUniformLocation | null = null;

    const paint = () => {
      if (!gl) return;
      currentX += (targetX - currentX) * follow;
      currentY += (targetY - currentY) * follow;
      if (pointerLoc) gl.uniform2f(pointerLoc, currentX * 2, currentY * 2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      const moving =
        Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001;
      if (active || moving) raf = requestAnimationFrame(paint);
      else raf = 0;
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onMove = (event: PointerEvent) => {
      if (reduced) return;
      const rect = frame.getBoundingClientRect();
      const touch = event.pointerType === "touch";
      const gain = touch ? 1.7 : 1;
      follow = touch ? 0.34 : 0.16;
      targetX = Math.max(-0.5, Math.min(0.5, ((event.clientX - rect.left) / rect.width - 0.5) * gain));
      targetY = touch
        ? 0
        : Math.max(-0.5, Math.min(0.5, ((event.clientY - rect.top) / rect.height - 0.5) * gain));
      active = true;
      kick();
    };

    const onLeave = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      targetX = 0;
      targetY = 0;
      active = false;
      kick();
    };

    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== "touch") return;
      targetX = 0;
      targetY = 0;
      active = false;
      kick();
    };

    function upload(context: WebGLRenderingContext, image: HTMLImageElement, unit: number) {
      const tex = context.createTexture();
      context.activeTexture(context.TEXTURE0 + unit);
      context.bindTexture(context.TEXTURE_2D, tex);
      context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, 1);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.LINEAR);
      context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
    }

    Promise.all([loadImage(src), loadImage(depth)])
      .then(([photo, depthMap]) => {
        if (disposed) return;
        const pixelW = Math.min(1600, photo.naturalWidth);
        canvas.width = pixelW;
        canvas.height = Math.round(pixelW * (photo.naturalHeight / photo.naturalWidth));
        const context = canvas.getContext("webgl", {
          alpha: false,
          antialias: false,
          premultipliedAlpha: false,
        });
        if (!context) return;
        gl = context;
        const vs = context.createShader(context.VERTEX_SHADER);
        const fs = context.createShader(context.FRAGMENT_SHADER);
        const program = context.createProgram();
        if (!vs || !fs || !program) return;
        context.shaderSource(vs, VERT);
        context.shaderSource(fs, FRAG);
        context.compileShader(vs);
        context.compileShader(fs);
        context.attachShader(program, vs);
        context.attachShader(program, fs);
        context.linkProgram(program);
        context.useProgram(program);
        const buffer = context.createBuffer();
        context.bindBuffer(context.ARRAY_BUFFER, buffer);
        context.bufferData(
          context.ARRAY_BUFFER,
          new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
          context.STATIC_DRAW,
        );
        const pos = context.getAttribLocation(program, "a_pos");
        context.enableVertexAttribArray(pos);
        context.vertexAttribPointer(pos, 2, context.FLOAT, false, 0, 0);
        pointerLoc = context.getUniformLocation(program, "u_pointer");
        context.uniform1f(context.getUniformLocation(program, "u_strength"), reduced ? 0 : 0.028);
        context.uniform1i(context.getUniformLocation(program, "u_image"), 0);
        context.uniform1i(context.getUniformLocation(program, "u_depth"), 1);
        upload(context, photo, 0);
        upload(context, depthMap, 1);
        context.viewport(0, 0, canvas.width, canvas.height);
        paint();
      })
      .catch(() => {
        if (!disposed) frame.dataset.failed = "1";
      });

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerdown", onMove);
    frame.addEventListener("pointerup", onUp);
    frame.addEventListener("pointercancel", onUp);
    frame.addEventListener("pointerleave", onLeave);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerdown", onMove);
      frame.removeEventListener("pointerup", onUp);
      frame.removeEventListener("pointercancel", onUp);
      frame.removeEventListener("pointerleave", onLeave);
    };
  }, [src, depth]);

  return (
    <div ref={frameRef} className="depth-photo" role="img" aria-label={alt}>
      <canvas ref={canvasRef} />
    </div>
  );
}
