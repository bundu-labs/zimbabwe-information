// The get-involved application forms (snippets/ApplicationForm.jsx) render
// on the server here: no browser, no network. They check the "opening soon"
// state (no Turnstile site key yet), that every control has a label, and
// that the privacy consent and API target are where the API expects them.
import { readFileSync } from "node:fs";
import { createElement, useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

// Mintlify provides the hooks as globals; snippets may not import "react".
Object.assign(globalThis, { useEffect, useRef, useState });
const { ApplicationForm } = await import("../snippets/ApplicationForm.jsx");

const source = readFileSync(
  new URL("../snippets/ApplicationForm.jsx", import.meta.url),
  "utf8",
);

const render = (kind) =>
  renderToStaticMarkup(createElement(ApplicationForm, { kind }));

const controlIds = (html) =>
  [...html.matchAll(/<(?:input|select|textarea)[^>]*\sid="([^"]+)"/g)].map(
    (m) => m[1],
  );

describe.each([
  ["businesses", "business_name"],
  ["experts", "full_name"],
])("%s form", (kind, firstField) => {
  const html = render(kind);

  it("is closed, saying so, until a Turnstile site key is set", () => {
    expect(html).toContain("Applications open soon");
    expect(html).toMatch(/<fieldset[^>]*disabled/);
    expect(html).toMatch(/<button[^>]*type="submit"[^>]*disabled/);
    expect(html).toContain("Opening soon");
  });

  it("labels every control", () => {
    const ids = controlIds(html);
    expect(ids.length).toBeGreaterThan(5);
    for (const id of ids) expect(html).toContain(`for="${id}"`);
  });

  it("asks for the fields the API requires, and privacy consent", () => {
    expect(html).toContain(`name="${firstField}"`);
    expect(html).toContain('name="email"');
    expect(html).toContain('name="privacy_consent"');
    expect(html).toContain('href="/privacy-policy"');
  });

  it("posts to its Nyuchi API endpoint", () => {
    expect(kind).toMatch(/^(businesses|experts)$/);
    expect(source).toContain("https://api.nyuchi.com/v1");
    expect(source).toContain("/applications/${kind}");
    expect(html).toContain(`apply-${kind}-title`);
  });
});

describe("Mintlify constraints", () => {
  it("imports nothing (Mintlify allows only local imports)", () => {
    expect(source).not.toMatch(/^import /m);
  });

  it("has one top-level declaration, the export (Mintlify keeps only exports)", () => {
    const topLevel = source.match(/^(?:export |const |let |var |function )/gm);
    expect(topLevel).toEqual(["export "]);
  });

  it("falls back to the business form for an unknown kind", () => {
    expect(render("nonsense")).toContain('name="business_name"');
  });
});

describe("no secrets in the snippet", () => {
  it("carries only the public Turnstile site key, never a secret", () => {
    expect(source).not.toMatch(/TURNSTILE_SECRET|secret\s*[:=]/i);
    expect(source).toContain('"CF-Turnstile-Response": token');
  });
});
