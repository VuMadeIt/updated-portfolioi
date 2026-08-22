import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./AboutPage.tsx", import.meta.url), "utf8");

test("hardcodes Lucas experience without freelance startup logos", () => {
  assert.match(source, /company: "Parrot YC"/);
  assert.match(source, /role: "Design Engineer \(Contract\)"/);
  assert.match(source, /company: "Hack Canada"/);
  assert.match(source, /role: "Product Design Lead"/);
  assert.match(source, /company: "Waterloo Engineering Society"/);
  assert.match(source, /role: "Figma Design Director"/);
  assert.match(source, /company: "Maple Leaf Foods"/);
  assert.match(source, /role: "Digital Product Manager"/);
  assert.match(source, /company: "The Local Charity"/);
  assert.match(source, /role: "Systems Design and Ops Coordinator"/);
  assert.match(source, /period: "2025"/);
  assert.doesNotMatch(source, /Freelance Designer/);
  assert.doesNotMatch(source, /StartupLogosRow/);
});

test("lists Waterloo Systems Design as education", () => {
  assert.match(source, /Systems Design Engineer, University of Waterloo/);
  assert.doesNotMatch(source, /Cognitive Science, UCLA/);
  assert.match(source, /A Solo Backpacking Trip in Anime Land!/);
  assert.doesNotMatch(source, /Hung Liu/);
});

test("replaces Sundays in LA community with the designers section", () => {
  assert.match(source, /title: "the designers!"/);
  assert.match(source, /sidebarName: "the designers!"/);
  assert.match(source, /Winning \$1400 USD at Hack the 6ix 2026!/);
  assert.match(source, /Socratica Sunday Sessions >>/);
  assert.match(
    source,
    /Getting FREE Claude Opus at Socratica's Create-a-thon \(hehe\)/,
  );
  assert.match(source, /Switching up artistic mediums!/);
  assert.match(source, /imageSrc: designersCreateathonPhoto/);
  assert.match(source, /caption: "Socratica Sunday Sessions >>"/);
  assert.match(source, /applyLucasCommunityOverrides/);
  assert.match(source, /isSundaysCommunityEntry/);
});

test("replaces UCLA Product Space with The Cadet Community section", () => {
  assert.match(source, /title: "the cadet community!"/);
  assert.match(source, /sidebarName: "the cadet community!"/);
  assert.match(source, /most defining part of my childhood/);
  assert.match(source, /Remembrance Day Parade in the Snow/);
  assert.match(source, /Riding in the back of an Army Truck!!/);
  assert.match(source, /The GGHG Face Paint Tattoo/);
  assert.match(source, /PEAK aura farming/);
  assert.match(source, /rotation: 3/);
  assert.match(source, /buildCadetCommunity/);
  assert.match(source, /isLegacySanityCommunityEntry/);
  assert.match(source, /executive board/);
  assert.doesNotMatch(source, /I help lead UCLA's product club/);
});

test("keeps The Chess Players as a separate community", () => {
  assert.match(source, /title: "the chess players!"/);
  assert.match(source, /sidebarName: "the chess players!"/);
  assert.match(source, /Chess Jesus/);
  assert.match(source, /I gave a 15-min speech at the Volunteer Appreciation Ceremony!!/);
  assert.doesNotMatch(source, /😎/);
  assert.match(source, /buildChessPlayersCommunity/);
  assert.match(source, /chess-tcdsb-west-end/);
});

test("replaces Nexus with The Sidequesters section", () => {
  assert.match(source, /title: "the sidequesters!"/);
  assert.match(source, /sidebarName: "the sidequesters!"/);
  assert.match(source, /collageLayout: "split-overlap"/);
  assert.match(source, /frameVariant: "wide"/);
  assert.match(source, /outside your comfort zone/);
  assert.match(source, /getting my first EVER blue tape \(V5-7\)/);
  assert.match(source, /this view was AWESOME!/);
  assert.match(source, /Presenting our plan to Bridge the Digital Divide with China's Belt and Road Initiantive/);
  assert.match(source, /successfully wiring a circuit \(after many, many, many attempts\)/);
  assert.match(source, /being a professional MMA fighter/);
  assert.match(source, /representing Waterloo Engineering as a panellist at Hack the Ridge/);
  assert.match(source, /rafting with my dear friends!/);
  assert.match(source, /buildSidequestersCommunity/);
  assert.match(source, /isNexusEntry/);
  assert.match(source, /isLegacySanityCommunityEntry/);
});

test("replaces favorite quotes with a design philosophy preview card", () => {
  assert.match(source, /title="My Design Philosophy"/);
  assert.match(source, /subtitle="why I do what I do\.\.\."/);
  assert.match(source, /DesignPhilosophyPreviewCard/);
  assert.match(source, /DesignPhilosophyModal/);
  assert.match(source, /isDesignPhilosophyOpen/);
  assert.match(source, /setIsDesignPhilosophyOpen\(true\)/);
  assert.doesNotMatch(source, /My Favorite Quotes/);
  assert.doesNotMatch(source, /Love your craft/);
  assert.doesNotMatch(source, /QUOTES_QUERY/);
});
