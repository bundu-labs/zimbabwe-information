// The travel directory snippet (snippets/TravelDirectory.jsx) server-renders
// its loading state here; the gateway contract it reads, including the Kweli
// places the gateway now merges in, is checked against its source.
import { readFileSync } from "node:fs";
import { createElement, useCallback, useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vite-plus/test";

// Mintlify provides the hooks as globals; snippets may not import "react".
Object.assign(globalThis, { useCallback, useEffect, useRef, useState });
const { TravelDirectory } = await import("../snippets/TravelDirectory.jsx");

const source = readFileSync(
  new URL("../snippets/TravelDirectory.jsx", import.meta.url),
  "utf8",
);

describe("TravelDirectory", () => {
  it("renders without importing react", () => {
    expect(source).not.toMatch(/from ["']react["']/);
    expect(() =>
      renderToStaticMarkup(createElement(TravelDirectory)),
    ).not.toThrow();
  });

  it("asks the gateway for Zimbabwe listings", () => {
    expect(source).toContain("/travel/businesses?");
    expect(source).toContain('params.set("country", "ZW")');
  });

  it("keys Kweli places, which have no establishment _id", () => {
    expect(source).toContain("b._id || b.placeId || b.slug || b.name");
    expect(source).toContain('if (b._id) params.set("business", b._id)');
  });

  it("shows the Kweli tier badge with its verify link", () => {
    expect(source).toContain("b.verification?.label");
    expect(source).toContain("kweliPlaceUrl(b.verification?.url)");
    expect(source).toContain("b.logo || b.image");
  });

  it("links each card to its Kweli place page", () => {
    expect(source).toMatch(/kweliPage = kweliPlaceUrl\(b\.kweliUrl\)/);
    expect(source).toMatch(/href=\{kweliPage\}/);
  });

  it("only links https URLs on the Kweli host", () => {
    expect(source).toMatch(
      /protocol === "https:" && hostname === new URL\(KWELI_URL\)\.hostname/,
    );
  });

  it("explains the empty state", () => {
    expect(source).toContain(
      "Verified listings appear here as businesses are checked on Kweli.",
    );
  });

  it("lists only verified places, whatever the feed sends", () => {
    expect(source).toContain("Number(b.verification.tier) >= 1");
    expect(source).toContain("setTotal(dropped > 0 ? null : count)");
    expect(source).toContain("fetchPage(rawOffset)");
  });
});
