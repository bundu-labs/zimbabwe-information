'use client';
import { useState, useEffect, useCallback } from 'react';

export const ExpertDirectory = ({ showFilters = true, category: initialCategory = null }) => {
  // ALL constants inside the function — Mintlify evals only the component body,
  // so module-level variables are out of scope at runtime.
  const SUPABASE_URL = 'https://tdcpuzqyoodrdsxldgsh.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_aNdSABNOLB3sG7OMjHN0Vw_5SDouXAL';

  const expertCategories = {
    safari_guide:      { label: 'Safari Guide' },
    bird_guide:        { label: 'Birding Specialist' },
    walking_safari:    { label: 'Walking Safari Guide' },
    photography_guide: { label: 'Photography Guide' },
    cultural_expert:   { label: 'Cultural & Heritage Expert' },
    adventure_guide:   { label: 'Adventure Activity Guide' },
    hiking_guide:      { label: 'Hiking & Trekking Guide' },
    fishing_guide:     { label: 'Fishing Guide' },
    city_guide:        { label: 'Urban/City Guide' },
    food_culinary:     { label: 'Food & Culinary Expert' },
    art_crafts:        { label: 'Arts & Crafts Specialist' },
    historical:        { label: 'Historical Guide' },
    other:             { label: 'Other' },
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

  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory || '');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProfessionals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url =
        `${SUPABASE_URL}/rest/v1/professional` +
        `?select=id,occupation_type,specialisations,years_experience,license_type,` +
        `services_offered,booking_url,verification_tier,aggregate_rating,review_count,featured` +
        `&is_active=eq.true&order=featured.desc,review_count.desc`;
      const res = await fetch(url, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Accept-Profile': 'hospitality',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProfessionals(data || []);
    } catch (err) {
      setError('Unable to load professionals. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfessionals(); }, [fetchProfessionals]);

  const filtered = professionals.filter((p) => {
    if (categoryFilter && p.occupation_type !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.occupation_type?.toLowerCase().includes(q) ||
        p.specialisations?.some?.((s) => s?.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Search guides & professionals..."
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
            {Object.entries(expertCategories).map(([k, { label }]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </div>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {filtered.length} professional{filtered.length !== 1 ? 's' : ''} found
      </p>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">Couldn't load the directory right now</p>
            <p className="text-sm text-red-600 dark:text-red-500 mt-0.5">{error}</p>
            <button onClick={fetchProfessionals} className="mt-2 text-sm font-medium text-red-700 dark:text-red-400 underline hover:no-underline">Try again</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-32" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filtered.map((p) => {
            const catInfo = expertCategories[p.occupation_type] || { label: p.occupation_type || 'Expert' };
            const rating = p.aggregate_rating?.ratingValue;
            return (
              <div
                key={p.id}
                onClick={() => setSelected(p)}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all cursor-pointer relative"
              >
                {p.featured && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">Featured</span>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{catInfo.label}</h3>
                      {renderVerificationBadge(p.verification_tier)}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">{catInfo.label}</span>
                      {p.years_experience && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{p.years_experience} yrs exp</span>
                      )}
                      {rating > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">★ {rating.toFixed(1)} ({p.review_count})</span>
                      )}
                    </div>
                  </div>
                </div>
                {p.specialisations?.length > 0 && (
                  <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                    {(Array.isArray(p.specialisations) ? p.specialisations : [p.specialisations]).join(', ')}
                  </p>
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
          <p className="text-gray-600 dark:text-gray-400 font-medium">No experts match your search</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Try a different category or clear the search.</p>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Be the first verified expert</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-sm mx-auto">
            Are you a safari guide, cultural specialist, or Zimbabwe expert? Join our directory and connect with travelers planning their trips.
          </p>
          <a href="/get-involved/local-expert-connections" className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
            Apply to get listed
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-5 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {(expertCategories[selected.occupation_type] || { label: selected.occupation_type || 'Expert' }).label}
                    </h2>
                    {renderVerificationBadge(selected.verification_tier, true)}
                  </div>
                  {selected.aggregate_rating?.ratingValue > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-amber-400">★</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selected.aggregate_rating.ratingValue.toFixed(1)}</span>
                      <span className="text-sm text-gray-400">({selected.review_count} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none" aria-label="Close">&times;</button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {selected.years_experience && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Experience</p>
                    <p className="font-medium text-gray-900 dark:text-white mt-0.5">{selected.years_experience} yrs</p>
                  </div>
                )}
                {selected.knowslanguage?.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Languages</p>
                    <p className="font-medium text-gray-900 dark:text-white mt-0.5">{selected.knowslanguage.join(', ')}</p>
                  </div>
                )}
              </div>
              {selected.specialisations?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Specialisations</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selected.specialisations) ? selected.specialisations : [selected.specialisations]).map((s, i) => (
                      <span key={i} className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {selected.services_offered?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selected.services_offered) ? selected.services_offered : [selected.services_offered]).map((s, i) => (
                      <span key={i} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {selected.license_type && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Licence</h3>
                  <p className="text-gray-600 dark:text-gray-300">{selected.license_type}{selected.license_number ? ` — #${selected.license_number}` : ''}</p>
                </div>
              )}
              <div className="flex items-center gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                {renderVerificationBadge(selected.verification_tier, true)}
                <span className="text-sm text-gray-500 dark:text-gray-400">— verified on Mukoko platform</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Contact</h3>
                <div className="flex flex-wrap gap-3">
                  {selected.booking_url && (
                    <a href={selected.booking_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">Book</a>
                  )}
                  <a href={`https://business.mukoko.com/professional/${selected.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 border border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-sm font-medium">
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
