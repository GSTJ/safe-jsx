// Creates or finalizes the annotated tag for the version in package.json.
//
// npm creates an annotated tag before postversion. A release PR can leave that
// unpublished tag on the PR commit, while the release belongs on the squash
// commit from main. This script can update that local tag only while the remote
// has no tag with the same name. Published tags are immutable.
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const here = import.meta.dirname;
const releaseNotesPath = join(here, "release-notes.mjs");

/** @param {string} message */
const fail = (message) => {
  console.error(message);
  process.exit(1);
};

/**
 * @param {string[]} args
 * @param {Omit<import("node:child_process").ExecFileSyncOptionsWithStringEncoding, "encoding" | "stdio">} [options]
 * @returns {string}
 */
const git = (args, options = {}) =>
  execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    ...options,
  });

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const { version } = packageJson;
if (typeof version !== "string" || version.length === 0) {
  fail("package.json has no version, refusing to create a release tag");
}

const tagName = `v${version}`;
const tagRef = `refs/tags/${tagName}`;
const releaseNotes = execFileSync(process.execPath, [releaseNotesPath], {
  encoding: "utf8",
});

if (!releaseNotes.startsWith(`## [${version}]`)) {
  fail(
    `the newest changelog section is not ${version}, refusing to create ${tagName}`,
  );
}

const status = git(["status", "--porcelain"]);
if (status.trim()) {
  fail("the worktree is dirty, refusing to create a release tag");
}

const head = git(["rev-parse", "HEAD"]).trim();
const subject = git(["show", "-s", "--format=%s", "HEAD"]).trim();
const escapedVersion = version.replaceAll(
  /[.*+?^${}()|[\]\\]/g,
  String.raw`\$&`,
);
if (!new RegExp(`^v${escapedVersion}(?: \\(#\\d+\\))?$`).test(subject)) {
  fail(
    `HEAD is "${subject}" instead of the ${tagName} release commit, refusing to tag it`,
  );
}

const localResult = spawnSync(
  "git",
  ["rev-parse", "--verify", "--quiet", tagRef],
  { encoding: "utf8" },
);
if (localResult.error) throw localResult.error;
if (localResult.status !== 0 && localResult.status !== 1) {
  process.stderr.write(localResult.stderr);
  process.exit(localResult.status ?? 1);
}
const localObject =
  localResult.status === 0 ? localResult.stdout.trim() : undefined;

const remoteResult = spawnSync(
  "git",
  ["ls-remote", "--exit-code", "--tags", "--refs", "origin", tagRef],
  { encoding: "utf8", timeout: 30_000 },
);
if (remoteResult.error) throw remoteResult.error;
if (remoteResult.status !== 0 && remoteResult.status !== 2) {
  process.stderr.write(remoteResult.stderr);
  fail(`could not check whether ${tagName} is published`);
}
const remoteObject =
  remoteResult.status === 0
    ? remoteResult.stdout.trim().split(/\s+/u)[0]
    : undefined;

let localTarget;
let localMessage;
if (localObject) {
  const objectType = git(["cat-file", "-t", localObject]).trim();
  if (objectType !== "tag") {
    fail(`${tagName} is not annotated, refusing to replace it`);
  }

  localTarget = git(["rev-parse", `${tagRef}^{commit}`]).trim();
  const tagObject = git(["cat-file", "-p", localObject]);
  const messageStart = tagObject.indexOf("\n\n");
  localMessage = messageStart === -1 ? "" : tagObject.slice(messageStart + 2);

  if (localMessage !== `${tagName}\n` && localMessage !== releaseNotes) {
    fail(`${tagName} has an unexpected annotation, refusing to replace it`);
  }
}

if (remoteObject) {
  if (
    remoteObject === localObject &&
    localTarget === head &&
    localMessage === releaseNotes
  ) {
    console.log(`${tagName} already matches the published release`);
    process.exit(0);
  }

  fail(`${tagName} is already published, refusing to replace it`);
}

if (localTarget === head && localMessage === releaseNotes) {
  console.log(`${tagName} already matches the release`);
  process.exit(0);
}

if (localTarget && localTarget !== head) {
  const releaseFiles = spawnSync(
    "git",
    [
      "diff",
      "--quiet",
      localTarget,
      head,
      "--",
      "package.json",
      "CHANGELOG.md",
    ],
    { encoding: "utf8" },
  );
  if (releaseFiles.error) throw releaseFiles.error;
  if (releaseFiles.status !== 0) {
    fail(
      `${tagName} points to a commit with different release files, refusing to move it`,
    );
  }
}

const taggerIdentity = git(["var", "GIT_COMMITTER_IDENT"])
  .trim()
  .replace(/ \d+ [+-]\d{4}$/u, "");
const taggerDate = git([
  "show",
  "-s",
  "--date=format:%z",
  "--format=%ct %cd",
  "HEAD",
]).trim();
const tagObject = [
  `object ${head}`,
  "type commit",
  `tag ${tagName}`,
  `tagger ${taggerIdentity} ${taggerDate}`,
  "",
  releaseNotes,
].join("\n");
const nextObject = git(["mktag"], { input: tagObject }).trim();
const expectedObject = localObject ?? "0".repeat(nextObject.length);

git(["update-ref", tagRef, nextObject, expectedObject]);
console.log(
  localObject
    ? `${tagName} finalized at ${head}`
    : `${tagName} created at ${head}`,
);
