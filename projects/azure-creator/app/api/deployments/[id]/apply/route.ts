import { NextResponse } from "next/server";
import { getDeployment, saveDeployment } from "@/lib/store";
import { getExecutor } from "@/lib/executor";

export const dynamic = "force-dynamic";

// POST /api/deployments/:id/apply — provision (simulated in mock mode).
export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const deployment = await getDeployment(params.id);
  if (!deployment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (deployment.status === "running") {
    return NextResponse.json({ deployment }); // already applied — no-op
  }

  const executor = getExecutor();
  const applying = { ...deployment, status: "applying" as const };
  await saveDeployment(applying);

  try {
    const applied = await executor.apply(applying);
    await saveDeployment(applied);
    return NextResponse.json({ deployment: applied });
  } catch (err) {
    const errored = {
      ...applying,
      status: "error" as const,
      events: [
        ...applying.events,
        {
          ts: new Date().toISOString(),
          level: "error" as const,
          message: err instanceof Error ? err.message : "Apply failed.",
        },
      ],
      updatedAt: new Date().toISOString(),
    };
    await saveDeployment(errored);
    return NextResponse.json({ deployment: errored }, { status: 500 });
  }
}
