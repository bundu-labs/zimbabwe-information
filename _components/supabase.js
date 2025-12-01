console.log('🟡 Loading supabase.js');

import { createClient } from '@supabase/supabase-js';

// Supabase configuration - anon key is safe for client-side use with RLS
const supabaseUrl = 'https://aqjhuyqhgmmdutwzqvyv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxamh1eXFoZ21tZHV0d3pxdnl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1Nzg5MDQsImV4cCI6MjA4MDE1NDkwNH0.TNC0UiYug3kRCVpySEHlCuXxsFRSuv3Mad2UwKMVrDE';

console.log('🟡 Creating Supabase client...');
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
console.log('🟡 Supabase client created:', supabase ? '✓' : '✗');
export { supabaseUrl };

// Expert categories with labels and icons
export const expertCategories = {
  safari_guide: { label: 'Safari Guide', icon: 'paw' },
  bird_guide: { label: 'Birding Specialist', icon: 'dove' },
  walking_safari: { label: 'Walking Safari Guide', icon: 'shoe-prints' },
  photography_guide: { label: 'Photography Guide', icon: 'camera' },
  cultural_expert: { label: 'Cultural & Heritage Expert', icon: 'landmark' },
  adventure_guide: { label: 'Adventure Activity Guide', icon: 'person-hiking' },
  hiking_guide: { label: 'Hiking & Trekking Guide', icon: 'mountain' },
  fishing_guide: { label: 'Fishing Guide', icon: 'fish' },
  city_guide: { label: 'Urban/City Guide', icon: 'city' },
  food_culinary: { label: 'Food & Culinary Expert', icon: 'utensils' },
  art_crafts: { label: 'Arts & Crafts Specialist', icon: 'palette' },
  historical: { label: 'Historical Guide', icon: 'book' },
  other: { label: 'Other', icon: 'user' },
};

// Business categories
export const businessCategories = {
  accommodation: { label: 'Accommodation', icon: 'bed' },
  activities: { label: 'Activities & Tours', icon: 'person-hiking' },
  dining: { label: 'Dining & Entertainment', icon: 'utensils' },
  transport: { label: 'Transportation', icon: 'van-shuttle' },
  shopping: { label: 'Shopping & Crafts', icon: 'bag-shopping' },
  services: { label: 'Services', icon: 'handshake' },
  attractions: { label: 'Attractions', icon: 'camera' },
  wellness: { label: 'Wellness & Health', icon: 'spa' },
};

// Accommodation subcategories
export const accommodationSubcategories = {
  lodge: { label: 'Safari Lodge', icon: 'house' },
  safari_camp: { label: 'Safari Camp', icon: 'campground' },
  hotel: { label: 'Hotel', icon: 'hotel' },
  guesthouse: { label: 'Guesthouse / B&B', icon: 'house-user' },
  campsite: { label: 'Campsite', icon: 'tent' },
  self_catering: { label: 'Self-Catering', icon: 'kitchen-set' },
  hostel: { label: 'Hostel / Backpackers', icon: 'bed' },
  resort: { label: 'Resort', icon: 'umbrella-beach' },
};

// Zimbabwe regions for filtering
export const zimbabweRegions = [
  'Victoria Falls',
  'Hwange',
  'Mana Pools',
  'Harare',
  'Bulawayo',
  'Matobo Hills',
  'Eastern Highlands',
  'Lake Kariba',
  'Gonarezhou',
  'Great Zimbabwe',
  'Masvingo',
  'Mutare',
  'Nyanga',
  'Chimanimani',
  'Other',
];
