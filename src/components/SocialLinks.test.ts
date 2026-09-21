import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const socialLinks = readFileSync(
  new URL("./SocialLinks.tsx", import.meta.url),
  "utf8",
);

test("footer social icons include GitHub and Devpost in LinkedIn → Instagram → GitHub → Devpost order", () => {
  assert.match(
    socialLinks,
    /href: "https:\/\/github\.com\/VuMadeIt"/,
  );
  assert.match(
    socialLinks,
    /href: "https:\/\/devpost\.com\/LucasMadeIt"/,
  );
  assert.match(
    socialLinks,
    /label: "LinkedIn"[\s\S]*?label: "Instagram"[\s\S]*?label: "GitHub"[\s\S]*?label: "Devpost"/,
  );
});