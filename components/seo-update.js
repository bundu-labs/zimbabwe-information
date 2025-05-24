const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// SEO Configuration - Customized for Zimbabwe Travel Information
const SEO_DEFAULTS = {
  'og:image': 'https://travel-info.co.zw/images/hero-light.svg',
  'og:site_name': 'Zimbabwe Travel Information',
  'twitter:card': 'summary_large_image',
  'twitter:site': '@zimbabwetravel',
  'twitter:creator': '@zimbabwetravel',
  'robots': 'index, follow',
  'author': 'Zimbabwe Travel Information',
  'keywords': 'Zimbabwe travel, Victoria Falls, Hwange National Park, Great Zimbabwe, safari, African tourism, Zimbabwe destinations, travel guide, travel information'
};

// Additional SEO fields that can be auto-generated
const DYNAMIC_SEO_FIELDS = {
  generateDescription: true, // Generate description from content if missing
  generateKeywords: true,    // Generate keywords from headings if missing
  updateModifiedTime: true   // Update article:modified_time
};

// Directories to process (based on your repo structure)
const DOCS_DIRECTORIES = [
  './destinations',
  './planning',
  './essentials',
  './culture',
  './wildlife',
  './adventure',
  './get-involved',
  './', // Root directory for main pages
];

// File extensions to process
const SUPPORTED_EXTENSIONS = ['.mdx', '.md'];

// Zimbabwe-specific keywords to prioritize
const ZIMBABWE_KEYWORDS = [
  'zimbabwe', 'victoria falls', 'hwange', 'harare', 'bulawayo', 'safari',
  'great zimbabwe', 'mana pools', 'matobo hills', 'eastern highlands',
  'kariba', 'gonarezhou', 'wildlife', 'africa', 'travel', 'tourism',
  'accommodation', 'budget travel', 'luxury travel', 'family travel'
];

/**
 * Extract text content from markdown for SEO generation
 */
function extractTextContent(content) {
  // Remove markdown syntax for description generation
  return content
    .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
}

/**
 * Generate description from content
 */
function generateDescription(content, maxLength = 160) {
  const text = extractTextContent(content);
  if (text.length <= maxLength) return text;
  
  // Find the last complete sentence within the limit
  const truncated = text.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  
  if (lastSentence > maxLength * 0.7) {
    return truncated.substring(0, lastSentence + 1);
  }
  
  return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
}

/**
 * Extract keywords from headings and content with Zimbabwe-specific prioritization
 */
