import type { Rule, Scope, SourceCode } from "eslint";
import type { Node } from "estree";

// Does not include sum or minus, for example, as they don't always evaluate to a boolean
const binaryExpressionOperators = new Set(["===", "!==", ">", "<", ">=", "<="]);

// ESLint runs this rule against untrusted source, so the evidence walk gets a
// fixed work budget. On exhaustion it returns false; the caller reports and
// safely wraps the expression.
const MAX_BOOLEAN_EVIDENCE_NODES = 10_000;

const findVariable = (
  initialScope: Scope.Scope | null,
  nodeName: string,
): Scope.Variable | null => {
  let scope = initialScope;

  // Traverse the scope chain until we find the variable
  while (scope) {
    const variable = scope.set.get(nodeName);
    if (variable) return variable;

    scope = scope.upper;
  }

  return null;
};

/** A `const a = …` binding — the only definition kind that carries an initialiser. */
type VariableDefinition = Extract<Scope.Definition, { type: "Variable" }>;

type VariableEvidence = {
  definition: VariableDefinition;
  scope: Scope.Scope;
};

const isVariableDefinition = (
  definition: Scope.Definition,
): definition is VariableDefinition => definition.type === "Variable";

// `Boolean(…)` is trusted by name, which is only sound while the name still
// refers to the built-in. A local definition shadows it, and a direct write can
// replace even a global supplied through `languageOptions.globals`.
const isUnsafeBoolean = (
  scope: Scope.Scope | null,
  hasUnresolvedWrite: boolean,
): boolean => {
  if (hasUnresolvedWrite) return true;

  const variable = findVariable(scope, "Boolean");
  return (
    variable !== null &&
    (variable.defs.length > 0 ||
      variable.references.some((reference) => reference.isWrite()))
  );
};

/**
 * The declaration whose initialiser can stand in for `variable`, or null when
 * nothing about the binding makes that initialiser evidence of anything.
 */
const evidenceFor = (variable: Scope.Variable): VariableEvidence | null => {
  const [definition, redeclaration] =
    variable.defs.filter(isVariableDefinition);
  // Every declaration initializer is marked as an initial write. With two
  // `var` declarations, ignoring initial writes lets the first initializer
  // vouch for a later value, so ambiguous redeclarations fail closed.
  if (!definition || redeclaration) return null;

  // Only a plain `const a = …` binds the initialiser to the name. In
  // `const { a } = flag` the declarator's init is `flag`, which says nothing
  // about `a`, and reading it as evidence let a boolean-looking right-hand side
  // vouch for a binding it never produced.
  if (definition.node.id.type !== "Identifier") return null;

  const initialWrite = variable.references.find(
    (reference) => reference.init && reference.identifier === definition.name,
  );
  if (!initialWrite) return null;

  // Any other write makes the initialiser useless as evidence: `let a = true;
  // a = 0;` is not boolean by the time it is used.
  const isReassigned = variable.references.some(
    (reference) => reference !== initialWrite && reference.isWrite(),
  );
  if (isReassigned) return null;

  return { definition, scope: initialWrite.from };
};

type BooleanCheckFrame =
  | {
      kind: "check";
      node: Node | null | undefined;
      scope: Scope.Scope | null;
    }
  | { kind: "leave"; variable: Scope.Variable };

type BooleanNodeFrame = Extract<BooleanCheckFrame, { kind: "check" }>;

