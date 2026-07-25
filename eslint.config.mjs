import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default [
  { ignores: ["lib/", "reports/", "coverage/"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      globals: globals.node,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    ...eslintPlugin.configs["rules-recommended"],
    files: ["src/rules/*.ts"],
    rules: {
      ...eslintPlugin.configs["rules-recommended"].rules,
      "eslint-plugin/require-meta-docs-description": [
        "error",
        { pattern: "^(Enforce|Require|Disallow)" },
      ],
      "eslint-plugin/require-meta-type": "off",
    },
  },
  {
    ...eslintPlugin.configs["tests-recommended"],
    files: ["src/**/*.test.{ts,tsx}"],
    languageOptions: { globals: globals.jest },
  },
  prettierRecommended,
];
