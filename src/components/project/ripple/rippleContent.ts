import type { CaseStudyNavItem } from "../caseStudyNavItems";
import { INTRODUCTION_NAV_ID } from "../caseStudyNavItems";

export const RIPPLE_FIGMA_EMBED_URL =
  "https://embed.figma.com/proto/01XnqrdkdhHhUCY7Ii3AvT/BLOOM-Designathon-2026?node-id=36-1061&p=f&scaling=scale-down&content-scaling=fixed&starting-point-node-id=36%3A1061&page-id=0%3A1&embed-host=share";

export const RIPPLE_TAGLINE = "Reimagining a cleaner future with LLMs";

export const RIPPLE_VIDEOS = {
  home: "/videos/ripple/home.mp4",
  answer: "/videos/ripple/answer.mp4",
} as const;

export const RIPPLE_IMAGES = {
  ideation: "/images/ripple/ideation.png",
  research: "/images/ripple/research.png",
  comparison: "/images/ripple/comparison.png",
  systemDiagram: "/images/ripple/system-diagram.png",
  discover: "/images/ripple/discover.png",
  profileHistory: "/images/ripple/profile-history.png",
} as const;

export const RIPPLE_NAV_ITEMS: CaseStudyNavItem[] = [
  { id: INTRODUCTION_NAV_ID, label: "Introduction", kind: "heading" },
  { id: "challenge", label: "Challenge", kind: "item" },
  { id: "approach", label: "Approach", kind: "item" },
  { id: "problem", label: "Problem", kind: "item" },
  { id: "solution", label: "Solution", kind: "item" },
  { id: "system", label: "System", kind: "item" },
  { id: "features", label: "Core features", kind: "item" },
  { id: "decisions", label: "Design decisions", kind: "item" },
  { id: "prototype", label: "Prototype", kind: "item" },
  { id: "reflection", label: "Reflection", kind: "item" },
];

export type RippleEditorialBlock = {
  title: string;
  body: string[];
  images: ReadonlyArray<{ src: string; alt: string }>;
};

export type RippleFeatureBlock = {
  title: string;
  body: string[];
  video?: string;
  images?: ReadonlyArray<{ src: string; alt: string }>;
  layout?: "single" | "pair";
};

export const RIPPLE_EDITORIAL_BLOCKS: RippleEditorialBlock[] = [
  {
    title: "Our approach",
    body: [
      "There are hundreds of environmental issues to tackle, from transportation and clothing to food waste. Initially, we brainstormed a wide range of ideas, including a community sharing platform for item borrowing, daily sustainability challenges, and an app around reduce, reuse, and recycle.",
      "We wanted to find an unsustainable action in everyday life so our solution could maximize impact at a behavioral level, rather than requiring large lifestyle changes. However, we decided to dive into something less commonly discussed.",
    ],
    images: [
      {
        src: RIPPLE_IMAGES.ideation,
        alt: "Early ideation mind map exploring everyday actions and climate awareness",
      },
    ],
  },
  {
    title: "The environmental cost of AI",
    body: [
      "LLMs have become increasingly popular since the release of ChatGPT in 2022, embedding themselves into daily life. People use them for everything from simple facts to repeated questions that could have been answered before. Simple Google searches are being replaced by AI ones.",
      "The experience feels so seamless that we often forget about the compute, storage, and energy required to generate each response. It is estimated that for every 10 ChatGPT responses, 500mL of water is used to cool data centers. AI water usage is projected to hit 6.6 billion m³ by 2027. A ChatGPT response can use up to 10 times more energy than a Google search.",
    ],
    images: [
      {
        src: RIPPLE_IMAGES.research,
        alt: "Research collage on AI environmental impact, data centers, and everyday AI usage",
      },
    ],
  },
  {
    title: "Ripple: a more sustainable AI experience",
    body: [
      "Ripple is a concept focused on reuse, not regeneration. When a user enters a prompt, Ripple searches through a database of previously asked prompts and resurfaces the most relevant answers, eliminating unnecessary AI generation and saving energy and water used by data centers.",
      "For example, instead of sending a new prompt to learn about the Eiffel Tower, Ripple searches previously asked prompts relevant to your question and resurfaces existing answers. If no relevant match is found, Ripple can still respond like a typical LLM, but prioritizes efficient, low-cost models.",
    ],
    images: [
      {
        src: RIPPLE_IMAGES.comparison,
        alt: "Side by side comparison of ChatGPT generating a new response versus Ripple resurfacing an existing answer",
      },
    ],
  },
  {
    title: "Redefine what it means to use an LLM",
    body: [
      "Telling people to stop using ChatGPT is unrealistic. Instead of forcing people to stop, we asked: why not redefine what it means to use an LLM?",
      "In a world where AI is becoming increasingly unavoidable, the right response is not to avoid AI, but to adapt and address the environmental issues it causes. Ripple makes it easier to make a more sustainable choice without asking for drastic changes.",
    ],
    images: [],
  },
  {
    title: "How Ripple works",
    body: [
      "With Ripple, a user question flows through a search of past LLM responses before anything new is generated. Only when no suitable match exists does Ripple fall back to generation.",
    ],
    images: [
      {
        src: RIPPLE_IMAGES.systemDiagram,
        alt: "System diagram comparing Ripple's search-and-reuse flow with a standard LLM generation flow",
      },
    ],
  },
];

