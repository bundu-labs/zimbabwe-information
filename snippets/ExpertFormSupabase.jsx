'use client';

import React, { useState, useEffect } from 'react';

console.log('🔵 ExpertFormSupabase.jsx (Supabase version) loaded');

// Note: Supabase client import removed - needs @supabase/supabase-js installed
// Simplified version without Supabase for comparison

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

export const ExpertFormSupabase = () => {
  console.log('✅ ExpertFormSupabase component rendering');

  return (
    <div className="border-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
      <h3 className="text-orange-700 dark:text-orange-300 font-bold text-lg mb-3">
        🚧 Supabase Version (Requires Setup)
      </h3>
      <div className="space-y-2 text-sm text-orange-600 dark:text-orange-400">
        <p><strong>Status:</strong> Requires @supabase/supabase-js dependency</p>
        <p><strong>Storage:</strong> Submissions go to Supabase database</p>
        <p><strong>Features:</strong> Real-time data sync, direct database access</p>
        <p><strong>Pros:</strong> Structured data, queryable, can build admin dashboard</p>
        <p><strong>Cons:</strong> Requires database setup and maintenance</p>
      </div>
      <p className="mt-4 text-xs text-orange-500 dark:text-orange-400">
        This version is disabled until Supabase dependencies are restored. See Formspree version for working form.
      </p>
    </div>
  );
}
