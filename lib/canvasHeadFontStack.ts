/**
 * Canvas 2D `font` must use concrete family names. CSS `var(--font-head)` does not apply.
 * Reads the same stack as the prototypes: Montreal (next/font/local) → Plus Jakarta Sans (next/font/google).
 */
export function getCanvasHeadFontStack(): string {
  if (typeof document === "undefined") {
    return '"Plus Jakarta Sans", sans-serif';
  }
  const root = getComputedStyle(document.documentElement);
  const montreal = root.getPropertyValue("--font-montreal").trim();
  const plusJakarta =
    root.getPropertyValue("--font-plus-jakarta").trim() ||
    '"Plus Jakarta Sans", sans-serif';
  return montreal ? `${montreal}, ${plusJakarta}` : plusJakarta;
}

/** CSS height that hugs the “Get in touch” letters instead of leaving a tall empty box. */
export function fittedHeadlineHeight(widthCss: number, dpr: number, text = "Get in touch") {
  if (typeof document === "undefined") return Math.round(widthCss * 0.18);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return Math.round(widthCss * 0.18);
  const probe = 300 * dpr;
  ctx.textBaseline = "middle";
  ctx.font = `700 ${probe}px ${getCanvasHeadFontStack()}`;
  const metrics = ctx.measureText(text);
  const measured = metrics.width || 1;
  const scale = (widthCss * dpr) / measured;
  const ascent = metrics.actualBoundingBoxAscent || probe * 0.72;
  const descent = metrics.actualBoundingBoxDescent || probe * 0.05;
  const ink = ((ascent + descent) * scale) / dpr;
  const cssFont = (probe * widthCss) / measured;
  return Math.max(40, Math.ceil(ink + cssFont * 0.28));
}
