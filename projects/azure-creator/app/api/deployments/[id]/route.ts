import { NextResponse } from "next/server";
import { deleteDeployment, getDeployment, saveDeployment } from "@/lib/store";
import { getExecutor } from "@/lib/executor";

export const dynamic = "force-dynamic";

// GET /api/deployments/:id — fetch one deployment.
export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const deployment = await getDeployment(params.id);
  if (!deployment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ deployment });
}

// DELETE /api/deployments/:id — destroy (simulated) then remove.
// ?keep=1 destroys the resources but keeps the record (status: destroyed).
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const deployment = await getDeployment(params.id);
  if (!deployment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const keep = new URL(request.url).searchParams.get("keep") === "1";

  // Only run destroy when there's something provisioned.
  if (deployment.resources.length > 0) {
    const executor = getExecutor();
    const destroyed = await executor.destroy(deployment);
    if (keep) {
      await saveDeployment(destroyed);
      return NextResponse.json({ deployment: destroyed });
    }
  }

  await deleteDeployment(params.id);
  return NextResponse.json({ ok: true });
}
