import React, { useState, useEffect } from 'react';
import { supabase, expertCategories, verificationTiers } from './supabase.js';
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
            {renderBadge(verification_tier, 'sm')}
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
            {renderBadge(verification_tier, 'md', true)}
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
