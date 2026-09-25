# RULES.md — azure-creator

Hard rules for this project. These are safety guardrails, not style preferences.

## Secrets & credentials

- **Never commit secrets.** No subscription IDs, client secrets, SSH private
  keys, or connection strings in source or generated HCL. Azure config is read
  from the environment only (`lib/azure/credentials.ts`).
- Generated Terraform must take the admin key via the `admin_ssh_public_key`
  variable — never inline a key or password.
- Prefer **Managed Identity** for real mode; a Service Principal is the local
  fallback. Both come from env, never from committed files.
- `.env*`, `*.tfvars` (except `*.tfvars.example`), `*.tfstate`, and `.data/` are
  gitignored. Keep it that way.

## This app provisions — so it is write-capable

- Unlike the read-only `azure-guardrails-advisor`, this app *creates* resources.
  Real mode therefore needs a write role (`Contributor`). That is expected;
  grant it at the narrowest scope that works (a resource group, not the
  subscription, when possible).

## Destroy & cost safety

- Real applies create **billable** Azure resources. Default stays `mock`.
- `terraform destroy` in real mode must be behind an explicit user confirmation
  (the UI already confirms before Destroy). Never auto-destroy without intent.
- Do not widen NSG rules beyond the ports the user selected. No `0.0.0.0/0`
  "allow all" defaults.

## Mock/real parity

- Any change to what gets provisioned must update **both** `generate.ts` (HCL)
  and `plannedResources()` (mock plan) so mock output matches real output.
