import { useState } from 'react';

export const SampleExpertDirectory = () => {
  // ALL constants inside the function — Mintlify evals only the function body
  const SAMPLE_EXPERTS = [
    { id: '1', name: 'Takoda Moyo', category: 'Safari Guide', years: 14, rating: 4.9, reviews: 127, bio: 'Specialising in Hwange and Mana Pools. Passionate about big cats and wild dogs with over a decade of experience.', tier: 'licensed' },
    { id: '2', name: 'Rudo Chikwanda', category: 'Cultural & Heritage Expert', years: 9, rating: 4.8, reviews: 84, bio: 'Expert in Great Zimbabwe and Matobo Hills rock art. Fluent in Shona, Ndebele, and English with deep ancestral knowledge.', tier: 'government' },
    { id: '3', name: 'Farai Nzou', category: 'Birding Specialist', years: 7, rating: 4.7, reviews: 61, bio: 'Premier birding guide with 650+ species spotted. Specialises in Eastern Highlands and Hwange migratory species.', tier: 'otp' },
    { id: '4', name: 'Simba Dube', category: 'Photography Guide', years: 5, rating: 4.6, reviews: 43, bio: 'Wildlife and landscape photographer guiding clients to Victoria Falls, Gonarezhou, and Matobo.', tier: 'community' },
    { id: '5', name: 'Chipo Mutasa', category: 'Walking Safari Guide', years: 11, rating: 5.0, reviews: 99, bio: 'ZPWMA-certified walking safari specialist. Former anti-poaching ranger focused on conservation education.', tier: 'licensed' },
    { id: '6', name: 'Blessing Ncube', category: 'Adventure Activity Guide', years: 6, rating: 4.8, reviews: 72, bio: 'White-water rafting and bungee jump coordinator at Victoria Falls. Gorge swings and zip-lines for all levels.', tier: 'otp' },
  ];

  const TIER_COLORS = { licensed: '#B388FF', government: '#FFD740', otp: '#00B0FF', community: '#D4A574', unverified: '#6B6B66' };
  const TIER_LABELS = { licensed: 'Licensed', government: 'Government', otp: 'OTP Verified', community: 'Community', unverified: 'Unverified' };

  const [search, setSearch] = useState('');

  const filtered = SAMPLE_EXPERTS.filter((e) =>
    !search ||
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase()) ||
    e.bio.toLowerCase().includes(search.toLowerCase())
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
        placeholder="Search experts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      />

      <p className="text-xs text-gray-400 dark:text-gray-500">{filtered.length} of {SAMPLE_EXPERTS.length} experts</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((e) => (
          <div key={e.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{e.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">{e.name}</h3>
                  <span
                    className="text-xs font-medium px-1.5 py-0.5 rounded-full border"
                    style={{ color: TIER_COLORS[e.tier], borderColor: TIER_COLORS[e.tier] + '66' }}
                  >
                    {TIER_LABELS[e.tier]}
                  </span>
                </div>
                <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mt-0.5">{e.category}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400 dark:text-gray-500">{e.years} yrs</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">★ {e.rating} ({e.reviews})</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{e.bio}</p>
          </div>
        ))}
      </div>

      <div className="text-center pt-2">
        <a
          href="/get-involved/local-expert-connections"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Apply to get listed
        </a>
      </div>
    </div>
  );
};
