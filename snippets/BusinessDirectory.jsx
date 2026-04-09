import { useState, useEffect, useCallback } from 'react';

export const BusinessDirectory = ({ showFilters = true, category: initialCategory = null, placeId = null }) => {
  // ALL constants inside the function — Mintlify evals only the component body
  const SUPABASE_URL = 'https://tdcpuzqyoodrdsxldgsh.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_aNdSABNOLB3sG7OMjHN0Vw_5SDouXAL';

  const verificationTiers = {
    unverified:  { label: 'Unverified',   icon: 'circle',       mineral: null,         darkColor: '#6B6B66' },
    community:   { label: 'Community',    icon: 'users',        mineral: 'Terracotta', darkColor: '#D4A574' },
    otp:         { label: 'OTP Verified', icon: 'phone',        mineral: 'Cobalt',     darkColor: '#00B0FF' },
    government:  { label: 'Government',   icon: 'shield-check', mineral: 'Gold',       darkColor: '#FFD740' },
    licensed:    { label: 'Licensed',     icon: 'award',        mineral: 'Tanzanite',  darkColor: '#B388FF' },
  };

  const businessCategories = {
    LodgingBusiness:          { label: 'Accommodation' },
    TravelAgency:             { label: 'Tours & DMC' },
    FoodEstablishment:        { label: 'Dining' },
    EntertainmentBusiness:    { label: 'Entertainment' },
    ProfessionalService:      { label: 'Professional Services' },
    Store:                    { label: 'Retail & Shopping' },
    ShoppingCenter:           { label: 'Shopping Centre' },
    HealthAndBeautyBusiness:  { label: 'Health & Beauty' },
    SportsActivityLocation:   { label: 'Sports & Activities' },
    TouristInformationCenter: { label: 'Tourist Information' },
    LocalBusiness:            { label: 'General Business' },
    AutomotiveBusiness:       { label: 'Automotive' },
    FinancialService:         { label: 'Financial Services' },
    LegalService:             { label: 'Legal Services' },
    HomeAndConstructionBusiness: { label: 'Home & Construction' },
  };

  const renderBadge = (tier = 'unverified', size = 'md', showLabel = false) => {
    const tierInfo = verificationTiers[tier] || verificationTiers.unverified;
    const sizes = {
      sm: { badge: 'w-4 h-4', text: 'text-xs', gap: 'gap-1' },
      md: { badge: 'w-5 h-5', text: 'text-sm', gap: 'gap-1.5' },
      lg: { badge: 'w-6 h-6', text: 'text-base', gap: 'gap-2' },
    };
    const s = sizes[size] || sizes.md;
    const iconPath = {
      circle:        <circle cx="12" cy="12" r="9" strokeWidth="2" stroke="currentColor" fill="none" />,
      phone:         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />,
      users:         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
      'shield-check': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
      award:         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
    };
    return (
      <span className={`inline-flex items-center ${s.gap} flex-shrink-0`} title={`${tierInfo.label}${tierInfo.mineral ? ` — ${tierInfo.mineral}` : ''}`}>
        <svg className={`${s.badge} flex-shrink-0`} style={{ color: tierInfo.darkColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label={`${tierInfo.label} verification`}>
          {iconPath[tierInfo.icon] || iconPath.circle}
        </svg>
        {showLabel && <span className={`${s.text} font-medium`} style={{ color: tierInfo.darkColor }}>{tierInfo.label}</span>}
      </span>
    );
  };

  const statusToTier = (status) => {
    if (status === 'verified') return 'otp';
    return 'unverified';
  };

  const priceIndicator = (range) => {
    if (!range) return null;
    const levels = ['$', '$$', '$$$', '$$$$'];
    const current = levels.indexOf(range);
    if (current === -1) return <span className="text-sm text-gray-500 dark:text-gray-400">{range}</span>;
    return (
      <span className="text-sm">
        {levels.map((l, i) => (
          <span key={l} className={i <= current ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300 dark:text-gray-600'}>$</span>
        ))}
      </span>
    );
  };

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory || '');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBusinesses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let url =
        `${SUPABASE_URL}/rest/v1/local_business` +
        `?select=id,name,alternatename,description,businesstype,place_id,telephone,email,url,logo,` +
        `pricerange,verification_status` +
        `&order=name.asc&limit=50`;
      if (placeId) {
        url += `&place_id=eq.${placeId}`;
      }
      const res = await fetch(url, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Accept-Profile': 'commerce',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBusinesses(data || []);
    } catch (err) {
      setError('Unable to load businesses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [placeId]);

  useEffect(() => { fetchBusinesses(); }, [fetchBusinesses]);

  const filtered = businesses.filter((b) => {
    if (categoryFilter && b.businesstype !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.name?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Search businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">All categories</option>
            {Object.entries(businessCategories).map(([k, { label }]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </div>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {filtered.length} business{filtered.length !== 1 ? 'es' : ''} found
      </p>

      {/* Error — always visible, with retry */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">Couldn't load the directory right now</p>
            <p className="text-sm text-red-600 dark:text-red-500 mt-0.5">{error}</p>
            <button onClick={fetchBusinesses} className="mt-2 text-sm font-medium text-red-700 dark:text-red-400 underline hover:no-underline">Try again</button>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-28" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filtered.map((b) => {
            const tier = statusToTier(b.verification_status);
            const catInfo = businessCategories[b.businesstype] || { label: b.businesstype || 'Business' };
            return (
              <div
                key={b.id}
                onClick={() => setSelected(b)}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{b.name?.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{b.name}</h3>
                      {renderBadge(tier, 'sm')}
                    </div>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{catInfo.label}</p>
                    {b.pricerange && (
                      <div className="mt-1">{priceIndicator(b.pricerange)}</div>
                    )}
                  </div>
                </div>
                {b.description && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{b.description}</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (searchQuery || categoryFilter) ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <svg className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 font-medium">No businesses match your search</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Try a different category or clear the search to browse all businesses.</p>
          <button
            onClick={() => { setSearchQuery(''); setCategoryFilter(''); }}
            className="mt-4 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border border-primary-300 dark:border-primary-700 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="text-center py-14 bg-gradient-to-br from-primary-50 to-teal-50 dark:from-primary-900/20 dark:to-teal-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <svg className="w-7 h-7 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Be the first listed business</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-sm mx-auto">
            Do you run a lodge, tour operation, restaurant, or other travel business in Zimbabwe? Get listed and connect with travelers actively planning their visits.
          </p>
          <a
            href="/get-involved/business-partner-network"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Apply for a free listing
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
          <div
            className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-5 flex justify-between items-start">
              <div className="flex items-center gap-4">
                {selected.logo ? (
                  <img src={selected.logo} alt={selected.name} className="w-16 h-16 rounded-lg object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{selected.name?.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selected.name}</h2>
                    {renderBadge(statusToTier(selected.verification_status), 'md')}
                  </div>
                  {selected.businesstype && (
                    <p className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                      {businessCategories[selected.businesstype]?.label || selected.businesstype}
                    </p>
                  )}
                  {selected.pricerange && (
                    <div className="mt-1">{priceIndicator(selected.pricerange)}</div>
                  )}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none" aria-label="Close">
                &times;
              </button>
            </div>
            <div className="p-6 space-y-5">
              {selected.description && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">About</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{selected.description}</p>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Contact & links</h3>
                <div className="flex flex-wrap gap-3">
                  {selected.email && (
                    <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email
                    </a>
                  )}
                  {selected.telephone && (
                    <a href={`tel:${selected.telephone}`} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
                      </svg>
                      Call
                    </a>
                  )}
                  {selected.url && (
                    <a href={selected.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Website
                    </a>
                  )}
                  <a
                    href={`https://business.mukoko.com/business/${selected.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-sm font-medium"
                  >
                    View full profile →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
