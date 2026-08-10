"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Eye, EyeOff, Grid as GridIcon, List as ListIcon, Pencil, Plus, Search, Trash2, Users, X } from "lucide-react";
import { getClientCsrfToken } from "@/lib/auth/client-csrf";
import type { TeamMemberRecord } from "@/lib/team/types";
import { showToast } from "@/components/ui/Toast";

type TeamForm = Omit<TeamMemberRecord, "id" | "createdAt" | "updatedAt">;
type ApiPayload = { data?: TeamMemberRecord | TeamMemberRecord[]; error?: string; fieldErrors?: Record<string, string[]> };

const departments = ["Executive", "Engineering", "Mobile", "Sales", "Marketing"];

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 160);
}

function emptyForm(): TeamForm {
  return { name: "", slug: "", role: "", department: "Engineering", bio: "", image: null, email: null, phone: null, linkedinUrl: null, facebookUrl: null, twitterUrl: null, githubUrl: null, displayOrder: 0, featured: false, status: "DRAFT" };
}

function imageFallback(name: string) {
  return `https://ui-avatars.com/api/?background=eff6ff&color=2563eb&name=${encodeURIComponent(name || "Team member")}`;
}

function readApiError(payload: unknown): ApiPayload {
  return typeof payload === "object" && payload !== null ? payload as ApiPayload : {};
}

