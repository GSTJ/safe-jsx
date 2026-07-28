import base from "magic-oxfmt-config";

// tools/changelog-history.md holds the releases up to 1.3.0 exactly as they were
// published, and tools/changelog.mjs pastes it onto the end of every rebuild.
// Formatting it would rewrite `*` bullets to `-` — the same churn the shared
// config already ignores `**/CHANGELOG.md` to avoid — and the frozen text would
// stop matching the notes that actually shipped.
//
// There is a `withoutIgnorePatterns` helper for the other direction but none for
// adding, and the package's own docs say spreading by hand is supported.
export default {
  ...base,
  ignorePatterns: [
    ...(base.ignorePatterns ?? []),
    "tools/changelog-history.md",
  ],
};
