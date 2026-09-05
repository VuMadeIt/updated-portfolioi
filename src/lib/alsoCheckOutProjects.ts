import { toInternalProjectId, toPublicProjectSlug } from "./projectSlugs";
import { isComingSoonProject } from "./comingSoonProjects";

export type PortfolioProjectCard = {
  id: string;
  title: string;
  year: string;
  description: string;
  imageSrc: string;
  videoSrc?: string;
};

export type AlsoCheckOutProject = PortfolioProjectCard & {
  modalId: string;
};

/** Home-grid order — keep in sync with `staticProjects` in HomePageClient. */
export const PORTFOLIO_ORDER = [
  "warframe",
  "maple-leaf-foods",
  "ripple",
  "shufflr",
  "parrot",
  "creators-collective",
] as const;

const MAIN_PORTFOLIO_IDS = new Set<string>([
  "warframe",
  "maple-leaf-foods",
  "ripple",
  "shufflr",
]);

const PORTFOLIO_ID_ALIASES: Record<string, (typeof PORTFOLIO_ORDER)[number]> = {
  warframe: "warframe",
  apple: "warframe",
  "maple-leaf-foods": "maple-leaf-foods",
  mapleleaf: "maple-leaf-foods",
  roblox: "maple-leaf-foods",
  ripple: "ripple",
  adobe: "ripple",
  shufflr: "shufflr",
  nasa: "shufflr",
  parrot: "parrot",
  "creators-collective": "creators-collective",
};

export function normalizePortfolioProjectId(
  projectId: string,
): (typeof PORTFOLIO_ORDER)[number] | null {
  const publicSlug = toPublicProjectSlug(projectId);
  const candidates = [projectId, publicSlug, toInternalProjectId(publicSlug)];

  for (const candidate of candidates) {
    const match = PORTFOLIO_ID_ALIASES[candidate];
    if (match) return match;
  }

  return null;
}

function toModalProjectId(publicId: string): string {
  // Modals use Lucas public slugs (Shufflr/Ripple/Warframe are local-only).
  return publicId;
}

export function getAlsoCheckOutFromPortfolio(
  portfolioProjects: PortfolioProjectCard[],
  currentProjectId: string,
  count = 2,
): AlsoCheckOutProject[] {
  const current = normalizePortfolioProjectId(currentProjectId);
  if (!current) return [];

  const byId = new Map(portfolioProjects.map((project) => [project.id, project]));
  const currentIndex = PORTFOLIO_ORDER.indexOf(current);
  const picks: AlsoCheckOutProject[] = [];

  for (
    let offset = 1;
    picks.length < count && offset < PORTFOLIO_ORDER.length;
    offset += 1
  ) {
    const id = PORTFOLIO_ORDER[(currentIndex + offset) % PORTFOLIO_ORDER.length];
    if (id === current || isComingSoonProject(id)) continue;

    const project = byId.get(id);
    if (!project) continue;

    picks.push({
      ...project,
      modalId: toModalProjectId(id),
    });
  }

  return picks;
}
