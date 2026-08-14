"use client";

import { useState, useEffect, type FormEvent } from "react";
import {
  HelpCircle,
  Plus,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface TicketMessage {
  id: string;
  senderId: string;
  senderType: string;
  senderName: string;
  content: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  _count: { messages: number };
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: "Low", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
  MEDIUM: { label: "Medium", color: "bg-brand/10 text-brand border-brand/20" },
  HIGH: { label: "High", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  URGENT: { label: "Urgent", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
};

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  OPEN: { label: "Open", color: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: AlertCircle },
  IN_PROGRESS: { label: "In Progress", color: "bg-brand/10 text-brand border-brand/20", icon: Clock },
  RESOLVED: { label: "Resolved", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: CheckCircle2 },
  CLOSED: { label: "Closed", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20", icon: X },
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  // Create ticket state
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("MEDIUM");
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets() {
    try {
      const res = await fetch("/api/user/support");
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    try {
      const res = await fetch("/api/user/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, category, priority, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create ticket");

      setTickets((prev) => [data.ticket, ...prev]);
      setShowCreate(false);
      setSubject("");
      setCategory("General");
      setPriority("MEDIUM");
      setMessage("");
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  }

  const open = tickets.filter((t) => t.status === "OPEN").length;
  const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter((t) => ["RESOLVED", "CLOSED"].includes(t.status)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Support Center</h2>
          <p className="mt-1 text-zinc-400">Submit tickets and track their progress with our team.</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-base font-bold text-white hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-primary/20 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> New Ticket
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Open Tickets", value: open, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
          { label: "In Progress", value: inProgress, color: "text-brand", bg: "bg-brand/10 border-brand/20" },
          { label: "Resolved", value: resolved, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-5 shadow-xl">
            <p className={`text-3xl font-black ${color}`}>{loading ? "–" : value}</p>
            <p className="mt-1 text-base font-semibold text-zinc-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Ticket list */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-lg bg-white/5 border border-white/5" />)}
        </div>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01]">
          <HelpCircle className="h-12 w-12 text-zinc-700 mb-4" />
          <p className="text-zinc-500 font-semibold">No support tickets yet</p>
          <p className="mt-1 text-xs text-zinc-600">Click "New Ticket" to get in touch with our team.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const s = statusConfig[ticket.status] ?? { label: ticket.status, color: "bg-white/5 text-zinc-400 border-white/10", icon: HelpCircle };
            const p = priorityConfig[ticket.priority] ?? { label: ticket.priority, color: "bg-white/5 text-zinc-400 border-white/10" };
            const StatusIcon = s.icon;
            const isOpen = expanded === ticket.id;

            return (
              <div
                key={ticket.id}
                className="rounded-lg border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] shadow-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : ticket.id)}
                  className="w-full flex items-start gap-4 p-5 text-left hover:bg-white/[0.02] transition cursor-pointer"
                >
                  <div className={`mt-0.5 rounded-lg border p-1.5 ${s.color}`}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-white truncate">{ticket.subject}</p>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${p.color}`}>
                        {p.label}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${s.color}`}>
                        {s.label}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-zinc-500">
                      <span>{ticket.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" /> {ticket._count?.messages ?? ticket.messages?.length ?? 0} messages
                      </span>
                      <span>•</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-zinc-500 shrink-0" /> : <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />}
                </button>

                {isOpen && (
                  <div className="border-t border-white/5 p-5 space-y-4">
                    {ticket.messages?.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.senderType === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div className={`flex-shrink-0 rounded-full h-8 w-8 flex items-center justify-center font-bold text-base ${
                          msg.senderType === "admin"
                            ? "bg-primary/20 border border-primary/30 text-primary"
                            : "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                        }`}>
                          {msg.senderName[0]}
                        </div>
                        <div className={`max-w-[75%] space-y-1 ${msg.senderType === "user" ? "items-end" : "items-start"} flex flex-col`}>
                          <div className={`rounded-lg px-4 py-3 text-base ${
                            msg.senderType === "admin"
                              ? "bg-white/5 border border-white/10 text-white"
                              : "bg-primary/15 border border-primary/20 text-white"
                          }`}>
                            {msg.content}
                          </div>
                          <span className="text-[10px] text-zinc-600 px-1">
                            {msg.senderName} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Ticket Drawer */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-t-3xl sm:rounded-3xl border border-white/10 bg-[#0c1222] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-black text-white">Submit Support Ticket</h3>
              <button onClick={() => setShowCreate(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Subject *</label>
                <input
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-primary/50"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#0c1222] px-4 py-3 text-zinc-300 outline-none focus:border-primary/50"
                  >
                    {["General", "Web", "Mobile", "SaaS", "AI", "Cloud", "Billing", "Security"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-[#0c1222] px-4 py-3 text-zinc-300 outline-none focus:border-primary/50"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-zinc-400">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-zinc-600 outline-none focus:border-primary/50 resize-none"
                />
              </div>

              {createError && (
                <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-base font-semibold text-rose-500">
                  {createError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-lg border border-white/10 px-5 py-2.5 text-base font-bold text-zinc-400 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-base font-bold text-white hover:brightness-110 disabled:opacity-50 transition shadow-lg shadow-primary/20 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  {creating ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
