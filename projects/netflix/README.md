# Mock Netflix Demo

A visual clone of the Netflix browse experience. Runs entirely in the
browser — no backend, no database, no external API keys. Trailers are
public sample mp4s; posters are randomized placeholders from
[picsum.photos](https://picsum.photos).

Built as an AI-demo project for the Claude Code onboarding course.

## Architecture

```
   ┌────────────────────────────────────────┐
   │  Azure Static Web App (Free tier)      │
   │                                        │
   │   Vite + React + TypeScript SPA        │
   │   Tailwind CSS                         │
   │                                        │
   │   catalog.json  ← 40 mock titles       │
   │   localStorage  ← profile + My List    │
   │                                        │
   │   staticwebapp.config.json             │
   │     └─ SPA fallback → /index.html      │
   └────────────────────────────────────────┘
```

There is no server component: the built `dist/` is a static bundle that
Azure Static Web Apps serves directly.

## Features

- **Profile picker** — "Who's watching?" splash with 4 mock profiles
  (one Kids profile)
- **Home** — hero banner + carousels (Trending, Top 10 with the big red
  ranking numerals, New Releases, genre rows)
- **Title detail** — backdrop, synopsis, cast, "Play Trailer" that plays
  a public sample mp4 inline, "+ My List" toggle, "More Like This" row
- **Search** — live search across title, synopsis, genre, and cast
- **My List** — per-profile, persisted to `localStorage`
- **Browse** — TV Shows / Movies / New & Popular category grids
- Netflix-red top nav that transitions from transparent to solid on scroll

## Layout

```
projects/netflix/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── routes/          # ProfilePicker, Home, TitleDetail, Search, MyList, Browse
│   ├── components/      # Nav, HeroBanner, Row, Card, VideoPlayer
│   ├── hooks/           # useProfile, useMyList
│   ├── data/            # catalog.json, profiles.ts, rows.ts, images.ts, types.ts
│   └── styles/index.css
├── public/
│   ├── favicon.svg
│   └── staticwebapp.config.json   # SPA fallback for Azure SWA
├── infra/
│   ├── main.tf                    # provider + resource group
│   ├── swa.tf                     # azurerm_static_web_app
│   ├── variables.tf
│   ├── outputs.tf                 # default_host_name, deployment_token
│   └── terraform.tfvars.example
└── package.json
```

## Run locally

```bash
npm install
npm run dev
# → http://localhost:5173
```

Walk through: pick a profile → scroll carousels → click a title →
Play Trailer → + My List → visit `/my-list` → search from the top nav.

## Deploy to Azure

Prereqs: `az login`, Terraform ≥ 1.5, Node 20+.

**1. Provision infrastructure**

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars   # edit if needed
terraform init
terraform apply
```

This creates a resource group and an Azure Static Web App (Free tier).

**2. Build and upload the bundle**

From the project root:

```bash
npm run build
npx @azure/static-web-apps-cli deploy ./dist \
  --deployment-token "$(terraform -chdir=infra output -raw deployment_token)" \
  --env production
```

The Static Web Apps CLI (`swa`) uploads `dist/` directly using the
deployment token from Terraform output — no GitHub Actions setup required.

**3. Get the public URL**

```bash
terraform -chdir=infra output default_host_name
# → https://<name>.azurestaticapps.net
```

Client-side routes (`/title/:id`, `/my-list`, …) resolve on hard refresh
thanks to `public/staticwebapp.config.json`.

**Cost:** Free tier is $0. Bump `sku_tier = "Standard"` in
`terraform.tfvars` if you want a custom domain, staging environments, or
built-in auth (~$9/month at time of writing).

## Notes on the mock content

- **Trailer URLs** point at Google's public GCS `gtv-videos-bucket`
  samples (Big Buck Bunny, Sintel, Tears of Steel, and short car-review
  clips). They're free-to-use test assets — no copyright concerns.
- **Poster / backdrop images** are `picsum.photos/seed/<name>/W/H`, which
  returns a stable image per seed. Every title gets a consistent poster
  across reloads without shipping any local assets.
- All titles, synopses, cast names, and ratings are fictional. Not
  affiliated with Netflix, Inc.
