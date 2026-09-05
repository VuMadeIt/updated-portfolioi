import assert from "node:assert/strict";
import {
  aabbsOverlap,
  assertZeroOverlap,
  buildZeroOverlapLayouts,
  rotatedSquareAabb,
} from "./stickyLayout.ts";

const NOTES = [
  { id: "calendar" },
  { id: "event" },
  { id: "plans" },
  { id: "after-work" },
  { id: "group-chat" },
  { id: "friends" },
] as const;

{
  const flat = rotatedSquareAabb(50, 50, 20, 0);
  const tilted = rotatedSquareAabb(50, 50, 20, 45);
  assert.ok(tilted.w > flat.w + 0.01, "45° AABB should be wider than 0°");
  assert.ok(tilted.h > flat.h + 0.01, "45° AABB should be taller than 0°");
}

{
  const a = rotatedSquareAabb(40, 50, 20, 8);
  const b = rotatedSquareAabb(60, 50, 20, -8);
  assert.ok(
    aabbsOverlap(a, b, 0),
    "rotated neighbors at edge distance must collide",
  );
}

const layouts = buildZeroOverlapLayouts(NOTES);
assert.equal(layouts.size, NOTES.length);

const check = assertZeroOverlap(layouts, 1.25);
assert.ok(check.ok, `overlap conflicts: ${check.conflicts.join(", ")}`);

const sizes = new Set([...layouts.values()].map((l) => l.sizePct));
assert.equal(sizes.size, 1, "all notes should share one size");

for (const layout of layouts.values()) {
  assert.ok(layout.rotate >= -8 && layout.rotate <= 8);
  const box = rotatedSquareAabb(
    layout.cxPct,
    layout.cyPct,
    layout.sizePct,
    layout.rotate,
  );
  assert.ok(box.x >= -0.01);
  assert.ok(box.y >= -0.01);
  assert.ok(box.x + box.w <= 100.01);
  assert.ok(box.y + box.h <= 100.01);
}

console.log(
  JSON.stringify(
    {
      noteCount: layouts.size,
      sizePct: [...layouts.values()][0].sizePct,
      rotations: [...layouts.values()].map((l) => l.rotate),
      overlapOk: true,
    },
    null,
    2,
  ),
);
console.log("stickyLayout.test.ts: PASS");
