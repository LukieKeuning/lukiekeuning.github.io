import { test } from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import ts from "typescript";
import { jsx } from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";

// Node strips types natively; this hook also supports the application's TSX and aliases.
const sourceRoot = fileURLToPath(new URL("../../src/", import.meta.url));
registerHooks({
  resolve(specifier, context, nextResolve) {
    let candidate: string | undefined;
    if (specifier.startsWith("@/"))
      candidate = path.join(sourceRoot, specifier.slice(2));
    else if (
      specifier.startsWith(".") &&
      context.parentURL?.startsWith("file:")
    )
      candidate = fileURLToPath(new URL(specifier, context.parentURL));
    if (candidate && !path.extname(candidate)) {
      for (const extension of [".ts", ".tsx"]) {
        if (existsSync(candidate + extension))
          return {
            url: pathToFileURL(candidate + extension).href,
            shortCircuit: true,
          };
      }
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.endsWith(".tsx"))
      return {
        format: "module",
        shortCircuit: true,
        source: ts.transpileModule(readFileSync(fileURLToPath(url), "utf8"), {
          compilerOptions: {
            jsx: ts.JsxEmit.ReactJSX,
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2022,
          },
        }).outputText,
      };
    return nextLoad(url, context);
  },
});

test("adding profile content renders the gallery, navigation, contact and CV without component changes", async () => {
  const { profile } = await import("../../src/data/profile.ts");
  const { Portfolio } = await import("../../src/components/portfolio.tsx");
  const { PreferencesProvider } =
    await import("../../src/context/preferences.tsx");
  const original = structuredClone(profile);
  try {
    profile.projects = [];
    profile.contact = { email: "", phone: "", linkedin: "" };
    profile.assets.cvFile = "";
    profile.education = [];
    profile.qualifications = [];
    const initial = renderToStaticMarkup(
      jsx(PreferencesProvider, {
        children: jsx(Portfolio, {}),
      }),
    );
    assert.ok(!initial.includes('id="projects"'));
    assert.ok(!initial.includes('id="contact"'));
    assert.ok(!initial.includes('id="education"'));
    profile.qualifications.push({
      id: "test-certificate",
      name: "Test certificate",
      date: "2026",
    });
    profile.projects.push({
      id: "test-study",
      title: "Teststudie",
      description: "",
      year: "2027",
      category: "Test",
      cover: "",
      images: [],
      tools: [],
      url: "",
    });
    profile.contact.email = "test@example.com";
    profile.assets.cvFile = "cv/test.pdf";
    const updated = renderToStaticMarkup(
      jsx(PreferencesProvider, {
        children: jsx(Portfolio, {}),
      }),
    );
    assert.ok(updated.includes('id="projects"'));
    assert.ok(updated.includes('href="#projects"'));
    assert.ok(updated.includes("Teststudie"));
    assert.ok(updated.includes('id="contact"'));
    assert.ok(updated.includes('id="education"'));
    assert.ok(updated.includes('href="#education"'));
    assert.ok(updated.includes("Test certificate"));
    assert.ok(updated.includes('href="mailto:test@example.com"'));
    assert.ok(updated.includes('href="/cv/test.pdf"'));
    assert.ok(!updated.includes('href=""'));
  } finally {
    Object.assign(profile, original);
  }
});
