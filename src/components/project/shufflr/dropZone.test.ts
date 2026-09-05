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

// Pointer just outside folder but within pad
assert.equal(
  pointInExpanded({ x: 220, y: 500 }, folder, 100),
  true,
  "near folder with pad",
);

// Pointer far away
assert.equal(
  pointInExpanded({ x: 500, y: 100 }, folder, 100),
  false,
  "far from folder",
);

// Word overlaps folder
const overlappingWord = { left: 150, top: 450, right: 280, bottom: 520 };
assert.equal(rectsOverlap(overlappingWord, folder, 0), true, "word overlaps");

// Word near folder with pad
const nearWord = { left: 250, top: 450, right: 360, bottom: 520 };
assert.equal(rectsOverlap(nearWord, folder, 80), true, "word near with pad");

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

// Latch simulation: was over earlier in drag
let latched = false;
latched = isOverDropZone(folder, null, { x: 100, y: 500 }) || latched;
assert.equal(latched, true, "latch while over");
const releaseFar = isOverDropZone(
  folder,
  { left: 400, top: 50, right: 500, bottom: 100 },
  { x: 500, y: 50 },
);
assert.equal(latched || releaseFar, true, "release after latch still drops");

console.log("dropZone.test.ts: all assertions passed");
