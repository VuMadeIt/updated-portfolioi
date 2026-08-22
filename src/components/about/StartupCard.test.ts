import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const startupCardSource = readFileSync(
  new URL("./StartupCard.tsx", import.meta.url),
  "utf8",
);

test("matches the experience logo size at each breakpoint", () => {
  assert.match(
    startupCardSource,
    /className="relative size-14 md:size-20 shrink-0 overflow-hidden rounded-full/,
  );
});
