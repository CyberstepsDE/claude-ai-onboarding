"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Boxes,
  Server,
  Rocket,
  Trash2,
  Loader2,
  Copy,
  Check,
  FileCode2,
  ListChecks,
  Terminal,
  Settings2,
} from "lucide-react";
import type { ApplyEvent, Deployment } from "@/lib/terraform/types";
import { getOsImage, getRegion, getVmSize } from "@/lib/terraform/catalog";
import { StatusBadge } from "./StatusBadge";

type Tab = "config" | "terraform" | "plan" | "log";

export function DeploymentDetail({ initial }: { initial: Deployment }) {
  const router = useRouter();
  const [deployment, setDeployment] = useState<Deployment>(initial);
  const [tab, setTab] = useState<Tab>("terraform");
  const [busy, setBusy] = useState<"apply" | "destroy" | null>(null);
  const [visibleEvents, setVisibleEvents] = useState<ApplyEvent[]>(initial.events);

  const { config } = deployment;
  const isScaleSet = config.kind === "scaleset";

  async function apply() {
    setBusy("apply");
    setTab("log");
    setVisibleEvents([]);
    try {
      const res = await fetch(`/api/deployments/${deployment.id}/apply`, { method: "POST" });
      const data = await res.json();
      setDeployment(data.deployment);
      // Reveal the log progressively for a live feel.
      revealEvents(data.deployment.events, setVisibleEvents);
    } finally {
      setBusy(null);
      router.refresh();
    }
  }

  async function destroy() {
    if (!confirm(`Destroy "${config.name}"? This removes the deployment.`)) return;
    setBusy("destroy");
    try {
      await fetch(`/api/deployments/${deployment.id}?keep=0`, { method: "DELETE" });
      router.push("/");
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  const canApply = deployment.status === "planned" || deployment.status === "error";

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-700/70 text-azure-soft ring-1 ring-ink-600">
            {isScaleSet ? <Boxes size={22} /> : <Server size={22} />}
          </span>
          <div>
            <h1 className="text-xl font-semibold text-white">{config.name}</h1>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
              <span>{isScaleSet ? "Scale Set" : "Virtual Machine"}</span>
              <span className="text-slate-600">·</span>
              <span className="font-mono">{deployment.id}</span>
              <span className="text-slate-600">·</span>
              <span>{deployment.mode === "mock" ? "mock" : "live"} mode</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={deployment.status} />
          {canApply && (
            <button
              onClick={apply}
              disabled={busy !== null}
              className="inline-flex items-center gap-2 rounded-lg bg-azure px-4 py-2 text-sm font-medium text-white transition hover:bg-azure-deep disabled:opacity-60"
            >
              {busy === "apply" ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
              Apply
            </button>
          )}
          <button
            onClick={destroy}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 rounded-lg bg-ink-700/70 px-3.5 py-2 text-sm font-medium text-red-300 ring-1 ring-red-500/20 transition hover:bg-red-500/10 disabled:opacity-60"
          >
            {busy === "destroy" ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            Destroy
          </button>
        </div>
      </div>

      {deployment.publicIp && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
          <span className="text-xs font-medium text-emerald-300">Public endpoint</span>
          <code className="font-mono text-sm text-emerald-200">{deployment.publicIp}</code>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-6 flex gap-1 border-b border-ink-700/70">
        <TabButton active={tab === "config"} onClick={() => setTab("config")} icon={<Settings2 size={15} />} label="Config" />
        <TabButton active={tab === "terraform"} onClick={() => setTab("terraform")} icon={<FileCode2 size={15} />} label="Terraform" />
        <TabButton active={tab === "plan"} onClick={() => setTab("plan")} icon={<ListChecks size={15} />} label={`Plan · ${deployment.plan.add}`} />
        <TabButton active={tab === "log"} onClick={() => setTab("log")} icon={<Terminal size={15} />} label="Activity" />
      </div>

      <div className="mt-5">
        {tab === "config" && <ConfigView deployment={deployment} />}
        {tab === "terraform" && <HclView hcl={deployment.hcl} />}
        {tab === "plan" && <PlanView raw={deployment.plan.raw} summary={deployment.plan.summary} />}
        {tab === "log" && <LogView events={busy === "apply" ? visibleEvents : deployment.events} />}
      </div>
    </div>
  );
}

function revealEvents(
  events: ApplyEvent[],
  set: (fn: (prev: ApplyEvent[]) => ApplyEvent[]) => void,
) {
  events.forEach((ev, i) => {
    setTimeout(() => set((prev) => [...prev, ev]), i * 180);
  });
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "inline-flex items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-sm font-medium transition " +
        (active
          ? "border-azure text-white"
          : "border-transparent text-slate-400 hover:text-slate-200")
      }
    >
      {icon}
      {label}
    </button>
  );
}

function ConfigView({ deployment }: { deployment: Deployment }) {
  const { config } = deployment;
  const rows: [string, string][] = [
    ["Kind", config.kind === "scaleset" ? "Virtual Machine Scale Set" : "Single VM"],
    ["Region", getRegion(config.region)?.label ?? config.region],
    ["OS image", getOsImage(config.osImage)?.label ?? config.osImage],
    ["Size", getVmSize(config.vmSize)?.label ?? config.vmSize],
    ["Admin user", config.adminUsername],
    ["Public IP", config.network.publicIp ? "Yes" : "No"],
    ["Open ports", config.network.allowedPorts.join(", ") || "none"],
  ];
  if (config.kind === "scaleset") {
    rows.push(
      ["Initial instances", String(config.instanceCount)],
      ["Autoscale", `${config.autoscale.min}–${config.autoscale.max} @ ${config.autoscale.cpuThreshold}% CPU`],
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-ink-700/70">
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([k, v], i) => (
            <tr key={k} className={i % 2 ? "bg-ink-800/40" : "bg-ink-800/20"}>
              <td className="w-48 px-4 py-2.5 text-slate-400">{k}</td>
              <td className="px-4 py-2.5 font-medium text-slate-200">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HclView({ hcl }: { hcl: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(hcl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <div className="relative overflow-hidden rounded-xl border border-ink-700/70 bg-ink-900/70">
      <div className="flex items-center justify-between border-b border-ink-700/70 px-4 py-2">
        <span className="font-mono text-xs text-slate-400">main.tf</span>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-300 hover:bg-ink-700/60"
        >
          {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="scroll-thin max-h-[520px] overflow-auto px-4 py-4 font-mono text-[12.5px] leading-relaxed text-slate-300">
        {hcl}
      </pre>
    </div>
  );
}

function PlanView({ raw, summary }: { raw: string; summary: string }) {
  return (
    <div>
      <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/20">
        Plan: {summary}
      </div>
      <pre className="scroll-thin max-h-[520px] overflow-auto rounded-xl border border-ink-700/70 bg-ink-900/70 px-4 py-4 font-mono text-[12.5px] leading-relaxed text-slate-300">
        {raw}
      </pre>
    </div>
  );
}

function LogView({ events }: { events: ApplyEvent[] }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events.length]);

  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ink-700 bg-ink-800/30 px-4 py-10 text-center text-sm text-slate-500">
        No activity yet. Click <span className="text-slate-300">Apply</span> to provision.
      </div>
    );
  }
  return (
    <div className="scroll-thin max-h-[520px] overflow-auto rounded-xl border border-ink-700/70 bg-ink-900/70 px-4 py-3 font-mono text-[12.5px] leading-relaxed">
      {events.map((ev, i) => (
        <div
          key={i}
          className={
            ev.level === "success"
              ? "text-emerald-300"
              : ev.level === "error"
                ? "text-red-300"
                : "text-slate-400"
          }
        >
          <span className="mr-2 text-slate-600">{ev.ts.slice(11, 19)}</span>
          {ev.message}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
