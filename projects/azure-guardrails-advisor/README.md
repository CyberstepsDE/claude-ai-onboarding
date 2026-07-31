# Azure Guardrails Advisor

A single-page web app that scans an Azure subscription for common security
misconfigurations and surfaces prioritized findings.

Built as an AI-demo project for the Claude Code onboarding course.

**Live demo:** https://app-guardrails-85edb5.azurewebsites.net

## Architecture

Everything runs in one Linux App Service — the same app serves the static
frontend at `/` and the scan API at `/api/scan`. No secrets in code: the
app uses a System-Assigned Managed Identity granted `Reader` +
`Security Reader` on the subscription.

```
   ┌─────────────────────────────────────┐
   │  Linux App Service (Python 3.11)    │
   │  FastAPI + Uvicorn                  │
   │                                     │
   │   GET  /            → static files  │
   │   POST /api/scan    → rule engine   │
   │   GET  /api/health  → readiness     │
   │                                     │
   │   Managed Identity ──┐              │
   └──────────────────────┼──────────────┘
                          │
                          ▼
              Azure Resource Graph
              (KQL over subscription)
```

Supporting resources:

- Log Analytics workspace + Application Insights (App Service telemetry)
- Storage account with two Tables (`findings`, `scanruns`) for scan history

## Layout

```
projects/azure-guardrails-advisor/
├── infra/            # Terraform (App Service, storage, RBAC)
├── backend/
│   ├── main.py       # FastAPI app
│   ├── rules/        # rule engine — one file per rule
│   ├── static/       # frontend (HTML/JS/CSS)
│   └── requirements.txt
└── README.md
```

## Rules (12 in this cut)

Each rule is a small class implementing `evaluate(ctx) -> list[Finding]`;
most use a single KQL query via Azure Resource Graph.

| ID           | Severity | What it flags                                              |
| ------------ | -------- | ---------------------------------------------------------- |
| STORAGE-001  | HIGH     | Storage account allows public network access               |
| STORAGE-002  | MEDIUM   | Storage account allows TLS < 1.2                           |
| KV-001       | HIGH     | Key Vault without purge protection                         |
| KV-002       | HIGH     | Key Vault without soft delete                              |
| VM-001       | HIGH     | VM directly attached to a public IP                        |
| NSG-001      | HIGH     | NSG allows 0.0.0.0/0 on SSH (22) or RDP (3389)             |
| DISK-001     | MEDIUM   | Managed disk without CMK encryption                        |
| DIAG-001     | MEDIUM   | Resource missing diagnostic settings                       |
| PE-001       | HIGH     | SQL server publicly reachable                              |
| PE-002       | HIGH     | Cosmos DB publicly reachable                               |
| TAG-001      | LOW      | Resource missing required tag (owner / env / costcenter)   |
| APP-001      | MEDIUM   | App Service public without WAF or IP restrictions          |

## Deploying

Prereqs: `az login`, Terraform ≥ 1.5, Python 3.11+.

```bash
# 1. Provision infrastructure
cd infra
terraform init
terraform apply    # defaults target subscription c3dc5e7c-…

# 2. Package the app and push it
cd ..
( cd backend && zip -r ../app.zip . -x "*.pyc" -x "__pycache__/*" -x ".venv/*" )
az webapp deploy \
  --resource-group rg-guardrails-dev \
  --name app-guardrails-85edb5 \
  --src-path app.zip --type zip
```

Open the site URL (from `terraform output site_url`) and click **Run scan**.

## Running locally

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export SUBSCRIPTION_ID=c3dc5e7c-cd4d-46b0-b7d8-efd2e3dde06e
uvicorn main:app --reload
```

Local auth uses whatever `DefaultAzureCredential` finds — usually `az login`.

## Adding a rule

1. Create `backend/rules/<name>.py` with a class subclassing `Rule`.
2. Register it in `backend/rules/__init__.py`.
3. Update the table above.

## Deliberately deferred

- AI-generated remediation suggestions (interface stub is in place).
- Auth on the frontend — the site is intentionally public for the demo.
