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

  const renderVerificationBadge = (tier, showLabel = false) => {
    const tiers = {
      community:  { bg: '#C8956C', label: 'Community Verified',  icon: <path fill="currentColor" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/> },
      otp:        { bg: '#1D9BF0', label: 'Identity Verified',   icon: <path fill="currentColor" fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/> },
      government: { bg: '#F59E0B', label: 'Government Verified', icon: <path fill="currentColor" fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/> },
      licensed:   { bg: '#7C3AED', label: 'Licensed & Verified', icon: <path fill="currentColor" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/> },
    };
    const t = tiers[tier];
    if (!t) return null;
    return (
      <span className="inline-flex items-center gap-1 flex-shrink-0" title={t.label}>
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full" style={{ backgroundColor: t.bg }}>
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">{t.icon}</svg>
        </span>
        {showLabel && <span className="text-xs font-medium" style={{ color: t.bg }}>{t.label}</span>}
      </span>
    );
  };

  const statusToTier = (status) => (status === 'verified' ? 'otp' : 'unverified');

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
                  const typeInfo = typeLabels[b.businesstype] || { label: b.businesstype || 'Business', icon: '🏢' };
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelected(b)}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {b.logo ? (
                          <img src={b.logo} alt={b.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0 text-xl">
                            {typeInfo.icon}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">{b.name}</h4>
                            {renderVerificationBadge(tier)}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">{typeInfo.label}</span>
                            {b.pricerange && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{b.pricerange}</span>
                            )}
                          </div>
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
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-2xl flex-shrink-0">
                  {typeLabels[selected.businesstype]?.icon || '🏢'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selected.name}</h2>
                    {renderVerificationBadge(statusToTier(selected.verification_status), true)}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                      {typeLabels[selected.businesstype]?.label || selected.businesstype}
                    </span>
                    {selected.pricerange && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{selected.pricerange}</span>
                    )}
                  </div>
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
