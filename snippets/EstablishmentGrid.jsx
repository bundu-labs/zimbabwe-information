import { useEffect, useState } from 'react';
import { supabase } from './supabase.js';
import { VerificationBadge } from './VerificationBadge.jsx';
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
                {establishment.verification_tier && (
                  <VerificationBadge tier={establishment.verification_tier} compact={true} />
                )}
              </div>
            </div>
            {establishment.aggregate_rating?.ratingValue > 0 && (
              <StarRating rating={establishment.aggregate_rating.ratingValue} count={establishment.review_count} />
            )}
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
