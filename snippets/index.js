// Zimbabwe Travel Information - Custom Components
// Export all custom React components for use in MDX pages
// Note: Mintlify requires arrow function syntax for JSX snippets

console.log('🟢 Loading snippets/index.js');

export { ExpertDirectory } from './ExpertDirectory.jsx';
export { ExpertForm } from './ExpertFormFormspree.jsx';
export { ExpertFormSupabase } from './ExpertFormSupabase.jsx';
export { BusinessDirectory } from './BusinessDirectory.jsx';
export { BusinessForm } from './BusinessForm.jsx';
export { TestComponent } from './TestComponent.jsx';
export { LocationMap } from './LocationMap.jsx';

console.log('🟢 All components exported from index.js');

// Re-export utilities and constants
export {
  supabase,
  expertCategories,
  businessCategories,
  accommodationSubcategories,
  zimbabweRegions,
} from './supabase.js';
