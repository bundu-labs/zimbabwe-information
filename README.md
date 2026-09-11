# Zimbabwe Travel Information

> A comprehensive, independent travel guide to Zimbabwe — destinations,
> planning, and practical essentials.

[![Lint](https://github.com/bundu-labs/zimbabwe-information/actions/workflows/lint.yml/badge.svg)](https://github.com/bundu-labs/zimbabwe-information/actions/workflows/lint.yml)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
![Mintlify](https://img.shields.io/badge/Mintlify-docs-0D9373?style=flat-square)
![Pages](https://img.shields.io/badge/pages-129_MDX-0D9373?style=flat-square)

**Version:** 1.0.0 | **Live:** [travel-info.co.zw](https://travel-info.co.zw) | **Deploys via:** the Mintlify GitHub App on push to `main`

---

## What it is

The repository behind [travel-info.co.zw](https://travel-info.co.zw) — 129
MDX pages of Zimbabwe travel information, published as a
[Mintlify](https://mintlify.com) site. It covers 24 destinations, 14 planning
guides, 18 pages of practical essentials, plus adventure, culture, heritage,
wildlife, rock art, geology, and a directory of operators and experts.

The content is written to be read by a traveller who has never been to
Zimbabwe: what the place is, when to go, what it costs, what the entry
requirements are, and who to contact when something goes wrong. It is
licensed CC BY 4.0 precisely so that tour operators, embassies and other
guides can reuse it.

The repository is also configured as an npm workspace root (`apps/*`) for the
wider Zimbabwe Information Platform. Only the Mintlify site is in this tree
today; `apps/README.md` records the sibling applications and where they live.
There is no database schema here — `supabase/schema.sql` is a deprecated stub
that says so, and this repo is a read-only consumer of the shared platform
database.

## What's inside

### Destinations

- [Victoria Falls](https://travel-info.co.zw/destinations/victoria-falls) — one of the Seven Natural Wonders
- [Hwange National Park](https://travel-info.co.zw/destinations/hwange-national-park) — Zimbabwe's largest wildlife reserve
- [Mana Pools](https://travel-info.co.zw/destinations/mana-pools) — UNESCO World Heritage walking-safari destination
- [Great Zimbabwe](https://travel-info.co.zw/destinations/great-zimbabwe) — the ancient stone city
- [Eastern Highlands](https://travel-info.co.zw/destinations/eastern-highlands) — mountain scenery and hiking
- [Lake Kariba](https://travel-info.co.zw/destinations/lake-kariba) — houseboating and fishing
- Plus 18 more, including cities, hidden gems and off-the-beaten-path locations

### Travel planning

- [First-time visitors guide](https://travel-info.co.zw/planning/first-time-visitors) — start here
- [Sample itineraries](https://travel-info.co.zw/planning/sample-itineraries) — ready-made trip plans
- Guides by traveller: families, solo, seniors, LGBTQ+, business
- Safari planning, budgeting, and when to visit

### Essential information

- [Visas and entry requirements](https://travel-info.co.zw/essentials/visas-and-entry)
- [Health and safety](https://travel-info.co.zw/essentials/health-and-safety)
- [Currency and money](https://travel-info.co.zw/essentials/currency-and-money)
- [Transportation](https://travel-info.co.zw/essentials/transportation)
- Accommodation, packing, tipping, insurance, accessibility, local customs

### Activities, culture and resources

- [Adventure activities](https://travel-info.co.zw/adventure/activities-and-experiences) — rafting, bungee, safaris
- Cuisine, art and music, festivals, people and tribes
- [Emergency contacts](https://travel-info.co.zw/resources/emergency-contacts) and tour operators
- [FAQ](https://travel-info.co.zw/faq)

## Repository structure

| Path                                                                         | What is in it                                           |
| ---------------------------------------------------------------------------- | ------------------------------------------------------- |
| `docs.json`                                                                  | The Mintlify manifest — navigation, theme, SEO metadata |
| `destinations/`, `planning/`, `essentials/`, `adventure/`, `culture/`        | The main guide content                                  |
| `wildlife/`, `heritage/`, `historic/`, `scenic/`, `geological/`, `rock-art/` | Thematic collections                                    |
| `directory/`, `experts/`, `resources/`, `get-involved/`, `business/`         | Operators, contributors and commercial pages            |
| `snippets/`, `images/`, `logo/`, `style.css`, `fonts.json`                   | Shared components and site chrome                       |
| `apps/`                                                                      | Workspace root for the sibling platform apps            |

## Local development

The site is built with [Mintlify](https://mintlify.com). Install the CLI and
run the dev server from the repository root, where `docs.json` lives:

```bash
npm install -g mint
mint dev
```

If a page 404s locally, check you are running in the folder that contains
`docs.json` — Mintlify's older manifest name, `mint.json`, is not used here.

## Deploy

Changes merged to `main` are deployed automatically by the Mintlify GitHub
App. There is no deploy workflow in this repository; the GitHub Actions
workflows here cover lint, labelling, SEO updates, and the expert-listing
form.

## Contributing

Suggestions and corrections are welcome — open an issue or a pull request.
Travel information decays quickly, so a PR that fixes an out-of-date price,
visa rule or operator contact is as valuable as a new page.

**Note:** verify anything consequential — visa requirements, health
advisories, border hours — with official sources before travelling. This is a
guide, not a government notice.

## Licence and governance

Licensed under [Creative Commons Attribution 4.0 International](LICENSE). You
are free to share and adapt this content with appropriate attribution.

This repository is a Bundu Foundation initiative (ZIP — the Zimbabwe
Information Platform). The Bundu Foundation is the governance body;
[Nyuchi](https://nyuchi.com) is the operator.

© Bundu Foundation, operated by Nyuchi Africa (Pvt) Ltd.

## Contact

- **Website** — [travel-info.co.zw](https://travel-info.co.zw)
- **Email** — <hi@travel-info.co.zw>
- **Contact form** — [travel-info.co.zw/contact](https://travel-info.co.zw/contact)
