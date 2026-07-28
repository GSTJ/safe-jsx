// Positive control for tools/changelog-preset.mjs.
//
// The preset decides which commit types reach the changelog, so the risk it
// carries is silent omission: mark a type `hidden` and its commits vanish with
// no error anywhere. A breaking change vanishing that way is the one failure
// this repo cannot ship, and CONTRIBUTING.md promises it won't.
//
// So this builds a throwaway repo with one commit of every type, renders it
// through the real preset, and asserts on what comes back. The `ci!:` commit is
// the case worth having: `ci` is hidden, and its breaking note still has to
// surface.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const here = import.meta.dirname;
const presetPath = join(here, "changelog-preset.mjs");
const cliPath = join(
  here,
  "..",
  "node_modules",
  ".bin",
  "conventional-changelog",
);

const COMMITS = [
  "feat: add a thing",
  "fix: correct a thing",
  "build: shrink the tarball",
  "refactor: rewrite the internals",
  "chore(deps): bump something",
  "docs: update the readme",
  "ci: tweak the workflow",
  "style: reformat",
  "test: add cases",
  "perf!: drop the slow path\n\nBREAKING CHANGE: the slow path is gone",
  "chore: retire the legacy loader\n\nBREAKING CHANGE: the legacy loader is gone",
  "ci!: require node 24\n\nBREAKING CHANGE: node 22 is no longer supported",
];

const repo = mkdtempSync(join(tmpdir(), "safe-jsx-changelog-"));
/** @param {string[]} args */
const git = (...args) =>
  execFileSync("git", args, { cwd: repo, encoding: "utf8", stdio: "pipe" });

let output;

try {
  git("init", "--quiet", "--initial-branch", "main");
  git("config", "user.email", "check@example.com");
  git("config", "user.name", "changelog check");
  writeFileSync(
    join(repo, "package.json"),
    JSON.stringify({ name: "changelog-check", version: "1.0.0" }),
  );
  git("add", ".");

  for (const message of COMMITS) {
    git(
      "commit",
      "--quiet",
      "--allow-empty",
      "--cleanup=verbatim",
      "-m",
      message,
    );
  }

  git("tag", "-a", "v1.0.0", "-m", "v1.0.0");

  output = execFileSync(
    cliPath,
    ["--config", presetPath, "--release-count", "0", "--stdout"],
    { cwd: repo, encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
  );
} finally {
  rmSync(repo, { recursive: true, force: true });
}

/** @type {string[]} */
const failures = [];
/**
 * @param {string} label
 * @param {boolean} condition
 */
const expect = (label, condition) => {
  if (!condition) failures.push(label);
};

// Breaking changes render whatever type they hang off, hidden ones included.
// The preset prefixes the heading with a warning sign, so match on the words.
expect("BREAKING CHANGES heading", /^### .*BREAKING CHANGES$/m.test(output));
expect(
  "breaking note on a bump type (perf!)",
  output.includes("the slow path is gone"),
);
expect(
  "breaking note on a changelog type (chore!)",
  output.includes("the legacy loader is gone"),
);
expect(
  "breaking note on a HIDDEN type (ci!)",
  output.includes("node 22 is no longer supported"),
);

// The types that can change the published artifact.
expect("Features section", output.includes("### Features"));
expect("Bug Fixes section", output.includes("### Bug Fixes"));
expect("Build System section", output.includes("shrink the tarball"));
expect("Code Refactoring section", output.includes("rewrite the internals"));
expect("Chores section", output.includes("bump something"));
expect("Documentation section", output.includes("update the readme"));

// The types that cannot. A non-breaking commit of each stays out.
expect("ci stays hidden", !output.includes("tweak the workflow"));
expect("style stays hidden", !output.includes("reformat"));
expect("test stays hidden", !output.includes("add cases"));

if (failures.length > 0) {
  console.error("changelog preset check FAILED:");
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error("\n--- rendered output ---\n");
  console.error(output);
  process.exit(1);
}

// `--print` is for looking at the control by hand, which is the only way to
// judge the section names and ordering. The assertions above cannot.
if (process.argv.includes("--print")) {
  console.log(output);
}

console.log(
  `changelog preset check passed (${COMMITS.length} synthetic commits, 3 breaking)`,
);
