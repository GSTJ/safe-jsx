import type { Rule, Scope, SourceCode } from "eslint";
import type { Node } from "estree";

// Does not include sum or minus, for example, as they don't always evaluate to a boolean
const binaryExpressionOperators = new Set(["===", "!==", ">", "<", ">=", "<="]);

const findVariable = (
  initialScope: Scope.Scope | null,
  nodeName: string,
): Scope.Variable | null => {
  let scope = initialScope;

  // Traverse the scope chain until we find the variable
  while (scope) {
    const variable = scope.variables.find((v) => v.name === nodeName);
    if (variable) return variable;

    scope = scope.upper;
  }

  return null;
};

/** A `const a = …` binding — the only definition kind that carries an initialiser. */
type VariableDefinition = Extract<Scope.Definition, { type: "Variable" }>;

const isVariableDefinition = (
  definition: Scope.Definition,
): definition is VariableDefinition => definition.type === "Variable";

// `seen` holds the variables on the current resolution path, so a declaration
// that refers back to itself stops instead of recursing forever.
const checkBooleanValidity = (
  node: Node | null | undefined,
  scope: Scope.Scope | null,
  seen = new Set<Scope.Variable>(),
): boolean => {
  // A declaration can have no initialiser at all: `let a;`, or the binding in
  // `for (const x of xs)`. Both give a null init.
  if (!node) return false;

  switch (node.type) {
    // Example: !a
    case "UnaryExpression":
      return node.operator === "!";

    // Example: true or false
    case "Literal":
      return typeof node.value === "boolean";

    // Example: a === b, a !== b, a > b, a < b, a >= b, a <= b
    case "BinaryExpression":
      return binaryExpressionOperators.has(node.operator);

    // Example: Boolean(a) or new Boolean(a)
    case "CallExpression":
    case "NewExpression":
      return (
        node.callee.type === "Identifier" && node.callee.name === "Boolean"
      );

    // Example: a && b && c && <div />, where all operands are boolean
    case "LogicalExpression": {
      const { operator, left, right } = node;

      if (operator !== "&&") return false;

      return (
        checkBooleanValidity(left, scope, seen) &&
        checkBooleanValidity(right, scope, seen)
      );
    }

    // Example: a ? b : c, where both b and c are boolean
    case "ConditionalExpression":
      return (
        checkBooleanValidity(node.test, scope, seen) &&
        checkBooleanValidity(node.consequent, scope, seen) &&
        checkBooleanValidity(node.alternate, scope, seen)
      );

    case "Identifier": {
      const variable = findVariable(scope, node.name);
      if (!variable) return false;

      // `var a = a;` resolves to itself, so bail before following it again.
      if (seen.has(variable)) return false;

      const variableDef = variable.defs.find(isVariableDefinition);
      if (!variableDef) return false;

      // Any write after the declaration makes the initialiser useless as
      // evidence: `let a = true; a = 0;` isn't a boolean by the time it's used.
      const isReassigned = variable.references.some(
        (reference) => reference.isWrite() && !reference.init,
      );
      if (isReassigned) return false;

      seen.add(variable);
      // Resolve the initialiser from where the variable was declared, so an
      // unrelated binding that shadows the same name at the use site can't be
      // mistaken for it.
      const isBoolean = checkBooleanValidity(
        variableDef.node.init,
        variable.scope,
        seen,
      );
      seen.delete(variable);

      return isBoolean;
    }

    default:
      return false;
  }
};

/**
 * `context.sourceCode` / `sourceCode.getScope()` land in ESLint 8.37+ and are
 * the only options from ESLint 9 on, where the context helpers were removed.
 * The peer range still allows ESLint 3-8, so both paths stay live. The casts
 * are needed because this builds against the ESLint 10 types, which no longer
 * describe the helpers those older versions expose.
 */
type LegacyRuleContext = {
  getSourceCode: () => SourceCode;
  getScope: () => Scope.Scope;
};

const getSourceCode = (context: Rule.RuleContext): SourceCode =>
  context.sourceCode ??
  (context as unknown as LegacyRuleContext).getSourceCode();

const getScope = (
  context: Rule.RuleContext,
  sourceCode: SourceCode,
  node: Rule.Node,
): Scope.Scope =>
  sourceCode.getScope
    ? sourceCode.getScope(node)
    : (context as unknown as LegacyRuleContext).getScope();

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    fixable: "code",
    messages: {
      booleanConversion:
        "Please ensure a boolean conversion before using the && operator with JSX",
    },
    schema: [],
    defaultOptions: [],
  },
  create(context) {
    const sourceCode = getSourceCode(context);

    return {
      LogicalExpression(node) {
        // We're only interested in && operators
        if (node.operator !== "&&") return;

        // `cond && <div />` and `cond && <>…</>` both leak the left-hand value
        // into the tree when it's falsy, so both sides need the guard. JSX
        // nodes are not part of ESTree, so the type is compared as a string.
        const rightType: string = node.right.type;
        if (rightType !== "JSXElement" && rightType !== "JSXFragment") return;

        // Left-hand side part of the expression
        const { left } = node;

        // Check if it's a valid boolean usage, otherwise it must be fixed
        const scope = getScope(context, sourceCode, node);

        const isSafeBooleanUsage = checkBooleanValidity(left, scope);
        if (isSafeBooleanUsage) return;

        // Report the error and fix it
        context.report({
          node,
          messageId: "booleanConversion",
          fix(fixer) {
            const text = sourceCode.getText(left);

            // A comma expression would split into separate arguments inside
            // Boolean(), which then tests the first operand instead of the
            // one the expression evaluates to, so it keeps its own
            // parentheses. Nothing else binds looser than an argument.
            const argument =
              left.type === "SequenceExpression" ? `(${text})` : text;

            return fixer.replaceText(left, `Boolean(${argument})`);
          },
        });
      },
    };
  },
};

module.exports = rule;
