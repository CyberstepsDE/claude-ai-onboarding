"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Boxes, Server, Loader2, Rocket } from "lucide-react";
import {
  OS_IMAGES,
  REGIONS,
  VM_SIZES,
  DEFAULT_OS_IMAGE,
  DEFAULT_REGION,
  DEFAULT_VM_SIZE,
  getVmSize,
} from "@/lib/terraform/catalog";
import type { DeploymentKind } from "@/lib/terraform/types";

const PORT_PRESETS = [
  { port: 22, label: "SSH (22)" },
  { port: 80, label: "HTTP (80)" },
  { port: 443, label: "HTTPS (443)" },
  { port: 3389, label: "RDP (3389)" },
  { port: 8080, label: "Alt HTTP (8080)" },
];

export default function NewDeploymentPage() {
  const router = useRouter();
  const [kind, setKind] = useState<DeploymentKind>("vm");
  const [name, setName] = useState("");
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [vmSize, setVmSize] = useState(DEFAULT_VM_SIZE);
  const [osImage, setOsImage] = useState(DEFAULT_OS_IMAGE);
  const [adminUsername, setAdminUsername] = useState("azureuser");
  const [publicIp, setPublicIp] = useState(true);
  const [ports, setPorts] = useState<number[]>([22, 443]);
  const [instanceCount, setInstanceCount] = useState(3);
  const [autoMin, setAutoMin] = useState(2);
  const [autoMax, setAutoMax] = useState(10);
  const [cpuThreshold, setCpuThreshold] = useState(70);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sizeInfo = getVmSize(vmSize);

  function togglePort(port: number) {
    setPorts((prev) =>
      prev.includes(port) ? prev.filter((p) => p !== port) : [...prev, port].sort((a, b) => a - b),
    );
  }

  async function submit() {
    setError(null);
    if (!name.trim()) {
      setError("Please give your deployment a name.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          region,
          kind,
          osImage,
          vmSize,
          adminUsername,
          instanceCount,
          autoscale: { min: autoMin, max: autoMax, cpuThreshold },
          network: { publicIp, allowedPorts: ports },
          tags: { env: "demo" },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create deployment.");
      router.push(`/deployments/${data.deployment.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-slate-200"
      >
        <ArrowLeft size={15} />
        Back to deployments
      </Link>

      <h1 className="text-2xl font-semibold text-white">New deployment</h1>
      <p className="mt-1 text-sm text-slate-400">
        Configure your compute. We&apos;ll generate the Terraform and show you a plan.
      </p>

      {/* Kind selector */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <KindCard
          active={kind === "vm"}
          onClick={() => setKind("vm")}
          icon={<Server size={20} />}
          title="Single VM"
          subtitle="One virtual machine with its own NIC & optional public IP."
        />
        <KindCard
          active={kind === "scaleset"}
          onClick={() => setKind("scaleset")}
          icon={<Boxes size={20} />}
          title="Scale Set"
          subtitle="Autoscaling fleet behind a load balancer."
        />
      </div>

      <div className="mt-6 space-y-6 rounded-xl border border-ink-700/70 bg-ink-800/50 p-6">
        <Field label="Name" hint="Used as the Terraform project prefix (rg-, vnet-, vm-…).">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. web-gateway"
            className="input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Region">
            <Select value={region} onChange={setRegion} options={REGIONS.map((r) => ({ value: r.key, label: r.label }))} />
          </Field>
          <Field label="OS image">
            <Select value={osImage} onChange={setOsImage} options={OS_IMAGES.map((o) => ({ value: o.key, label: o.label }))} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="VM size"
            hint={sizeInfo ? `${sizeInfo.vcpus} vCPU · ${sizeInfo.memoryGb} GB · ~$${sizeInfo.approxUsdPerMonth}/mo` : undefined}
          >
            <Select value={vmSize} onChange={setVmSize} options={VM_SIZES.map((s) => ({ value: s.key, label: s.label }))} />
          </Field>
          <Field label="Admin username">
            <input
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              className="input"
            />
          </Field>
        </div>

        {/* Scale-set-only fields */}
        {kind === "scaleset" && (
          <div className="rounded-lg border border-azure/20 bg-azure/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-azure-soft">
              <Boxes size={16} />
              Autoscale
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Initial instances">
                <NumberInput value={instanceCount} min={1} max={100} onChange={setInstanceCount} />
              </Field>
              <Field label="Min">
                <NumberInput value={autoMin} min={1} max={autoMax} onChange={setAutoMin} />
              </Field>
              <Field label="Max">
                <NumberInput value={autoMax} min={autoMin} max={1000} onChange={setAutoMax} />
              </Field>
            </div>
            <Field label={`Scale-out CPU threshold: ${cpuThreshold}%`}>
              <input
                type="range"
                min={10}
                max={95}
                value={cpuThreshold}
                onChange={(e) => setCpuThreshold(Number(e.target.value))}
                className="w-full accent-azure"
              />
            </Field>
          </div>
        )}

        {/* Networking */}
        <div>
          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={publicIp}
              onChange={(e) => setPublicIp(e.target.checked)}
              className="h-4 w-4 accent-azure"
            />
            <span className="text-sm text-slate-200">
              Public IP {kind === "scaleset" ? "(load balancer)" : ""}
            </span>
          </label>

          <div className="mt-4">
            <div className="mb-2 text-xs font-medium text-slate-400">Inbound ports (NSG rules)</div>
            <div className="flex flex-wrap gap-2">
              {PORT_PRESETS.map((p) => (
                <button
                  key={p.port}
                  type="button"
                  onClick={() => togglePort(p.port)}
                  className={
                    "rounded-lg px-3 py-1.5 text-xs font-medium ring-1 transition " +
                    (ports.includes(p.port)
                      ? "bg-azure/20 text-azure-soft ring-azure/40"
                      : "bg-ink-900/50 text-slate-400 ring-ink-700 hover:text-slate-200")
                  }
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/30">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-ink-700/60 pt-5">
          <Link href="/" className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:text-white">
            Cancel
          </Link>
          <button
            onClick={submit}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-azure px-5 py-2.5 text-sm font-medium text-white transition hover:bg-azure-deep disabled:opacity-60"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />}
            {submitting ? "Generating plan…" : "Generate plan"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          background: rgb(2 6 23 / 0.6);
          border: 1px solid rgb(30 41 59 / 0.8);
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          color: rgb(226 232 240);
          outline: none;
        }
        .input:focus {
          border-color: rgb(10 132 255 / 0.6);
          box-shadow: 0 0 0 3px rgb(10 132 255 / 0.15);
        }
      `}</style>
    </div>
  );
}

function KindCard({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "flex items-start gap-3 rounded-xl border p-4 text-left transition " +
        (active
          ? "border-azure/60 bg-azure/10"
          : "border-ink-700/70 bg-ink-800/40 hover:border-ink-600")
      }
    >
      <span
        className={
          "grid h-10 w-10 shrink-0 place-items-center rounded-lg ring-1 " +
          (active ? "bg-azure/20 text-azure-soft ring-azure/40" : "bg-ink-700/60 text-slate-400 ring-ink-600")
        }
      >
        {icon}
      </span>
      <span>
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="mt-0.5 block text-xs text-slate-400">{subtitle}</span>
      </span>
    </button>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-400">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-slate-500">{hint}</span>}
    </label>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="input">
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-ink-800">
          {o.label}
        </option>
      ))}
    </select>
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className="input"
    />
  );
}
