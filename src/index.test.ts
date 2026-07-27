const { ESLint: ESLintApi } = require("eslint");

const safeJsx = require("./index");

// Loads the plugin through the real ESLint API, so a flat-config or plugin-API
// break shows up here instead of in someone else's project.
async function lint(code: string) {
  const eslint = new ESLintApi({
    overrideConfigFile: true,
    overrideConfig: [safeJsx.configs["flat/recommended"]],
    fix: true,
  });

  const [result] = await eslint.lintText(code, { filePath: "smoke.js" });
  return result;
}

describe("flat config", () => {
  it("exposes the plugin name and version", () => {
    expect(safeJsx.meta.name).toBe("eslint-plugin-safe-jsx");
    expect(safeJsx.meta.version).toEqual(expect.any(String));
  });

  it("reports and fixes an unsafe && with JSX", async () => {
    const result = await lint("const a = 0;\na && <div />;\n");

    expect(result.messages).toEqual([]);
    expect(result.output).toBe("const a = 0;\nBoolean(a) && <div />;\n");
  });

  it("leaves an already-boolean && alone", async () => {
    const result = await lint("const a = true;\na && <div />;\n");

    expect(result.messages).toEqual([]);
    expect(result.output).toBeUndefined();
  });
});
