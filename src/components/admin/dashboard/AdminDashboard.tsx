"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  ClipboardList,
  UserPlus,
  Users,
  Shield,
  MessageSquare,
  ArrowUpRight,
  Activity,
  UserCheck,
  TrendingUp,
  Server,
  Database,
  CheckCircle2,
  Clock,
  ChevronRight,
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

export default function AdminDashboard() {
  const { user } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 17) setGreeting("Good afternoon");
    else if (hour >= 17) setGreeting("Good evening");

    async function loadDashboardData() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setActivities(data.recentActivity);
        } else {
          // Mock data if API is not fully implemented yet
          setStats({
            totalUsers: 1240,
            totalClients: 85,
            totalAdmins: 12,
            supportTicketsCount: 34,
            serviceRequestsCount: 156,
          });
          setActivities([
            { id: "1", action: "CREATE", description: "New client 'Acme Corp' registered", time: "10 mins ago" },
            { id: "2", action: "UPDATE", description: "Operator 'Sarah J.' updated permissions", time: "1 hour ago" },
            { id: "3", action: "RESOLVE", description: "Support ticket #1442 resolved", time: "3 hours ago" },
            { id: "4", action: "LOGIN", description: "System backup completed successfully", time: "5 hours ago" },
          ]);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const metricCards = [
    {
      label: "Total Revenue",
      value: "$45,231.89",
      trend: "+20.1%",
      isPositive: true,
      icon: TrendingUp,
      accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    {
      label: "Active Clients",
      value: stats?.totalClients ?? 0,
      trend: "+12.5%",
      isPositive: true,
      icon: Building2,
      accent: "text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400",
    },
    {
      label: "Registered Users",
      value: stats?.totalUsers ?? 0,
      trend: "+4.1%",
      isPositive: true,
      icon: Users,
      accent: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400",
    },
    {
      label: "Active Tickets",
      value: stats?.supportTicketsCount ?? 0,
      trend: "-2.4%",
      isPositive: false,
      icon: MessageSquare,
      accent: "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400",
    },
  ];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {greeting}, {user?.firstName || "Operator"}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
            Here's what's happening with your platform today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/clients"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 transition hover:bg-slate-50 dark:bg-[#111827] dark:text-zinc-300 dark:ring-white/10 dark:hover:bg-white/5"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Client</span>
          </Link>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-blue-500/20">
            <ClipboardList className="h-4 w-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-white/10 dark:bg-[#111827]"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">
                  {card.label}
                </p>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.accent}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
                </h2>
                <span className={`text-xs font-bold ${card.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                  {card.trend}
                </span>
              </div>
              
              {/* Decorative Sparkline (CSS Based) */}
              <div className="absolute -bottom-2 -left-2 right-0 h-12 opacity-10 transition-opacity group-hover:opacity-20">
                <svg viewBox="0 0 200 50" preserveAspectRatio="none" className="h-full w-full">
                  <path
                    d={card.isPositive ? "M0,50 L20,40 L40,45 L60,25 L80,35 L100,15 L120,25 L140,5 L160,15 L180,0 L200,10 L200,50 Z" : "M0,10 L20,5 L40,15 L60,5 L80,25 L100,20 L120,40 L140,30 L160,45 L180,35 L200,50 L200,50 Z"}
                    fill={card.isPositive ? "#10b981" : "#f43f5e"}
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Analytics Chart Area */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111827] lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/5">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Revenue Overview</h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400">Monthly recurring revenue (MRR) growth</p>
            </div>
            <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 outline-none dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex-1 p-6">
            {/* CSS-based Bar Chart Representation */}
            <div className="relative h-64 w-full flex items-end justify-between gap-2 pt-6">
               {/* Y-axis grid lines */}
               <div className="absolute inset-0 flex flex-col justify-between pb-6">
                 {[4, 3, 2, 1, 0].map((i) => (
                   <div key={i} className="flex w-full items-center gap-4">
                     <span className="w-8 text-right text-xs font-medium text-slate-400 dark:text-zinc-500">${i}0k</span>
                     <div className="h-px flex-1 border-b border-dashed border-slate-200 dark:border-white/5"></div>
                   </div>
                 ))}
               </div>
               
               {/* Bars */}
               {[
                 { month: "Jan", value: 35 },
                 { month: "Feb", value: 45 },
                 { month: "Mar", value: 30 },
                 { month: "Apr", value: 60 },
                 { month: "May", value: 75 },
                 { month: "Jun", value: 90 },
               ].map((data, i) => (
                 <div key={data.month} className="relative z-10 flex w-full flex-col items-center justify-end gap-2 h-full pb-6">
                   <div 
                     className="w-full max-w-[48px] rounded-t-md bg-blue-600 transition-all duration-500 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400"
                     style={{ height: `${data.value}%` }}
                   >
                     <div className="opacity-0 hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs font-bold text-white shadow-lg dark:bg-white dark:text-slate-900 transition-opacity">
                       ${(data.value * 500).toLocaleString()}
                     </div>
                   </div>
                   <span className="absolute bottom-0 text-xs font-medium text-slate-500 dark:text-zinc-400">{data.month}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* System Health & Team Overview */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111827]">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">System Status</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Server className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Main Application</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Response time: 45ms</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Database className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Database Cluster</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Load: 12%</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Background Jobs</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">Queue: 4 pending</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> Degraded
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111827]">
             <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Team Operators</h2>
                <Link href="/admin/administration/admins" className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">View all</Link>
             </div>
             <div className="mt-6 flex -space-x-3 overflow-hidden">
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-[#111827]" src="https://i.pravatar.cc/150?u=1" alt=""/>
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-[#111827]" src="https://i.pravatar.cc/150?u=2" alt=""/>
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-[#111827]" src="https://i.pravatar.cc/150?u=3" alt=""/>
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-[#111827]" src="https://i.pravatar.cc/150?u=4" alt=""/>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 ring-2 ring-white dark:bg-zinc-800 dark:ring-[#111827]">
                   <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">+{stats?.totalAdmins ? Math.max(0, stats.totalAdmins - 4) : 8}</span>
                </div>
             </div>
             <p className="mt-4 text-xs text-slate-500 dark:text-zinc-400">
               {stats?.totalAdmins || 12} operators have access to this workspace. Keep permissions strictly enforced.
             </p>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111827]">
          <div className="flex items-center justify-between border-b border-slate-100 p-6 dark:border-white/5">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-400 dark:text-zinc-500" />
              <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Recent Activity</h2>
            </div>
            <Link
              href="/admin/administration/activity"
              className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View complete log <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="p-6">
            <div className="relative border-l-2 border-slate-100 dark:border-white/5 ml-3 space-y-8">
              {activities.length > 0 ? (
                activities.slice(0, 4).map((item, index) => (
                  <div key={item.id} className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-4 ring-white dark:bg-[#111827] dark:ring-[#111827]">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{item.description}</p>
                      <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-white/5 dark:text-zinc-400">
                        {item.action}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">{item.time}</p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-slate-500 dark:text-zinc-500">
                  No active audit log records.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Operations / Quick Links */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111827]">
          <div className="border-b border-slate-100 p-6 dark:border-white/5">
             <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Workspace Operations</h2>
             <p className="text-sm text-slate-500 dark:text-zinc-400">Common administrative tasks and links</p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-slate-100 p-px dark:bg-white/5">
             <Link href="/admin/clients" className="flex flex-col items-center justify-center gap-3 bg-white p-8 text-center transition hover:bg-slate-50 dark:bg-[#111827] dark:hover:bg-zinc-900/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                   <Building2 className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Manage Clients</span>
             </Link>
             <Link href="/admin/administration/admins" className="flex flex-col items-center justify-center gap-3 bg-white p-8 text-center transition hover:bg-slate-50 dark:bg-[#111827] dark:hover:bg-zinc-900/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                   <Shield className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Access Control</span>
             </Link>
             <Link href="/admin/team" className="flex flex-col items-center justify-center gap-3 bg-white p-8 text-center transition hover:bg-slate-50 dark:bg-[#111827] dark:hover:bg-zinc-900/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                   <Users className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Team Profiles</span>
             </Link>
             <Link href="/admin/admin/security" className="flex flex-col items-center justify-center gap-3 bg-white p-8 text-center transition hover:bg-slate-50 dark:bg-[#111827] dark:hover:bg-zinc-900/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-zinc-400">
                   <CheckCircle2 className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Security Audit</span>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 pb-10 animate-pulse">
      <div className="space-y-2">
        <div className="h-10 w-64 rounded-xl bg-slate-200 dark:bg-zinc-800" />
        <div className="h-4 w-48 rounded-lg bg-slate-200/60 dark:bg-zinc-800/50" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827] p-6"
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-80 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827] lg:col-span-2" />
        <div className="space-y-6">
           <div className="h-56 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]" />
           <div className="h-40 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111827]" />
        </div>
      </div>
    </div>
  );
}