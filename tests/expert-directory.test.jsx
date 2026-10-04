// The expert directory snippet (snippets/ExpertDirectory.jsx) server-renders
// its loading state here; the API contract it reads is checked against its
// source. No browser, no network.
import { readFileSync } from "node:fs";
import { createElement, useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

// Mintlify provides the hooks as globals; snippets may not import "react".
Object.assign(globalThis, { useEffect, useRef, useState });
const { ExpertDirectory } = await import("../snippets/ExpertDirectory.jsx");

const source = readFileSync(
  new URL("../snippets/ExpertDirectory.jsx", import.meta.url),
  "utf8",
);

describe("ExpertDirectory", () => {
  const html = renderToStaticMarkup(createElement(ExpertDirectory));

  it("starts in an announced loading state", () => {
    expect(html).toContain('role="status"');
    expect(html).toContain("Loading experts");
  });

  it("labels its search and expertise filters", () => {
    expect(html).toContain('for="expert-directory-search"');
    expect(html).toContain('for="expert-directory-category"');
  });

  it("hides the filters when asked", () => {
    const bare = renderToStaticMarkup(
      createElement(ExpertDirectory, { showFilters: false }),
    );
    expect(bare).not.toContain("expert-directory-search");
  });

  it("reads the public expert directory from the Nyuchi API", () => {
    expect(source).toContain("https://api.nyuchi.com/v1");
    expect(source).toContain("/applications/experts/directory?");
    expect(source).toContain("body?.experts");
  });

  it("no longer reads the retired Supabase project", () => {
    expect(source).not.toMatch(/supabase/i);
    expect(source).not.toMatch(/apikey|sb_publishable/i);
  });

  it("handles a route that is not live yet, an empty list and errors", () => {
    expect(source).toMatch(/NOT_LIVE = \[401, 404, 405, 501\]/);
    expect(source).toContain("The expert directory opens soon.");
    expect(source).toContain("No experts are listed yet.");
    expect(source).toContain(
      "We could not load the expert directory just now.",
    );
    expect(source).toContain("Try again");
  });

  it("pages with offset", () => {
    expect(source).toContain('params.set("offset"');
    expect(source).toContain("Show more experts");
  });

  it("follows Mintlify's snippet rules", () => {
    expect(source).not.toMatch(/^import /m);
    expect(source.match(/^(?:export |const |let |var |function )/gm)).toEqual([
      "export ",
    ]);
  });
});
