/**
 * PlanTrip - "Plan this trip with a local" call to action, linking to our
 * booking partner Moses Adventures with UTM tags so referrals can be counted.
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
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener"
      className="not-prose my-6 block rounded-xl border border-primary/30 bg-primary/5 p-5 no-underline transition-colors hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-primary-light/30 dark:bg-primary-light/10"
    >
      <span className="block text-xs font-semibold uppercase tracking-wide text-primary dark:text-primary-light">
        Booking partner
      </span>
      <span className="mt-1 block text-lg font-semibold text-gray-900 dark:text-gray-100">
        Plan your {place} trip with a local
      </span>
      <span className="mt-1 block text-sm text-gray-700 dark:text-gray-300">
        Moses Adventures builds tailored Zimbabwe trips and has visited every
        destination they sell. Share your dates and budget for a quote.
      </span>
      <span className="mt-3 inline-block text-sm font-semibold text-primary dark:text-primary-light">
        Get a quote from Moses Adventures →
        <span className="sr-only"> (opens in a new tab)</span>
      </span>
    </a>
  );
};
