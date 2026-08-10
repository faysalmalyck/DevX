"use client";

import { useState, useEffect, type FormEvent } from "react";
import { Calendar, Clock, CheckCircle2, XCircle, Loader2, Filter, ChevronDown } from "lucide-react";

interface PlannedActivity {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  scheduledAt: string;
}

const typeIcon: Record<string, string> = {
  meeting: "📅",
  consultation: "💬",
  milestone: "🏁",
  task: "✅",
  event: "🎯",
};

const statusConfig: Record<string, { label: string; color: string }> = {
  SCHEDULED: { label: "Scheduled", color: "bg-brand/10 text-brand border-brand/20" },
  COMPLETED: { label: "Completed", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  CANCELLED: { label: "Cancelled", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<PlannedActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/user/activities")
      .then((r) => r.json())
      .then((data) => setActivities(data.activities || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const visible = activities.filter((a) => filter === "ALL" || a.status === filter);

  const upcoming = activities.filter(
    (a) => a.status === "SCHEDULED" && new Date(a.scheduledAt) >= new Date()
  ).length;
  const past = activities.filter(
    (a) => a.status === "COMPLETED" || new Date(a.scheduledAt) < new Date()
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Planned Activities</h2>
          <p className="mt-1 text-zinc-400">Your upcoming meetings, milestones, and consultations.</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Upcoming", value: upcoming, icon: Calendar, color: "text-brand", bg: "bg-brand/10 border-brand/20" },
          { label: "Completed", value: activities.filter(a => a.status === "COMPLETED").length, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
          { label: "Total", value: activities.length, icon: Clock, color: "text-zinc-400", bg: "bg-white/5 border-white/10" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-5 shadow-xl">
            <div className={`inline-flex rounded-xl border p-2.5 mb-3 ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-3xl font-black text-white">{loading ? "–" : value}</p>
            <p className="mt-1 text-base font-semibold text-zinc-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-3">
        {["ALL", "SCHEDULED", "COMPLETED", "CANCELLED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition cursor-pointer ${
              filter === f
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Activities list */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 rounded-2xl bg-white/5 border border-white/5" />)}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01]">
          <Calendar className="h-12 w-12 text-zinc-700 mb-4" />
          <p className="text-zinc-500">No activities found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((activity) => {
            const s = statusConfig[activity.status] ?? { label: activity.status, color: "bg-white/5 text-zinc-400 border-white/10" };
            const isPast = new Date(activity.scheduledAt) < new Date();

            return (
              <div
                key={activity.id}
                className={`group flex gap-4 rounded-2xl border p-5 transition ${
                  activity.status === "COMPLETED"
                    ? "border-emerald-500/10 bg-emerald-500/5"
                    : activity.status === "CANCELLED"
                    ? "border-rose-500/10 bg-rose-500/5 opacity-60"
                    : isPast
                    ? "border-white/5 bg-black/20"
                    : "border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01]"
                }`}
              >
                <div className="flex-shrink-0 text-2xl mt-1">
                  {typeIcon[activity.type] ?? "📌"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-bold text-white">{activity.title}</p>
                      {activity.description && (
                        <p className="mt-1 text-base text-zinc-500">{activity.description}</p>
                      )}
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${s.color}`}>
                      {s.label}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(activity.scheduledAt).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(activity.scheduledAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className="capitalize text-zinc-600 font-medium">{activity.type}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
