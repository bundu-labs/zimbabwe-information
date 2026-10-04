/**
 * ExpertDirectory — the public directory of local experts and guides.
 *
 * Reads the Nyuchi API's public expert directory only. No keys and no
 * database access in the browser:
 *
 *   GET https://api.nyuchi.com/v1/applications/experts/directory
 *       ?category=…&limit=…&offset=…
 *   -> { experts: [{ id, name, category, location, yearsExperience,
 *        languages, services, bio, website, listedAt }],
 *        total, limit, offset }
 *
 * It lists expert applications that the Nyuchi console approved AND whose
 * applicant ticked "List me in the public expert directory" on the form
 * (snippets/ApplicationForm.jsx). Contact details are never public; travellers
 * reach an expert through us (/contact) or the expert's own website.
 *
 * Until the route is live in production (nyuchi/api-gateway#194) the API
 * answers 401/404, and the directory says it opens soon.
 *
 *   import { ExpertDirectory } from "/snippets/ExpertDirectory.jsx"
 *   <ExpertDirectory />
 *   <ExpertDirectory category="safari_guide" showFilters={false} />
 *
 * Everything lives inside the one export: Mintlify keeps only a snippet's
 * exports and allows no package imports (the React hooks are globals).
 */
export const ExpertDirectory = ({
  showFilters = true,
  category: initialCategory = "",
  pageSize = 24,
}) => {
  const API_URL = "https://api.nyuchi.com/v1";
  // Before the release reaches production, `/experts/directory` is read as
  // an application id and needs a sign-in (401), or is not routed at all.
  const NOT_LIVE = [401, 404, 405, 501];
  const APPLY_URL = "/get-involved/local-expert-connections";

  // The same values and labels as the expert application form.
  const CATEGORIES = [
    ["safari_guide", "Safari guide"],
    ["bird_guide", "Birding specialist"],
    ["walking_safari", "Walking safari guide"],
    ["photography_guide", "Photography guide"],
    ["cultural_expert", "Cultural and heritage expert"],
    ["adventure_guide", "Adventure activity guide"],
    ["hiking_guide", "Hiking and trekking guide"],
    ["fishing_guide", "Fishing guide"],
    ["city_guide", "City guide"],
    ["food_culinary", "Food and culinary expert"],
    ["art_crafts", "Arts and crafts specialist"],
    ["historical", "Historical guide"],
    ["other", "Other"],
  ];
  const categoryLabel = Object.fromEntries(CATEGORIES);
  const labelFor = (c) =>
    categoryLabel[c] || (c ? String(c).replace(/_/g, " ") : "Local expert");

  // Only http(s) links are shown; anything else is dropped.
  const safeUrl = (u) => {
    try {
      const url = new URL(String(u));
      return url.protocol === "https:" || url.protocol === "http:"
        ? url.href
        : null;
    } catch {
      return null;
    }
  };

  const [categoryId, setCategoryId] = useState(
    categoryLabel[initialCategory] ? initialCategory : "",
  );
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [state, setState] = useState("loading"); // loading | ready | soon | error
  const [loadingMore, setLoadingMore] = useState(false);
  const [moreError, setMoreError] = useState("");
  const [openId, setOpenId] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const requestSeq = useRef(0);

  const fetchPage = async (fromOffset) => {
    const params = new URLSearchParams();
    params.set("limit", String(pageSize));
    params.set("offset", String(fromOffset));
    if (categoryId) params.set("category", categoryId);
    const res = await fetch(
      `${API_URL}/applications/experts/directory?${params.toString()}`,
    );
    if (NOT_LIVE.includes(res.status)) return { soon: true };
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    return {
      experts: Array.isArray(body?.experts) ? body.experts : [],
      total: typeof body?.total === "number" ? body.total : 0,
    };
  };

  useEffect(() => {
    const seq = ++requestSeq.current;
    setState("loading");
    setMoreError("");
    setOpenId(null);
    fetchPage(0)
      .then((page) => {
        if (seq !== requestSeq.current) return;
        if (page.soon) {
          setItems([]);
          setTotal(0);
          setState("soon");
          return;
        }
        setItems(page.experts);
        setTotal(page.total);
        setState("ready");
      })
      .catch(() => {
        if (seq === requestSeq.current) setState("error");
      });
  }, [categoryId, pageSize, attempt]);

  const loadMore = async () => {
    const seq = requestSeq.current;
    setLoadingMore(true);
    setMoreError("");
    try {
      const page = await fetchPage(items.length);
      if (seq !== requestSeq.current || page.soon) return;
      setItems((prev) => prev.concat(page.experts));
      setTotal(page.total);
    } catch {
      if (seq === requestSeq.current)
        setMoreError("We could not load more experts. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  // The search box narrows what is already loaded.
  const q = query.trim().toLowerCase();
  const shown = q
    ? items.filter((e) =>
        [
          e.name,
          e.location,
          e.languages,
          e.services,
          e.bio,
          labelFor(e.category),
        ].some((v) => v && String(v).toLowerCase().includes(q)),
      )
    : items;

  const box =
    "not-prose rounded-xl border border-gray-200 dark:border-gray-700 p-6";
  const inputClass =
    "px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600";
  const applyLink = (text) => (
    <a
      href={APPLY_URL}
      className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90"
      style={{ backgroundColor: "#0A7A60" }}
    >
      {text}
    </a>
  );

  const filters = showFilters ? (
    <div className="flex flex-wrap gap-3">
      <label className="sr-only" htmlFor="expert-directory-search">
        Search experts
      </label>
      <input
        id="expert-directory-search"
        type="search"
        placeholder="Search by name, place, language…"
        value={query}
        maxLength={100}
        onChange={(e) => setQuery(e.target.value)}
        className={`flex-1 min-w-[200px] ${inputClass}`}
      />
      <label className="sr-only" htmlFor="expert-directory-category">
        Expertise
      </label>
      <select
        id="expert-directory-category"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className={inputClass}
      >
        <option value="">All expertise</option>
        {CATEGORIES.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  ) : null;

  let body;
  if (state === "loading") {
    body = (
      <div role="status" aria-live="polite">
        <span className="sr-only">Loading experts…</span>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-28"
            />
          ))}
        </div>
      </div>
    );
  } else if (state === "error") {
    body = (
      <div className={box} role="alert">
        <p className="text-sm text-gray-800 dark:text-gray-200">
          We could not load the expert directory just now.
        </p>
        <button
          type="button"
          onClick={() => setAttempt((n) => n + 1)}
          className="mt-3 text-sm font-medium underline hover:no-underline text-gray-900 dark:text-white"
        >
          Try again
        </button>
      </div>
    );
  } else if (state === "soon") {
    body = (
      <div className={box} role="status">
        <p className="font-medium text-gray-900 dark:text-white">
          The expert directory opens soon.
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Guides and specialists can apply now and choose to be listed here once
          approved.
        </p>
        {applyLink("Apply to be listed")}
      </div>
    );
  } else if (items.length === 0) {
    body = (
      <div className={box}>
        <p className="font-medium text-gray-900 dark:text-white">
          {categoryId
            ? `No ${labelFor(categoryId).toLowerCase()}s are listed yet.`
            : "No experts are listed yet."}
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Are you a guide, cultural specialist or Zimbabwe expert? Apply, and
          choose to be listed in this directory once we approve you.
        </p>
        {categoryId ? (
          <button
            type="button"
            onClick={() => setCategoryId("")}
            className="mt-3 mr-4 text-sm font-medium underline hover:no-underline text-gray-900 dark:text-white"
          >
            Show all expertise
          </button>
        ) : null}
        {applyLink("Apply to be listed")}
      </div>
    );
  } else {
    body = (
      <div className="space-y-4">
        <p
          className="text-sm text-gray-600 dark:text-gray-400"
          aria-live="polite"
        >
          {q
            ? `${shown.length} of ${items.length} loaded experts match “${query.trim()}”`
            : `${total} expert${total === 1 ? "" : "s"} listed`}
        </p>
        {shown.length === 0 ? (
          <div className={box}>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              No experts match your search.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-3 text-sm font-medium underline hover:no-underline text-gray-900 dark:text-white"
            >
              Clear the search
            </button>
          </div>
        ) : (
          <ul className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0">
            {shown.map((e) => {
              const open = openId === e.id;
              const website = safeUrl(e.website);
              const detailsId = `expert-${e.id}-details`;
              return (
                <li
                  key={e.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {e.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200">
                      {labelFor(e.category)}
                    </span>
                    {e.location ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {e.location}
                      </span>
                    ) : null}
                    {e.yearsExperience ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {e.yearsExperience} years
                      </span>
                    ) : null}
                  </div>
                  {e.bio ? (
                    <p
                      className={`mt-3 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line ${open ? "" : "line-clamp-3"}`}
                    >
                      {e.bio}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={detailsId}
                    onClick={() => setOpenId(open ? null : e.id)}
                    className="mt-3 text-sm font-medium underline hover:no-underline text-emerald-800 dark:text-emerald-300"
                  >
                    {open ? "Show less" : "More about " + e.name}
                  </button>
                  {open ? (
                    <div id={detailsId} className="mt-3 space-y-3 text-sm">
                      {e.languages ? (
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Languages:</span>{" "}
                          {e.languages}
                        </p>
                      ) : null}
                      {e.services ? (
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                          <span className="font-medium">Services:</span>{" "}
                          {e.services}
                        </p>
                      ) : null}
                      <div className="flex flex-wrap gap-3 pt-1">
                        {website ? (
                          <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="underline text-gray-900 dark:text-white"
                          >
                            Website
                          </a>
                        ) : null}
                        <a
                          href="/contact"
                          className="underline text-gray-900 dark:text-white"
                        >
                          Ask us to put you in touch
                        </a>
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
        {items.length < total ? (
          <div className="text-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white disabled:opacity-50"
            >
              {loadingMore ? "Loading…" : "Show more experts"}
            </button>
            {moreError ? (
              <p
                className="mt-2 text-sm text-red-700 dark:text-red-400"
                role="alert"
              >
                {moreError}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filters}
      {body}
    </div>
  );
};
