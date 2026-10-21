# CLAUDE.md - AI Assistant Guide for zti-docs

## Project Overview

**travel-info.co.zw** is the editorial and documentation layer of the **Zimbabwe Information Platform** — a Mintlify-powered docs site that serves as the SEO-heavy, Google-indexed content layer. Destination guides, safari planning articles, seasonal travel advice, professional profiles, and contributor-written content live here. Every other app in the ecosystem links here for detailed editorial content.

This is a **monorepo root**. The `/apps` directory is reserved for the other platform apps:

- `apps/` — business.mukoko.com (Next.js 15), travel.mukoko.com (Next.js 15), barstool.mukoko.com

- **Live site:** <https://travel-info.co.zw>
- **Repository:** <https://github.com/nyuchitech/zti-docs>
- **License:** CC BY 4.0 (Creative Commons Attribution 4.0 International)

### Platform context

| App                      | Domain              | Purpose                                    |
| ------------------------ | ------------------- | ------------------------------------------ |
| **zti-docs** (this repo) | travel-info.co.zw   | Editorial content, SEO layer               |
| business-mukoko          | business.mukoko.com | Business directory, verification, profiles |
| zti-app                  | travel.mukoko.com   | Interactive MapLibre travel map            |
| barstool                 | barstool.mukoko.com | Nightlife discovery                        |

All apps share **one database** (`mukoko_platform_cloud`, `tdcpuzqyoodrdsxldgsh`) and **one auth system** (Supabase Auth — shared Mukoko identity).

---

## Tech Stack

| Technology         | Purpose                                            |
| ------------------ | -------------------------------------------------- |
| **Mintlify**       | Documentation platform and static site generator   |
| **MDX**            | Markdown with JSX components for content           |
| **React**          | Custom interactive components in `/snippets`       |
| **Supabase**       | `mukoko_platform_cloud` — shared platform database |
| **Tailwind CSS**   | Styling (via Mintlify + custom `style.css`)        |
| **GitHub Actions** | CI/CD workflows                                    |

### Supabase connection

- **Project:** `mukoko_platform_cloud`
- **Project ID:** `tdcpuzqyoodrdsxldgsh`
- **URL:** `https://tdcpuzqyoodrdsxldgsh.supabase.co`
- **Key type:** Publishable key (safe for client-side — protected by RLS)
- **Env var:** `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- **Auth:** Supabase Auth (shared identity across all Mukoko apps)

The old `supabase/schema.sql` is deprecated. Schema lives in the platform DB, not this repo.

---

## Directory Structure

```
zti-docs/
├── docs.json                 # Main Mintlify configuration (navigation, SEO, theme)
├── package.json              # Node dependencies
├── style.css                 # Custom CSS (fonts, forms, accessibility)
├── fonts.json                # Font configuration
├── favicon.svg               # Site favicon
│
├── # Content Directories (MDX files)
├── adventure/                # Activities (7 files) - water sports, hiking, etc.
├── business/                 # Business travel (3 files) - coworking, dining
├── culture/                  # Culture & traditions (6 files) - cuisine, art, festivals
├── destinations/             # Major destinations (24 files) - Victoria Falls, Hwange, etc.
├── directory/                # Business directories (2 files)
├── essentials/               # Travel essentials (18 files) - visas, health, money
├── experts/                  # Local expert directory (1 file)
├── geological/               # Geological features (3 files) - caves, balancing rocks
├── get-involved/             # Community engagement (5 files)
├── heritage/                 # UNESCO & ancient sites (6 files)
├── historic/                 # Historic buildings (2 files)
├── planning/                 # Trip planning (14 files) - itineraries, travel styles
├── resources/                # Professional resources (5 files)
├── rock-art/                 # Rock art sites (7 files)
├── scenic/                   # Viewpoints & waterfalls (7 files)
├── wildlife/                 # Wildlife & parks (3 files)
│
├── # Standalone Pages
├── introduction.mdx          # Homepage/welcome
├── about-zimbabwe.mdx        # Country overview
├── when-to-visit.mdx         # Best times to visit
├── book.mdx                  # Booking page
├── contact.mdx               # Contact form
├── faq.mdx                   # FAQ section
├── privacy-policy.mdx        # Legal
├── cookie-policy.mdx         # Legal
├── terms-of-service.mdx      # Legal
│
├── # React Components & Snippets
├── snippets/                 # Reusable MDX snippets and React components
│   ├── ExpertDirectory.jsx   # Expert listing component
│   ├── ApplicationForm.jsx   # Business + expert application forms (Nyuchi API)
│   ├── BusinessDirectory.jsx # Business listing component
│   ├── supabase.js           # Supabase client configuration
│   ├── photo-credits.mdx     # Reusable photo credits snippet
│   └── README.md             # Component documentation
│
├── # Assets
├── images/                   # Local images organized by category
│   ├── destinations/         # Destination-specific images
│   ├── wildlife/
│   ├── culture/
│   └── ...
├── logo/                     # Site logos (noBgWhite.svg, noBgColor.svg)
│
├── # Supabase
├── supabase/
│   └── schema.sql            # Database schema for experts/businesses
│
├── # GitHub Configuration
├── .github/
│   ├── workflows/            # GitHub Actions
│   │   ├── seo-update.yml    # SEO metadata updates
│   │   ├── label.yml         # Issue labeling
│   │   └── create-expert-listing.yml
│   ├── ISSUE_TEMPLATE/       # Issue templates
│   ├── *.sh                  # Utility scripts (image downloads, YAML fixes)
│   └── SUMMARY.md            # Change log summary
│
└── # Documentation
    ├── README.md             # Project readme
    ├── FUTURE_PAGES_PLAN.md  # Content roadmap (150+ potential pages)
    ├── SECURITY.md           # Security policy
    └── LICENSE               # CC BY 4.0 license
