import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { realpathSync } from "node:fs";
import { createRequire } from "node:module";

// Keep raw registry findings visible. Only the tested local deepmerge patch is
// accepted, for this exact advisory and version; every other finding fails.
import { deepEntry } from "./security-check.mjs";

/** @param {string} path */
const verifyPath = (path) => {
  let entry = new URL("../package.json", import.meta.url).pathname;
  for (const name of path.split(">").slice(1))
    entry = createRequire(entry).resolve(name);
  assert.equal(
    realpathSync(entry),
    realpathSync(deepEntry),
    `unverified deepmerge path: ${path}`,
  );
};

/** @param {{version: string, paths: string[]}} installed */
const verifyInstalled = (installed) => {
  assert.equal(installed.version, "4.3.1");
  assert.ok(installed.paths.length > 0);
  for (const path of installed.paths) verifyPath(path);
};

const result = spawnSync("pnpm", ["audit", "--json"], {
  encoding: "utf8",
  timeout: 60000,
});
assert.ok(
  result.status === 0 || result.status === 1,
  result.stderr || String(result.error),
);
const audit = JSON.parse(result.stdout);
assert.ok(audit.metadata && audit.advisories, "missing audit response");
const findings = Object.values(audit.advisories);
for (const finding of findings) {
  assert.equal(
    finding.github_advisory_id,
    "GHSA-gcqx-w48m-w2h4",
    `unmitigated advisory: ${finding.github_advisory_id}`,
  );
  assert.equal(finding.module_name, "deepmerge");
  assert.ok(finding.findings.length > 0);
  for (const installed of finding.findings) verifyInstalled(installed);
}
console.log(
  `audit passed: ${findings.length} locally patched advisory reports; raw registry count is not zero`,
);
