import type { CaseStudyNavItem } from "../caseStudyNavItems";
import { INTRODUCTION_NAV_ID } from "../caseStudyNavItems";

export const SHUFFLR_FIGMA_EMBED_URL = "";

export const SHUFFLR_TAGLINE =
  "Lowering the activation energy of fun,\nlow-stakes hangout moments!";

/** Single-line tagline for home cards / hover (no forced break). */
export const SHUFFLR_TAGLINE_INLINE =
  "Lowering the activation energy of fun, low-stakes hangout moments!";

export const SHUFFLR_VIDEOS = {
  shuffle: "/videos/shufflr/shuffle.mp4",
  community: "/videos/shufflr/community.mp4",
} as const;

export const SHUFFLR_IMAGES = {
  discover: "/images/shufflr/discover.png",
  profileMemories: "/images/shufflr/profile-memories.png",
} as const;

export const SHUFFLR_NAV_ITEMS: CaseStudyNavItem[] = [
  { id: INTRODUCTION_NAV_ID, label: "Introduction", kind: "heading" },
  { id: "challenge", label: "Challenge", kind: "item" },
  { id: "problem", label: "Problem", kind: "item" },
  { id: "solution", label: "Solution", kind: "item" },
  { id: "system", label: "System", kind: "item" },
  { id: "features", label: "Core features", kind: "item" },
  { id: "learnings", label: "Key learnings", kind: "item" },
  { id: "reflection", label: "Reflection", kind: "item" },
];

export const SHUFFLR_PROBLEM_STATEMENT =
  "How might we reduce the activation energy of in-person hangouts so that authentic connection becomes the path of least resistance?";

export const SHUFFLR_CHALLENGE_TITLE =
  "University students want deeper friendships, but coordinating unstructured social time has become high-friction.";

export type ShufflrEditorialBlock = {
  title: string;
  body: string[];
  images?: ReadonlyArray<{ src: string; alt: string }>;
  placeholder?: string;
};

export type ShufflrFeatureBlock = {
  title: string;
  body: string[];
  video?: string;
  images?: ReadonlyArray<{ src: string; alt: string }>;
  placeholder?: string;
};

export const SHUFFLR_EDITORIAL_BLOCKS: ShufflrEditorialBlock[] = [
  {
    title: "Introducing Shufflr",
    body: [
      "Shufflr is a concept for bringing back spontaneous, low-stakes hangout moments. Input a few loose preferences and Shufflr generates a curated shortlist of activities for you.",
      "It surfaces activities where people with overlapping interests are already showing up nearby, and after each activity prompts your group to capture a memory of what you did, who you did it with, and what it felt like.",
    ],
  },
  {
    title: "How Shufflr works",
    body: [],
  },
];

export const SHUFFLR_SYSTEM_PILLARS = [
  {
    id: "desirability",
    title: "Desirability",
    color: "#5CE1F0",
    body: "Targets the loneliness and social friction most acutely felt by 18-24 year olds, a cohort that over-indexes on mobile usage and under-indexes on self-reported social satisfaction.",
  },
  {
    id: "viability",
    title: "Viability",
    color: "#FF5BA8",
    body: "The digital archive creates a structural retention flywheel: emotional investment in the product increases with usage, improving long-term LTV without requiring continuous feature novelty.",
  },
  {
    id: "feasibility",
    title: "Feasibility",
    color: "#A8E63A",
    body: "Activity generation and location-based discovery build on well-established infrastructure (Google Maps, Eventbrite, Yelp APIs); Shufflr synthesizes existing surfaces rather than rebuilding them.",
  },
] as const;

export const SHUFFLR_FEATURES: ShufflrFeatureBlock[] = [
  {
    title: "The Shuffle",
    body: [
      "Users enter vibe, group size, distance, and available time. Shufflr generates a curated shortlist of activities, reducing time-to-hangout from group negotiation to under 60 seconds.",
      "Preference-aware randomization removes the primary drop-off point in social coordination. The goal is a repeat-open rate driven by how fast groups can go from idea to hangout.",
    ],
    video: SHUFFLR_VIDEOS.shuffle,
  },
  {
    title: "Discover & plan",
    body: [
      "Users can view trending activities, plan low-stakes hangout sessions, find events nearby, and filter based on price.",
    ],
    images: [
      {
        src: SHUFFLR_IMAGES.discover,
        alt: "Shufflr phone mockups showing home discovery, create event, and group chat",
      },
    ],
  },
  {
    title: "Connect",
    body: [
      "Shufflr helps users join nearby communities, meet like-minded friends, join different chats, and send invites without cold outreach.",
      "Users discover new connections through co-presence in physical space, not cold follow requests. Each activity becomes a potential touchpoint with no customer acquisition cost.",
    ],
    video: SHUFFLR_VIDEOS.community,
  },
  {
    title: "Profile & memories",
    body: [
      "After each hangout, Shufflr prompts your group to capture a photo and builds a digital album of what you did, who you did it with, and what it felt like.",
      "Prompting users to take photos during an event builds emotional investment over time. The longer someone stays, the more the archive means to them.",
    ],
    images: [
      {
        src: SHUFFLR_IMAGES.profileMemories,
        alt: "Shufflr phone mockups showing a hangout photo prompt, a shared memory, and the event gallery album",
      },
    ],
  },
];

