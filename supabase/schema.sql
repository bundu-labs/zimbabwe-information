-- Zimbabwe Travel Information Database Schema
-- Run this in Supabase SQL Editor to set up the tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- EXPERTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS experts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  years_experience TEXT NOT NULL,
  certifications TEXT NOT NULL,
  languages TEXT NOT NULL,
  services TEXT NOT NULL,
  bio TEXT,
  motivation TEXT,
  website TEXT,
  profile_image TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  verified BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_experts_status ON experts(status);
CREATE INDEX IF NOT EXISTS idx_experts_category ON experts(category);
CREATE INDEX IF NOT EXISTS idx_experts_location ON experts(location);
CREATE INDEX IF NOT EXISTS idx_experts_verified ON experts(verified);

-- ============================================
-- BUSINESSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  category TEXT NOT NULL,
  subcategory TEXT, -- For accommodation: lodge, campsite, hotel, guesthouse, etc.
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  target_travelers TEXT,
  listing_type TEXT DEFAULT 'free' CHECK (listing_type IN ('free', 'verified', 'premium')),
  promotion_interest BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  verified BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  logo_url TEXT,
  images TEXT[], -- Array of image URLs
  amenities TEXT[], -- For accommodation
  price_range TEXT, -- budget, mid-range, luxury
  rating DECIMAL(2,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_subcategory ON businesses(subcategory);
CREATE INDEX IF NOT EXISTS idx_businesses_location ON businesses(location);
CREATE INDEX IF NOT EXISTS idx_businesses_verified ON businesses(verified);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on both tables
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved/verified entries
CREATE POLICY "Public can view approved experts" ON experts
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Public can view approved businesses" ON businesses
  FOR SELECT USING (status = 'approved');

-- Policy: Anyone can insert (submit applications)
CREATE POLICY "Anyone can submit expert application" ON experts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit business application" ON businesses
  FOR INSERT WITH CHECK (true);

-- Policy: Service role can do everything (for admin/workflow)
-- Note: Service role bypasses RLS by default

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_experts_updated_at
  BEFORE UPDATE ON experts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CATEGORY ENUMS (for reference)
-- ============================================
-- Expert Categories:
-- safari_guide, bird_guide, walking_safari, photography_guide,
-- cultural_expert, adventure_guide, hiking_guide, fishing_guide,
-- city_guide, food_culinary, art_crafts, historical, other

-- Business Categories:
-- accommodation, activities, dining, transport, shopping, services, attractions, wellness

-- Accommodation Subcategories:
-- lodge, safari_camp, hotel, guesthouse, campsite, self_catering, hostel, resort

-- ============================================
-- SAMPLE DATA (optional - uncomment to test)
-- ============================================
/*
INSERT INTO experts (full_name, email, phone, location, category, years_experience, certifications, languages, services, bio, status, verified)
VALUES (
  'Tendai Moyo',
  'tendai@example.com',
  '+263 77 123 4567',
  'Hwange National Park',
  'safari_guide',
  '10+ years',
  'ZPGA Professional Guide Level 3, First Aid Certified, Dangerous Game Certificate',
  'English (fluent), Shona (native), German (conversational)',
  'Full-day game drives, Walking safaris, Photography workshops, Bird watching tours',
  'Born and raised near Hwange, I''ve spent 15 years sharing the magic of Zimbabwe''s wildlife with travelers from around the world.',
  'approved',
  true
);

INSERT INTO businesses (business_name, contact_person, email, phone, category, subcategory, location, description, status, verified)
VALUES (
  'Elephant''s Eye Lodge',
  'John Smith',
  'info@elephantseye.co.zw',
  '+263 77 987 6543',
  'accommodation',
  'lodge',
  'Hwange National Park',
  'Luxury tented safari lodge overlooking a waterhole frequented by elephants. Offers all-inclusive safari packages with experienced guides.',
  'approved',
  true
);
*/
