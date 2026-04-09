# /apps

This directory contains the other apps in the Zimbabwe Information Platform monorepo.

| App | Domain | Repo | Status |
|-----|--------|------|--------|
| `business/` | business.mukoko.com | nyuchitech/business-mukoko | Next.js 15, App Router |
| `travel/` | travel.mukoko.com | nyuchitech/zti-app | Next.js 15, App Router |
| `barstool/` | barstool.mukoko.com | nyuchitech/barstool | Next.js 15, App Router |

All apps share:
- **Database**: Supabase `mukoko_platform_cloud` (`tdcpuzqyoodrdsxldgsh`)
- **Auth**: Supabase Auth (shared Mukoko identity — one login, all apps)
- **Design system**: Nyuchi Design Portal (`https://design.nyuchi.com`)
- **Maps**: MapLibre GL JS on OpenStreetMap vector tiles

The Mintlify documentation site (travel-info.co.zw) lives at the repo root.
