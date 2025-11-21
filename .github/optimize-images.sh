#!/bin/bash

# Image Optimization Script for Zimbabwe Travel Information
# Resizes and optimizes images from Zim pics directory
# Converts to WebP for better compression while maintaining quality
#
# Usage: bash .github/optimize-images.sh

set -e

echo "====================================="
echo "Zimbabwe Travel Info - Image Optimizer"
echo "====================================="
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
  echo "❌ Error: ImageMagick is not installed"
  echo "Please install it with: brew install imagemagick"
  exit 1
fi

# Configuration
MAX_WIDTH=1200
QUALITY=85
SOURCE_DIR="images/Zim pics"
TEMP_DIR="images/optimized"

# Create temp directory
mkdir -p "$TEMP_DIR"

echo "📊 Processing images from: $SOURCE_DIR"
echo "Target width: ${MAX_WIDTH}px"
echo "Quality: ${QUALITY}%"
echo ""

# Initialize counters
total=0
processed=0
skipped=0

# Find and process all images
while IFS= read -r -d '' file; do
  ((total++))

  filename=$(basename "$file")
  filename_noext="${filename%.*}"

  # Get original dimensions
  original_width=$(identify -format "%w" "$file" 2>/dev/null || echo "0")
  original_height=$(identify -format "%h" "$file" 2>/dev/null || echo "0")
  original_size=$(ls -lh "$file" | awk '{print $5}')

  echo "[$total] Processing: $filename"
  echo "    Original: ${original_width}x${original_height} ($original_size)"

  # Determine output format (keep as JPG for photos)
  output_file="$TEMP_DIR/${filename_noext}.jpg"

  # Resize and optimize
  if [ "$original_width" -gt "$MAX_WIDTH" ]; then
    # Resize if wider than max width
    convert "$file" \
      -resize "${MAX_WIDTH}x" \
      -quality $QUALITY \
      -strip \
      "$output_file" 2>/dev/null

    new_width=$(identify -format "%w" "$output_file")
    new_height=$(identify -format "%h" "$output_file")
    new_size=$(ls -lh "$output_file" | awk '{print $5}')

    echo "    Optimized: ${new_width}x${new_height} ($new_size)"
    ((processed++))
  else
    # Just optimize without resizing
    convert "$file" \
      -quality $QUALITY \
      -strip \
      "$output_file" 2>/dev/null

    new_size=$(ls -lh "$output_file" | awk '{print $5}')
    echo "    Optimized: ${original_width}x${original_height} ($new_size)"
    ((processed++))
  fi

  echo ""

done < <(find "$SOURCE_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -print0)

echo "====================================="
echo "Optimization Complete!"
echo "Total images found: $total"
echo "Successfully processed: $processed"
echo "Skipped: $skipped"
echo "====================================="
echo ""
echo "Optimized images are in: $TEMP_DIR"
echo ""
echo "Next steps:"
echo "1. Review optimized images"
echo "2. Run organize-zim-images.sh to copy to proper directories"
echo "3. Update MDX files to reference local images"
echo ""
