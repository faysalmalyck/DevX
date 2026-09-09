"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus, RefreshCw, Search, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";

import { getClientCsrfToken } from "@/lib/auth/client-csrf";

type Lead = {
  id: string;
  fullName: string;
  email: string;
  company: string | null;
  estimatedValue: string | null;
  status: string;
  source: string;
  assignedAgent: { id: string; name: string; agentCode: string | null } | null;
  nextFollowUp: { id: string; dueAt: string } | null;
  createdAt: string;
};

type LeadResponse = {
  leads: Lead[];
  pagination: { page: number; pageSize: number; total: number; pageCount: number };
  scope: "ALL" | "OWN";
};

const statuses = ["", "NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "NEGOTIATION", "WON", "LOST", "DUPLICATE"];
const sources = ["", "AGENT_REFERRAL", "AGENT_MANUAL", "WEBSITE_CONTACT", "WEBSITE_CONSULTATION", "WEBSITE_PRICING", "WHATSAPP", "IMPORTED", "OTHER"];

function label(value: string) {
  return value ? value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "All";
}

function money(value: string | null) {
  if (!value) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(value));
}

function statusClass(status: string) {
  if (status === "WON") return "bg-emerald-400/10 text-emerald-200 ring-emerald-300/20";
  if (status === "LOST" || status === "DUPLICATE") return "bg-rose-400/10 text-rose-200 ring-rose-300/20";
  if (status === "NEW") return "bg-sky-400/10 text-sky-200 ring-sky-300/20";
  return "bg-violet-400/10 text-violet-200 ring-violet-300/20";
}

type SalesLeadsProps = {
  /** Base path for links to lead details. The data API stays shared and scoped on the server. */
  detailBasePath?: string;
};

export default function SalesLeads({ detailBasePath = "/sales" }: SalesLeadsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const [data, setData] = useState<LeadResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/leads${query ? `?${query}` : ""}`, {
        credentials: "same-origin",
        cache: "no-store",
        signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof payload?.error === "string" ? payload.error : "Unable to load leads.");
      setData(payload as LeadResponse);
    } catch (loadError) {
      if (loadError instanceof DOMException && loadError.name === "AbortError") return;
      setError(loadError instanceof Error ? loadError.message : "Unable to load leads.");
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

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    updateQuery({ q: search.trim() || null });
  };

  return (
    <div className="space-y-6">
      <section className="cart-skin-box flex flex-col gap-4 rounded-xl p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand dark:text-cyan-200/70">{data?.scope === "OWN" ? "My assigned work" : "Sales pipeline"}</p><h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">Leads</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Search, prioritize, and open the next conversation.</p></div>
        <button type="button" onClick={() => setShowCreate(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:brightness-110"><Plus className="h-4 w-4" /> Add lead</button>
      </section>

      <section className="cart-skin-box rounded-xl p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <form onSubmit={submitSearch} className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, or company" className="consultation-input pl-10" /><button type="submit" className="sr-only">Search</button></form>
          <label className="sr-only" htmlFor="lead-status">Lead status</label><select id="lead-status" value={searchParams.get("status") ?? ""} onChange={(event) => updateQuery({ status: event.target.value || null })} className="consultation-select text-sm py-2.5 px-4">{statuses.map((status) => <option key={status} value={status}>{status ? label(status) : "All statuses"}</option>)}</select>
          <label className="sr-only" htmlFor="lead-source">Lead source</label><select id="lead-source" value={searchParams.get("source") ?? ""} onChange={(event) => updateQuery({ source: event.target.value || null })} className="consultation-select text-sm py-2.5 px-4">{sources.map((source) => <option key={source} value={source}>{source ? label(source) : "All sources"}</option>)}</select>
          <button type="button" onClick={() => void load()} className="consultation-secondary-btn px-3 py-2.5 text-sm" aria-label="Refresh leads"><RefreshCw className="h-4 w-4" /></button>
        </div>
      </section>

      {error && !data ? <div className="rounded-lg border border-rose-300/20 bg-rose-500/10 p-5 text-sm text-rose-100">{error}</div> : null}
      <section className="cart-skin-box overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-100/80 text-xs uppercase tracking-[0.12em] text-slate-500 dark:border-slate-700/60 dark:bg-[#181d2b]/80"><tr><th className="px-5 py-3 font-bold">Lead</th><th className="px-5 py-3 font-bold">Status</th><th className="px-5 py-3 font-bold">Owner</th><th className="px-5 py-3 font-bold">Value</th><th className="px-5 py-3 font-bold">Next follow-up</th><th className="px-5 py-3 font-bold">Created</th></tr></thead><tbody className="divide-y divide-slate-200 dark:divide-slate-700/40">{loading && !data ? <TableSkeleton /> : data?.leads.map((lead) => <tr key={lead.id} className="transition hover:bg-slate-100/50 dark:hover:bg-slate-800/40"><td className="px-5 py-4"><Link href={`${detailBasePath}/leads/${lead.id}`} className="block font-bold text-slate-900 hover:text-brand dark:text-white dark:hover:text-cyan-200">{lead.fullName}</Link><p className="mt-0.5 text-xs text-slate-500">{lead.company || lead.email} · {label(lead.source)}</p></td><td className="px-5 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusClass(lead.status)}`}>{label(lead.status)}</span></td><td className="px-5 py-4 text-slate-700 dark:text-slate-300">{lead.assignedAgent?.name ?? <span className="text-amber-600 dark:text-amber-200">Unassigned</span>}</td><td className="px-5 py-4 font-semibold text-emerald-600 dark:text-emerald-100">{money(lead.estimatedValue)}</td><td className="px-5 py-4 text-slate-500 dark:text-slate-400">{lead.nextFollowUp ? new Date(lead.nextFollowUp.dueAt).toLocaleString() : "—"}</td><td className="px-5 py-4 text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table>
        </div>
        {!loading && data?.leads.length === 0 ? <div className="p-10 text-center"><p className="text-base font-bold text-slate-900 dark:text-white">No leads match these filters.</p><p className="mt-1 text-sm text-slate-500">Try clearing a filter or add your first manual lead.</p></div> : null}
        {data ? <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-500 dark:border-slate-700/60 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between"><p>{data.pagination.total.toLocaleString()} lead{data.pagination.total === 1 ? "" : "s"}</p><div className="flex items-center gap-2"><button type="button" disabled={data.pagination.page <= 1} onClick={() => updateQuery({ page: String(data.pagination.page - 1) })} className="consultation-secondary-btn px-3 py-1 text-xs">Previous</button><span className="text-xs">Page {data.pagination.page} of {data.pagination.pageCount}</span><button type="button" disabled={data.pagination.page >= data.pagination.pageCount} onClick={() => updateQuery({ page: String(data.pagination.page + 1) })} className="consultation-secondary-btn px-3 py-1 text-xs">Next</button></div></div> : null}
      </section>
      {showCreate ? <CreateLeadDialog onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); void load(); }} /> : null}
    </div>
  );
}