```

---

## Key Configuration Files

### docs.json (Mintlify Configuration)

The main configuration file controlling:

- **Navigation**: Tab-based navigation with groups (Heritage, Destinations, Planning, etc.)
- **SEO**: Global meta tags, Open Graph, Twitter cards, structured data
- **Theme**: Colors (`#0D9373` primary), logo, layout settings
- **Integrations**: Google Analytics (GA4), GTM, Amplitude
- **Footer**: Links, social media, copyright

### package.json

Dependencies:

- `@supabase/supabase-js` - Database client
- `react` - Component framework
- `gray-matter` - YAML frontmatter parsing (dev)

---

## Content Conventions

### MDX File Structure

Every content page follows this frontmatter pattern:

```yaml
---
title: "Page Title"
description: "1-2 sentence description for SEO"
og:image: "https://travel-info.co.zw/images/hero-light.svg"
og:site_name: "Zimbabwe Travel Information"
twitter:card: "summary_large_image"
twitter:site: "@zimbabwetravel"
twitter:creator: "@zimbabwetravel"
robots: "index, follow"
author: "Zimbabwe Travel Information"
keywords: "comma, separated, keywords"
og:description: "Same as description"
twitter:description: "Same as description"
canonical: "https://travel-info.co.zw/path/to/page"
article:modified_time: "2025-11-29T00:00:00.000Z"
og:title: "Page Title | Zimbabwe Travel Information"
og:type: "article"
schema:type: "TouristDestination"  # or Article, FAQPage, etc.
---
```

### Mintlify Components

Use these built-in components throughout content:

```mdx
<Card title="Title" icon="icon-name" href="/path">
  Card content here
</Card>

<CardGroup cols={2}>
  <Card>...</Card>
  <Card>...</Card>
</CardGroup>

<Tip>Helpful tip text</Tip>
<Note>Important note</Note>
<Warning>Warning message</Warning>
<Info>Informational callout</Info>

<Accordion title="Expandable Section">
  Hidden content
</Accordion>

<AccordionGroup>
  <Accordion>...</Accordion>
</AccordionGroup>

<Tabs>
  <Tab title="Tab 1">Content</Tab>
  <Tab title="Tab 2">Content</Tab>
</Tabs>
```

### Image Guidelines

1. **Local images preferred**: Store in `/images/{category}/` directories
2. **File naming**: Use kebab-case (e.g., `victoria-falls-aerial.jpg`)
3. **Optimization**: Target <300KB for hero images, <150KB for standard
4. **Alt text**: Always provide descriptive alt text
5. **Photo credits**: Include `<PhotoCredits />` snippet at page bottom

### Snippet Usage

Import reusable snippets at the end of MDX files:

```mdx
import PhotoCredits from '/snippets/photo-credits.mdx';

<PhotoCredits />
```

---

## React Component Development

### Location

Custom React components live in `/snippets/`. All exported from `index.js`.

