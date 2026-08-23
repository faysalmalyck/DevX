"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, BarChart3, CalendarClock, RefreshCw, TrendingUp, UsersRound } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type DashboardData = {
  range: { from: string; to: string; preset: string };
  summary: {
    totalLeads: number;
    newLeads: number;
    pipelineValue: string;
    wonValue: string;
    conversionRate: number;
    followUpsDueToday: number;
    overdueFollowUps: number;
  };
  pipeline: Array<{ status: string; count: number; value: string; percentage: number }>;
  trend: Array<{ date: string; created: number; won: number; wonValue: string }>;
  recentActivities: Array<{
    id: string;
    type: string;
    note: string | null;
    createdAt: string;
    lead: { id: string; fullName: string };
    actor: { id: string; name: string } | null;
  }>;
  unassignedLeads?: number;
  agentPerformance?: Array<{
    agentId: string;
    agentName: string;
    agentCode: string | null;
    leads: number;
    estimatedValue: string;
  }>;
};

type SalesDashboardProps = {
  /** The workspace base used for lead drill-downs. */
  basePath?: string;
  /** Follow-ups currently share the existing Sales workspace route. */
  followUpsBasePath?: string;
};

const presets = [
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "quarter", label: "This quarter" },
] as const;

function money(value: string) {
  const numeric = Number(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(numeric) ? numeric : 0);
}