function generateKeywords(content, title = '') {
  const headings = content.match(/#{1,6}\s(.+)/g) || [];
  const headingText = headings.map(h => h.replace(/#{1,6}\s/, '')).join(' ');
  const allText = `${title} ${headingText}`.toLowerCase();
  
  // Extract words
  const words = allText
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'from', 'they', 'been', 'have', 'will', 'your', 'what', 'when', 'where', 'how', 'the', 'and', 'for', 'are'].includes(word));
  
  // Prioritize Zimbabwe-specific keywords
  const priorityKeywords = words.filter(word => 
    ZIMBABWE_KEYWORDS.some(kw => kw.includes(word) || word.includes(kw))
  );
  
  // Get unique words and combine priority + others
  const uniquePriority = [...new Set(priorityKeywords)];
  const uniqueOthers = [...new Set(words.filter(w => !priorityKeywords.includes(w)))];
  
  // Combine and take top 15 (more keywords for travel content)
  const allKeywords = [...uniquePriority, ...uniqueOthers].slice(0, 15);
  return allKeywords.join(', ');
}

/**
 * Add canonical URL based on file path
 */
function generateCanonicalUrl(filePath) {
  const relativePath = filePath
    .replace(/\\/g, '/')
    .replace(/\.mdx?$/, '')
    .replace(/\/index$/, '')
    .replace(/^\.\//, '');
  
  return `https://travel-info.co.zw/${relativePath}`;
}

/**
 * Process a single MDX/MD file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(content);
    let updated = false;
    
    // Add default SEO fields if missing
    Object.keys(SEO_DEFAULTS).forEach(key => {
      if (!parsed.data[key]) {
        parsed.data[key] = SEO_DEFAULTS[key];
        updated = true;
      }
    });
    
    // Generate dynamic SEO fields
    if (DYNAMIC_SEO_FIELDS.generateDescription && !parsed.data.description) {
      const description = generateDescription(parsed.content);
      if (description) {
        parsed.data.description = description;
        parsed.data['og:description'] = description;
        parsed.data['twitter:description'] = description;
        updated = true;
      }
    }
    
    if (DYNAMIC_SEO_FIELDS.generateKeywords && !parsed.data.keywords) {
      const keywords = generateKeywords(parsed.content, parsed.data.title);
      if (keywords) {
        parsed.data.keywords = keywords;
        updated = true;
      }
    }
    
    if (DYNAMIC_SEO_FIELDS.updateModifiedTime) {
      parsed.data['article:modified_time'] = new Date().toISOString();
      updated = true;
    }
    
    // Ensure Open Graph title matches page title if not set
    if (parsed.data.title && !parsed.data['og:title']) {
      parsed.data['og:title'] = `${parsed.data.title} | Zimbabwe Travel Information`;
      updated = true;
    }
    
    // Add canonical URL
    if (!parsed.data['canonical']) {
      parsed.data['canonical'] = generateCanonicalUrl(filePath);
      updated = true;
    }
    
    // Add og:type for article pages
    if (!parsed.data['og:type']) {
      parsed.data['og:type'] = 'article';
      updated = true;
    }
    
    // Add structured data hint (for future implementation)
    if (!parsed.data['schema:type']) {
      // Determine schema type based on content
      if (filePath.includes('destinations')) {
        parsed.data['schema:type'] = 'TouristDestination';
      } else if (filePath.includes('planning') || filePath.includes('itineraries')) {
        parsed.data['schema:type'] = 'TravelGuide';
      } else {
        parsed.data['schema:type'] = 'Article';
      }
      updated = true;
    }
    
    // Write back to file if updated
    if (updated) {
      const updatedContent = matter.stringify(parsed.content, parsed.data);
      fs.writeFileSync(filePath, updatedContent);
      console.log(`✅ Updated: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️  Skipped: ${filePath} (no changes needed)`);
      return false;
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Recursively process files in a directory
 */
function processDirectory(dirPath) {
  const results = {
    processed: 0,
    updated: 0,
    errors: 0
  };
  
  if (!fs.existsSync(dirPath)) {
    console.log(`📁 Directory not found: ${dirPath}`);
    return results;
  }
  
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'components' && file !== 'images' && file !== 'logo') {
      // Recursively process subdirectories
      const subResults = processDirectory(filePath);
      results.processed += subResults.processed;
      results.updated += subResults.updated;
      results.errors += subResults.errors;
    } else if (SUPPORTED_EXTENSIONS.some(ext => file.endsWith(ext))) {
      results.processed++;
      const wasUpdated = processFile(filePath);
      if (wasUpdated) {
        results.updated++;
      }
    }
  });
  
  return results;
}

/**
 * Main execution function
 */
function main() {
  console.log('🇿🇼 Starting bulk SEO update for Zimbabwe Travel Information...\n');
  console.log('Configuration:');
  console.log('- SEO Defaults:', Object.keys(SEO_DEFAULTS).join(', '));
  console.log('- Dynamic Fields:', Object.keys(DYNAMIC_SEO_FIELDS).filter(k => DYNAMIC_SEO_FIELDS[k]).join(', '));
  console.log('- Supported Extensions:', SUPPORTED_EXTENSIONS.join(', '));
  console.log('');
  
  let totalResults = {
    processed: 0,
    updated: 0,
    errors: 0
  };
  
  // Process each configured directory
  DOCS_DIRECTORIES.forEach(dir => {
    console.log(`📂 Processing directory: ${dir}`);
    const results = processDirectory(dir);
    totalResults.processed += results.processed;
    totalResults.updated += results.updated;
    totalResults.errors += results.errors;
    console.log('');
  });
  
  // Summary
  console.log('📊 Summary:');
  console.log(`- Files processed: ${totalResults.processed}`);
  console.log(`- Files updated: ${totalResults.updated}`);
  console.log(`- Errors: ${totalResults.errors}`);
  
  if (totalResults.updated > 0) {
    console.log('\n✨ Bulk SEO update completed successfully!');
    console.log('💡 Next steps:');
    console.log('1. Review the changes in your MDX files');
    console.log('2. Test locally with: mintlify dev');
    console.log('3. Commit and push to deploy changes');
    console.log('\n📌 Remember to update your sitemap.xml if you\'ve added new pages!');
  } else {
    console.log('\n✅ All files already have SEO optimization!');
  }
}

// Error handling
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  processFile,
  processDirectory,
  SEO_DEFAULTS,
  DYNAMIC_SEO_FIELDS
};