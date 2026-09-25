import { FlaskConical, Zap } from "lucide-react";

// Server component: reflects EXECUTOR_MODE so it's always honest about whether
// the app would hit real Azure.
export function ModeBadge() {
  const mode = (process.env.EXECUTOR_MODE ?? "mock").toLowerCase();
  const isReal = mode === "terraform";
  return (
    <span
      title={
        isReal
          ? "Real mode: applies run against Azure via the Terraform CLI."
          : "Mock mode: generates real Terraform and simulates plan/apply. No Azure calls, no cost."
      }
      className={
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 " +
        (isReal
          ? "bg-amber-500/15 text-amber-300 ring-amber-500/30"
          : "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30")
      }
    >
      {isReal ? <Zap size={13} /> : <FlaskConical size={13} />}
      {isReal ? "Live Azure" : "Mock mode"}
    </span>
  );
}
