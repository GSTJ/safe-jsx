import { TSESLint } from "@typescript-eslint/experimental-utils";
import jsxExplicitBooleanRule from "./jsx-explicit-boolean";

const parser = require.resolve("@typescript-eslint/parser");

const parserOptions = {
  parserOptions: {
    project: "../../tsconfig.json",
    sourceType: "module",
  },
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true,
  },
};

const ruleTester = new TSESLint.RuleTester({
  parser,
  parserOptions,
});

ruleTester.run("jsx-explicit-boolean", jsxExplicitBooleanRule, {
  valid: [
    { code: "const a = true; a && <div />;" },
    { code: "const a = false; a && <div />;" },
    { code: "const a = true; Boolean(a) && <div />;" },
    { code: "const a = false; Boolean(a) && <div />;" },
    { code: "const a = 1; Boolean(a) && <div />;" },
    {
      code: "const Component = ({ a }) => <View>{Boolean(a) && <Text>{a}</Text>}</View>;",
    },
    {
      code: "const Component = ({ a }) => <View>{new Boolean(a) && <Text>{a}</Text>}</View>;",
    },
    {
      code: "const Component = ({ a }) => <View>{!!a && <Text>{a}</Text>}</View>;",
    },
    {
      code: "const Component = ({ a }) => <View>{!a && <Text>{a}</Text>}</View>;",
    },
  ],
  invalid: [
    {
      code: "const a = 0; a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "const a = 0; Boolean(a) && <div />;",
    },
    {
      code: "const a = null; a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "const a = null; Boolean(a) && <div />;",
    },
    {
      code: 'const a = ""; a && <div />;',
      errors: [{ messageId: "booleanConversion" }],
      output: 'const a = ""; Boolean(a) && <div />;',
    },
    {
      code: "const a = undefined; a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "const a = undefined; Boolean(a) && <div />;",
    },
    {
      code: 'const a = "0"; a && <div />;',
      errors: [{ messageId: "booleanConversion" }],
      output: 'const a = "0"; Boolean(a) && <div />;',
    },
    {
      code: "const a = []; a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "const a = []; Boolean(a) && <div />;",
    },
    {
      code: "const a = {}; a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "const a = {}; Boolean(a) && <div />;",
    },
    {
      code: "const a = NaN; a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "const a = NaN; Boolean(a) && <div />;",
    },
    {
      code: "const Component = ({ a }) => <View>{a && <Text>{a}</Text>}</View>;",
      errors: [{ messageId: "booleanConversion" }],
      output:
        "const Component = ({ a }) => <View>{Boolean(a) && <Text>{a}</Text>}</View>;",
    },
  ],
});
