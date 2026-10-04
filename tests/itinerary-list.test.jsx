// The itineraries snippet (snippets/ItineraryList.jsx) server-renders its
// loading state here; the contract it reads is checked against its source.
import { readFileSync } from "node:fs";
import { createElement, useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

// Mintlify provides the hooks as globals; snippets may not import "react".
Object.assign(globalThis, { useEffect, useRef, useState });
const { ItineraryList } = await import("../snippets/ItineraryList.jsx");

const source = readFileSync(
  new URL("../snippets/ItineraryList.jsx", import.meta.url),
  "utf8",
);

describe("ItineraryList", () => {
  it("starts in an announced loading state", () => {
    const html = renderToStaticMarkup(createElement(ItineraryList));
    expect(html).toContain('role="status"');
    expect(html).toContain("Loading itineraries");
  });

  it("reads published itineraries for the country from the Nyuchi API", () => {
    expect(source).toContain("https://api.nyuchi.com/v1");
    expect(source).toContain("/travel/itineraries?");
    expect(source).toContain('published: "true"');
  });

  it("treats a route that is not live yet as 'coming soon'", () => {
    expect(source).toMatch(/NOT_LIVE = \[404, 405, 501\]/);
    expect(source).toContain("Shared itineraries are coming soon");
    expect(source).toContain("No published Zimbabwe itineraries yet");
  });

  it("links businesses to the directory search", () => {
    expect(source).toContain("/directory/businesses?search=");
  });

  it("follows Mintlify's snippet rules", () => {
    expect(source).not.toMatch(/^import /m);
    expect(source.match(/^(?:export |const |let |var |function )/gm)).toEqual([
      "export ",
    ]);
  });
});
