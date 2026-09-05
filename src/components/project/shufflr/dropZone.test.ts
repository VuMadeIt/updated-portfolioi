import assert from "node:assert/strict";
import {
  isOverDropZone,
  pointInExpanded,
  rectsOverlap,
} from "./dropZone";

const folder = { left: 0, top: 400, right: 200, bottom: 600 };

// Pointer dead-center of folder
assert.equal(
  pointInExpanded({ x: 100, y: 500 }, folder, 0),
  true,
  "center of folder",
);

// Pointer just outside folder but within small pad
assert.equal(
  pointInExpanded({ x: 208, y: 500 }, folder, 12),
  true,
  "near folder with tight pad",
);

// Pointer outside tight pad
assert.equal(
  pointInExpanded({ x: 220, y: 500 }, folder, 12),
  false,
  "outside tight pad",
);

// Pointer far away
assert.equal(
  pointInExpanded({ x: 500, y: 100 }, folder, 12),
  false,
  "far from folder",
);

// Word overlaps folder
const overlappingWord = { left: 150, top: 450, right: 280, bottom: 520 };
assert.equal(rectsOverlap(overlappingWord, folder, 0), true, "word overlaps");

// Word near but not overlapping with tight pad
const nearWord = { left: 250, top: 450, right: 360, bottom: 520 };
assert.equal(rectsOverlap(nearWord, folder, 12), false, "word not near enough");

// Combined: pointer miss but word overlaps → still drop
assert.equal(
  isOverDropZone(folder, overlappingWord, { x: 500, y: 100 }),
  true,
  "word overlap saves a bad pointer",
);

// Combined: word miss but pointer over → drop
assert.equal(
  isOverDropZone(
    folder,
    { left: 400, top: 50, right: 500, bottom: 100 },
    { x: 100, y: 500 },
  ),
  true,
  "pointer over folder",
);

// Neither → no drop
assert.equal(
  isOverDropZone(
    folder,
    { left: 400, top: 50, right: 500, bottom: 100 },
    { x: 500, y: 50 },
  ),
  false,
  "neither pointer nor word near",
);

// Far word should not count as over even with isOverDropZone
assert.equal(
  isOverDropZone(folder, nearWord, { x: 300, y: 480 }),
  false,
  "near-but-not-over word does not drop",
);

console.log("dropZone.test.ts: all assertions passed");
