import type { CaseStudyNavItem } from "../caseStudyNavItems";
import { INTRODUCTION_NAV_ID } from "../caseStudyNavItems";

export const SHUFFLR_FIGMA_EMBED_URL = "";

export const SHUFFLR_TAGLINE =
  "A fun way for university students to create spontaneous, low-stakes hangout moments, like the good ol' days.";

export const SHUFFLR_NAV_ITEMS: CaseStudyNavItem[] = [
  { id: INTRODUCTION_NAV_ID, label: "Introduction", kind: "heading" },
  { id: "challenge", label: "Challenge", kind: "item" },
  { id: "approach", label: "Approach", kind: "item" },
  { id: "problem", label: "Problem", kind: "item" },
  { id: "solution", label: "Solution", kind: "item" },
  { id: "ambition", label: "Ambition", kind: "item" },
  { id: "system", label: "System", kind: "item" },
  { id: "features", label: "Core features", kind: "item" },
  { id: "decisions", label: "Decisions", kind: "item" },
  { id: "prototype", label: "Prototype", kind: "item" },
  { id: "learnings", label: "Key learnings", kind: "item" },
  { id: "reflection", label: "Reflection", kind: "item" },
];

export const SHUFFLR_PROBLEM_STATEMENT =
  "How might we reduce the activation energy of in-person hangouts so that authentic connection becomes the path of least resistance?";

export type ShufflrEditorialBlock = {
  title: string;
  body: string[];
  placeholder?: string;
};

export type ShufflrFeatureBlock = {
  title: string;
  body: string[];
  placeholder?: string;
};

export const SHUFFLR_EDITORIAL_BLOCKS: ShufflrEditorialBlock[] = [
  {
    title: "Our inspirations",
    body: [
      "It's a Friday night and 18-year-old you met amazing people that you'll never see again.",
      "200 hours is how long it takes for someone to become a close friend. 49% of Americans lost a friend simply because they drifted apart.",
      "We started by asking what made social life feel lighter before planning became the default, and what it would take to bring that energy back for university students today.",
    ],
    placeholder: "Inspiration collage",
  },
  {
    title: "Investigating 2016",
    body: [
      "What made 2016 iconic? Sharing online was low-stakes and genuine. Posts were for friends, not for performance.",
      "Creators were driven by craft, not conversion rates. The internet was a place to discover what you liked, not to be told what to like.",
      "Tumblr, Vine, and early Twitter made community an automatic consequence of interest. Finding what you loved meant finding the people who loved it too.",
      "Since then, coordinating unstructured social time became high-friction. Without a structured starting point, group plans collapse under deferred decisions. For Gen Z, digital media is the primary record of lived experience, creating pressure to engineer experiences worth posting.",
      "University represents the highest-density environment for identity formation most people will ever experience. Students have unparalleled access to people and new experiences, but don't always capitalize on this.",
    ],
    placeholder: "2016 research collage",
  },
  {
    title: "Introducing Shufflr",
    body: [
      "Shufflr is a concept for bringing back spontaneous, low-stakes hangout moments. Input a few loose preferences and Shufflr generates a curated shortlist of activities for you.",
      "It surfaces activities where people with overlapping interests are already showing up nearby, and after each activity prompts your group to capture a memory of what you did, who you did it with, and what it felt like.",
    ],
    placeholder: "Shufflr product overview",
  },
  {
    title: "Make connection the path of least resistance",
    body: [
      "Telling people to socialize more is unrealistic. Instead of forcing people to plan more, we asked: why not reduce the activation energy required to hang out in the first place?",
      "In a world where social life is increasingly mediated through screens, the right response is not to avoid technology, but to design products that make real-world connection easier than staying in.",
    ],
  },
  {
    title: "How Shufflr works",
    body: [
      "Shufflr targets the loneliness and social friction most acutely felt by 18-24 year olds. The shuffle mechanic addresses the nostalgia brief through behavior design, not aesthetics alone.",
      "The digital archive creates a retention flywheel: emotional investment increases with usage. Activity generation and location-based discovery build on established infrastructure like Google Maps, Eventbrite, and Yelp APIs.",
    ],
    placeholder: "System diagram",
  },
];

export const SHUFFLR_FEATURES: ShufflrFeatureBlock[] = [
  {
    title: "The Shuffle",
    body: [
      "Users enter vibe, group size, distance, and available time. Shufflr generates a curated shortlist of activities, reducing time-to-hangout from group negotiation to under 60 seconds.",
    ],
    placeholder: "Shuffle flow",
  },
  {
    title: "Discover & plan",
    body: [
      "Users can view trending activities, plan low-stakes hangout sessions, find events nearby, and filter based on price.",
    ],
    placeholder: "Discover screens",
  },
  {
    title: "Connect",
    body: [
      "Shufflr helps users join nearby communities, meet like-minded friends, join different chats, and send invites without cold outreach.",
    ],
    placeholder: "Connect screens",
  },
  {
    title: "Profile & memories",
    body: [
      "After each hangout, Shufflr prompts your group to capture a photo and builds a digital album of what you did, who you did it with, and what it felt like.",
    ],
    placeholder: "Profile and history screens",
  },
];

export const SHUFFLR_DECISIONS = [
  {
    title: "Frictionless activity generation",
    body: [
      "Preference-aware randomization removes the primary drop-off point in social coordination. The goal is a repeat-open rate driven by how fast groups can go from idea to hangout.",
    ],
  },
  {
    title: "Interest-based proximity matching",
    body: [
      "Users discover new connections through co-presence in physical space, not cold follow requests. Each activity becomes a potential touchpoint with no customer acquisition cost.",
    ],
  },
  {
    title: "Memory capture",
    body: [
      "Prompting users to take photos during an event builds emotional investment over time. The longer someone stays, the more the archive means to them.",
    ],
  },
] as const;

export const SHUFFLR_PERSONAS = [
  {
    name: "Micheal Spataro",
    quote:
      "2016 felt like the last year the internet was actually social. Now it's a highlight reel optimized for strangers.",
  },
  {
    name: "Jenny Contento",
    quote:
      "Pre-COVID things were lighter. Memes were weird and abstract and nobody took themselves too seriously.",
  },
  {
    name: "Lucas Vu",
    quote:
      "Nobody wants to be the one who plans something, so nothing happens. We're all waiting for someone else to shuffle the deck.",
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

export function isShufflrProject(projectId: string, company?: string): boolean {
  return (
    projectId === "shufflr" ||
    projectId === "nasa" ||
    company === "nasa"
  );
}
