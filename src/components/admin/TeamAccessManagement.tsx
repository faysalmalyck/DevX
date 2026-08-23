"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { KeyRound, RefreshCw, Search, ShieldCheck, UserRound, UsersRound } from "lucide-react";

import { getClientCsrfToken } from "@/lib/auth/client-csrf";
import type { ManagedTeamAccessRole, TeamAccessDisplayRole } from "@/lib/team/access";

type AccessRole = TeamAccessDisplayRole;
type ManagedAccessRole = ManagedTeamAccessRole;
type TeamAccessMember = {
  id: string;
  name: string | null;
  role: string | null;
  department: string | null;
  email: string | null;
  accessRole: AccessRole;
  salesRole: "SALES_MANAGER" | "SALES_AGENT" | null;
  admin: {
    id: string;
    email: string;
    status: "ACTIVE" | "SUSPENDED" | "INVITED" | "LOCKED";
    lastLogin: string | null;
    agentCode: string | null;
    role: { name: string; isSuperAdmin: boolean };
  } | null;
};
type LoginCredentials = {
  email: string | null;
  username: string;
  temporaryPassword: string;
  adminLoginUrl: string;
  salesLoginUrl: string | null;
};

const accessLabels: Record<AccessRole, string> = {
  NONE: "No Login Access",
  CEO: "CEO • Super Admin",
  ADMINISTRATOR: "Administrator",
  SALES_MANAGER: "Sales Manager",
  SALES_AGENT: "Business Development Executive",
};

function displayName(member: TeamAccessMember) {
  return member.name?.trim() || "Unnamed TeamMember";
}

function statusTone(status: TeamAccessMember["admin"] extends infer T ? T extends { status: infer S } ? S : never : never) {
  return status === "ACTIVE" ? "text-emerald-600 dark:text-emerald-300" : status === "INVITED" ? "text-amber-600 dark:text-amber-300" : "text-rose-600 dark:text-rose-300";
}

