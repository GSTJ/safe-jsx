import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  readFileSync,
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { runInThisContext } from "node:vm";

const require = createRequire(import.meta.url);
/** @param {string} entry @param {string} name */
const resolveFrom = (entry, name) => createRequire(entry).resolve(name);
const jestCore = resolveFrom(require.resolve("jest"), "@jest/core");
const jestConfig = resolveFrom(jestCore, "jest-config");
export const deepEntry = resolveFrom(jestConfig, "deepmerge");
const deepRoot = new URL("../", `file://${deepEntry}`);
/** @param {string} name */
const packageRoot = (name) => {
  const entry = resolveFrom(
    require.resolve(name === "glob" ? "rimraf" : "eslint"),
    name,
  );
  return new URL("../../", `file://${entry}`);
};
for (const file of ["index.js", "dist/cjs.js", "dist/umd.js"]) {
  const source = readFileSync(new URL(file, deepRoot), "utf8");
  assert.equal(
    (source.match(/Object.defineProperty\(destination, key,/g) || []).length,
    3,
  );
  assert.doesNotMatch(source, /destination\[key\] =/);
}
/** @type {{ exports: any }} */
const sourceModule = { exports: {} };
const bundled = readFileSync(new URL("dist/cjs.js", deepRoot), "utf8");
// Use the published bundle's identical object predicate for the source-only
// build dependency, which upstream does not ship as a runtime dependency.
const predicate = bundled.slice(0, bundled.indexOf("function emptyTarget"));
const sourceText = readFileSync(new URL("index.js", deepRoot), "utf8");
runInThisContext(
  `(function(module) {${sourceText.replace(
    "var defaultIsMergeableObject = require('is-mergeable-object')",
    `${predicate}\nvar defaultIsMergeableObject = isMergeableObject`,
  )}})`,
)(sourceModule);
for (const merge of [
  sourceModule.exports,
  require(new URL("dist/cjs.js", deepRoot).pathname),
  require(new URL("dist/umd.js", deepRoot).pathname),
]) {
  const poison = JSON.parse('{"__proto__":{"poisoned":true}}');
  for (const result of [
    merge(poison, {}),
    merge(Object.create(null), poison),
    merge({ nested: poison }, { nested: {} }).nested,
    merge({}, { nested: poison }).nested,
  ]) {
    assert.equal(Object.getPrototypeOf(result), Object.prototype);
    assert.equal(result.poisoned, undefined);
  }
  assert.equal(Reflect.get({}, "poisoned"), undefined);
  const symbol = Symbol("value");
  assert.deepEqual(
    merge({ a: [1], [symbol]: { a: 1 } }, { a: [2], [symbol]: { b: 2 } }),
    { a: [1, 2], [symbol]: { a: 1, b: 2 } },
  );
  assert.deepEqual(
    merge(
      { a: { x: 1 } },
      { a: { y: 2 } },
      {
        customMerge: (/** @type {string} */ key) =>
          key === "a"
            ? (/** @type {unknown} */ a, /** @type {unknown} */ b) => [a, b]
            : undefined,
      },
    ),
    { a: [{ x: 1 }, { y: 2 }] },
  );
  assert.deepEqual(
    merge(
      { a: [1] },
      { a: [2] },
      {
        arrayMerge: (/** @type {unknown} */ _a, /** @type {unknown} */ b) => b,
      },
    ),
    { a: [2] },
  );
}
const modern = require(
  new URL("dist/commonjs/index.js", packageRoot("minimatch")).pathname,
);
const minimatchEntry = new URL(
  "dist/commonjs/index.js",
  packageRoot("minimatch"),
).pathname;
const bounded = spawnSync(
  process.execPath,
  [
    "-e",
    `const {Minimatch}=require(${JSON.stringify(minimatchEntry)});
    const assert=require('node:assert/strict');
    // Upstream now rejects amplification instead of returning a capped set.
    assert.throws(
      () => new Minimatch(Array(30).fill('**/../a/b').join('/'),{
        optimizationLevel:2,braceExpandMax:64
      }),
      {name:'RangeError',message:"optimizationLevel 2: too many patterns from '**/..'"}
    );
    // Numeric ranges can be compacted without changing matching behavior.
    const range=new Minimatch('{x,*}/{0..999}',{optimizationLevel:2});
    for(let value=0;value<1000;value++) {
      assert.equal(range.match('x/'+value),true);
      assert.equal(range.match('other/'+value),true);
    }
    for(const value of ['-1','1000','09','word'])
      assert.equal(range.match('x/'+value),false);`,
  ],
  { timeout: 5000, encoding: "utf8" },
);
assert.equal(bounded.status, 0, bounded.stderr || String(bounded.error));
assert.equal(modern.minimatch("src/index.ts", "**/*.ts"), true);
const glob = require(
  new URL("dist/commonjs/index.js", packageRoot("glob")).pathname,
);
const fixture = mkdtempSync(join(tmpdir(), "safe-jsx-glob-"));
try {
  mkdirSync(join(fixture, "nested"));
  writeFileSync(join(fixture, "nested/a.ts"), "");
  assert.deepEqual(glob.globSync("**/*.ts", { cwd: fixture }), ["nested/a.ts"]);
  assert.deepEqual(await glob.glob("**/*.ts", { cwd: fixture }), [
    "nested/a.ts",
  ]);
  let reads = 0;
  const controller = new AbortController();
  const fs = require("node:fs");
  const instrumented = {
    ...fs,
    readdir(
      /** @type {import("node:fs").PathLike} */ path,
      /** @type {any} */ options,
      /** @type {any} */ callback,
    ) {
      reads++;
      controller.abort(new Error("probe-abort"));
      return fs.readdir(
        /** @type {import("node:fs").PathLike} */ path,
        /** @type {any} */ options,
        /** @type {any} */ callback,
      );
    },
  };
  await assert.rejects(
    glob.glob("**/*", {
      cwd: fixture,
      signal: controller.signal,
      fs: instrumented,
    }),
    /probe-abort/,
  );
  const atReject = reads;
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
  assert.equal(reads, atReject);
  assert.ok(reads <= 1);
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
console.log(
  "security regressions passed: deepmerge CJS/UMD, patch coverage, minimatch amplification, glob cancellation and compatibility",
);

// Verify each locally patched parser, then exercise the public matcher in a
// disposable process so a regression cannot hang the suite itself.
/** @type {Record<string, string>} */
const PICOMATCH_HASHES = {
  "2.3.2": "296547ec9d733720b648854bc52a4cfa1c255247336c10b0f6745433bd9e01f2",
  "4.0.7": "eddbd5fcdabdac7e5983ac07c955d2d0b1b5a2d2833cac88ca71cb4a4a6fa6a8",
};
const haste = resolveFrom(jestCore, "jest-haste-map");
const anymatch = resolveFrom(haste, "anymatch");
const jestUtil = resolveFrom(jestCore, "jest-util");
export const picomatchEntries = new Map([
  ["2.3.2", resolveFrom(anymatch, "picomatch")],
  ["4.0.7", resolveFrom(jestUtil, "picomatch")],
]);
for (const [version, entry] of picomatchEntries) {
  const parser = readFileSync(join(dirname(entry), "lib/parse.js"));
  const expected = PICOMATCH_HASHES[version];
  assert.equal(createHash("sha256").update(parser).digest("hex"), expected);
  const probe = spawnSync(
    process.execPath,
    [
      "-e",
      `
    const p = require(${JSON.stringify(entry)});
    const a = require('node:assert/strict');
    for (const glob of ['+(*)', '+(*a)', '*(*)', '*(*a)', '+(?*)', '+(@(*a))', '+(@(*))', '+(@(a*))']) {
      const match = p(glob + 'b');
      a.equal(match('a'.repeat(48) + 'c'), false);
      a.equal(match(glob + 'b'), true);
    }
    a.equal(p('+(a|b)')('abba'), true);
    a.equal(p('+(*(a))')('aaaa'), true);
    a.equal(p('+([ab])')('abba'), true);
    a.equal(p('src/**/*.ts')('src/a/b.ts'), true);
    for (const [glob, input] of [
      ['+(file?.ts)', 'file1.tsfile2.ts'],
      ['+("*")', '***'],
      ['+([[:alpha:]*])', 'a*a'],
    ]) a.equal(p(glob)(input), true, glob);
    const patterns = new Set();
    for (const body of ['*', '*a', 'a*', '?*', 'a?', '*(a)', '+(a)', '?(a)', '@(a)', '!(a)', '[a*]', '[ab]']) {
      for (const outer of ['+', '*']) {
        patterns.add(outer + '(' + body + ')b');
        for (const inner of ['@', '+', '*', '?', '!']) patterns.add(outer + '(' + inner + '(' + body + '))b');
      }
    }
    for (const extra of ['+([a]a*|c)b', '+(abc|abcabc)b', '+(@(a|aa))b', '+(@(a|a?))b', '+(@(@(*a)))b', '+([[]*a)b']) patterns.add(extra);
    for (const glob of patterns) {
      for (const input of ['a'.repeat(48)+'c', 'abc'.repeat(30)+'c', 'x'.repeat(48)+'c']) p(glob)(input);
    }
    console.log('150 adversarial patterns x3 inputs completed');
  `,
    ],
    { timeout: 5000, encoding: "utf8" },
  );
  assert.equal(probe.status, 0, probe.stderr || String(probe.error));
}
console.log(
  "picomatch single-branch extglob regressions passed on both patched versions",
);
