import { useState, useEffect, useCallback, useRef } from "react";

/**
 * TravelDirectory — the published Zimbabwe travel directory.
 *
 * Reads the Nyuchi API's public places endpoints only (listed places,
 * `isActive: true`). No keys and no database access in the browser:
 *
 *   GET https://api.nyuchi.com/v1/places?country_id=…&province_id=…&category=…&q=…
 *   GET https://api.nyuchi.com/v1/places/regions?country=ZW
 *
 * Businesses manage their own listing on Mukoko Kweli; the Nyuchi console
 * reviews and verifies it; this page publishes it. Every listing links
 * to Kweli's claim flow, deep-linked by place id:
 *
 *   https://kweli.mukoko.com/en/verify?place=<placeId>&source=zti
 *
 * Usage:
 *   import { TravelDirectory } from "/snippets/TravelDirectory.jsx"
 *   <TravelDirectory />
 *   <TravelDirectory category="hotels" />
 *   <TravelDirectory categories={["hotels", "restaurants"]} />
 *
 * Props: `category` (initial categorySlug), `categories` (slugs on
 * offer; defaults to every travel category), `showFilters`, `pageSize`.
 */
export const TravelDirectory = ({
  category: initialCategory = "",
  categories: allowedSlugs = null,
  showFilters = true,
  pageSize = 24,
}) => {
  // Constants live inside the component: Mintlify evaluates only the
  // component body, so module-level values are not available at runtime.
  const API_URL = "https://api.nyuchi.com/v1";
  const KWELI_URL = "https://kweli.mukoko.com";
  const COUNTRY_ISO = "ZW";
  // Fallback when /v1/places/regions is not reachable yet: Zimbabwe's
  // id in the places geography (places.placesGeo).
  const ZIMBABWE_COUNTRY_ID = "019f07da-e0f1-7bfe-a086-cc1c219ace76";

  // Travel-relevant categories (places.categories), keyed by categorySlug.
  const TRAVEL_CATEGORIES = [
    {
      slug: "hotels",
      id: "019f47ca-dc03-7f6c-8c1a-8389e8ba045f",
      label: "Places to stay",
    },
    {
      slug: "tour-operators",
      id: "019f47ca-dc03-759e-bc47-e609dc421c90",
      label: "Travel & tours",
    },
    {
      slug: "restaurants",
      id: "019f47ca-dc03-7b18-8901-2a001690bb3b",
      label: "Restaurants",
    },
    {
      slug: "cafes",
      id: "019f47ca-dc03-7db6-b691-f749bf194476",
      label: "Cafés & coffee",
    },
    {
      slug: "bars",
      id: "019f47ca-dc03-7978-bb9e-568ee3d091d5",
      label: "Bars & pubs",
    },
    {
      slug: "national-parks",
      id: "019f47ca-dc03-7f5a-a439-c16c7aee1562",
      label: "Parks & reserves",
    },
    {
      slug: "nature",
      id: "019f47ca-dc03-7484-8637-8ab43b97ed21",
      label: "Nature & outdoors",
    },
    {
      slug: "landmarks",
      id: "019f47ca-dc03-7908-870c-228fde902f51",
      label: "Landmarks & attractions",
    },
    {
      slug: "museums",
      id: "019f47ca-dc03-79be-8c3a-4875251b7730",
      label: "Museums & galleries",
    },
    {
      slug: "entertainment",
      id: "019f47ca-dc03-7aec-afc6-9879d7842d61",
      label: "Entertainment & leisure",
    },
    {
      slug: "shopping",
      id: "019f47ca-dc03-7740-9e70-5fd599cb311f",
      label: "Shopping",
    },
  ];

  const TIERS = {
    0: null,
    1: { label: "Community verified", mineral: "Terracotta" },
    2: { label: "Verified by phone", mineral: "Cobalt" },
    3: { label: "Government verified", mineral: "Gold" },
    4: { label: "Licensed", mineral: "Tanzanite" },
  };

  const categoryOptions = allowedSlugs
    ? TRAVEL_CATEGORIES.filter((c) => allowedSlugs.includes(c.slug))
    : TRAVEL_CATEGORIES;
  const categoryById = Object.fromEntries(
    TRAVEL_CATEGORIES.map((c) => [c.id, c]),
  );

  const kweliClaimUrl = (placeId) =>
    `${KWELI_URL}/en/verify?place=${encodeURIComponent(placeId)}&source=zti`;
  const kweliListUrl = `${KWELI_URL}/en/verify?source=zti`;

  const [countryId, setCountryId] = useState(null);
  const [regions, setRegions] = useState([]);
  // The API filters one category at a time, so a category is always
  // chosen: the one asked for, else the first on offer.
  const [categorySlug, setCategorySlug] = useState(
    categoryOptions.some((c) => c.slug === initialCategory)
      ? initialCategory
      : categoryOptions[0]?.slug || "hotels",
  );
  const [regionId, setRegionId] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [total, setTotal] = useState(null);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);
  const requestSeq = useRef(0);

  // Country + regions. A failure only hides the region filter.
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/places/regions?country=${COUNTRY_ISO}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((body) => {
        if (cancelled) return;
        setCountryId(body?.country?.id || ZIMBABWE_COUNTRY_ID);
        setRegions(Array.isArray(body?.regions) ? body.regions : []);
      })
      .catch(() => {
        if (!cancelled) setCountryId(ZIMBABWE_COUNTRY_ID);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  const buildUrl = useCallback(
    (fromOffset) => {
      const params = new URLSearchParams();
      params.set("country_id", countryId);
      params.set("limit", String(pageSize));
      params.set("offset", String(fromOffset));
      const cat = TRAVEL_CATEGORIES.find((c) => c.slug === categorySlug);
      if (cat) params.set("category", cat.id);
      if (regionId) params.set("province_id", regionId);
      if (debouncedQuery.length >= 2) params.set("q", debouncedQuery);
      return `${API_URL}/places?${params.toString()}`;
    },
    [countryId, categorySlug, regionId, debouncedQuery, pageSize],
  );

  const load = useCallback(async () => {
    if (!countryId) return;
    const seq = ++requestSeq.current;
    setLoading(true);
    setError(null);
    setOpenId(null);
    try {
      const res = await fetch(buildUrl(0));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      if (seq !== requestSeq.current) return;
      const docs = Array.isArray(body?.data) ? body.data : [];
      setPlaces(docs);
      setTotal(typeof body?.total === "number" ? body.total : null);
      setOffset(docs.length);
      setHasMore(docs.length === pageSize);
    } catch {
      if (seq === requestSeq.current) {
        setError("We couldn't load the directory. Please try again.");
        setPlaces([]);
      }
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  }, [countryId, buildUrl, pageSize]);

  const loadMore = async () => {
    const seq = requestSeq.current;
    setLoadingMore(true);
    try {
      const res = await fetch(buildUrl(offset));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      if (seq !== requestSeq.current) return;
      const docs = Array.isArray(body?.data) ? body.data : [];
      setPlaces((prev) => prev.concat(docs));
      setOffset((o) => o + docs.length);
      setHasMore(docs.length === pageSize);
    } catch {
      setError("We couldn't load more listings. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    load();
  }, [load]);

  const regionName = (id) => regions.find((r) => r.id === id)?.name || null;

  const addressLine = (p) => {
    const a = p.address || {};
    const street = [a.houseNumber, a.street].filter(Boolean).join(" ");
    const parts = [street, a.city, regionName(p.hierarchy?.provinceId)];
    return parts.filter(Boolean).join(", ");
  };

  const mapUrl = (p) => {
    const c = p.geo?.coordinates;
    if (!Array.isArray(c) || c.length < 2) return null;
    const [lng, lat] = c;
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
  };

  const safeUrl = (u) => {
    try {
      const parsed = new URL(u);
      return parsed.protocol === "https:" || parsed.protocol === "http:"
        ? parsed.href
        : null;
    } catch {
      return null;
    }
  };

  const filtersActive = Boolean(regionId || debouncedQuery);
  const clearFilters = () => {
    setQuery("");
    setDebouncedQuery("");
    setRegionId("");
  };

  const inputClass =
    "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="not-prose space-y-5">
      {showFilters && (
        <form
          role="search"
          aria-label="Search the travel directory"
          onSubmit={(e) => e.preventDefault()}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <div className="flex flex-col gap-1 sm:col-span-3">
            <label
              htmlFor="zti-dir-q"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Search by name
            </label>
            <input
              id="zti-dir-q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Victoria Falls, lodge, safari"
              autoComplete="off"
              className={inputClass}
            />
          </div>
          {categoryOptions.length > 1 && (
            <div className="flex flex-col gap-1">
              <label
                htmlFor="zti-dir-cat"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Category
              </label>
              <select
                id="zti-dir-cat"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className={inputClass}
              >
                {categoryOptions.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {regions.length > 0 && (
            <div className="flex flex-col gap-1">
              <label
                htmlFor="zti-dir-region"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Province
              </label>
              <select
                id="zti-dir-region"
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className={inputClass}
              >
                <option value="">All of Zimbabwe</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form>
      )}

      <p
        className="text-sm text-gray-500 dark:text-gray-400"
        aria-live="polite"
      >
        {loading
          ? "Loading listings…"
          : error
            ? ""
            : total !== null
              ? `${total.toLocaleString("en-GB")} listing${total === 1 ? "" : "s"}`
              : `Showing ${places.length} listing${places.length === 1 ? "" : "s"}`}
      </p>

      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
        >
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            {error}
          </p>
          <button
            type="button"
            onClick={load}
            className="mt-2 text-sm font-medium text-red-700 dark:text-red-300 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {loading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          aria-hidden="true"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800 h-28"
            />
          ))}
        </div>
      ) : !error && places.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="font-medium text-gray-700 dark:text-gray-300">
            {filtersActive
              ? "No listings match your search."
              : "No listings in this category yet."}
          </p>
          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 text-sm font-medium text-primary underline hover:no-underline"
            >
              Clear filters
            </button>
          )}
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Run a travel business in Zimbabwe?{" "}
            <a
              href={kweliListUrl}
              className="font-medium text-primary underline hover:no-underline"
            >
              List your business on Mukoko Kweli
            </a>
            .
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0 m-0">
          {places.map((p) => {
            const cat = categoryById[p.primaryCategoryId];
            const tier = TIERS[p.bundu?.verificationTier || 0];
            const isOpen = openId === p._id;
            const detailId = `zti-dir-detail-${p._id}`;
            const where = addressLine(p);
            const website = p.url ? safeUrl(p.url) : null;
            const map = mapUrl(p);
            return (
              <li
                key={p._id}
                className="m-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
              >
                <h3 className="m-0 text-base font-semibold text-gray-900 dark:text-white">
                  {p.name}
                </h3>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {cat && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {cat.label}
                    </span>
                  )}
                  {tier && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                      title={`${tier.mineral} tier on the Mukoko verification ladder`}
                    >
                      {tier.label}
                    </span>
                  )}
                </div>
                {where && (
                  <p className="mt-2 mb-0 text-sm text-gray-600 dark:text-gray-400">
                    {where}
                  </p>
                )}
                {p.description && (
                  <p className="mt-2 mb-0 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {p.description}
                  </p>
                )}
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={detailId}
                  onClick={() => setOpenId(isOpen ? null : p._id)}
                  className="mt-3 text-sm font-medium text-primary underline hover:no-underline"
                >
                  {isOpen ? "Hide details" : "Details"}
                  <span className="sr-only"> for {p.name}</span>
                </button>
                {isOpen && (
                  <div
                    id={detailId}
                    className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {p.telephone && (
                      <p className="m-0">
                        Phone:{" "}
                        <a
                          href={`tel:${p.telephone}`}
                          className="text-primary underline"
                        >
                          {p.telephone}
                        </a>
                      </p>
                    )}
                    {website && (
                      <p className="m-0">
                        <a
                          href={website}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="text-primary underline"
                        >
                          Website
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </p>
                    )}
                    {map && (
                      <p className="m-0">
                        <a
                          href={map}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          View on the map
                          <span className="sr-only">
                            {" "}
                            (OpenStreetMap, opens in a new tab)
                          </span>
                        </a>
                      </p>
                    )}
                    {!tier && (
                      <p className="m-0 text-gray-500 dark:text-gray-400">
                        Not yet verified. Details come from open map data and
                        may be out of date.
                      </p>
                    )}
                  </div>
                )}
                <p className="mt-3 mb-0 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                  Is this your business?{" "}
                  <a
                    href={kweliClaimUrl(p._id)}
                    className="font-medium text-primary underline hover:no-underline"
                  >
                    Claim or manage it on Kweli
                    <span className="sr-only"> ({p.name})</span>
                  </a>
                </p>
              </li>
            );
          })}
        </ul>
      )}

      {!loading && !error && hasMore && (
        <div className="text-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60"
          >
            {loadingMore ? "Loading…" : "Show more"}
          </button>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <p className="m-0 text-sm text-gray-700 dark:text-gray-300">
          Listings are managed by the businesses themselves on Mukoko Kweli and
          reviewed before they appear here.
        </p>
        <a
          href={kweliListUrl}
          className="inline-flex justify-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium whitespace-nowrap hover:opacity-90"
        >
          List your business
        </a>
      </div>
    </div>
  );
};
