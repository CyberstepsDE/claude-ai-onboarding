import Link from "next/link";
import { Plus, Server, Boxes, Activity } from "lucide-react";
import { listDeployments } from "@/lib/store";
import { DeploymentCard } from "@/components/DeploymentCard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const deployments = await listDeployments();
  const running = deployments.filter((d) => d.status === "running").length;
  const scaleSets = deployments.filter((d) => d.config.kind === "scaleset").length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Deployments</h1>
        <p className="mt-1 text-sm text-slate-400">
          Configure a VM or Scale Set and launch it. The app generates real
          Terraform and simulates the plan &amp; apply.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <Stat icon={<Server size={18} />} label="Total deployments" value={deployments.length} />
        <Stat icon={<Activity size={18} />} label="Running" value={running} accent />
        <Stat icon={<Boxes size={18} />} label="Scale Sets" value={scaleSets} />
      </div>

      {deployments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deployments.map((d) => (
            <DeploymentCard key={d.id} deployment={d} />
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-ink-700/70 bg-ink-800/60 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <span className={accent ? "text-emerald-400" : "text-azure-soft"}>{icon}</span>
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-2 text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-ink-700 bg-ink-800/40 p-12 text-center">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-azure/15 text-azure ring-1 ring-azure/30">
        <Server size={22} />
      </div>
      <h2 className="text-lg font-medium text-white">No deployments yet</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-400">
        Spin up your first virtual machine or autoscaling scale set.
      </p>
      <Link
        href="/new"
        className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-azure px-4 py-2 text-sm font-medium text-white transition hover:bg-azure-deep"
      >
        <Plus size={16} />
        New deployment
      </Link>
    </div>
  );
}
