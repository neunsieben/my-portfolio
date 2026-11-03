import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leonard Baack — About",
  description: "About Leonard Baack",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
