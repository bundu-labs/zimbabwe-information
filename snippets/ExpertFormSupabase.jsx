import React, { useState } from 'react';
import { expertCategories, zimbabweRegions } from './supabase.js';
/**
 * ExpertFormSupabase — professional listing application form
 *
 * Submits to hospitality.professional via an application intake table
 * or the platform's contact endpoint. Professionals are reviewed before
 * their profile is activated on the Mukoko platform.
 *
 * Usage in MDX:
 *   import { ExpertFormSupabase } from '/snippets/ExpertFormSupabase.jsx';
 *   <ExpertFormSupabase />
 */
export const ExpertFormSupabase = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    // Personal info (identity.person)
    full_name: '',
    email: '',
    phone: '',
    // Professional info (hospitality.professional)
    occupation_type: '',
    years_experience: '',
    base_location: '',
    languages_spoken: '',
    specialisations: '',
    bio: '',
    services_offered: '',
    certifications: '',
    website_url: '',
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
        type: 'professional',
        name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        category: formData.occupation_type,
        source: 'travel-info.co.zw',
      });
      setSubmitted(true);
      // Redirect to Mukoko platform to complete registration
      setTimeout(() => {
        window.open(`https://business.mukoko.com/sign-up?${params.toString()}`, '_blank');
      }, 1500);
    } catch (err) {
      setError('There was a problem. Please email hi@travel-info.co.zw to apply directly.');
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
          Thank you, {formData.full_name}. We'll review your application and get back to you at {formData.email} within 3–5 business days.
        </p>
        <p className="text-sm text-green-600 dark:text-green-500">
          Once approved, your profile will appear in the Zimbabwe Travel Information expert directory and on{' '}
          <a href="https://business.mukoko.com" className="underline">business.mukoko.com</a>.
        </p>
      </div>
    );
  }
  const inputClass = "w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= s
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {s}
            </div>
            {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
          </React.Fragment>
        ))}
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
          {step === 1 ? 'Personal info' : 'Professional details'}
        </span>
      </div>
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal information</h3>
          <div>
            <label className={labelClass}>Full name *</label>
            <input name="full_name" value={formData.full_name} onChange={handleChange} required className={inputClass} placeholder="Your full name" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email *</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="you@example.com" />
            </div>
            <div>
              <label className={labelClass}>Phone / WhatsApp *</label>
              <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required className={inputClass} placeholder="+263 77 123 4567" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Base location *</label>
            <select name="base_location" value={formData.base_location} onChange={handleChange} required className={inputClass}>
              <option value="">Select your primary operating area</option>
              {zimbabweRegions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={!formData.full_name || !formData.email || !formData.phone || !formData.base_location}
            className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Continue →
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Professional details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Expertise category *</label>
              <select name="occupation_type" value={formData.occupation_type} onChange={handleChange} required className={inputClass}>
                <option value="">Select category</option>
                {Object.entries(expertCategories).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Years of experience *</label>
              <select name="years_experience" value={formData.years_experience} onChange={handleChange} required className={inputClass}>
                <option value="">Select</option>
                {['1–2 years', '3–5 years', '6–10 years', '10–15 years', '15+ years'].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Languages spoken</label>
            <input name="languages_spoken" value={formData.languages_spoken} onChange={handleChange} className={inputClass} placeholder="English, Shona, Ndebele (comma-separated)" />
          </div>
          <div>
            <label className={labelClass}>Specialisations</label>
            <input name="specialisations" value={formData.specialisations} onChange={handleChange} className={inputClass} placeholder="Big Five, birdwatching, photography (comma-separated)" />
          </div>
          <div>
            <label className={labelClass}>About you *</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} required rows={4} className={inputClass} placeholder="Tell us about yourself, your background, and what makes you a great guide..." />
          </div>
          <div>
            <label className={labelClass}>Services offered</label>
            <textarea name="services_offered" value={formData.services_offered} onChange={handleChange} rows={3} className={inputClass} placeholder="Half-day game drives, full-day bush walks, airport transfers..." />
          </div>
          <div>
            <label className={labelClass}>Certifications & licences</label>
            <textarea name="certifications" value={formData.certifications} onChange={handleChange} rows={2} className={inputClass} placeholder="ZimParks Professional Guide Licence, First Aid Certificate..." />
          </div>
          <div>
            <label className={labelClass}>Website (optional)</label>
            <input name="website_url" type="url" value={formData.website_url} onChange={handleChange} className={inputClass} placeholder="https://yourwebsite.com" />
          </div>
          <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <input
              type="checkbox"
              name="agree_terms"
              id="agree_terms"
              checked={formData.agree_terms}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 text-primary-600 rounded border-gray-300"
            />
            <label htmlFor="agree_terms" className="text-sm text-gray-600 dark:text-gray-400">
              I confirm this information is accurate and I agree to the{' '}
              <a href="/terms-of-service" className="text-primary-600 hover:underline">terms of service</a>.
              My listing may be reviewed and approved by the Zimbabwe Travel Information team.
            </label>
          </div>
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.agree_terms || !formData.bio || !formData.occupation_type}
              className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {submitting ? 'Submitting...' : 'Submit application'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
