'use client';

import React, { useState } from 'react';
import { supabase, businessCategories, accommodationSubcategories, zimbabweRegions } from './supabase';

export default function BusinessForm() {
  const [formData, setFormData] = useState({
    business_name: '',
    contact_person: '',
    email: '',
    phone: '',
    website: '',
    category: '',
    subcategory: '',
    location: '',
    description: '',
    target_travelers: '',
    listing_type: 'free',
    promotion_interest: false,
    price_range: '',
  });

  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Reset subcategory when category changes
      ...(name === 'category' && value !== 'accommodation' ? { subcategory: '' } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const { data, error } = await supabase
        .from('businesses')
        .insert([{
          ...formData,
          status: 'pending',
          verified: false,
        }])
        .select();

      if (error) throw error;

      setStatus('success');
      setFormData({
        business_name: '',
        contact_person: '',
        email: '',
        phone: '',
        website: '',
        category: '',
        subcategory: '',
        location: '',
        description: '',
        target_travelers: '',
        listing_type: 'free',
        promotion_interest: false,
        price_range: '',
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">Application Submitted!</h3>
        <p className="text-green-700 dark:text-green-300 mb-4">
          Thank you for submitting your business listing application. We'll review your submission and contact you within 3 business days.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === 'error' && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
        </div>
      )}

      <div>
        <label htmlFor="business_name" className="block text-sm font-medium mb-1">Business Name *</label>
        <input
          type="text"
          name="business_name"
          id="business_name"
          value={formData.business_name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Your business name"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact_person" className="block text-sm font-medium mb-1">Contact Person *</label>
          <input
            type="text"
            name="contact_person"
            id="contact_person"
            value={formData.contact_person}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Primary contact name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address *</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="business@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="+263 77 XXX XXXX"
          />
        </div>
        <div>
          <label htmlFor="website" className="block text-sm font-medium mb-1">Website (optional)</label>
          <input
            type="url"
            name="website"
            id="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="https://your-business.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">Business Category *</label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select category...</option>
            {Object.entries(businessCategories).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">Location/Region *</label>
          <select
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select location...</option>
            {zimbabweRegions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Show subcategory for accommodation */}
      {formData.category === 'accommodation' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium mb-1">Accommodation Type *</label>
            <select
              name="subcategory"
              id="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select type...</option>
              {Object.entries(accommodationSubcategories).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="price_range" className="block text-sm font-medium mb-1">Price Range</label>
            <select
              name="price_range"
              id="price_range"
              value={formData.price_range}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select price range...</option>
              <option value="budget">Budget</option>
              <option value="mid-range">Mid-Range</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="listing_type" className="block text-sm font-medium mb-1">Listing Type *</label>
        <select
          name="listing_type"
          id="listing_type"
          value={formData.listing_type}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="free">Free Listing</option>
          <option value="verified">Verified Listing (requires verification)</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">Business Description (100-300 words) *</label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Describe your business, what makes it unique, and the services you offer to travelers"
        />
      </div>

      <div>
        <label htmlFor="target_travelers" className="block text-sm font-medium mb-1">Target Travelers</label>
        <select
          name="target_travelers"
          id="target_travelers"
          value={formData.target_travelers}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Select primary target market...</option>
          <option value="international">International tourists</option>
          <option value="regional">Regional African travelers</option>
          <option value="domestic">Domestic Zimbabwean travelers</option>
          <option value="business">Business travelers</option>
          <option value="luxury">Luxury travelers</option>
          <option value="budget">Budget travelers</option>
          <option value="adventure">Adventure travelers</option>
          <option value="family">Family travelers</option>
          <option value="mixed">Mixed/All travelers</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="promotion_interest"
          id="promotion_interest"
          checked={formData.promotion_interest}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="promotion_interest" className="text-sm">
          I'm interested in the Business Promotion Package ($100)
        </label>
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
      >
        {status === 'submitting' ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Submitting...
          </>
        ) : (
          'Submit Business Listing Application'
        )}
      </button>
    </form>
  );
}
