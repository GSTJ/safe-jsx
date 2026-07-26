// Prints the newest section of CHANGELOG.md.
//
// Both the annotated git tag and the GitHub release body are built from this, so
// the three places a reader might look at a release all say the same thing,
// breaking changes included.
import { readFileSync } from "node:fs";

const changelog = readFileSync("CHANGELOG.md", "utf8");

// Only `## ` starts a release. `### ` headings are the type groups inside one.
const releases = changelog
  .split(/^(?=## )/m)
  .filter((part) => part.startsWith("## "));

if (releases.length === 0) {
  console.error("no release sections found in CHANGELOG.md");
  process.exit(1);
}

process.stdout.write(`${releases[0].trim()}\n`);
