import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const shellSource = readFileSync(
  new URL("./NavigationLoadingShell.tsx", import.meta.url),
  "utf8",
);
const artSource = readFileSync(
  new URL("../../../app/art/loading.tsx", import.meta.url),
  "utf8",
);
const aboutSource = readFileSync(
  new URL("../../../app/about/loading.tsx", import.meta.url),
  "utf8",
);
const pageHeaderSource = readFileSync(
  new URL("./PageHeader.tsx", import.meta.url),
  "utf8",
);
const navigationTabsSource = readFileSync(
  new URL("./NavigationTabs.tsx", import.meta.url),
  "utf8",
);
const combinedSource = `${shellSource}\n${artSource}\n${aboutSource}`;

function assertSharedGeometry(productionSource: string, snippet: string) {
  assert.ok(
    productionSource.includes(snippet),
    `production geometry is missing: ${snippet}`,
  );
  assert.ok(shellSource.includes(snippet), `loading shell geometry drifted: ${snippet}`);
}

test("route loading shells align to production geometry without spinners", () => {
  assert.doesNotMatch(combinedSource, /LoadingSpinner|animate-spin|Loading\.\.\./);
  assert.match(artSource, /activeTab="art"/);
  assert.match(aboutSource, /activeTab="about"/);

  assertSharedGeometry(
    pageHeaderSource,
    "content-stretch flex flex-col items-start px-16 pt-8 pb-8 max-md:px-6 max-md:pt-8 max-md:pb-4 relative w-full",
  );
  assertSharedGeometry(
    pageHeaderSource,
    "content-stretch flex flex-col gap-4 items-start pt-14 px-16 max-md:px-6 max-md:pt-20 relative w-full max-md:min-h-[210px] md:min-h-[176px]",
  );
  assertSharedGeometry(
    navigationTabsSource,
    "flex w-full items-center justify-end gap-4 px-16 pb-4 max-md:px-6 max-md:pb-3",
  );

  const workHeroSource = readFileSync(
    new URL("../home/WorkHero.tsx", import.meta.url),
    "utf8",
  );
  assert.match(workHeroSource, /seeking summer 2027 internships/);

  assert.match(shellSource, /Rectangle Grain 1\.png/);
  assert.match(shellSource, /backgroundRepeat: "repeat"/);
  assert.match(shellSource, /backgroundSize: "auto"/);
  assert.match(shellSource, /opacity: 0\.8/);

  assert.match(shellSource, /w-\[202px\]/);
  assert.match(
    shellSource,
    /flex flex-col md:flex-row gap-10 md:gap-16 items-center md:items-start w-full max-w-5xl/,
  );
  assert.match(shellSource, /w-72 md:w-76/);
  assert.match(shellSource, /activeTab === "about" \? "gap-20 max-w-\[800px\]" : "gap-12"/);
  assert.match(shellSource, /aria-hidden="true"/);
});
