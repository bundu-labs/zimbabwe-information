import { useState, useEffect, useCallback } from 'react';
import { supabase, businessCategories, verificationTiers } from './supabase.js';
// ---------------------------------------------------------------------------
// renderBadge — inline verification badge (avoids cross-snippet JSX import)
// ---------------------------------------------------------------------------
const renderBadge = (tier = 'unverified', size = 'md', showLabel = false) => {
  const tierInfo = verificationTiers[tier] || verificationTiers.unverified;
  const sizes = {
    sm: { badge: 'w-4 h-4', text: 'text-xs', gap: 'gap-1' },
    md: { badge: 'w-5 h-5', text: 'text-sm', gap: 'gap-1.5' },
    lg: { badge: 'w-6 h-6', text: 'text-base', gap: 'gap-2' },
  };
  const s = sizes[size] || sizes.md;
  const icons = {
    circle: <circle cx="12" cy="12" r="9" strokeWidth="2" stroke="currentColor" fill="none" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    phone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />,
    'shield-check': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    award: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
  };
  return (
    <span className={`inline-flex items-center ${s.gap} flex-shrink-0`} title={`${tierInfo.label}${tierInfo.mineral ? ` — ${tierInfo.mineral}` : ''}`}>
      <svg className={`${s.badge} flex-shrink-0`} style={{ color: tierInfo.darkColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label={`${tierInfo.label} verification`}>
        {icons[tierInfo.icon] || icons.circle}
      </svg>
      {showLabel && <span className={`${s.text} font-medium`} style={{ color: tierInfo.darkColor }}>{tierInfo.label}</span>}
    </span>
  );
};
// ---------------------------------------------------------------------------
// Price range indicator
// Called as PriceRange({...}) to avoid MDX component lookup.
// ---------------------------------------------------------------------------
const PriceRange = ({ range }) => {
  if (!range) return null;
  const levels = ['$', '$$', '$$$', '$$$$'];
  const current = levels.indexOf(range);
  if (current === -1) return <span className="text-sm text-gray-500 dark:text-gray-400">{range}</span>;
  return (
    <span className="text-sm">
      {levels.map((l, i) => (
        <span key={l} className={i <= current ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300 dark:text-gray-600'}>
          $
        </span>
      ))}
    </span>
  );
};
// Map commerce.local_business verification_status to badge tier
const statusToTier = (status) => {
  if (status === 'verified') return 'otp';
  return 'unverified';
};
// ---------------------------------------------------------------------------
// Business detail modal
// Called as BusinessModal({...}) to avoid MDX component lookup.
// ---------------------------------------------------------------------------
const BusinessModal = ({ business, onClose }) => {
  if (!business) return null;
  const { name, logo, description, businesstype, telephone, email, url,
          pricerange, verification_status, place } = business;
  const tier = statusToTier(verification_status);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-5 flex justify-between items-start">
          <div className="flex items-center gap-4">
            {logo ? (
              <img src={logo} alt={name} className="w-16 h-16 rounded-lg object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{name?.charAt(0)}</span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h2>
                {renderBadge(tier, 'md')}
              </div>
              {businesstype && (
                <p className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                  {businessCategories[businesstype]?.label || businesstype}
                </p>
              )}
              {place?.name && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{place.name}</p>
              )}
              {pricerange && (
                <div className="mt-1">
                  {PriceRange({ range: pricerange })}
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none" aria-label="Close">
            &times;
          </button>
        </div>
        {/* Body */}
        <div className="p-6 space-y-5">
          {description && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">About</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
            </div>
          )}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Contact & links</h3>
            <div className="flex flex-wrap gap-3">
              {email && (
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
              )}
              {telephone && (
                <a href={`tel:${telephone}`} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
                  </svg>
                  Call
                </a>
              )}
              {url && (
                <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Website
                </a>
              )}
              <a
                href={`https://business.mukoko.com/business/${business.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-sm font-medium"
              >
                View full profile →
              </a>
              {place?.id && (
                <a
                  href={`https://travel.mukoko.com/place/${place.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  View on map →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// ---------------------------------------------------------------------------
// Business card (grid item)
// Called as BusinessCard({...}) to avoid MDX component lookup.
// ---------------------------------------------------------------------------
const BusinessCard = ({ business, onClick }) => {
  const { name, logo, description, businesstype, pricerange, verification_status, place } = business;
  const tier = statusToTier(verification_status);
  const catInfo = businessCategories[businesstype] || { label: businesstype || 'Business' };
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all cursor-pointer"
    >
      <div className="flex items-start gap-3">
        {logo ? (
          <img src={logo} alt={name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{name?.charAt(0)}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{name}</h3>
            {renderBadge(tier, 'sm')}
          </div>
          <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{catInfo.label}</p>
          {place?.name && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{place.name}</p>
          )}
          {pricerange && (
            <div className="mt-1">
              {PriceRange({ range: pricerange })}
            </div>
          )}
        </div>
      </div>
      {description && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{description}</p>
      )}
    </div>
  );
};
// ---------------------------------------------------------------------------
// BusinessDirectory — queries commerce.local_business with place join
// ---------------------------------------------------------------------------
export const BusinessDirectory = ({ showFilters = true, category: initialCategory = null, placeId = null }) => {
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
      let query = supabase
        .schema('commerce')
        .from('local_business')
        .select(`
          id,
          name,
          alternatename,
          description,
          businesstype,
          place_id,
          telephone,
          email,
          url,
          logo,
          pricerange,
          verification_status,
          place:place_id (
            id,
            name,
            latitude,
            longitude
          )
        `)
        .order('name');
      if (placeId) {
        query = query.eq('place_id', placeId);
      }
      const { data, error: err } = await query.limit(50);
      if (err) throw err;
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
        b.description?.toLowerCase().includes(q) ||
        b.place?.name?.toLowerCase().includes(q)
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
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button onClick={fetchBusinesses} className="mt-2 text-sm text-red-600 dark:text-red-400 underline">Try again</button>
        </div>
      )}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-28" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => BusinessCard({ business: b, onClick: () => setSelected(b) }))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No businesses found matching your search.</p>
        </div>
      )}
      {selected && BusinessModal({ business: selected, onClose: () => setSelected(null) })}
    </div>
  );
};
