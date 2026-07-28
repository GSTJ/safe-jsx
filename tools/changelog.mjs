// Rebuilds CHANGELOG.md from the tags in the repo.
//
// conventional-changelog can only prepend, which buries the header under each
// new release, and an incremental file drifts from git the moment a commit gets
// amended or a tag moves. Regenerating is instant here and the output only
// depends on the history, so it can't drift.
//
// Releases up to and including FROZEN_AT are the exception: they come from
// tools/changelog-history.md verbatim. tools/changelog-preset.mjs renders
// build, refactor, chore and docs, which the old config hid, and regenerating
// the old releases under it would rewrite sections that shipped as far back as
// 2023 — it also moves 1.0.1's compare link, since the first commit the range
// starts from changes once chore is visible. Published notes stay as published.
// Everything above the freeze is still generated from git on every run.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FROZEN_AT = "1.3.0";

const here = import.meta.dirname;
const historyPath = join(here, "changelog-history.md");
const presetPath = join(here, "changelog-preset.mjs");

const header = `# Changelog

Generated from conventional commit messages. Breaking changes are collected
under their own heading, from either a \`!\` after the type or a
\`BREAKING CHANGE:\` footer.

Releases up to ${FROZEN_AT} are kept as they were published, in
tools/changelog-history.md.

`;

const body = execFileSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  [
    "conventional-changelog",
    "--config",
    presetPath,
    "--release-count",
    "0",
    // Without this the CLI writes CHANGELOG.md itself and leaves stdout empty,
    // which would skip the header and trip the guard below.
    "--stdout",
  ],
  { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
);

if (!body.trim()) {
  console.error(
    "conventional-changelog produced nothing, refusing to write an empty changelog",
  );
  process.exit(1);
}

// Anchored on `## [` so a version string inside a commit subject can't match.
const freezeMarker = `## [${FROZEN_AT}]`;
const freezeIndex = body.indexOf(freezeMarker);

if (freezeIndex === -1) {
  console.error(
    `no "${freezeMarker}" section in the generated output. Either the ${FROZEN_AT} tag went missing or FROZEN_AT is stale; refusing to write a changelog that would drop the frozen history.`,
  );
  process.exit(1);
}

const generated = body.slice(0, freezeIndex).trim();
const history = readFileSync(historyPath, "utf8").trim();

writeFileSync("CHANGELOG.md", `${header + generated}\n\n${history}\n`);
console.log("CHANGELOG.md rebuilt");
