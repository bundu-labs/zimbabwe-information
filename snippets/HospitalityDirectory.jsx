'use client';
import { useState, useEffect, useCallback } from 'react';

export const HospitalityDirectory = ({ showFilters = true }) => {
  const SUPABASE_URL = 'https://tdcpuzqyoodrdsxldgsh.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_aNdSABNOLB3sG7OMjHN0Vw_5SDouXAL';

  const HOSPITALITY_TYPES = [
    'LodgingBusiness',
    'FoodEstablishment',
    'TravelAgency',
    'TouristInformationCenter',
    'EntertainmentBusiness',
    'SportsActivityLocation',
    'HealthAndBeautyBusiness',
  ];

  const typeLabels = {
    LodgingBusiness:          { label: 'Accommodation', icon: '🏨' },
    FoodEstablishment:        { label: 'Dining',         icon: '🍽️' },
    TravelAgency:             { label: 'Tours & DMC',    icon: '🧭' },
    TouristInformationCenter: { label: 'Tourist Info',   icon: 'ℹ️' },
    EntertainmentBusiness:    { label: 'Entertainment',  icon: '🎭' },
    SportsActivityLocation:   { label: 'Activities',     icon: '🏃' },
    HealthAndBeautyBusiness:  { label: 'Wellness',       icon: '💆' },
  };

  const verificationTiers = {
    unverified: { label: 'Unverified',   color: '#6B7280' },
    community:  { label: 'Community',    color: '#D4A574' },
    otp:        { label: 'OTP Verified', color: '#00B0FF' },
    government: { label: 'Government',   color: '#FFD740' },
    licensed:   { label: 'Licensed',     color: '#B388FF' },
  };

  const statusToTier = (status) => (status === 'verified' ? 'otp' : 'unverified');

  const priceIndicator = (range) => {
    if (!range) return null;
    const levels = ['$', '$$', '$$$', '$$$$'];
    const current = levels.indexOf(range);
    if (current === -1) return <span className="text-sm text-gray-500">{range}</span>;
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
  const [typeFilter, setTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHospitality = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const typeQuery = HOSPITALITY_TYPES.map((t) => `businesstype.eq.${t}`).join(',');
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
      setBusinesses(data || []);
    } catch (err) {
      setError('Unable to load hospitality listings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHospitality(); }, [fetchHospitality]);

  const filtered = businesses.filter((b) => {
    if (typeFilter && b.businesstype !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return b.name?.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q);
    }
    return true;
  });

  // Group by type for display
  const grouped = typeFilter
    ? { [typeFilter]: filtered }
    : filtered.reduce((acc, b) => {
        const t = b.businesstype || 'LocalBusiness';
        if (!acc[t]) acc[t] = [];
        acc[t].push(b);
        return acc;
      }, {});

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Search hospitality businesses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTypeFilter('')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!typeFilter ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            >
              All
            </button>
            {HOSPITALITY_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t === typeFilter ? '' : t)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${typeFilter === t ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                {typeLabels[t]?.icon} {typeLabels[t]?.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {filtered.length} listing{filtered.length !== 1 ? 's' : ''} found
      </p>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">Couldn't load listings</p>
            <p className="text-sm text-red-600 dark:text-red-500 mt-0.5">{error}</p>
            <button onClick={fetchHospitality} className="mt-2 text-sm font-medium text-red-700 dark:text-red-400 underline">Try again</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-28" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type}>
              {!typeFilter && (
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span>{typeLabels[type]?.icon}</span>
                  <span>{typeLabels[type]?.label || type}</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({items.length})</span>
                </h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {items.map((b) => {
                  const tier = statusToTier(b.verification_status);
                  const tierInfo = verificationTiers[tier];
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
                          <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0 text-xl">
                            {typeLabels[b.businesstype]?.icon || '🏢'}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">{b.name}</h4>
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: tierInfo.color }} title={tierInfo.label} />
                          </div>
                          <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mt-0.5">
                            {typeLabels[b.businesstype]?.label || b.businesstype}
                          </p>
                          {b.pricerange && <div className="mt-1">{priceIndicator(b.pricerange)}</div>}
                        </div>
                      </div>
                      {b.description && (
                        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{b.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-14 bg-gradient-to-br from-primary-50 to-teal-50 dark:from-primary-900/20 dark:to-teal-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
          <div className="text-4xl mb-4">🏨</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No listings yet</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-sm mx-auto">
            Hospitality businesses in Zimbabwe — lodges, restaurants, tour operators, and more — will appear here. Be the first to list yours.
          </p>
          <a
            href="/get-involved/business-partner-network"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            List your business
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
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-2xl">
                  {typeLabels[selected.businesstype]?.icon || '🏢'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selected.name}</h2>
                  <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                    {typeLabels[selected.businesstype]?.label || selected.businesstype}
                  </p>
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
                  {selected.email && (
                    <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                      Email
                    </a>
                  )}
                  {selected.telephone && (
                    <a href={`tel:${selected.telephone}`} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      Call
                    </a>
                  )}
                  {selected.url && (
                    <a href={selected.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
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
