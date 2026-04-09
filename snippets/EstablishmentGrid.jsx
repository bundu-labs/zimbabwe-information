import { useEffect, useState } from 'react';
import { supabase, verificationTiers } from './supabase.js';
// ---------------------------------------------------------------------------
// renderBadge — inline verification badge (avoids cross-snippet JSX import)
// ---------------------------------------------------------------------------
const renderBadge = (tier = 'unverified', size = 'sm') => {
  const tierInfo = verificationTiers[tier] || verificationTiers.unverified;
  const sizes = {
    sm: { badge: 'w-4 h-4', text: 'text-xs', gap: 'gap-1' },
    md: { badge: 'w-5 h-5', text: 'text-sm', gap: 'gap-1.5' },
  };
  const s = sizes[size] || sizes.sm;
  const icons = {
    circle: <circle cx="12" cy="12" r="9" strokeWidth="2" stroke="currentColor" fill="none" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
    phone: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />,
    'shield-check': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    award: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
  };
  return (
    <span className={`inline-flex items-center ${s.gap} flex-shrink-0`} title={tierInfo.label}>
      <svg className={`${s.badge} flex-shrink-0`} style={{ color: tierInfo.darkColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label={`${tierInfo.label} verification`}>
        {icons[tierInfo.icon] || icons.circle}
      </svg>
    </span>
  );
};
const getPriceDisplay = (priceRange) => {
  const count = priceRange?.length || 0;
  return '$'.repeat(Math.min(count, 4)) || '$$';
};
const getSchemaTypeLabel = (schemaType) => {
  const labels = {
    LodgingBusiness: 'Accommodation',
    Restaurant: 'Restaurant',
    CafeOrCoffeeShop: 'Café',
    Bar: 'Bar',
    Bakery: 'Bakery',
    LocalBusiness: 'Business',
  };
  return labels[schemaType] || schemaType;
};
// StarRating — called as StarRating({...}) to avoid MDX component lookup
const StarRating = ({ rating, count }) => {
  if (!rating) return null;
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const hasHalf = roundedRating % 1 !== 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-amber-400">
            {i < fullStars ? '★' : hasHalf && i === fullStars ? '⋆' : '☆'}
          </span>
        ))}
      </div>
      {count && <span className="text-xs text-gray-600 dark:text-gray-400">({count})</span>}
    </div>
  );
};
export const EstablishmentGrid = ({ placeId, schemaType = null, limit = 6 }) => {
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchEstablishments = async () => {
      try {
        setLoading(true);
        let query = supabase.schema('hospitality').from('establishment').select('*').eq('place_id', placeId);
        if (schemaType) {
          query = query.eq('schema_type', schemaType);
        }
        const { data, error: queryError } = await query.limit(limit);
        if (queryError) throw queryError;
        setEstablishments(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (placeId) {
      fetchEstablishments();
    }
  }, [placeId, schemaType, limit]);
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 dark:border-gray-600 border-t-teal-500 rounded-full"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
        <p className="font-semibold">Unable to load establishments</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }
  if (establishments.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">No establishments found for this location.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {establishments.map((establishment) => (
        <div
          key={establishment.id}
          className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg dark:hover:shadow-black/50 transition-shadow bg-white dark:bg-gray-950"
        >
          {establishment.images && establishment.images.length > 0 && (
            <div className="relative h-32 bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <img
                src={establishment.images[0]}
                alt={establishment.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4 space-y-3">
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{establishment.name}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 rounded">
                  {getSchemaTypeLabel(establishment.schema_type)}
                </span>
                {establishment.verification_tier && renderBadge(establishment.verification_tier, 'sm')}
              </div>
            </div>
            {establishment.aggregate_rating?.ratingValue > 0 && StarRating({ rating: establishment.aggregate_rating.ratingValue, count: establishment.review_count })}
            {establishment.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{establishment.description}</p>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{getPriceDisplay(establishment.price_range)}</span>
              {establishment.star_rating && (
                <span className="font-semibold text-amber-600 dark:text-amber-400">{establishment.star_rating}★</span>
              )}
            </div>
            {establishment.amenity_features && establishment.amenity_features.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {establishment.amenity_features.slice(0, 3).map((amenity, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {amenity}
                  </span>
                ))}
                {establishment.amenity_features.length > 3 && (
                  <span className="text-xs px-2 py-1 text-gray-600 dark:text-gray-400">
                    +{establishment.amenity_features.length - 3}
                  </span>
                )}
              </div>
            )}
            <div className="pt-2 space-y-2 border-t border-gray-200 dark:border-gray-800">
              {establishment.booking_url && (
                <a
                  href={establishment.booking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center text-sm px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  Visit Website
                </a>
              )}
              <a
                href={`https://business.mukoko.com/business/${establishment.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded transition-colors font-semibold"
              >
                View on Mukoko
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
