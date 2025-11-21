# Image Download and Implementation Guide

## Current Situation

We've updated ~28 pages with external image URLs from:
- Iconic Expeditions (7 images)
- Pixabay (20+ images)

**Problem:** External hotlinking can cause issues with availability, load speed, and control.

**Solution:** Download images locally to `/images/` directory and update references.

---

## Directory Structure

Create this folder structure in `/images/`:

```
/images/
  /destinations/
    victoria-falls/
    hwange/
    lake-kariba/
    mana-pools/
    great-zimbabwe/
    matobo-hills/
    matusadona/
    gonarezhou/
    etc...
  /wildlife/
  /culture/
  /adventure/
  /planning/
  /essentials/
```

---

## Step-by-Step Process

### 1. Download Images from Pixabay

For each Pixabay image currently in use:

**Example:** `https://cdn.pixabay.com/photo/2018/04/09/15/35/elephant-3304164_1280.jpg`

1. **Visit the URL** in your browser
2. **Right-click** and "Save Image As..."
3. **Save to appropriate folder** with descriptive name:
   - Example: `/images/destinations/mana-pools/elephants-zambezi-river.jpg`
4. **Keep track of photographer** for credits (check Pixabay page for attribution)

### 2. Download Images from Iconic Expeditions

You have permission, so:

1. Visit each image URL
2. Save with descriptive names
3. Example: `/images/destinations/victoria-falls/aerial-view.jpg`

### 3. Optimize Images

Before uploading, optimize for web:

**Tools:**
- **TinyPNG.com** - Free, easy to use
- **Squoosh.app** - Google's image optimizer
- **ImageOptim** (Mac) - Desktop app

**Target:**
- Hero images: < 300KB
- Standard images: < 150KB
- Format: JPG for photos, WebP for best compression

---

## Current Images to Download

### Iconic Expeditions (7 images - YOU HAVE PERMISSION)

1. **Victoria Falls Aerial**
   - URL: `https://iconic-expeditions.com/wp-content/uploads/2024/03/Victoria-Falls-Aerial-View.jpg`
   - Save as: `/images/destinations/victoria-falls/aerial-view.jpg`
   - Credit: Iconic Expeditions

2. **Hwange Elephants at Waterhole**
   - URL: `https://iconic-expeditions.com/wp-content/uploads/2024/03/Camp-Hwange-Waterhole-Hide.jpg`
   - Save as: `/images/destinations/hwange/elephants-waterhole.jpg`
   - Credit: Iconic Expeditions

3. **Lake Kariba Sunset**
   - URL: `https://iconic-expeditions.com/wp-content/uploads/2024/03/Bumi-Hills-Lake-Kariba-Sunset.jpg`
   - Save as: `/images/destinations/lake-kariba/sunset.jpg`
   - Credit: Iconic Expeditions

4. **Luxury Tent Verney's Camp**
   - URL: `https://iconic-expeditions.com/wp-content/uploads/2024/03/Verneys-Hwange-11.jpg`
   - Save as: `/images/planning/luxury-tent-verneys.jpg`
   - Credit: Iconic Expeditions

5. **Romantic Sunset Hwange**
   - URL: `https://iconic-expeditions.com/wp-content/uploads/2024/03/Somalisa_Expeditions_GreatPlainsConservation-9.jpg`
   - Save as: `/images/planning/romantic-sunset-hwange.jpg`
   - Credit: Iconic Expeditions

6. **Singita Pamushana Lodge**
   - URL: `https://iconic-expeditions.com/wp-content/uploads/2024/03/Singita-Pamushana-Lodge.jpg`
   - Save as: `/images/destinations/gonarezhou/singita-pamushana.jpg`
   - Credit: Iconic Expeditions

7. **Family Safari Vehicle**
   - URL: `https://iconic-expeditions.com/wp-content/uploads/2024/03/The-Hide-Family-Safari-Experience.jpg`
   - Save as: `/images/planning/family-safari-vehicle.jpg`
   - Credit: Iconic Expeditions

### Pixabay Images (Free, Public Domain)

**Destinations:**

1. **Mana Pools - Elephants**
   - Current: `https://cdn.pixabay.com/photo/2018/04/09/15/35/elephant-3304164_1280.jpg`
   - Save as: `/images/destinations/mana-pools/elephants-river.jpg`
   - Credit: Pixabay

2. **Matobo Hills - Balancing Rocks**
   - Current: `https://cdn.pixabay.com/photo/2017/08/12/10/39/rock-2635720_1280.jpg`
   - Save as: `/images/destinations/matobo-hills/balancing-rocks.jpg`
   - Credit: Pixabay

3. **Great Zimbabwe - Stone Walls**
   - Current: `https://cdn.pixabay.com/photo/2018/02/11/08/01/rock-3145185_1280.jpg`
   - Save as: `/images/destinations/great-zimbabwe/stone-walls.jpg`
   - Credit: Pixabay

4. **Matusadona - Elephants**
   - Current: `https://cdn.pixabay.com/photo/2017/02/02/11/47/elephant-2033260_1280.jpg`
   - Save as: `/images/destinations/matusadona/elephants-waterside.jpg`
   - Credit: Pixabay

**Wildlife:**

5. **Animals and Birds - Elephant Herd**
   - Current: `https://cdn.pixabay.com/photo/2016/11/14/03/55/elephants-1822636_1280.jpg`
   - Save as: `/images/wildlife/elephant-herd.jpg`
   - Credit: Pixabay

