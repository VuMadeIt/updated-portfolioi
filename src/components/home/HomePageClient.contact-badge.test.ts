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
  assert.match(workHeroSource, /data-hero-letter/);
  assert.match(workHeroSource, /from "gsap"/);
  assert.match(workHeroSource, /six time hackathon winner/);
  assert.match(workHeroSource, /self-end/);
  assert.match(workHeroSource, /brandSubtextClass/);
  assert.match(workHeroSource, /HeroCapabilitySentence/);
  assert.match(brandTypographySource, /font-medium/);
  assert.match(brandTypographySource, /text-3xl/);
  assert.match(brandTypographySource, /text-zinc-400/);
  assert.match(workHeroSource, /LOAD_ANIMATION_DURATION = 3/);
  assert.match(workHeroSource, /HOVER_REVERT_DELAY_MS = 1000/);
  assert.match(workHeroSource, /pointerenter/);
  assert.doesNotMatch(workHeroSource, /tracking-\[0\.32em\]/);
  assert.doesNotMatch(workHeroSource, /seeking summer 2027 internships/);
});

test("WorkHero interactive sentence covers Design, Code, and AI Workflows", () => {
  const sentenceSource = readFileSync(
    new URL("./hero/HeroCapabilitySentence.tsx", import.meta.url),
    "utf8",
  );
  assert.match(sentenceSource, /DesignWord/);
  assert.match(sentenceSource, /CodeWord/);
  assert.match(sentenceSource, /AIWorkflowsWord/);
  assert.match(sentenceSource, /\byou\b/);
  assert.match(sentenceSource, /cursor-none/);
  assert.doesNotMatch(sentenceSource, /\bVik\b/);
  assert.doesNotMatch(sentenceSource, />\s*Lucas\s*</);
  assert.match(sentenceSource, /useReducedMotion/);
  assert.match(sentenceSource, /hover: none/);
  assert.match(sentenceSource, /h-\[100px\]/);
  assert.match(sentenceSource, /layout="position"/);
  assert.match(sentenceSource, /float d = dist\(uv, p\);/);
  assert.match(sentenceSource, /PLAN/);
  assert.match(sentenceSource, /BUILD/);
  assert.match(sentenceSource, /TEST/);
  assert.match(sentenceSource, /ITERATE/);
  assert.match(sentenceSource, /border-zinc-200/);
  assert.match(sentenceSource, /bg-white/);
  assert.match(sentenceSource, /text-blue-500|bg-blue-500/);
  assert.match(sentenceSource, /#70D1FF/);
  assert.doesNotMatch(sentenceSource, /#FF7722/);
  assert.doesNotMatch(sentenceSource, /bg-\[#121212\]/);
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