export const SHUFFLR_USER_INSIGHTS = [
  {
    id: "calendar",
    quote:
      "We used to hang out because someone was bored. Now everyone needs to check their calendar.",
    attribution: "30-year-old",
    color: "#F0ABFC",
  },
  {
    id: "event",
    quote:
      "Everything feels like an event now. Sometimes I just want to go do something stupid with my friends.",
    attribution: "21-year-old",
    color: "#FDA4AF",
  },
  {
    id: "plans",
    quote:
      "Nobody wants to be the one who plans something, so nothing happens.",
    attribution: "Waterloo Student",
    color: "#93C5FD",
  },
  {
    id: "after-work",
    quote:
      "After work, I want to do something, but by the time I figure out what, I just go home.",
    attribution: "Young Professional",
    color: "#FDBA74",
  },
  {
    id: "group-chat",
    quote:
      "We have group chats with 15 people and still can’t get four people to hang out.",
    attribution: "Gen Z Student",
    color: "#FCD34D",
  },
  {
    id: "friends",
    quote:
      "I have friends I’d love to see more often. We just never actually make plans.",
    attribution: "Young Professional",
    color: "#5EEAD4",
  },
] as const;

export const SHUFFLR_RESEARCH_STATS = [
  {
    id: "01",
    display: "200",
    headline: "hours is how long it takes for someone to become a close friend.",
    source: "Jeffrey A. Hall",
    sourceUrl: "https://journals.sagepub.com/doi/10.1177/0265407518761225",
  },
  {
    id: "02",
    display: "56",
    headline: "percent of college students say it’s difficult to make friends.",
    source: "American Friendship Project",
    sourceUrl:
      "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0305834",
  },
  {
    id: "03",
    display: "17",
    headline: "percent of Canadians aged 15–24 often or always feel lonely.",
    source: "Statistics Canada",
    sourceUrl:
      "https://www150.statcan.gc.ca/n1/pub/11-627-m/11-627-m2021052-eng.htm",
  },
] as const;

export const SHUFFLR_NORTH_STAR_ROWS = [
  {
    feature: "The Shuffle",
    featureBullets: ["Vibe input", "Group size & distance", "Available time"],
    kpi: "Shuffle-to-hangout %",
    dimension: "Algorithm quality",
  },
  {
    feature: "Discover & plan",
    featureBullets: ["Trending activities", "Nearby events", "Price filters"],
    kpi: "Weekly active completers",
    dimension: "Activation",
  },
  {
    feature: "Connect",
    featureBullets: ["Nearby communities", "Group chats", "Low-friction invites"],
    kpi: "7-day return rate",
    dimension: "Retention",
  },
  {
    feature: "Profile & memories",
    featureBullets: ["Photo prompts", "Digital album", "Shared history"],
    kpi: "Memory capture rate",
    dimension: "Emotional investment",
  },
] as const;

export const SHUFFLR_LEARNINGS = [
  {
    number: "01",
    title: "Weekly active completers",
    body: "The percentage of weekly active users who complete at least one Shufflr-initiated activity with another person in a given week.",
  },
  {
    number: "02",
    title: "Shuffle-to-hangout conversion",
    body: "Percent of generated shuffles that result in a confirmed activity. Primary measure of algorithm quality.",
  },
  {
    number: "03",
    title: "Memory capture rate",
    body: "Percent of completed activities that result in a saved memory. Measures emotional investment in the archive.",
  },
  {
    number: "04",
    title: "7-day return shuffle rate",
    body: "Percent of users who re-shuffle within 7 days of completing their first activity.",
  },
] as const;

export const SHUFFLR_REFLECTION = [
  "Talk to people before you talk to Figma. We learned that planning, not desire, was the friction, which only came out because we ran interviews early and kept going back to them instead of assuming we already knew the problem.",
  "Prototype the parts that don't demo well in static mockups. The shuffle-to-result flow was impossible to feel out as flat Figma screens, so I vibe coded it with Claude to test actual timing and randomization logic. Seeing it move changed decisions that static frames never would have surfaced.",
] as const;

export function isShufflrProject(projectId: string, company?: string): boolean {
  return (
    projectId === "shufflr" ||
    projectId === "nasa" ||
    company === "nasa"
  );
}
