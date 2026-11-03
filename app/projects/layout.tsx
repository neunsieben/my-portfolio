import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leonard Baack — Projects",
  description: "Selected projects by Leonard Baack",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