| Component                  | Queries                                                               | Purpose                               |
| -------------------------- | --------------------------------------------------------------------- | ------------------------------------- |
| `ExpertDirectory.jsx`      | `GET /v1/applications/experts/directory` (Nyuchi API, public)         | Approved, opted-in local experts      |
| `BusinessDirectory.jsx`    | `commerce.local_business` + `business.organization` + `places.places` | Business directory                    |
| `ApplicationForm.jsx`      | `POST /v1/applications/{businesses,experts}` (Nyuchi API, Turnstile)  | Business and expert application forms |
| `LocationMap.jsx`          | Static lat/lng props                                                  | OpenStreetMap embed                   |
| `VerificationBadge.jsx`    | (static — tier prop)                                                  | Mineral-colored verification badge    |
| `ProfessionalCard.jsx`     | `hospitality.professional` + `identity.person`                        | Inline profile card for articles      |
| `SeasonalInfo.jsx`         | `places.seasonal_info`                                                | Month-by-month visit conditions       |
| `EstablishmentGrid.jsx`    | `hospitality.establishment`                                           | Grid of lodges/restaurants at a place |
| `ExperienceList.jsx`       | `hospitality.experience`                                              | Activities at a place                 |
| `ReviewSummary.jsx`        | `engagement.review`                                                   | Aggregate rating + recent reviews     |
| `ContentGapCTA.jsx`        | `content.content_gap`                                                 | "Help improve this page" CTA          |
| `ContributorDashboard.jsx` | `content.content_gap`                                                 | Authenticated gap browser             |
| `ItineraryView.jsx`        | `content.itinerary` + `content.itinerary_stop`                        | Day-by-day trip plan                  |
| `supabase.js`              | —                                                                     | Supabase client + shared constants    |

### LocationMap Component

Embeds an interactive OpenStreetMap for destinations with GPS coordinates:

```mdx
import { LocationMap } from '/snippets/LocationMap.jsx';

<LocationMap
  lat={-17.9243}
  lng={25.8572}
  zoom={14}
  title="Victoria Falls"
/>
```

**Props:**

- `lat` (required): Latitude coordinate
- `lng` (required): Longitude coordinate
- `zoom`: Zoom level 1-18 (default: 12)
- `title`: Location name for accessibility
- `showMarker`: Show pin marker (default: true)
- `height`: Map height (default: "400px")

**Key Zimbabwe coordinates:**

| Location              | Latitude | Longitude |
| --------------------- | -------- | --------- |
| Victoria Falls        | -17.9243 | 25.8572   |
| Hwange NP (Main Camp) | -18.3667 | 26.5000   |
| Great Zimbabwe        | -20.2744 | 30.9339   |
| Mana Pools            | -15.7500 | 29.4000   |
| Harare                | -17.8292 | 31.0522   |
| Bulawayo              | -20.1325 | 28.5833   |
| Lake Kariba           | -16.5167 | 28.8000   |
| Matobo Hills          | -20.5000 | 28.5000   |

### Conventions

1. **Arrow function syntax (REQUIRED)**: Mintlify requires arrow functions for JSX snippets:

   ```jsx
   // CORRECT - use arrow function with named export
   export const MyComponent = ({ prop }) => {
     return <div>{prop}</div>;
   };

   // WRONG - function declarations don't work in Mintlify
   export default function MyComponent({ prop }) { ... }
   ```

2. **Named exports (REQUIRED)**: Use named exports, not default exports
3. **Import with .jsx extension**: Always include the `.jsx` extension in imports:

   ```mdx
   import { MyComponent } from '/snippets/MyComponent.jsx';
   ```

4. **Use client directive**: Add `'use client'` for client-side components
5. **Dark mode**: Use Tailwind's `dark:` prefix for dark mode styles
6. **Responsive**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints
7. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
8. **Error handling**: User-friendly messages with retry functionality

### Supabase Integration

All components connect to `mukoko_platform_cloud` via `/snippets/supabase.js`.

Use `.schema('schema_name').from('table_name')` for non-public schemas:

```js
// Correct pattern for platform schemas
const { data } = await supabase.schema('hospitality').from('professional').select(...)
const { data } = await supabase.schema('places').from('seasonal_info').select(...)
const { data } = await supabase.schema('content').from('content_gap').select(...)
```

The `supabase.js` exports: `supabase`, `verificationTiers`, `expertCategories`, `businessCategories`, `accommodationSubcategories`, `zimbabweRegions`.

---

## Development Workflow

### Local Development

```bash
# Install Mintlify CLI globally
npm i -g mintlify

# Install project dependencies
npm install

# Run development server
mintlify dev
```

The site runs at `http://localhost:3000`.

### Adding New Content Pages

1. Create `.mdx` file in appropriate directory
2. Add required frontmatter (see template above)
3. Add page to navigation in `docs.json`
4. Include photo credits snippet if using images

### Updating Navigation

Edit `docs.json` → `navigation.tabs` → find appropriate tab → add to `pages` array:

```json
{
  "tab": "Destinations",
  "groups": [
    {
      "group": "Top Destinations",
      "pages": [
        "destinations/victoria-falls",
        "destinations/new-page"  // Add here
      ]
    }
  ]
}
```

---

## Common Tasks

### Fix MDX YAML Syntax Errors

```bash
bash .github/fix-yaml-syntax.sh
```

Fixes unquoted YAML values that break MDX parsing.

### Update SEO Metadata

```bash
# Dry run
bash .github/run-seo-update.sh --dry-run

# Apply updates
bash .github/run-seo-update.sh

# Force update existing SEO
bash .github/run-seo-update.sh --force
```

