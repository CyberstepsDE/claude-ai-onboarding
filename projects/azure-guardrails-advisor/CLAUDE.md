# Claude notes — Azure Guardrails Advisor

## What this is
A subscription security scanner. One Linux App Service runs a FastAPI app that
serves both the static frontend (`/`) and the scan API (`/api/scan`). Terraform
provisions everything.

**Live:** https://app-guardrails-85edb5.azurewebsites.net
**Resource group:** `rg-guardrails-dev`
**Subscription:** `c3dc5e7c-cd4d-46b0-b7d8-efd2e3dde06e`

## Conventions
- **Python 3.11** for the backend. FastAPI + Uvicorn under Gunicorn.
- **Rule classes** live in `backend/rules/`, one file per rule (subclass `Rule`
  from `backend/rules/base.py`). New rules must also be registered in
  `backend/rules/__init__.py` — that's the single source of truth for the runner.
- **Terraform** in `infra/`, split by concern (`app_service.tf`, `storage.tf`,
  `rbac.tf`, `main.tf`, `variables.tf`, `outputs.tf`).
- **No secrets** in code or `.tf` files. Auth is via System-Assigned Managed
  Identity — the app service principal has `Reader` + `Security Reader` on the
  subscription and `Storage Table Data Contributor` on the findings account.

## Deploy flow
1. `terraform apply` in `infra/`.
2. `( cd backend && zip -r ../app.zip . )` — Oryx builds `requirements.txt` on
   the server (`SCM_DO_BUILD_DURING_DEPLOYMENT=true`).
3. `az webapp deploy --src-path app.zip --type zip …`.

## Adding a rule
1. Create `backend/rules/<name>.py` with a class subclassing `Rule`.
2. Register it in `backend/rules/__init__.py`.
3. Update the table in `README.md`.

## What's intentionally NOT here
- LLM-generated remediation suggestions.
- Authentication on the frontend — the site is public by design.
