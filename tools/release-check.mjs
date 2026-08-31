// Regression controls for the maintainer-only release tools.
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, dirname, join } from "node:path";
import { env } from "node:process";

const here = import.meta.dirname;
const root = dirname(here);
const changelogPath = join(here, "changelog.mjs");
const changelogPresetPath = join(here, "changelog-preset.mjs");
const publishCheckPath = join(here, "publish-check.mjs");
const tagReleasePath = join(here, "tag-release.mjs");

/**
 * @param {string} cwd
 * @param {...string} args
 * @returns {string}
 */
const git = (cwd, ...args) =>
  execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });

/**
 * @template T
 * @param {(directory: string) => T} run
 * @returns {T}
 */
const inTempDir = (run) => {
  const directory = mkdtempSync(join(tmpdir(), "safe-jsx-release-check-"));
  try {
    return run(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
};

/** @param {string} repo */
const runTagRelease = (repo) =>
  spawnSync(process.execPath, [tagReleasePath], {
    cwd: repo,
    encoding: "utf8",
    timeout: 30_000,
  });

/**
 * @param {string} repo
 * @param {string} releaseTag
 * @param {string} [mainRef]
 * @param {string} [releaseBody]
 * @param {string} [releaseSha]
 */
const runPublishCheck = (
  repo,
  releaseTag,
  mainRef = "refs/heads/main",
  releaseBody = "## [1.3.9] (2026-08-17)\n\n* secure the release tools\n",
  releaseSha = git(
    repo,
    "rev-parse",
    `refs/tags/${releaseTag}^{commit}`,
  ).trim(),
) => {
  return spawnSync(process.execPath, [publishCheckPath], {
    cwd: repo,
    encoding: "utf8",
    env: {
      ...env,
      RELEASE_BODY: releaseBody,
      RELEASE_MAIN_REF: mainRef,
      RELEASE_REF: `refs/tags/${releaseTag}`,
      RELEASE_SHA: releaseSha,
      RELEASE_TAG: releaseTag,
    },
    timeout: 30_000,
  });
};

/**
 * @param {string} repo
 * @param {string} tagName
 */
const tagObject = (repo, tagName) =>
  git(repo, "rev-parse", `refs/tags/${tagName}`).trim();

/**
 * @param {string} repo
 * @param {string} tagName
 */
const tagTarget = (repo, tagName) =>
  git(repo, "rev-parse", `refs/tags/${tagName}^{commit}`).trim();

/**
 * @param {string} repo
 * @param {string} tagName
 */
const tagMessage = (repo, tagName) => {
  const object = git(repo, "cat-file", "-p", `refs/tags/${tagName}`);
  return object.slice(object.indexOf("\n\n") + 2);
};

/**
 * @param {string} directory
 * @returns {string}
 */
const initReleaseRepo = (directory) => {
  const remote = join(directory, "remote.git");
  const repo = join(directory, "repo");
  mkdirSync(repo);
  git(directory, "init", "--quiet", "--bare", remote);
  git(repo, "init", "--quiet", "--initial-branch", "main");
  git(repo, "config", "user.name", "release check");
  git(repo, "config", "user.email", "check@example.com");
  git(repo, "remote", "add", "origin", remote);

  writeFileSync(
    join(repo, "package.json"),
    `${JSON.stringify({ name: "release-check", version: "1.3.8" }, null, 2)}\n`,
  );
  writeFileSync(
    join(repo, "CHANGELOG.md"),
    "# Changelog\n\n## [1.3.8] (2026-08-05)\n\n* previous release\n",
  );
  git(repo, "add", "package.json", "CHANGELOG.md");
  git(repo, "commit", "--quiet", "-m", "chore: initial");

  writeFileSync(
    join(repo, "package.json"),
    `${JSON.stringify({ name: "release-check", version: "1.3.9" }, null, 2)}\n`,
  );
  writeFileSync(
    join(repo, "CHANGELOG.md"),
    "# Changelog\n\n## [1.3.9] (2026-08-17)\n\n* secure the release tools\n\n## [1.3.8] (2026-08-05)\n\n* previous release\n",
  );
  git(repo, "add", "package.json", "CHANGELOG.md");
  git(repo, "commit", "--quiet", "-m", "v1.3.9");

  return repo;
};

/** @type {[string, () => void][]} */
const checks = [
  [
    "missing changelog dependency never reaches npx",
    () =>
      inTempDir((directory) => {
        const fixture = join(directory, "fixture");
        const tools = join(fixture, "tools");
        const trap = join(directory, "trap");
        const marker = join(directory, "npx-ran");
        mkdirSync(tools, { recursive: true });
        mkdirSync(trap);
        copyFileSync(changelogPath, join(tools, "changelog.mjs"));
        copyFileSync(changelogPresetPath, join(tools, "changelog-preset.mjs"));

        const fakeNpx = join(
          trap,
          process.platform === "win32" ? "npx.cmd" : "npx",
        );
        writeFileSync(
          fakeNpx,
          process.platform === "win32"
            ? `@echo off\r\ntype nul > "${marker}"\r\nexit /b 97\r\n`
            : `#!/bin/sh\n: > "${marker}"\nexit 97\n`,
        );
        if (process.platform !== "win32") chmodSync(fakeNpx, 0o755);

        const result = spawnSync(
          process.execPath,
          [join(tools, "changelog.mjs")],
          {
            cwd: fixture,
            encoding: "utf8",
            env: {
              ...env,
              PATH: `${trap}${delimiter}${env.PATH ?? ""}`,
              npm_config_registry: "http://127.0.0.1:9",
            },
            timeout: 5_000,
          },
        );

        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /conventional-changelog/u);
        assert.equal(existsSync(marker), false, "the npx trap was executed");
        assert.equal(existsSync(join(fixture, "CHANGELOG.md")), false);
      }),
  ],
  [
    "same-version releases cannot make npm force a tag",
    () => {
      const npmConfig = readFileSync(join(root, ".npmrc"), "utf8");
      assert.match(npmConfig, /^allow-same-version\s*=\s*false$/mu);
    },
  ],
  [
    "release tags are annotated and idempotent",
    () =>
      inTempDir((directory) => {
        const repo = initReleaseRepo(directory);
        const firstRun = runTagRelease(repo);
        assert.equal(firstRun.status, 0, firstRun.stderr);
        assert.equal(git(repo, "cat-file", "-t", "v1.3.9").trim(), "tag");
        assert.equal(
          tagTarget(repo, "v1.3.9"),
          git(repo, "rev-parse", "HEAD").trim(),
        );
        assert.equal(
          tagMessage(repo, "v1.3.9"),
          "## [1.3.9] (2026-08-17)\n\n* secure the release tools\n",
        );

        const firstObject = tagObject(repo, "v1.3.9");
        const secondRun = runTagRelease(repo);
        assert.equal(secondRun.status, 0, secondRun.stderr);
        assert.equal(tagObject(repo, "v1.3.9"), firstObject);

        git(repo, "tag", "--delete", "v1.3.9");
        const thirdRun = runTagRelease(repo);
        assert.equal(thirdRun.status, 0, thirdRun.stderr);
        assert.equal(tagObject(repo, "v1.3.9"), firstObject);
      }),
  ],
  [
    "an unpublished release tag can follow its squash commit",
    () =>
      inTempDir((directory) => {
        const repo = initReleaseRepo(directory);
        const firstRun = runTagRelease(repo);
        assert.equal(firstRun.status, 0, firstRun.stderr);
        const releaseBranchTarget = tagTarget(repo, "v1.3.9");

        git(repo, "commit", "--quiet", "--allow-empty", "-m", "v1.3.9 (#99)");
        const squashTarget = git(repo, "rev-parse", "HEAD").trim();
        const secondRun = runTagRelease(repo);
        assert.equal(secondRun.status, 0, secondRun.stderr);
        assert.notEqual(squashTarget, releaseBranchTarget);
        assert.equal(tagTarget(repo, "v1.3.9"), squashTarget);
      }),
  ],
  [
    "a published release tag is immutable",
    () =>
      inTempDir((directory) => {
        const repo = initReleaseRepo(directory);
        const firstRun = runTagRelease(repo);
        assert.equal(firstRun.status, 0, firstRun.stderr);
        git(repo, "push", "--quiet", "origin", "refs/tags/v1.3.9");
        const publishedObject = tagObject(repo, "v1.3.9");

        git(repo, "commit", "--quiet", "--allow-empty", "-m", "v1.3.9 (#99)");
        const secondRun = runTagRelease(repo);
        assert.notEqual(secondRun.status, 0);
        assert.match(secondRun.stderr, /already published/u);
        assert.equal(tagObject(repo, "v1.3.9"), publishedObject);
        assert.equal(
          git(
            directory,
            "--git-dir",
            join(directory, "remote.git"),
            "rev-parse",
            "refs/tags/v1.3.9",
          ).trim(),
          publishedObject,
        );
      }),
  ],
  [
    "an unexpected local annotation is preserved",
    () =>
      inTempDir((directory) => {
        const repo = initReleaseRepo(directory);
        git(repo, "tag", "-a", "v1.3.9", "-m", "keep this annotation");
        const originalObject = tagObject(repo, "v1.3.9");
        const result = runTagRelease(repo);
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /unexpected annotation/u);
        assert.equal(tagObject(repo, "v1.3.9"), originalObject);
      }),
  ],
  [
    "publish accepts the matching annotated tag on main",
    () =>
      inTempDir((directory) => {
        const repo = initReleaseRepo(directory);
        const tagResult = runTagRelease(repo);
        assert.equal(tagResult.status, 0, tagResult.stderr);

        const result = runPublishCheck(repo, "v1.3.9");
        assert.equal(result.status, 0, result.stderr);
        assert.match(result.stdout, /annotated, documented/u);
      }),
  ],
  [
    "publish rejects a tag that does not match package.json",
    () =>
      inTempDir((directory) => {
        const repo = initReleaseRepo(directory);
        git(repo, "tag", "-a", "v1.3.8", "-m", "old name, new files");
        const result = runPublishCheck(repo, "v1.3.8");
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /instead of v1\.3\.9/u);
      }),
  ],
  [
    "publish rejects a tag moved after the release event",
    () =>
      inTempDir((directory) => {
        const repo = initReleaseRepo(directory);
        const tagResult = runTagRelease(repo);
        assert.equal(tagResult.status, 0, tagResult.stderr);
        const releaseSha = tagTarget(repo, "v1.3.9");

        git(repo, "tag", "--delete", "v1.3.9");
        git(repo, "commit", "--quiet", "--allow-empty", "-m", "fix: later");
        git(
          repo,
          "tag",
          "-a",
          "v1.3.9",
          "-m",
          "## [1.3.9] (2026-08-17)\n\n* secure the release tools",
        );

        const result = runPublishCheck(
          repo,
          "v1.3.9",
          "refs/heads/main",
          undefined,
          releaseSha,
        );
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /moved after the release event/u);
      }),
  ],
  [
    "publish rejects release notes that drift from the changelog",
    () =>
      inTempDir((directory) => {
        const repo = initReleaseRepo(directory);
        const tagResult = runTagRelease(repo);
        assert.equal(tagResult.status, 0, tagResult.stderr);

        const result = runPublishCheck(
          repo,
          "v1.3.9",
          "refs/heads/main",
          "## [1.3.9] (2026-08-17)\n\n* different notes\n",
        );
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /release notes do not match/u);
      }),
  ],
  [
    "publish rejects a lightweight release tag",
    () =>
      inTempDir((directory) => {
        const repo = initReleaseRepo(directory);
        git(repo, "tag", "v1.3.9");

        const result = runPublishCheck(repo, "v1.3.9");
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /not annotated/u);
      }),
  ],
  [
    "publish rejects a release tag outside main",
    () =>
      inTempDir((directory) => {
        const repo = initReleaseRepo(directory);
        const tagResult = runTagRelease(repo);
        assert.equal(tagResult.status, 0, tagResult.stderr);
        git(repo, "checkout", "--quiet", "--detach");
        git(repo, "branch", "--force", "main", "HEAD^");

        const result = runPublishCheck(repo, "v1.3.9");
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /not reachable/u);
      }),
  ],
  [
    "publish accepts a main checkout past the release tag",
    () =>
      inTempDir((directory) => {
        const repo = initReleaseRepo(directory);
        const tagResult = runTagRelease(repo);
        assert.equal(tagResult.status, 0, tagResult.stderr);
        git(repo, "commit", "--quiet", "--allow-empty", "-m", "fix: later");

        const result = runPublishCheck(repo, "v1.3.9");
        assert.equal(result.status, 0, result.stderr);
      }),
  ],
];

for (const [name, check] of checks) {
  try {
    check();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

console.log(`release tooling check passed (${checks.length} controls)`);