export const RIPPLE_FEATURES: RippleFeatureBlock[] = [
  {
    title: "Home page",
    body: [
      "Users are greeted by a familiar ChatGPT-like interface. This was done intentionally so users immediately know what to do, as it mimics the flow of an actual LLM.",
      "Once a user types in their prompt, Ripple surfaces existing answers from previously asked prompts, allowing users to select the one that best matches their request.",
    ],
    video: RIPPLE_VIDEOS.home,
  },
  {
    title: "Answer page",
    body: [
      "Once a user selects the answer they want to view, they can open Ripple's resurfaced prompt and answer. There, they can see how much water they saved and ask follow-up questions.",
      "Ripple also has an upvoting and downvoting feature, which serves as its algorithm to learn what answers are most relevant.",
    ],
    video: RIPPLE_VIDEOS.answer,
  },
  {
    title: "Discover page",
    body: [
      "Ripple features a discover page inspired by Ditto Lists, where users can browse previously asked prompts and filter by category.",
      "This encourages people to learn from existing knowledge instead of generating new responses.",
    ],
    images: [
      {
        src: RIPPLE_IMAGES.discover,
        alt: "Ripple discover page with category filters and prompt cards",
      },
    ],
    layout: "single",
  },
  {
    title: "Profile page",
    body: [
      "On the profile page, users can view how many litres of water they have saved in the past month.",
      "Ripple also provides a deeper look into history through a river stream graphic that represents past water usage, along with badges for reaching water saving milestones.",
    ],
    images: [
      {
        src: RIPPLE_IMAGES.profileHistory,
        alt: "Ripple profile and history screens with river timeline and water savings",
      },
    ],
    layout: "single",
  },
];

export const RIPPLE_DECISIONS = [
  {
    title: "ChatGPT-like interface",
    body: [
      "We used a ChatGPT-like interface so users could instantly understand what to do, reducing friction and making a more sustainable platform feel familiar from the first interaction.",
    ],
  },
  {
    title: "Ripple and water effects",
    body: [
      "The theme of water runs throughout the design to reinforce the environmental message. Water-saving animations, stats, and the history river work together to gamify sustainable behavior.",
    ],
  },
] as const;

export const RIPPLE_LEARNINGS = [
  {
    number: "01",
    title: "Think ambitiously",
    body: "Ripple isn't fully feasible at the moment, but it's an inspiring concept for a more sustainable future. The most ambitious projects are often the ones that move thinking forward.",
  },
  {
    number: "02",
    title: "Spend time on the problem",
    body: "Even with only eight hours, it's worth spending time on the problem statement and a unique solution before jumping into screens.",
  },
  {
    number: "03",
    title: "Don't perfect the details",
    body: "Within a designathon, refining small details isn't always worth it. Sometimes you need to step back and focus on the bigger picture and overall system.",
  },
] as const;

export const RIPPLE_REFLECTION = [
  "Don't reinvent the LLM interface. People already know how to use ChatGPT, so Ripple looks and feels like it too. The sustainability part happens quietly underneath, not as some brand new interaction people have to learn.",
  "Meet people where they are, not where you wish they were. Telling people to just use AI less was never going to work. Ripple works with the habit instead of against it, resurfacing old answers instead of asking anyone to change their behavior.",
  "Make the invisible feel real! Water and energy costs are totally hidden in every LLM people already use. That's why the profile page, the savings counter, and the river graphic all exist. If people can't see it, they won't feel it, and if they don't feel it, they won't care.",
] as const;

export function isRippleProject(projectId: string, company?: string): boolean {
  return (
    projectId === "ripple" ||
    projectId === "adobe" ||
    company === "adobe"
  );
}
