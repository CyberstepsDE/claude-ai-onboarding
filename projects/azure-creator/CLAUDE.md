# CLAUDE.md — azure-creator (VM Launcher)

Guidance for working in this project.

## What this is

A Next.js (App Router) + TypeScript + Tailwind app that provisions Azure VMs and
VM Scale Sets **via Terraform**. It runs **mock-first** (generates real HCL,
simulates plan/apply, no Azure calls) and is **credentials-ready** for real
deploys. See `README.md` for the full tour.

## Architecture rules

- **All Azure/Terraform side effects go through the `Executor` interface**
  (`lib/executor/index.ts`). Never call the Azure SDK or shell out to Terraform
  from API routes, components, or the store. Add capability to `MockExecutor`
  and `TerraformExecutor` together so both modes stay in sync.
- **`lib/terraform/generate.ts` is a pure function** (`config → HCL`). No I/O,
  no randomness. The HCL it emits must remain `terraform validate`-clean.
- **The generator and `plannedResources()` (mock.ts) must agree** on the set of
  resources — the plan count comes from the latter, the HCL from the former.
- **The store is the only persistence** (`lib/store/`). Swap its four functions
  to change backends; don't scatter file/db access elsewhere.
- **Server components read the store directly**; client components talk to the
  app through `/api/deployments*` only.

## Conventions

- Terraform: `azurerm ~> 3.100`, `required_version >= 1.5.0`, `local.tags`, and
  the `substr(sha1(...), 0, 6)` suffix for unique names — matching the other
  `infra/` modules in this repo.
- Catalog data (regions, sizes, images) lives in `lib/terraform/catalog.ts`;
  add options there, not inline.
- Styling is Tailwind-only with `lucide-react` icons. No component library.

## Verify a change

```bash
npm run build      # type-check + Next build
npm run dev        # smoke-test the UI at :3000
cd infra && terraform init -backend=false && terraform validate
```

When you touch `generate.ts`, also validate a generated sample (see README →
Verify) so the emitted Terraform stays real.

See `.claude/RULES.md` for the hard safety rules (secrets, destroy, cost).
