/**
 * PlanTrip - "Plan this trip with a local" call to action. Links to our
 * premium booking partner, Moses Adventures, with UTM tags so referrals can be
 * counted, and to /book, which lists all booking partners.
 *
 * @param {string} place - Destination name shown in the heading
 * @param {string} slug - Campaign name for the referral link (e.g. "victoria-falls")
 *
 * Usage in MDX:
 * import { PlanTrip } from '/snippets/PlanTrip.jsx';
 * <PlanTrip place="Victoria Falls" slug="victoria-falls" />
 */
export const PlanTrip = ({ place = "Zimbabwe", slug = "general" }) => {
  const href = `https://www.moses-adventures.com/?utm_source=travel-info.co.zw&utm_medium=referral&utm_campaign=${encodeURIComponent(slug)}`;
  return (
    <div className="not-prose my-6 rounded-xl border border-primary/30 bg-primary/5 p-5 dark:border-primary-light/30 dark:bg-primary-light/10">
      <span className="block text-xs font-semibold uppercase tracking-wide text-primary dark:text-primary-light">
        Premium booking partner
      </span>
      <span className="mt-1 block text-lg font-semibold text-gray-900 dark:text-gray-100">
        Plan your {place} trip with a local
      </span>
      <span className="mt-1 block text-sm text-gray-700 dark:text-gray-300">
        Moses Adventures builds tailored Zimbabwe trips and has visited every
        destination they sell. Share your dates and budget for a quote.
      </span>
      <span className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
        <a
          href={href}
          target="_blank"
          rel="sponsored noopener"
          className="text-primary no-underline hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-primary-light"
        >
          Get a quote from Moses Adventures →
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
        <a
          href="/book"
          className="text-gray-700 no-underline hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-gray-300"
        >
          See all booking partners
        </a>
      </span>
    </div>
  );
};
