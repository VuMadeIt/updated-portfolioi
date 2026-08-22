/** Public work-grid slugs → Sanity company / experiment ids. */
export const PUBLIC_TO_INTERNAL: Record<string, string> = {
  warframe: "apple",
  "maple-leaf-foods": "roblox",
  mapleleaf: "roblox",
  ripple: "adobe",
  shufflr: "nasa",
};

/** Sanity company ids → public URL slugs. */
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
