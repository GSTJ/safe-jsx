import { extendConfig } from "magic-oxlint-config";
import base from "magic-oxlint-config/base";

// `extendConfig` flattens the preset into one config, so `ignorePatterns` and
// `plugins` survive — oxlint's own `extends` drops them (still true on 1.75.0
// with magic-oxlint-config 1.1.0; checked with `oxlint --print-config`).
export default extendConfig(base, {
  // The preset covers the usual suspects; these two are this repo's own: `lib/`
  // is the published build output, `reports/` is scratch for the release scripts.
  ignorePatterns: ["lib/**", "reports/**"],
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
