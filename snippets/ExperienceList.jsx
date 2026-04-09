'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase.js';
import { VerificationBadge } from './VerificationBadge.jsx';

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

const ActivityBadge = ({ activityType }) => {
  const colors = {
    'Wildlife Viewing': 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    'Water Sport': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    'Hiking': 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300',
    'Cultural': 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    'Adventure': 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    'Scenic': 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300',
    'default': 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300',
  };

  const colorClass = colors[activityType] || colors.default;

  return <span className={`text-xs px-3 py-1 rounded-full font-medium ${colorClass}`}>{activityType}</span>;
};

export const ExperienceList = ({ placeId, limit = 8 }) => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const { data, error: queryError } = await supabase
          .schema('hospitality')
          .from('experience')
          .select('*')
          .eq('place_id', placeId)
          .limit(limit);

        if (queryError) throw queryError;

        setExperiences(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (placeId) {
      fetchExperiences();
    }
  }, [placeId, limit]);

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
        <p className="font-semibold">Unable to load experiences</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">No experiences available at this location.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {experiences.map((experience) => (
        <div
          key={experience.id}
          className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-md dark:hover:shadow-black/50 transition-shadow bg-white dark:bg-gray-950"
        >
          {experience.images && experience.images.length > 0 && (
            <div className="relative h-40 bg-gray-200 dark:bg-gray-800 overflow-hidden">
              <img
                src={experience.images[0]}
                alt={experience.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-5 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{experience.name}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <ActivityBadge activityType={experience.activity_type} />
                {experience.verification_tier && (
                  <VerificationBadge tier={experience.verification_tier} compact={true} />
                )}
              </div>
            </div>

            {experience.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{experience.description}</p>
            )}

            {experience.aggregate_rating?.ratingValue > 0 && (
              <StarRating rating={experience.aggregate_rating.ratingValue} count={experience.review_count} />
            )}

            <div className="grid grid-cols-3 gap-3 text-sm">
              {experience.duration_hours && (
                <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                  <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold">Duration</p>
                  <p className="text-gray-900 dark:text-white font-semibold">{experience.duration_hours}h</p>
                </div>
              )}

              {experience.price_usd && (
                <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                  <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold">Price</p>
                  <p className="text-gray-900 dark:text-white font-semibold">${experience.price_usd}</p>
                </div>
              )}

              {experience.max_group_size && (
                <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                  <p className="text-gray-600 dark:text-gray-400 text-xs font-semibold">Group Size</p>
                  <p className="text-gray-900 dark:text-white font-semibold">Max {experience.max_group_size}</p>
                </div>
              )}
            </div>

            {(experience.languages_offered || experience.includes) && (
              <div className="border-t border-gray-200 dark:border-gray-800 pt-3 space-y-3">
                {experience.languages_offered && experience.languages_offered.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Languages</p>
                    <div className="flex gap-1 flex-wrap">
                      {experience.languages_offered.map((language, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {experience.includes && experience.includes.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Includes</p>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      {experience.includes.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="text-teal-600 dark:text-teal-400">✓</span>
                          {item}
                        </li>
                      ))}
                      {experience.includes.length > 3 && (
                        <li className="text-gray-600 dark:text-gray-400">+{experience.includes.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {experience.requires_booking && experience.booking_url && (
              <a
                href={experience.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded font-semibold transition-colors"
              >
                Book Experience
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
