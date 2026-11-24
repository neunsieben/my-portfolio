/** Central project data — used by the projects list and individual project detail pages. */

export type ProjectMedia = {
  type: "image" | "video";
  src?: string;
  alt?: string;
  /** Still shown before the video can paint, and on phones that skip autoplay */
  poster?: string;
  /** CSS background value shown as placeholder when no src is set */
  bg?: string;
  /** Square cover, centered in a black 4:3 frame. Only the cover tilts. */
  presentation?: "tilt-cover" | "hm-construction" | "story" | "reel" | "carousel";
  /** Keeps neighbouring stories or carousels apart: a new value starts a new player. */
  group?: string;
  /** Post text for presentation "carousel", read from the first slide. */
  post?: {
    caption?: string;
    likes?: string;
    /** Slide shape: square (default) or Instagram's 4:5 portrait. */
    format?: "square" | "portrait";
  };
  /** Overlay text for presentation "reel". */
  reel?: {
    caption?: string;
    /** Audio line, e.g. "Artist · Song". */
    audio?: string;
    likes?: string;
    comments?: string;
  };
  /** Seconds a still story stays up (presentation "story"). Defaults to 5. */
  duration?: number;
  /** Which Henning Media construction sequence to play. */
  hm?: "mark" | "horizontal" | "stacked";
  /** Still 4:3 stand-in for list and grid when presentation is tilt-cover. */
  frame?: string;
  /** Stronger lamp so the highlight reads on a black cover. */
  lamp?: "strong";
};

/** Account shown on "story", "reel" and "carousel" media. */
export type StoryAccount = {
  handle: string;
  /** Small square image, shown cropped to a circle. */
  avatar?: string;
  /** Plain colour fill instead of an image, e.g. "#fc7b03". */
  avatarColor?: string;
  /** Short label next to the handle, e.g. "2h". */
  time?: string;
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
  storyAccount?: StoryAccount;
  media: ProjectMedia[];
};

export const HUNGRY4_COVER =
  "/images/projects/hungry4/hungry4_cover_alec_dienaar_if_you_can.jpg";

/** Still 4:3 thumbnail: black frame, cover centered. Used by list and grid. */
export const HUNGRY4_FRAME =
  "/images/projects/hungry4/hungry4_cover_frame.jpg";

export const KOLSCH_COVER =
  "/images/projects/koelsch/kolsch_kinema_album_cover.jpg";

export const KOLSCH_FRAME =
  "/images/projects/koelsch/kolsch_kinema_album_cover_frame.jpg";

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const LOREM_DE =
  "Dies ist ein Blindtext als Platzhalter für die deutsche Projektbeschreibung. Er dient dazu, Satzlänge, Zeilenumbruch und Lesefluss darzustellen, bis der eigentliche Text vorliegt. Sobald die englische Fassung final ist, wird dieser Absatz durch die deutsche Übersetzung ersetzt.";

