#!/bin/bash

# MDX Image Update Script
# Updates destination pages to use local optimized images
# Usage: bash .github/update-mdx-images.sh

set -e

echo "====================================="
echo "Zimbabwe Travel Info - MDX Image Updater"
echo "====================================="
echo ""

# Function to update image in MDX file
update_mdx_image() {
  local mdx_file="$1"
  local image_path="$2"
  local alt_text="$3"

  if [ ! -f "$mdx_file" ]; then
    echo "  ⚠️  File not found: $mdx_file"
    return 1
  fi

  # Replace the placeholder image with actual image (using standard markdown syntax)
  sed -i '' "s|!\[.*\](/images/hero-light.svg)|![$alt_text]($image_path)|g" "$mdx_file"

  echo "  ✓ Updated: $(basename "$mdx_file")"
  return 0
}

echo "📝 Updating destination pages with images..."
echo ""

# Victoria Falls
echo "🌊 Victoria Falls:"
update_mdx_image "destinations/victoria-falls.mdx" "/images/destinations/victoria-falls/aerial-view.jpg" "Victoria Falls aerial view"

# Hwange
echo "🦁 Hwange National Park:"
update_mdx_image "destinations/hwange-national-park.mdx" "/images/destinations/hwange/waterhole-elephants.jpg" "Elephants at waterhole in Hwange"

# Lake Kariba
echo "🌅 Lake Kariba:"
update_mdx_image "destinations/lake-kariba.mdx" "/images/destinations/kariba/sunset.jpg" "Lake Kariba sunset"

# Mana Pools
echo "🐘 Mana Pools:"
update_mdx_image "destinations/mana-pools.mdx" "/images/destinations/mana-pools/elephants-eating.jpg" "Elephants in Mana Pools"

# Great Zimbabwe
echo "🏛️  Great Zimbabwe:"
update_mdx_image "destinations/great-zimbabwe.mdx" "/images/destinations/great-zimbabwe/overview.jpg" "Great Zimbabwe ruins"

# Matobo Hills
echo "⛰️  Matobo Hills:"
update_mdx_image "destinations/matobo-hills.mdx" "/images/destinations/matobo-hills/worlds-view.jpg" "World's View at Matobo Hills"

# Gonarezhou
echo "🌄 Gonarezhou:"
update_mdx_image "destinations/gonarezhou.mdx" "/images/destinations/gonarezhou/elephant-chilojo-cliffs.jpg" "Elephant at Chilojo Cliffs, Gonarezhou"

# Harare
echo "🏙️  Harare:"
update_mdx_image "destinations/harare.mdx" "/images/destinations/harare/city-view.jpg" "Harare city view"

# Bulawayo (already done manually)
echo "🏛️  Bulawayo: (already updated manually)"

# Chimanimani
echo "🏔️  Chimanimani:"
update_mdx_image "destinations/chimanimani.mdx" "/images/destinations/chimanimani/mountains.jpg" "Chimanimani mountains"

echo ""
echo "====================================="
echo "Update Complete!"
echo "====================================="
echo ""
echo "All destination pages have been updated with optimized local images."
echo "Images use standard markdown format: ![alt text](/path/to/image.jpg)"
echo ""
