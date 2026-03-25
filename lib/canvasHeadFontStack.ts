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
