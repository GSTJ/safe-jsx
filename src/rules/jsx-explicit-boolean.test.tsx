import { RuleTester } from 'eslint';
import jsxExplicitBooleanRule from './jsx-explicit-boolean';

const parserOptions = {
  ecmaVersion: 2018,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true,
  },
};

const ruleTester = new RuleTester({
  parserOptions,
});

ruleTester.run('jsx-explicit-boolean', jsxExplicitBooleanRule, {
  valid: [
    { code: 'const a = true; a && <div />;' },
    { code: 'const a = false; a && <div />;' },
    { code: 'const a = true; Boolean(a) && <div />;' },
    { code: 'const a = false; Boolean(a) && <div />;' },
    { code: 'const a = 1; Boolean(a) && <div />;' },
  ],
  invalid: [
    {
      code: 'const a = 0; a && <div />;',
      errors: [{ messageId: 'booleanConversion' }],
      output: 'const a = 0; Boolean(a) && <div />;',
    },
    {
      code: 'const a = null; a && <div />;',
      errors: [{ messageId: 'booleanConversion' }],
      output: 'const a = null; Boolean(a) && <div />;',
    },
    {
      code: 'const a = ""; a && <div />;',
      errors: [{ messageId: 'booleanConversion' }],
      output: 'const a = ""; Boolean(a) && <div />;',
    },
    {
      code: 'const a = undefined; a && <div />;',
      errors: [{ messageId: 'booleanConversion' }],
      output: 'const a = undefined; Boolean(a) && <div />;',
    },
    {
      code: 'const a = "0"; a && <div />;',
      errors: [{ messageId: 'booleanConversion' }],
      output: 'const a = "0"; Boolean(a) && <div />;',
    },
    {
      code: 'const a = []; a && <div />;',
      errors: [{ messageId: 'booleanConversion' }],
      output: 'const a = []; Boolean(a) && <div />;',
    },
    {
      code: 'const a = {}; a && <div />;',
      errors: [{ messageId: 'booleanConversion' }],
      output: 'const a = {}; Boolean(a) && <div />;',
    },
  ],
});
