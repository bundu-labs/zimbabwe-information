// ---------------------------------------------------------------------------
// Get-involved application forms (nyuchi/nyuchi-platform#375).
//
// The business and expert forms post to the Nyuchi API:
//   POST https://api.nyuchi.com/v1/applications/businesses
//   POST https://api.nyuchi.com/v1/applications/experts
// Submissions land in the Nyuchi console's review pipeline.
//
// No sign-in is needed. Instead the API asks for agreement to the privacy
// notice and a Cloudflare Turnstile token (a privacy-preserving human check),
// sent in the CF-Turnstile-Response header and verified server-side.
//
// The expert form also asks, separately and unticked, whether the applicant
// wants to be listed in the public expert directory once approved. It is
// sent as `list_in_directory`; the directory (snippets/ExpertDirectory.jsx)
// shows only approved experts who ticked it, and never contact details.
//
// TURNSTILE_SITE_KEY is the widget's PUBLIC site key; it is not a secret.
// While it is empty the forms show "opening soon" and cannot be sent.
//
// Everything lives inside the one exported component: Mintlify keeps only a
// snippet's exports, so top-level helpers would be undefined at runtime, and
// it allows no package imports — useState, useEffect and useRef are globals.
// Parts of the form are plain functions called with {...} rather than
// <Capitalised /> tags, which MDX would treat as missing components.
// ---------------------------------------------------------------------------

/**
 * ApplicationForm — apply to list a travel business, or to join as a local
 * expert or guide.
 *
 *   import { ApplicationForm } from "/snippets/ApplicationForm.jsx"
 *   <ApplicationForm kind="businesses" />
 *   <ApplicationForm kind="experts" />
 */
