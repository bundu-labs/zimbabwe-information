'use client';

import React, { useState } from 'react';
import { businessCategories, accommodationSubcategories, zimbabweRegions } from './supabase.js';

/**
 * BusinessForm — business listing application form
 *
 * Submits a new business application to the Mukoko platform.
 * Businesses are reviewed before appearing in the directory.
 *
 * Usage in MDX:
 *   import { BusinessForm } from '/snippets/BusinessForm.jsx';
 *   <BusinessForm />
 */
export const BusinessForm = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    // Business info
    business_name: '',
    category: '',
    subcategory: '',
    description: '',
    location: '',
    address: '',
    // Contact
    contact_name: '',
    email: '',
    phone: '',
    website_url: '',
    // Details
    price_range: '',
    amenities: '',
    // Consent
    agree_terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Build sign-up URL with pre-filled params for business.mukoko.com
      const params = new URLSearchParams({
        type: 'business',
        name: formData.business_name,
        category: formData.category,
        contact: formData.contact_name,
        email: formData.email,
        phone: formData.phone,
        source: 'travel-info.co.zw',
      });
      setSubmitted(true);
      // Redirect to Mukoko platform to complete registration
      setTimeout(() => {
        window.open(`https://business.mukoko.com/sign-up?${params.toString()}`, '_blank');
      }, 1500);
    } catch (err) {
      setError('There was a problem. Please email hi@travel-info.co.zw to register your business.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Application submitted!</h3>
        <p className="text-green-700 dark:text-green-400 mb-4">
          Thank you for listing <strong>{formData.business_name}</strong>. We'll review your application and get back to you at {formData.email} within 3–5 business days.
        </p>
        <p className="text-sm text-green-600 dark:text-green-500">
          Once approved, your business will appear in our directory and on{' '}
          <a href="https://business.mukoko.com" className="underline">business.mukoko.com</a>.
        </p>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  const isAccommodation = formData.category === 'accommodation';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2].map((s) => (
          <React.Fragment key={s}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
              {s}
            </div>
            {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
          </React.Fragment>
        ))}
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
          {step === 1 ? 'Business details' : 'Contact & submit'}
        </span>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Business details</h3>

          <div>
            <label className={labelClass}>Business name *</label>
            <input name="business_name" value={formData.business_name} onChange={handleChange} required className={inputClass} placeholder="Your business name" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required className={inputClass}>
                <option value="">Select category</option>
                {Object.entries(businessCategories).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            {isAccommodation && (
              <div>
                <label className={labelClass}>Accommodation type</label>
                <select name="subcategory" value={formData.subcategory} onChange={handleChange} className={inputClass}>
                  <option value="">Select type</option>
                  {Object.entries(accommodationSubcategories).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Location *</label>
            <select name="location" value={formData.location} onChange={handleChange} required className={inputClass}>
              <option value="">Select area</option>
              {zimbabweRegions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Street address (optional)</label>
            <input name="address" value={formData.address} onChange={handleChange} className={inputClass} placeholder="123 Main Street, Harare" />
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className={inputClass} placeholder="Describe your business, what you offer, and what makes it special..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price range</label>
              <select name="price_range" value={formData.price_range} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="$">$ — Budget</option>
                <option value="$$">$$ — Mid-range</option>
                <option value="$$$">$$$ — Premium</option>
                <option value="$$$$">$$$$ — Luxury</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Key amenities (optional)</label>
            <input name="amenities" value={formData.amenities} onChange={handleChange} className={inputClass} placeholder="Pool, WiFi, Game drives, Restaurant (comma-separated)" />
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!formData.business_name || !formData.category || !formData.location || !formData.description}
            className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Continue →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact information</h3>

          <div>
            <label className={labelClass}>Your name *</label>
            <input name="contact_name" value={formData.contact_name} onChange={handleChange} required className={inputClass} placeholder="Full name" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email *</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="you@business.com" />
            </div>
            <div>
              <label className={labelClass}>Phone / WhatsApp *</label>
              <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required className={inputClass} placeholder="+263 77 123 4567" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Website (optional)</label>
            <input name="website_url" type="url" value={formData.website_url} onChange={handleChange} className={inputClass} placeholder="https://yourbusiness.com" />
          </div>

          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <input
              type="checkbox"
              name="agree_terms"
              id="biz_agree_terms"
              checked={formData.agree_terms}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 text-primary-600 rounded border-gray-300"
            />
            <label htmlFor="biz_agree_terms" className="text-sm text-gray-600 dark:text-gray-400">
              I confirm this information is accurate and I agree to the{' '}
              <a href="/terms-of-service" className="text-primary-600 hover:underline">terms of service</a>.
              My listing will be reviewed before appearing in the directory.
            </label>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
              ← Back
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.agree_terms || !formData.contact_name || !formData.email || !formData.phone}
              className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {submitting ? 'Submitting...' : 'Submit listing'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
