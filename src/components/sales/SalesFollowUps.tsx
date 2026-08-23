"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarClock, Check, RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { getClientCsrfToken } from "@/lib/auth/client-csrf";

type FollowUp = {
  id: string;
  dueAt: string;
  note: string | null;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  completedAt: string | null;
  lead: { id: string; fullName: string; company: string | null; status: string };
  assignedAgent: { id: string; name: string };
};

type FollowUpResponse = {
  followUps: FollowUp[];
  pagination: { page: number; pageSize: number; total: number; pageCount: number };
  scope: "ALL" | "OWN";
};

const filters = [
  { value: "", label: "All open" },
  { value: "today", label: "Due today" },
  { value: "overdue", label: "Overdue" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
] as const;

function formatStatus(value: string) {
  return value.slice(0, 1) + value.slice(1).toLowerCase();
}

function dueLabel(dueAt: string, status: FollowUp["status"]) {
  if (status === "COMPLETED") return "Completed";
  if (status === "CANCELLED") return "Cancelled";
  const due = new Date(dueAt);
  const startToday = new Date();
  startToday.setHours(0, 0, 0, 0);
  return due < startToday ? "Overdue" : due.toLocaleString();
}

type SalesFollowUpsProps = {
  /** Base path for lead links when the component is embedded in another governed workspace. */
  detailBasePath?: string;
};

export default function SalesFollowUps({ detailBasePath = "/sales" }: SalesFollowUpsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const [data, setData] = useState<FollowUpResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/follow-ups${query ? `?${query}` : ""}`, {
        credentials: "same-origin",
        cache: "no-store",
        signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof payload?.error === "string" ? payload.error : "Unable to load follow-ups.");
      setData(payload as FollowUpResponse);
    } catch (loadError) {
      if (loadError instanceof DOMException && loadError.name === "AbortError") return;
      setError(loadError instanceof Error ? loadError.message : "Unable to load follow-ups.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const updateQuery = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (!Object.hasOwn(updates, "page")) next.delete("page");
    const serialized = next.toString();
    router.push(serialized ? `${pathname}?${serialized}` : pathname);
  };

  const updateFollowUp = async (followUpId: string, status: "COMPLETED" | "CANCELLED") => {
    setUpdatingId(followUpId);
    setError(null);
    try {
      let csrf = getClientCsrfToken();
      if (!csrf) {
        await fetch("/api/auth/csrf", { credentials: "same-origin" });
        csrf = getClientCsrfToken();
      }
      if (!csrf) throw new Error("Your session security token could not be created. Please try again.");
      const response = await fetch(`/api/admin/follow-ups/${followUpId}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        body: JSON.stringify({ status }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof payload?.error === "string" ? payload.error : "Unable to update follow-up.");
      await load();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update follow-up.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-lg border border-white/[0.08] bg-[#111a2d] p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200/70">{data?.scope === "OWN" ? "My priority queue" : "Team priority queue"}</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight">Follow-ups</h2>
          <p className="mt-1 text-sm text-slate-400">Finish important conversations on time.</p>
        </div>
        <button type="button" onClick={() => void load()} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.1] px-3 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/[0.06]" disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </section>

      <section className="flex flex-wrap gap-2 rounded-lg border border-white/[0.08] bg-[#111a2d] p-3">
        {filters.map((filter) => {
          const active = (searchParams.get("filter") ?? "") === filter.value;
          return <button key={filter.value || "all"} type="button" onClick={() => updateQuery({ filter: filter.value || null, status: null })} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${active ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-slate-400 hover:bg-white/[0.07] hover:text-white"}`}>{filter.label}</button>;
        })}
      </section>

      {error ? <p role="alert" className="rounded-lg border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}
      <section className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#111a2d]">
        {loading && !data ? <FollowUpSkeleton /> : null}
        {!loading && data?.followUps.length === 0 ? <EmptyFollowUps leadsPath={`${detailBasePath}/leads`} /> : null}
        {data?.followUps.length ? <ol className="divide-y divide-white/[0.06]">{data.followUps.map((followUp) => {
          const pending = followUp.status === "PENDING";
          const overdue = pending && new Date(followUp.dueAt) < new Date(new Date().setHours(0, 0, 0, 0));
          return <li key={followUp.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex min-w-0 gap-3"><span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${overdue ? "bg-rose-400/15 text-rose-200" : followUp.status === "COMPLETED" ? "bg-emerald-400/15 text-emerald-200" : "bg-cyan-400/15 text-cyan-200"}`}><CalendarClock className="h-5 w-5" /></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><Link href={`${detailBasePath}/leads/${followUp.lead.id}`} className="font-bold text-white hover:text-cyan-200">{followUp.lead.fullName}</Link><span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] ${overdue ? "bg-rose-400/10 text-rose-200" : followUp.status === "COMPLETED" ? "bg-emerald-400/10 text-emerald-200" : followUp.status === "CANCELLED" ? "bg-slate-400/10 text-slate-300" : "bg-cyan-400/10 text-cyan-200"}`}>{overdue ? "Overdue" : formatStatus(followUp.status)}</span></div><p className="mt-1 text-sm text-slate-400">{followUp.note || "No note added."}</p><p className="mt-1.5 text-xs text-slate-500">{followUp.lead.company || followUp.lead.status.replace(/_/g, " ")} · {data.scope === "ALL" ? `${followUp.assignedAgent.name} · ` : ""}{dueLabel(followUp.dueAt, followUp.status)}</p></div></div>{pending ? <div className="flex shrink-0 gap-2"><button type="button" onClick={() => void updateFollowUp(followUp.id, "COMPLETED")} disabled={updatingId === followUp.id} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-400/15 px-3 py-2 text-xs font-bold text-emerald-100 transition hover:bg-emerald-400/25 disabled:opacity-50"><Check className="h-3.5 w-3.5" /> Complete</button><button type="button" onClick={() => void updateFollowUp(followUp.id, "CANCELLED")} disabled={updatingId === followUp.id} aria-label={`Cancel follow-up for ${followUp.lead.fullName}`} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-200 disabled:opacity-50"><X className="h-4 w-4" /></button></div> : null}</li>;
        })}</ol> : null}
        {data ? <div className="flex flex-col gap-3 border-t border-white/[0.08] px-5 py-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between"><p>{data.pagination.total.toLocaleString()} follow-up{data.pagination.total === 1 ? "" : "s"}</p><div className="flex items-center gap-2"><button type="button" disabled={data.pagination.page <= 1} onClick={() => updateQuery({ page: String(data.pagination.page - 1) })} className="rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs font-bold disabled:opacity-40">Previous</button><span className="text-xs">Page {data.pagination.page} of {data.pagination.pageCount}</span><button type="button" disabled={data.pagination.page >= data.pagination.pageCount} onClick={() => updateQuery({ page: String(data.pagination.page + 1) })} className="rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs font-bold disabled:opacity-40">Next</button></div></div> : null}
      </section>
    </div>
  );
}

function EmptyFollowUps({ leadsPath }: { leadsPath: string }) {
  return <div className="p-10 text-center"><CalendarClock className="mx-auto h-7 w-7 text-slate-500" /><p className="mt-3 text-base font-bold">No follow-ups here yet.</p><p className="mt-1 text-sm text-slate-500">New follow-ups will appear when they are scheduled on a lead.</p><Link href={leadsPath} className="mt-4 inline-flex text-sm font-bold text-cyan-200 hover:text-white">Open leads</Link></div>;
}

function FollowUpSkeleton() {
  return <div className="divide-y divide-white/[0.06]">{Array.from({ length: 6 }, (_, index) => <div key={index} className="p-5"><div className="h-14 animate-pulse rounded-lg bg-white/[0.05]" /></div>)}</div>;
}
