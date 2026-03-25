import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leonard Semmler — Projects",
  description: "Selected projects by Leonard Semmler",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
