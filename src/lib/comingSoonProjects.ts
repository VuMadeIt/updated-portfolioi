export const COMING_SOON_PROJECT_IDS = ["warframe"] as const;

export const COMING_SOON_LABEL = "Coming Soon";

export function isComingSoonProject(projectId: string): boolean {
  return COMING_SOON_PROJECT_IDS.includes(
    projectId as (typeof COMING_SOON_PROJECT_IDS)[number],
  );
}
