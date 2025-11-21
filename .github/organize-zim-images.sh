#!/bin/bash

# Image Organization Script for Zim pics
# Copies and converts images from "Zim pics" directory to organized structure
# Converts PNGs to JPGs and resizes to consistent width
#
# Usage: bash .github/organize-zim-images.sh

set -e

echo "====================================="
echo "Zimbabwe Travel Info - Image Organizer"
echo "====================================="
echo ""

# Configuration
MAX_WIDTH=1200
SOURCE_DIR="images/Zim pics"

# First, remove the incorrectly downloaded Pixabay images
echo "🗑️  Removing incorrectly downloaded images..."
rm -rf images/destinations images/wildlife images/planning images/adventure images/culture images/general 2>/dev/null || true
echo "✓ Cleaned up"
echo ""

# Create proper directory structure
echo "📁 Creating directory structure..."
mkdir -p images/destinations/{victoria-falls,hwange,kariba,mana-pools,great-zimbabwe,matobo-hills,gonarezhou,harare,bulawayo,chimanimani,zambezi,khami,domboshawa}
mkdir -p images/wildlife
mkdir -p images/culture
mkdir -p images/adventure
mkdir -p images/general
mkdir -p images/planning
echo "✓ Directory structure created"
echo ""

# Initialize counters
total=0
processed=0

# Function to convert and copy image
convert_and_copy() {
  local source="$1"
  local destination="$2"
  local description="$3"

  if [ ! -f "$source" ]; then
    echo "  ⚠️  Not found: $(basename "$source")"
    return 1
  fi

  ((total++))

  # Get original info
  local original_width=$(sips -g pixelWidth "$source" 2>/dev/null | tail -1 | awk '{print $2}')
  local original_size=$(ls -lh "$source" | awk '{print $5}')

  echo "[$total] $description"
  echo "    Source: $(basename "$source") ($original_size)"

  # Create destination directory
  mkdir -p "$(dirname "$destination")"

  # Convert PNG to JPG and resize
  if [ "$original_width" -gt "$MAX_WIDTH" ]; then
    sips -s format jpeg -Z $MAX_WIDTH "$source" --out "$destination" &>/dev/null
  else
    sips -s format jpeg "$source" --out "$destination" &>/dev/null
  fi

  local new_size=$(ls -lh "$destination" 2>/dev/null | awk '{print $5}')
  echo "    Output: $(basename "$destination") ($new_size)"
  echo ""

  ((processed++))
  return 0
}

echo "📊 Processing images..."
echo ""

# Victoria Falls (Priority destination)
echo "🌊 VICTORIA FALLS:"
convert_and_copy "$SOURCE_DIR/vicfalls-aerial2.jpg" "images/destinations/victoria-falls/aerial-view.jpg" "Aerial view"
convert_and_copy "$SOURCE_DIR/vicfalls-rainbow.jpg" "images/destinations/victoria-falls/rainbow.jpg" "Rainbow"
convert_and_copy "$SOURCE_DIR/vicfalls-bridgeview.jpg" "images/destinations/victoria-falls/bridge-view.jpg" "Bridge view"
convert_and_copy "$SOURCE_DIR/vicfalls-sunset-openshutter.jpg" "images/destinations/victoria-falls/sunset.jpg" "Sunset"
convert_and_copy "$SOURCE_DIR/vicfalls-sideview.jpg" "images/destinations/victoria-falls/side-view.jpg" "Side view"
convert_and_copy "$SOURCE_DIR/vicfalls-devilscataract.jpg" "images/destinations/victoria-falls/devils-cataract.jpg" "Devil's Cataract"
convert_and_copy "$SOURCE_DIR/vicfalls-white-water-rafting.jpg" "images/destinations/victoria-falls/white-water-rafting.jpg" "White water rafting"
echo ""

# Hwange National Park
echo "🦁 HWANGE NATIONAL PARK:"
convert_and_copy "$SOURCE_DIR/hwange-np-lion.jpg" "images/destinations/hwange/lion.jpg" "Lion"
convert_and_copy "$SOURCE_DIR/hwange-np-waterhole2.jpg" "images/destinations/hwange/waterhole.jpg" "Waterhole"
convert_and_copy "$SOURCE_DIR/hwange-np-waterhole-sunset.jpg" "images/destinations/hwange/waterhole-sunset.jpg" "Waterhole at sunset"
convert_and_copy "$SOURCE_DIR/hwange-np-waterhole-elephants.jpg" "images/destinations/hwange/waterhole-elephants.jpg" "Elephants at waterhole"
convert_and_copy "$SOURCE_DIR/hwange-np-roan-antelope.jpg" "images/destinations/hwange/roan-antelope.jpg" "Roan antelope"
convert_and_copy "$SOURCE_DIR/hwange-np-sable.jpg" "images/destinations/hwange/sable.jpg" "Sable antelope"
convert_and_copy "$SOURCE_DIR/hwange-np-cheetah.jpg" "images/destinations/hwange/cheetah.jpg" "Cheetah"
echo ""

