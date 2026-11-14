"use client";

import { PROJECT_DETAILS } from "@/lib/projectsData";
import {
  createSlidingPreview,
  type PreviewItem,
} from "@/lib/slidingPreview";
import { useEffect, useRef } from "react";

const PREVIEW_DIR = "/images/previews/";
const ORIGINAL_DIR = "/images/projects/";

function previewSrc(src: string) {
  return src.startsWith(ORIGINAL_DIR) && src.endsWith(".jpg")
    ? PREVIEW_DIR + src.slice(ORIGINAL_DIR.length)
    : src;
}

function itemsFor(slug: string): PreviewItem[] {
  const media = PROJECT_DETAILS.find((project) => project.slug === slug)?.media ?? [];
  const items: PreviewItem[] = [];
  for (const item of media) {
    if (item.presentation === "tilt-cover" && item.frame) {
      items.push({ kind: "image", src: previewSrc(item.frame) });
      continue;
    }
    if (!item.src) continue;
    if (item.type === "image") {
      items.push({ kind: "image", src: previewSrc(item.src) });
    }
    if (item.type === "video") {
      items.push({
        kind: "video",
        src: item.src,
        poster: item.poster ? previewSrc(item.poster) : undefined,
      });
    }
  }
  return items;
}

/** Homepage selected-work frame. Same horizontal slide as the projects bulls-eye. */
export function ProjectSlide({ slug }: { slug: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const preview = createSlidingPreview(root);
    preview.startCycle(itemsFor(slug));
    const io = new IntersectionObserver(
      ([entry]) => preview.setInView(!!entry?.isIntersecting),
      { threshold: 0.35 },
    );
    io.observe(root);
    return () => {
      io.disconnect();
      preview.stop();
    };
  }, [slug]);

  return (
    <div ref={rootRef} className="project-img">
      <div className="preview-layer" data-preview-layer="0">
        <img alt="" />
        <video muted loop playsInline preload="none" />
      </div>
      <div className="preview-layer" data-preview-layer="1">
        <img alt="" />
        <video muted loop playsInline preload="none" />
      </div>
    </div>
  );
}
