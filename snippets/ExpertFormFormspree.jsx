'use client';

import React from 'react';

console.log('🔵 ExpertForm.jsx (Formspree version) loaded');

const expertCategories = {
  safari_guide: 'Safari Guide',
  bird_guide: 'Birding Specialist',
  walking_safari: 'Walking Safari Guide',
  photography_guide: 'Photography Guide',
  cultural_expert: 'Cultural & Heritage Expert',
  adventure_guide: 'Adventure Activity Guide',
  hiking_guide: 'Hiking & Trekking Guide',
  fishing_guide: 'Fishing Guide',
  city_guide: 'Urban/City Guide',
  food_culinary: 'Food & Culinary Expert',
  art_crafts: 'Arts & Crafts Specialist',
  historical: 'Historical Guide',
  other: 'Other',
};

const zimbabweRegions = [
  'Victoria Falls', 'Hwange', 'Mana Pools', 'Harare', 'Bulawayo',
  'Matobo Hills', 'Eastern Highlands', 'Lake Kariba', 'Gonarezhou',
  'Great Zimbabwe', 'Masvingo', 'Mutare', 'Nyanga', 'Chimanimani', 'Other',
];

export const ExpertForm = () => {
  console.log('✅ ExpertForm component rendering');

  return (
    <>
      <div className="border-2 border-blue-500 p-2 mb-2">
        <p className="text-xs text-blue-600 dark:text-blue-400 font-mono">
          🔍 DEBUG: ExpertForm (Formspree) is rendering
        </p>
      </div>

      <form
        action="https://formspree.io/f/xvgeropp"
        method="POST"
        className="space-y-4"
      >
        <input type="hidden" name="_subject" value="New Local Expert Application" />
        <input type="hidden" name="_template" value="table" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium mb-1">Full Name *</label>
            <input
              type="text"
              name="full_name"
              id="full_name"
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
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select your expertise...</option>
              {Object.entries(expertCategories).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="years_experience" className="block text-sm font-medium mb-1">Years of Experience *</label>
            <select
              name="years_experience"
              id="years_experience"
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="https://your-website.com or social media profile"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md transition-colors"
        >
          Submit Expert Application
        </button>
      </form>
    </>
  );
}