# Lake Kariba
echo "🌅 LAKE KARIBA:"
convert_and_copy "$SOURCE_DIR/kariba-damwall.jpg" "images/destinations/kariba/dam-wall.jpg" "Dam wall"
convert_and_copy "$SOURCE_DIR/Kariba-sunset-vertical.jpg" "images/destinations/kariba/sunset.jpg" "Sunset"
convert_and_copy "$SOURCE_DIR/kariba-fishing.jpg" "images/destinations/kariba/fishing.jpg" "Fishing"
convert_and_copy "$SOURCE_DIR/kariba-crocodiles.jpg" "images/destinations/kariba/crocodiles.jpg" "Crocodiles"
convert_and_copy "$SOURCE_DIR/kariba-houseboat.jpg" "images/destinations/kariba/houseboat.jpg" "Houseboat"
convert_and_copy "$SOURCE_DIR/kariba-buffalo.jpg" "images/destinations/kariba/buffalo.jpg" "Buffalo"
echo ""

# Mana Pools
echo "🐘 MANA POOLS:"
convert_and_copy "$SOURCE_DIR/manapools-np-elephants-eating.jpg" "images/destinations/mana-pools/elephants-eating.jpg" "Elephants eating"
convert_and_copy "$SOURCE_DIR/manapools-np-impala.jpg" "images/destinations/mana-pools/impala.jpg" "Impala"
convert_and_copy "$SOURCE_DIR/zambezi-river-elephant-herd.jpg" "images/destinations/mana-pools/elephant-herd.jpg" "Elephant herd"
convert_and_copy "$SOURCE_DIR/manapools-np-painteddog.jpg" "images/destinations/mana-pools/painted-dog.jpg" "Painted dog"
convert_and_copy "$SOURCE_DIR/manapools-sunset-elephant.jpg" "images/destinations/mana-pools/sunset-elephant.jpg" "Sunset with elephant"
echo ""

# Great Zimbabwe
echo "🏛️  GREAT ZIMBABWE:"
convert_and_copy "$SOURCE_DIR/great-zimbabwe-view.jpg" "images/destinations/great-zimbabwe/overview.jpg" "Overview"
convert_and_copy "$SOURCE_DIR/great-zimbabwe-kings-enclosure2.jpg" "images/destinations/great-zimbabwe/kings-enclosure.jpg" "King's enclosure"
convert_and_copy "$SOURCE_DIR/great-zimbabwe-kings-hilltop.jpg" "images/destinations/great-zimbabwe/kings-hilltop.jpg" "King's hilltop"
convert_and_copy "$SOURCE_DIR/great-zimbabwe.jpg" "images/destinations/great-zimbabwe/ruins.jpg" "Ruins"
echo ""

# Matobo Hills
echo "⛰️  MATOBO HILLS:"
convert_and_copy "$SOURCE_DIR/matobo-np-white-rhino.jpg" "images/destinations/matobo-hills/white-rhino.jpg" "White rhino"
convert_and_copy "$SOURCE_DIR/matobo-np-worlds-view.jpg" "images/destinations/matobo-hills/worlds-view.jpg" "World's View"
convert_and_copy "$SOURCE_DIR/matobo-np-rhodesgrave.jpg" "images/destinations/matobo-hills/rhodes-grave.jpg" "Rhodes' grave"
convert_and_copy "$SOURCE_DIR/matobo-np-granite-foramtions.jpg" "images/destinations/matobo-hills/granite-formations.jpg" "Granite formations"
convert_and_copy "$SOURCE_DIR/zimbabwe-balancing-rocks.jpg" "images/destinations/matobo-hills/balancing-rocks.jpg" "Balancing rocks"
echo ""

# Gonarezhou
echo "🌄 GONAREZHOU:"
convert_and_copy "$SOURCE_DIR/gonarezhou-np-elephant-chilojo-cliffs.jpg" "images/destinations/gonarezhou/elephant-chilojo-cliffs.jpg" "Elephant at Chilojo Cliffs"
convert_and_copy "$SOURCE_DIR/gonarezhou-runde-river.jpg" "images/destinations/gonarezhou/runde-river.jpg" "Runde River"
convert_and_copy "$SOURCE_DIR/gonarezhou-np-chilojo-cliffs.jpg" "images/destinations/gonarezhou/chilojo-cliffs.jpg" "Chilojo Cliffs"
echo ""

# Harare
echo "🏙️  HARARE:"
convert_and_copy "$SOURCE_DIR/harare.jpg" "images/destinations/harare/city-view.jpg" "City view"
convert_and_copy "$SOURCE_DIR/harare-city-skyline.jpg" "images/destinations/harare/skyline.jpg" "Skyline"
echo ""

