import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { listDeployments, saveDeployment } from "@/lib/store";
import { parseConfig, ConfigError } from "@/lib/terraform/config";
import { generateHcl } from "@/lib/terraform/generate";
import { getExecutor } from "@/lib/executor";
import type { Deployment } from "@/lib/terraform/types";

export const dynamic = "force-dynamic";

// GET /api/deployments — list all deployments.
export async function GET() {
  const deployments = await listDeployments();
  return NextResponse.json({ deployments });
}

// POST /api/deployments — validate config, generate HCL, compute plan, store.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  let config;
  try {
    config = parseConfig(body);
  } catch (err) {
    if (err instanceof ConfigError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }

  const executor = getExecutor();
  const hcl = generateHcl(config);
  const plan = await executor.plan(config, hcl);
  const nowIso = new Date().toISOString();

  const deployment: Deployment = {
    id: randomUUID().slice(0, 8),
    config,
    status: "planned",
    hcl,
    plan,
    resources: [],
    events: [],
    mode: executor.mode,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  await saveDeployment(deployment);
  return NextResponse.json({ deployment }, { status: 201 });
}
