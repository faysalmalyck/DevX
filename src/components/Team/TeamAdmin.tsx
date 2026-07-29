"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, RotateCcw, Trash2, Users } from "lucide-react";
import { defaultTeamMembers, departments, TEAM_STORAGE_KEY, type TeamMember } from "@/data/team";

const emptyMember = (): TeamMember => ({ id: crypto.randomUUID(), name: "", role: "", description: "", image: "/images/hero/", department: "Engineering", visible: true });

export default function TeamAdmin() {
  const [members, setMembers] = useState<TeamMember[]>(defaultTeamMembers);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem("DevX-admin-authenticated") !== "true") {
      window.location.replace("/login");
      return;
    }
    setAuthorized(true);
    try {
      const stored = window.localStorage.getItem(TEAM_STORAGE_KEY);
      if (stored) setMembers(JSON.parse(stored));
    } catch { window.localStorage.removeItem(TEAM_STORAGE_KEY); }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(members));
  }, [members, ready]);

  const activeCount = useMemo(() => members.filter((member) => member.visible).length, [members]);
  const update = (member: TeamMember) => setMembers((current) => current.map((item) => item.id === member.id ? member : item));
  const move = (id: string, direction: -1 | 1) => setMembers((current) => {
    const index = current.findIndex((member) => member.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= current.length) return current;
    const next = [...current]; [next[index], next[target]] = [next[target], next[index]]; return next;
  });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    setMembers((current) => current.some((member) => member.id === editing.id) ? current.map((member) => member.id === editing.id ? editing : member) : [...current, editing]);
    setEditing(null);
  };

  if (!authorized) return <main className="min-h-screen bg-slate-50 pt-28 dark:bg-[#181d2b]" />;

  return <main className="min-h-screen bg-slate-50 pt-28 text-slate-900 dark:bg-[#181d2b] dark:text-white">
    <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">DevX CMS</p><h1 className="mt-2 text-4xl font-black tracking-tight">Team management</h1><p className="mt-3 max-w-2xl text-slate-500 dark:text-white/60">Keep the people shown on the Team page current. Changes are saved in this browser and appear on the public page immediately.</p></div><div className="flex gap-3"><Link href="/team" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold shadow-sm dark:border-white/10 dark:bg-white/5">View team page</Link><button onClick={() => setEditing(emptyMember())} className="premium-gradient-button inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold"><Plus className="h-4 w-4" />Add member</button></div></div>
      <div className="mb-8 grid gap-4 sm:grid-cols-3"><div className="glass-card rounded-2xl p-5"><Users className="h-5 w-5 text-primary" /><p className="mt-4 text-3xl font-black">{members.length}</p><p className="text-sm text-slate-500 dark:text-white/60">Total team members</p></div><div className="glass-card rounded-2xl p-5"><Eye className="h-5 w-5 text-Sky-blue-mist" /><p className="mt-4 text-3xl font-black">{activeCount}</p><p className="text-sm text-slate-500 dark:text-white/60">Visible on the site</p></div><div className="glass-card rounded-2xl p-5"><p className="text-sm font-bold text-amber-500">Local-first setup</p><p className="mt-4 text-sm leading-6 text-slate-500 dark:text-white/60">Connect a database and authentication before giving this route to other users.</p></div></div>
      <div className="glass-card overflow-hidden rounded-2xl"><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead className="border-b border-slate-200/80 bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/50"><tr><th className="p-4">Member</th><th className="p-4">Department</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{members.map((member, index) => <tr key={member.id} className="border-b border-slate-200/70 last:border-0 dark:border-white/10"><td className="p-4"><p className="font-bold">{member.name || "Untitled member"}</p><p className="mt-1 text-sm text-slate-500 dark:text-white/55">{member.role || "No role set"}</p></td><td className="p-4 text-sm">{member.department}</td><td className="p-4"><button onClick={() => update({ ...member, visible: !member.visible })} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${member.visible ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-slate-500/10 text-slate-500"}`}>{member.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}{member.visible ? "Visible" : "Hidden"}</button></td><td className="p-4"><div className="flex justify-end gap-1"><button aria-label="Move up" disabled={index === 0} onClick={() => move(member.id, -1)} className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-white/10"><ArrowUp className="h-4 w-4" /></button><button aria-label="Move down" disabled={index === members.length - 1} onClick={() => move(member.id, 1)} className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-white/10"><ArrowDown className="h-4 w-4" /></button><button aria-label="Edit member" onClick={() => setEditing(member)} className="rounded-lg p-2 text-primary hover:bg-primary/10"><Pencil className="h-4 w-4" /></button><button aria-label="Delete member" onClick={() => { if (window.confirm(`Delete ${member.name || "this member"}?`)) setMembers((current) => current.filter((item) => item.id !== member.id)); }} className="rounded-lg p-2 text-rose-500 hover:bg-rose-500/10"><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div><div className="flex justify-end border-t border-slate-200/70 p-4 dark:border-white/10"><button onClick={() => { if (window.confirm("Restore the original team list?")) setMembers(defaultTeamMembers); }} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary"><RotateCcw className="h-4 w-4" />Restore defaults</button></div></div>
    </div>
    {editing && <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"><form onSubmit={submit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl dark:bg-[#101827] sm:rounded-3xl"><div className="mb-6 flex items-start justify-between"><div><h2 className="text-2xl font-black">{members.some((member) => member.id === editing.id) ? "Edit member" : "Add team member"}</h2><p className="mt-1 text-sm text-slate-500 dark:text-white/55">Use a public image path, such as /images/hero/name.png.</p></div><button type="button" onClick={() => setEditing(null)} className="rounded-lg px-3 py-2 text-sm font-bold text-slate-500">Cancel</button></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Name" value={editing.name} onChange={(name) => setEditing({ ...editing, name })} required /><Field label="Role" value={editing.role} onChange={(role) => setEditing({ ...editing, role })} required /><label className="text-sm font-bold sm:col-span-2">Image path<input required value={editing.image} onChange={(event) => setEditing({ ...editing, image: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-primary dark:border-white/10 dark:bg-white/5" /></label><label className="text-sm font-bold">Department<select value={editing.department} onChange={(event) => setEditing({ ...editing, department: event.target.value as TeamMember["department"] })} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-primary dark:border-white/10 dark:bg-white/5">{departments.map((department) => <option key={department}>{department}</option>)}</select></label><label className="mt-7 flex items-center gap-3 text-sm font-bold"><input type="checkbox" checked={editing.visible} onChange={(event) => setEditing({ ...editing, visible: event.target.checked })} className="h-4 w-4 accent-primary" />Visible on Team page</label><label className="text-sm font-bold sm:col-span-2">Bio<textarea required rows={4} value={editing.description} onChange={(event) => setEditing({ ...editing, description: event.target.value })} className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-primary dark:border-white/10 dark:bg-white/5" /></label></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setEditing(null)} className="rounded-xl px-4 py-3 text-sm font-bold">Cancel</button><button className="premium-gradient-button rounded-xl px-5 py-3 text-sm font-bold">Save member</button></div></form></div>}
  </main>;
}

function Field({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="text-sm font-bold">{label}<input required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-primary dark:border-white/10 dark:bg-white/5" /></label>;
}
