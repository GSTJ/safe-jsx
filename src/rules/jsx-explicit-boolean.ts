export default {
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

        const isExplicitBooleanConversion =
          left.type === "CallExpression" &&
          left.callee.type === "Identifier" &&
          left.callee.name === "Boolean";
        if (isExplicitBooleanConversion) return;

        const isNewBooleanObject =
          left.type === "NewExpression" &&
          left.callee.type === "Identifier" &&
          left.callee.name === "Boolean";
        if (isNewBooleanObject) return;

        const isDoubleNegation =
          left.type === "UnaryExpression" &&
          left.operator === "!" &&
          left.argument.type === "UnaryExpression" &&
          left.argument.operator === "!";
        if (isDoubleNegation) return;

        const isBooleanLiteral =
          left.type === "Literal" && typeof left.value === "boolean";
        if (isBooleanLiteral) return;

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
