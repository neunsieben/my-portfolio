/** Central project data — used by the projects list and individual project detail pages. */

export type ProjectMedia = {
  type: "image" | "video";
  src?: string;
  alt?: string;
  /** CSS background value shown as placeholder when no src is set */
  bg?: string;
};

export type ProjectDetail = {
  slug: string;
  num: string;
  name: string;
  category: string;
  year: string;
  description: string;
  client?: string;
  role?: string;
  collaborators?: string;
  visitUrl?: string;
  media: ProjectMedia[];
};

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export const PROJECT_DETAILS: ProjectDetail[] = [
  {
    slug: "zalazium-gmbh",
    num: "001",
    name: "Zalazium GmbH",
    category: "UX · Branding · Motion",
    year: "2025",
    client: "Zalazium GmbH",
    role: "UX Design, Visual Identity, Motion Design",
    visitUrl: "https://zalazium.de",
    description:
      "Zalazium is a German startup that combines artificial intelligence with GDPR compliance. It offers large language models and other AI applications for businesses that perform tasks in compliance with data protection regulations.\n\nIn 2025, I designed the company's website, created animations, revised the logo's word mark, and created a figurative mark.",
    media: [
      { type: "image", bg: "linear-gradient(135deg,#c8c6c2,#d8d6d2,#bab8b4)" },
      { type: "image", bg: "linear-gradient(160deg,#d0ceca,#bab8b4,#c8c6c2)" },
      { type: "image", bg: "linear-gradient(135deg,#c8c6c2,#d8d6d2,#bab8b4)" },
      { type: "image", bg: "linear-gradient(160deg,#d0ceca,#bab8b4,#c8c6c2)" },
    ],
  },
  {
    slug: "daily-grind-coffee",
    num: "002",
    name: "Daily Grind Coffee",
    category: "Branding · Packaging",
    year: "2024",
    client: "Daily Grind Coffee",
    role: "Brand Identity, Packaging Design",
    description: LOREM,
    media: [
      { type: "image", bg: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)" },
      { type: "image", bg: "linear-gradient(160deg,#0f3460,#1a1a2e,#16213e)" },
      { type: "image", bg: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)" },
      { type: "image", bg: "linear-gradient(160deg,#0f3460,#1a1a2e,#16213e)" },
    ],
  },
  {
    slug: "donata-jan-trio",
    num: "003",
    name: "Donata Jan Trio",
    category: "Album Artwork",
    year: "2024",
    client: "Donata Jan Trio",
    role: "Art Direction, Album Artwork",
    description: LOREM,
    media: [
      {
        type: "image",
        src: "/images/projects/home/home-thumbnail.jpg",
        alt: "Donata Jan Trio — HOME album artwork",
      },
      { type: "image", bg: "linear-gradient(160deg,#0a0604,#2a1a0e,#1a0e06)" },
      { type: "image", bg: "linear-gradient(135deg,#2a1a0e,#1a0e06,#0a0604)" },
      { type: "image", bg: "linear-gradient(160deg,#0a0604,#2a1a0e,#1a0e06)" },
    ],
  },
  {
    slug: "studio-liebe",
    num: "004",
    name: "Studio Liebe",
    category: "Branding · Web Design",
    year: "2023",
    client: "Studio Liebe",
    role: "Visual Branding, Web Design",
    description: LOREM,
    media: [
      {
        type: "image",
        src: "/images/projects/studio_liebe/studio_liebe_thumbnail.jpg",
        alt: "Studio Liebe",
      },
      { type: "image", bg: "linear-gradient(160deg,#c0beba,#cccac6,#d4d2ce)" },
      { type: "image", bg: "linear-gradient(135deg,#cccac6,#d4d2ce,#c0beba)" },
      { type: "image", bg: "linear-gradient(160deg,#c0beba,#cccac6,#d4d2ce)" },
    ],
  },
  {
    slug: "resort-13",
    num: "005",
    name: "Resort 13",
    category: "Branding · Social Media",
    year: "2025",
    client: "Resort 13",
    role: "Logo & Brand Identity, Social Media Design",
    description:
      "Resort 13 is a house music DJ and live performance event series. I created the branding and logo for the collective and design their social media advertisements — building a visual language that captures the energy and aesthetic of their events.",
    media: [
      {
        type: "image",
        src: "/images/projects/resort13/resort13_thumbnail.jpg",
        alt: "Resort 13 — social media advertisement",
      },
      {
        type: "image",
        src: "/images/projects/resort13/resort13_july_bg.jpg",
        alt: "Resort 13 — July event poster",
      },
      {
        type: "video",
        src: "/images/projects/resort13/resort13_firefly.mp4",
        alt: "Resort 13 — motion design",
      },
      {
        type: "video",
        src: "/images/projects/resort13/resort13_making_of.mp4",
        alt: "Resort 13 — making of",
      },
    ],
  },
  {
    slug: "hafenklang-visuals",
    num: "006",
    name: "Hafenklang Visuals",
    category: "Motion Design",
    year: "2023",
    client: "Hafenklang",
    role: "Motion Design, Live Visuals",
    description: LOREM,
    media: [
      { type: "image", bg: "linear-gradient(135deg,#2c2c3a,#3c3c4a,#4c4c5a)" },
      { type: "image", bg: "linear-gradient(160deg,#4c4c5a,#2c2c3a,#3c3c4a)" },
      { type: "image", bg: "linear-gradient(135deg,#2c2c3a,#3c3c4a,#4c4c5a)" },
      { type: "image", bg: "linear-gradient(160deg,#4c4c5a,#2c2c3a,#3c3c4a)" },
    ],
  },
];

/** Quick lookup: project number → slug */
export const NUM_TO_SLUG: Record<string, string> = {
  "001": "zalazium-gmbh",
  "002": "daily-grind-coffee",
  "003": "donata-jan-trio",
  "004": "studio-liebe",
  "005": "resort-13",
  "006": "hafenklang-visuals",
};
