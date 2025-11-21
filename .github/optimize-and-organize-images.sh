#!/bin/bash

# Image Optimization and Organization Script
# Optimizes images from Zim pics and organizes them into proper directories
# Uses sips (built-in macOS tool) for image processing
#
# Usage: bash .github/optimize-and-organize-images.sh

set -e

echo "====================================="
echo "Zimbabwe Travel Info - Image Optimizer & Organizer"
echo "====================================="
echo ""

# Configuration
MAX_WIDTH=1200
SOURCE_DIR="images/Zim pics"

# First, remove the incorrectly downloaded Pixabay images
echo "🗑️  Removing incorrectly downloaded Pixabay images..."
rm -rf images/destinations/mana-pools images/destinations/great-zimbabwe
rm -rf images/wildlife images/planning images/adventure images/culture
echo "✓ Cleaned up incorrect downloads"
echo ""

# Create proper directory structure
echo "📁 Creating directory structure..."
mkdir -p images/destinations/{victoria-falls,hwange,kariba,mana-pools,great-zimbabwe,matobo-hills,gonarezhou,harare,bulawayo,chimanimani,zambezi}
mkdir -p images/wildlife
mkdir -p images/culture
mkdir -p images/adventure
mkdir -p images/general
echo "✓ Directory structure created"
echo ""

# Initialize counters
total=0
processed=0

echo "📊 Processing and organizing images..."
echo "Target width: ${MAX_WIDTH}px"
echo ""

# Function to optimize and copy image
optimize_and_copy() {
  local source="$1"
  local destination="$2"
  local description="$3"

  if [ ! -f "$source" ]; then
    echo "  ⚠️  Source not found: $(basename "$source")"
    return 1
  fi

  ((total++))

  # Get original dimensions
  local original_width=$(sips -g pixelWidth "$source" | tail -1 | awk '{print $2}')
  local original_size=$(ls -lh "$source" | awk '{print $5}')

  echo "[$total] $description"
  echo "    Source: $(basename "$source") (${original_width}px, $original_size)"

  # Create destination directory if needed
  mkdir -p "$(dirname "$destination")"

  # Optimize and resize
  if [ "$original_width" -gt "$MAX_WIDTH" ]; then
    # Resize to max width
    sips -Z $MAX_WIDTH "$source" --out "$destination" &>/dev/null
  else
    # Just copy and optimize
    cp "$source" "$destination"
  fi

  # Get new size
  local new_size=$(ls -lh "$destination" | awk '{print $5}')
  echo "    Saved to: $destination ($new_size)"
  echo ""

  ((processed++))
  return 0
}

# Victoria Falls images
echo "🌊 Victoria Falls:"
optimize_and_copy "$SOURCE_DIR/vicfalls-aerial2.png" "images/destinations/victoria-falls/aerial-view.jpg" "Aerial view"
optimize_and_copy "$SOURCE_DIR/vicfalls-rainbow.png" "images/destinations/victoria-falls/rainbow.jpg" "Rainbow view"
optimize_and_copy "$SOURCE_DIR/vicfalls-bridgeview.jpg" "images/destinations/victoria-falls/bridge-view.jpg" "Bridge view"
optimize_and_copy "$SOURCE_DIR/vicfalls-sunset.png" "images/destinations/victoria-falls/sunset.jpg" "Sunset"
echo ""

# Hwange National Park
echo "🦁 Hwange National Park:"
optimize_and_copy "$SOURCE_DIR/hwange-np-lion.jpg" "images/destinations/hwange/lion.jpg" "Lion"
optimize_and_copy "$SOURCE_DIR/hwange-np-waterhole2.jpg" "images/destinations/hwange/waterhole.jpg" "Waterhole"
optimize_and_copy "$SOURCE_DIR/hwange-np-waterhole-sunset.jpg" "images/destinations/hwange/waterhole-sunset.jpg" "Waterhole sunset"
optimize_and_copy "$SOURCE_DIR/hwange-np-roan-antelope.jpg" "images/destinations/hwange/roan-antelope.jpg" "Roan antelope"
echo ""

# Lake Kariba
echo "🌅 Lake Kariba:"
optimize_and_copy "$SOURCE_DIR/kariba-damwall.jpg" "images/destinations/kariba/dam-wall.jpg" "Dam wall"
optimize_and_copy "$SOURCE_DIR/Kariba-sunset-vertical.jpg" "images/destinations/kariba/sunset.jpg" "Sunset"
optimize_and_copy "$SOURCE_DIR/kariba-fishing.jpg" "images/destinations/kariba/fishing.jpg" "Fishing"
optimize_and_copy "$SOURCE_DIR/kariba-crocodiles.jpg" "images/destinations/kariba/crocodiles.jpg" "Crocodiles"
echo ""

# Mana Pools
echo "🐘 Mana Pools:"
optimize_and_copy "$SOURCE_DIR/manapools-np-elephants-eating.jpg" "images/destinations/mana-pools/elephants-eating.jpg" "Elephants eating"
optimize_and_copy "$SOURCE_DIR/manapools-np-impala.jpg" "images/destinations/mana-pools/impala.jpg" "Impala"
optimize_and_copy "$SOURCE_DIR/zambezi-river-elephant-herd.jpg" "images/destinations/mana-pools/elephant-herd.jpg" "Elephant herd"
echo ""

