import React, { useState, useEffect, useCallback } from 'react';
import { supabase, expertCategories } from './supabase.js';
import { VerificationBadge } from './VerificationBadge.jsx';
// ---------------------------------------------------------------------------
// Professional detail modal
// ---------------------------------------------------------------------------
const ProfessionalModal = ({ professional, onClose }) => {
  if (!professional) return null;
  const {
    person, occupation_type, specialisations, years_experience,
    license_type, license_number, services_offered, booking_url,
    verification_tier, aggregate_rating, review_count,
  } = professional;
  const ratingValue = aggregate_rating?.ratingValue;
  const bio = person?.bio || person?.description;
  const languages = person?.knowslanguage;
  const website = person?.portfolio_url || person?.url;
  const category = expertCategories[occupation_type] || { label: occupation_type || 'Guide', icon: 'user' };
  const name = person?.name || 'Unknown';
  const image = person?.image;
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-5 flex justify-between items-start">
          <div className="flex items-center gap-4">
            {image ? (
              <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{name}</h2>
                <VerificationBadge tier={verification_tier} size="md" />
              </div>
              <p className="text-primary-600 dark:text-primary-400 font-medium">{category.label}</p>
              {ratingValue > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-amber-400">★</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {ratingValue.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-400">({review_count} reviews)</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {years_experience && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Experience</p>
                <p className="font-medium text-gray-900 dark:text-white mt-0.5">{years_experience} yrs</p>
              </div>
            )}
            {languages && languages.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Languages</p>
                <p className="font-medium text-gray-900 dark:text-white mt-0.5">{languages.join(', ')}</p>
              </div>
            )}
          </div>
          {specialisations && specialisations.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Specialisations
              </h3>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(specialisations) ? specialisations : [specialisations]).map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {bio && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">About</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{bio}</p>
            </div>
          )}
          {services_offered && services_offered.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Services</h3>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(services_offered) ? services_offered : [services_offered]).map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}
          {license_type && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Licence</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {license_type}{license_number ? ` — #${license_number}` : ''}
              </p>
            </div>
          )}
          <div className="flex items-center gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <VerificationBadge tier={verification_tier} size="md" showLabel={true} />
            <span className="text-sm text-gray-500 dark:text-gray-400">— verified on Mukoko platform</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Contact</h3>
            <div className="flex flex-wrap gap-3">
              {person?.email && (
                <a
                  href={`mailto:${person.email}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
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
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              )}
              {booking_url && (
                <a
                  href={booking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                >
                  Book
                </a>
              )}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Website
                </a>
              )}
              <a
                href={`https://business.mukoko.com/professional/${professional.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-sm font-medium"
              >
                View full profile →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// ---------------------------------------------------------------------------
// Professional card (grid item)
// ---------------------------------------------------------------------------
const ProfessionalCard = ({ professional, onClick }) => {
  const { person, occupation_type, years_experience, verification_tier, aggregate_rating, review_count, featured } = professional;
  const ratingValue = aggregate_rating?.ratingValue;
  const category = expertCategories[occupation_type] || { label: occupation_type || 'Guide', icon: 'user' };
  const name = person?.name || 'Unknown';
  const image = person?.image;
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all cursor-pointer relative"
    >
      {featured && (
        <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">
          Featured
        </span>
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
            <VerificationBadge tier={verification_tier} size="sm" />
          </div>
          <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{category.label}</p>
          <div className="flex items-center gap-3 mt-1">
            {years_experience && (
              <span className="text-xs text-gray-400 dark:text-gray-500">{years_experience} yrs exp</span>
            )}
            {ratingValue > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-0.5">
                <span className="text-amber-400">★</span>
                {ratingValue.toFixed(1)} ({review_count})
              </span>
            )}
          </div>
        </div>
      </div>
      {(person?.bio || person?.description) && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{person.bio || person.description}</p>
      )}
    </div>
  );
};
// ---------------------------------------------------------------------------
// ExpertDirectory — queries hospitality.professional JOIN identity.person
// ---------------------------------------------------------------------------
export const ExpertDirectory = ({ showFilters = true, category: initialCategory = null }) => {
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
      const { data, error: err } = await supabase
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
          featured,
          is_active,
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
        .eq('is_active', true)
        .order('featured', { ascending: false })
        .order('review_count', { ascending: false });
      if (err) throw err;
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
      {/* Filters */}
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
      {/* Stats */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {filtered.length} professional{filtered.length !== 1 ? 's' : ''} found
      </p>
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button onClick={fetchProfessionals} className="mt-2 text-sm text-red-600 dark:text-red-400 underline">Try again</button>
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
          {filtered.map((p) => (
            <ProfessionalCard key={p.id} professional={p} onClick={() => setSelected(p)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No professionals found matching your search.</p>
        </div>
      )}
      {selected && (
        <ProfessionalModal professional={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};
