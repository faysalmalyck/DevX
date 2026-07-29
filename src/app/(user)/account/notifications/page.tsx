"use client";

import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2, Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  INFO: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  SUCCESS: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  WARNING: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  ERROR: { icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
  PROJECT_UPDATE: { icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  MESSAGE: { icon: Bell, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  SUPPORT_TICKET: { icon: Bell, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  SECURITY: { icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
};

const defaultType = { icon: Bell, color: "text-zinc-400", bg: "bg-white/5 border-white/10" };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const res = await fetch("/api/user/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    await fetch("/api/user/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  }

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch("/api/user/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
  }

  const unreadCount = notifications.filter((n) => !n.read).length;
  const visible = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-sm font-black text-white">
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="mt-1 text-zinc-400">Project updates, messages, and security alerts.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-zinc-300 hover:text-white transition cursor-pointer"
          >
            <CheckCheck className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-2">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              filter === f
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {f === "all" ? `All (${notifications.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-20 rounded-2xl bg-white/5 border border-white/5" />)}
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01]">
          <Bell className="h-12 w-12 text-zinc-700 mb-4" />
          <p className="text-zinc-500 font-semibold">
            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map((notif) => {
            const t = typeConfig[notif.type] ?? defaultType;
            const Icon = t.icon;

            return (
              <div
                key={notif.id}
                className={`group flex items-start gap-4 rounded-2xl border p-4 transition-all ${
                  !notif.read
                    ? "border-primary/15 bg-primary/5 hover:border-primary/30"
                    : "border-white/5 bg-black/10 hover:bg-white/[0.02]"
                }`}
              >
                <div className={`mt-0.5 flex-shrink-0 rounded-xl border p-2 ${t.bg}`}>
                  <Icon className={`h-4 w-4 ${t.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`font-bold text-sm leading-tight ${!notif.read ? "text-white" : "text-zinc-300"}`}>
                        {notif.title}
                        {!notif.read && (
                          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary align-middle" />
                        )}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{notif.message}</p>
                    </div>
                    {!notif.read && (
                      <button
                        onClick={() => markRead(notif.id)}
                        title="Mark as read"
                        className="shrink-0 rounded-lg p-1.5 text-zinc-600 hover:text-primary hover:bg-primary/10 transition cursor-pointer opacity-0 group-hover:opacity-100"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-[10px] text-zinc-600">
                    {new Date(notif.createdAt).toLocaleString("en-US", {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
