import { useState, useEffect, useCallback, useRef } from "react";

/**
 * TravelDirectory — the published Zimbabwe travel business directory.
 *
 * Reads the Nyuchi API's public travel endpoints only. They return listed
 * businesses (verified, active) without owner ids. No keys and no database
 * access in the browser:
 *
 *   GET https://api.nyuchi.com/v1/travel/businesses?type=…&search=…&limit=…&offset=…
 *
 * Businesses create and manage their listing on Mukoko Kweli (which writes
 * /v1/travel/businesses); the Nyuchi console reviews and verifies it; this
 * page publishes it. Every listing links back to Kweli:
 *
 *   https://kweli.mukoko.com/en/verify?place=<placeId>&business=<id>&source=zti
 *
 * Usage:
 *   import { TravelDirectory } from "/snippets/TravelDirectory.jsx"
 *   <TravelDirectory />
 *   <TravelDirectory types={["accommodation"]} />
 *
 * Props: `type` (initial establishment type), `types` (types on offer;
 * defaults to every travel type), `showFilters`, `pageSize`.
 */
export const TravelDirectory = ({
  type: initialType = "",
  types: allowedTypes = null,
  showFilters = true,
  pageSize = 24,
}) => {
  // Constants live inside the component: Mintlify evaluates only the
  // component body, so module-level values are not available at runtime.
  const API_URL = "https://api.nyuchi.com/v1";
  const KWELI_URL = "https://kweli.mukoko.com";

  // GET /v1/travel/meta/categories, with British labels.
  const TRAVEL_TYPES = [
    { id: "accommodation", label: "Places to stay" },
    { id: "tour_operator", label: "Tour operators" },
    { id: "safari_guide", label: "Safari guides" },
    { id: "travel_agency", label: "Travel agencies" },
    { id: "adventure", label: "Adventure" },
    { id: "cultural", label: "Culture & heritage" },
    { id: "dining", label: "Dining" },
    { id: "transport", label: "Transport" },
  ];

  const typeOptions = allowedTypes
    ? TRAVEL_TYPES.filter((t) => allowedTypes.includes(t.id))
    : TRAVEL_TYPES;
  const typeLabel = Object.fromEntries(
    TRAVEL_TYPES.map((t) => [t.id, t.label]),
  );

  const kweliManageUrl = (b) => {
    const params = new URLSearchParams();
    if (b.placeId) params.set("place", b.placeId);
    params.set("business", b._id);
    params.set("source", "zti");
    return `${KWELI_URL}/en/verify?${params.toString()}`;
  };
  const kweliListUrl = `${KWELI_URL}/en/verify?source=zti`;

  const [typeId, setTypeId] = useState(
    typeOptions.some((t) => t.id === initialType)
      ? initialType
      : typeOptions.length === 1
        ? typeOptions[0].id
        : "",
  );
  const [area, setArea] = useState("");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);
  const requestSeq = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  // With several types on offer and none chosen, the API's default pool is
  // every travel type; a page that offers a subset asks for each in turn.
  const buildUrl = useCallback(
    (fromOffset, oneType) => {
      const params = new URLSearchParams();
      params.set("limit", String(pageSize));
      params.set("offset", String(fromOffset));
      if (oneType) params.set("type", oneType);
      if (debouncedQuery.length >= 2) params.set("search", debouncedQuery);
      return `${API_URL}/travel/businesses?${params.toString()}`;
    },
    [debouncedQuery, pageSize],
  );

  const typesToFetch = typeId
    ? [typeId]
    : allowedTypes
      ? typeOptions.map((t) => t.id)
      : [null];
  const typesKey = typesToFetch.join(",");

  const fetchPage = useCallback(
    async (fromOffset) => {
      const responses = await Promise.all(
        typesKey.split(",").map(async (t) => {
          const res = await fetch(buildUrl(fromOffset, t || null));
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        }),
      );
      const docs = responses.flatMap((r) =>
        Array.isArray(r?.businesses) ? r.businesses : [],
      );
      const count = responses.reduce(
        (n, r) => n + (typeof r?.total === "number" ? r.total : 0),
        0,
      );
      return { docs, count };
    },
    [buildUrl, typesKey],
  );

  const load = useCallback(async () => {
    const seq = ++requestSeq.current;
    setLoading(true);
    setError(null);
    setOpenId(null);
    try {
      const { docs, count } = await fetchPage(0);
      if (seq !== requestSeq.current) return;
      setItems(docs);
      setTotal(count);
      setHasMore(docs.length < count);
    } catch {
      if (seq === requestSeq.current) {
        setError("We couldn't load the directory. Please try again.");
        setItems([]);
      }
    } finally {
      if (seq === requestSeq.current) setLoading(false);
    }
  }, [fetchPage]);

  const loadMore = async () => {
    const seq = requestSeq.current;
    setLoadingMore(true);
    try {
      const { docs } = await fetchPage(items.length);
      if (seq !== requestSeq.current) return;
      const seen = new Set(items.map((b) => b._id));
      const fresh = docs.filter((b) => !seen.has(b._id));
      setItems(items.concat(fresh));
      setHasMore(
        fresh.length > 0 && items.length + fresh.length < (total || 0),
      );
    } catch {
      setError("We couldn't load more listings. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    load();
  }, [load]);

  const areaOf = (b) => {
    const a = b.address || {};
    return a.addressLocality || a.city || a.addressRegion || a.region || "";
  };
  const areas = Array.from(new Set(items.map(areaOf).filter(Boolean))).sort(
    (a, b) => a.localeCompare(b, "en-GB"),
  );
  const shown = area ? items.filter((b) => areaOf(b) === area) : items;

  const addressLine = (b) => {
    const a = b.address || {};
    return [
      a.streetAddress || a.street,
      a.addressLocality || a.city,
      a.addressRegion || a.region,
    ]
      .filter(Boolean)
      .join(", ");
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

  const asList = (v) => (Array.isArray(v) ? v.filter(Boolean).join(", ") : "");

  const filtersActive = Boolean(
    debouncedQuery || area || (typeId && typeOptions.length > 1),
  );
  const clearFilters = () => {
    setQuery("");
    setDebouncedQuery("");
    setArea("");
    if (typeOptions.length > 1) setTypeId("");
  };

  const inputClass =
    "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary";
  const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300";

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
            <label htmlFor="zti-dir-q" className={labelClass}>
              Search by name
            </label>
            <input
              id="zti-dir-q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. lodge, safari, Victoria Falls"
              autoComplete="off"
              className={inputClass}
            />
          </div>
          {typeOptions.length > 1 && (
            <div className="flex flex-col gap-1">
              <label htmlFor="zti-dir-type" className={labelClass}>
                Type of business
              </label>
              <select
                id="zti-dir-type"
                value={typeId}
                onChange={(e) => setTypeId(e.target.value)}
                className={inputClass}
              >
                <option value="">All types</option>
                {typeOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {areas.length > 1 && (
            <div className="flex flex-col gap-1">
              <label htmlFor="zti-dir-area" className={labelClass}>
                Town or region
              </label>
              <select
                id="zti-dir-area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className={inputClass}
              >
                <option value="">Everywhere</option>
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a}
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
            : area
              ? `${shown.length} listing${shown.length === 1 ? "" : "s"} in ${area}`
              : total !== null
                ? `${total.toLocaleString("en-GB")} listing${total === 1 ? "" : "s"}`
                : ""}
      </p>

      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
        >
          <p className="m-0 text-sm font-medium text-red-700 dark:text-red-300">
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
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800 h-28"
            />
          ))}
        </div>
      ) : !error && shown.length === 0 ? (
        filtersActive ? (
          <div className="text-center py-10 px-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <p className="m-0 font-medium text-gray-700 dark:text-gray-300">
              No listings match your search.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 text-sm font-medium text-primary underline hover:no-underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-xl border border-primary/30 bg-primary/5">
            <h3 className="m-0 text-lg font-semibold text-gray-900 dark:text-white">
              Be the first to list your business
            </h3>
            <p className="mt-2 mb-0 text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              Run a lodge, tour company, restaurant or other travel business in
              Zimbabwe? Create your listing on Mukoko Kweli. Once it has been
              reviewed, it appears here. Listing is free, and verification is
              never a payment.
            </p>
            <a
              href={kweliListUrl}
              className="inline-flex mt-5 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90"
            >
              List your business on Kweli
            </a>
          </div>
        )
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0 m-0">
          {shown.map((b) => {
            const isOpen = openId === b._id;
            const detailId = `zti-dir-detail-${b._id}`;
            const where = addressLine(b);
            const website = b.url ? safeUrl(b.url) : null;
            const logo = b.logo ? safeUrl(b.logo) : null;
            const payment = asList(b.paymentAccepted);
            const currencies = asList(b.currenciesAccepted);
            return (
              <li
                key={b._id}
                className="m-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
              >
                <div className="flex items-start gap-3">
                  {logo && (
                    <img
                      src={logo}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      loading="lazy"
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="m-0 text-base font-semibold text-gray-900 dark:text-white">
                      {b.name}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {typeLabel[b.establishmentType] || "Travel business"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        Verified
                      </span>
                      {b.priceRange && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {b.priceRange}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {where && (
                  <p className="mt-2 mb-0 text-sm text-gray-600 dark:text-gray-400">
                    {where}
                  </p>
                )}
                {b.description && (
                  <p className="mt-2 mb-0 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {b.description}
                  </p>
                )}
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={detailId}
                  onClick={() => setOpenId(isOpen ? null : b._id)}
                  className="mt-3 text-sm font-medium text-primary underline hover:no-underline"
                >
                  {isOpen ? "Hide details" : "Details"}
                  <span className="sr-only"> for {b.name}</span>
                </button>
                {isOpen && (
                  <div
                    id={detailId}
                    className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {b.telephone && (
                      <p className="m-0">
                        Phone:{" "}
                        <a
                          href={`tel:${b.telephone}`}
                          className="text-primary underline"
                        >
                          {b.telephone}
                        </a>
                      </p>
                    )}
                    {b.email && (
                      <p className="m-0">
                        Email:{" "}
                        <a
                          href={`mailto:${b.email}`}
                          className="text-primary underline"
                        >
                          {b.email}
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
                    {currencies && (
                      <p className="m-0">Currencies accepted: {currencies}</p>
                    )}
                    {payment && <p className="m-0">Payment: {payment}</p>}
                    {!b.telephone &&
                      !b.email &&
                      !website &&
                      !currencies &&
                      !payment && (
                        <p className="m-0 text-gray-500 dark:text-gray-400">
                          No contact details listed yet.
                        </p>
                      )}
                  </div>
                )}
                <p className="mt-3 mb-0 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
                  Is this your business?{" "}
                  <a
                    href={kweliManageUrl(b)}
                    className="font-medium text-primary underline hover:no-underline"
                  >
                    Claim or manage it on Kweli
                    <span className="sr-only"> ({b.name})</span>
                  </a>
                </p>
              </li>
            );
          })}
        </ul>
      )}

      {!loading && !error && hasMore && !area && (
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

      {!loading && shown.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <p className="m-0 text-sm text-gray-700 dark:text-gray-300">
            Businesses manage their own listings on Mukoko Kweli, and listings
            are reviewed before they appear here.
          </p>
          <a
            href={kweliListUrl}
            className="inline-flex justify-center px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium whitespace-nowrap hover:opacity-90"
          >
            List your business
          </a>
        </div>
      )}
    </div>
  );
};
