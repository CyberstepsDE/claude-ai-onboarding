import Link from "next/link";
import { Boxes, Server, Cpu, MapPin, Network } from "lucide-react";
import type { Deployment } from "@/lib/terraform/types";
import { getRegion, getVmSize } from "@/lib/terraform/catalog";
import { StatusBadge } from "./StatusBadge";

export function DeploymentCard({ deployment }: { deployment: Deployment }) {
  const { config } = deployment;
  const region = getRegion(config.region)?.label ?? config.region;
  const size = getVmSize(config.vmSize)?.label ?? config.vmSize;
  const isScaleSet = config.kind === "scaleset";

  return (
    <Link
      href={`/deployments/${deployment.id}`}
      className="group block rounded-xl border border-ink-700/70 bg-ink-800/60 p-5 transition hover:border-azure/50 hover:bg-ink-800"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-700/70 text-azure-soft ring-1 ring-ink-600">
            {isScaleSet ? <Boxes size={18} /> : <Server size={18} />}
          </span>
          <div>
            <div className="font-semibold text-white">{config.name}</div>
            <div className="text-xs text-slate-400">
              {isScaleSet ? "Scale Set" : "Virtual Machine"}
            </div>
          </div>
        </div>
        <StatusBadge status={deployment.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={13} className="text-slate-500" />
          {region}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Cpu size={13} className="text-slate-500" />
          {size}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Network size={13} className="text-slate-500" />
          {config.network.publicIp ? "Public IP" : "Private only"}
        </span>
        {isScaleSet && (
          <span className="inline-flex items-center gap-1.5">
            <Boxes size={13} className="text-slate-500" />
            {config.autoscale.min}–{config.autoscale.max} instances
          </span>
        )}
      </div>

      {deployment.publicIp && (
        <div className="mt-4 rounded-lg bg-ink-900/60 px-3 py-2 font-mono text-xs text-emerald-300 ring-1 ring-ink-700">
          {deployment.publicIp}
        </div>
      )}
    </Link>
  );
}
