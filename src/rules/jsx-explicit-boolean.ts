// Does not include sum or minus, for example, as they don't always evaluate to a boolean
const binaryExpressionOperators = ["===", "!==", ">", "<", ">=", "<="];

function findVariable(context, nodeName) {
  let scope = context.getScope();

  // Traverse the scope chain until we find the variable
  while (scope) {
    const variable = scope.variables.find((v) => v.name === nodeName);
    if (variable) return variable;

    scope = scope.upper;
  }

  return null;
}

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

    case "Identifier": {
      const variable = findVariable(context, node.name);
      if (!variable) return false;

      const variableDef = variable.defs.find((def) => def.type === "Variable");
      if (!variableDef) return false;

      return checkBooleanValidity(variableDef.node.init, context);
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
