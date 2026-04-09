import { createClient } from '@supabase/supabase-js';
// mukoko_platform_cloud — shared database for all Zimbabwe Information Platform apps
// Project ID: tdcpuzqyoodrdsxldgsh | Region: EU-Central-1
//
// Publishable key: safe for client-side use — data is protected by Supabase RLS policies.
// To rotate: Supabase dashboard → Project Settings → API → Publishable key
const SUPABASE_URL = 'https://tdcpuzqyoodrdsxldgsh.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_aNdSABNOLB3sG7OMjHN0Vw_5SDouXAL';
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
// ---------------------------------------------------------------------------
// Verification tiers — mirrors system.verification_tier in the platform DB
// Mineral-colored badges used across all Mukoko platform apps
// ---------------------------------------------------------------------------
export const verificationTiers = {
  unverified:  { label: 'Unverified',   mineral: null,         darkColor: '#6B6B66', lightColor: '#8C8B87', icon: 'circle' },
  community:   { label: 'Community',    mineral: 'Terracotta', darkColor: '#D4A574', lightColor: '#8B4513', icon: 'users' },
  otp:         { label: 'OTP Verified', mineral: 'Cobalt',     darkColor: '#00B0FF', lightColor: '#0047AB', icon: 'phone' },
  government:  { label: 'Government',   mineral: 'Gold',       darkColor: '#FFD740', lightColor: '#5D4037', icon: 'shield-check' },
  licensed:    { label: 'Licensed',     mineral: 'Tanzanite',  darkColor: '#B388FF', lightColor: '#4B0082', icon: 'award' },
};
// ---------------------------------------------------------------------------
// Professional categories — maps to hospitality.professional occupation_type values
// ---------------------------------------------------------------------------
export const expertCategories = {
  safari_guide:      { label: 'Safari Guide',              icon: 'paw' },
  bird_guide:        { label: 'Birding Specialist',         icon: 'dove' },
  walking_safari:    { label: 'Walking Safari Guide',       icon: 'shoe-prints' },
  photography_guide: { label: 'Photography Guide',          icon: 'camera' },
  cultural_expert:   { label: 'Cultural & Heritage Expert', icon: 'landmark' },
  adventure_guide:   { label: 'Adventure Activity Guide',   icon: 'person-hiking' },
  hiking_guide:      { label: 'Hiking & Trekking Guide',    icon: 'mountain' },
  fishing_guide:     { label: 'Fishing Guide',              icon: 'fish' },
  city_guide:        { label: 'Urban/City Guide',           icon: 'city' },
  food_culinary:     { label: 'Food & Culinary Expert',     icon: 'utensils' },
  art_crafts:        { label: 'Arts & Crafts Specialist',   icon: 'palette' },
  historical:        { label: 'Historical Guide',           icon: 'book' },
  other:             { label: 'Other',                      icon: 'user' },
};
// ---------------------------------------------------------------------------
// Business categories — maps to commerce.business_category top-level groups
// ---------------------------------------------------------------------------
export const businessCategories = {
  accommodation: { label: 'Accommodation',          icon: 'bed' },
  activities:    { label: 'Activities & Tours',     icon: 'person-hiking' },
  dining:        { label: 'Dining & Entertainment', icon: 'utensils' },
  transport:     { label: 'Transportation',          icon: 'van-shuttle' },
  shopping:      { label: 'Shopping & Crafts',       icon: 'bag-shopping' },
  services:      { label: 'Services',                icon: 'handshake' },
  attractions:   { label: 'Attractions',             icon: 'camera' },
  wellness:      { label: 'Wellness & Health',       icon: 'spa' },
  nightlife:     { label: 'Nightlife',               icon: 'music' },
  venues:        { label: 'Venues',                  icon: 'building' },
};
// ---------------------------------------------------------------------------
// Accommodation subcategories — maps to hospitality.establishment schema_type
// ---------------------------------------------------------------------------
export const accommodationSubcategories = {
  lodge:         { label: 'Safari Lodge',        icon: 'house' },
  safari_camp:   { label: 'Safari Camp',         icon: 'campground' },
  hotel:         { label: 'Hotel',               icon: 'hotel' },
  guesthouse:    { label: 'Guesthouse / B&B',    icon: 'house-user' },
  campsite:      { label: 'Campsite',            icon: 'tent' },
  self_catering: { label: 'Self-Catering',       icon: 'kitchen-set' },
  hostel:        { label: 'Hostel / Backpackers', icon: 'bed' },
  resort:        { label: 'Resort',              icon: 'umbrella-beach' },
};
// ---------------------------------------------------------------------------
// Zimbabwe regions — used for filtering across all directories
// ---------------------------------------------------------------------------
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
