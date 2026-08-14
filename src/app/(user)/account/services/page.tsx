"use client";

import { useState, useEffect } from "react";
import { Heart, TrendingUp, CheckCircle2, Clock, ArrowRight, BarChart3 } from "lucide-react";

interface ServiceRequest {
  id: string;
  serviceName: string;
  status: string;
  assignedTeam: string;
  progress: number;
  notes: string | null;
  deliveryDate: string | null;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  IN_PROGRESS: { label: "In Progress", color: "bg-brand/10 text-brand border-brand/20" },
  REVIEW: { label: "In Review", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  COMPLETED: { label: "Completed", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  ON_HOLD: { label: "On Hold", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  CANCELLED: { label: "Cancelled", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
};

const progressBarColor: Record<string, string> = {
  PENDING: "bg-zinc-500",
  IN_PROGRESS: "bg-primary",
  REVIEW: "bg-amber-500",
  COMPLETED: "bg-emerald-500",
  ON_HOLD: "bg-orange-500",
  CANCELLED: "bg-rose-500",
};

const serviceIcons: Record<string, string> = {
  "Web": "🌐",
  "Mobile": "📱",
  "SaaS": "☁️",
  "AI": "🤖",
  "Cloud": "⚡",
  "Design": "🎨",
  "SEO": "🔍",
};

function getServiceIcon(name: string): string {
  for (const [key, icon] of Object.entries(serviceIcons)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return "💼";
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/user/services")
      .then((r) => r.json())
      .then((data) => setServices(data.services || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const visible = services.filter((s) => filter === "ALL" || s.status === filter);
  const active = services.filter((s) => s.status === "IN_PROGRESS").length;
  const completed = services.filter((s) => s.status === "COMPLETED").length;
  const avgProgress = services.length > 0
    ? Math.round(services.reduce((sum, s) => sum + s.progress, 0) / services.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Solutions & Services</h2>
        <p className="mt-1 text-zinc-400">
          Track the progress and status of all your requested DevX solutions.
        </p>
      </div>

      {/* Summary stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Requests", value: services.length, icon: Heart, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
          { label: "Active Services", value: active, icon: TrendingUp, color: "text-brand", bg: "bg-brand/10 border-brand/20" },
          { label: "Completed", value: completed, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
          { label: "Avg. Progress", value: `${avgProgress}%`, icon: BarChart3, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-5 shadow-xl">
            <div className={`inline-flex rounded-lg border p-2.5 mb-3 ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-3xl font-black text-white">{loading ? "–" : value}</p>
            <p className="mt-1 text-base font-semibold text-zinc-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-3">
        {["ALL", "IN_PROGRESS", "PENDING", "REVIEW", "COMPLETED", "CANCELLED"].map((f) => {
          const labels: Record<string, string> = { ALL: "All", IN_PROGRESS: "In Progress", PENDING: "Pending", REVIEW: "In Review", COMPLETED: "Completed", CANCELLED: "Cancelled" };
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition cursor-pointer ${
                filter === f
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {labels[f]}
            </button>
          );
        })}
      </div>

      {/* Services grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 animate-pulse">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-52 rounded-lg bg-white/5 border border-white/5" />)}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01]">
          <Heart className="h-12 w-12 text-zinc-700 mb-4" />
          <p className="text-zinc-500 font-semibold">No services found</p>
          <p className="mt-1 text-xs text-zinc-600">Contact us to request a new solution.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {visible.map((service) => {
            const s = statusConfig[service.status] ?? { label: service.status, color: "bg-white/5 text-zinc-400 border-white/10" };
            const barColor = progressBarColor[service.status] ?? "bg-primary";
            const icon = getServiceIcon(service.serviceName);

            return (
              <div
                key={service.id}
                className="group rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-6 shadow-xl hover:border-primary/30 transition-all"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-2xl">
                      {icon}
                    </div>
                    <div>
                      <p className="font-bold text-white leading-tight">{service.serviceName}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">{service.assignedTeam || "Unassigned"}</p>
                    </div>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold shrink-0 ${s.color}`}>
                    {s.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-zinc-500">Progress</span>
                    <span className="text-white">{service.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${service.progress}%` }}
                    />
                  </div>
                </div>

                {service.notes && (
                  <p className="text-xs text-zinc-500 border-t border-white/5 pt-3">{service.notes}</p>
                )}

                <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-600">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {service.deliveryDate
                      ? `Due: ${new Date(service.deliveryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                      : "No delivery date"}
                  </span>
                  <span>Req: {new Date(service.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
