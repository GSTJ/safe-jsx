// Run this from main before checking out the release. It inspects the tag as
// data, so a bad tag cannot replace the checks that decide whether it ships.
import { execFileSync, spawnSync } from "node:child_process";
import { env } from "node:process";

/**
 * @param {string} message
 * @returns {never}
 */
const fail = (message) => {
  console.error(message);
  process.exit(1);
};

/** @param {...string} args */
const git = (...args) =>
  execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();

const releaseTag = env.RELEASE_TAG;
if (!releaseTag) fail("RELEASE_TAG is missing, refusing to publish");

const tagRef = `refs/tags/${releaseTag}`;
if (env.RELEASE_REF !== tagRef) {
  fail(`release ref is ${env.RELEASE_REF ?? "missing"} instead of ${tagRef}`);
}

let tagType;
try {
  tagType = git("cat-file", "-t", tagRef);
} catch {
  fail(`${releaseTag} is missing from the checkout`);
}
if (tagType !== "tag") {
  fail(`${releaseTag} is not annotated, refusing to publish`);
}

const tagTarget = git("rev-parse", `${tagRef}^{commit}`);
if (!env.RELEASE_SHA) fail("RELEASE_SHA is missing, refusing to publish");
if (tagTarget !== env.RELEASE_SHA) {
  fail(`${releaseTag} moved after the release event, refusing to publish`);
}

let packageJson;
let changelog;
try {
  packageJson = JSON.parse(git("show", `${tagTarget}:package.json`));
  changelog = git("show", `${tagTarget}:CHANGELOG.md`);
} catch {
  fail(`${releaseTag} has invalid release files`);
}

const { version } = packageJson;
if (typeof version !== "string" || version.length === 0) {
  fail(`${releaseTag} has no package version, refusing to publish`);
}

const expectedTag = `v${version}`;
if (releaseTag !== expectedTag) {
  fail(`release tag is ${releaseTag} instead of ${expectedTag}`);
}

const releaseHeading = `## [${version}]`;
const releaseStart = changelog.search(/^## \[/mu);
const nextRelease = changelog.indexOf("\n## [", releaseStart + 1);
if (
  releaseStart === -1 ||
  !changelog.startsWith(releaseHeading, releaseStart)
) {
  fail(`the newest CHANGELOG.md release is not ${version}`);
}
const releaseNotes = `${changelog
  .slice(releaseStart, nextRelease === -1 ? undefined : nextRelease)
  .trim()}\n`;

const tagObject = git("cat-file", "-p", tagRef);
const annotationStart = tagObject.indexOf("\n\n");
const annotation =
  annotationStart === -1
    ? ""
    : `${tagObject.slice(annotationStart + 2).trim()}\n`;
if (annotation !== releaseNotes) {
  fail(`${releaseTag} annotation does not match CHANGELOG.md`);
}

const releaseBody = env.RELEASE_BODY;
if (releaseBody === undefined) {
  fail("RELEASE_BODY is missing, refusing to publish");
}
if (`${releaseBody.trimEnd()}\n` !== releaseNotes) {
  fail("GitHub release notes do not match CHANGELOG.md");
}

const mainRef = env.RELEASE_MAIN_REF ?? "origin/main";
const ancestry = spawnSync(
  "git",
  ["merge-base", "--is-ancestor", tagTarget, mainRef],
  { encoding: "utf8" },
);
if (ancestry.error) throw ancestry.error;
if (ancestry.status !== 0 && ancestry.status !== 1) {
  process.stderr.write(ancestry.stderr);
  fail(`could not verify ${mainRef}`);
}
if (ancestry.status === 1) {
  fail(`${releaseTag} is not reachable from ${mainRef}`);
}

console.log(
  `${releaseTag} is annotated, documented, and reachable from ${mainRef}`,
);