function statusLabel(status: string) {
  return status.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function activityLabel(type: string) {
  return type.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function SalesDashboard({
  basePath = "/sales",
  followUpsBasePath = basePath,
}: SalesDashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const preset = searchParams.get("preset") ?? "month";
  const view = searchParams.get("view") === "team" ? "team" : "my";
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"pipeline" | "trend">("pipeline");
  const query = searchParams.toString();
  const leadsPath = `${basePath}/leads`;
  const followUpsPath = `${followUpsBasePath}/follow-ups`;

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/sales/dashboard${query ? `?${query}` : ""}`, {
        credentials: "same-origin",
        cache: "no-store",
        signal,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(typeof payload?.error === "string" ? payload.error : "Unable to load your sales overview.");
      }
      setData(payload as DashboardData);
    } catch (loadError) {
      if (loadError instanceof DOMException && loadError.name === "AbortError") return;
      setError(loadError instanceof Error ? loadError.message : "Unable to load your sales overview.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const maxTrend = useMemo(
    () => Math.max(1, ...(data?.trend.map((point) => Math.max(point.created, point.won)) ?? [0])),
    [data]
  );

  const setPreset = (nextPreset: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("preset", nextPreset);
    next.delete("from");
    next.delete("to");
    router.push(`${pathname}?${next.toString()}`);
  };

  const setView = (nextView: "my" | "team") => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("view", nextView);
    router.push(`${pathname}?${next.toString()}`);
  };

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  if (error && !data) {
    return (
      <section className="rounded-lg border border-rose-400/20 bg-rose-500/10 p-7 text-center">
        <AlertCircle className="mx-auto h-7 w-7 text-rose-300" />
        <h2 className="mt-3 text-lg font-bold">Sales overview unavailable</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-300">{error}</p>
        <button type="button" onClick={() => void load()} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-slate-900"><RefreshCw className="h-4 w-4" /> Retry</button>
      </section>
    );
  }

  if (!data) return null;

  const kpis = [
    { label: "Total Leads", value: data.summary.totalLeads.toLocaleString(), href: leadsPath, tone: "from-blue-500/20 to-cyan-500/10" },
    { label: "New Leads", value: data.summary.newLeads.toLocaleString(), href: `${leadsPath}?status=NEW`, tone: "from-indigo-500/20 to-violet-500/10" },
    { label: "Pipeline Value", value: money(data.summary.pipelineValue), href: `${leadsPath}?status=QUALIFIED`, tone: "from-amber-500/20 to-orange-500/10" },
    { label: "Won Value", value: money(data.summary.wonValue), href: `${leadsPath}?status=WON`, tone: "from-emerald-500/20 to-teal-500/10" },
    { label: "Conversion Rate", value: `${data.summary.conversionRate}%`, href: `${leadsPath}?status=WON`, tone: "from-fuchsia-500/20 to-pink-500/10" },
    { label: "Due Today", value: data.summary.followUpsDueToday.toLocaleString(), href: `${followUpsPath}?filter=today`, tone: "from-sky-500/20 to-blue-500/10" },
    { label: "Overdue", value: data.summary.overdueFollowUps.toLocaleString(), href: `${followUpsPath}?filter=overdue`, tone: "from-rose-500/20 to-red-500/10" },
  ];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#111a2d] shadow-2xl shadow-slate-950/20">
        <div className="border-b border-white/[0.08] p-5 sm:p-6 lg:flex lg:items-start lg:justify-between lg:gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200/75">Pipeline intelligence</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">Your complete sales picture</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Track movement across the pipeline, understand performance, and act on the next conversation without leaving your workspace.</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 lg:mt-0" aria-label="Dashboard date range">
            {presets.map((item) => (
              <button key={item.key} type="button" onClick={() => setPreset(item.key)} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${preset === item.key ? "bg-brand text-white shadow-lg shadow-brand/25" : "bg-white/[0.06] text-slate-300 hover:bg-white/[0.1]"}`}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-3 inline-flex rounded-lg border border-white/[0.08] bg-black/10 p-1" role="group" aria-label="Sales work scope">
            <button type="button" onClick={() => setView("my")} aria-pressed={view === "my"} className={`rounded-md px-3 py-1.5 text-xs font-bold ${view === "my" ? "bg-white text-slate-950" : "text-slate-400"}`}>My Work</button>
            <button type="button" onClick={() => setView("team")} aria-pressed={view === "team"} className={`rounded-md px-3 py-1.5 text-xs font-bold ${view === "team" ? "bg-white text-slate-950" : "text-slate-400"}`}>Team Overview</button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="inline-flex rounded-lg border border-white/[0.08] bg-black/10 p-1" role="group" aria-label="Overview visual mode">
              <button type="button" onClick={() => setMode("pipeline")} aria-pressed={mode === "pipeline"} className={`rounded-md px-3 py-1.5 text-xs font-bold ${mode === "pipeline" ? "bg-white text-slate-950" : "text-slate-400"}`}>Pipeline</button>
              <button type="button" onClick={() => setMode("trend")} aria-pressed={mode === "trend"} className={`rounded-md px-3 py-1.5 text-xs font-bold ${mode === "trend" ? "bg-white text-slate-950" : "text-slate-400"}`}>Trend</button>
            </div>
            <p className="text-xs text-slate-500">{new Date(data.range.from).toLocaleDateString()} – {new Date(data.range.to).toLocaleDateString()}</p>
          </div>

          {mode === "pipeline" ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {data.pipeline.filter((stage) => stage.status !== "DUPLICATE").map((stage) => (
                <button
                  key={stage.status}
                  type="button"
                  onClick={() => router.push(`${leadsPath}?status=${encodeURIComponent(stage.status)}`)}
                  className="group rounded-lg border border-white/[0.08] bg-white/[0.035] p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-cyan-300"
                  aria-label={`View ${stage.count} ${statusLabel(stage.status)} leads`}
                >
                  <div className="flex items-start justify-between gap-3"><span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{statusLabel(stage.status)}</span><ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-cyan-200" /></div>
                  <p className="mt-5 text-3xl font-black">{stage.count}</p>
                  <p className="mt-1 text-sm font-semibold text-cyan-100">{money(stage.value)}</p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.08]"><div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-brand" style={{ width: `${stage.percentage}%` }} /></div>
                  <p className="mt-2 text-xs text-slate-500">{stage.percentage}% of selected leads</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto pb-1">
              <div className="flex min-h-64 min-w-[36rem] items-end gap-2" aria-label="Lead creation and won trend">
                {data.trend.map((point) => (
                  <button key={point.date} type="button" onClick={() => router.push(`${leadsPath}?from=${point.date}&to=${point.date}`)} className="group flex min-w-0 flex-1 flex-col items-center gap-2 text-center focus-visible:outline-2 focus-visible:outline-cyan-300" aria-label={`View leads from ${point.date}: ${point.created} created and ${point.won} won`}>
                    <div className="flex h-48 w-full items-end gap-1 rounded-t-md bg-white/[0.025] px-1.5 pt-2 transition group-hover:bg-white/[0.07]">
                      <div className="w-1/2 rounded-t bg-cyan-300/80" style={{ height: `${Math.max(4, (point.created / maxTrend) * 100)}%` }} title={`${point.created} created`} />
                      <div className="w-1/2 rounded-t bg-emerald-400/90" style={{ height: `${Math.max(4, (point.won / maxTrend) * 100)}%` }} title={`${point.won} won`} />
                    </div>
                    <span className="text-[10px] font-medium text-slate-500">{new Date(`${point.date}T00:00:00Z`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-400"><span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-cyan-300" /> Created</span><span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-400" /> Won</span></div>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href={kpi.href} className={`group rounded-lg border border-white/[0.08] bg-gradient-to-br ${kpi.tone} p-4 transition hover:-translate-y-0.5 hover:border-white/20`}>
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{kpi.label}</span>
            <p className="mt-2 text-2xl font-black tracking-tight">{kpi.value}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-cyan-100">Open list <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" /></span>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-lg border border-white/[0.08] bg-[#111a2d] p-5 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Live context</p><h2 className="mt-1 text-lg font-bold">Recent lead activity</h2></div><Link href={leadsPath} className="text-xs font-bold text-cyan-200 hover:text-white">All leads</Link></div>
          {data.recentActivities.length > 0 ? <ol className="mt-5 divide-y divide-white/[0.06]">{data.recentActivities.map((activity) => <li key={activity.id} className="flex gap-3 py-3 first:pt-0"><span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[10px] font-black text-cyan-200">{activity.type[0]}</span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{activityLabel(activity.type)} <Link href={`${leadsPath}/${activity.lead.id}`} className="text-cyan-200 hover:underline">{activity.lead.fullName}</Link></p><p className="mt-0.5 text-xs text-slate-500">{activity.actor?.name ?? "System"} · {new Date(activity.createdAt).toLocaleString()}</p>{activity.note ? <p className="mt-1 text-sm text-slate-400">{activity.note}</p> : null}</div></li>)}</ol> : <EmptyActivity />}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-white/[0.08] bg-[#111a2d] p-5"><CalendarClock className="h-5 w-5 text-cyan-200" /><h2 className="mt-3 text-lg font-bold">Stay ahead of follow-ups</h2><p className="mt-2 text-sm leading-6 text-slate-400">{data.summary.overdueFollowUps > 0 ? `${data.summary.overdueFollowUps} follow-up${data.summary.overdueFollowUps === 1 ? " is" : "s are"} overdue.` : "No overdue follow-ups right now."}</p><Link href={followUpsPath} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-cyan-200 hover:text-white">Review follow-ups <ArrowRight className="h-4 w-4" /></Link></div>
          {data.agentPerformance ? <div className="rounded-lg border border-white/[0.08] bg-[#111a2d] p-5"><div className="flex items-start justify-between gap-3"><div><UsersRound className="h-5 w-5 text-violet-300" /><h2 className="mt-3 text-lg font-bold">Agent performance</h2></div>{typeof data.unassignedLeads === "number" ? <Link href={`${leadsPath}?assigned=unassigned`} className="rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-bold text-amber-200">{data.unassignedLeads} unassigned</Link> : null}</div>{data.agentPerformance.length > 0 ? <div className="mt-4 space-y-3">{data.agentPerformance.slice(0, 4).map((agent) => <div key={agent.agentId} className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-semibold">{agent.agentName}</p><p className="text-xs text-slate-500">{agent.leads} leads</p></div><p className="text-sm font-bold text-emerald-200">{money(agent.estimatedValue)}</p></div>)}</div> : <p className="mt-4 text-sm text-slate-500">No assigned leads in this range.</p>}</div> : null}
        </div>
      </section>
      {error ? <p role="status" className="text-center text-xs text-amber-200">Showing the most recently loaded dashboard. {error}</p> : null}
    </div>
  );
}

function EmptyActivity() {
  return <div className="mt-5 rounded-lg border border-dashed border-white/[0.12] p-5 text-center"><TrendingUp className="mx-auto h-5 w-5 text-slate-500" /><p className="mt-2 text-sm font-semibold text-slate-300">No lead activity yet</p><p className="mt-1 text-xs text-slate-500">New lead captures and follow-ups will appear here.</p></div>;
}

function DashboardSkeleton() {
  return <div className="space-y-6" aria-label="Loading sales overview"><div className="h-96 animate-pulse rounded-lg border border-white/[0.08] bg-white/[0.04]" /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 7 }, (_, index) => <div key={index} className="h-28 animate-pulse rounded-lg border border-white/[0.08] bg-white/[0.04]" />)}</div></div>;
}
