# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A mock Netflix clone — a browse-only SPA with no backend, no database, and
no external API keys. The catalog is a hardcoded JSON file; trailers are
public sample mp4s from Google's `gtv-videos-bucket`; posters are
`picsum.photos/seed/<name>` placeholders. All user state (selected profile,
My List, Continue Watching progress) lives in `localStorage`.

**Live:** https://gray-sky-03a742303.7.azurestaticapps.net
**Resource group:** `rg-netflix-dev`
**Subscription:** `c3dc5e7c-cd4d-46b0-b7d8-efd2e3dde06e`

## Commands

```bash
npm install
npm run dev       # Vite dev server → http://localhost:5173
npm run build     # tsc -b && vite build → dist/
npm run preview   # preview the built bundle locally

# Deploy an updated bundle to the existing SWA (infra unchanged):
npm run build
npx @azure/static-web-apps-cli deploy ./dist \
  --deployment-token "$(terraform -chdir=infra output -raw deployment_token)" \
  --env production
```

Terraform (from `infra/`):

```bash
terraform init
terraform plan
terraform apply
terraform destroy   # tears down the RG + SWA
```

There is no test runner or linter configured — type-checking runs as part
of `npm run build` via `tsc -b`.

## Architecture

**Single React SPA, Vite-built, deployed as static assets to Azure Static
Web Apps.** The SWA's `staticwebapp.config.json` (in `public/`, so it
lands in `dist/`) rewrites all unmatched paths to `/index.html` so
client-side routes resolve on hard refresh.

Load order the app follows on every mount:

1. `useProfile` reads `mock-netflix:profile` from `localStorage`.
2. If no profile is set, `App` renders `ProfilePicker` at `/profile`
   regardless of the requested URL.
3. Once a profile is chosen, all routes are mounted and `Nav` is rendered.

### Data model — everything flows through `src/data/rows.ts`

- `catalog.json` is the single source of truth. Every title has `posterSeed`
  and `backdropSeed` fed to `picsum.photos` for stable images, plus a
  `trailerUrl` pointing at a public sample mp4.
- Row composition (`buildRows`) is centralized here — Home, Browse pages,
  and Genre pages all consume the same helpers (`isSeries`, `byGenre`,
  `allGenres`). If you add a new row category, add it to `buildRows` and
  Home picks it up automatically.
- `search()` does a case-insensitive substring match over title, synopsis,
  genre, and cast — no fuzzy library, keep it that way for the mock.

### Per-profile state — `localStorage` keys are namespaced by profile id

- `mock-netflix:profile` — current profile id (single value)
- `mock-netflix:mylist:<profileId>` — array of title ids
- `mock-netflix:continue:<profileId>` — array of `{id, percent, updatedAt}`

`useMyList` and `useContinueWatching` both take a `profileId` and encode
this convention. When the user switches profiles, hooks re-read on the
`profileId` change — never share state between profiles.

Continue Watching is written **from `TitleDetail`** on a 2-second interval
while the trailer is playing, and reads back on the next visit to resume
`currentTime`. Progress ≥95% is treated as "finished" and evicted so the
row doesn't accumulate completed titles.

### Card hover pop-out

`Card` is used everywhere titles appear (rows, grids). The Netflix-style
hover behavior — a larger `320px` panel with Play / + / Like / More Info
buttons — is implemented as an **absolutely-positioned overlay** on top
of the always-rendered base card, so layout doesn't shift. Any place that
renders cards must pass `profileId` so the `+ My List` toggle works.

### Kids profile

`profile.isKid` is the switch that gates the whole app to `kidsSafe`
titles. Filtering happens once in `buildRows({ kidsOnly })` and in
`Home`'s `featured` memo — downstream components stay unaware.

## Infrastructure

Terraform in `infra/` provisions two resources: a resource group and
`azurerm_static_web_app` on the **Free** tier. The `deployment_token`
output is what the SWA CLI uses to upload `dist/`. There is no GitHub
Actions integration — deploys are driven from the local machine via
`swa deploy`, keeping the demo self-contained.

`sku_tier` variable accepts `"Free"` or `"Standard"`; bump to Standard
for custom domains, staging environments, or built-in auth.

## What's intentionally NOT here

- Any real backend, database, or auth — this is a UI mock.
- Real Netflix assets (logo SVG, poster images, video content). The
  `NetflixLogo` component uses a text approximation.
- A test suite — the surface is small and behavior is user-visible.
- CI/CD wiring — deploys are manual via `swa deploy`.
