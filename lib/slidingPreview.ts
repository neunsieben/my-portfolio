/** Dual-layer horizontal slide used by the projects list bulls-eye and Grid View. */

export type PreviewItem =
  | { kind: "image"; src: string }
  | { kind: "video"; src: string; poster?: string }
  | { kind: "bg"; bg: string };

export const PREVIEW_CYCLE_MS = 3400;
export const PREVIEW_SLIDE_MS = 720;
export const PREVIEW_SLIDE_OVERLAP_PX = 2;
export const PREVIEW_SLIDE_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

export function pauseLayer(layer: HTMLElement | undefined) {
  layer?.querySelector("video")?.pause();
}

export function stopLayerAnims(layer: HTMLElement) {
  layer.getAnimations().forEach((anim) => anim.cancel());
}

export function hideLayer(layer: HTMLElement) {
  stopLayerAnims(layer);
  layer.style.opacity = "0";
  layer.style.transform = "scale(1.1)";
}

export function showLayerOpen(layer: HTMLElement) {
  stopLayerAnims(layer);
  layer.style.opacity = "1";
  layer.style.transform = "scale(1)";
}

export function fillPreviewLayer(
  layer: HTMLElement,
  item: PreviewItem,
  play = true,
) {
  const photo = layer.querySelector("img");
  const vid = layer.querySelector("video");
  layer.style.backgroundImage = "";
  if (item.kind === "image") {
    if (vid) {
      vid.pause();
      vid.style.display = "none";
    }
    if (photo) {
      if (photo.getAttribute("src") !== item.src) photo.src = item.src;
      photo.style.display = "block";
    }
  } else if (item.kind === "video") {
    if (photo) photo.style.display = "none";
    layer.style.backgroundImage = item.poster ? `url("${item.poster}")` : "";
    if (vid) {
      if (item.poster) vid.setAttribute("poster", item.poster);
      else vid.removeAttribute("poster");
      if (vid.getAttribute("src") !== item.src) {
        vid.src = item.src;
        vid.load();
      }
      vid.style.display = "block";
      if (play) vid.play().catch(() => {});
      else vid.pause();
    }
  } else {
    if (photo) photo.style.display = "none";
    if (vid) {
      vid.pause();
      vid.style.display = "none";
    }
    layer.style.backgroundImage = item.bg;
  }
}

export function waitForPreviewMedia(
  layer: HTMLElement,
  item: PreviewItem,
  timeoutMs: number,
) {
  const timeout = new Promise<void>((resolve) =>
    window.setTimeout(resolve, timeoutMs),
  );
  if (item.kind === "image") {
    const photo = layer.querySelector("img");
    if (!photo) return Promise.resolve();
    const loaded =
      photo.complete && photo.naturalWidth > 0
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            photo.addEventListener("load", () => resolve(), { once: true });
            photo.addEventListener("error", () => resolve(), { once: true });
          });
    const ready = loaded.then(() => photo.decode?.()).catch(() => undefined);
    return Promise.race([ready, timeout]);
  }
  if (item.kind === "video") {
    const vid = layer.querySelector("video");
    if (!vid || vid.readyState >= 2) return Promise.resolve();
    return Promise.race([
      new Promise<void>((resolve) => {
        const done = () => resolve();
        vid.addEventListener("loadeddata", done, { once: true });
        vid.addEventListener("error", done, { once: true });
      }),
      timeout,
    ]);
  }
  return Promise.resolve();
}

export function nextFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

export function previewSlideTransforms(dir: 1 | -1, widthPx: number) {
  const travel = Math.max(1, widthPx - PREVIEW_SLIDE_OVERLAP_PX);
  const ahead = `translate3d(${travel}px, 0, 0)`;
  const behind = `translate3d(${-travel}px, 0, 0)`;
  return {
    inFrom: dir === 1 ? ahead : behind,
    outTo: dir === 1 ? behind : ahead,
    timing: {
      duration: PREVIEW_SLIDE_MS,
      easing: PREVIEW_SLIDE_EASE,
      fill: "forwards",
    } satisfies KeyframeAnimationOptions,
  };
}

function reducePreviewMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function createSlidingPreview(root: HTMLElement) {
  const layers = Array.from(
    root.querySelectorAll<HTMLElement>("[data-preview-layer]"),
  );
  let front = 0;
  let gen = 0;
  let firstPaint = true;
  let cycleTimer: number | null = null;
  let cycleIdx = 0;
  let items: PreviewItem[] = [];
  let inView = false;
  let disposed = false;

  function playFront() {
    const layer = layers[front];
    const vid = layer?.querySelector("video");
    if (vid && getComputedStyle(vid).display !== "none") {
      vid.play().catch(() => {});
    }
  }

  async function transition(
    item: PreviewItem,
    mode: "cut" | "slide",
    dir: 1 | -1 = 1,
  ): Promise<boolean> {
    if (layers.length < 2) return false;
    const thisGen = ++gen;

    const inFlight = layers.flatMap((layer) => layer.getAnimations());
    if (inFlight.length) {
      await Promise.all(inFlight.map((a) => a.finished.catch(() => undefined)));
      if (thisGen !== gen || disposed) return false;
    }

    const incoming = layers[1 - front];
    const outgoing = layers[front];
    if (!incoming) return false;

    const wantSlide = mode === "slide" && !reducePreviewMotion();
    const instant = !wantSlide && (mode === "cut" || firstPaint || reducePreviewMotion());
    firstPaint = false;

    hideLayer(incoming);
    incoming.style.zIndex = "2";
    fillPreviewLayer(incoming, item, false);

    if (!instant && !wantSlide) {
      await waitForPreviewMedia(incoming, item, 80);
      if (thisGen !== gen || disposed) return false;
    }

    if (outgoing && outgoing !== incoming) {
      outgoing.style.zIndex = "1";
    }

    if (!wantSlide) {
      showLayerOpen(incoming);
      if (outgoing && outgoing !== incoming) {
        hideLayer(outgoing);
        pauseLayer(outgoing);
      }
      front = 1 - front;
      return true;
    }

    await waitForPreviewMedia(incoming, item, 900);
    if (thisGen !== gen || disposed) return false;

    let widthPx = 0;
    for (let i = 0; i < 45; i++) {
      widthPx = root.offsetWidth;
      if (widthPx >= 8 || disposed || thisGen !== gen) break;
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }
    if (thisGen !== gen || disposed) return false;
    if (widthPx < 8) return false;

    const { inFrom, outTo, timing } = previewSlideTransforms(dir, widthPx);
    incoming.style.transition = "none";
    incoming.style.transform = inFrom;
    incoming.style.opacity = "1";
    if (outgoing) {
      outgoing.style.transition = "none";
      stopLayerAnims(outgoing);
      outgoing.style.opacity = "1";
      outgoing.style.transform = "translate3d(0, 0, 0)";
    }
    void incoming.offsetWidth;
    if (thisGen !== gen || disposed) return false;

    const inAnim = incoming.animate(
      [{ transform: inFrom }, { transform: "translate3d(0, 0, 0)" }],
      timing,
    );

    if (outgoing) {
      stopLayerAnims(outgoing);
      outgoing.animate(
        [{ transform: "translate3d(0, 0, 0)" }, { transform: outTo }],
        timing,
      );
    }

    front = 1 - front;

    try {
      await inAnim.finished;
    } catch {
      return false;
    }
    if (thisGen !== gen || disposed) return false;
    incoming.style.transition = "none";
    incoming.style.opacity = "1";
    incoming.style.transform = "translate3d(0, 0, 0)";
    if (outgoing && outgoing !== incoming) {
      hideLayer(outgoing);
      pauseLayer(outgoing);
    }
    if (inView) playFront();
    return true;
  }

  function prefillNext() {
    if (items.length < 2) return;
    const next = items[(cycleIdx + 1) % items.length];
    const back = layers[1 - front];
    if (next && back) fillPreviewLayer(back, next, false);
  }

  function armCycle() {
    if (cycleTimer !== null) window.clearInterval(cycleTimer);
    cycleTimer = null;
    if (disposed || !inView || items.length < 2) return;
    cycleTimer = window.setInterval(() => {
      if (!inView || disposed) return;
      cycleIdx = (cycleIdx + 1) % items.length;
      const next = items[cycleIdx];
      if (next) void transition(next, "slide").then((ok) => {
        if (ok) prefillNext();
      });
    }, PREVIEW_CYCLE_MS);
  }

  function startCycle(nextItems: PreviewItem[]) {
    if (cycleTimer !== null) window.clearInterval(cycleTimer);
    cycleTimer = null;
    items = nextItems;
    cycleIdx = 0;
    firstPaint = true;
    if (!items[0] || disposed) return;
    void transition(items[0], "cut").then((ok) => {
      if (ok) prefillNext();
    });
    armCycle();
  }

  function setInView(visible: boolean) {
    inView = visible;
    if (!visible) {
      if (cycleTimer !== null) window.clearInterval(cycleTimer);
      cycleTimer = null;
      layers.forEach(pauseLayer);
      return;
    }
    playFront();
    armCycle();
  }

  function stop() {
    disposed = true;
    gen += 1;
    if (cycleTimer !== null) window.clearInterval(cycleTimer);
    cycleTimer = null;
    layers.forEach((layer) => {
      stopLayerAnims(layer);
      pauseLayer(layer);
    });
  }

  return { startCycle, setInView, stop };
}
