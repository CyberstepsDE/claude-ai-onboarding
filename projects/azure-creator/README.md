# VM Launcher (`azure-creator`)

A small SaaS-style web app with a nice UI that provisions **Azure virtual
machines and VM Scale Sets via Terraform**.

It is **mock-first**: out of the box it generates *real, valid Terraform HCL*
and simulates the `plan` / `apply` — **no Azure account, no credentials, no
cost**. It is also **credentials-ready**: flipping `EXECUTOR_MODE` to
`terraform` and supplying Azure credentials makes the exact same UI run real
deployments. And it ships with its own Terraform to deploy the app itself to
Azure App Service.

![mock-first · real Terraform · credentials-ready](https://img.shields.io/badge/mode-mock--first-emerald) ·
Next.js 14 · TypeScript · Tailwind · azurerm `~> 3.100`

---

## Run it locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

The dashboard starts with two seeded deployments. Click **New deployment** to
configure a VM or Scale Set — pick region, OS, size, networking, and (for scale
sets) autoscale bounds. Submitting generates the Terraform and a plan; open the
deployment and hit **Apply** to watch the simulated provision stream in.

## How it works

```
Wizard (app/new) ──▶ POST /api/deployments
        │                  │
        │        parseConfig ▶ generateHcl(config)  ← real HCL, azurerm ~> 3.100
        │                  │
        │             Executor.plan ──▶ stored Deployment
        ▼                  │
Detail (app/deployments/[id]) ──▶ POST …/apply ──▶ Executor.apply
```

The one important seam is the **Executor** (`lib/executor/`):

| Mode | Class | Behavior |
|------|-------|----------|
| `mock` (default) | `MockExecutor` | Simulates plan/apply/destroy with staged events, fake resource IDs and a public IP. No Azure calls. |
| `terraform` | `TerraformExecutor` | Writes the generated HCL to a workspace and shells out to the real `terraform` CLI. Guarded — refuses to run without Azure credentials. |

Because everything talks to the `Executor` interface, going live is a single
config change, not a rewrite.

Key modules:

- `lib/terraform/generate.ts` — pure `config → HCL`. The Terraform it emits
  passes `terraform validate` (see below).
- `lib/terraform/catalog.ts` — regions, VM sizes, OS images.
- `lib/store/` — file-backed JSON at `.data/deployments.json` (gitignored),
  seeded on first run. *On Azure App Service the disk is ephemeral, so this
  resets on restart — fine for a demo; swap for Azure Table/Cosmos to persist.*
- `lib/azure/credentials.ts` — reads Azure config from env only; nothing is
  ever committed.

## Going live (real Azure deploys)

1. Copy `.env.example` to `.env.local`.
2. Set `EXECUTOR_MODE=terraform` and provide credentials — a Managed Identity in
   Azure (leave client id/secret blank), or a Service Principal locally
   (`AZURE_SUBSCRIPTION_ID` / `AZURE_TENANT_ID` / `AZURE_CLIENT_ID` /
   `AZURE_CLIENT_SECRET`).
3. Ensure the identity has a **write role** (`Contributor`) on the target scope —
   this app *provisions*, so read-only won't do.
4. Restart. Applies now run `terraform init/plan/apply` for real.

> Real applies create billable Azure resources. Destroy what you spin up.

## Deploy the app itself to Azure

Terraform under `infra/` provisions a Linux App Service (System-Assigned
identity, App Insights + Log Analytics, TLS 1.2, https-only):

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars   # fill in subscription_id
terraform init
terraform apply
# then deploy the built app to the Web App (e.g. az webapp deploy --type zip)
```

To let the *deployed* app run real VM provisioning, set `executor_mode =
"terraform"` in `terraform.tfvars` and uncomment the `Contributor` role
assignment in `infra/app_service.tf`.

## Verify

```bash
npm run build                                   # type-check + Next build

# Prove the generated HCL is real Terraform:
#   create a deployment in the UI, copy the Terraform tab into a main.tf, then
cd /tmp/some-workspace && terraform init -backend=false && terraform validate

cd infra && terraform init -backend=false && terraform validate   # app infra
```

## Project layout

```
app/            Next.js App Router — dashboard, wizard, detail, API routes
components/     UI: cards, badges, config wizard, HCL viewer, activity log
lib/terraform/  types, catalog, config parser, HCL generator
lib/executor/   Executor interface + mock and terraform implementations
lib/store/      file-backed deployment store + seed data
lib/azure/      credentials helper (env only)
infra/          Terraform to host the app on Azure App Service
```
