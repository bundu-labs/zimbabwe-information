// Zimbabwe Travel Information - Custom Components
// Export all custom React components for use in MDX pages

console.log('🟢 Loading _components/index.js');

export { default as ExpertDirectory } from './ExpertDirectory';
export { default as ExpertForm } from './ExpertForm';
export { default as BusinessDirectory } from './BusinessDirectory';
export { default as BusinessForm } from './BusinessForm';
export { default as TestComponent } from './TestComponent';

console.log('🟢 All components exported from index.js');

// Re-export utilities and constants
export {
  supabase,
  expertCategories,
  businessCategories,
  accommodationSubcategories,
  zimbabweRegions,
} from './supabase';
