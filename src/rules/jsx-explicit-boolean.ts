const binaryExpressionOperators = ["===", "!==", ">", "<", ">=", "<="];

function checkBooleanValidity(node, context) {
  const { type } = node;

  switch (type) {
    // Example: !a
    case "UnaryExpression":
      return node.operator === "!";

    // Example: true or false
    case "Literal":
      return typeof node.value === "boolean";

    // Example: a === b, a !== b, a > b, a < b, a >= b, a <= b
    case "BinaryExpression":
      return binaryExpressionOperators.includes(node.operator);

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
        checkBooleanValidity(left, context) &&
        checkBooleanValidity(right, context)
      );
    }

    // Example: a ? b : c, where both b and c are boolean
    case "ConditionalExpression":
      return (
        checkBooleanValidity(node.test, context) &&
        checkBooleanValidity(node.consequent, context) &&
        checkBooleanValidity(node.alternate, context)
      );

    // Example: const a = true; a
    case "Identifier": {
      let scope = context.getScope();
      while (scope) {
        const variable = scope.variables.find((v) => v.name === node.name);
        if (variable) {
          return variable.defs.some(
            (def) =>
              def.type === "Variable" &&
              checkBooleanValidity(def.node.init, context)
          );
        }
        scope = scope.upper;
      }
      return false;
    }

    default:
      return false;
  }
}

module.exports = {
  meta: {
    type: "suggestion",
    fixable: "code",
    messages: {
      booleanConversion:
        "Please ensure a boolean conversion before using the && operator with JSX",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      LogicalExpression(node) {
        // We're only interested in && operators
        if (node.operator !== "&&") return;

        // We're only interested in JSX elements on the right-hand side
        if (node.right.type !== "JSXElement") return;

        // Left-hand side part of the expression
        const { left } = node;

        // Check if it's a valid boolean usage, otherwise it must be fixed
        const isSafeBooleanUsage = checkBooleanValidity(left, context);
        if (isSafeBooleanUsage) return;

        // Report the error and fix it
        context.report({
          node,
          messageId: "booleanConversion",
          fix(fixer) {
            return fixer.replaceTextRange(
              [left.range[0], left.range[1]],
              `Boolean(${context.getSourceCode().getText(left)})`
            );
          },
        });
      },
    };
  },
} as const;
