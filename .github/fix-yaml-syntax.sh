#!/bin/bash

# YAML Syntax Fix Script for Zimbabwe Travel Information
# This script fixes unquoted values in YAML frontmatter
# Usage: bash .github/fix-yaml-syntax.sh

set -e

echo "====================================="
echo "Zimbabwe Travel Info - YAML Syntax Fixer"
echo "====================================="
echo ""

echo "Fixing unquoted values in YAML frontmatter..."
echo ""

# Fix twitter:card unquoted values
echo "Fixing twitter:card values..."
find . -name "*.mdx" -type f -exec sed -i '' \
  "s/'twitter:card': summary_large_image/'twitter:card': \"summary_large_image\"/g" {} \;
echo "✓ twitter:card values fixed"

# Fix og:site_name unquoted values
echo "Fixing og:site_name values..."
find . -name "*.mdx" -type f -exec sed -i '' \
  "s/'og:site_name': Zimbabwe Travel Information/'og:site_name': \"Zimbabwe Travel Information\"/g" {} \;
echo "✓ og:site_name values fixed"

# Fix og:type unquoted values
echo "Fixing og:type values..."
find . -name "*.mdx" -type f -exec sed -i '' \
  "s/'og:type': article/'og:type': \"article\"/g" {} \;
echo "✓ og:type values fixed"

# Fix schema:type unquoted values
echo "Fixing schema:type values..."
find . -name "*.mdx" -type f -exec sed -i '' \
  "s/'schema:type': TouristDestination/'schema:type': \"TouristDestination\"/g" {} \;
find . -name "*.mdx" -type f -exec sed -i '' \
  "s/'schema:type': WebPage/'schema:type': \"WebPage\"/g" {} \;
find . -name "*.mdx" -type f -exec sed -i '' \
  "s/'schema:type': FAQPage/'schema:type': \"FAQPage\"/g" {} \;
echo "✓ schema:type values fixed"

# Fix author unquoted values
echo "Fixing author values..."
find . -name "*.mdx" -type f -exec sed -i '' \
  "s/^author: Zimbabwe Travel Information/author: \"Zimbabwe Travel Information\"/g" {} \;
echo "✓ author values fixed"

# Count affected files
affected_files=$(find . -name "*.mdx" -type f | wc -l | tr -d ' ')

echo ""
echo "====================================="
echo "YAML Syntax Fix Complete!"
echo "Total MDX files processed: $affected_files"
echo "====================================="
echo ""
echo "Next steps:"
echo "1. Review changes with: git diff"
echo "2. Test a few files to ensure syntax is correct"
echo "3. Commit changes if everything looks good"
echo ""