# Great Zimbabwe
echo "🏛️  Great Zimbabwe:"
optimize_and_copy "$SOURCE_DIR/great-zimbabwe-view.jpg" "images/destinations/great-zimbabwe/view.jpg" "Overview"
optimize_and_copy "$SOURCE_DIR/great-zimbabwe-kings-enclosure2.jpg" "images/destinations/great-zimbabwe/kings-enclosure.jpg" "Kings enclosure"
optimize_and_copy "$SOURCE_DIR/great-zimbabwe-kings-hilltop.jpg" "images/destinations/great-zimbabwe/kings-hilltop.jpg" "Kings hilltop"
echo ""

# Matobo Hills
echo "⛰️  Matobo Hills:"
optimize_and_copy "$SOURCE_DIR/matobo-np-white-rhino.jpg" "images/destinations/matobo-hills/white-rhino.jpg" "White rhino"
optimize_and_copy "$SOURCE_DIR/matobo-np-worlds-view.jpg" "images/destinations/matobo-hills/worlds-view.jpg" "World's View"
optimize_and_copy "$SOURCE_DIR/matobo-np-rhodesgrave.jpg" "images/destinations/matobo-hills/rhodes-grave.jpg" "Rhodes grave"
echo ""

# Gonarezhou
echo "🌄 Gonarezhou:"
optimize_and_copy "$SOURCE_DIR/gonarezhou-np-elephant-chilojo-cliffs.jpg" "images/destinations/gonarezhou/elephant-chilojo-cliffs.jpg" "Elephant at Chilojo Cliffs"
optimize_and_copy "$SOURCE_DIR/gonarezhou-runde-river.jpg" "images/destinations/gonarezhou/runde-river.jpg" "Runde River"
echo ""

# Cities
echo "🏙️  Cities:"
optimize_and_copy "$SOURCE_DIR/harare.jpg" "images/destinations/harare/city-view.jpg" "Harare city view"
optimize_and_copy "$SOURCE_DIR/bulawayo-street.jpg" "images/destinations/bulawayo/street-view.jpg" "Bulawayo street"
echo ""

# Chimanimani
echo "🏔️  Chimanimani:"
optimize_and_copy "$SOURCE_DIR/chimanimani-mountains.jpg" "images/destinations/chimanimani/mountains.jpg" "Chimanimani mountains"
echo ""

# Zambezi region
echo "🌊 Zambezi:"
optimize_and_copy "$SOURCE_DIR/zambezi-np-boabab.jpg" "images/destinations/zambezi/baobab.jpg" "Baobab tree"
optimize_and_copy "$SOURCE_DIR/zambezi-river-sunset-cruise.jpg" "images/destinations/zambezi/sunset-cruise.jpg" "Sunset cruise"
optimize_and_copy "$SOURCE_DIR/zambesi-river-schalows-turaco_.jpg" "images/destinations/zambezi/schalows-turaco.jpg" "Schalow's turaco"
echo ""

# Wildlife
echo "🦒 Wildlife:"
optimize_and_copy "$SOURCE_DIR/zim-mammals-porcupine.jpg" "images/wildlife/porcupine.jpg" "Porcupine"
echo ""

# Culture
echo "🎨 Culture:"
optimize_and_copy "$SOURCE_DIR/zimbabwe-rockpaintings.jpg" "images/culture/rock-paintings.jpg" "Rock paintings"
optimize_and_copy "$SOURCE_DIR/zimbabwe-rockpaintings-people.jpg" "images/culture/rock-paintings-people.jpg" "Rock paintings with people"
echo ""

# General/Activities
echo "🎯 Activities & General:"
optimize_and_copy "$SOURCE_DIR/zimbabwe-safaris.jpg" "images/general/safari.jpg" "Safari"
optimize_and_copy "$SOURCE_DIR/zimbabwe-safaris2.jpg" "images/general/safari-2.jpg" "Safari group"
optimize_and_copy "$SOURCE_DIR/zimbabwe-safaris3.jpg" "images/general/safari-3.jpg" "Safari vehicle"
optimize_and_copy "$SOURCE_DIR/zimbabwe-activities2.jpg" "images/general/activities-2.jpg" "Activities"
optimize_and_copy "$SOURCE_DIR/zimbabwe-activities3.jpg" "images/general/activities-3.jpg" "Activities"
optimize_and_copy "$SOURCE_DIR/zimbabwe-activities6.jpg" "images/general/activities-6.jpg" "Activities"
optimize_and_copy "$SOURCE_DIR/zimbabwe-activities7.jpg" "images/general/activities-7.jpg" "Activities"
optimize_and_copy "$SOURCE_DIR/zimbabwe-accommodation.jpg" "images/general/accommodation.jpg" "Accommodation"
optimize_and_copy "$SOURCE_DIR/vicfalls-lion-encounter2.jpg" "images/general/lion-encounter.jpg" "Lion encounter"
optimize_and_copy "$SOURCE_DIR/zimtrees-jacaranda.jpg" "images/general/jacaranda.jpg" "Jacaranda trees"
echo ""

echo "====================================="
echo "Processing Complete!"
echo "Total images processed: $processed"
echo "====================================="
echo ""
echo "Images have been optimized and organized into:"
echo "  - images/destinations/ (by location)"
echo "  - images/wildlife/"
echo "  - images/culture/"
echo "  - images/general/"
echo ""
echo "Next step: Update MDX files to use these images with:"
echo '  <img src="/images/destinations/victoria-falls/aerial-view.jpg" style={{width: "450px", height: "auto"}} alt="Victoria Falls aerial view" />'
echo ""
