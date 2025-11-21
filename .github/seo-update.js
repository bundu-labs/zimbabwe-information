#!/usr/bin/env node

/**
 * SEO Update Script for Zimbabwe Travel Information
 *
 * This script updates SEO metadata across all MDX files in the repository.
 * Converted from GitHub Actions workflow to manual script.
 *
 * Usage:
 *   node .github/seo-update.js [options]
 *
 * Options:
 *   --dry-run          Perform dry run (no file changes)
 *   --force            Force update all files (even if SEO exists)
 *   --dirs=<dirs>      Comma-separated directories to process
 *
 * Examples:
 *   node .github/seo-update.js --dry-run
 *   node .github/seo-update.js --force
 *   node .github/seo-update.js --dirs=./destinations,./planning
 */

const fs = require('fs');
const path = require('path');

// Check if gray-matter is installed
try {
  var matter = require('gray-matter');
} catch (error) {
  console.error('❌ Error: gray-matter package not found.');
  console.error('Please install it with: npm install --save-dev gray-matter');
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE_UPDATE = args.includes('--force');
const dirsArg = args.find(arg => arg.startsWith('--dirs='));
const DIRECTORIES = dirsArg
  ? dirsArg.split('=')[1].split(',').map(d => d.trim())
  : ['./destinations', './planning', './essentials', './culture', './wildlife', './adventure', './get-involved', './'];

// SEO Configuration for Zimbabwe Travel Information
const SEO_DEFAULTS = {
  'og:image': 'https://travel-info.co.zw/images/hero-light.svg',
  'og:site_name': 'Zimbabwe Travel Information',
  'twitter:card': 'summary_large_image',
  'twitter:site': '@zimbabwetravel',
  'twitter:creator': '@zimbabwetravel',
  'robots': 'index, follow',
  'author': 'Zimbabwe Travel Information',
  'keywords': 'Zimbabwe travel, Victoria Falls, Hwange National Park, Great Zimbabwe, safari, African tourism, Zimbabwe destinations, travel guide'
};

const SUPPORTED_EXTENSIONS = ['.mdx', '.md'];

// Zimbabwe-specific keywords to prioritize
const ZIMBABWE_KEYWORDS = [
  'zimbabwe', 'victoria falls', 'hwange', 'harare', 'bulawayo', 'safari',
  'great zimbabwe', 'mana pools', 'matobo hills', 'eastern highlands',
  'kariba', 'gonarezhou', 'wildlife', 'africa', 'travel', 'tourism',
  'accommodation', 'budget travel', 'luxury travel', 'family travel'
];

function extractTextContent(content) {
  return content
    .replace(/^---[\s\S]*?---/, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\n+/g, ' ')
    .trim();
}

function generateDescription(content, maxLength = 160) {
  const text = extractTextContent(content);
  if (text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');

  if (lastSentence > maxLength * 0.7) {
    return truncated.substring(0, lastSentence + 1);
  }

  return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
}

function generateKeywords(content, title = '') {
  const headings = content.match(/#{1,6}\s(.+)/g) || [];
  const headingText = headings.map(h => h.replace(/#{1,6}\s/, '')).join(' ');
  const allText = `${title} ${headingText}`.toLowerCase();

  const words = allText
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'from', 'they', 'been', 'have', 'will', 'your', 'what', 'when', 'where', 'how', 'the', 'and', 'for', 'are'].includes(word));

  // Prioritize Zimbabwe-specific keywords
  const priorityKeywords = words.filter(word =>
    ZIMBABWE_KEYWORDS.some(kw => kw.includes(word) || word.includes(kw))
  );

  const uniquePriority = [...new Set(priorityKeywords)];
  const uniqueOthers = [...new Set(words.filter(w => !priorityKeywords.includes(w)))];

  return [...uniquePriority, ...uniqueOthers].slice(0, 15).join(', ');
}

function generateCanonicalUrl(filePath) {
  const relativePath = filePath
    .replace(/\\/g, '/')
    .replace(/\.mdx?$/, '')
    .replace(/\/index$/, '')
    .replace(/^\.\//, '');

  return `https://travel-info.co.zw/${relativePath}`;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(content);
    let updated = false;

    // Add default SEO fields if missing or force update
    Object.keys(SEO_DEFAULTS).forEach(key => {
      if (!parsed.data[key] || FORCE_UPDATE) {
        parsed.data[key] = SEO_DEFAULTS[key];
        updated = true;
      }
    });

    // Generate description if missing
    if (!parsed.data.description || FORCE_UPDATE) {
      const description = generateDescription(parsed.content);
      if (description) {
        parsed.data.description = description;
        parsed.data['og:description'] = description;
        parsed.data['twitter:description'] = description;
        updated = true;
      }
    }

    // Generate keywords if missing
    if (!parsed.data.keywords || FORCE_UPDATE) {
      const keywords = generateKeywords(parsed.content, parsed.data.title);
      if (keywords) {
        parsed.data.keywords = keywords;
        updated = true;
      }
    }

    // Add canonical URL
    if (!parsed.data['canonical'] || FORCE_UPDATE) {
      parsed.data['canonical'] = generateCanonicalUrl(filePath);
      updated = true;
    }

    // Update modified time
    parsed.data['article:modified_time'] = new Date().toISOString();

    // Ensure og:title matches title
    if (parsed.data.title && (!parsed.data['og:title'] || FORCE_UPDATE)) {
      parsed.data['og:title'] = `${parsed.data.title} | Zimbabwe Travel Information`;
      updated = true;
    }

    // Add og:type for article pages
    if (!parsed.data['og:type'] || FORCE_UPDATE) {
      parsed.data['og:type'] = 'article';
      updated = true;
    }

    // Add schema type hint
    if (!parsed.data['schema:type'] || FORCE_UPDATE) {
      if (filePath.includes('destinations')) {
        parsed.data['schema:type'] = 'TouristDestination';
      } else if (filePath.includes('planning') || filePath.includes('itineraries')) {
        parsed.data['schema:type'] = 'TravelGuide';
      } else {
        parsed.data['schema:type'] = 'Article';
      }
      updated = true;
    }

    if (updated && !DRY_RUN) {
      const updatedContent = matter.stringify(parsed.content, parsed.data);
      fs.writeFileSync(filePath, updatedContent);
      console.log(`✅ Updated: ${filePath}`);
    } else if (updated && DRY_RUN) {
      console.log(`🔍 Would update: ${filePath}`);
    } else {
      console.log(`⏭️  No changes: ${filePath}`);
    }

    return updated;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dirPath) {
  const results = { processed: 0, updated: 0, errors: 0 };

  if (!fs.existsSync(dirPath)) {
    console.log(`📁 Directory not found: ${dirPath}`);
    return results;
  }

  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'components' && file !== 'images' && file !== 'logo') {
      const subResults = processDirectory(filePath);
      results.processed += subResults.processed;
      results.updated += subResults.updated;
      results.errors += subResults.errors;
    } else if (SUPPORTED_EXTENSIONS.some(ext => file.endsWith(ext))) {
      results.processed++;
      if (processFile(filePath)) {
        results.updated++;
      }
    }
  });

  return results;
}

function main() {
  console.log('🇿🇼 Starting bulk SEO update for Zimbabwe Travel Information...');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE UPDATE'}`);
  console.log(`Force Update: ${FORCE_UPDATE}`);
  console.log(`Directories: ${DIRECTORIES.join(', ')}`);
  console.log('');

  let totalResults = { processed: 0, updated: 0, errors: 0 };

  DIRECTORIES.forEach(dir => {
    console.log(`📂 Processing: ${dir}`);
    const results = processDirectory(dir);
    totalResults.processed += results.processed;
    totalResults.updated += results.updated;
    totalResults.errors += results.errors;
  });

  console.log('\n📊 Summary:');
  console.log(`Files processed: ${totalResults.processed}`);
  console.log(`Files updated: ${totalResults.updated}`);
  console.log(`Errors: ${totalResults.errors}`);

  if (DRY_RUN) {
    console.log('\n🔍 This was a dry run - no files were actually modified');
    console.log('💡 Run without --dry-run to apply changes');
  } else if (totalResults.updated > 0) {
    console.log('\n✅ SEO update completed successfully!');
    console.log('📝 Next steps:');
    console.log('   1. Review changes: git diff');
    console.log('   2. Commit changes: git add . && git commit -m "Update SEO metadata"');
    console.log('   3. Push changes: git push');
  } else {
    console.log('\n✅ All files already have optimal SEO configuration!');
    console.log('💡 Use --force to refresh all SEO metadata');
  }
}

main();
