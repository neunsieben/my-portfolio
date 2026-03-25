import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leonard Semmler — About",
  description: "About Leonard Semmler",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
