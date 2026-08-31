const { RuleTester } = require("eslint");
const tsParser = require("@typescript-eslint/parser");

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run("jsx-explicit-boolean", require("./jsx-explicit-boolean"), {
  valid: [
    // Nested expressions
    { code: "const a = true; const b = true; (a && b) && <div />;" },

    // Conditional expressions
    { code: "const a = true; const b = false; a ? b : false && <div />;" },

    // Scope of variables
    { code: "const a = true; const Component = () => a && <div />;" },
    {
      code: "const flag = 0; { const flag = true; var a = flag; } a && <div />;",
    },

    // Rest
    { code: "const a = true; a && <div />;" },
    { code: "const a = true; const b = a; b && <div />;" },
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
    {
      code: "const index = 1; <View>{index === 0 && <Text />}</View>;",
    },
    {
      code: "const a = 1; b = '0'; <View>{!!a && !!b && <Text />}</View>;",
    },
    {
      code: "const a = 1; b = '0'; c = '0'; <View>{!!a && !!b && !!c && <Text />}</View>;",
    },
    {
      code: "{!!step.subtitle && index === activeStep - 1 && <Text />}",
    },

    // The same variable twice: the cycle guard tracks the resolution path, so
    // seeing `a` on the left must not poison `a` on the right.
    { code: "const a = true; (a && a) && <div />;" },
    { code: "const a = true; a && <>{a}</>;" },

    // A shadow that does not reach the call site leaves the global alone.
    {
      code: "const C = () => { const Boolean = (x) => x; return Boolean; }; const a = 0; Boolean(a) && <div />;",
    },
    // `Boolean` declared as a global rather than in the file is still the
    // global: it resolves to a variable with no defs.
    {
      code: "const a = 0; Boolean(a) && <div />;",
      languageOptions: { globals: { Boolean: "readonly" } },
    },
  ],
  invalid: [
    // Conditional expressions
    {
      code: "const a = true; const b = '0'; (a ? b : false) && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output:
        "const a = true; const b = '0'; (Boolean(a ? b : false)) && <div />;",
    },

    // Scope of variables
    {
      code: "const a = '0'; const Component = () => a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "const a = '0'; const Component = () => Boolean(a) && <div />;",
    },

    // Rest
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
    {
      code: "const a = 1; b = '0'; <View>{!!a && b && <Text />}</View>;",
      errors: [{ messageId: "booleanConversion" }],
      output:
        "const a = 1; b = '0'; <View>{Boolean(!!a && b) && <Text />}</View>;",
    },
    {
      code: "const a = 1; const b = '0'; const c = 0; <View>{a && !!b && !!c && <Text />}</View>;",
      errors: [{ messageId: "booleanConversion" }],
      output:
        "const a = 1; const b = '0'; const c = 0; <View>{Boolean(a && !!b && !!c) && <Text />}</View>;",
    },
    {
      code: "const a = 0 + 0; a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "const a = 0 + 0; Boolean(a) && <div />;",
    },

    // Declarations with no initialiser. These used to crash the rule while
    // reading `type` off a null init, which takes the whole lint run down.
    {
      code: "let a; a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "let a; Boolean(a) && <div />;",
    },
    {
      code: "for (const x of xs) { x && <div />; }",
      errors: [{ messageId: "booleanConversion" }],
      output: "for (const x of xs) { Boolean(x) && <div />; }",
    },
    {
      code: "for (const k in o) { k && <div />; }",
      errors: [{ messageId: "booleanConversion" }],
      output: "for (const k in o) { Boolean(k) && <div />; }",
    },

    // A declaration that refers to itself. This used to recurse until the stack
    // ran out.
    {
      code: "var a = a; a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "var a = a; Boolean(a) && <div />;",
    },

    // Reassignment. The initialiser says boolean, the value at the use site is
    // 0, and the old rule trusted the initialiser and stayed quiet.
    {
      code: "let a = true; a = 0; a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "let a = true; a = 0; Boolean(a) && <div />;",
    },
    {
      code: "let a = true; const b = a; a = 0; b && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "let a = true; const b = a; a = 0; Boolean(b) && <div />;",
    },
    // A second `var` initializer is another write, even though eslint-scope
    // marks declaration writes as initial. The first declaration cannot vouch
    // for the value left by the second one.
    {
      code: "var a = true; var a = 0; a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "var a = true; var a = 0; Boolean(a) && <div />;",
    },

    // A `var` binding belongs to the function or module scope, but its
    // initializer still resolves names from the block where it appears.
    {
      code: "const flag = true; { const flag = 0; var a = flag; } a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output:
        "const flag = true; { const flag = 0; var a = flag; } Boolean(a) && <div />;",
    },

    // Fragments render the falsy left-hand value just like elements do, and
    // used to be skipped entirely.
    {
      code: "const a = 0; a && <></>;",
      errors: [{ messageId: "booleanConversion" }],
      output: "const a = 0; Boolean(a) && <></>;",
    },
    {
      code: "const Component = ({ a }) => <View>{a && <>{a}</>}</View>;",
      errors: [{ messageId: "booleanConversion" }],
      output:
        "const Component = ({ a }) => <View>{Boolean(a) && <>{a}</>}</View>;",
    },

    // A comma expression needs its own parentheses, otherwise the fix turns
    // into Boolean(a, b) and quietly evaluates a instead of b.
    {
      code: "const a = 0, b = 1; (a, b) && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "const a = 0, b = 1; (Boolean((a, b))) && <div />;",
    },

    // The initialiser resolves from the declaration site, so a shadowing
    // binding at the use site can't vouch for it.
    {
      code: "const a = t; const Component = () => { const t = true; return a && <div />; };",
      errors: [{ messageId: "booleanConversion" }],
      output:
        "const a = t; const Component = () => { const t = true; return Boolean(a) && <div />; };",
    },

    // A shadowed `Boolean`. The rule recommends `Boolean(…)` as the guard, so
    // trusting the name wherever it appears meant a binding that shadows it
    // turned the guard into whatever that binding does — here, nothing, and
    // `0` reaches the tree with the rule quiet. The fixer uses `!!` because
    // calling the same name would keep the bypass in place.
    {
      code: "const Boolean = (x) => x; const a = 0; Boolean(a) && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output:
        "const Boolean = (x) => x; const a = 0; !!(Boolean(a)) && <div />;",
    },
    {
      code: "function Boolean(x) { return x; } const a = 0; Boolean(a) && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output:
        "function Boolean(x) { return x; } const a = 0; !!(Boolean(a)) && <div />;",
    },
    {
      code: "import { Boolean } from './shim'; const a = 0; Boolean(a) && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output:
        "import { Boolean } from './shim'; const a = 0; !!(Boolean(a)) && <div />;",
    },
    {
      code: "const C = (Boolean) => <View>{Boolean(0) && <Text />}</View>;",
      errors: [{ messageId: "booleanConversion" }],
      output:
        "const C = (Boolean) => <View>{!!(Boolean(0)) && <Text />}</View>;",
    },
    {
      code: "class Boolean { constructor(x) { return x; } } const a = 0; new Boolean(a) && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output:
        "class Boolean { constructor(x) { return x; } } const a = 0; !!(new Boolean(a)) && <div />;",
    },
    // The built-in can also be replaced with a direct global write. This form
    // resolves through a configured global; the next one stays unresolved in
    // eslint-scope. Neither call is evidence of a boolean, and using the same
    // name for an autofix would keep the bypass in place.
    {
      code: "Boolean = (x) => x; Boolean(0) && <div />;",
      languageOptions: { globals: { Boolean: "writable" } },
      errors: [{ messageId: "booleanConversion" }],
      output: "Boolean = (x) => x; !!(Boolean(0)) && <div />;",
    },
    {
      code: "Boolean = (x) => x; const a = Boolean(0); a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "Boolean = (x) => x; const a = Boolean(0); !!(a) && <div />;",
    },
    // The shadow also stops vouching for a variable that was initialised
    // through it.
    {
      code: "const Boolean = (x) => x; const a = Boolean(0); a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output:
        "const Boolean = (x) => x; const a = Boolean(0); !!(a) && <div />;",
    },

    // A destructuring pattern. The declarator's init belongs to the pattern,
    // not to any one name it binds, and reading it as the binding's value let
    // a boolean-looking right-hand side vouch for a name it never produced.
    {
      code: "const flag = true; const { a } = flag; a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "const flag = true; const { a } = flag; Boolean(a) && <div />;",
    },
    {
      code: "const flag = true; const [a] = flag; a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "const flag = true; const [a] = flag; Boolean(a) && <div />;",
    },
    {
      code: "const { a } = !b; a && <div />;",
      errors: [{ messageId: "booleanConversion" }],
      output: "const { a } = !b; Boolean(a) && <div />;",
    },
  ],
});
