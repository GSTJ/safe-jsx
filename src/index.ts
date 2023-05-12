import jsxExplicitBoolean from "./rules/jsx-explicit-boolean";

export default {
  rules: {
    "jsx-explicit-boolean": jsxExplicitBoolean,
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
