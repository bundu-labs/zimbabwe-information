'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase.js';

const StarRating = ({ rating, showCount = true, count = null }) => {
  if (!rating && rating !== 0) return null;
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const hasHalf = roundedRating % 1 !== 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-lg text-amber-400">
            {i < fullStars ? '★' : hasHalf && i === fullStars ? '⋆' : '☆'}
          </span>
        ))}
      </div>
      {showCount && count !== null && <span className="text-sm text-gray-600 dark:text-gray-400">({count})</span>}
    </div>
  );
};

export const ReviewSummary = ({ entityId, entitySchema, maxReviews = 3 }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        const { data, error: queryError } = await supabase
          .schema('engagement')
          .from('review')
          .select(
            `
            id,
            rating,
            headline,
            body,
            author_person_id,
            created_at,
            moderation_status,
            helpful_count,
            identity_person:author_person_id(name, image)
          `
          )
          .eq('item_reviewed_schema', entitySchema)
          .eq('item_reviewed_id', entityId)
          .eq('moderation_status', 'approved')
          .order('created_at', { ascending: false })
          .limit(maxReviews);

        if (queryError) throw queryError;

        setReviews(data || []);

        if (data && data.length > 0) {
          const avgRating = data.reduce((sum, review) => sum + (review.rating || 0), 0) / data.length;
          setAverageRating(avgRating);
        }

        const { count, error: countError } = await supabase
          .schema('engagement')
          .from('review')
          .select('id', { count: 'exact', head: true })
          .eq('item_reviewed_schema', entitySchema)
          .eq('item_reviewed_id', entityId)
          .eq('moderation_status', 'approved');

        if (!countError && count !== null) {
          setReviewCount(count);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (entityId && entitySchema) {
      fetchReviews();
    }
  }, [entityId, entitySchema, maxReviews]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin h-6 w-6 border-3 border-gray-300 dark:border-gray-600 border-t-teal-500 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
        <p className="font-semibold text-sm">Unable to load reviews</p>
      </div>
    );
  }

  if (reviewCount === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">No reviews available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {averageRating !== null && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
          <div className="flex items-end gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold mb-2">Overall Rating</p>
              <StarRating rating={averageRating} showCount={false} />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {averageRating.toFixed(1)} out of 5 ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
              </p>
            </div>
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Recent Reviews</h3>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {review.identity_person?.image && (
                      <img
                        src={review.identity_person.image}
                        alt={review.identity_person.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">
                        {review.identity_person?.name || 'Anonymous'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <StarRating rating={review.rating} showCount={false} />
              </div>

              {review.headline && (
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{review.headline}</p>
              )}

              {review.body && (
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{review.body}</p>
              )}

              {review.helpful_count > 0 && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {review.helpful_count} {review.helpful_count === 1 ? 'person' : 'people'} found this helpful
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {reviewCount > maxReviews && (
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {reviews.length} of {reviewCount} reviews
          </p>
        </div>
      )}
    </div>
  );
};
