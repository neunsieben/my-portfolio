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
      color: "#0a0a0a",
      ["--hm-bg" as string]: "#f5f4f0",
      ["--hm-ink" as string]: "#0a0a0a",
    },
  });
}
