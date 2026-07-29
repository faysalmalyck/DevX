"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, ClipboardList, Plus, Users, Shield, MessageSquare, ArrowUpRight, Activity } from "lucide-react";
import { useSession } from "@/app/context/SessionContext";

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

  // Greeting based on current time
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
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const cards = [
    {
      label: "Client Profiles",
      value: stats ? String(stats.totalClients) : "0",
      icon: Building2,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Registered Clients",
      value: stats ? String(stats.totalUsers) : "0",
      icon: Users,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Operators & Admins",
      value: stats ? String(stats.totalAdmins) : "0",
      icon: Shield,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Solutions Requests",
      value: stats ? String(stats.serviceRequestsCount) : "0",
      icon: ClipboardList,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Support Tickets",
      value: stats ? String(stats.supportTicketsCount) : "0",
      icon: MessageSquare,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-xl w-1/4"></div>
        <div className="h-4 bg-white/5 rounded-lg w-1/3"></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/5"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {greeting}, {user?.firstName || "Operator"}
        </h2>
        <p className="mt-2 text-zinc-400">
          DevX Systems Administration. Operational metrics are active.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => {
          const CardIcon = card.icon;
          return (
            <div
              key={card.label}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-6 shadow-xl backdrop-blur-md"
            >
              <div className="flex justify-between items-start">
                <span className={`rounded-xl border p-2 ${card.color}`}>
                  <CardIcon className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-5">
                <p className="text-3xl font-black text-white tracking-tight">{card.value}</p>
                <p className="mt-1 text-sm font-semibold text-zinc-400">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Actions + Recent Logs */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Quick Actions Panel */}
        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-6 shadow-xl backdrop-blur-md">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Quick Operations
          </h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              href="/admin/clients"
              className="flex flex-col justify-between rounded-xl border border-white/5 bg-black/20 p-5 transition duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary group"
            >
              <Plus className="h-5 w-5 text-zinc-500 group-hover:text-primary transition" />
              <div className="mt-4">
                <p className="text-sm font-bold text-white group-hover:text-primary transition">Add Client</p>
                <p className="text-xs text-zinc-500 mt-1">Register new partner company</p>
              </div>
            </Link>

            <Link
              href="/admin/administration/admins"
              className="flex flex-col justify-between rounded-xl border border-white/5 bg-black/20 p-5 transition duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary group"
            >
              <Users className="h-5 w-5 text-zinc-500 group-hover:text-primary transition" />
              <div className="mt-4">
                <p className="text-sm font-bold text-white group-hover:text-primary transition">Manage Operators</p>
                <p className="text-xs text-zinc-500 mt-1">Review system admins</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Audit Activity Logs Panel */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Audit Stream
            </h3>
            <Link
              href="/admin/administration/activity"
              className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition"
            >
              Full log <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {activities.length > 0 ? (
              activities.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 text-sm border-b border-white/[0.03] pb-3 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-zinc-200">{item.description}</p>
                    <p className="text-xs text-zinc-500 flex items-center gap-1.5">
                      {item.time}
                    </p>
                  </div>
                  <span className="text-[10px] rounded bg-white/5 border border-white/10 px-1.5 py-0.5 font-mono text-zinc-400 flex-shrink-0">
                    {item.action}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-zinc-500 text-center py-6">No audit records found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