export const PROJECT_DETAILS: ProjectDetail[] = [
  {
    slug: "zalazium-gmbh",
    num: "008",
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
      {
        type: "video",
        src: "/images/projects/zalazium/zalazium_intro.mp4",
        poster: "/images/projects/zalazium/zalazium_intro_poster.jpg",
        alt: "Zalazium — intro animation",
      },
      {
        type: "video",
        src: "/images/projects/zalazium/zalazium_sicherheit.mp4",
        poster: "/images/projects/zalazium/zalazium_sicherheit_poster.jpg",
        alt: "Zalazium — security animation",
      },
      {
        type: "video",
        src: "/images/projects/zalazium/zalazium_style_guide.mp4",
        poster: "/images/projects/zalazium/zalazium_style_guide_poster.jpg",
        alt: "Zalazium — style guide animation",
      },
      {
        type: "image",
        src: "/images/projects/zalazium/zalazium_logo_construction.jpg",
        alt: "Zalazium — logo construction",
      },
    ],
  },
  {
    slug: "daily-grind-coffee",
    num: "006",
    name: "Daily Grind Coffee",
    category: "Branding · Packaging",
    year: "2024",
    client: "Daily Grind Coffee",
    role: "Brand Identity, Packaging Design",
    description: LOREM,
    descriptionDe: LOREM_DE,
    media: [
      {
        type: "video",
        src: "/images/projects/daily_grind/daily_grind_beans_trailer.mp4",
        poster: "/images/projects/daily_grind/daily_grind_beans_trailer_poster.jpg",
        alt: "Daily Grind Coffee — animated logo trailer",
      },
      {
        type: "video",
        src: "/images/projects/daily_grind/daily_grind_cup_text.mp4",
        poster: "/images/projects/daily_grind/daily_grind_cup_text_poster.jpg",
        alt: "Daily Grind Coffee — cup text animation",
      },
    ],
  },
  {
    slug: "donata-jan-trio",
    num: "002",
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
    storyAccount: {
      handle: "studioliebe",
      avatarColor: "#fc7b03",
    },
    media: [
      {
        type: "video",
        src: "/images/projects/studio_liebe/studio_liebe_logo_animation.mp4",
        alt: "Studio Liebe — logo animation",
      },
      {
        type: "video",
        src: "/images/projects/studio_liebe/studio_liebe_logo_circles.mp4",
        alt: "Studio Liebe — the circles the logo is built from",
      },
      {
        type: "video",
        src: "/images/projects/studio_liebe/studio_liebe_star_construction.mp4",
        alt: "Studio Liebe — how the star is made from four circles",
      },
      {
        type: "image",
        src: "/images/projects/studio_liebe/studio_liebe_thumbnail.jpg",
        alt: "Studio Liebe",
      },
      {
        type: "video",
        src: "/images/projects/studio_liebe/studio_liebe_recap.mp4",
        alt: "Studio Liebe — recap",
      },
      {
        type: "image",
        src: "/images/projects/studio_liebe/carousel/studio_liebe_carousel_01.jpg",
        alt: "Studio Liebe Vol. 1 — carousel slide 1",
        presentation: "carousel",
        post: {
          caption:
            "Vol. 1 — Nov. 30, Sternschanze. Doors and dinner from 7 PM, music from 9 PM. Line-up A–Z: Anton Jonathan, Daisy Weweh, Eni Hartmann, Hello 911, Lenard Klein. Limited capacity.",
        },
      },
      {
        type: "image",
        src: "/images/projects/studio_liebe/carousel/studio_liebe_carousel_02.jpg",
        alt: "Studio Liebe Vol. 1 — carousel slide 2",
        presentation: "carousel",
      },
      {
        type: "image",
        src: "/images/projects/studio_liebe/carousel/studio_liebe_carousel_03.jpg",
        alt: "Studio Liebe Vol. 1 — carousel slide 3",
        presentation: "carousel",
      },
      {
        type: "image",
        src: "/images/projects/studio_liebe/carousel/studio_liebe_carousel_04.jpg",
        alt: "Studio Liebe Vol. 1 — carousel slide 4",
        presentation: "carousel",
      },
      {
        type: "image",
        src: "/images/projects/studio_liebe/carousel/studio_liebe_carousel_05.jpg",
        alt: "Studio Liebe Vol. 1 — carousel slide 5",
        presentation: "carousel",
      },
      {
        type: "image",
        src: "/images/projects/studio_liebe/carousel/studio_liebe_carousel_06.jpg",
        alt: "Studio Liebe Vol. 1 — carousel slide 6",
        presentation: "carousel",
      },
      {
        type: "image",
        src: "/images/projects/studio_liebe/carousel/studio_liebe_carousel_07.jpg",
        alt: "Studio Liebe Vol. 1 — carousel slide 7",
        presentation: "carousel",
      },
      {
        type: "image",
        src: "/images/projects/studio_liebe/carousel/studio_liebe_carousel_08.jpg",
        alt: "Studio Liebe Vol. 1 — carousel slide 8",
        presentation: "carousel",
      },
      {
        type: "image",
        src: "/images/projects/studio_liebe/carousel/studio_liebe_carousel_09.jpg",
        alt: "Studio Liebe Vol. 1 — carousel slide 9",
        presentation: "carousel",
      },
      {
        type: "image",
        src: "/images/projects/studio_liebe/carousel_kb/studio_liebe_kb_carousel_01.jpg",
        alt: "Studio Liebe × Künstlerbörse — carousel slide 1",
        presentation: "carousel",
        group: "kb",
        post: {
          caption:
            "Studio Liebe × Künstlerbörse — Feb. 03, 4 PM–4 AM, Cramer Wohnvilla, Osterstraße 29. Line-up: Hello 911, Eni Hartmann, Bomchello b2b Maximmodus, Margo, Anton Jonathan b2b Fion, Finona Rider, Enzo V8, Hæbn. A safe space for everyone.",
        },
      },
      {
        type: "image",
        src: "/images/projects/studio_liebe/carousel_kb/studio_liebe_kb_carousel_02.jpg",
        alt: "Studio Liebe × Künstlerbörse — carousel slide 2",
        presentation: "carousel",
        group: "kb",
      },
      {
        type: "image",
        src: "/images/projects/studio_liebe/carousel_kb/studio_liebe_kb_carousel_03.jpg",
        alt: "Studio Liebe × Künstlerbörse — carousel slide 3",
        presentation: "carousel",
        group: "kb",
      },
      {
        type: "image",
        src: "/images/projects/studio_liebe/post_valentines/studio_liebe_valentines_post.jpg",
        alt: "Studio Liebe Vol. 2 — Valentine's Day",
        presentation: "carousel",
        group: "valentines",
        post: {
          caption: "music is for lovers pres. Studio Liebe Vol. 2 — Valentine's Day.",
        },
      },
      {
        type: "image",
        src: "/images/projects/studio_liebe/story/studio_liebe_story_venue.jpg",
        alt: "Studio Liebe — the venue with the neon sign",
        presentation: "story",
      },
      {
        type: "video",
        src: "/images/projects/studio_liebe/story/studio_liebe_story_party.mp4",
        poster: "/images/projects/studio_liebe/story/studio_liebe_story_party_poster.jpg",
        alt: "Studio Liebe — party",
        presentation: "story",
      },
    ],
  },
  {
    slug: "resort-13",
    num: "009",
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
    num: "001",
    name: "CPxArt x Forbes",
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
        alt: "CPxArt x Forbes — hand-painted bomber jackets",
      },
      {
        type: "image",
        src: "/images/projects/cpxart/cpxart_yellow_jacket.jpg",
        alt: "CPxArt x Forbes — studio shot, yellow jacket",
      },
      {
        type: "image",
        src: "/images/projects/cpxart/cpxart_red_jacket.jpg",
        alt: "CPxArt x Forbes — studio shot, red jacket",
      },
      {
        type: "image",
        src: "/images/projects/cpxart/cpxart_2.jpg",
        alt: "CPxArt x Forbes — hand-painted bomber jacket detail",
      },
      {
        type: "image",
        src: "/images/projects/cpxart/cpxart_forbes_screenshot.jpg",
        alt: "CPxArt x Forbes — Forbes article screenshot",
      },
    ],
  },
  {
    slug: "carlitoz-way",
    num: "010",
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
    num: "005",
    name: "Magic Mansion",
    category: "Branding",
    year: "2025",
    client: "Magic Mansion",
    role: "Rebranding",
    description: LOREM,
    descriptionDe: LOREM_DE,
    storyAccount: {
      handle: "magicmansion",
      avatar: "/images/projects/magic_mansion/story_avatar.jpg",
    },
    media: [
      {
        type: "image",
        src: "/images/projects/magic_mansion/insta_logo_bk.jpg",
        alt: "Magic Mansion — story, black",
        presentation: "story",
      },
      {
        type: "image",
        src: "/images/projects/magic_mansion/insta_logo_wh.jpg",
        alt: "Magic Mansion — story, white",
        presentation: "story",
      },
    ],
  },
  {
    slug: "kolsch-ipso",
    num: "007",
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
        src: KOLSCH_COVER,
        alt: "Kölsch — Kinema cover",
        presentation: "tilt-cover",
        frame: KOLSCH_FRAME,
      },
      {
        type: "image",
        src: "/images/projects/koelsch/koelsch_kinema_spotify.jpg",
        alt: "Kölsch — KINEMEA album on Spotify",
      },
    ],
  },
  {
    slug: "henning-media",
    num: "011",
    name: "Henning Media",
    category: "Logo Design",
    year: "2026",
    client: "Niklas Henning / Henning Media",
    role: "Logo Design",
    description:
      "Logo for photographer and videographer Niklas Henning, now working as Henning Media.\n\nIn 2026 I designed the mark and its construction — from first sketches through the finished identity.",
    descriptionDe:
      "Logo für den Fotografen und Videografen Niklas Henning, der heute als Henning Media arbeitet.\n\n2026 habe ich die Bildmarke und ihre Konstruktion gestaltet — von den ersten Skizzen bis zur fertigen Identität.",
    media: [
      {
        type: "image",
        presentation: "hm-construction",
        hm: "mark",
        alt: "Construction of the Henning Media monogram",
      },
      {
        type: "image",
        presentation: "hm-construction",
        hm: "horizontal",
        alt: "Construction of the Henning Media horizontal lockup",
      },
      {
        type: "image",
        presentation: "hm-construction",
        hm: "stacked",
        alt: "Construction of the Henning Media stacked lockup",
      },
    ],
  },
  {
    slug: "hungry4",
    num: "012",
    name: "Hungry4",
    category: "Art Direction · Album Artwork · Video Edit",
    year: "2026",
    client: "Hungry4 Records",
    role: "Art Direction, EP Cover Artwork, Walkman Design, Video Edit",
    collaborators: "Alec Dienaar, Hungry4 Records",
    description:
      "Hungry4 Records builds every release around its artists: their tastes and preferences set the direction, and the label's visual universe gives them a path to walk. For Alec Dienaar's EP If You Can, that meant keeping the classic Hungry4 look that runs through the label's feed, while catching Alec's character in a single moment.\n\nI art directed the release, designed the EP cover and the Walkman at its centre, branded in Hungry4's colours, and edited the accompanying video.",
    descriptionDe:
      "Hungry4 Records baut jedes Release um seine Künstler:innen herum: Ihre Vorlieben geben die Richtung vor, das visuelle Universum des Labels gibt ihnen einen Weg, den sie gehen können. Für Alec Dienaars EP If You Can hieß das, den klassischen Hungry4-Look beizubehalten, der sich durch den Feed des Labels zieht, und gleichzeitig Alecs Charakter in einem einzigen Moment festzuhalten.\n\nIch habe die Art Direction des Releases übernommen, das EP-Cover und den Walkman im Zentrum gestaltet, gebrandet in den Farben von Hungry4, und das begleitende Video geschnitten.",
    storyAccount: {
      handle: "hungry4",
      avatarColor: "#9B0707",
    },
    media: [
      {
        type: "image",
        src: HUNGRY4_COVER,
        alt: "Hungry4 — cover",
        presentation: "tilt-cover",
        lamp: "strong",
        frame: HUNGRY4_FRAME,
      },
      {
        type: "video",
        src: "/images/projects/hungry4/hungry4_reel.mp4",
        poster: "/images/projects/hungry4/hungry4_reel_poster.jpg",
        alt: "Hungry4 — Alec Dienaar, If You Can, reel",
        presentation: "reel",
        reel: {
          caption: "Alec Dienaar — If You Can · 20.11.26",
          audio: "Alec Dienaar · If You Can",
        },
      },
      {
        type: "video",
        src: "/images/projects/hungry4/carousel/hungry4_ep004_01.mp4",
        poster: "/images/projects/hungry4/carousel/hungry4_ep004_01_poster.jpg",
        alt: "Hungry4 EP004 — Alec Dienaar, If You Can",
        presentation: "carousel",
        post: {
          caption:
            "EP004 — Alec Dienaar, If You Can. Four tracks: If You Can, Who's In?, For All The Ladies and If You Can (Cuba Remix). Out 20.11.26 on Hungry4 Records.",
          format: "portrait",
        },
      },
      {
        type: "video",
        src: "/images/projects/hungry4/carousel/hungry4_ep004_02.mp4",
        poster: "/images/projects/hungry4/carousel/hungry4_ep004_02_poster.jpg",
        alt: "Hungry4 EP004 — Alec Dienaar, Who's In?",
        presentation: "carousel",
      },
      {
        type: "video",
        src: "/images/projects/hungry4/carousel/hungry4_ep004_03.mp4",
        poster: "/images/projects/hungry4/carousel/hungry4_ep004_03_poster.jpg",
        alt: "Hungry4 EP004 — Alec Dienaar, For All The Ladies",
        presentation: "carousel",
      },
      {
        type: "video",
        src: "/images/projects/hungry4/carousel/hungry4_ep004_04.mp4",
        poster: "/images/projects/hungry4/carousel/hungry4_ep004_04_poster.jpg",
        alt: "Hungry4 EP004 — Alec Dienaar, If You Can (Cuba Remix)",
        presentation: "carousel",
      },
    ],
  },
  {
    slug: "hifi-klubben",
    num: "003",
    name: "HiFi Klubben",
    category: "Branding",
    year: "—",
    client: "HiFi Klubben",
    description: LOREM,
    descriptionDe: LOREM_DE,
    media: [
      { type: "image", bg: "linear-gradient(135deg,#1c1a17,#2a2622,#12110f)" },
      { type: "image", bg: "linear-gradient(160deg,#12110f,#1c1a17,#2a2622)" },
    ],
  },
];

/** Quick lookup: project number → slug. 001 is the oldest, 012 the newest. */
export const NUM_TO_SLUG: Record<string, string> = {
  "001": "forbes-cpxart",
  "002": "donata-jan-trio",
  "003": "hifi-klubben",
  "004": "studio-liebe",
  "005": "magic-mansion",
  "006": "daily-grind-coffee",
  "007": "kolsch-ipso",
  "008": "zalazium-gmbh",
  "009": "resort-13",
  "010": "carlitoz-way",
  "011": "henning-media",
  "012": "hungry4",
};
