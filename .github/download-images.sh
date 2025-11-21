#!/bin/bash

# Image Download Script for Zimbabwe Travel Information
# This script downloads all external images and stores them locally
# Usage: bash .github/download-images.sh

set -e

echo "====================================="
echo "Zimbabwe Travel Info - Image Downloader"
echo "====================================="
echo ""

# Create directory structure
echo "Creating image directory structure..."
mkdir -p images/destinations/victoria-falls
mkdir -p images/destinations/hwange
mkdir -p images/destinations/lake-kariba
mkdir -p images/destinations/mana-pools
mkdir -p images/destinations/great-zimbabwe
mkdir -p images/destinations/matobo-hills
mkdir -p images/destinations/matusadona
mkdir -p images/destinations/gonarezhou
mkdir -p images/wildlife
mkdir -p images/culture
mkdir -p images/adventure
mkdir -p images/planning
mkdir -p images/essentials
echo "✓ Directory structure created"
echo ""

# NOTE: Iconic Expeditions images returning 404 - skipping for now
# User will need to manually download these images or get working URLs
echo "⚠  Skipping Iconic Expeditions images (URLs returning 404)"
echo "   You may need to manually download these or request updated URLs"
echo ""

# Download Pixabay Images (Free, Public Domain)
echo "Downloading Pixabay images (17 images)..."

echo "  1/17: Mana Pools - Elephants..."
curl -L "https://cdn.pixabay.com/photo/2018/04/09/15/35/elephant-3304164_1280.jpg" \
  -o "images/destinations/mana-pools/elephants-river.jpg" \
  --silent --show-error

echo "  2/17: Matobo Hills - Balancing Rocks..."
curl -L "https://cdn.pixabay.com/photo/2017/08/12/10/39/rock-2635720_1280.jpg" \
  -o "images/destinations/matobo-hills/balancing-rocks.jpg" \
  --silent --show-error

echo "  3/17: Great Zimbabwe - Stone Walls..."
curl -L "https://cdn.pixabay.com/photo/2018/02/11/08/01/rock-3145185_1280.jpg" \
  -o "images/destinations/great-zimbabwe/stone-walls.jpg" \
  --silent --show-error

echo "  4/17: Matusadona - Elephants..."
curl -L "https://cdn.pixabay.com/photo/2017/02/02/11/47/elephant-2033260_1280.jpg" \
  -o "images/destinations/matusadona/elephants-waterside.jpg" \
  --silent --show-error

echo "  5/17: Wildlife - Elephant Herd..."
curl -L "https://cdn.pixabay.com/photo/2016/11/14/03/55/elephants-1822636_1280.jpg" \
  -o "images/wildlife/elephant-herd.jpg" \
  --silent --show-error

echo "  6/17: Conservation - Elephant..."
curl -L "https://cdn.pixabay.com/photo/2017/05/19/10/50/elephant-2325899_1280.jpg" \
  -o "images/wildlife/conservation-elephant.jpg" \
  --silent --show-error

echo "  7/17: National Parks - Savanna..."
curl -L "https://cdn.pixabay.com/photo/2018/09/13/15/45/savanna-3675851_1280.jpg" \
  -o "images/wildlife/savanna-wildlife.jpg" \
  --silent --show-error

echo "  8/17: Water Sports - Rafting..."
curl -L "https://cdn.pixabay.com/photo/2016/05/24/11/48/white-water-rafting-1412162_1280.jpg" \
  -o "images/adventure/white-water-rafting.jpg" \
  --silent --show-error

echo "  9/17: Activities - Safari..."
curl -L "https://cdn.pixabay.com/photo/2017/07/10/10/32/africa-2489708_1280.jpg" \
  -o "images/adventure/african-safari.jpg" \
  --silent --show-error

echo "  10/17: Art and Music - Drums..."
curl -L "https://cdn.pixabay.com/photo/2018/01/21/02/46/drum-3096641_1280.jpg" \
  -o "images/culture/traditional-drums.jpg" \
  --silent --show-error

echo "  11/17: Cuisine - Food..."
curl -L "https://cdn.pixabay.com/photo/2020/03/07/14/32/food-4910625_1280.jpg" \
  -o "images/culture/traditional-food.jpg" \
  --silent --show-error

echo "  12/17: Festivals - Celebration..."
curl -L "https://cdn.pixabay.com/photo/2017/08/06/18/33/person-2595309_1280.jpg" \
  -o "images/culture/cultural-celebration.jpg" \
  --silent --show-error

echo "  13/17: Business Travel..."
curl -L "https://cdn.pixabay.com/photo/2015/07/31/11/45/library-869061_1280.jpg" \
  -o "images/planning/business-scene.jpg" \
  --silent --show-error

echo "  14/17: Couples Travel - Sunset..."
curl -L "https://cdn.pixabay.com/photo/2017/08/05/22/47/lake-2586370_1280.jpg" \
  -o "images/planning/romantic-sunset.jpg" \
  --silent --show-error

echo "  15/17: Group Travel - Elephants..."
curl -L "https://cdn.pixabay.com/photo/2017/07/26/15/27/elephants-2542331_1280.jpg" \
  -o "images/planning/group-safari.jpg" \
  --silent --show-error

echo "  16/17: Safari Planning - Jeep..."
curl -L "https://cdn.pixabay.com/photo/2019/02/17/09/51/africa-4001076_1280.jpg" \
  -o "images/planning/safari-jeep.jpg" \
  --silent --show-error

echo "  17/17: Solo Travel..."
curl -L "https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2593341_1280.jpg" \
  -o "images/planning/solo-adventure.jpg" \
  --silent --show-error

echo "✓ Pixabay images downloaded"
echo ""

# Count downloaded files
total_files=$(find images -type f -name "*.jpg" | wc -l | tr -d ' ')
echo "====================================="
echo "Download Complete!"
echo "Total images downloaded: $total_files"
echo "====================================="
echo ""
echo "Next steps:"
echo "1. Optimize images using TinyPNG.com or Squoosh.app"
echo "2. Run the update-image-paths.sh script to update MDX files"
echo "3. Commit and push changes to repository"
echo ""
