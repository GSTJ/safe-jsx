// Rebuilds CHANGELOG.md from every tag in the repo.
//
// conventional-changelog can only prepend, which buries the header under each
// new release, and an incremental file drifts from git the moment a commit gets
// amended or a tag moves. Regenerating the whole thing is instant here and the
// output only depends on the history, so it can't drift.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const header = `# Changelog

Generated from conventional commit messages. Breaking changes are collected
under their own heading, from either a \`!\` after the type or a
\`BREAKING CHANGE:\` footer.

`;

const body = execFileSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  [
    "conventional-changelog",
    "--preset",
    "conventionalcommits",
    "--release-count",
    "0",
  ],
  { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
);

if (!body.trim()) {
  console.error(
    "conventional-changelog produced nothing, refusing to write an empty changelog",
  );
  process.exit(1);
}

writeFileSync("CHANGELOG.md", header + body.trimStart());
console.log("CHANGELOG.md rebuilt");
