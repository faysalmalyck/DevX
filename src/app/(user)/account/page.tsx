"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/contexts/SessionContext";
import Link from "next/link";
import {
  Activity,
  HelpCircle,
  Heart,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Zap,
} from "lucide-react";

interface ServiceRequest {
  id: string;
  serviceName: string;
  status: string;
  progress: number;
  assignedTeam: string;
  updatedAt: string;
}

interface PlannedActivity {
  id: string;
  title: string;
  type: string;
  status: string;
  scheduledAt: string;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const serviceColors: Record<string, string> = {
  "Web Development": "from-brand/20 to-brand/5 border-brand/20 text-brand",
  "Mobile App": "from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-400",
  "SaaS Platform": "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
  "SaaS Platform Development": "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
  "AI Integration": "from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400",
  "AI Chatbot Integration": "from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-400",
  "Cloud Migration": "from-sky-500/20 to-sky-600/5 border-sky-500/20 text-sky-400",
};

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  IN_PROGRESS: { label: "In Progress", color: "bg-brand/10 text-brand border-brand/20" },
  REVIEW: { label: "Review", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  COMPLETED: { label: "Completed", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  CANCELLED: { label: "Cancelled", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  SCHEDULED: { label: "Scheduled", color: "bg-brand/10 text-brand border-brand/20" },
  OPEN: { label: "Open", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
};

const activityIcons: Record<string, string> = {
  meeting: "📅",
  consultation: "💬",
  milestone: "🏁",
  task: "✅",
  event: "🎯",
};

export default function UserDashboardPage() {
  const { user } = useSession();
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [activities, setActivities] = useState<PlannedActivity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [svcRes, actRes, notifRes] = await Promise.all([
          fetch("/api/user/services"),
          fetch("/api/user/activities"),
          fetch("/api/user/notifications"),
        ]);

        if (svcRes.ok) setServices((await svcRes.json()).services || []);
        if (actRes.ok) setActivities((await actRes.json()).activities || []);
        if (notifRes.ok) setNotifications((await notifRes.json()).notifications || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeServices = services.filter((s) => s.status === "IN_PROGRESS").length;
  const upcomingActivities = activities.filter(
    (a) => a.status === "SCHEDULED" && new Date(a.scheduledAt) > new Date()
  ).length;

  return (
    <div className="space-y-8">
      {/* Hero greeting */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary/20 via-[#0c1222] to-emerald-500/10 p-8 shadow-2xl">
        <div className="relative z-10">
          <p className="text-base font-semibold text-zinc-400">{greeting},</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {user?.firstName} {user?.lastName} 👋
          </h1>
          <p className="mt-2 max-w-lg text-zinc-400">
            Welcome to your client workspace. Track your projects, upcoming activities, and support tickets — all in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/account/services"
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-base font-bold text-white hover:brightness-110 transition shadow-lg shadow-primary/20"
            >
              <Zap className="h-4 w-4" /> View Services
            </Link>
            <Link
              href="/account/support"
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-base font-bold text-zinc-300 hover:text-white transition"
            >
              <HelpCircle className="h-4 w-4" /> Open Ticket
            </Link>
          </div>
        </div>
        {/* Decorative blur */}
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active Services", value: activeServices, icon: Heart, color: "text-brand", bg: "bg-brand/10 border-brand/20" },
          { label: "Upcoming Activities", value: upcomingActivities, icon: Calendar, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
          { label: "Total Services", value: services.length, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
          { label: "Unread Notifications", value: unreadCount, icon: Bell, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-5 shadow-xl"
          >
            <div className={`inline-flex rounded-lg border p-2.5 ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="mt-4 text-3xl font-black text-white">
              {loading ? <span className="inline-block h-8 w-8 animate-pulse rounded bg-white/10" /> : value}
            </p>
            <p className="mt-1 text-base font-semibold text-zinc-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Active Services */}
        <div className="lg:col-span-3 rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-6 shadow-xl">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" /> Active Solutions
            </h2>
            <Link href="/account/services" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-lg bg-white/5" />)}
            </div>
          ) : services.length === 0 ? (
            <EmptyState icon={Heart} message="No service requests yet" action={{ label: "Contact Us", href: "/contact" }} />
          ) : (
            <div className="space-y-4">
              {services.slice(0, 3).map((service) => {
                const colorClass = Object.entries(serviceColors).find(([k]) =>
                  service.serviceName.includes(k.split(" ")[0])
                )?.[1] ?? "from-white/5 to-white/[0.01] border-white/10 text-zinc-400";
                const s = statusConfig[service.status] ?? { label: service.status, color: "bg-white/5 text-zinc-400 border-white/10" };

                return (
                  <div key={service.id} className={`rounded-lg border bg-gradient-to-br p-4 ${colorClass}`}>
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="font-bold text-white">{service.serviceName}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{service.assignedTeam}</p>
                      </div>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${s.color}`}>
                        {s.label}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-zinc-400">
                        <span>Progress</span>
                        <span>{service.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-700"
                          style={{ width: `${service.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Activities */}
          <div className="rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-400" /> Upcoming
              </h2>
              <Link href="/account/activities" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                All <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2].map((i) => <div key={i} className="h-16 rounded-lg bg-white/5" />)}
              </div>
            ) : activities.filter(a => a.status === "SCHEDULED" && new Date(a.scheduledAt) > new Date()).length === 0 ? (
              <p className="py-4 text-center text-base text-zinc-600">Nothing scheduled</p>
            ) : (
              <div className="space-y-3">
                {activities
                  .filter(a => a.status === "SCHEDULED" && new Date(a.scheduledAt) > new Date())
                  .slice(0, 3)
                  .map((act) => (
                    <div key={act.id} className="flex items-start gap-3 rounded-lg border border-white/5 bg-black/20 p-3">
                      <span className="text-xl">{activityIcons[act.type] ?? "📌"}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-semibold text-white">{act.title}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500">
                          <Clock className="h-3 w-3" />
                          {new Date(act.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Recent Notifications */}
          <div className="rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-400" /> Notifications
                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </h2>
              <Link href="/account/notifications" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                All <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2].map((i) => <div key={i} className="h-14 rounded-lg bg-white/5" />)}
              </div>
            ) : notifications.length === 0 ? (
              <p className="py-4 text-center text-base text-zinc-600">No notifications yet</p>
            ) : (
              <div className="space-y-2">
                {notifications.slice(0, 3).map((notif) => (
                  <div
                    key={notif.id}
                    className={`rounded-lg border p-3 ${!notif.read ? "border-primary/20 bg-primary/5" : "border-white/5 bg-black/20"}`}
                  >
                    <p className="text-xs font-bold text-white">{notif.title}</p>
                    <p className="mt-0.5 text-[11px] text-zinc-500 line-clamp-2">{notif.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "My Profile", desc: "Update account info", href: "/account/profile", icon: "👤" },
          { label: "Planned Activities", desc: "View schedule & meetings", href: "/account/activities", icon: "📅" },
          { label: "Service Requests", desc: "Track project progress", href: "/account/services", icon: "⚡" },
          { label: "Support Center", desc: "Create or view tickets", href: "/account/support", icon: "🎧" },
        ].map(({ label, desc, href, icon }) => (
          <Link
            key={label}
            href={href}
            className="group flex items-center gap-4 rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-5 shadow-xl hover:border-primary/30 hover:from-primary/5 transition-all duration-200"
          >
            <span className="text-2xl">{icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white group-hover:text-primary transition">{label}</p>
              <p className="text-xs text-zinc-500">{desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-primary transition" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, message, action }: { icon: any; message: string; action?: { label: string; href: string } }) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="rounded-lg border border-white/10 bg-white/5 p-4 mb-3">
        <Icon className="h-8 w-8 text-zinc-600" />
      </div>
      <p className="text-base text-zinc-500">{message}</p>
      {action && (
        <Link href={action.href} className="mt-3 text-xs font-bold text-primary hover:underline flex items-center gap-1">
          {action.label} <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}