### Image Management

```bash
# Download images (limited by bot protection)
bash .github/download-images.sh

# Update MDX image paths
bash .github/update-image-paths.sh
```

---

## Deployment

- **Auto-deploy**: Changes to `main` branch deploy automatically via Mintlify GitHub App
- **Preview**: Mintlify provides preview deployments for pull requests
- **No build step needed**: Mintlify handles the build process

---

## Content Priorities

Based on `FUTURE_PAGES_PLAN.md`, focus areas for new content:

| Priority | Category          | Current | Gap           |
| -------- | ----------------- | ------- | ------------- |
| High     | Rock Art          | 7 pages | 15+ potential |
| High     | Scenic/Waterfalls | 7 pages | 20+ potential |
| High     | Heritage/Ruins    | 6 pages | 10+ potential |
| High     | Wildlife/Parks    | 3 pages | 15+ potential |
| Medium   | Geological        | 3 pages | 10+ potential |
| Medium   | Historic          | 2 pages | 15+ potential |
| Medium   | Cities/Towns      | 5 pages | 10+ potential |

---

## Code Style Guidelines

### MDX Content

- Use sentence case for headings (not Title Case)
- Keep paragraphs concise (2-4 sentences)
- Use bullet lists for quick-reference information
- Include practical details (prices, hours, tips)
- Link to related pages where helpful

### YAML Frontmatter

- Quote values containing special characters
- Use ISO 8601 dates: `2025-11-29T00:00:00.000Z`
- Canonical URLs must include full domain

### React/JavaScript

- Use functional components with hooks
- Apply Tailwind classes directly (no separate CSS modules)
- Handle loading and error states
- Support both light and dark modes

---

## Troubleshooting

### Mintlify dev not running

```bash
mintlify install
```

### Page shows 404

- Verify file exists at correct path
- Check page is listed in `docs.json` navigation
- Ensure frontmatter has no syntax errors

### Components not loading

- Verify Supabase credentials in `snippets/supabase.js`
- Check browser console for errors
- Ensure `package.json` dependencies are installed

### Analytics CORS errors (development)

Expected in local development due to browser restrictions. Resolves in production.

---

## Important Notes for AI Assistants

1. **Content accuracy**: Zimbabwe travel information should be current and accurate. Verify facts when possible.

2. **SEO matters**: Every page needs proper frontmatter with title, description, keywords, and canonical URL.

3. **Navigation sync**: When adding pages, always update `docs.json` navigation.

4. **Image licensing**: Only use images from permitted sources (Unsplash, Pixabay, licensed partners). Include credits.

5. **Accessibility**: Maintain accessible design - proper heading hierarchy, alt text, keyboard navigation.

6. **Local context**: Content is created by locals who know Zimbabwe. Maintain authentic voice.

7. **Multi-currency**: Zimbabwe uses a multi-currency system with USD widely accepted. Prices should be in USD.

8. **Sensitive topics**: Handle Zimbabwe's political and economic history respectfully and factually.

---

## Contact

- **Website:** <https://travel-info.co.zw>
- **Email:** <hi@travel-info.co.zw>
- **GitHub Issues:** <https://github.com/nyuchitech/zti-docs/issues>

---

## Track big work in GitHub issues

Any substantial build, migration, investigation or multi-step task gets a GitHub issue in the repo that owns it — before or as work starts — so another session, agent or person can pick it up.

- The issue holds the goal, the owner's decisions (verbatim where given), the plan, acceptance criteria, owner-only steps and links.
- Every PR references its issue (`Refs #n`; `Fixes #n` only when the merge completes it).
- Post progress, decisions and a hand-off note (what's done, what's left, branch names) as issue comments — at each merge and before a session or agent finishes.
- Work spanning repos gets a tracking issue that links the per-repo issues.
- Never put secrets, credential status or exploitable detail in issues on public repos.

## Dev skills, progress reports and the merge gate

Load the Mzizi **dev skills** before starting work: `mzizi_get_skills category=dev` on the Mzizi MCP (`mcp.mzizi.dev`), or `@nyuchi/mzizi-skills` from npm. They are `digital-hygiene` and `progress-report`.

- **Digital hygiene.** Check free disk before starting, clone only under `$TMPDIR`, share build caches, and audit, then delete, your clones once the work merges (`digital-hygiene` skill).
- **Clone isolation.** Clone only into a directory unique to you; never touch another agent's.
- **Progress reports.** All dev work runs on a 10-minute progress-report loop (`progress-report` skill): measured bars, what changed, and a final "Needs you:" line. Report ticks never publish, release, merge or deploy without the owner's approval.
- **Merge gate.** Merge only when the work is complete, CI is green, it's verified at runtime, and `/code-review` has run with findings resolved.
