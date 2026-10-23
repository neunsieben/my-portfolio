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
  descriptionDe: string;
  client?: string;
  role?: string;
  collaborators?: string;
  visitUrl?: string;
  visitLabel?: string;
  media: ProjectMedia[];
};

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const LOREM_DE =
  "Dies ist ein Blindtext als Platzhalter für die deutsche Projektbeschreibung. Er dient dazu, Satzlänge, Zeilenumbruch und Lesefluss darzustellen, bis der eigentliche Text vorliegt. Sobald die englische Fassung final ist, wird dieser Absatz durch die deutsche Übersetzung ersetzt.";

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
    visitLabel: "zalazium.de",
    description:
      "Zalazium is a German startup that combines artificial intelligence with GDPR compliance. It offers large language models and other AI applications for businesses that perform tasks in compliance with data protection regulations.\n\nIn 2025, I designed the company's website, created animations, revised the logo's word mark, and created a figurative mark.",
    descriptionDe:
      "Zalazium ist ein deutsches Startup, das künstliche Intelligenz mit DSGVO-Konformität verbindet. Es bietet große Sprachmodelle und weitere KI-Anwendungen für Unternehmen, die Aufgaben datenschutzkonform ausführen.\n\n2025 habe ich die Website des Unternehmens gestaltet, Animationen erstellt, den Wortmarkenteil des Logos überarbeitet und eine Bildmarke entworfen.",
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
    descriptionDe: LOREM_DE,
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
    descriptionDe: LOREM_DE,
    media: [
      {
        type: "image",
        src: "/images/projects/donata_jan_trio/donata_cover_mockup.jpg",
        alt: "Donata Jan Trio — HOME digipak and CD mockup on wood",
      },
      {
        type: "image",
        src: "/images/projects/donata_jan_trio/donata_cover.jpg",
        alt: "Donata Jan Trio — cover outside and inside",
      },
      {
        type: "image",
        src: "/images/projects/donata_jan_trio/donata_bandcamp.jpg",
        alt: "Donata Jan Trio — Bandcamp screenshot",
      },
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
    descriptionDe: LOREM_DE,
    media: [
      {
        type: "image",
        src: "/images/projects/studio_liebe/studio_liebe_thumbnail.jpg",
        alt: "Studio Liebe",
      },
      {
        type: "video",
        src: "/images/projects/studio_liebe/studio_liebe_logo_animation.mp4",
        alt: "Studio Liebe — logo animation",
      },
      {
        type: "video",
        src: "/images/projects/studio_liebe/studio_liebe_recap.mp4",
        alt: "Studio Liebe — recap",
      },
    ],
  },
  {
    slug: "resort-13",
    num: "005",
    name: "Resort 13 x PALLAS",
    category: "Branding · Social Media",
    year: "2025",
    client: "Resort 13 x PALLAS",
    role: "Logo & Brand Identity, Social Media Design",
    description:
      "Resort 13 x PALLAS is a house music DJ and live performance event series. I created the branding and logo for the collective and design their social media advertisements — building a visual language that captures the energy and aesthetic of their events.",
    descriptionDe:
      "Resort 13 x PALLAS ist eine Eventreihe für House-Music-DJs und Live-Performances. Ich habe Branding und Logo für das Kollektiv entwickelt und gestalte ihre Social-Media-Anzeigen — und baue damit eine visuelle Sprache, die die Energie und Ästhetik ihrer Events einfängt.",
    media: [
      {
        type: "video",
        src: "/images/projects/resort13/resort13_inspo_process.mp4",
        alt: "Resort 13 — inspo process",
      },
    ],
  },
  {
    slug: "forbes-cpxart",
    num: "006",
    name: "Forbes x CPxArt",
    category: "Art · Fashion",
    year: "2017",
    client: "CPxArt",
    role: "Artist",
    collaborators: "Donaldson Sackey (reference)",
    visitUrl: "https://www.forbes.com/sites/kristenphilipkoski/2017/11/19/cpxart/",
    visitLabel: "Forbes",
    description:
      "In 2017, I hand-painted bomber jackets for the brand CPxArt — each piece a one-of-a-kind wearable artwork.\n\nThe project was featured in the Forbes article \"Wear A Masterpiece On Your Back With These One-of-a-Kind Bomber Jackets\" by Kristen Philipkoski.",
    descriptionDe:
      "2017 habe ich Bomberjacken für die Marke CPxArt von Hand bemalt — jedes Stück ein Unikat und tragbares Kunstwerk.\n\nDas Projekt wurde im Forbes-Artikel „Wear A Masterpiece On Your Back With These One-of-a-Kind Bomber Jackets“ von Kristen Philipkoski vorgestellt.",
    media: [
      {
        type: "image",
        src: "/images/projects/cpxart/cpxart_1.jpg",
        alt: "Forbes x CPxArt — hand-painted bomber jackets",
      },
      {
        type: "image",
        src: "/images/projects/cpxart/cpxart_yellow_jacket.jpg",
        alt: "Forbes x CPxArt — studio shot, yellow jacket",
      },
      {
        type: "image",
        src: "/images/projects/cpxart/cpxart_red_jacket.jpg",
        alt: "Forbes x CPxArt — studio shot, red jacket",
      },
      {
        type: "image",
        src: "/images/projects/cpxart/cpxart_2.jpg",
        alt: "Forbes x CPxArt — hand-painted bomber jacket detail",
      },
      {
        type: "image",
        src: "/images/projects/cpxart/cpxart_3.jpg",
        alt: "Forbes x CPxArt — hand-painted bomber jacket",
      },
      {
        type: "image",
        src: "/images/projects/cpxart/cpxart_forbes_screenshot.jpg",
        alt: "Forbes x CPxArt — Forbes article screenshot",
      },
    ],
  },
  {
    slug: "carlitoz-way",
    num: "007",
    name: "Carlitoz Way",
    category: "Packaging Design",
    year: "2026",
    client: "Carlitoz Way",
    role: "Packaging Design",
    description: LOREM,
    descriptionDe: LOREM_DE,
    media: [
      {
        type: "image",
        src: "/images/projects/carlitoz_way/carlitoz_box_top.jpg",
        alt: "Carlitoz Way — box top view",
      },
      {
        type: "image",
        src: "/images/projects/carlitoz_way/carlitoz_box_open.jpg",
        alt: "Carlitoz Way — box open",
      },
      {
        type: "image",
        src: "/images/projects/carlitoz_way/carlitoz_close_up.jpg",
        alt: "Carlitoz Way — close up box papeleta",
      },
      {
        type: "image",
        src: "/images/projects/carlitoz_way/carlitoz_box_template.jpg",
        alt: "Carlitoz Way — box template flat",
      },
      {
        type: "image",
        src: "/images/projects/carlitoz_way/carlitoz_papeleta_total.jpg",
        alt: "Carlitoz Way — papeleta packaging",
      },
      {
        type: "image",
        src: "/images/projects/carlitoz_way/carlitoz_papeleta_left.jpg",
        alt: "Carlitoz Way — papeleta left",
      },
      {
        type: "image",
        src: "/images/projects/carlitoz_way/carlitoz_shirt_frontal.jpg",
        alt: "Carlitoz Way — shirt frontal",
      },
      {
        type: "image",
        src: "/images/projects/carlitoz_way/carlitoz_shirt_folded_closer.jpg",
        alt: "Carlitoz Way — shirt folded closer",
      },
      {
        type: "image",
        src: "/images/projects/carlitoz_way/carlitoz_shirt_label.jpg",
        alt: "Carlitoz Way — shirt label close up",
      },
    ],
  },
  {
    slug: "magic-mansion",
    num: "008",
    name: "Magic Mansion",
    category: "Branding",
    year: "2025",
    client: "Magic Mansion",
    role: "Rebranding",
    description: LOREM,
    descriptionDe: LOREM_DE,
    media: [
      { type: "image", bg: "linear-gradient(135deg,#1a0a2e,#2d1054,#3d1a6e)" },
      { type: "image", bg: "linear-gradient(160deg,#3d1a6e,#1a0a2e,#2d1054)" },
    ],
  },
  {
    slug: "kolsch-ipso",
    num: "009",
    name: "Kölsch / IPSO",
    category: "Album Artwork · Tour Design",
    year: "2025",
    client: "Kölsch / IPSO",
    role: "Album Cover Artwork, Tour Design",
    description:
      "In 2025, I created the album cover artwork for Kölsch's album \"Kinema\".\n\nI also designed the visual identity for his Europe Tour, titled \"Kölsch and the Machine\".",
    descriptionDe:
      "2025 habe ich das Albumcover für Kölschs Album „Kinema“ gestaltet.\n\nAußerdem habe ich die visuelle Identität für seine Europatournee „Kölsch and the Machine“ entworfen.",
    media: [
      {
        type: "image",
        src: "/images/projects/koelsch/koelsch_kinema_spotify.jpg",
        alt: "Kölsch — KINEMEA album on Spotify",
      },
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
  "006": "forbes-cpxart",
  "007": "carlitoz-way",
  "008": "magic-mansion",
  "009": "kolsch-ipso",
};
