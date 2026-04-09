'use client';
import { useState, useEffect, useCallback } from 'react';

export const AccommodationDirectory = ({ region: initialRegion = null, showFilters = true }) => {
  const SUPABASE_URL = 'https://tdcpuzqyoodrdsxldgsh.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_aNdSABNOLB3sG7OMjHN0Vw_5SDouXAL';

  const verificationTiers = {
    unverified: { label: 'Unverified',   color: '#6B7280' },
    community:  { label: 'Community',    color: '#D4A574' },
    otp:        { label: 'OTP Verified', color: '#00B0FF' },
    government: { label: 'Government',   color: '#FFD740' },
    licensed:   { label: 'Licensed',     color: '#B388FF' },
  };

  const accommodationSubtypes = {
    LodgingBusiness: { label: 'All Accommodation', icon: '🏨' },
  };

  const amenityIcons = {
    has_pool:            { icon: '🏊', label: 'Pool' },
    has_wifi:            { icon: '📶', label: 'WiFi' },
    has_restaurant:      { icon: '🍽️', label: 'Restaurant' },
    has_bar:             { icon: '🍸', label: 'Bar' },
    has_spa:             { icon: '💆', label: 'Spa' },
    has_gym:             { icon: '🏋️', label: 'Gym' },
    has_generator:       { icon: '⚡', label: 'Generator' },
    has_conference_room: { icon: '💼', label: 'Conference' },
    has_airstrip:        { icon: '✈️', label: 'Airstrip' },
    is_child_friendly:   { icon: '👶', label: 'Child Friendly' },
    pets_allowed:        { icon: '🐾', label: 'Pets OK' },
  };

  const priceRangeLabels = {
    '$':    'Budget (under $50/night)',
    '$$':   'Mid-range ($50–$150/night)',
    '$$$':  'Upmarket ($150–$350/night)',
    '$$$$': 'Luxury ($350+/night)',
  };

  const statusToTier = (status) => {
    if (status === 'verified') return 'otp';
    return 'unverified';
  };

  const renderStars = (starRating) => {
    if (!starRating) return null;
    const value = typeof starRating === 'object' ? starRating.ratingValue : Number(starRating);
    if (!value || value < 1) return null;
    const stars = Math.round(value);
    return (
      <span className="text-yellow-400 text-sm" title={`${value} star${value !== 1 ? 's' : ''}`}>
        {'★'.repeat(stars)}{'☆'.repeat(Math.max(0, 5 - stars))}
      </span>
    );
  };

  const [listings, setListings] = useState([]);
  const [establishments, setEstablishments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  const fetchAccommodation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: fetch local_business records for accommodation
      let url =
        `${SUPABASE_URL}/rest/v1/local_business` +
        `?select=id,name,alternatename,description,place_id,telephone,email,url,logo,pricerange,verification_status` +
        `&businesstype=eq.LodgingBusiness&order=name.asc&limit=50`;

      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Accept-Profile': 'commerce',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setListings(data || []);

      // Step 2: fetch hospitality.establishment records for those IDs
      if (data && data.length > 0) {
        const ids = data.map((b) => b.id).join(',');
        const estUrl =
          `${SUPABASE_URL}/rest/v1/establishment` +
          `?select=id,local_business_id,star_rating,number_of_rooms,checkin_time,checkout_time,` +
          `meal_plans,has_pool,has_wifi,has_restaurant,has_bar,has_spa,has_gym,has_generator,` +
          `has_laundry,has_parking,has_conference_room,has_airstrip,is_child_friendly,pets_allowed,` +
          `price_range,price_range_min,price_range_max,booking_url,cover_image,featured,aggregate_rating` +
          `&local_business_id=in.(${ids})`;
        try {
          const estRes = await fetch(estUrl, {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
              'Accept-Profile': 'hospitality',
            },
          });
          if (estRes.ok) {
            const estData = await estRes.json();
            const estMap = {};
            (estData || []).forEach((e) => { estMap[e.local_business_id] = e; });
            setEstablishments(estMap);
          }
        } catch (_) {
          // establishment data is optional — continue without it
        }
      }
    } catch (err) {
      setError('Unable to load accommodation. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAccommodation(); }, [fetchAccommodation]);

  const filtered = listings.filter((b) => {
    if (priceFilter && b.pricerange !== priceFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return b.name?.toLowerCase().includes(q) || b.description?.toLowerCase().includes(q);
    }
    return true;
  });

  const renderAmenities = (est, compact = false) => {
    if (!est) return null;
    const active = Object.entries(amenityIcons).filter(([key]) => est[key]);
    if (active.length === 0) return null;
    const show = compact ? active.slice(0, 4) : active;
    return (
      <div className={`flex flex-wrap gap-1 ${compact ? 'mt-2' : 'mt-3'}`}>
        {show.map(([key, { icon, label }]) => (
          <span key={key} className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-300" title={label}>
            {icon} {!compact && <span>{label}</span>}
          </span>
        ))}
        {compact && active.length > 4 && (
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-500 dark:text-gray-400">+{active.length - 4}</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Search accommodation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">All price ranges</option>
            {Object.entries(priceRangeLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {filtered.length} propert{filtered.length !== 1 ? 'ies' : 'y'} found
      </p>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">Couldn't load properties</p>
            <p className="text-sm text-red-600 dark:text-red-500 mt-0.5">{error}</p>
            <button onClick={fetchAccommodation} className="mt-2 text-sm font-medium text-red-700 dark:text-red-400 underline">Try again</button>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-48" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filtered.map((b) => {
            const est = establishments[b.id];
            const tier = statusToTier(b.verification_status);
            const tierInfo = verificationTiers[tier];
            const coverImg = est?.cover_image || b.logo;
            return (
              <div
                key={b.id}
                onClick={() => setSelected(b)}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all cursor-pointer"
              >
                {/* Cover image or placeholder */}
                <div className="h-36 bg-gradient-to-br from-primary-100 to-teal-100 dark:from-primary-900/30 dark:to-teal-900/30 flex items-center justify-center overflow-hidden">
                  {coverImg ? (
                    <img src={coverImg} alt={b.name} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-12 h-12 text-primary-300 dark:text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{b.name}</h3>
                      {est && renderStars(est.star_rating)}
                    </div>
                    <span className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: tierInfo.color }} title={tierInfo.label} />
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    {est?.number_of_rooms && (
                      <span>{est.number_of_rooms} rooms</span>
                    )}
                    {b.pricerange && (
                      <span className="font-medium text-gray-700 dark:text-gray-300">{b.pricerange}</span>
                    )}
                    {est?.price_range_min && !b.pricerange && (
                      <span>${est.price_range_min}–${est.price_range_max}/night</span>
                    )}
                  </div>
                  {b.description && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{b.description}</p>
                  )}
                  {renderAmenities(est, true)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (searchQuery || priceFilter) ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 font-medium">No properties match your search</p>
          <button
            onClick={() => { setSearchQuery(''); setPriceFilter(''); }}
            className="mt-4 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border border-primary-300 dark:border-primary-700 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="text-center py-14 bg-gradient-to-br from-primary-50 to-teal-50 dark:from-primary-900/20 dark:to-teal-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
            <svg className="w-7 h-7 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Be the first listed property</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-sm mx-auto">
            Own or manage a safari lodge, hotel, guesthouse, or camp? Get listed free and reach travelers planning their Zimbabwe trip.
          </p>
          <a
            href="/get-involved/business-partner-network"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            List your property
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      )}

      {/* Modal */}
      {selected && (() => {
        const est = establishments[selected.id];
        const tier = statusToTier(selected.verification_status);
        const tierInfo = verificationTiers[tier];
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelected(null)}>
            <div
              className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cover */}
              <div className="h-48 bg-gradient-to-br from-primary-200 to-teal-200 dark:from-primary-800 dark:to-teal-800 overflow-hidden">
                {(est?.cover_image || selected.logo) ? (
                  <img src={est?.cover_image || selected.logo} alt={selected.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selected.name}</h2>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tierInfo.color }} title={tierInfo.label} />
                  </div>
                  {est && renderStars(est.star_rating)}
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {est?.number_of_rooms && <span>{est.number_of_rooms} rooms</span>}
                    {selected.pricerange && <span className="font-medium text-primary-600 dark:text-primary-400">{selected.pricerange}/night</span>}
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

                {est && (est.checkin_time || est.checkout_time) && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Check-in / Check-out</h3>
                    <div className="flex gap-6 text-sm text-gray-700 dark:text-gray-300">
                      {est.checkin_time && <span>Check-in: <strong>{est.checkin_time}</strong></span>}
                      {est.checkout_time && <span>Check-out: <strong>{est.checkout_time}</strong></span>}
                    </div>
                  </div>
                )}

                {est && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Facilities</h3>
                    {renderAmenities(est, false)}
                  </div>
                )}

                {est?.meal_plans && est.meal_plans.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Meal Plans</h3>
                    <div className="flex flex-wrap gap-2">
                      {est.meal_plans.map((plan) => (
                        <span key={plan} className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">{plan}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Contact & booking</h3>
                  <div className="flex flex-wrap gap-3">
                    {est?.booking_url && (
                      <a href={est.booking_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                        Book Now
                      </a>
                    )}
                    {selected.email && (
                      <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