export const ApplicationForm = ({ kind: requestedKind = "businesses" }) => {
  const API_BASE = "https://api.nyuchi.com/v1";
  const TURNSTILE_SITE_KEY = "";
  const TURNSTILE_SCRIPT =
    "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
  const CONTACT_EMAIL = "hi@travel-info.co.zw";
  // The site's #0D9373, darkened so white text on it passes WCAG AA (5.3:1).
  const BUTTON_GREEN = "#0A7A60";

  const regions = [
    "Victoria Falls",
    "Hwange",
    "Mana Pools",
    "Harare",
    "Bulawayo",
    "Matobo Hills",
    "Eastern Highlands",
    "Lake Kariba",
    "Gonarezhou",
    "Great Zimbabwe",
    "Masvingo",
    "Mutare",
    "Nyanga",
    "Chimanimani",
    "Other",
  ];

  const opts = (pairs) => pairs.map(([value, label]) => ({ value, label }));

  const businessCategories = opts([
    ["accommodation", "Accommodation"],
    ["dining", "Restaurant, café or bar"],
    ["tours", "Tours and safaris"],
    ["activities", "Activities and adventure"],
    ["transport", "Transport and transfers"],
    ["attractions", "Attractions"],
    ["wellness", "Wellness"],
    ["shopping", "Shopping and crafts"],
    ["other", "Other"],
  ]);

  const expertCategories = opts([
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
  ]);

  const regionOptions = regions.map((r) => ({ value: r, label: r }));

  // One entry per field, in order. `max` mirrors the API's limits.
  const FORMS = {
    businesses: {
      title: "Business application",
      fields: [
        {
          name: "business_name",
          label: "Business name",
          required: true,
          max: 200,
          autoComplete: "organization",
        },
        {
          name: "contact_person",
          label: "Contact person",
          required: true,
          max: 200,
          autoComplete: "name",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          max: 254,
          autoComplete: "email",
        },
        {
          name: "phone",
          label: "Phone or WhatsApp",
          type: "tel",
          required: true,
          max: 40,
          autoComplete: "tel",
          hint: "Include the country code, for example +263 77 123 4567.",
        },
        {
          name: "category",
          label: "Type of business",
          kind: "select",
          options: businessCategories,
          required: true,
        },
        {
          name: "location",
          label: "Where you operate",
          kind: "select",
          options: regionOptions,
          required: true,
        },
        {
          name: "description",
          label: "About your business",
          kind: "textarea",
          rows: 5,
          required: true,
          max: 5000,
          hint: "What you offer travellers, in a few sentences.",
        },
        {
          name: "website",
          label: "Website",
          type: "url",
          max: 500,
          autoComplete: "url",
          hint: "Optional.",
        },
        {
          name: "target_travelers",
          label: "Who you serve",
          max: 500,
          hint: "Optional. For example families, birders, overlanders.",
        },
        {
          name: "price_range",
          label: "Price range",
          kind: "select",
          options: opts([
            ["budget", "Budget"],
            ["mid_range", "Mid-range"],
            ["upmarket", "Upmarket"],
            ["luxury", "Luxury"],
          ]),
          hint: "Optional.",
        },
        {
          name: "listing_type",
          label: "Listing",
          kind: "select",
          options: opts([
            ["free", "Free listing"],
            ["verified", "Free listing, and I want to apply for verification"],
          ]),
          initial: "free",
        },
      ],
      success: (data) =>
        `Thank you. We have your application for ${data.business_name} and will reply to ${data.email}.`,
    },
    experts: {
      title: "Local expert application",
      fields: [
        {
          name: "full_name",
          label: "Full name",
          required: true,
          max: 200,
          autoComplete: "name",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          max: 254,
          autoComplete: "email",
        },
        {
          name: "phone",
          label: "Phone or WhatsApp",
          type: "tel",
          required: true,
          max: 40,
          autoComplete: "tel",
          hint: "Include the country code, for example +263 77 123 4567.",
        },
        {
          name: "location",
          label: "Where you are based",
          kind: "select",
          options: regionOptions,
          required: true,
        },
        {
          name: "category",
          label: "Your expertise",
          kind: "select",
          options: expertCategories,
          required: true,
        },
        {
          name: "years_experience",
          label: "Years of experience",
          kind: "select",
          options: opts([
            ["1-2", "1–2 years"],
            ["3-5", "3–5 years"],
            ["6-10", "6–10 years"],
            ["10-15", "10–15 years"],
            ["15+", "15 years or more"],
          ]),
        },
        {
          name: "languages",
          label: "Languages you guide in",
          max: 500,
          hint: "For example English, Shona, Ndebele.",
        },
        {
          name: "bio",
          label: "About you",
          kind: "textarea",
          rows: 5,
          required: true,
          max: 5000,
          hint: "Your background and what makes your trips worth taking.",
        },
        {
          name: "services",
          label: "Services you offer",
          kind: "textarea",
          rows: 3,
          max: 5000,
          hint: "Optional. For example half-day game drives, bush walks.",
        },
        {
          name: "certifications",
          label: "Certifications and licences",
          kind: "textarea",
          rows: 2,
          max: 5000,
          hint: "Optional. For example a ZimParks professional guide licence.",
        },
        {
          name: "website",
          label: "Website",
          type: "url",
          max: 500,
          autoComplete: "url",
          hint: "Optional.",
        },
      ],
      success: (data) =>
        `Thank you, ${data.full_name}. We have your application and will reply to ${data.email}.`,
    },
  };

  // Load Turnstile once per page, however many forms ask for it.
  const loadTurnstile = () => {
    if (typeof window === "undefined")
      return Promise.reject(new Error("no window"));
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (!window.__ztiTurnstile) {
      window.__ztiTurnstile = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = TURNSTILE_SCRIPT;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve(window.turnstile);
        script.onerror = () => {
          window.__ztiTurnstile = null;
          reject(new Error("turnstile failed to load"));
        };
        document.head.appendChild(script);
      });
    }
    return window.__ztiTurnstile;
  };

  // A readable sentence for whatever the API answered.
  const describeError = (status, body, fields) => {
    const detail = body && body.detail;
    if (status === 422 && Array.isArray(detail) && detail.length) {
      const loc = detail[0].loc || [];
      const field = fields.find((f) => f.name === loc[loc.length - 1]);
      return field
        ? `Please check “${field.label}”.`
        : "Please check the form and try again.";
    }
    if (status === 422 && typeof detail === "string") return detail;
    if (status === 400 || status === 403)
      return "The human check did not go through. Please complete it again and resubmit.";
    if (status === 429)
      return "That is a lot of applications from one connection. Please wait a few minutes and try again.";
    if (status === 503)
      return `Applications are not being accepted just now. Please try again later, or email ${CONTACT_EMAIL}.`;
    return `Something went wrong on our side. Please try again, or email ${CONTACT_EMAIL}.`;
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent disabled:opacity-60";
  const labelClass =
    "block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1";
  const hintClass = "mt-1 text-xs text-gray-600 dark:text-gray-400";

  const kind = FORMS[requestedKind] ? requestedKind : "businesses";

  const config = FORMS[kind];
  const open = Boolean(TURNSTILE_SITE_KEY);
  const idPrefix = `apply-${kind}`;
  // Only the expert form offers a listing in the public directory.
  const offersListing = kind === "experts";
  const initial = () => {
    const data = { privacy_consent: false };
    if (offersListing) data.list_in_directory = false;
    config.fields.forEach((f) => {
      data[f.name] = f.initial || "";
    });
    return data;
  };

  const [data, setData] = useState(initial);
  const [state, setState] = useState("idle"); // idle | sending | sent
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [checkError, setCheckError] = useState("");
  const widgetRef = useRef(null);
  const widgetId = useRef(null);
  const doneRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    if (!open || state === "sent" || !widgetRef.current) return undefined;
    let cancelled = false;
    loadTurnstile()
      .then((ts) => {
        if (cancelled || !widgetRef.current || widgetId.current !== null)
          return;
        widgetId.current = ts.render(widgetRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          action: `apply-${kind}`,
          callback: (t) => {
            setToken(t);
            setCheckError("");
          },
          "expired-callback": () => setToken(""),
          "error-callback": () => {
            setToken("");
            setCheckError(
              "The human check could not load. Please refresh the page.",
            );
          },
        });
      })
      .catch(() => {
        if (!cancelled)
          setCheckError(
            `The human check could not load. Please refresh the page, or email ${CONTACT_EMAIL}.`,
          );
      });
    return () => {
      cancelled = true;
      if (widgetId.current !== null && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, [open, state, kind]);

  useEffect(() => {
    if (state === "sent" && doneRef.current) doneRef.current.focus();
  }, [state]);

  useEffect(() => {
    if (error && errorRef.current) errorRef.current.focus();
  }, [error]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetCheck = () => {
    setToken("");
    if (widgetId.current !== null && window.turnstile)
      window.turnstile.reset(widgetId.current);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!open || state === "sending") return;
    if (!token) {
      setError("Please complete the human check before sending.");
      return;
    }
    setState("sending");
    setError("");
    const payload = { privacy_consent: data.privacy_consent };
    if (offersListing) payload.list_in_directory = data.list_in_directory;
    config.fields.forEach((f) => {
      const value = String(data[f.name] || "").trim();
      if (value) payload[f.name] = value;
    });
    try {
      const res = await fetch(`${API_BASE}/applications/${kind}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CF-Turnstile-Response": token,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setState("sent");
        return;
      }
      let body = null;
      try {
        body = await res.json();
      } catch {
        body = null;
      }
      setError(describeError(res.status, body, config.fields));
      setState("idle");
      resetCheck();
    } catch {
      setError(
        `We could not reach the server. Check your connection and try again, or email ${CONTACT_EMAIL}.`,
      );
      setState("idle");
      resetCheck();
    }
  };

  const field = (f) => {
    const id = `${idPrefix}-${f.name}`;
    const hintId = f.hint ? `${id}-hint` : undefined;
    const common = {
      id,
      name: f.name,
      value: data[f.name],
      onChange,
      required: Boolean(f.required),
      "aria-required": f.required ? "true" : undefined,
      "aria-describedby": hintId,
      className: inputClass,
    };
    let control;
    if (f.kind === "select") {
      control = (
        <select {...common}>
          {f.initial ? null : <option value="">Choose one</option>}
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    } else if (f.kind === "textarea") {
      control = <textarea {...common} rows={f.rows || 4} maxLength={f.max} />;
    } else {
      control = (
        <input
          {...common}
          type={f.type || "text"}
          maxLength={f.max}
          autoComplete={f.autoComplete}
          inputMode={f.type === "tel" ? "tel" : undefined}
        />
      );
    }
    return (
      <div key={f.name}>
        <label htmlFor={id} className={labelClass}>
          {f.label}
          {f.required ? (
            <span className="text-red-700 dark:text-red-400" aria-hidden="true">
              {" "}
              *
            </span>
          ) : null}
        </label>
        {control}
        {f.hint ? (
          <p id={hintId} className={hintClass}>
            {f.hint}
          </p>
        ) : null}
      </div>
    );
  };

  if (state === "sent") {
    return (
      <div
        className="not-prose rounded-xl border border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-6"
        role="status"
      >
        <h3
          ref={doneRef}
          tabIndex={-1}
          className="text-lg font-semibold text-green-900 dark:text-green-200 focus:outline-none"
        >
          Application sent
        </h3>
        <p className="mt-2 text-sm text-green-900 dark:text-green-200">
          {config.success(data)}
        </p>
        <p className="mt-2 text-sm text-green-800 dark:text-green-300">
          Our team reviews every application, usually within five working days.
          We may email or call you to check details.
        </p>
      </div>
    );
  }

  const consentId = `${idPrefix}-consent`;
  const listingId = `${idPrefix}-listing`;
  return (
    <form
      onSubmit={onSubmit}
      aria-labelledby={`${idPrefix}-title`}
      className="not-prose space-y-5"
    >
      <h3
        id={`${idPrefix}-title`}
        className="text-lg font-semibold text-gray-900 dark:text-white"
      >
        {config.title}
      </h3>
      {open ? (
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Fields marked <span aria-hidden="true">*</span>
          <span className="sr-only">with an asterisk</span> are required. No
          account needed.
        </p>
      ) : (
        <div
          className="rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-4 text-sm text-amber-900 dark:text-amber-200"
          role="note"
        >
          <strong>Applications open soon.</strong> This form is not taking
          submissions yet. In the meantime, email{" "}
          <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </div>
      )}
      <fieldset disabled={!open || state === "sending"} className="space-y-5">
        <legend className="sr-only">{config.title}</legend>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {config.fields.slice(0, 4).map(field)}
        </div>
        {config.fields.slice(4).map(field)}
        {offersListing ? (
          <div className="flex items-start gap-3 rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
            <input
              type="checkbox"
              id={listingId}
              name="list_in_directory"
              checked={data.list_in_directory}
              onChange={onChange}
              aria-describedby={`${listingId}-hint`}
              className="mt-1 h-4 w-4 rounded border-gray-400"
            />
            <div>
              <label
                htmlFor={listingId}
                className="text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                List me in the public expert directory
              </label>
              <p id={`${listingId}-hint`} className={hintClass}>
                Optional. If we approve your application, your name, expertise,
                area, years of experience, languages, services, about you and
                website appear in the{" "}
                <a href="/experts" className="underline">
                  expert directory
                </a>
                . Your email, phone and certifications are never shown. To be
                taken off later, email {CONTACT_EMAIL}.
              </p>
            </div>
          </div>
        ) : null}
        <div className="flex items-start gap-3 rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
          <input
            type="checkbox"
            id={consentId}
            name="privacy_consent"
            checked={data.privacy_consent}
            onChange={onChange}
            required
            aria-required="true"
            className="mt-1 h-4 w-4 rounded border-gray-400"
          />
          <label
            htmlFor={consentId}
            className="text-sm text-gray-800 dark:text-gray-200"
          >
            I agree that the details in this form may be stored and used to
            review my application and to contact me about it. They are sent to
            the Nyuchi API, the platform behind Zimbabwe Travel Information, and
            are not published
            {offersListing
              ? " unless you choose to be listed in the expert directory"
              : ""}
            . Read the{" "}
            <a href="/privacy-policy" className="underline">
              privacy policy
            </a>
            .
            <span className="text-red-700 dark:text-red-400" aria-hidden="true">
              {" "}
              *
            </span>
          </label>
        </div>
        {open ? (
          <div>
            <div ref={widgetRef} />
            <p className={hintClass}>
              A quick, privacy-preserving check by Cloudflare Turnstile that you
              are a person.
            </p>
            {checkError ? (
              <p
                className="mt-1 text-sm text-red-700 dark:text-red-400"
                role="alert"
              >
                {checkError}
              </p>
            ) : null}
          </div>
        ) : null}
        {error ? (
          <div
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            className="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-800 dark:text-red-300 focus:outline-none"
          >
            {error}
          </div>
        ) : null}
        <button
          type="submit"
          disabled={!open || state === "sending" || !data.privacy_consent}
          className="w-full rounded-lg px-4 py-3 font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: BUTTON_GREEN }}
        >
          {state === "sending"
            ? "Sending…"
            : open
              ? "Send application"
              : "Opening soon"}
        </button>
      </fieldset>
    </form>
  );
};
