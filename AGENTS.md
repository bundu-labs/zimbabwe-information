# AGENTS.md

Rules for every AI coding agent (Claude Code, Cursor, Copilot and the rest)
working in this repository.

The enterprise-wide rules are in
[`nyuchi/.github/AGENTS.md`](https://github.com/nyuchi/.github/blob/main/AGENTS.md)
and the org rules in
[`bundu-labs/.github/AGENTS.md`](https://github.com/bundu-labs/.github/blob/main/AGENTS.md).
Both apply here in full. This file adds what is specific to this repo.

## What this repo is

The content behind [travel-info.co.zw](https://travel-info.co.zw): MDX pages
of Zimbabwe travel information published as a Mintlify site, plus the apps
under `apps/`. The site deploys through the Mintlify GitHub App on push to
`main`; there is no other deploy path.

## Content rules

- Pages are MDX. Navigation lives in `docs.json`: a new page that is not
  listed there is not published.
- Every factual claim carries a source in the page's `## Sources` section.
  Do not state a price, visa rule, opening time or contact detail you cannot
  source.
- A page names a reviewer only when that person has actually reviewed it
  (see `REVIEWING.md`). Never invent a reviewer or a review date.
- Do not add images without a licence that allows reuse, and keep them under
  `images/`.
- Content is licensed CC BY 4.0 (see `LICENSE`).

## Stack and commands

- Mintlify docs, npm workspaces (`packageManager` in `package.json`), Vite+
  for lint, format and test.
- Install: `npm ci`.
- Check (lint and format): `npm run check`.
- Test: `npm test`.
- Run these before opening a PR. CI runs the same checks.

## Branches, releases and merging

- Trunk-based: `main` is the only long-lived branch. There is no `staging`
  branch and no `staging` environment. Work branches off `main` and PRs land
  in `main`.
- PR titles are Conventional Commits: lowercase, imperative subject, no
  trailing period. Put `Closes #n` in the PR description.
- Never disable or weaken a check to get green. Fix the cause or escalate.
- Never commit secrets, `.env` files or credentials. The Supabase keys the
  apps use come from the secret store, never from the repo.
