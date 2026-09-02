import type { CaseStudyNavItem } from "../caseStudyNavItems";
import { INTRODUCTION_NAV_ID } from "../caseStudyNavItems";

export const MAPLE_LEAF_LOGO_VIDEO = "/videos/maple-leaf.mp4";

export const MAPLE_LEAF_TAGLINE =
  "Digitizing decades old workflows processing millions of dollars, affecting thousands of employees.";

export const MAPLE_LEAF_IMAGES = {
  servicePenaltyApp: "/images/maple-leaf/service-penalty-app.png",
  mapleLeafMarket: "/images/maple-leaf/maple-leaf-market.png",
  projectTrackingApp: "/images/maple-leaf/project-tracking-app.png",
} as const;

export const MAPLE_LEAF_NAV_ITEMS: CaseStudyNavItem[] = [
  { id: INTRODUCTION_NAV_ID, label: "Introduction", kind: "heading" },
  { id: "mission", label: "The Mission", kind: "item" },
  { id: "project-01", label: "Service Penalty App", kind: "item" },
  { id: "project-02", label: "Maple Leaf Market", kind: "item" },
  { id: "project-03", label: "Project Tracking & Reporting App", kind: "item" },
];

export const MAPLE_LEAF_MISSION = {
  title: "Digitizing decades old workflows processing millions of dollars, affecting thousands of employees.",
  body: [
    "Over the course of my internship, I worked on 3 separate, fast-paced design projects. My overarching goal was digitizing workflows for internal staff as either an associate product manager or design engineer.",
  ],
} as const;

export type MapleLeafProjectBlock = {
  eyebrow: string;
  title: string;
  body: string[];
  image: { src: string; alt: string };
};

export const MAPLE_LEAF_PROJECTS: MapleLeafProjectBlock[] = [
  {
    eyebrow: "PROJECT 01",
    title: "Service Penalty App",
    body: [
      "Customer penalties were being handled with email chains, which were too time-consuming to process. Our app simplifies and speeds up this workflow so teams can process more penalties efficiently and save time.",
      "As a product manager, I led requirements gathering, user story creation, and user testing for the Power App, which processes $14M+ in penalties annually, across 4 agile sprints and 10+ product demos to 70+ users, including managers and directors.",
    ],
    image: {
      src: MAPLE_LEAF_IMAGES.servicePenaltyApp,
      alt: "Service Penalty App Power Apps dashboard on a desktop monitor",
    },
  },
  {
    eyebrow: "PROJECT 02",
    title: "Maple Leaf Market",
    body: [
      "An internal e-commerce platform built for Maple Leaf Foods employees to purchase products at discounted prices. I contributed to the launch and development of the website, working across WordPress and WooCommerce while designing user flows, documenting SOPs and swimlane diagrams, and creating 50+ UAT/SIT test cases to ensure a smooth shopping experience.",
    ],
    image: {
      src: MAPLE_LEAF_IMAGES.mapleLeafMarket,
      alt: "Maple Leaf Market responsive website shown on mobile and desktop",
    },
  },
  {
    eyebrow: "PROJECT 03",
    title: "Project Tracking & Reporting App",
    body: [
      "An internal task-tracking platform created to improve management visibility into the team’s projects and workload. I identified the gap in project visibility, developed the concept, and pitched the solution to Craig before owning its end-to-end development.",
      "I designed the experience in Figma and built the application in Power Apps, including automated weekly summaries for managers. The platform centralized projects that were previously initiated and tracked informally through team DMs, giving leadership a clearer view of ongoing work.",
    ],
    image: {
      src: MAPLE_LEAF_IMAGES.projectTrackingApp,
      alt: "Project Tracking and Reporting App interface on a desktop monitor",
    },
  },
];

export function isMapleLeafProject(projectId: string, company?: string): boolean {
  return (
    projectId === "roblox" ||
    projectId === "maple-leaf-foods" ||
    projectId === "mapleleaf" ||
    company === "roblox"
  );
}
