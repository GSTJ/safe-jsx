function checkBooleanValidity(node, context) {
  const isNegation = node.type === "UnaryExpression" && node.operator === "!";
  const isBooleanLiteral =
    node.type === "Literal" && typeof node.value === "boolean";
  const isBooleanVariable =
    node.type === "Identifier" &&
    context
      .getScope()
      .variables.some(
        (variable) =>
          variable.name === node.name &&
          variable.defs.some(
            (def) =>
              def.type === "Variable" &&
              typeof def.node.init.value === "boolean"
          )
      );
  return isNegation || isBooleanLiteral || isBooleanVariable;
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

        const { left } = node;

        // Boolean(a) && <JSX />
        const isExplicitBooleanConversion =
          left.type === "CallExpression" &&
          left.callee.type === "Identifier" &&
          left.callee.name === "Boolean";
        if (isExplicitBooleanConversion) return;

        // new Boolean(a) && <JSX />
        const isNewBooleanObject =
          left.type === "NewExpression" &&
          left.callee.type === "Identifier" &&
          left.callee.name === "Boolean";
        if (isNewBooleanObject) return;

        // !a && <JSX /> | !!a && <JSX />
        const isNegation =
          left.type === "UnaryExpression" && left.operator === "!";
        if (isNegation) return;

        // true && <JSX />
        const isBooleanLiteral =
          left.type === "Literal" && typeof left.value === "boolean";
        if (isBooleanLiteral) return;

        // a === true && <JSX />
        const isBooleanBinaryExpression =
          left.type === "BinaryExpression" &&
          ["===", "!==", ">", "<", ">=", "<="].includes(left.operator);
        if (isBooleanBinaryExpression) return;

        // !!a && !!b && <JSX />
        const isComplexLogicalExpression =
          left.type === "LogicalExpression" &&
          checkBooleanValidity(left.left, context) &&
          checkBooleanValidity(left.right, context);
        if (isComplexLogicalExpression) return;

        // const a = true; a && <JSX />
        const isBooleanVariable =
          left.type === "Identifier" &&
          context
            .getScope()
            .variables.some(
              (variable) =>
                variable.name === left.name &&
                variable.defs.some(
                  (def) =>
                    def.type === "Variable" &&
                    typeof def.node.init.value === "boolean"
                )
            );
        if (isBooleanVariable) return;

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
