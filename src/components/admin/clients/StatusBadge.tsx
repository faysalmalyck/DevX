import type { ClientStatus } from "@/lib/validation/client";
export default function StatusBadge({ status }: { status: ClientStatus }) { return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-slate-500/10 text-slate-500"}`}>{status === "ACTIVE" ? "Active" : "Hidden"}</span>; }
