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
      return ["===", "!==", ">", "<", ">=", "<="].includes(node.operator);

    // Example: Boolean(a) or new Boolean(a)
    case "CallExpression":
    case "NewExpression":
      return (
        node.callee.type === "Identifier" && node.callee.name === "Boolean"
      );

    // Example: a && b, where both a and b are boolean
    case "LogicalExpression":
      // Recursively check the left and right side of the expression
      return (
        checkBooleanValidity(node.left, context) &&
        checkBooleanValidity(node.right, context)
      );

    // Example: const a = true; a
    case "Identifier": {
      // Lookup the variable in the current scope
      const variable = context
        .getScope()
        .variables.find((v) => v.name === node.name);
      return variable
        ? variable.defs.some(
            (def) =>
              def.type === "Variable" &&
              typeof def.node.init.value === "boolean"
          )
        : false;
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
