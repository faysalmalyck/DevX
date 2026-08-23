"use client";

import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type PipelineStage = { status: string; count: number; value: string; percentage: number };
type PipelineResponse = { pipeline: PipelineStage[]; range: { from: string; to: string } };

function label(value: string) {
  return value.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function money(value: string) {
  const number = Number(value);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number.isFinite(number) ? number : 0);
}

export default function SalesPipeline() {
  const [data, setData] = useState<PipelineResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/sales/dashboard?preset=month", { credentials: "same-origin", cache: "no-store", signal });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof payload?.error === "string" ? payload.error : "Unable to load pipeline.");
      setData(payload as PipelineResponse);
    } catch (loadError) {
      if (loadError instanceof DOMException && loadError.name === "AbortError") return;
      setError(loadError instanceof Error ? loadError.message : "Unable to load pipeline.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const stages = data?.pipeline.filter((stage) => stage.status !== "DUPLICATE") ?? [];
  return <div className="space-y-6"><section className="flex flex-col gap-4 rounded-lg border border-white/[0.08] bg-[#111a2d] p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200/70">This month</p><h2 className="mt-1 text-2xl font-black tracking-tight">Pipeline</h2><p className="mt-1 text-sm text-slate-400">Open a stage to work the leads currently in it.</p></div><button type="button" onClick={() => void load()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.1] px-3 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-white/[0.06] disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button></section>{error ? <p role="alert" className="rounded-lg border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}<section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{loading && !data ? Array.from({ length: 7 }, (_, index) => <div key={index} className="h-48 animate-pulse rounded-lg border border-white/[0.08] bg-white/[0.04]" />) : stages.map((stage) => <Link key={stage.status} href={`/sales/leads?status=${encodeURIComponent(stage.status)}`} className="group rounded-lg border border-white/[0.08] bg-[#111a2d] p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/[0.04]"><div className="flex items-start justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-400">{label(stage.status)}</p><ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-cyan-200" /></div><p className="mt-6 text-4xl font-black">{stage.count}</p><p className="mt-2 text-sm font-bold text-emerald-200">{money(stage.value)}</p><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.08]"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-brand" style={{ width: `${stage.percentage}%` }} /></div><p className="mt-2 text-xs text-slate-500">{stage.percentage}% of leads created this month</p></Link>)}</section>{data ? <p className="text-right text-xs text-slate-500">{new Date(data.range.from).toLocaleDateString()} – {new Date(data.range.to).toLocaleDateString()}</p> : null}</div>;
}
