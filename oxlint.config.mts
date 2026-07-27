import base from "magic-oxlint-config/base";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [base],
  // `extends` does not carry the preset's ignorePatterns across — verified on
  // oxlint 1.75.0, see magic's DECISIONS.md — so they are re-declared here,
  // plus this repo's own build output.
  ignorePatterns: [...(base.ignorePatterns ?? []), "lib/**", "reports/**"],
  overrides: [
    {
      // tools/ holds the changelog and release-notes CLIs. Printing to the
      // terminal is what they are for: `release-notes.mjs` is piped into the
      // git tag and the GitHub release body.
      files: ["tools/**"],
      rules: { "no-console": "off" },
    },
  ],
});
