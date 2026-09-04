export const SITE_OWNER = "Lucas Vu";
export const SITE_OWNER_FIRST = "Lucas";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://michelle-liu-nu.vercel.app");

export const LETTERBOXD_USERNAME =
  process.env.NEXT_PUBLIC_LETTERBOXD_USERNAME ?? "lucasvu";

export const GOODREADS_PROFILE_URL =
  process.env.NEXT_PUBLIC_GOODREADS_URL ?? "https://www.goodreads.com/user/show/lucasvu";

export const LETTERBOXD_PROFILE_URL =
  process.env.NEXT_PUBLIC_LETTERBOXD_URL ??
  `https://letterboxd.com/${LETTERBOXD_USERNAME}/`;

export const X_PROFILE_URL =
  process.env.NEXT_PUBLIC_X_URL ?? "https://x.com/bigmanvu";

export function letterboxdFilmUrl(slug: string): string {
  return `https://letterboxd.com/${LETTERBOXD_USERNAME}/film/${slug}/`;
}

export function siteUrl(path = ""): string {
  const base = SITE_URL.replace(/\/$/, "");
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
