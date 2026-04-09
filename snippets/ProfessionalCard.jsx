import React, { useState, useEffect } from 'react';
import { supabase, expertCategories } from './supabase.js';
import { VerificationBadge } from './VerificationBadge.jsx';
/**
 * ProfessionalCard — embedded profile card for a single professional
 *
 * Fetches one professional from hospitality.professional + identity.person
 * and renders a rich profile card inline in an MDX article.
 *
 * Usage in MDX:
 *   import { ProfessionalCard } from '/snippets/ProfessionalCard.jsx';
 *   <ProfessionalCard personId="uuid-of-person" />
 *   <ProfessionalCard professionalId="uuid-of-professional-record" />
 *
 * Props:
 *   personId       — UUID from identity.person (preferred)
 *   professionalId — UUID from hospitality.professional (alternative)
 *   compact        — render a smaller inline card (default: false)
 */
export const ProfessionalCard = ({ personId, professionalId, compact = false }) => {
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!personId && !professionalId) {
      setError('ProfessionalCard requires personId or professionalId prop.');
      setLoading(false);
      return;
    }
    fetchProfessional();
  }, [personId, professionalId]);
  const fetchProfessional = async () => {
    try {
      setLoading(true);
      setError(null);
      let query = supabase
        .schema('hospitality')
        .from('professional')
        .select(`
          id,
          occupation_type,
          specialisations,
          years_experience,
          license_type,
          license_number,
          services_offered,
          booking_url,
          verification_tier,
          aggregate_rating,
          review_count,
          available_for_hire,
          person:person_id (
            id,
            name,
            image,
            email,
            telephone,
            description,
            bio,
            knowslanguage,
            portfolio_url,
            url
          )
        `)
        .single();
      if (personId) {
        query = query.eq('person_id', personId);
      } else {
        query = query.eq('id', professionalId);
      }
      const { data, error: err } = await query;
      if (err) throw err;
      setProfessional(data);
    } catch (err) {
      setError('Unable to load professional profile.');
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-32" />
    );
  }
  if (error || !professional) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
        <p className="text-sm text-red-600 dark:text-red-400">{error || 'Professional not found.'}</p>
      </div>
    );
  }
  const {
    person, occupation_type, specialisations, years_experience,
    license_type, license_number, services_offered, booking_url,
    verification_tier, aggregate_rating, review_count, available_for_hire,
  } = professional;
  const ratingValue = aggregate_rating?.ratingValue;
  const bio = person?.bio || person?.description;
  const languages = person?.knowslanguage;
  const website = person?.portfolio_url || person?.url;
  const category = expertCategories[occupation_type] || { label: occupation_type || 'Guide', icon: 'user' };
  const name = person?.name || 'Unknown';
  const image = person?.image;
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        {image ? (
          <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{name.charAt(0)}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-900 dark:text-white">{name}</span>
            <VerificationBadge tier={verification_tier} size="sm" />
          </div>
          <p className="text-sm text-primary-600 dark:text-primary-400">{category.label}</p>
          {languages && languages.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{languages.join(', ')}</p>
          )}
        </div>
        <a
          href={`https://business.mukoko.com/professional/${professional.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex-shrink-0"
        >
          View →
        </a>
      </div>
    );
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-start gap-4">
        {image ? (
          <img src={image} alt={name} className="w-20 h-20 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">{name.charAt(0)}</span>
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h3>
            <VerificationBadge tier={verification_tier} size="md" showLabel={true} />
          </div>
          <p className="text-primary-600 dark:text-primary-400 font-medium mt-0.5">{category.label}</p>
          <div className="flex flex-wrap items-center gap-4 mt-2">
            {ratingValue > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                <span className="text-amber-400">★</span>
                {ratingValue.toFixed(1)} ({review_count} reviews)
              </span>
            )}
            {years_experience && (
              <span className="text-sm text-gray-500 dark:text-gray-400">{years_experience} yrs experience</span>
            )}
            {available_for_hire && (
              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                Available for hire
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Specialisations */}
      {specialisations && specialisations.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(specialisations) ? specialisations : [specialisations]).map((s, i) => (
              <span key={i} className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Bio */}
      {bio && (
        <div className="px-6 pb-4">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{bio}</p>
        </div>
      )}
      {/* Languages */}
      {languages && languages.length > 0 && (
        <div className="px-6 pb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Languages: </span>
            {languages.join(', ')}
          </p>
        </div>
      )}
      {/* Licence */}
      {license_type && (
        <div className="px-6 pb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Licence: </span>
            {license_type}{license_number ? ` — #${license_number}` : ''}
          </p>
        </div>
      )}
      {/* Footer actions */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex flex-wrap gap-3 bg-gray-50 dark:bg-gray-800/50">
        {person?.email && (
          <a href={`mailto:${person.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
            Email
          </a>
        )}
        {person?.telephone && (
          <a
            href={`https://wa.me/${person.telephone.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            WhatsApp
          </a>
        )}
        {booking_url && (
          <a href={booking_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">
            Book
          </a>
        )}
        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
            Website
          </a>
        )}
        <a
          href={`https://business.mukoko.com/professional/${professional.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-sm font-medium ml-auto"
        >
          Full profile on Mukoko →
        </a>
      </div>
    </div>
  );
};
