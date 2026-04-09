import { useState, useEffect, useCallback } from 'react';

export const ExpertDirectory = ({ showFilters = true, category: initialCategory = null }) => {
  // ALL constants inside the function — Mintlify evals only the component body,
  // so module-level variables are out of scope at runtime.
  const SUPABASE_URL = 'https://tdcpuzqyoodrdsxldgsh.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_aNdSABNOLB3sG7OMjHN0Vw_5SDouXAL';

  const verificationTiers = {
    unverified: { label: 'Unverified',   icon: 'circle',       mineral: null,         darkColor: '#6B6B66' },
    community:  { label: 'Community',    icon: 'users',        mineral: 'Terracotta', darkColor: '#D4A574' },
    otp:        { label: 'OTP Verified', icon: 'phone',        mineral: 'Cobalt',     darkColor: '#00B0FF' },
    government: { label: 'Government',   icon: 'shield-check', mineral: 'Gold',       darkColor: '#FFD740' },
    licensed:   { label: 'Licensed',     icon: 'award',        mineral: 'Tanzanite',  darkColor: '#B388FF' },
  };

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

  const renderBadge = (tier = 'unverified', size = 'md', showLabel = false) => {
    const tierInfo = verificationTiers[tier] || verificationTiers.unverified;
    const sizes = {
      sm: { badge: 'w-4 h-4', text: 'text-xs', gap: 'gap-1' },
      md: { badge: 'w-5 h-5', text: 'text-sm', gap: 'gap-1.5' },
      lg: { badge: 'w-6 h-6', text: 'text-base', gap: 'gap-2' },
    };
    const s = sizes[size] || sizes.md;
    const iconPath = {
      circle:         <circle cx="12" cy="12" r="9" strokeWidth="2" stroke="currentColor" fill="none" />,
      phone:          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />,
      users:          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
      'shield-check': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
      award:          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
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
        `?select=id,occupation_type,specialisations,years_experience,license_type,license_number,` +
        `services_offered,booking_url,verification_tier,aggregate_rating,review_count,featured,is_active,` +
        `person:person_id(id,name,image,email,telephone,description,bio,knowslanguage,portfolio_url,url)` +
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
        p.person?.name?.toLowerCase().includes(q) ||
        p.person?.bio?.toLowerCase().includes(q) ||
        p.person?.description?.toLowerCase().includes(q) ||
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-32" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const name = p.person?.name || 'Unknown';
            const image = p.person?.image;
            const cat = expertCategories[p.occupation_type] || { label: p.occupation_type || 'Guide' };
            const rating = p.aggregate_rating?.ratingValue;
            return (
              <div
                key={p.id}
                onClick={() => setSelected(p)}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all cursor-pointer relative"
              >
                {p.featured && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">Featured</span>
                )}
                <div className="flex items-start gap-3">
                  {image ? (
                    <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{name}</h3>
                      {renderBadge(p.verification_tier, 'sm')}
                    </div>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{cat.label}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {p.years_experience && <span className="text-xs text-gray-400 dark:text-gray-500">{p.years_experience} yrs exp</span>}
                      {rating > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-0.5">
                          <span className="text-amber-400">★</span>{rating.toFixed(1)} ({p.review_count})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {(p.person?.bio || p.person?.description) && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{p.person.bio || p.person.description}</p>
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
                {selected.person?.image ? (
                  <img src={selected.person.image} alt={selected.person?.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{(selected.person?.name || 'U').charAt(0)}</span>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selected.person?.name}</h2>
                    {renderBadge(selected.verification_tier, 'md')}
                  </div>
                  <p className="text-primary-600 dark:text-primary-400 font-medium">
                    {(expertCategories[selected.occupation_type] || { label: selected.occupation_type || 'Guide' }).label}
                  </p>
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
                {selected.person?.knowslanguage?.length > 0 && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Languages</p>
                    <p className="font-medium text-gray-900 dark:text-white mt-0.5">{selected.person.knowslanguage.join(', ')}</p>
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
              {(selected.person?.bio || selected.person?.description) && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">About</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{selected.person.bio || selected.person.description}</p>
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
                {renderBadge(selected.verification_tier, 'md', true)}
                <span className="text-sm text-gray-500 dark:text-gray-400">— verified on Mukoko platform</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Contact</h3>
                <div className="flex flex-wrap gap-3">
                  {selected.person?.email && (
                    <a href={`mailto:${selected.person.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      Email
                    </a>
                  )}
                  {selected.person?.telephone && (
                    <a href={`https://wa.me/${selected.person.telephone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  )}
                  {selected.booking_url && (
                    <a href={selected.booking_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">Book</a>
                  )}
                  {(selected.person?.portfolio_url || selected.person?.url) && (
                    <a href={selected.person.portfolio_url || selected.person.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">Website</a>
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
