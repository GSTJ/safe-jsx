module.exports = {
  rules: {
    "jsx-explicit-boolean": require("./rules/jsx-explicit-boolean"),
  },

  configs: {
    recommended: {
      plugins: ["safe-jsx"],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        "safe-jsx/jsx-explicit-boolean": "error",
      },
    },

    strict: {
      plugins: ["safe-jsx"],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        "safe-jsx/jsx-explicit-boolean": "error",
      },
    },
  },
};
