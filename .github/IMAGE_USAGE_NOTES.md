# Image Usage and Credits - Zimbabwe Travel Information

## Current Image Strategy

### **Licensed External Images**

**Iconic Expeditions** - We have permission to use their images
- Source: https://iconic-expeditions.com/
- Usage: With permission
- Credit Format: `*Photo courtesy of [Iconic Expeditions](https://iconic-expeditions.com/)*`

### **Available Iconic Expeditions Images:**

1. **Victoria Falls Aerial View**
   - URL: `https://iconic-expeditions.com/wp-content/uploads/2024/03/Victoria-Falls-Aerial-View.jpg`
   - Best for: Victoria Falls destination page

2. **Elephant at Waterhole (Hwange)**
   - URL: `https://iconic-expeditions.com/wp-content/uploads/2024/03/Camp-Hwange-Waterhole-Hide.jpg`
   - Best for: Hwange National Park, wildlife pages

3. **Family Safari Vehicle**
   - URL: `https://iconic-expeditions.com/wp-content/uploads/2024/03/The-Hide-Family-Safari-Experience.jpg`
   - Best for: Family travel, safari planning

4. **Lake Kariba Sunset**
   - URL: `https://iconic-expeditions.com/wp-content/uploads/2024/03/Bumi-Hills-Lake-Kariba-Sunset.jpg`
   - Best for: Lake Kariba destination page

5. **Luxury Tent at Verney's Camp**
   - URL: `https://iconic-expeditions.com/wp-content/uploads/2024/03/Verneys-Hwange-11.jpg`
   - Best for: Luxury travel, accommodation pages

6. **Romantic Sunset in Hwange**
   - URL: `https://iconic-expeditions.com/wp-content/uploads/2024/03/Somalisa_Expeditions_GreatPlainsConservation-9.jpg`
   - Best for: Couples travel, romantic experiences

7. **Singita Pamushana Lodge**
   - URL: `https://iconic-expeditions.com/wp-content/uploads/2024/03/Singita-Pamushana-Lodge.jpg`
   - Best for: Luxury accommodations, Gonarezhou area

---

## Free Image Sources (For Future Use)

### **Unsplash** (Free, no attribution required but recommended)
- 30,000+ Victoria Falls images
- 100+ Zimbabwe images
- Professional quality
- Download and host locally
- Credit: `*Photo: [Photographer Name](unsplash-profile-url) via Unsplash*`

### **Pixabay** (Public domain, free commercial use)
- 20,000+ Victoria Falls images
- 200+ Zimbabwe images
- 8,000+ African elephant images
- 10,000+ safari images
- Credit: `*Photo via Pixabay*` or `*Photo: [Photographer] via Pixabay*`

### **Moses Adventures** (Permission granted)
- Contact for specific tour photos
- Authentic Zimbabwe travel experiences
- Credit: `*Photo courtesy of [Moses Adventures](https://www.moses-adventures.com/)*`

---

## Implementation Status

### Pages Updated with Real Photos:
- ✅ destinations/victoria-falls.mdx - Iconic Expeditions aerial view
- ✅ planning/luxury-travel.mdx - Multiple Iconic Expeditions images
- ✅ planning/safari-planning.mdx - Iconic Expeditions images
- ✅ planning/business-travel.mdx - Iconic Expeditions images
- ✅ planning/couples-travel.mdx - Iconic Expeditions romantic sunset
- ✅ planning/group-travel.mdx - Iconic Expeditions images
- ✅ planning/solo-travel.mdx - Iconic Expeditions images

### Pages Still Using Placeholders (Need Updates):
All pages currently using `/images/hero-light.svg` should be updated with:
1. Iconic Expeditions images (where appropriate)
2. Downloaded Unsplash/Pixabay images (hosted locally)
3. Moses Adventures photos (when received)

---

## How to Add Images Properly

### Step 1: Choose Image Source
1. Check if Iconic Expeditions has suitable image
2. If not, search Unsplash/Pixabay
3. Download and save to `/images/[category]/` folder
4. Or use Moses Adventures image if available

### Step 2: Add Image to Page
```mdx
![Descriptive alt text](image-url-or-path)
*Photo courtesy of [Source](link)*
```

### Step 3: Add Page-Level Credits
At bottom of page:
```mdx
---

import PhotoCredits from '/snippets/photo-credits.mdx';

<PhotoCredits />
```

---

## Priority Pages Needing Real Images

### High Priority (Main Destination Pages):
1. ❌ destinations/hwange-national-park.mdx - Use Iconic elephant at waterhole
2. ❌ destinations/lake-kariba.mdx - Use Iconic Kariba sunset
3. ❌ destinations/eastern-highlands.mdx - Need mountain photos
4. ❌ destinations/nyanga.mdx - Need Mt. Nyangani photos
5. ❌ destinations/great-zimbabwe.mdx - Need ruins photos
6. ❌ destinations/mana-pools.mdx - Need wildlife/river photos

### Medium Priority (Wildlife & Adventure):
1. ❌ wildlife/animals-and-birds.mdx
2. ❌ adventure/hiking-and-trekking.mdx
3. ❌ adventure/water-sports.mdx

### Lower Priority (Essentials):
- Most essentials pages can use icon graphics or simple photos

---

## Next Steps

1. **Update remaining placeholder images** with Iconic Expeditions photos
2. **Download and host key images** from Unsplash/Pixabay for missing destinations
3. **Request specific photos** from Moses Adventures for authentic tour experiences
4. **Add credits to all images** using the established format
5. **Ensure photo credits component** is on all pages with images

---

**Last Updated:** January 2025

**Note:** Always credit image sources properly, even when attribution isn't legally required. It shows professionalism and supports photographers.
