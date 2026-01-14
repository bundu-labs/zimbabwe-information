'use client';

import React, { useState, useEffect } from 'react';
import { supabase, expertCategories, zimbabweRegions } from './supabase';

console.log('🔵 ExpertDirectory.jsx module loaded');

// Modal Component
const ExpertModal = ({ expert, onClose }) => {
  if (!expert) return null;

  const category = expertCategories[expert.category] || { label: expert.category, icon: 'user' };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-start">
          <div className="flex items-center gap-4">
            {expert.profile_image ? (
              <img
                src={expert.profile_image}
                alt={expert.full_name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {expert.full_name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{expert.full_name}</h2>
              <p className="text-primary-600 dark:text-primary-400">{category.label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{expert.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Experience</p>
              <p className="font-medium text-gray-900 dark:text-white">{expert.years_experience}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Languages</p>
              <p className="font-medium text-gray-900 dark:text-white">{expert.languages}</p>
            </div>
          </div>

          {/* Bio */}
          {expert.bio && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase mb-2">About</h3>
              <p className="text-gray-600 dark:text-gray-300">{expert.bio}</p>
            </div>
          )}

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase mb-2">Services Offered</h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{expert.services}</p>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase mb-2">Certifications</h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{expert.certifications}</p>
          </div>

          {/* Contact */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase mb-3">Contact</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${expert.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
              <a
                href={`https://wa.me/${expert.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              {expert.website && (
                <a
                  href={expert.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Website
                </a>
              )}
            </div>
          </div>

          {/* Verified Badge */}
          {expert.verified && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Verified Expert</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Expert Card Component
const ExpertCard = ({ expert, onClick }) => {
  const category = expertCategories[expert.category] || { label: expert.category, icon: 'user' };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all cursor-pointer"
    >
      <div className="flex items-start gap-3">
        {expert.profile_image ? (
          <img
            src={expert.profile_image}
            alt={expert.full_name}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {expert.full_name.charAt(0)}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{expert.full_name}</h3>
            {expert.verified && (
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <p className="text-sm text-primary-600 dark:text-primary-400">{category.label}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{expert.location}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{expert.years_experience} experience</p>
        </div>
      </div>
      {expert.bio && (
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{expert.bio}</p>
      )}
    </div>
  );
};

// Main Directory Component
export const ExpertDirectory = ({ showFilters = true, category: initialCategory = null }) => {
  console.log('✅ ExpertDirectory component rendering', { showFilters, initialCategory });

  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExpert, setSelectedExpert] = useState(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState(initialCategory || '');
  const [locationFilter, setLocationFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log('ExpertDirectory mounted, fetching experts...');
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('status', 'approved')
        .order('featured', { ascending: false })
        .order('verified', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExperts(data || []);
    } catch (err) {
      console.error('Error fetching experts:', err);
      setError('Unable to load experts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter experts
  const filteredExperts = experts.filter(expert => {
    if (categoryFilter && expert.category !== categoryFilter) return false;
    if (locationFilter && !expert.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        expert.full_name.toLowerCase().includes(query) ||
        expert.bio?.toLowerCase().includes(query) ||
        expert.services?.toLowerCase().includes(query) ||
        expert.location.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchExperts}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  console.log('ExpertDirectory state:', { loading, error, expertsCount: experts.length, filteredCount: filteredExperts.length });

  return (
    <div className="space-y-6">
      <div className="border-2 border-purple-500 p-2 mb-2">
        <p className="text-xs text-purple-600 dark:text-purple-400 font-mono">
          🔍 DEBUG: ExpertDirectory | Experts: {experts.length} | Filtered: {filteredExperts.length} | Loading: {loading.toString()}
        </p>
      </div>
      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search experts..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Categories</option>
                {Object.entries(expertCategories).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Locations</option>
                {zimbabweRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {filteredExperts.length} expert{filteredExperts.length !== 1 ? 's' : ''} found
      </p>

      {/* Expert Grid */}
      {filteredExperts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExperts.map(expert => (
            <ExpertCard
              key={expert.id}
              expert={expert}
              onClick={() => setSelectedExpert(expert)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No experts found matching your criteria.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Try adjusting your filters or check back later.
          </p>
        </div>
      )}

      {/* Modal */}
      {selectedExpert && (
        <ExpertModal
          expert={selectedExpert}
          onClose={() => setSelectedExpert(null)}
        />
      )}
    </div>
  );
}
