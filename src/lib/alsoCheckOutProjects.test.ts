import assert from "node:assert/strict";
import test from "node:test";
import {
  getAlsoCheckOutFromPortfolio,
  normalizePortfolioProjectId,
} from "./alsoCheckOutProjects.ts";

const portfolio = [
  {
    id: "warframe",
    title: "Warframe",
    year: "2026",
    description: "Warframe description",
    imageSrc: "/images/apple-still.jpg",
  },
  {
    id: "maple-leaf-foods",
    title: "Maple Leaf Foods",
    year: "2026",
    description: "Maple Leaf description",
    imageSrc: "/images/maple-leaf/logo.png",
  },
  {
    id: "ripple",
    title: "Ripple",
    year: "2026",
    description: "Ripple description",
    imageSrc: "/videos/ripple.mp4",
  },
  {
    id: "shufflr",
    title: "Shufflr",
    year: "2026",
    description: "Shufflr description",
    imageSrc: "/videos/shufflr.mp4",
  },
  {
    id: "parrot",
    title: "Parrot",
    year: "2026",
    description: "Parrot description",
    imageSrc: "/videos/parrot.mp4",
  },
  {
    id: "creators-collective",
    title: "Creators Collective",
    year: "2026",
    description: "Creators Collective description",
    imageSrc: "/videos/creators-collective.mp4",
  },
];

test("normalizes legacy Sanity ids to portfolio ids", () => {
  assert.equal(normalizePortfolioProjectId("apple"), "warframe");
  assert.equal(normalizePortfolioProjectId("roblox"), "maple-leaf-foods");
  assert.equal(normalizePortfolioProjectId("adobe"), "ripple");
  assert.equal(normalizePortfolioProjectId("nasa"), "shufflr");
});

test("returns the next two portfolio projects for also check out", () => {
  const picks = getAlsoCheckOutFromPortfolio(portfolio, "apple");

  assert.deepEqual(
    picks.map((project) => project.id),
    ["maple-leaf-foods", "ripple"],
  );
  assert.equal(picks[0]?.modalId, "maple-leaf-foods");
  assert.equal(picks[1]?.modalId, "ripple");
});

test("wraps around the portfolio order", () => {
  const picks = getAlsoCheckOutFromPortfolio(portfolio, "creators-collective");

  assert.deepEqual(
    picks.map((project) => project.id),
    ["maple-leaf-foods", "ripple"],
  );
});

test("skips coming soon projects like warframe and parrot", () => {
  const picks = getAlsoCheckOutFromPortfolio(portfolio, "shufflr");

  assert.deepEqual(
    picks.map((project) => project.id),
    ["creators-collective", "maple-leaf-foods"],
  );
  assert.ok(!picks.some((project) => project.id === "parrot"));
  assert.ok(!picks.some((project) => project.id === "warframe"));
});
