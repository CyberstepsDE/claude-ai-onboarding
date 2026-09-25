import type { DeploymentStatus } from "@/lib/terraform/types";

const STYLES: Record<DeploymentStatus, { label: string; cls: string }> = {
  planned: { label: "Planned", cls: "bg-slate-500/15 text-slate-300 ring-slate-500/30" },
  applying: { label: "Applying", cls: "bg-azure/15 text-azure-soft ring-azure/40 animate-pulse" },
  running: { label: "Running", cls: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30" },
  destroying: { label: "Destroying", cls: "bg-amber-500/15 text-amber-300 ring-amber-500/30 animate-pulse" },
  destroyed: { label: "Destroyed", cls: "bg-slate-600/20 text-slate-400 ring-slate-600/30" },
  error: { label: "Error", cls: "bg-red-500/15 text-red-300 ring-red-500/30" },
};

export function StatusBadge({ status }: { status: DeploymentStatus }) {
  const s = STYLES[status];
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 " +
        s.cls
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}
