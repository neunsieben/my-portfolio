"use client";

import { createElement, useEffect, useRef } from "react";

type Variant = "mark" | "horizontal" | "stacked";

/** Logo construction player. Plays when the frame is in view. Click replays. */
export function HmConstruction({ variant = "mark" }: { variant?: Variant }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    void import("./hm-construction.js");
  }, []);

  return createElement("hm-construction", {
    ref,
    variant,
    loop: "",
    style: {
      display: "block",
      width: "100%",
      aspectRatio: "4 / 3",
      background: "#0a0a0a",
      color: "#f5f4f0",
      ["--hm-bg" as string]: "#0a0a0a",
      ["--hm-ink" as string]: "#f5f4f0",
      ["--hm-guide" as string]: "#ff5b40",
      ["--hm-measure" as string]: "#b5b2ac",
      ["--hm-font" as string]: "var(--font-mono)",
      ["--hm-caption-size" as string]: "11px",
      ["--hm-caption-leading" as string]: "1.9",
    },
  });
}
