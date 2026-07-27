import { extendConfig } from "magic-oxlint-config";
import base from "magic-oxlint-config/base";

// `extendConfig` flattens the preset into one config, so `ignorePatterns` and
// `plugins` survive — oxlint's own `extends` drops them. 1.2.0 rescued `env`
// and `globals` by mirroring them into a `files: ["**"]` override, but
// `ignorePatterns` has no per-override form to hide in, so `extends` stays
// undocumented and this is the shape to use.
// No eslint-plugin-eslint-plugin here, and it is worth saying why, because its
// rules are the ones that would matter most in a repo whose product is ESLint
// rules. oxlint loads it fine through `jsPlugins` and the rules do fire, but
// only on a rule file that is not an ES module: `getRuleInfo` looks for
// `module.exports = …`, and a single `import` statement makes it look for
// `export default` instead and find nothing. `jsx-explicit-boolean.ts` imports
// ESLint's `Rule` and `Scope` types, which the shared tsconfig's `strict` needs,
// so it is a module. Moving the rule to `export default` would emit
// `exports.default = rule`, which is not what ESLint's `require()` wants.
//
// Nothing is lost. Under the eslint.config.mjs this replaces, all 19 of its
// `rules-recommended` rules were a silent no-op too: the rule was exported as
// `module.exports = { … } as const`, and a `TSAsExpression` is not something
// `getRuleInfo` unwraps either. Verified against eslint-plugin-eslint-plugin
// 7.6.0 under both oxlint 1.75.0 and eslint 10.8.0.
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
