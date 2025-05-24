const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Get environment variables
const DRY_RUN = process.env.DRY_RUN === 'true';
const FORCE_UPDATE = process.env.FORCE_UPDATE === 'true';
const DIRECTORIES = process.env.DIRECTORIES ? process.env.DIRECTORIES.split(',').map(d => d.trim()) : ['./destinations', './planning', './essentials', './culture', './wildlife', './adventure', './get-involved', './'];

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
  
  // Write outputs to GitHub environment file (new method)
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    fs.appendFileSync(outputFile, `files_processed=${totalResults.processed}\n`);
    fs.appendFileSync(outputFile, `files_updated=${totalResults.updated}\n`);
    fs.appendFileSync(outputFile, `has_changes=${totalResults.updated > 0}\n`);
  }
}

main();
