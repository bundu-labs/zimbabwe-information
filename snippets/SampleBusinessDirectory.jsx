import { useState } from 'react';

const SAMPLE_BUSINESSES = [
  { id: '1', name: 'Victoria Falls Safari Lodge', category: 'Accommodation', location: 'Victoria Falls', price: 3, rating: 4.9, reviews: 312, description: 'Luxury thatched lodge overlooking active watering holes visited by elephant, buffalo and giraffe. 5 minutes from the Falls.', tier: 'licensed' },
  { id: '2', name: 'Wild Horizons', category: 'Tour Operator', location: 'Victoria Falls', price: 2, rating: 4.8, reviews: 198, description: 'Zimbabwe leading adventure and safari company. Game drives, walking safaris, and helicopter rides over the Falls.', tier: 'licensed' },
  { id: '3', name: 'Bumi Hills Safari Lodge', category: 'Accommodation', location: 'Lake Kariba', price: 3, rating: 4.7, reviews: 156, description: 'Clifftop lodge above Lake Kariba with panoramic views. World-class houseboat safaris and tiger fishing.', tier: 'government' },
  { id: '4', name: 'Amalinda Lodge', category: 'Accommodation', location: 'Matobo Hills', price: 3, rating: 4.9, reviews: 89, description: 'Extraordinary lodge built into ancient Matobo boulders. Rock art walks and rhino tracking on foot.', tier: 'otp' },
  { id: '5', name: 'Dzimbahwe Restaurant', category: 'Dining', location: 'Harare', price: 2, rating: 4.6, reviews: 241, description: 'Contemporary Zimbabwean cuisine. Dishes include sadza, nyama, and seasonal game in a beautifully decorated space.', tier: 'community' },
  { id: '6', name: 'Backpackers Bazaar', category: 'Accommodation', location: 'Victoria Falls', price: 1, rating: 4.5, reviews: 503, description: 'Legendary backpacker haunt steps from the Falls. Budget dorms, private rooms, camping, and a buzzing social scene.', tier: 'otp' },
];

const TIER_COLORS = { licensed: '#B388FF', government: '#FFD740', otp: '#00B0FF', community: '#D4A574', unverified: '#6B6B66' };
const TIER_LABELS = { licensed: 'Licensed', government: 'Government', otp: 'OTP Verified', community: 'Community', unverified: 'Unverified' };

const priceLabel = (n) => Array.from({ length: 3 }, (_, i) => i < n ? '$' : '·').join('');

export const SampleBusinessDirectory = () => {
  const [search, setSearch] = useState('');

  const filtered = SAMPLE_BUSINESSES.filter((b) =>
    !search ||
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase()) ||
    b.location.toLowerCase().includes(search.toLowerCase()) ||
    b.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
        <p className="text-amber-700 dark:text-amber-400 text-sm font-medium">
          Sample data — if you see these cards, React is rendering correctly in Mintlify.
        </p>
      </div>

      <input
        type="search"
        placeholder="Search businesses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      />

      <p className="text-xs text-gray-400 dark:text-gray-500">{filtered.length} of {SAMPLE_BUSINESSES.length} businesses</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((b) => (
          <div key={b.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{b.name}</h3>
                  <span
                    className="text-xs font-medium px-1.5 py-0.5 rounded-full border"
                    style={{ color: TIER_COLORS[b.tier], borderColor: TIER_COLORS[b.tier] + '66' }}
                  >
                    {TIER_LABELS[b.tier]}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">{b.category}</span>
                  <span className="text-gray-300 dark:text-gray-600 text-xs">|</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{b.location}</span>
                  <span className="text-gray-300 dark:text-gray-600 text-xs">|</span>
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{priceLabel(b.price)}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-amber-500">★ {b.rating}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500">({b.reviews})</div>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{b.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <a
          href="/get-involved/business-partner-network"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          List your business
        </a>
      </div>
    </div>
  );
};
