"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  RefreshCw,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useSession } from "@/contexts/SessionContext";

interface DashboardStats {
  totalUsers: number;
  totalClients: number;
  totalAdmins: number;
  supportTicketsCount: number;
  serviceRequestsCount: number;
}

interface ActivityItem {
  id: string;
  action: string;
  description: string;
  time: string;
}

interface DashboardResponse {
  stats?: DashboardStats;
  recentActivity?: ActivityItem[];
  error?: string;
}

function actionAppearance(action: string) {
  const normalized = action.toUpperCase();

  if (normalized.includes("CREATE") || normalized.includes("INVITE")) {
    return { icon: UserPlus, tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300" };
  }
  if (normalized.includes("DELETE") || normalized.includes("REVOKE")) {
    return { icon: AlertCircle, tone: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300" };
  }
  if (normalized.includes("PUBLISH") || normalized.includes("APPROVE")) {
    return { icon: CheckCircle2, tone: "bg-blue-50 text-brand dark:bg-brand/10 dark:text-brand" };
  }

  return { icon: Activity, tone: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300" };
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 pb-8 animate-pulse">
      <div className="h-64 rounded-[28px] border border-slate-200 bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.04]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => <div key={item} className="h-40 rounded-2xl border border-slate-200 bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.04]" />)}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <div className="h-[420px] rounded-3xl border border-slate-200 bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.04]" />
        <div className="h-[420px] rounded-3xl border border-slate-200 bg-white/80 dark:border-white/[0.08] dark:bg-white/[0.04]" />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("Welcome back");

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
      const payload = await response.json().catch(() => null) as DashboardResponse | null;

      if (!response.ok || !payload?.stats) {
        throw new Error(payload?.error || "We could not load the workspace snapshot.");
      }

      setStats(payload.stats);
      setActivities(Array.isArray(payload.recentActivity) ? payload.recentActivity : []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not load the workspace snapshot.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    void loadDashboardData();
  }, [loadDashboardData]);

  if (loading) return <DashboardSkeleton />;

  if (error || !stats) {
    return (
      <div className="flex min-h-[420px] items-center justify-center pb-8">
        <div className="max-w-md rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] dark:border-rose-500/20 dark:bg-[#111827]">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"><AlertCircle className="h-6 w-6" /></span>
          <h2 className="mt-5 text-xl font-black tracking-tight text-slate-900 dark:text-white">Dashboard unavailable</h2>
          <p className="mt-2 text-base leading-6 text-slate-500 dark:text-slate-400">{error || "We could not load the workspace snapshot."}</p>
          <button type="button" onClick={() => void loadDashboardData()} className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-base font-bold text-white transition hover:bg-brand">
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
        </div>
      </div>
    );
  }

  const metricCards = [
    { label: "People records", value: stats.totalUsers, detail: "Registered platform users", icon: Users, tone: "from-brand to-cyan-400", surface: "bg-blue-50 text-brand dark:bg-brand/10 dark:text-brand" },
    { label: "Client accounts", value: stats.totalClients, detail: "Active client records", icon: Building2, tone: "from-violet-500 to-fuchsia-400", surface: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300" },
    { label: "Operators", value: stats.totalAdmins, detail: "Admin workspace access", icon: ShieldCheck, tone: "from-emerald-500 to-teal-400", surface: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300" },
    { label: "Support queue", value: stats.supportTicketsCount, detail: `${stats.serviceRequestsCount.toLocaleString()} service requests`, icon: ClipboardList, tone: "from-amber-500 to-orange-400", surface: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300" },
  ];

  const quickActions = [
    { label: "Manage team", description: "Profiles and public publishing", href: "/admin/team", icon: Users, tone: "text-brand dark:text-brand" },
    { label: "Review applications", description: "Candidate submissions", href: "/admin/applications", icon: FileText, tone: "text-violet-600 dark:text-violet-300" },
    { label: "Manage careers", description: "Roles, drafts, and listings", href: "/admin/careers", icon: BriefcaseBusiness, tone: "text-emerald-600 dark:text-emerald-300" },
    { label: "Access controls", description: "Administrators and roles", href: "/admin/administration/admins", icon: ShieldCheck, tone: "text-amber-600 dark:text-amber-300" },
  ];

  return (
    <div className="space-y-6 pb-8">
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white px-6 py-7 shadow-[0_20px_60px_rgba(15,23,42,0.07)] dark:border-white/[0.08] dark:bg-[#111827] sm:px-8 sm:py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(54,88,255,0.18),transparent_32%),radial-gradient(circle_at_90%_0%,rgba(139,92,246,0.15),transparent_28%)]" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand dark:border-blue-400/20 dark:bg-brand/10 dark:text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" /> Live workspace
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">{greeting}, {user?.firstName || "operator"}.</h2>
            <p className="mt-3 max-w-xl text-base leading-6 text-slate-600 dark:text-slate-400 sm:text-base">Your operational snapshot brings team, client, access, and support activity into one focused workspace.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => void loadDashboardData()} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-base font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/[0.1] dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.1]">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <Link href="/admin/team" className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-4 text-base font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand">
              <UserPlus className="h-4 w-4" /> Team directory
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 py-0 sm:grid-cols-2 xl:grid-cols-4" aria-label="Workspace metrics">
        {metricCards.map(({ label, value, detail, icon: Icon, tone, surface }) => (
          <article key={label} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-white/[0.08] dark:bg-[#111827]">
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone}`} />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">{value.toLocaleString()}</p>
              </div>
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${surface}`}><Icon className="h-5 w-5" /></span>
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400 dark:text-slate-500">{detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 py-0 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#111827]">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 dark:border-white/[0.06] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"><Clock3 className="h-4 w-4" /></span>
                <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Recent activity</h2>
              </div>
              <p className="mt-1 text-base text-slate-500 dark:text-slate-400">The latest changes recorded in your workspace.</p>
            </div>
            <Link href="/admin/administration/activity" className="inline-flex items-center gap-1 text-base font-bold text-brand transition hover:text-brand dark:text-brand dark:hover:text-brand">
              View log <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="p-6">
            {activities.length > 0 ? (
              <ol className="space-y-5">
                {activities.slice(0, 5).map((item) => {
                  const { icon: Icon, tone } = actionAppearance(item.action);
                  return (
                    <li key={item.id} className="flex gap-4">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon className="h-4.5 w-4.5" /></span>
                      <div className="min-w-0 flex-1 border-b border-slate-100 pb-5 last:border-0 last:pb-0 dark:border-white/[0.06]">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-base font-bold leading-5 text-slate-800 dark:text-slate-100">{item.description}</p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">{item.action.replace(/_/g, " ")}</p>
                          </div>
                          <time className="shrink-0 text-xs font-medium text-slate-400 dark:text-slate-500">{item.time}</time>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="flex min-h-60 flex-col items-center justify-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/[0.06] dark:text-slate-500"><Activity className="h-5 w-5" /></span>
                <p className="mt-4 text-base font-bold text-slate-700 dark:text-white">No activity yet</p>
                <p className="mt-1 max-w-xs text-base text-slate-500 dark:text-slate-400">New workspace actions will appear here as your team starts working.</p>
              </div>
            )}
          </div>
        </article>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111827] sm:p-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-brand dark:bg-brand/10 dark:text-brand"><ClipboardList className="h-4 w-4" /></span>
            <div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">Quick actions</h2>
              <p className="text-base text-slate-500 dark:text-slate-400">Jump straight into daily work.</p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {quickActions.map(({ label, description, href, icon: Icon, tone }) => (
              <Link key={href} href={href} className="group flex items-center gap-3 rounded-2xl border border-slate-100 p-3 transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-white/[0.06] dark:hover:border-blue-400/20 dark:hover:bg-brand/[0.06]">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/[0.06] ${tone}`}><Icon className="h-4.5 w-4.5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold text-slate-800 dark:text-slate-100">{label}</span>
                  <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">{description}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-white transition group-hover:translate-x-0.5 group-hover:text-brand dark:text-slate-600" />
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="grid gap-4 py-0 md:grid-cols-2">
        <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#111827]">
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-brand/10 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-brand dark:bg-brand/10 dark:text-brand"><ShieldCheck className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold text-slate-900 dark:text-white">Access management</p>
              <p className="mt-1 text-base leading-6 text-slate-500 dark:text-slate-400"><span className="font-bold text-slate-800 dark:text-white">{stats.totalAdmins.toLocaleString()}</span> operators currently have administrative workspace access.</p>
              <Link href="/admin/administration/admins" className="mt-4 inline-flex items-center gap-1 text-base font-bold text-brand hover:text-brand dark:text-brand dark:hover:text-brand">Review access <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </article>
        <article className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#111827]">
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300"><ClipboardList className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-base font-bold text-slate-900 dark:text-white">Service desk</p>
              <p className="mt-1 text-base leading-6 text-slate-500 dark:text-slate-400"><span className="font-bold text-slate-800 dark:text-white">{stats.supportTicketsCount.toLocaleString()}</span> tickets and <span className="font-bold text-slate-800 dark:text-white">{stats.serviceRequestsCount.toLocaleString()}</span> service requests are in the current snapshot.</p>
              <p className="mt-4 text-base font-bold text-amber-600 dark:text-amber-300">Queue counts refresh with your workspace snapshot.</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
