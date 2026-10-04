/**
 * ItineraryList — published Zimbabwe itineraries from the Iconic builder.
 *
 * Itineraries are built in the Iconic builder app. Those for Zimbabwe are
 * published through the Nyuchi API and shown here, day by day, with links to
 * the listed businesses and places they visit.
 *
 *   import { ItineraryList } from "/snippets/ItineraryList.jsx"
 *   <ItineraryList />
 *
 * Contract (nyuchi/api-gateway#199; public, safe fields only):
 *   GET https://api.nyuchi.com/v1/travel/itineraries?country=ZW&published=true
 *   -> { itineraries: [{
 *        id, slug?, name, description?, country, durationDays?, imageUrl?,
 *        days: [{ day, title?, activities: [{
 *          time?, name, description?,
 *          businessId?, businessName?, placeId?, placeName?, lat?, lng?,
 *        }] }]
 *      }], total? }
 * snake_case spellings of the same fields are accepted too. Until the route
 * is live (404/405/501) the list says itineraries are coming soon.
 *
 * Everything lives inside the one export: Mintlify keeps only a snippet's
 * exports and allows no package imports (the React hooks are globals).
 */
export const ItineraryList = ({ country = "ZW", limit = 12 }) => {
  const API_URL = "https://api.nyuchi.com/v1";
  const NOT_LIVE = [404, 405, 501];

  const pick = (obj, ...keys) => {
    for (const k of keys) {
      if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "")
        return obj[k];
    }
    return undefined;
  };

  // Normalise one itinerary from either spelling; drop anything unusable.
  const normalise = (raw) => {
    const id = pick(raw, "id", "_id");
    const name = pick(raw, "name", "title");
    if (!id || !name) return null;
    const rawDays = pick(raw, "days", "itinerary") || [];
    const days = (Array.isArray(rawDays) ? rawDays : [])
      .map((d, i) => ({
        day: Number(pick(d, "day", "dayNumber", "day_number")) || i + 1,
        title: pick(d, "title", "name"),
        activities: (pick(d, "activities", "items") || [])
          .map((a) => ({
            time: pick(a, "time", "startTime", "start_time"),
            name: pick(a, "name", "title"),
            description: pick(a, "description"),
            businessId: pick(a, "businessId", "business_id"),
            businessName: pick(a, "businessName", "business_name"),
            placeId: pick(a, "placeId", "place_id"),
            placeName: pick(a, "placeName", "place_name"),
            lat: Number(pick(a, "lat", "latitude")),
            lng: Number(pick(a, "lng", "longitude")),
          }))
          .filter((a) => a.name || a.businessName || a.placeName),
      }))
      .sort((a, b) => a.day - b.day);
    return {
      id: String(id),
      name: String(name),
      description: pick(raw, "description", "summary"),
      durationDays:
        Number(pick(raw, "durationDays", "duration_days")) ||
        days.length ||
        null,
      imageUrl: pick(raw, "imageUrl", "image_url"),
      days,
    };
  };

  const businessHref = (a) =>
    `/directory/businesses?search=${encodeURIComponent(a.businessName || a.name)}`;
  const mapHref = (a) =>
    `https://www.openstreetmap.org/?mlat=${a.lat}&mlon=${a.lng}#map=14/${a.lat}/${a.lng}`;

  const [state, setState] = useState("loading"); // loading | ready | soon | error
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    const params = new URLSearchParams({
      country,
      published: "true",
      limit: String(limit),
    });
    fetch(`${API_URL}/travel/itineraries?${params.toString()}`)
      .then(async (res) => {
        if (cancelled) return;
        if (NOT_LIVE.includes(res.status)) {
          setState("soon");
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        const list = Array.isArray(body?.itineraries)
          ? body.itineraries
          : Array.isArray(body)
            ? body
            : [];
        if (cancelled) return;
        setItems(list.map(normalise).filter(Boolean));
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [country, limit, attempt]);

  const box =
    "not-prose rounded-xl border border-gray-200 dark:border-gray-700 p-6";

  if (state === "loading") {
    return (
      <div className={box} role="status" aria-live="polite">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading itineraries…
        </p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className={box} role="alert">
        <p className="text-sm text-gray-800 dark:text-gray-200">
          We could not load itineraries just now.
        </p>
        <button
          type="button"
          onClick={() => setAttempt((n) => n + 1)}
          className="mt-3 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Try again
        </button>
      </div>
    );
  }

  if (state === "soon" || items.length === 0) {
    return (
      <div className={box} role="status">
        <p className="font-semibold text-gray-900 dark:text-white">
          {state === "soon"
            ? "Shared itineraries are coming soon"
            : "No published Zimbabwe itineraries yet"}
        </p>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Itineraries built for Zimbabwe in the Iconic trip builder will appear
          here, day by day, with links to the places and businesses they visit.
          Until then, see our{" "}
          <a href="/planning/sample-itineraries" className="underline">
            sample itineraries
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <ul className="not-prose space-y-4" aria-label="Zimbabwe itineraries">
      {items.map((it) => {
        const open = openId === it.id;
        const panelId = `itinerary-${it.id}`;
        return (
          <li
            key={it.id}
            className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {it.imageUrl ? (
              <img
                src={it.imageUrl}
                alt=""
                loading="lazy"
                className="h-40 w-full object-cover"
              />
            ) : null}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {it.name}
              </h3>
              {it.durationDays ? (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {it.durationDays} {it.durationDays === 1 ? "day" : "days"}
                </p>
              ) : null}
              {it.description ? (
                <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                  {it.description}
                </p>
              ) : null}
              {it.days.length ? (
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenId(open ? null : it.id)}
                  className="mt-3 text-sm font-medium underline text-gray-900 dark:text-white"
                >
                  {open
                    ? "Hide the day-by-day plan"
                    : "Show the day-by-day plan"}
                </button>
              ) : null}
            </div>
            {open ? (
              <ol
                id={panelId}
                className="border-t border-gray-200 dark:border-gray-700 px-5 py-4 space-y-4"
              >
                {it.days.map((d) => (
                  <li key={d.day}>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Day {d.day}
                      {d.title ? `: ${d.title}` : ""}
                    </h4>
                    <ul className="mt-2 space-y-2">
                      {d.activities.map((a, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-800 dark:text-gray-200"
                        >
                          {a.time ? (
                            <span className="font-medium">{a.time} · </span>
                          ) : null}
                          <span>{a.name || a.businessName || a.placeName}</span>
                          {a.description ? (
                            <span className="block text-gray-600 dark:text-gray-400">
                              {a.description}
                            </span>
                          ) : null}
                          {a.businessId ? (
                            <a
                              href={businessHref(a)}
                              className="block underline"
                            >
                              {a.businessName || "See this business"} in the
                              directory
                            </a>
                          ) : null}
                          {a.placeId &&
                          Number.isFinite(a.lat) &&
                          Number.isFinite(a.lng) ? (
                            <a
                              href={mapHref(a)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block underline"
                            >
                              {a.placeName || "This place"} on the map
                              <span className="sr-only">
                                {" "}
                                (opens in a new tab)
                              </span>
                            </a>
                          ) : a.placeName && a.placeName !== a.name ? (
                            <span className="block text-gray-600 dark:text-gray-400">
                              {a.placeName}
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};
