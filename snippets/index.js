// Zimbabwe Information Platform — Mintlify custom components
// All components use arrow function + named export syntax (Mintlify requirement)
// --- Directories ---
export { ExpertDirectory } from './ExpertDirectory.jsx';
export { BusinessDirectory } from './BusinessDirectory.jsx';
// --- Forms ---
export { ExpertFormSupabase } from './ExpertFormSupabase.jsx';
export { BusinessForm } from './BusinessForm.jsx';
// --- Maps ---
export { LocationMap } from './LocationMap.jsx';
// --- Place components (embed in destination articles) ---
export { SeasonalInfo } from './SeasonalInfo.jsx';
export { EstablishmentGrid } from './EstablishmentGrid.jsx';
export { ExperienceList } from './ExperienceList.jsx';
export { ReviewSummary } from './ReviewSummary.jsx';
export { ContentGapCTA } from './ContentGapCTA.jsx';
export { ItineraryView } from './ItineraryView.jsx';
// --- Profile components ---
export { ProfessionalCard } from './ProfessionalCard.jsx';
export { VerificationBadge } from './VerificationBadge.jsx';
// --- Contributor program ---
export { ContributorDashboard } from './ContributorDashboard.jsx';
// --- Supabase client + constants ---
export {
  supabase,
  verificationTiers,
  expertCategories,
  businessCategories,
  accommodationSubcategories,
  zimbabweRegions,
} from './supabase.js';
