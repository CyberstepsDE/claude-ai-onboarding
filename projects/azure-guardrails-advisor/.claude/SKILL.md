# Skills — Azure Guardrails Advisor

Repeatable jobs the assistant knows how to do in this project. Pick the skill
that matches what the user asked and run through its behavior list.

---

## Skill: add_security_rule

### When to use
The user asks to add, port, or extend a security check — anything like
"add a rule for X", "flag resources that Y", "detect Z". Not for tweaking
copy on an existing rule; for that, edit the file directly.

### Behavior
1. Pick a **rule ID** in the format `<AREA>-NNN` (e.g. `NSG-002`, `KV-003`).
   Use an existing area prefix when the new rule is a sibling of one; make a
   new prefix only when the resource family is genuinely new.
2. Decide the **severity**: `HIGH` for anything internet-exposed, missing
   encryption, or violating a compliance baseline; `MEDIUM` for weak defaults
   and missing logging; `LOW` for hygiene like tags and naming.
3. Draft the **KQL query** against Azure Resource Graph. Filter tightly on
   `type =~` and the property that matters — don't return every resource of a
   type and post-filter in Python.
4. Create `backend/rules/<name>.py` — subclass `Rule`, set `rule_id`, `title`,
   `severity`, implement `evaluate(ctx)` using `ctx.run_kql(...)` and
   `self._finding(row, description=..., remediation=...)`.
5. Register the class in `backend/rules/__init__.py` — import it and append
   to `ALL_RULES`. This is the single source of truth for the runner.
6. Add a row to the rules table in `README.md`.
7. Test locally (`uvicorn main:app --reload`, then `curl -X POST
   http://localhost:8000/api/scan`) or deploy and hit the live endpoint.

### Output format
- Short confirmation of the rule ID, severity, and which KQL properties it
  keys off.
- The exact list of files touched, as `path/to/file.py:line`.
- One line on how to verify: local `curl` command or the live URL to hit.

---

## Skill: deploy_changes

### When to use
The user asks to push code changes to Azure, redeploy, or "make it live".
Also use when a rule has been added and the user wants to see it running.

### Behavior
1. Sanity check that Terraform state is current: `terraform plan` in `infra/`.
   If it wants to change infra unexpectedly, stop and surface the diff.
2. If **only backend code** changed: skip Terraform. Zip `backend/` and push:
   ```bash
   ( cd backend && zip -r ../app.zip . -x "*.pyc" -x "__pycache__/*" -x ".venv/*" )
   az webapp deploy \
     --resource-group rg-guardrails-dev \
     --name app-guardrails-85edb5 \
     --src-path app.zip --type zip
   ```
3. If **infra** changed: `terraform apply` in `infra/` first, then the zip
   deploy above.
4. Verify with `curl https://app-guardrails-85edb5.azurewebsites.net/api/health`
   returning `{"ok": true, ...}`. If the site 5xxs, wait 30–60 seconds — App
   Service warms up after a deploy — then retry.

### Output format
- What was deployed (infra / code / both) and how long it took.
- The site URL and a one-line health probe result.
- If anything failed: the tail of the failure output, not a full stack.

---

## Skill: run_scan_locally

### When to use
The user wants to iterate on a rule without waiting for a deploy, or wants
to see the raw findings for debugging.

### Behavior
1. Ensure a virtualenv exists in `backend/`, install `requirements.txt`.
2. Export `SUBSCRIPTION_ID=c3dc5e7c-cd4d-46b0-b7d8-efd2e3dde06e` (the target
   subscription — leave overridable via an env var).
3. Confirm the user is `az login`'d against the same subscription:
   `az account show --query id -o tsv`.
4. Start the app: `uvicorn main:app --reload`.
5. Fire a scan: `curl -s -X POST http://localhost:8000/api/scan | jq '{total, by_severity: [.findings[] | .severity] | group_by(.) | map({sev: .[0], n: length})}'`.

### Output format
- The command they should run in a second terminal.
- A one-line summary of totals by severity.
- If a specific rule was under test, filter to just its findings by
  `rule_id`.

---

## Skill: investigate_finding

### When to use
The user asks why a specific resource was flagged, why a rule fired (or
didn't), or wants to confirm a finding before acting on it.

### Behavior
1. Find the rule's KQL in `backend/rules/<name>.py`.
2. Run the same query directly to confirm: `az graph query -q "<KQL>"
   --subscriptions c3dc5e7c-cd4d-46b0-b7d8-efd2e3dde06e`.
3. Compare the flagged resource's actual state via `az resource show
   --ids <id>` — read the property the rule keys off.
4. If the rule fired incorrectly, propose a KQL tightening (extra filter,
   different property path). Never disable a rule to make a false positive
   "go away" — narrow it instead.

### Output format
- The rule ID, the resource ID, and the property values that triggered it.
- Verdict: `confirmed`, `false positive`, or `needs KQL fix`.
- If a fix is needed, the exact KQL diff.
