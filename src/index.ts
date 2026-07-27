import type { ESLint, Linter, Rule } from "eslint";

// Read at runtime rather than imported, so `lib/index.js` keeps resolving the
// published package.json and `rootDir` stays `src/`.
const { name, version } = require("../package.json") as {
  name: string;
  version: string;
};

// eslintrc-style config, for ESLint 8 and below.
const legacyConfig: Linter.LegacyConfig = {
  plugins: ["safe-jsx"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "safe-jsx/jsx-explicit-boolean": "error",
  },
};

// Held separately from `plugin` so the flat configs, which can only be built
// once `plugin` exists, have somewhere to land without a cast.
const configs: NonNullable<ESLint.Plugin["configs"]> = {
  recommended: legacyConfig,
  strict: legacyConfig,
};

const plugin: ESLint.Plugin = {
  meta: { name, version },

  rules: {
    "jsx-explicit-boolean":
      require("./rules/jsx-explicit-boolean") as Rule.RuleModule,
  },

  configs,
};

// Flat config, for ESLint 9 and above. It has to reference the plugin object
// itself, so it gets attached once `plugin` exists.
const flatConfig: Linter.Config = {
  plugins: { "safe-jsx": plugin },
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    "safe-jsx/jsx-explicit-boolean": "error",
  },
};

configs["flat/recommended"] = flatConfig;
configs["flat/strict"] = flatConfig;

module.exports = plugin;
