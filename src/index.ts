const { name, version } = require("../package.json");

// eslintrc-style config, for ESLint 8 and below.
const legacyConfig = {
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

const plugin = {
  meta: { name, version },

  rules: {
    "jsx-explicit-boolean": require("./rules/jsx-explicit-boolean"),
  },

  configs: {
    recommended: legacyConfig,
    strict: legacyConfig,
  },
};

// Flat config, for ESLint 9 and above. It has to reference the plugin object
// itself, so it gets attached once `plugin` exists.
const flatConfig = {
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

plugin.configs["flat/recommended"] = flatConfig;
plugin.configs["flat/strict"] = flatConfig;

module.exports = plugin;
