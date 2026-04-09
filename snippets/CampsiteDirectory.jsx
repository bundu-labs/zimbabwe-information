'use client';
import { useState, useEffect, useCallback } from 'react';

export const CampsiteDirectory = ({ showFilters = true }) => {
  const SUPABASE_URL = 'https://tdcpuzqyoodrdsxldgsh.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_aNdSABNOLB3sG7OMjHN0Vw_5SDouXAL';

  // Campsites can be registered as SportsActivityLocation or LodgingBusiness
  // We look for both and filter by description keywords
  const CAMPSITE_TYPES = ['SportsActivityLocation', 'LodgingBusiness'];

  const facilityLabels = {
    ablutions:     { icon: '🚿', label: 'Ablutions' },
    braai:         { icon: '🔥', label: 'Braai/Firepit' },
    power:         { icon: '⚡', label: 'Power Points' },
    water:         { icon: '💧', label: 'Running Water' },
    shop:          { icon: '🛒', label: 'Shop Nearby' },
    pool:          { icon: '🏊', label: 'Pool' },
    wifi:          { icon: '📶', label: 'WiFi' },
    restaurant:    { icon: '🍽️', label: 'Restaurant' },
    wildlife:      { icon: '🦁', label: 'Wildlife Area' },
    fishing:       { icon: '🎣', label: 'Fishing' },
  };

  const regionOptions = [
    'Victoria Falls',
    'Hwange',
    'Mana Pools',
    'Matobo',
    'Eastern Highlands',
    'Lake Kariba',
    'Harare',
    'Bulawayo',
  ];

  const verificationTiers = {
    unverified: { label: 'Unverified', color: '#6B7280' },
    otp:        { label: 'Verified',   color: '#00B0FF' },
    licensed:   { label: 'Licensed',   color: '#B388FF' },
  };

  const statusToTier = (status) => (status === 'verified' ? 'otp' : 'unverified');

  const [campsites, setCampsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCampsites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const typeQuery = CAMPSITE_TYPES.map((t) => `businesstype.eq.${t}`).join(',');
      const url =
        `${SUPABASE_URL}/rest/v1/local_business` +
        `?select=id,name,alternatename,description,businesstype,telephone,email,url,logo,pricerange,verification_status` +
        `&or=(${typeQuery})&order=name.asc&limit=100`;
      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Accept-Profile': 'commerce',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // Filter to camping-related entries based on keywords in description or name
      const campingKeywords = ['camp', 'campsite', 'camping', 'caravan', 'overlander', 'bush camp', 'tent'];
      const filtered = (data || []).filter((b) => {
        const text = `${b.name} ${b.description || ''}`.toLowerCase();
        return campingKeywords.some((kw) => text.includes(kw));
      });
      setCampsites(filtered);
    } catch (err) {
      setError('Unable to load campsites. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCampsites(); }, [fetchCampsites]);

  const filtered = campsites.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Search campsites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      )}

      {!loading && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} campsite{filtered.length !== 1 ? 's' : ''} listed
        </p>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">Couldn't load campsites</p>
            <p className="text-sm text-red-600 dark:text-red-500 mt-0.5">{error}</p>
            <button onClick={fetchCampsites} className="mt-2 text-sm font-medium text-red-700 dark:text-red-400 underline">Try again</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-32" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filtered.map((c) => {
            const tier = statusToTier(c.verification_status);
            const tierInfo = verificationTiers[tier] || verificationTiers.unverified;
            return (
              <div
                key={c.id}
                onClick={() => setSelected(c)}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 text-2xl">
                    ⛺
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{c.name}</h3>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: tierInfo.color }} title={tierInfo.label} />
                    </div>
                    {c.pricerange && (
                      <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{c.pricerange}/person/night</p>
                    )}
                  </div>
                </div>
                {c.description && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-4">{c.description}</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <div className="text-4xl mb-4">⛺</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Register your campsite</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-sm mx-auto">
            Own or manage a campsite, bush camp, or overlander stop in Zimbabwe? Get a free listing and reach self-drive travelers and campers.
          </p>
          <a
            href="/get-involved/business-partner-network"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Register campsite
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
            className="bg-white dark:bg-gray-800 rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-5 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="text-3xl">⛺</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selected.name}</h2>
                  {selected.pricerange && (
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{selected.pricerange}/person/night</p>
                  )}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none" aria-label="Close">&times;</button>
            </div>
            <div className="p-6 space-y-5">
              {selected.description && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">About</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{selected.description}</p>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Contact</h3>
                <div className="flex flex-wrap gap-3">
                  {selected.telephone && (
                    <a href={`tel:${selected.telephone}`} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      Call
                    </a>
                  )}
                  {selected.email && (
                    <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                      Email
                    </a>
                  )}
                  {selected.url && (
                    <a href={selected.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
