/**
 * Shared terminal-link typewriter block animation.
 * Used by the landing page, projects page, about page, and project detail pages.
 */

export function splitIntoChars(el: HTMLElement) {
  const text = el.textContent || "";
  el.textContent = "";
  if (text.includes("/")) {
    const segments = text.split("/");
    segments.forEach((seg, idx) => {
      const wrapper = document.createElement("span");
      wrapper.style.whiteSpace = "nowrap";
      const fullSeg = idx < segments.length - 1 ? seg + "/" : seg;
      for (let i = 0; i < fullSeg.length; i++) {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = fullSeg[i] === " " ? "\u00A0" : fullSeg[i] ?? "";
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

export function sweepTerminal(
  el: HTMLElement,
  speed: number,
  onComplete?: () => void,
  disposed?: () => boolean,
) {
  const chars = el.querySelectorAll(".char");
  let i = 0;
  function step() {
    if (disposed?.()) return;
    if (i > 0) chars[i - 1]?.classList.remove("active");
    if (i < chars.length) {
      chars[i]?.classList.add("active");
      i++;
      setTimeout(step, speed);
    } else {
      if (chars.length > 0) chars[chars.length - 1]?.classList.remove("active");
      onComplete?.();
    }
  }
  step();
}

/** Returns the element to animate: inner .terminal-link-label if present, else the link itself. */
function sweepTarget(link: HTMLElement): HTMLElement {
  return (link.querySelector(".terminal-link-label") as HTMLElement) ?? link;
}

/**
 * Attach the typewriter block animation to every .terminal-link found within
 * `root` (defaults to the whole document).
 * Returns a cleanup function that removes all listeners.
 */
export function initTerminalLinks(
  disposed: () => boolean,
  root: ParentNode = document,
): () => void {
  const cleanups: Array<() => void> = [];

  root.querySelectorAll<HTMLElement>(".terminal-link").forEach((link) => {
    const target = sweepTarget(link);
    splitIntoChars(target);
    let isAnimating = false;
    const onEnter = () => {
      if (isAnimating) return;
      isAnimating = true;
      sweepTerminal(target, 70, () => { isAnimating = false; }, disposed);
    };
    link.addEventListener("mouseenter", onEnter);
    cleanups.push(() => link.removeEventListener("mouseenter", onEnter));
  });

  return () => cleanups.forEach((fn) => fn());
}
