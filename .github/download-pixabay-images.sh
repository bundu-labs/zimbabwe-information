#!/bin/bash

# Pixabay Image Download Script using API
# Uses Pixabay API to download images with proper authentication
#
# Usage: bash .github/download-pixabay-images.sh

set -e

# Pixabay API Configuration
API_KEY="9315130-0be0ce91bfe854b89dd7b0b0b"
API_URL="https://pixabay.com/api/"

echo "====================================="
echo "Zimbabwe Travel Info - Pixabay Image Downloader (API)"
echo "====================================="
echo ""

# Create directory structure
echo "Creating image directory structure..."
mkdir -p images/destinations/{mana-pools,matobo-hills,great-zimbabwe,matusadona}
mkdir -p images/wildlife
mkdir -p images/culture
mkdir -p images/adventure
mkdir -p images/planning
echo "✓ Directory structure created"
echo ""

# Function to extract image ID from Pixabay URL
extract_image_id() {
  local url="$1"
  # Extract pattern like "elephant-3304164" and get the ID
  echo "$url" | grep -oP '(?<=/)\w+-\d+' | grep -oP '\d+$'
}

# Function to download image via API
download_via_api() {
  local image_id="$1"
  local output_path="$2"
  local description="$3"

  echo "  Fetching image ID $image_id via API..."

  # Get image details from API
  local api_response=$(curl -s "${API_URL}?key=${API_KEY}&id=${image_id}")

  # Check if jq is available for JSON parsing
  if command -v jq &> /dev/null; then
    # Use jq to parse JSON
    local image_url=$(echo "$api_response" | jq -r '.hits[0].largeImageURL // empty')
  else
    # Fallback: use sed for simple extraction (macOS compatible)
    local image_url=$(echo "$api_response" | sed -n 's/.*"largeImageURL":"\([^"]*\)".*/\1/p' | head -1)
  fi

  if [ -z "$image_url" ] || [ "$image_url" = "null" ]; then
    echo "    ❌ Failed to get image URL from API for ID $image_id"
    # Debug: show API response
    echo "    Debug: API response: $(echo "$api_response" | head -c 200)"
    return 1
  fi

  # Download the image
  if curl -L "$image_url" -o "$output_path" --silent --show-error; then
    local file_size=$(ls -lh "$output_path" | awk '{print $5}')
    echo "    ✓ Downloaded: $description ($file_size)"
    return 0
  else
    echo "    ❌ Failed to download: $description"
    return 1
  fi
}

echo "Downloading Pixabay images via API..."
echo ""

# Track stats
total=17
success=0
failed=0

# Destinations
echo "📍 Destinations:"
if download_via_api "3304164" "images/destinations/mana-pools/elephants-river.jpg" "Mana Pools - Elephants"; then ((success++)); else ((failed++)); fi
if download_via_api "2635720" "images/destinations/matobo-hills/balancing-rocks.jpg" "Matobo Hills - Balancing Rocks"; then ((success++)); else ((failed++)); fi
if download_via_api "3145185" "images/destinations/great-zimbabwe/stone-walls.jpg" "Great Zimbabwe - Stone Walls"; then ((success++)); else ((failed++)); fi
if download_via_api "2033260" "images/destinations/matusadona/elephants-waterside.jpg" "Matusadona - Elephants"; then ((success++)); else ((failed++)); fi
echo ""

# Wildlife
echo "🦁 Wildlife:"
if download_via_api "1822636" "images/wildlife/elephant-herd.jpg" "Elephant Herd"; then ((success++)); else ((failed++)); fi
if download_via_api "2325899" "images/wildlife/conservation-elephant.jpg" "Conservation Elephant"; then ((success++)); else ((failed++)); fi
if download_via_api "3675851" "images/wildlife/savanna-wildlife.jpg" "Savanna Wildlife"; then ((success++)); else ((failed++)); fi
echo ""

# Adventure
echo "🏔️ Adventure:"
if download_via_api "1412162" "images/adventure/white-water-rafting.jpg" "White Water Rafting"; then ((success++)); else ((failed++)); fi
if download_via_api "2489708" "images/adventure/african-safari.jpg" "African Safari"; then ((success++)); else ((failed++)); fi
echo ""

# Culture
echo "🎭 Culture:"
if download_via_api "3096641" "images/culture/traditional-drums.jpg" "Traditional Drums"; then ((success++)); else ((failed++)); fi
if download_via_api "4910625" "images/culture/traditional-food.jpg" "Traditional Food"; then ((success++)); else ((failed++)); fi
if download_via_api "2595309" "images/culture/cultural-celebration.jpg" "Cultural Celebration"; then ((success++)); else ((failed++)); fi
echo ""

# Planning
echo "📋 Planning:"
if download_via_api "869061" "images/planning/business-scene.jpg" "Business Travel"; then ((success++)); else ((failed++)); fi
if download_via_api "2586370" "images/planning/romantic-sunset.jpg" "Couples Travel - Sunset"; then ((success++)); else ((failed++)); fi
if download_via_api "2542331" "images/planning/group-safari.jpg" "Group Travel - Elephants"; then ((success++)); else ((failed++)); fi
if download_via_api "4001076" "images/planning/safari-jeep.jpg" "Safari Planning - Jeep"; then ((success++)); else ((failed++)); fi
if download_via_api "2593341" "images/planning/solo-adventure.jpg" "Solo Travel"; then ((success++)); else ((failed++)); fi
echo ""

echo "====================================="
echo "Download Complete!"
echo "Total: $total images"
echo "✅ Success: $success"
echo "❌ Failed: $failed"
echo "====================================="
echo ""

if [ $success -gt 0 ]; then
  echo "✓ Successfully downloaded $success images"
  echo ""
  echo "Next steps:"
  echo "1. Check image quality and sizes"
  echo "2. Optimize large images (> 300KB) using TinyPNG.com"
  echo "3. Run: bash .github/update-image-paths.sh"
  echo "4. Commit and push changes"
else
  echo "⚠️  No images were downloaded successfully"
  echo "Please check your API key and internet connection"
fi
echo ""
