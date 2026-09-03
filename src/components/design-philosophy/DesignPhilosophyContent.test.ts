import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const content = readFileSync(new URL("./DesignPhilosophyContent.tsx", import.meta.url), "utf8");
const preview = readFileSync(
  new URL("./DesignPhilosophyPreviewCard.tsx", import.meta.url),
  "utf8",
);
const meta = readFileSync(new URL("./content.ts", import.meta.url), "utf8");

test("plays the hummingbird video on click with audio", () => {
  assert.match(content, /video\.muted = false/);
  assert.match(content, /await video\.play\(\)/);
  assert.match(content, /Play hummingbird video/);
  assert.doesNotMatch(content, /controls/);
});

test("places the hummingbird passage beside the video in a full-width column", () => {
  assert.match(content, /md:grid-cols-\[minmax\(0,1fr\)_min\(30%,220px\)\]/);
  assert.match(content, /A hummingbird came by while I sat there/);
  assert.match(content, /px-16 pb-20 pt-32 md:px-36 lg:px-48/);
  assert.doesNotMatch(content, /A hummingbird hovering over the red tip/);
});

test("shows the branch cover on a taller preview card without the arrow", () => {
  assert.match(preview, /md:h-\[210px\]/);
  assert.match(preview, /px-6 py-6 md:px-8/);
  assert.match(preview, /object-cover/);
  assert.match(preview, /object-right-top/);
  assert.match(preview, /DESIGN_PHILOSOPHY_META\.coverAlt/);
  assert.match(preview, /DESIGN_PHILOSOPHY_META\.cardDate/);
  assert.doesNotMatch(preview, /ArrowUpRight/);
});

test("dates the reflection without a weekday", () => {
  assert.match(meta, /date: "August 24, 2026"/);
  assert.match(meta, /cardDate: "Monday, August 24, 2026"/);
});
