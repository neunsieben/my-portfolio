import type { Metadata } from "next";
import { PROJECT_DETAILS } from "@/lib/projectsData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECT_DETAILS.find((p) => p.slug === slug);
  if (!project) return { title: "Leonard Semmler — Projects" };
  return {
    title: `${project.name} — Leonard Semmler`,
    description: project.description.slice(0, 160),
  };
}

export default function ProjectSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
