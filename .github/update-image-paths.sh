#!/bin/bash

# Image Path Update Script for Zimbabwe Travel Information
# This script updates all external image URLs to use local paths
# Usage: bash .github/update-image-paths.sh

set -e

echo "====================================="
echo "Zimbabwe Travel Info - Image Path Updater"
echo "====================================="
echo ""

echo "Updating image paths in MDX files..."
echo ""

# Replace Iconic Expeditions URLs with local paths
echo "Updating Iconic Expeditions image paths..."

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://iconic-expeditions.com/wp-content/uploads/2024/03/Victoria-Falls-Aerial-View.jpg|/images/destinations/victoria-falls/aerial-view.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://iconic-expeditions.com/wp-content/uploads/2024/03/Camp-Hwange-Waterhole-Hide.jpg|/images/destinations/hwange/elephants-waterhole.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://iconic-expeditions.com/wp-content/uploads/2024/03/Bumi-Hills-Lake-Kariba-Sunset.jpg|/images/destinations/lake-kariba/sunset.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://iconic-expeditions.com/wp-content/uploads/2024/03/Verneys-Hwange-11.jpg|/images/planning/luxury-tent-verneys.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://iconic-expeditions.com/wp-content/uploads/2024/03/Somalisa_Expeditions_GreatPlainsConservation-9.jpg|/images/planning/romantic-sunset-hwange.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://iconic-expeditions.com/wp-content/uploads/2024/03/Singita-Pamushana-Lodge.jpg|/images/destinations/gonarezhou/singita-pamushana.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://iconic-expeditions.com/wp-content/uploads/2024/03/The-Hide-Family-Safari-Experience.jpg|/images/planning/family-safari-vehicle.jpg|g' {} \;

echo "✓ Iconic Expeditions paths updated"

# Replace Pixabay URLs with local paths
echo "Updating Pixabay image paths..."

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://cdn.pixabay.com/photo/2018/04/09/15/35/elephant-3304164_1280.jpg|/images/destinations/mana-pools/elephants-river.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://cdn.pixabay.com/photo/2017/08/12/10/39/rock-2635720_1280.jpg|/images/destinations/matobo-hills/balancing-rocks.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://cdn.pixabay.com/photo/2018/02/11/08/01/rock-3145185_1280.jpg|/images/destinations/great-zimbabwe/stone-walls.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://cdn.pixabay.com/photo/2017/02/02/11/47/elephant-2033260_1280.jpg|/images/destinations/matusadona/elephants-waterside.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://cdn.pixabay.com/photo/2016/11/14/03/55/elephants-1822636_1280.jpg|/images/wildlife/elephant-herd.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://cdn.pixabay.com/photo/2017/05/19/10/50/elephant-2325899_1280.jpg|/images/wildlife/conservation-elephant.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://cdn.pixabay.com/photo/2018/09/13/15/45/savanna-3675851_1280.jpg|/images/wildlife/savanna-wildlife.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://cdn.pixabay.com/photo/2016/05/24/11/48/white-water-rafting-1412162_1280.jpg|/images/adventure/white-water-rafting.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://cdn.pixabay.com/photo/2017/07/10/10/32/africa-2489708_1280.jpg|/images/adventure/african-safari.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://cdn.pixabay.com/photo/2018/01/21/02/46/drum-3096641_1280.jpg|/images/culture/traditional-drums.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://cdn.pixabay.com/photo/2020/03/07/14/32/food-4910625_1280.jpg|/images/culture/traditional-food.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://cdn.pixabay.com/photo/2017/08/06/18/33/person-2595309_1280.jpg|/images/culture/cultural-celebration.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://cdn.pixabay.com/photo/2015/07/31/11/45/library-869061_1280.jpg|/images/planning/business-scene.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://cdn.pixabay.com/photo/2017/08/05/22/47/lake-2586370_1280.jpg|/images/planning/romantic-sunset.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://cdn.pixabay.com/photo/2017/07/26/15/27/elephants-2542331_1280.jpg|/images/planning/group-safari.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://cdn.pixabay.com/photo/2019/02/17/09/51/africa-4001076_1280.jpg|/images/planning/safari-jeep.jpg|g' {} \;

find . -name "*.mdx" -type f -exec sed -i '' \
  's|https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2593341_1280.jpg|/images/planning/solo-adventure.jpg|g' {} \;

echo "✓ Pixabay paths updated"
echo ""

# Count affected files
affected_files=$(find . -name "*.mdx" -type f -exec grep -l "/images/" {} \; | wc -l | tr -d ' ')

echo "====================================="
echo "Update Complete!"
echo "Files updated: $affected_files"
echo "====================================="
echo ""
echo "Next steps:"
echo "1. Review changes with: git diff"
echo "2. Test deployment locally if possible"
echo "3. Commit changes: git add . && git commit -m 'Update image paths to use local files'"
echo "4. Push to repository: git push"
echo ""