export default function TeamAdmin({ initialMembers = [] }: { initialMembers?: TeamMemberRecord[] }) {
  const [members, setMembers] = useState<TeamMemberRecord[]>(initialMembers);
  const [loading, setLoading] = useState(initialMembers.length === 0);
  const [listError, setListError] = useState<string | null>(null);
  const [draft, setDraft] = useState<TeamForm | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TeamMemberRecord | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const loadMembers = async () => {
    setLoading(true);
    setListError(null);
    try {
      const response = await fetch("/api/admin/team", { credentials: "same-origin", cache: "no-store" });
      const payload = readApiError(await response.json().catch(() => ({})));
      if (!response.ok || !Array.isArray(payload.data)) throw new Error(payload.error ?? "Unable to load team members.");
      setMembers(payload.data);
    } catch (error) {
      setListError(error instanceof Error ? error.message : "Unable to load team members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialMembers.length === 0) void loadMembers();
    void fetch("/api/auth/csrf", { credentials: "same-origin" });
  }, [initialMembers.length]);

  const visibleCount = useMemo(() => members.filter((member) => member.status === "PUBLISHED").length, [members]);
  const filteredMembers = useMemo(() => members.filter((member) => {
    const query = searchQuery.toLowerCase();
    return (!query || member.name.toLowerCase().includes(query) || member.role.toLowerCase().includes(query)) && (departmentFilter === "All" || member.department === departmentFilter);
  }), [members, searchQuery, departmentFilter]);

  const ensureCsrfToken = async () => {
    let token = getClientCsrfToken();
    if (token) return token;
    await fetch("/api/auth/csrf", { credentials: "same-origin" });
    token = getClientCsrfToken();
    return token;
  };

  const openCreate = () => { setEditingId(null); setFormError(null); setDraft(emptyForm()); };
  const openEdit = (member: TeamMemberRecord) => {
    const { id, createdAt, updatedAt, ...form } = member;
    void id; void createdAt; void updatedAt;
    setEditingId(member.id); setFormError(null); setDraft(form);
  };

  const saveMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;
    setSubmitting(true); setFormError(null);
    const payload: TeamForm = { ...draft, slug: draft.slug || slugify(draft.name) };
    try {
      const csrfToken = await ensureCsrfToken();
      if (!csrfToken) throw new Error("Your session security token could not be created. Please try again.");
      const response = await fetch(editingId ? `/api/admin/team/${editingId}` : "/api/admin/team", {
        method: editingId ? "PATCH" : "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrfToken }, body: JSON.stringify(payload),
      });
      const apiPayload = readApiError(await response.json().catch(() => ({})));
      if (!response.ok) throw new Error(apiPayload.error ?? "Unable to save this team member.");
      setDraft(null); setEditingId(null); await loadMembers(); showToast.success(editingId ? "Team member updated." : "Team member created.");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to save this team member.");
    } finally { setSubmitting(false); }
  };

  const deleteMember = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const csrfToken = await ensureCsrfToken();
      if (!csrfToken) throw new Error("Your session security token could not be created. Please try again.");
      const response = await fetch(`/api/admin/team/${deleteTarget.id}`, { method: "DELETE", credentials: "same-origin", headers: { "X-CSRF-Token": csrfToken } });
      const payload = readApiError(await response.json().catch(() => ({})));
      if (!response.ok) throw new Error(payload.error ?? "Unable to delete this team member.");
      setDeleteTarget(null); await loadMembers(); showToast.success("Team member removed.");
    } catch (error) { showToast.error(error instanceof Error ? error.message : "Unable to delete this team member."); }
    finally { setDeleting(false); }
  };

  const updateDraft = <K extends keyof TeamForm>(key: K, value: TeamForm[K]) => setDraft((current) => current ? { ...current, [key]: value } : current);

  if (loading) return <div className="flex min-h-[400px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-brand" /></div>;

  return <div className="space-y-6 pb-10">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">Team Management</h1><p className="mt-2 text-base text-slate-500 dark:text-zinc-400">Manage your team directory, roles, and public profiles.</p></div>
      <button onClick={openCreate} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-base font-bold text-white shadow-sm transition hover:bg-brand"><Plus className="h-4 w-4" />Add Member</button>
    </div>
    {listError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-base text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">{listError}<button onClick={() => void loadMembers()} className="ml-3 font-bold underline">Try again</button></div> : null}
    <div className="grid gap-4 sm:grid-cols-2"><StatCard icon={<Users className="h-5 w-5" />} label="Total Members" value={members.length} /><StatCard icon={<Eye className="h-5 w-5" />} label="Published Profiles" value={visibleCount} accent="emerald" /></div>
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111827] sm:flex-row">
      <div className="flex w-full flex-1 gap-3 sm:w-auto"><div className="relative w-full max-w-sm"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search by name or role..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-base outline-none focus:border-brand dark:border-white/10 dark:bg-zinc-900" /></div><select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-base dark:border-white/10 dark:bg-zinc-900"><option value="All">All Departments</option>{departments.map((department) => <option key={department}>{department}</option>)}</select></div>
      <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-zinc-900"><button onClick={() => setViewMode("list")} className={`rounded-md p-1.5 ${viewMode === "list" ? "bg-white shadow-sm dark:bg-[#181d2b]" : "text-slate-500"}`} aria-label="List view"><ListIcon className="h-4 w-4" /></button><button onClick={() => setViewMode("grid")} className={`rounded-md p-1.5 ${viewMode === "grid" ? "bg-white shadow-sm dark:bg-[#181d2b]" : "text-slate-500"}`} aria-label="Grid view"><GridIcon className="h-4 w-4" /></button></div>
    </div>
    {filteredMembers.length === 0 ? <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-16 dark:border-white/10 dark:bg-[#111827]"><Users className="h-6 w-6 text-slate-400" /><h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No members found</h2><p className="mt-1 text-base text-slate-500">Add a team member or adjust your filters.</p></div> : viewMode === "grid" ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filteredMembers.map((member) => <MemberCard key={member.id} member={member} onEdit={openEdit} onDelete={setDeleteTarget} />)}</div> : <MemberTable members={filteredMembers} onEdit={openEdit} onDelete={setDeleteTarget} />}
    {draft ? <MemberModal draft={draft} editing={Boolean(editingId)} error={formError} submitting={submitting} onClose={() => !submitting && setDraft(null)} onSubmit={saveMember} onChange={updateDraft} /> : null}
    {deleteTarget ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#111827]"><h2 className="text-xl font-bold text-slate-900 dark:text-white">Delete {deleteTarget.name}?</h2><p className="mt-2 text-base text-slate-500 dark:text-zinc-400">This removes the profile from public and admin lists. The record is retained as a soft delete.</p><div className="mt-6 flex justify-end gap-3"><button disabled={deleting} onClick={() => setDeleteTarget(null)} className="rounded-xl px-4 py-2 font-bold text-slate-600 dark:text-zinc-300">Cancel</button><button disabled={deleting} onClick={() => void deleteMember()} className="rounded-xl bg-rose-600 px-4 py-2 font-bold text-white disabled:opacity-60">{deleting ? "Deleting…" : "Delete"}</button></div></div></div> : null}
  </div>;
}

function StatCard({ icon, label, value, accent = "blue" }: { icon: React.ReactNode; label: string; value: number; accent?: "blue" | "emerald" }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111827]"><div className="flex items-center gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent === "emerald" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-blue-50 text-brand dark:bg-brand/10"}`}>{icon}</div><div><p className="text-base font-bold text-slate-500 dark:text-zinc-400">{label}</p><p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p></div></div></div>; }
function MemberCard({ member, onEdit, onDelete }: { member: TeamMemberRecord; onEdit: (member: TeamMemberRecord) => void; onDelete: (member: TeamMemberRecord) => void }) { const published = member.status === "PUBLISHED"; return <div className="group relative flex flex-col items-center rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111827]"><div className="absolute right-4 top-4 flex gap-1"><button onClick={() => onEdit(member)} className="rounded-full bg-slate-100 p-2 text-brand dark:bg-zinc-800"><Pencil className="h-4 w-4" /></button><button onClick={() => onDelete(member)} className="rounded-full bg-slate-100 p-2 text-rose-500 dark:bg-zinc-800"><Trash2 className="h-4 w-4" /></button></div><img src={member.image || imageFallback(member.name)} alt="" onError={(event) => { event.currentTarget.src = imageFallback(member.name); }} className="h-24 w-24 rounded-full object-cover"/><h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{member.name}</h2><p className="text-base text-brand dark:text-brand">{member.role}</p><span className="mt-2 text-xs text-slate-500">{member.department}</span><span className={`mt-4 text-xs font-bold ${published ? "text-emerald-600" : "text-slate-500"}`}>{published ? "Published" : "Draft"}</span></div>; }
function MemberTable({ members, onEdit, onDelete }: { members: TeamMemberRecord[]; onEdit: (member: TeamMemberRecord) => void; onDelete: (member: TeamMemberRecord) => void }) { return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111827]"><div className="overflow-x-auto"><table className="w-full text-left text-base"><thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-zinc-900"><tr><th className="px-6 py-4">Team Member</th><th className="px-6 py-4">Department</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody>{members.map((member) => <tr key={member.id} className="border-t border-slate-100 dark:border-white/5"><td className="px-6 py-4"><div className="flex items-center gap-3"><img src={member.image || imageFallback(member.name)} alt="" onError={(event) => { event.currentTarget.src = imageFallback(member.name); }} className="h-10 w-10 rounded-full object-cover"/><div><p className="font-bold text-slate-900 dark:text-white">{member.name}</p><p className="text-slate-500">{member.role}</p></div></div></td><td className="px-6 py-4">{member.department}</td><td className="px-6 py-4"><span className={`font-bold ${member.status === "PUBLISHED" ? "text-emerald-600" : "text-slate-500"}`}>{member.status === "PUBLISHED" ? <Eye className="mr-1 inline h-3.5 w-3.5" /> : <EyeOff className="mr-1 inline h-3.5 w-3.5" />}{member.status}</span></td><td className="px-6 py-4 text-right"><button onClick={() => onEdit(member)} className="p-2 text-brand"><Pencil className="h-4 w-4" /></button><button onClick={() => onDelete(member)} className="p-2 text-rose-500"><Trash2 className="h-4 w-4" /></button></td></tr>)}</tbody></table></div></div>; }
function MemberModal({ draft, editing, error, submitting, onClose, onSubmit, onChange }: { draft: TeamForm; editing: boolean; error: string | null; submitting: boolean; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onChange: <K extends keyof TeamForm>(key: K, value: TeamForm[K]) => void }) { const input = "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-base outline-none focus:border-brand dark:border-white/10 dark:bg-zinc-900"; return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"><form onSubmit={onSubmit} noValidate className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#111827]"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-white/5"><h2 className="text-xl font-bold text-slate-900 dark:text-white">{editing ? "Edit Profile" : "New Team Member"}</h2><button type="button" disabled={submitting} onClick={onClose}><X className="h-5 w-5" /></button></div><div className="flex-1 overflow-y-auto p-6"><div className="grid gap-5 sm:grid-cols-2"><Label label="Full Name"><input required value={draft.name} onChange={(e) => { onChange("name", e.target.value); if (!editing) onChange("slug", slugify(e.target.value)); }} className={input}/></Label><Label label="Role"><input required value={draft.role} onChange={(e) => onChange("role", e.target.value)} className={input}/></Label><Label label="Slug"><input required value={draft.slug} onChange={(e) => onChange("slug", slugify(e.target.value))} className={input}/></Label><Label label="Department"><input required list="team-departments" value={draft.department} onChange={(e) => onChange("department", e.target.value)} className={input}/><datalist id="team-departments">{departments.map((department) => <option key={department} value={department}/>)}</datalist></Label><Label label="Email"><input type="email" value={draft.email ?? ""} onChange={(e) => onChange("email", e.target.value || null)} className={input}/></Label><Label label="Phone"><input value={draft.phone ?? ""} onChange={(e) => onChange("phone", e.target.value || null)} className={input}/></Label><Label label="LinkedIn URL"><input type="url" value={draft.linkedinUrl ?? ""} onChange={(e) => onChange("linkedinUrl", e.target.value || null)} className={input}/></Label><Label label="Facebook URL"><input type="url" value={draft.facebookUrl ?? ""} onChange={(e) => onChange("facebookUrl", e.target.value || null)} className={input}/></Label><Label label="Twitter URL"><input type="url" value={draft.twitterUrl ?? ""} onChange={(e) => onChange("twitterUrl", e.target.value || null)} className={input}/></Label><Label label="GitHub URL"><input type="url" value={draft.githubUrl ?? ""} onChange={(e) => onChange("githubUrl", e.target.value || null)} className={input}/></Label><Label label="Display order"><input type="number" min="0" value={draft.displayOrder} onChange={(e) => onChange("displayOrder", Number(e.target.value) || 0)} className={input}/></Label><Label label="Image URL"><input type="url" value={draft.image ?? ""} onChange={(e) => onChange("image", e.target.value || null)} className={input}/></Label><Label label="Public status"><select value={draft.status} onChange={(e) => onChange("status", e.target.value as TeamForm["status"])} className={input}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></Label><label className="flex items-center gap-3 text-base font-bold text-slate-700 dark:text-zinc-300"><input type="checkbox" checked={draft.featured} onChange={(e) => onChange("featured", e.target.checked)} className="h-5 w-5"/>Feature this member</label><Label label="Biography" wide><textarea required rows={4} value={draft.bio} onChange={(e) => onChange("bio", e.target.value)} className={input}/></Label></div>{error ? <p className="mt-4 text-base text-rose-600">{error}</p> : null}</div><div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-white/5 dark:bg-zinc-900/50"><button type="button" onClick={onClose} disabled={submitting} className="rounded-xl px-5 py-2.5 font-bold">Cancel</button><button disabled={submitting} className="rounded-xl bg-brand px-5 py-2.5 font-bold text-white disabled:opacity-60">{submitting ? "Saving…" : "Save Profile"}</button></div></form></div>; }
function Label({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) { return <label className={`text-base font-bold text-slate-700 dark:text-zinc-300 ${wide ? "sm:col-span-2" : ""}`}>{label}{children}</label>; }