function TableSkeleton() {
  return <>{Array.from({ length: 6 }, (_, index) => <tr key={index}><td colSpan={6} className="px-5 py-5"><div className="h-5 animate-pulse rounded bg-slate-200 dark:bg-white/[0.06]" /></td></tr>)}</>;
}

function CreateLeadDialog({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      setSubmitting(true);
      setError(null);
      const res = await fetch("/api/sales/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form.entries())) });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Failed to create lead.");
      }
      onCreated();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to create lead.");
    } finally {
      setSubmitting(false);
    }
  };

  return <div className="fixed inset-0 z-[110] grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm" role="presentation"><div role="dialog" aria-modal="true" aria-labelledby="new-lead-title" className="cart-skin-box w-full max-w-xl rounded-2xl p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><h2 id="new-lead-title" className="text-xl font-black text-slate-900 dark:text-white">Add a manual lead</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your lead is assigned securely on the server.</p></div><button type="button" onClick={onClose} disabled={submitting} aria-label="Close" className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.08]"><X className="h-5 w-5" /></button></div><form onSubmit={submit} className="mt-5 space-y-4"><div className="grid gap-4 sm:grid-cols-2"><Field label="Full name" name="fullName" required /><Field label="Email" name="email" type="email" required /><Field label="Phone" name="phone" /><Field label="Company" name="company" /><Field label="Estimated value (USD)" name="estimatedValue" type="number" min="0" step="0.01" /></div><label className="block text-sm font-semibold">Notes<textarea name="message" rows={4} className="mt-1.5 consultation-textarea" /></label>{error ? <p role="alert" className="text-sm font-medium text-rose-600 dark:text-rose-200">{error}</p> : null}<div className="flex justify-end gap-3"><button type="button" onClick={onClose} disabled={submitting} className="consultation-secondary-btn px-5 py-2 text-sm">Cancel</button><button type="submit" disabled={submitting} className="consultation-primary-btn px-6 py-2 text-sm">{submitting ? "Creating…" : "Create lead"}</button></div></form></div></div>;
}

function Field({ label, name, type = "text", required = false, min, step }: { label: string; name: string; type?: string; required?: boolean; min?: string; step?: string }) {
  return <label className="block text-sm font-semibold text-slate-900 dark:text-white">{label}<input name={name} type={type} required={required} min={min} step={step} className="mt-1.5 consultation-input" /></label>;
}
