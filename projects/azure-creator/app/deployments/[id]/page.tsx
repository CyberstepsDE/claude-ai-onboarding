import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDeployment } from "@/lib/store";
import { DeploymentDetail } from "@/components/DeploymentDetail";

export const dynamic = "force-dynamic";

export default async function DeploymentPage({
  params,
}: {
  params: { id: string };
}) {
  const deployment = await getDeployment(params.id);
  if (!deployment) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-slate-200"
      >
        <ArrowLeft size={15} />
        Back to deployments
      </Link>
      <DeploymentDetail initial={deployment} />
    </div>
  );
}
