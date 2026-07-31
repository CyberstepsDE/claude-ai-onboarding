"""FastAPI app for the Azure Guardrails Advisor.

Serves the static frontend from `/` and exposes:
  - POST /api/scan   — walk every registered rule against the subscription
  - POST /api/chat   — chat with a small model (Azure OpenAI) about findings
  - GET  /api/health — readiness probe
"""

from __future__ import annotations

import logging
import os
import uuid
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

from azure.identity import DefaultAzureCredential, get_bearer_token_provider
from azure.mgmt.resourcegraph import ResourceGraphClient
from azure.mgmt.resourcegraph.models import QueryRequest
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from openai import AzureOpenAI
from pydantic import BaseModel, Field

from rules import ALL_RULES
from rules.base import Finding, RuleContext

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("guardrails")

app = FastAPI(title="Azure Guardrails Advisor")

STATIC_DIR = Path(__file__).parent / "static"

# Shared credential — DefaultAzureCredential caches tokens internally.
_credential = DefaultAzureCredential()


# ---------- /api/health ------------------------------------------------------

@app.get("/api/health")
def health() -> dict:
    return {
        "ok": True,
        "subscription_id": os.environ.get("SUBSCRIPTION_ID", ""),
        "chat_configured": bool(os.environ.get("AZURE_OPENAI_ENDPOINT")),
    }


# ---------- /api/scan --------------------------------------------------------

@app.post("/api/scan")
@app.get("/api/scan")
def scan() -> dict:
    subscription_id = os.environ.get("SUBSCRIPTION_ID")
    if not subscription_id:
        raise HTTPException(status_code=500, detail="SUBSCRIPTION_ID is not configured")

    scan_id = str(uuid.uuid4())
    log.info("Starting scan %s for subscription %s", scan_id, subscription_id)

    graph = ResourceGraphClient(_credential)

    def run_query(kql: str) -> list[dict]:
        response = graph.resources(QueryRequest(subscriptions=[subscription_id], query=kql))
        return response.data or []

    context = RuleContext(
        subscription_id=subscription_id,
        credential=_credential,
        run_kql=run_query,
    )

    findings: list[Finding] = []
    rule_errors: list[dict] = []

    for rule_cls in ALL_RULES:
        rule = rule_cls()
        try:
            findings.extend(rule.evaluate(context))
        except Exception as exc:  # noqa: BLE001 — one broken rule shouldn't fail the scan
            log.exception("Rule %s failed", rule.rule_id)
            rule_errors.append({"rule_id": rule.rule_id, "error": str(exc)})

    return {
        "scan_id": scan_id,
        "subscription_id": subscription_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "total": len(findings),
        "findings": [asdict(f) for f in findings],
        "rule_errors": rule_errors,
    }


# ---------- /api/chat --------------------------------------------------------

SYSTEM_PROMPT = """You are the Azure Guardrails Advisor chat assistant.

You help users understand the security findings surfaced by this scanner and
suggest concrete remediation steps for Azure resources. You know the rule
engine covers: storage public access & TLS, Key Vault soft-delete/purge
protection, VMs with public IPs, NSG rules opening SSH/RDP to the internet,
disk encryption (CMK), missing diagnostic settings, SQL and Cosmos public
network access, missing required tags (owner/env/costcenter), and App
Services without a WAF.

Guidelines:
- Be terse and direct — security-relevant answers should not hedge.
- When suggesting a Terraform fix, give the exact resource type and argument
  (e.g. `azurerm_storage_account.public_network_access_enabled = false`).
- If asked about resources or Azure features you're not sure about, say so.
- Never invent resource IDs, policy names, or SDK method signatures.
- You are not authorized to take actions — you only advise. If a user asks
  you to change something, explain what they'd change and where.
"""


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(default_factory=list)


_chat_client: AzureOpenAI | None = None


def _get_chat_client() -> AzureOpenAI:
    global _chat_client
    if _chat_client is None:
        endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
        if not endpoint:
            raise HTTPException(status_code=503, detail="Chat is not configured on this deployment")
        token_provider = get_bearer_token_provider(
            _credential, "https://cognitiveservices.azure.com/.default"
        )
        _chat_client = AzureOpenAI(
            azure_endpoint=endpoint,
            azure_ad_token_provider=token_provider,
            api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2024-10-21"),
        )
    return _chat_client


@app.post("/api/chat")
def chat(body: ChatRequest) -> dict:
    if not body.messages:
        raise HTTPException(status_code=400, detail="messages is required and must be non-empty")

    deployment = os.environ.get("AZURE_OPENAI_DEPLOYMENT")
    if not deployment:
        raise HTTPException(status_code=503, detail="AZURE_OPENAI_DEPLOYMENT is not configured")

    client = _get_chat_client()

    try:
        completion = client.chat.completions.create(
            model=deployment,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *({"role": m.role, "content": m.content} for m in body.messages),
            ],
            temperature=0.3,
            max_completion_tokens=600,
        )
    except Exception as exc:  # noqa: BLE001
        log.exception("Chat completion failed")
        raise HTTPException(status_code=502, detail=f"Model call failed: {exc}") from exc

    reply = completion.choices[0].message.content or ""
    return {
        "reply": reply,
        "model": completion.model,
        "usage": {
            "prompt_tokens": completion.usage.prompt_tokens if completion.usage else None,
            "completion_tokens": completion.usage.completion_tokens if completion.usage else None,
        },
    }


# ---------- static frontend --------------------------------------------------

# Mount LAST so /api/* wins the route match above.
app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")
