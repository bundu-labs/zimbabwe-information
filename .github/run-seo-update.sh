#!/bin/bash

# SEO Update Wrapper Script for Zimbabwe Travel Information
# This provides an easier interface to run the SEO update script
#
# Usage:
#   bash .github/run-seo-update.sh              # Normal run
#   bash .github/run-seo-update.sh --dry-run   # Test run (no changes)
#   bash .github/run-seo-update.sh --force     # Force update all files

set -e

echo "====================================="
echo "Zimbabwe Travel Info - SEO Update"
echo "====================================="
echo ""

# Check if gray-matter is installed
if ! npm list gray-matter &> /dev/null; then
  echo "📦 Installing gray-matter package..."
  npm install --save-dev gray-matter
  echo ""
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
  echo "❌ Error: Node.js is not installed"
  echo "Please install Node.js from https://nodejs.org/"
  exit 1
fi

# Run the SEO update script
echo "🚀 Running SEO update script..."
echo ""

node .github/seo-update.js "$@"

exit_code=$?

if [ $exit_code -eq 0 ]; then
  echo ""
  echo "====================================="
  echo "✅ SEO Update Complete"
  echo "====================================="
else
  echo ""
  echo "====================================="
  echo "❌ SEO Update Failed"
  echo "====================================="
  exit $exit_code
fi
