/** About page vertical glass: hero + get-in-touch (u_reveal + force). */

export const ABOUT_GLASS_VERTEX = `attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;v_uv.y=1.0-v_uv.y;gl_Position=vec4(a_pos,0.0,1.0);}`;

export const ABOUT_GLASS_FRAGMENT = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_motionValue;
uniform float u_segments;
uniform vec2 u_mouse;
uniform float u_hover;
uniform float u_reveal;
#define PI 3.14159265
void main(){
  vec2 uv = v_uv;
  float distY = abs(uv.y - u_mouse.y);
  float bandWidth = 0.1;
  float falloff = smoothstep(bandWidth, 0.0, distY) * u_hover;
  float amplitude = 0.35 * falloff;
  float sliceProgress = fract(uv.y * u_segments + u_motionValue * falloff);
  uv.y += amplitude * sin(sliceProgress * PI * 2.0) * (1.0 - 0.5 * abs(sliceProgress - 0.5));
  vec2 tileIndex = floor(uv);
  vec2 oddTile = mod(tileIndex, 2.0);
  vec2 mirroredUV = mix(fract(uv), 1.0 - fract(uv), oddTile);
  vec4 color = texture2D(u_tex, mirroredUV);
  float revealAlpha = 1.0 - smoothstep(u_reveal - 0.12, u_reveal + 0.02, v_uv.y);
  color.a *= revealAlpha;
  gl_FragColor = color;
}`;

export type AboutGlassTextRenderer = (
  tx: CanvasRenderingContext2D,
  tc: HTMLCanvasElement,
  dpr: number,
) => void;

export function wrapText(
  tx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0] ?? "";
  for (let i = 1; i < words.length; i++) {
    const test = currentLine + " " + words[i];
    if (tx.measureText(test).width <= maxWidth) {
      currentLine = test;
    } else {
      lines.push(currentLine);
      currentLine = words[i] ?? "";
    }
  }
  lines.push(currentLine);
  return lines;
}

export function createAboutVerticalGlassEffect(
  canvasEl: HTMLCanvasElement,
  textRenderer: AboutGlassTextRenderer,
  heightDesktop: number,
  heightMobile: number,
  options?: { shouldStop?: () => boolean },
) {
  const gl = canvasEl.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: false,
  });
  if (!gl) {
    return {
      resize: () => {},
      render: () => {},
      force: () => {},
    };
  }
  const glc = gl;
  const dpr = Math.max(window.devicePixelRatio || 1, 2) * 1.5;
  const tc = document.createElement("canvas");
  const tx = tc.getContext("2d");
  if (!tx) {
    return {
      resize: () => {},
      render: () => {},
      force: () => {},
    };
  }
  const tcx = tx;

  function resize() {
    const W = Math.min(window.innerWidth * 0.85, 1100);
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
  const vs = mkS(glc.VERTEX_SHADER, ABOUT_GLASS_VERTEX);
  const fs = mkS(glc.FRAGMENT_SHADER, ABOUT_GLASS_FRAGMENT);
  if (!prog || !vs || !fs) {
    return {
      resize: () => {},
      render: () => {},
      force: () => {},
    };
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
  const uReveal = glc.getUniformLocation(prog, "u_reveal");
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
  let revealPos = -0.2;
  const motionFactor = -8;
  const shouldStop = options?.shouldStop;

  canvasEl.addEventListener("mousemove", (e) => {
    const r = canvasEl.getBoundingClientRect();
    tMouseUVx = (e.clientX - r.left) / r.width;
    tMouseUVy = (e.clientY - r.top) / r.height;
    targetMotion = 0.5 + tMouseUVy * motionFactor * 0.1;
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
    mouseUVx = tMouseUVx;
    mouseUVy = tMouseUVy;
    targetMotion = 0.5 + tMouseUVy * motionFactor * 0.1;
    tHoverStr = 1.0;
    hoverStr = 0.5;
  }
  canvasEl.addEventListener("touchstart", handleTouch, { passive: false });
  canvasEl.addEventListener("touchmove", handleTouch, { passive: false });
  canvasEl.addEventListener("touchend", () => {
    targetMotion = 0.5;
    tHoverStr = 0;
  });

  function force(uvx: number, uvy: number, str: number, rev?: number) {
    mouseUVx = tMouseUVx = uvx;
    mouseUVy = tMouseUVy = uvy;
    hoverStr = tHoverStr = str;
    motionValue = targetMotion = 0.5 + uvy * motionFactor * 0.1;
    if (rev !== undefined) revealPos = rev;
  }

  function render() {
    if (shouldStop?.()) return;
    motionValue += (targetMotion - motionValue) * 0.035;
    mouseUVx += (tMouseUVx - mouseUVx) * 0.06;
    mouseUVy += (tMouseUVy - mouseUVy) * 0.06;
    hoverStr += (tHoverStr - hoverStr) * 0.04;
    glc.clearColor(0, 0, 0, 0);
    glc.clear(glc.COLOR_BUFFER_BIT);
    if (uMotion) glc.uniform1f(uMotion, motionValue);
    if (uSegs) glc.uniform1f(uSegs, 0.1);
    if (uMouse) glc.uniform2f(uMouse, mouseUVx, mouseUVy);
    if (uHover) glc.uniform1f(uHover, hoverStr);
    if (uReveal) glc.uniform1f(uReveal, revealPos);
    glc.drawArrays(glc.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);
  return { resize, render, force };
}
