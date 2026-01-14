'use client';

import React, { useState, useEffect } from 'react';
import { supabase, businessCategories, accommodationSubcategories, zimbabweRegions } from './supabase';

// Modal Component
const BusinessModal = ({ business, onClose }) => {
  if (!business) return null;

  const category = businessCategories[business.category] || { label: business.category, icon: 'building' };
  const subcategory = business.subcategory ? accommodationSubcategories[business.subcategory] : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-start">
          <div className="flex items-center gap-4">
            {business.logo_url ? (
              <img
                src={business.logo_url}
                alt={business.business_name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {business.business_name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{business.business_name}</h2>
                {business.verified && (
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-primary-600 dark:text-primary-400">
                {subcategory ? subcategory.label : category.label}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{business.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Images Gallery */}
        {business.images && business.images.length > 0 && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-2 overflow-x-auto">
              {business.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${business.business_name} ${idx + 1}`}
                  className="h-32 w-auto rounded-lg object-cover flex-shrink-0"
                />
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Category</p>
              <p className="font-medium text-gray-900 dark:text-white">{category.label}</p>
            </div>
            {subcategory && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{subcategory.label}</p>
              </div>
            )}
            {business.price_range && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Price Range</p>
                <p className="font-medium text-gray-900 dark:text-white capitalize">{business.price_range}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase mb-2">About</h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{business.description}</p>
          </div>

          {/* Amenities */}
          {business.amenities && business.amenities.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase mb-2">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {business.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase mb-3">Contact</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Contact: {business.contact_person}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${business.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
              <a
                href={`tel:${business.phone}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call
              </a>
              {business.website && (
                <a
                  href={business.website}
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
          {business.verified && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Verified Business</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Business Card Component
const BusinessCard = ({ business, onClick }) => {
  const category = businessCategories[business.category] || { label: business.category, icon: 'building' };
  const subcategory = business.subcategory ? accommodationSubcategories[business.subcategory] : null;

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600 transition-all cursor-pointer"
    >
      {/* Image */}
      {business.images && business.images.length > 0 ? (
        <img
          src={business.images[0]}
          alt={business.business_name}
          className="w-full h-40 object-cover"
        />
      ) : business.logo_url ? (
        <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <img
            src={business.logo_url}
            alt={business.business_name}
            className="max-h-24 max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 flex items-center justify-center">
          <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
            {business.business_name.charAt(0)}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{business.business_name}</h3>
            <p className="text-sm text-primary-600 dark:text-primary-400">
              {subcategory ? subcategory.label : category.label}
            </p>
          </div>
          {business.verified && (
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{business.location}</p>
        {business.description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{business.description}</p>
        )}
        {business.price_range && (
          <span className="inline-block mt-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400 capitalize">
            {business.price_range}
          </span>
        )}
      </div>
    </div>
  );
};

// Main Directory Component
export const BusinessDirectory = ({
  showFilters = true,
  category: initialCategory = null,
  subcategory: initialSubcategory = null
}) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState(initialCategory || '');
  const [subcategoryFilter, setSubcategoryFilter] = useState(initialSubcategory || '');
  const [locationFilter, setLocationFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('status', 'approved')
        .order('featured', { ascending: false })
        .order('verified', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBusinesses(data || []);
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setError('Unable to load businesses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter businesses
  const filteredBusinesses = businesses.filter(business => {
    if (categoryFilter && business.category !== categoryFilter) return false;
    if (subcategoryFilter && business.subcategory !== subcategoryFilter) return false;
    if (locationFilter && !business.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        business.business_name.toLowerCase().includes(query) ||
        business.description?.toLowerCase().includes(query) ||
        business.location.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Category tabs for accommodation
  const showSubcategoryTabs = categoryFilter === 'accommodation';

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
          onClick={fetchBusinesses}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                placeholder="Search businesses..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setSubcategoryFilter('');
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Categories</option>
                {Object.entries(businessCategories).map(([key, { label }]) => (
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

          {/* Subcategory tabs for accommodation */}
          {showSubcategoryTabs && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setSubcategoryFilter('')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  subcategoryFilter === ''
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                All Types
              </button>
              {Object.entries(accommodationSubcategories).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setSubcategoryFilter(key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    subcategoryFilter === key
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? 'es' : ''} found
      </p>

      {/* Business Grid */}
      {filteredBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map(business => (
            <BusinessCard
              key={business.id}
              business={business}
              onClick={() => setSelectedBusiness(business)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No businesses found matching your criteria.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Try adjusting your filters or check back later.
          </p>
        </div>
      )}

      {/* Modal */}
      {selectedBusiness && (
        <BusinessModal
          business={selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
        />
      )}
    </div>
  );
}