// Each branch mirrors one ESTree node form that this rule accepts.
const checkBooleanFrame = (
  frame: BooleanNodeFrame,
  frames: BooleanCheckFrame[],
  seen: Set<Scope.Variable>,
  hasUnresolvedBooleanWrite: boolean,
): boolean => {
  // A declaration can have no initialiser at all: `let a;`, or the binding in
  // `for (const x of xs)`. Both give a null init.
  const current = frame.node;
  if (!current) return false;

  switch (current.type) {
    // Example: !a
    case "UnaryExpression":
      return current.operator === "!";

    // Example: true or false
    case "Literal":
      return typeof current.value === "boolean";

    // Example: a === b, a !== b, a > b, a < b, a >= b, a <= b
    case "BinaryExpression":
      return binaryExpressionOperators.has(current.operator);

    // Example: Boolean(a) or new Boolean(a), and only the global one.
    case "CallExpression":
    case "NewExpression":
      return (
        current.callee.type === "Identifier" &&
        current.callee.name === "Boolean" &&
        !isUnsafeBoolean(frame.scope, hasUnresolvedBooleanWrite)
      );

    // Example: a && b && c && <div />, where all operands are boolean
    case "LogicalExpression":
      if (current.operator !== "&&") return false;
      frames.push(
        { kind: "check", node: current.right, scope: frame.scope },
        { kind: "check", node: current.left, scope: frame.scope },
      );
      return true;

    // Example: a ? b : c, where both b and c are boolean
    case "ConditionalExpression":
      frames.push(
        { kind: "check", node: current.alternate, scope: frame.scope },
        { kind: "check", node: current.consequent, scope: frame.scope },
        { kind: "check", node: current.test, scope: frame.scope },
      );
      return true;

    case "Identifier": {
      const variable = findVariable(frame.scope, current.name);
      // `var a = a;` resolves to itself, so stop before following it again.
      if (!variable || seen.has(variable)) return false;

      const evidence = evidenceFor(variable);
      if (!evidence) return false;

      seen.add(variable);
      frames.push(
        { kind: "leave", variable },
        {
          kind: "check",
          node: evidence.definition.node.init,
          // Resolve the initialiser from where the variable was declared, so a
          // block-scoped binding at either the declaration or use site cannot
          // stand in for it.
          scope: evidence.scope,
        },
      );
      return true;
    }

    default:
      return false;
  }
};

// `seen` holds the variables on the current resolution path, so a declaration
// that refers back to itself stops without looping. The explicit stack keeps a
// long alias chain out of the JavaScript call stack.
const checkBooleanValidity = (
  node: Node | null | undefined,
  scope: Scope.Scope | null,
  hasUnresolvedBooleanWrite: boolean,
): boolean => {
  const seen = new Set<Scope.Variable>();
  const frames: BooleanCheckFrame[] = [{ kind: "check", node, scope }];
  let checkedNodes = 0;

  while (frames.length > 0) {
    const frame = frames.pop();
    if (!frame) return false;

    if (frame.kind === "leave") {
      seen.delete(frame.variable);
    } else {
      checkedNodes += 1;
      if (
        checkedNodes > MAX_BOOLEAN_EVIDENCE_NODES ||
        !checkBooleanFrame(frame, frames, seen, hasUnresolvedBooleanWrite)
      )
        return false;
    }
  }

  return true;
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
    // Without an explicit globals declaration, references to the built-in live
    // in the global scope's `through` list. Scan it once so a direct assignment
    // cannot turn every later `Boolean(…)` guard into a no-op.
    const hasUnresolvedBooleanWrite =
      sourceCode.scopeManager?.globalScope?.through.some(
        (reference) =>
          reference.identifier.name === "Boolean" && reference.isWrite(),
      ) ?? false;

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

        const isSafeBooleanUsage = checkBooleanValidity(
          left,
          scope,
          hasUnresolvedBooleanWrite,
        );
        if (isSafeBooleanUsage) return;

        // Report the error and fix it
        context.report({
          node,
          messageId: "booleanConversion",
          fix(fixer) {
            const text = sourceCode.getText(left);

            // `!!` does not depend on a mutable name, so it remains a safe fix
            // when this file shadows or writes to the global Boolean.
            if (isUnsafeBoolean(scope, hasUnresolvedBooleanWrite))
              return fixer.replaceText(left, `!!(${text})`);

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
