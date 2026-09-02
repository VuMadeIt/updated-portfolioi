import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const homeSource = readFileSync(new URL("./HomePageClient.tsx", import.meta.url), "utf8");
const workHeroSource = readFileSync(new URL("./WorkHero.tsx", import.meta.url), "utf8");
const brandTypographySource = readFileSync(
  new URL("../../styles/brandTypography.ts", import.meta.url),
  "utf8",
);
const badgeSource = readFileSync(
  new URL("../shared/ContactBadge.tsx", import.meta.url),
  "utf8",
);
const cssSource = readFileSync(
  new URL("../../styles/globals.css", import.meta.url),
  "utf8",
);
const specimenSource = readFileSync(
  new URL(
    "../system/sections/component-section/NavigationSpecimens.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("renders the nav header above the Work hero", () => {
  assert.match(homeSource, /<NavigationTabs activeTab="work"/);
  assert.match(homeSource, /<WorkHero \/>/);
  const navIndex = homeSource.indexOf("<NavigationTabs activeTab=\"work\"");
  const heroIndex = homeSource.indexOf("<WorkHero />");
  assert.ok(navIndex < heroIndex, "NavigationTabs should render before WorkHero");
  assert.doesNotMatch(homeSource, /A 6x hackathon winner at/);
  assert.doesNotMatch(homeSource, /<ContactBadge/);
});

test("WorkHero uses GSAP letter-shatter animation for lucas vu", () => {
  assert.match(workHeroSource, /lucas vu/);
  assert.match(workHeroSource, /seeking summer 2027 internships/);
  assert.match(workHeroSource, /grid-rows-\[1fr_auto\]/);
  assert.match(workHeroSource, /row-span-2/);
  assert.match(workHeroSource, /bg-emerald-400/);
  assert.match(workHeroSource, /data-hero-letter/);
  assert.match(workHeroSource, /from "gsap"/);
  assert.match(workHeroSource, /six time hackathon winner/);
  assert.match(workHeroSource, /text-center/);
  assert.match(workHeroSource, /brandSubtextClass/);
  assert.match(brandTypographySource, /font-medium/);
  assert.match(brandTypographySource, /text-3xl/);
  assert.match(brandTypographySource, /text-zinc-400/);
  assert.match(workHeroSource, /LOAD_ANIMATION_DURATION = 3/);
  assert.match(workHeroSource, /HOVER_REVERT_DELAY_MS = 1000/);
  assert.match(workHeroSource, /pointerenter/);
  assert.doesNotMatch(workHeroSource, /tracking-\[0\.32em\]/);
});

test("fades the pulse ring out instead of snapping it off", () => {
  assert.match(badgeSource, /contact-badge-pulse/);
  assert.match(badgeSource, /isExpanded \? "off" : "on"/);
  assert.match(cssSource, /\.contact-badge-pulse\s*\{[^}]*transition:\s*opacity 300ms/s);
  assert.doesNotMatch(badgeSource, /green-pulse-ring-off/);
  assert.doesNotMatch(cssSource, /green-pulse-ring-off/);
});

test("keeps the hover badge open within an 8px cursor buffer", () => {
  assert.match(badgeSource, /hover-mode/);
  assert.match(
    cssSource,
    /\.contact-badge\.hover-mode::before\s*\{[^}]*pointer-events:\s*auto[^}]*inset:\s*-0\.5rem/s,
  );
  assert.doesNotMatch(
    cssSource,
    /\.contact-badge\.hover-mode::before\s*\{[^}]*pointer-events:\s*none/s,
  );
});

test("keeps the contact link clickable above the hover buffer", () => {
  assert.match(badgeSource, /contact-badge-text/);
  assert.match(badgeSource, /contact-badge-link/);
  assert.match(cssSource, /\.contact-badge-text\s*\{[^}]*z-index:\s*10/s);
});

test("shows the header badge at its large size in the design system", () => {
  assert.match(specimenSource, /<ContactBadge size="lg" \/>/);
  assert.match(specimenSource, /lg · Header/);
  assert.doesNotMatch(specimenSource, /sm · Header/);
});
