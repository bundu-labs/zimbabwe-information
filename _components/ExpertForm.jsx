'use client';

import React, { useState, useEffect } from 'react';
import { supabase, expertCategories, zimbabweRegions } from './supabase';

export default function ExpertForm() {
  // Debug logging
  useEffect(() => {
    console.log('✅ ExpertForm component mounted');
    console.log('Supabase client:', supabase);
    console.log('Expert categories:', expertCategories);
    console.log('Zimbabwe regions:', zimbabweRegions);
  }, []);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    category: '',
    years_experience: '',
    certifications: '',
    languages: '',
    services: '',
    bio: '',
    motivation: '',
    website: '',
  });

  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const { data, error } = await supabase
        .from('experts')
        .insert([{
          ...formData,
          status: 'pending',
          verified: false,
        }])
        .select();

      if (error) throw error;

      setStatus('success');
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        location: '',
        category: '',
        years_experience: '',
        certifications: '',
        languages: '',
        services: '',
        bio: '',
        motivation: '',
        website: '',
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  console.log('ExpertForm render - status:', status);

  if (status === 'success') {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">Application Submitted!</h3>
        <p className="text-green-700 dark:text-green-300 mb-4">
          Thank you for your interest in joining our Local Expert network. We'll review your application and contact you within 5-7 business days.
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
    <>
      <div className="border-2 border-blue-500 p-2 mb-2">
        <p className="text-xs text-blue-600 dark:text-blue-400 font-mono">
          🔍 DEBUG: ExpertForm is rendering | Status: {status}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
      {status === 'error' && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium mb-1">Full Name *</label>
          <input
            type="text"
            name="full_name"
            id="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Your full name"
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
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone/WhatsApp *</label>
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
          <label htmlFor="location" className="block text-sm font-medium mb-1">Location/Region *</label>
          <select
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select your location...</option>
            {zimbabweRegions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">Expert Category *</label>
          <select
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select your expertise...</option>
            {Object.entries(expertCategories).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="years_experience" className="block text-sm font-medium mb-1">Years of Experience *</label>
          <select
            name="years_experience"
            id="years_experience"
            value={formData.years_experience}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">How long have you been guiding?</option>
            <option value="1-2 years">1-2 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="5-10 years">5-10 years</option>
            <option value="10+ years">10+ years</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="certifications" className="block text-sm font-medium mb-1">Certifications & Qualifications *</label>
        <textarea
          name="certifications"
          id="certifications"
          value={formData.certifications}
          onChange={handleChange}
          required
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="List your relevant certifications (e.g., ZPGA License Level, First Aid, FGASA, Dangerous Game, etc.)"
        />
      </div>

      <div>
        <label htmlFor="languages" className="block text-sm font-medium mb-1">Languages Spoken *</label>
        <input
          type="text"
          name="languages"
          id="languages"
          value={formData.languages}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="e.g., English (fluent), Shona (native), German (conversational)"
        />
      </div>

      <div>
        <label htmlFor="services" className="block text-sm font-medium mb-1">Services You Offer *</label>
        <textarea
          name="services"
          id="services"
          value={formData.services}
          onChange={handleChange}
          required
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Describe the experiences and services you offer to travelers"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium mb-1">Short Bio *</label>
        <textarea
          name="bio"
          id="bio"
          value={formData.bio}
          onChange={handleChange}
          required
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="A 2-3 sentence bio about yourself and your passion for Zimbabwe"
        />
      </div>

      <div>
        <label htmlFor="motivation" className="block text-sm font-medium mb-1">Why do you want to join our network? *</label>
        <textarea
          name="motivation"
          id="motivation"
          value={formData.motivation}
          onChange={handleChange}
          required
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Share your passion for Zimbabwe and why you want to connect with travelers"
        />
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium mb-1">Website or Social Media (optional)</label>
        <input
          type="url"
          name="website"
          id="website"
          value={formData.website}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="https://your-website.com or social media profile"
        />
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
          'Submit Expert Application'
        )}
      </button>
    </form>
    </>
  );
}
