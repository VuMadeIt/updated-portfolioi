/** Public work-grid slugs → Sanity company ids (only where CMS still uses old keys). */
export const PUBLIC_TO_INTERNAL: Record<string, string> = {
  // Maple Leaf unlock/password docs may still live under the legacy company key.
  "maple-leaf-foods": "roblox",
  mapleleaf: "roblox",
};

/** Legacy Michelle company ids → Lucas public URL slugs (old links / cookies). */
export const INTERNAL_TO_PUBLIC: Record<string, string> = {
  apple: "warframe",
  roblox: "maple-leaf-foods",
  adobe: "ripple",
  nasa: "shufflr",
};

export function toInternalProjectId(slug: string): string {
  return PUBLIC_TO_INTERNAL[slug] ?? slug;
}

export function toPublicProjectSlug(id: string): string {
  return INTERNAL_TO_PUBLIC[id] ?? id;
}

/** Case studies that render entirely from local code (no Sanity project row required). */
export function isLocalOnlyCaseStudy(projectId: string): boolean {
  const id = toPublicProjectSlug(projectId);
  return id === "shufflr" || id === "ripple" || id === "warframe";
}
