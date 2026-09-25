import type { Metadata } from "next";
import Link from "next/link";
import { Cloud, Plus } from "lucide-react";
import "./globals.css";
import { ModeBadge } from "@/components/ModeBadge";

export const metadata: Metadata = {
  title: "VM Launcher — azure-creator",
  description: "Provision Azure VMs & Scale Sets via Terraform, with a nice UI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <header className="sticky top-0 z-10 border-b border-ink-700/70 bg-ink-900/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-azure/15 text-azure ring-1 ring-azure/30">
                <Cloud size={20} />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-white">VM Launcher</div>
                <div className="text-[11px] text-slate-400">azure-creator</div>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <ModeBadge />
              <Link
                href="/new"
                className="inline-flex items-center gap-1.5 rounded-lg bg-azure px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-azure-deep"
              >
                <Plus size={16} />
                New deployment
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
        <footer className="mx-auto max-w-6xl px-5 pb-10 pt-4 text-center text-xs text-slate-500">
          Mock-first · generates real Terraform · credentials-ready for live Azure deploys
        </footer>
      </body>
    </html>
  );
}
