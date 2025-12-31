# Zimbabwe Travel Information - React Components

This directory contains custom React components used throughout the Zimbabwe Travel Information documentation site.

## Components

### LocationMap
Embeds an interactive OpenStreetMap with GPS coordinates for destination pages.

**Usage:**
```mdx
import LocationMap from '/snippets/LocationMap';

<LocationMap lat={-17.9243} lng={25.8572} zoom={14} title="Victoria Falls" />
```

**Props:**
- `lat` (number, required): Latitude coordinate
- `lng` (number, required): Longitude coordinate
- `zoom` (number): Zoom level 1-18 (default: 12)
- `title` (string): Location name for accessibility
- `showMarker` (boolean): Show marker pin (default: true)
- `height` (string): Map height (default: "400px")

**Features:**
- Free OpenStreetMap embed (no API key required)
- Displays GPS coordinates in human-readable format
- Link to view larger map on OpenStreetMap
- Responsive design with dark mode support
- Proper attribution included

---

### ExpertForm
Interactive form for local experts to apply to join the expert network. Submissions are stored in Supabase.

**Usage:**
```mdx
<ExpertForm />
```

**Features:**
- Real-time form validation
- Supabase integration for data storage
- Success/error states with user feedback
- Dark mode support

---

### ExpertDirectory
Displays a searchable, filterable directory of verified local experts.

**Usage:**
```mdx
<ExpertDirectory />
<ExpertDirectory showFilters={false} category="safari_guide" />
```

**Props:**
- `showFilters` (boolean): Show/hide filter controls (default: true)
- `category` (string): Pre-filter by expert category (optional)

**Features:**
- Search by name, bio, services, or location
- Filter by category and location
- Modal view for detailed expert information
- Contact buttons (email, WhatsApp, website)
- Verified badge display

---

### BusinessDirectory
Displays a searchable directory of verified businesses (accommodation, tours, dining, etc.).

**Usage:**
```mdx
<BusinessDirectory />
<BusinessDirectory category="accommodation" subcategory="lodge" />
```

**Props:**
- `showFilters` (boolean): Show/hide filter controls (default: true)
- `category` (string): Pre-filter by business category (optional)
- `subcategory` (string): Pre-filter by subcategory (optional, accommodation only)

**Features:**
- Search functionality
- Category and subcategory filtering
- Accommodation subcategory tabs
- Image galleries
- Price range display
- Amenities listing

---

### BusinessForm
Form for businesses to apply for listing in the directory.

**Usage:**
```mdx
<BusinessForm />
```

---

## Configuration

### Supabase Setup
All components require the Supabase client configured in `_components/supabase.js`.

**Connection details:**
- URL: `https://aqjhuyqhgmmdutwzqvyv.supabase.co`
- Uses Row Level Security (RLS) with anonymous key for client-side access

### Expert Categories
Available categories defined in `supabase.js`:
- Safari Guide
- Birding Specialist
- Walking Safari Guide
- Photography Guide
- Cultural & Heritage Expert
- Adventure Activity Guide
- And more...

### Zimbabwe Regions
Predefined regions for location filtering:
- Victoria Falls, Hwange, Mana Pools
- Harare, Bulawayo, Mutare
- Eastern Highlands, Lake Kariba
- And more...

---

## Installation & Dependencies

Ensure these dependencies are installed:

```bash
npm install @supabase/supabase-js react
```

Or if using the Mintlify platform, dependencies are managed automatically via `package.json`.

---

## Common Issues & Solutions

### SES Module Errors
If you see errors like:
- `SES Removing unpermitted intrinsics`
- `SES_UNCAUGHT_EXCEPTION: SyntaxError: import declarations may only appear at top level of a module`

**Solution:** Ensure `@supabase/supabase-js` is listed in `package.json` dependencies. The package manager needs to install this before the components can load.

### Analytics CORS Errors (Amplitude, Google Analytics)
Errors like:
- `Cross-Origin Request Blocked`
- `Amplitude Logger [Error]: NetworkError`

**These are expected in local development** and occur due to:
- Browser privacy extensions (uBlock, Privacy Badger, etc.)
- Local development environment restrictions
- CORS policies on analytics endpoints

**In production:** These errors typically resolve themselves as analytics services are properly configured for the production domain.

**To reduce console noise during development:** You can temporarily disable analytics in `docs.json`:

```json
"integrations": {
  "ga4": {},
  "gtm": {},
  "amplitude": {}
}
```

### Cookie Warnings
Messages like `Cookie "AMP_TLDTEST" has been rejected` are normal for analytics services and don't affect functionality.

---

## Component Architecture

All components follow these patterns:

1. **Client-side rendering**: Use `'use client'` directive for Next.js compatibility
2. **Dark mode support**: All styles include dark mode variants using Tailwind's `dark:` prefix
3. **Responsive design**: Mobile-first approach with breakpoints at `sm:`, `md:`, `lg:`
4. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation support
5. **Error handling**: User-friendly error messages with retry functionality

---

## Styling

Components use Tailwind CSS classes and follow the site's design system:

- **Primary color**: `primary-500` through `primary-900` (defined in docs.json)
- **Spacing**: Consistent padding and margin using Tailwind's spacing scale
- **Typography**: System font stack with dark mode support
- **Borders**: Subtle borders with `border-gray-200` / `dark:border-gray-700`

---

## Development

### Testing Components Locally

1. Install dependencies: `npm install`
2. Run Mintlify dev server: `mintlify dev`
3. Navigate to a page using the components
4. Check browser console for any errors

### Debugging Supabase Connection

If components aren't loading data:

1. Check browser network tab for Supabase API calls
2. Verify RLS policies in Supabase dashboard
3. Check that the `status` field is set correctly (e.g., 'approved' for listings)
4. Ensure data exists in the database tables

---

## Support

For issues or questions:
- GitHub: https://github.com/nyuchitech/zti-docs/issues
- Email: hi@travel-info.co.zw