6. **Conservation - Elephant**
   - Current: `https://cdn.pixabay.com/photo/2017/05/19/10/50/elephant-2325899_1280.jpg`
   - Save as: `/images/wildlife/conservation-elephant.jpg`
   - Credit: Pixabay

7. **National Parks - Savanna**
   - Current: `https://cdn.pixabay.com/photo/2018/09/13/15/45/savanna-3675851_1280.jpg`
   - Save as: `/images/wildlife/savanna-wildlife.jpg`
   - Credit: Pixabay

**Adventure:**

8. **Water Sports - Rafting**
   - Current: `https://cdn.pixabay.com/photo/2016/05/24/11/48/white-water-rafting-1412162_1280.jpg`
   - Save as: `/images/adventure/white-water-rafting.jpg`
   - Credit: Pixabay

9. **Activities - Safari**
   - Current: `https://cdn.pixabay.com/photo/2017/07/10/10/32/africa-2489708_1280.jpg`
   - Save as: `/images/adventure/african-safari.jpg`
   - Credit: Pixabay

**Culture:**

10. **Art and Music - Drums**
    - Current: `https://cdn.pixabay.com/photo/2018/01/21/02/46/drum-3096641_1280.jpg`
    - Save as: `/images/culture/traditional-drums.jpg`
    - Credit: Pixabay

11. **Cuisine - Food**
    - Current: `https://cdn.pixabay.com/photo/2020/03/07/14/32/food-4910625_1280.jpg`
    - Save as: `/images/culture/traditional-food.jpg`
    - Credit: Pixabay

12. **Festivals - Celebration**
    - Current: `https://cdn.pixabay.com/photo/2017/08/06/18/33/person-2595309_1280.jpg`
    - Save as: `/images/culture/cultural-celebration.jpg`
    - Credit: Pixabay

**Planning:**

13. **Business Travel**
    - Current: `https://cdn.pixabay.com/photo/2015/07/31/11/45/library-869061_1280.jpg`
    - Save as: `/images/planning/business-scene.jpg`
    - Credit: Pixabay

14. **Couples Travel - Sunset**
    - Current: `https://cdn.pixabay.com/photo/2017/08/05/22/47/lake-2586370_1280.jpg`
    - Save as: `/images/planning/romantic-sunset.jpg`
    - Credit: Pixabay

15. **Group Travel - Elephants**
    - Current: `https://cdn.pixabay.com/photo/2017/07/26/15/27/elephants-2542331_1280.jpg`
    - Save as: `/images/planning/group-safari.jpg`
    - Credit: Pixabay

16. **Safari Planning - Jeep**
    - Current: `https://cdn.pixabay.com/photo/2019/02/17/09/51/africa-4001076_1280.jpg`
    - Save as: `/images/planning/safari-jeep.jpg`
    - Credit: Pixabay

17. **Solo Travel**
    - Current: `https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2593341_1280.jpg`
    - Save as: `/images/planning/solo-adventure.jpg`
    - Credit: Pixabay

---

## After Downloading

### Update MDX Files

Replace external URLs with local paths:

**Before:**
```mdx
![Victoria Falls aerial view](https://iconic-expeditions.com/wp-content/uploads/2024/03/Victoria-Falls-Aerial-View.jpg)
*Photo courtesy of [Iconic Expeditions](https://iconic-expeditions.com/)*
```

**After:**
```mdx
![Victoria Falls aerial view](/images/destinations/victoria-falls/aerial-view.jpg)
*Photo courtesy of [Iconic Expeditions](https://iconic-expeditions.com/)*
```

### Batch Update Script

Create a file `update-image-paths.sh`:

```bash
#!/bin/bash

# Replace Iconic Expeditions URLs
find . -name "*.mdx" -exec sed -i '' 's|https://iconic-expeditions.com/wp-content/uploads/2024/03/Victoria-Falls-Aerial-View.jpg|/images/destinations/victoria-falls/aerial-view.jpg|g' {} \;

find . -name "*.mdx" -exec sed -i '' 's|https://iconic-expeditions.com/wp-content/uploads/2024/03/Camp-Hwange-Waterhole-Hide.jpg|/images/destinations/hwange/elephants-waterhole.jpg|g' {} \;

# Add more replacements...
# (See complete script in separate file)
```

---

## Alternative: Use Unsplash API (Recommended for Future)

For better quality Zimbabwe-specific images:

1. Create free Unsplash account
2. Search for specific images
3. Download high-quality versions
4. Unsplash provides photographer info automatically
5. Easier to credit properly

**Unsplash searches to try:**
- "Victoria Falls Zimbabwe"
- "Zimbabwe wildlife"
- "African safari Zimbabwe"
- "Lake Kariba"
- "Stone ruins Africa"

---

## Moses Adventures Images

Contact Moses Adventures and request:
1. High-resolution tour photos
2. Specific permissions/license
3. How they want to be credited
4. Which images they recommend for each destination

---

## Final Checklist

- [ ] Create `/images/` subdirectories
- [ ] Download all Iconic Expeditions images (7 total)
- [ ] Download all Pixabay images (17+ total)
- [ ] Optimize all images (< 300KB for heroes, < 150KB for others)
- [ ] Update MDX files with local paths
- [ ] Verify all images display correctly
- [ ] Ensure photo credits remain intact
- [ ] Commit and push to repository

---

**Last Updated:** January 2025

**Note:** Once images are downloaded and locally hosted, the site will load faster and have better reliability than hotlinking to external sources.