# Bulawayo
echo "🏛️  BULAWAYO:"
convert_and_copy "$SOURCE_DIR/bulawayo-street.jpg" "images/destinations/bulawayo/street-view.jpg" "Street view"
convert_and_copy "$SOURCE_DIR/bulawayo-people.jpg" "images/destinations/bulawayo/city-life.jpg" "City life"
echo ""

# Chimanimani
echo "🏔️  CHIMANIMANI:"
convert_and_copy "$SOURCE_DIR/chimanimani-mountains.jpg" "images/destinations/chimanimani/mountains.jpg" "Mountains"
echo ""

# Zambezi
echo "🌊 ZAMBEZI:"
convert_and_copy "$SOURCE_DIR/zambezi-np-boabab.jpg" "images/destinations/zambezi/baobab.jpg" "Baobab tree"
convert_and_copy "$SOURCE_DIR/zambezi-river-sunset-cruise.jpg" "images/destinations/zambezi/sunset-cruise.jpg" "Sunset cruise"
convert_and_copy "$SOURCE_DIR/zambesi-river-schalows-turaco_.jpg" "images/destinations/zambezi/schalows-turaco.jpg" "Schalow's turaco"
echo ""

# Khami Ruins
echo "🏺 KHAMI RUINS:"
convert_and_copy "$SOURCE_DIR/ZW_Khami_Ruins.JPG" "images/destinations/khami/ruins.jpg" "Khami ruins"
echo ""

# Domboshawa
echo "🎨 DOMBOSHAWA:"
convert_and_copy "$SOURCE_DIR/domboshawa-rock.jpg" "images/destinations/domboshawa/rock.jpg" "Domboshawa rock"
convert_and_copy "$SOURCE_DIR/domboshawa-cave-painting.jpg" "images/destinations/domboshawa/cave-painting.jpg" "Cave painting"
echo ""

# Wildlife
echo "🦒 WILDLIFE:"
convert_and_copy "$SOURCE_DIR/zim-mammals-porcupine.jpg" "images/wildlife/porcupine.jpg" "Porcupine"
convert_and_copy "$SOURCE_DIR/kingfisher-2046453_1920.jpg" "images/wildlife/kingfisher.jpg" "Kingfisher"
echo ""

# Culture
echo "🎨 CULTURE:"
convert_and_copy "$SOURCE_DIR/zimbabwe-rockpaintings.jpg" "images/culture/rock-paintings.jpg" "Rock paintings"
convert_and_copy "$SOURCE_DIR/zimbabwe-rockpaintings-people.jpg" "images/culture/rock-paintings-people.jpg" "Rock paintings with people"
convert_and_copy "$SOURCE_DIR/zimbabwe-bond-note.jpg" "images/culture/bond-note.jpg" "Zimbabwe bond note"
echo ""

# Adventure/Activities
echo "🎯 ADVENTURE & ACTIVITIES:"
convert_and_copy "$SOURCE_DIR/zimbabwe-safaris.jpg" "images/adventure/safari.jpg" "Safari"
convert_and_copy "$SOURCE_DIR/zimbabwe-safaris2.jpg" "images/adventure/safari-group.jpg" "Safari group"
convert_and_copy "$SOURCE_DIR/zimbabwe-safaris3.jpg" "images/adventure/safari-vehicle.jpg" "Safari vehicle"
convert_and_copy "$SOURCE_DIR/zimbabwe-activities2.jpg" "images/adventure/activities-2.jpg" "Activities"
convert_and_copy "$SOURCE_DIR/zimbabwe-activities3.jpg" "images/adventure/activities-3.jpg" "Activities"
convert_and_copy "$SOURCE_DIR/zimbabwe-walking-safari.jpg" "images/adventure/walking-safari.jpg" "Walking safari"
convert_and_copy "$SOURCE_DIR/vicfalls-lion-encounter2.jpg" "images/adventure/lion-encounter.jpg" "Lion encounter"
echo ""

# Planning/General
echo "📋 PLANNING & GENERAL:"
convert_and_copy "$SOURCE_DIR/zimbabwe-accommodation.jpg" "images/planning/accommodation.jpg" "Accommodation"
convert_and_copy "$SOURCE_DIR/zimtrees-jacaranda.jpg" "images/general/jacaranda.jpg" "Jacaranda trees"
convert_and_copy "$SOURCE_DIR/great-limpopo-transfrontier-park.jpg" "images/general/transfrontier-park.jpg" "Transfrontier park map"
echo ""

echo "====================================="
echo "Processing Complete!"
echo "Successfully processed: $processed images"
echo "====================================="
echo ""
echo "Images have been organized and converted to JPG format in:"
echo "  - images/destinations/ (by location)"
echo "  - images/wildlife/"
echo "  - images/culture/"
echo "  - images/adventure/"
echo "  - images/planning/"
echo "  - images/general/"
echo ""
echo "All images are optimized and ready to use with:"
echo '  <img src="/images/destinations/victoria-falls/aerial-view.jpg" style={{width: "450px", height: "auto"}} alt="Description" />'
echo ""