export default function TeamAccessManagement() {
  const [members, setMembers] = useState<TeamAccessMember[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | AccessRole>("ALL");
  const [selected, setSelected] = useState<TeamAccessMember | null>(null);
  const [role, setRole] = useState<ManagedAccessRole>("NONE");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<LoginCredentials | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    setCredentials(null);
    setCopiedField(null);
    try {
      const response = await fetch("/api/admin/team-access", { credentials: "same-origin", cache: "no-store", signal });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || "Unable to load Team Access.");
      setMembers(Array.isArray(payload.members) ? payload.members : []);
    } catch (loadError) {
      if (loadError instanceof DOMException && loadError.name === "AbortError") return;
      setError(loadError instanceof Error ? loadError.message : "Unable to load Team Access.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const visibleMembers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return members.filter((member) => {
      const matchesQuery = !normalized || `${displayName(member)} ${member.email ?? ""} ${member.role ?? ""}`.toLowerCase().includes(normalized);
      return matchesQuery && (filter === "ALL" || member.accessRole === filter);
    });
  }, [filter, members, query]);

  const openAccess = (member: TeamAccessMember) => {
    if (member.accessRole === "CEO") return;
    setSelected(member);
    setRole(member.accessRole);
    setError(null);
    setNotice(null);
    setCredentials(null);
  };

  const saveAccess = async () => {
    if (!selected) return;
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      let csrf = getClientCsrfToken();
      if (!csrf) {
        await fetch("/api/auth/csrf", { credentials: "same-origin" });
        csrf = getClientCsrfToken();
      }
      if (!csrf) throw new Error("Your session security token could not be created. Please try again.");
      const response = await fetch("/api/admin/team-access", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        body: JSON.stringify({ teamMemberId: selected.id, accessRole: role }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || "Unable to update Team Access.");
      setSelected(null);
      await load();
      if (payload.credentials) setCredentials(payload.credentials as LoginCredentials);
      setNotice(`${displayName(selected)} now has ${accessLabels[role]}.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to update Team Access.");
    } finally {
      setSaving(false);
    }
  };

  const copyCredential = async (field: keyof LoginCredentials, value: string) => {
    await navigator.clipboard?.writeText(value);
    setCopiedField(field);
    window.setTimeout(() => setCopiedField((current) => current === field ? null : current), 1600);
  };

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Administration</p><h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 dark:text-white">Team Access</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">Choose an existing TeamMember and create or link a secure Admin login for Administrator or Sales access.</p></div>
      <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-white/[0.1] dark:text-slate-200 dark:hover:bg-white/[0.06]"><RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />Refresh</button>
    </div>
    <div className="grid gap-3 sm:grid-cols-3"><SummaryCard icon={UsersRound} label="TeamMembers" value={members.length} /><SummaryCard icon={ShieldCheck} label="With login access" value={members.filter((member) => member.accessRole !== "NONE").length} /><SummaryCard icon={KeyRound} label="Sales access" value={members.filter((member) => member.accessRole === "SALES_MANAGER" || member.accessRole === "SALES_AGENT").length} /></div>
    {notice ? <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100">{notice}</p> : null}
    {error && !selected ? <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-100">{error}</p> : null}
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#111a2d]"><div className="flex flex-col gap-3 border-b border-slate-200 p-5 dark:border-white/[0.08] sm:flex-row"><label className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search TeamMembers…" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand dark:border-white/10 dark:bg-zinc-900" /></label><select aria-label="Filter by access" value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm dark:border-white/10 dark:bg-zinc-900"><option value="ALL">All access</option>{Object.entries(accessLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500 dark:border-white/[0.08] dark:bg-white/[0.025]"><tr><th className="px-5 py-3 font-bold">TeamMember</th><th className="px-5 py-3 font-bold">Public role</th><th className="px-5 py-3 font-bold">Access</th><th className="px-5 py-3 font-bold">Account</th><th className="px-5 py-3 font-bold">Last login</th><th className="px-5 py-3 text-right font-bold">Action</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">{loading && members.length === 0 ? <TableSkeleton /> : visibleMembers.map((member) => <tr key={member.id} className="hover:bg-slate-50/70 dark:hover:bg-white/[0.025]"><td className="px-5 py-4"><p className="font-bold text-slate-900 dark:text-white">{displayName(member)}</p><p className="mt-0.5 text-xs text-slate-500">{member.email || "No TeamMember email"}</p></td><td className="px-5 py-4 text-slate-600 dark:text-slate-300">{member.role || "—"}<span className="block text-xs text-slate-500">{member.department || "Unassigned"}</span></td><td className="px-5 py-4 font-semibold text-slate-700 dark:text-slate-200">{accessLabels[member.accessRole]}</td><td className="px-5 py-4">{member.admin ? <><p className={`font-semibold ${statusTone(member.admin.status)}`}>{member.admin.status}</p><p className="text-xs text-slate-500">{member.admin.email}{member.admin.agentCode ? ` · ${member.admin.agentCode}` : ""}</p></> : <span className="text-slate-500">No linked Admin</span>}</td><td className="px-5 py-4 text-slate-500">{member.admin?.lastLogin ? new Date(member.admin.lastLogin).toLocaleString() : "Never"}</td><td className="px-5 py-4 text-right">{member.accessRole === "CEO" ? <span className="text-xs font-bold text-amber-700 dark:text-amber-300">Protected CEO account</span> : <button type="button" onClick={() => openAccess(member)} className="inline-flex items-center gap-2 rounded-lg bg-brand px-3 py-2 text-xs font-bold text-white hover:bg-brand/90"><UserRound className="h-3.5 w-3.5" />Manage Access</button>}</td></tr>)}</tbody></table></div>{!loading && visibleMembers.length === 0 ? <p className="p-10 text-center text-sm text-slate-500">No TeamMembers match your filters.</p> : null}</section>
    {selected ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"><div role="dialog" aria-modal="true" aria-labelledby="team-access-dialog-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#111827]"><h2 id="team-access-dialog-title" className="text-xl font-black text-slate-900 dark:text-white">Manage access for {displayName(selected)}</h2><p className="mt-2 text-sm text-slate-500">The TeamMember remains the source of truth and is linked to a secure Admin identity.</p>{error ? <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-100">{error}</p> : null}<label className="mt-5 block text-sm font-bold text-slate-700 dark:text-slate-200">Login access<select aria-label="Login access" value={role} onChange={(event) => { setRole(event.target.value as ManagedAccessRole); setError(null); }} className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-zinc-900"><option value="NONE">No Login Access</option><option value="ADMINISTRATOR">Administrator</option><option value="SALES_MANAGER">Sales Manager</option><option value="SALES_AGENT">Business Development Executive</option></select></label>{role === "SALES_MANAGER" || role === "SALES_AGENT" ? <p className="mt-3 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs leading-5 text-cyan-800 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100">Sales access uses the canonical Admin login. Business Development Executives receive Sales Agent access.</p> : null}<div className="mt-6 flex justify-end gap-2"><button type="button" disabled={saving} onClick={() => setSelected(null)} className="rounded-lg px-4 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300">Cancel</button><button type="button" disabled={saving} onClick={() => void saveAccess()} className="rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? "Saving…" : "Save access"}</button></div></div></div> : null}
    {credentials ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"><div role="dialog" aria-modal="true" aria-labelledby="login-created-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#111827]"><h2 id="login-created-title" className="text-xl font-black text-slate-900 dark:text-white">Login created</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Share these temporary credentials privately. The user must change the password after first login.</p><div className="mt-5 space-y-3">{([['Email', credentials.email ?? '—', 'email'], ['Username', credentials.username, 'username'], ['Temporary password', credentials.temporaryPassword, 'temporaryPassword']] as const).map(([label, value, field]) => <div key={field}><p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><div className="mt-1 flex gap-2"><code className="min-w-0 flex-1 break-all rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-white/10">{value}</code><button type="button" onClick={() => void copyCredential(field, value)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold dark:border-white/10">{copiedField === field ? "Copied" : "Copy"}</button></div></div>)}<div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Login entry points</p><p className="mt-1 text-sm"><a className="text-brand underline" href={credentials.adminLoginUrl}>Admin login</a>{credentials.salesLoginUrl ? <> · <a className="text-brand underline" href={credentials.salesLoginUrl}>Sales login</a></> : null}</p></div></div><button type="button" onClick={() => { setCredentials(null); setCopiedField(null); }} className="mt-6 w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white">Done</button></div></div> : null}
  </div>;
}

function SummaryCard({ icon: Icon, label, value }: { icon: typeof UsersRound; label: string; value: number }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#111a2d]"><Icon className="h-5 w-5 text-brand" /><p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">{value}</p><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p></div>;
}

function TableSkeleton() {
  return <>{Array.from({ length: 4 }, (_, index) => <tr key={index}><td colSpan={6} className="px-5 py-5"><div className="h-5 animate-pulse rounded bg-slate-100 dark:bg-white/[0.06]" /></td></tr>)}</>;
}
