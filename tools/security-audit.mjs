import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { realpathSync } from "node:fs";
import { createRequire } from "node:module";

// Keep raw registry findings visible. Accept only the exact locally patched
// deepmerge and picomatch advisories after verifying every reported path.
import { deepEntry, picomatchEntries } from "./security-check.mjs";

/** @param {string} entry @param {string} name */
const resolveDependency = (entry, name) => {
  const localRequire = createRequire(entry);
  try {
    return localRequire.resolve(name);
  } catch {
    // Type-only packages have no runtime entry but still own dependency edges.
    return localRequire.resolve(`${name}/package.json`);
  }
};

/** @param {string} path */
const verifyPath = (path) => {
  let entry = new URL("../package.json", import.meta.url).pathname;
  for (const name of path.split(">").slice(1))
    entry = resolveDependency(entry, name);
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
/** @param {{version: string, paths: string[]}} installed */
const verifyPicomatch = (installed) => {
  const expected = picomatchEntries.get(installed.version);
  assert.ok(expected, `unpatched picomatch ${installed.version}`);
  assert.ok(installed.paths.length > 0);
  for (const path of installed.paths) {
    let entry = new URL("../package.json", import.meta.url).pathname;
    for (const name of path.split(">").slice(1))
      entry = resolveDependency(entry, name);
    assert.equal(
      realpathSync(entry),
      realpathSync(expected),
      `unpatched path: ${path}`,
    );
  }
};
for (const finding of findings) {
  assert.ok(finding.findings.length > 0);
  if (finding.github_advisory_id === "GHSA-fc5q-39xc-vjpf") {
    assert.equal(finding.module_name, "picomatch");
    for (const installed of finding.findings) verifyPicomatch(installed);
  } else {
    assert.equal(
      finding.github_advisory_id,
      "GHSA-gcqx-w48m-w2h4",
      `unmitigated advisory: ${finding.github_advisory_id}`,
    );
    assert.equal(finding.module_name, "deepmerge");
    for (const installed of finding.findings) verifyInstalled(installed);
  }
}
console.log(
  `audit passed: ${findings.length} locally patched advisory reports; raw registry count is not zero`,
);
