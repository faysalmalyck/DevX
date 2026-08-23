"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Eye,
  EyeOff,
  Grid as GridIcon,
  List as ListIcon,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import { getClientCsrfToken } from "@/lib/auth/client-csrf";
import {
  getTeamMemberProfileFieldErrors,
  type TeamMemberProfileStatus,
} from "@/lib/team/profile-status";
import type { TeamMemberRecord } from "@/lib/team/types";
import {
  TEAM_MEMBER_DEPARTMENTS,
  teamMemberDepartmentLabel,
  teamMemberSchema,
} from "@/lib/validations/team";
import { showToast } from "@/components/ui/Toast";

type TeamForm = Omit<
  TeamMemberRecord,
  "id" | "legacyDepartment" | "profileStatus" | "createdAt" | "updatedAt" | "accessRole" | "salesRole"
> & { accessRole: TeamAccessChoice; salesRole: TeamMemberRecord["salesRole"] | null };
type TeamAccessChoice = "NONE" | "ADMINISTRATOR" | "SALES_MANAGER" | "SALES_AGENT";
type FieldErrors = Record<string, string[]>;
type ApiPayload = {
  data?: TeamMemberRecord | TeamMemberRecord[];
  salesAccess?: { status?: string; activationUrl?: string };
  error?: string;
  fieldErrors?: FieldErrors;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

function emptyForm(): TeamForm {
  return {
    name: null,
    slug: null,
    role: null,
    department: null,
    bio: null,
    image: null,
    email: null,
    phone: null,
    linkedinUrl: null,
    facebookUrl: null,
    twitterUrl: null,
    githubUrl: null,
    displayOrder: 0,
    featured: false,
    status: "DRAFT",
    accessRole: "NONE",
    salesRole: null,
  };
}

function imageFallback(name: string | null) {
  return `https://ui-avatars.com/api/?background=eff6ff&color=2563eb&name=${encodeURIComponent(name || "Team member")}`;
}

function displayName(member: Pick<TeamMemberRecord, "name">) {
  return member.name?.trim() || "Unnamed team member";
}

function displayDepartment(member: Pick<TeamMemberRecord, "department" | "legacyDepartment">) {
  const department = teamMemberDepartmentLabel(member.department);
  if (department) return department;
  if (member.legacyDepartment) return `${member.legacyDepartment} (legacy)`;
  return "Unassigned";
}

function readApiError(payload: unknown): ApiPayload {
  return typeof payload === "object" && payload !== null ? payload as ApiPayload : {};
}

function issuesToFieldErrors(issues: { path: PropertyKey[]; message: string }[]): FieldErrors {
  return issues.reduce<FieldErrors>((errors, issue) => {
    const field = String(issue.path[0] ?? "form");
    errors[field] = [...(errors[field] ?? []), issue.message];
    return errors;
  }, {});
}

function mergeFieldErrors(...sources: FieldErrors[]) {
  return sources.reduce<FieldErrors>((merged, source) => {
    for (const [field, messages] of Object.entries(source)) {
      merged[field] = [...(merged[field] ?? []), ...messages];
    }
    return merged;
  }, {});
}

export default function TeamAdmin({ initialMembers = [] }: { initialMembers?: TeamMemberRecord[] }) {
  const [members, setMembers] = useState<TeamMemberRecord[]>(initialMembers);
  const [loading, setLoading] = useState(initialMembers.length === 0);
  const [listError, setListError] = useState<string | null>(null);
  const [draft, setDraft] = useState<TeamForm | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [legacyDepartment, setLegacyDepartment] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [apiFieldErrors, setApiFieldErrors] = useState<FieldErrors>({});
  const [showProfileErrors, setShowProfileErrors] = useState(false);
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
      const response = await fetch("/api/admin/team", {
        credentials: "same-origin",
        cache: "no-store",
      });
      const payload = readApiError(await response.json().catch(() => ({})));
      if (!response.ok || !Array.isArray(payload.data)) {
        throw new Error(payload.error ?? "Unable to load team members.");
      }
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

  const visibleCount = useMemo(
    () => members.filter((member) => member.status === "PUBLISHED").length,
    [members],
  );
  const filteredMembers = useMemo(() => members.filter((member) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery = !query
      || displayName(member).toLowerCase().includes(query)
      || (member.role ?? "").toLowerCase().includes(query);
    return matchesQuery && (departmentFilter === "All" || member.department === departmentFilter);
  }), [members, searchQuery, departmentFilter]);

  const profileFieldErrors = useMemo(
    () => draft && showProfileErrors ? getTeamMemberProfileFieldErrors(draft) : {},
    [draft, showProfileErrors],
  );
  const fieldErrors = useMemo(
    () => mergeFieldErrors(profileFieldErrors, apiFieldErrors),
    [profileFieldErrors, apiFieldErrors],
  );

  const ensureCsrfToken = async () => {
    let token = getClientCsrfToken();
    if (token) return token;
    await fetch("/api/auth/csrf", { credentials: "same-origin" });
    token = getClientCsrfToken();
    return token;
  };

  const openCreate = () => {
    setEditingId(null);
    setLegacyDepartment(null);
    setFormError(null);
    setApiFieldErrors({});
    setShowProfileErrors(false);
    setDraft(emptyForm());
  };

  const openEdit = (member: TeamMemberRecord) => {
    const {
      id,
      legacyDepartment: memberLegacyDepartment,
      profileStatus,
      createdAt,
      updatedAt,
      ...form
    } = member;
    void id;
    void profileStatus;
    void createdAt;
    void updatedAt;
    setEditingId(member.id);
    setLegacyDepartment(memberLegacyDepartment);
    setFormError(null);
    setApiFieldErrors({});
    setShowProfileErrors(false);
    setDraft({ ...form, accessRole: (member.accessRole ?? member.salesRole ?? "NONE") as TeamAccessChoice, salesRole: member.salesRole ?? null });
  };

  const saveMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;

    const candidate: TeamForm = {
      ...draft,
      slug: draft.slug || (draft.name ? slugify(draft.name) || null : null),
    };
    setShowProfileErrors(true);
    setApiFieldErrors({});
    setFormError(null);

    const draftValidation = teamMemberSchema.safeParse(candidate);
    if (!draftValidation.success) {
      setApiFieldErrors(issuesToFieldErrors(draftValidation.error.issues));
      setFormError("Please correct the highlighted fields.");
      return;
    }

    const completenessErrors = getTeamMemberProfileFieldErrors(draftValidation.data);
    if (draftValidation.data.status === "PUBLISHED" && Object.keys(completenessErrors).length > 0) {
      setFormError("Complete the required profile fields before publishing this member.");
      return;
    }

    setSubmitting(true);
    const wasEditing = Boolean(editingId);
    try {
      const csrfToken = await ensureCsrfToken();
      if (!csrfToken) {
        throw new Error("Your session security token could not be created. Please try again.");
      }
      const response = await fetch(editingId ? `/api/admin/team/${editingId}` : "/api/admin/team", {
        method: editingId ? "PATCH" : "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(draftValidation.data),
      });
      const apiPayload = readApiError(await response.json().catch(() => ({})));
      if (!response.ok) {
        setApiFieldErrors(apiPayload.fieldErrors ?? {});
        throw new Error(apiPayload.error ?? "Unable to save this team member.");
      }
      setDraft(null);
      setEditingId(null);
      setLegacyDepartment(null);
      await loadMembers();
      if (apiPayload.salesAccess?.activationUrl) {
        window.prompt("Copy this one-time Sales activation link and share it privately:", apiPayload.salesAccess.activationUrl);
      }
      showToast.success(wasEditing ? "Team member updated." : "Team member created.");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to save this team member.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMember = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const csrfToken = await ensureCsrfToken();
      if (!csrfToken) {
        throw new Error("Your session security token could not be created. Please try again.");
      }
      const response = await fetch(`/api/admin/team/${deleteTarget.id}`, {
        method: "DELETE",
        credentials: "same-origin",
        headers: { "X-CSRF-Token": csrfToken },
      });
      const payload = readApiError(await response.json().catch(() => ({})));
      if (!response.ok) throw new Error(payload.error ?? "Unable to delete this team member.");
      setDeleteTarget(null);
      await loadMembers();
      showToast.success("Team member removed.");
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : "Unable to delete this team member.");
    } finally {
      setDeleting(false);
    }
  };

  const updateDraft = <K extends keyof TeamForm>(key: K, value: TeamForm[K]) => {
    setDraft((current) => current ? { ...current, [key]: value } : current);
    setApiFieldErrors({});
  };

  if (loading) {
    return <div className="flex min-h-[400px] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-brand" /></div>;
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">Team Management</h1>
          <p className="mt-2 text-base text-slate-500 dark:text-zinc-400">Manage your team directory, roles, and public profiles.</p>
        </div>
        <button onClick={openCreate} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-base font-bold text-white shadow-sm transition hover:bg-brand">
          <Plus className="h-4 w-4" />Add Member
        </button>
      </div>

      {listError ? <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-base text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">{listError}<button onClick={() => void loadMembers()} className="ml-3 font-bold underline">Try again</button></div> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard icon={<Users className="h-5 w-5" />} label="Total Members" value={members.length} />
        <StatCard icon={<Eye className="h-5 w-5" />} label="Published Profiles" value={visibleCount} accent="emerald" />
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111827] sm:flex-row">
        <div className="flex w-full flex-1 gap-3 sm:w-auto">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search by name or role..." className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-base outline-none focus:border-brand dark:border-white/10 dark:bg-zinc-900" />
          </div>
          <select aria-label="Filter by department" value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-base dark:border-white/10 dark:bg-zinc-900">
            <option value="All">All Departments</option>
            {TEAM_MEMBER_DEPARTMENTS.map((department) => <option key={department.value} value={department.value}>{department.label}</option>)}
          </select>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-zinc-900">
          <button onClick={() => setViewMode("list")} className={`rounded-md p-1.5 ${viewMode === "list" ? "bg-white shadow-sm dark:bg-[#181d2b]" : "text-slate-500"}`} aria-label="List view"><ListIcon className="h-4 w-4" /></button>
          <button onClick={() => setViewMode("grid")} className={`rounded-md p-1.5 ${viewMode === "grid" ? "bg-white shadow-sm dark:bg-[#181d2b]" : "text-slate-500"}`} aria-label="Grid view"><GridIcon className="h-4 w-4" /></button>
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-16 dark:border-white/10 dark:bg-[#111827]">
          <Users className="h-6 w-6 text-slate-400" />
          <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No members found</h2>
          <p className="mt-1 text-base text-slate-500">Add a team member or adjust your filters.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMembers.map((member) => <MemberCard key={member.id} member={member} onEdit={openEdit} onDelete={setDeleteTarget} />)}
        </div>
      ) : (
        <MemberTable members={filteredMembers} onEdit={openEdit} onDelete={setDeleteTarget} />
      )}

      {draft ? <MemberModal draft={draft} editing={Boolean(editingId)} legacyDepartment={legacyDepartment} error={formError} fieldErrors={fieldErrors} submitting={submitting} onClose={() => !submitting && setDraft(null)} onSubmit={saveMember} onChange={updateDraft} /> : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="delete-team-member-title" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#111827]">
            <h2 id="delete-team-member-title" className="text-xl font-bold text-slate-900 dark:text-white">Delete {displayName(deleteTarget)}?</h2>
            <p className="mt-2 text-base text-slate-500 dark:text-zinc-400">This removes the profile from public and admin lists. The record is retained as a soft delete.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button disabled={deleting} onClick={() => setDeleteTarget(null)} className="rounded-lg px-4 py-2 font-bold text-slate-600 dark:text-zinc-300">Cancel</button>
              <button disabled={deleting} onClick={() => void deleteMember()} className="rounded-lg bg-rose-600 px-4 py-2 font-bold text-white disabled:opacity-60">{deleting ? "Deleting…" : "Delete"}</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ icon, label, value, accent = "blue" }: { icon: ReactNode; label: string; value: number; accent?: "blue" | "emerald" }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111827]"><div className="flex items-center gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent === "emerald" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-blue-50 text-brand dark:bg-brand/10"}`}>{icon}</div><div><p className="text-base font-bold text-slate-500 dark:text-zinc-400">{label}</p><p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p></div></div></div>;
}

export function ProfileStatusBadge({ status }: { status: TeamMemberProfileStatus }) {
  return <Badge variant={status === "COMPLETE" ? "success" : "warning"} dot>{status === "COMPLETE" ? "Complete" : "Incomplete"}</Badge>;
}

function PublicationStatus({ status }: { status: TeamMemberRecord["status"] }) {
  const published = status === "PUBLISHED";
  return <span className={`font-bold ${published ? "text-emerald-600" : "text-slate-500"}`}>{published ? <Eye className="mr-1 inline h-3.5 w-3.5" /> : <EyeOff className="mr-1 inline h-3.5 w-3.5" />}{published ? "Published" : "Draft"}</span>;
}

function MemberCard({ member, onEdit, onDelete }: { member: TeamMemberRecord; onEdit: (member: TeamMemberRecord) => void; onDelete: (member: TeamMemberRecord) => void }) {
  return <div className="group relative flex flex-col items-center rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111827]"><div className="absolute right-4 top-4 flex gap-1"><button aria-label={`Edit ${displayName(member)}`} onClick={() => onEdit(member)} className="rounded-full bg-slate-100 p-2 text-brand dark:bg-zinc-800"><Pencil className="h-4 w-4" /></button><button aria-label={`Delete ${displayName(member)}`} onClick={() => onDelete(member)} className="rounded-full bg-slate-100 p-2 text-rose-500 dark:bg-zinc-800"><Trash2 className="h-4 w-4" /></button></div><img src={member.image || imageFallback(member.name)} alt="" onError={(event) => { event.currentTarget.src = imageFallback(member.name); }} className="h-24 w-24 rounded-full object-cover" /><h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{displayName(member)}</h2><p className="text-base text-brand dark:text-brand">{member.role || "Role not set"}</p><span className="mt-2 text-xs text-slate-500">{displayDepartment(member)}</span><div className="mt-4 flex flex-wrap items-center justify-center gap-2"><ProfileStatusBadge status={member.profileStatus} /><PublicationStatus status={member.status} /></div></div>;
}

function MemberTable({ members, onEdit, onDelete }: { members: TeamMemberRecord[]; onEdit: (member: TeamMemberRecord) => void; onDelete: (member: TeamMemberRecord) => void }) {
  return <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111827]"><div className="overflow-x-auto"><table className="w-full text-left text-base"><thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-zinc-900"><tr><th className="px-6 py-4">Team Member</th><th className="px-6 py-4">Department</th><th className="px-6 py-4">Profile status</th><th className="px-6 py-4">Publication</th><th className="px-6 py-4 text-right">Actions</th></tr></thead><tbody>{members.map((member) => <tr key={member.id} className="border-t border-slate-100 dark:border-white/5"><td className="px-6 py-4"><div className="flex items-center gap-3"><img src={member.image || imageFallback(member.name)} alt="" onError={(event) => { event.currentTarget.src = imageFallback(member.name); }} className="h-10 w-10 rounded-full object-cover" /><div><p className="font-bold text-slate-900 dark:text-white">{displayName(member)}</p><p className="text-slate-500">{member.role || "Role not set"}</p></div></div></td><td className="px-6 py-4">{displayDepartment(member)}</td><td className="px-6 py-4"><ProfileStatusBadge status={member.profileStatus} /></td><td className="px-6 py-4"><PublicationStatus status={member.status} /></td><td className="px-6 py-4 text-right"><button aria-label={`Edit ${displayName(member)}`} onClick={() => onEdit(member)} className="p-2 text-brand"><Pencil className="h-4 w-4" /></button><button aria-label={`Delete ${displayName(member)}`} onClick={() => onDelete(member)} className="p-2 text-rose-500"><Trash2 className="h-4 w-4" /></button></td></tr>)}</tbody></table></div></div>;
}

function MemberModal({ draft, editing, legacyDepartment, error, fieldErrors, submitting, onClose, onSubmit, onChange }: { draft: TeamForm; editing: boolean; legacyDepartment: string | null; error: string | null; fieldErrors: FieldErrors; submitting: boolean; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onChange: <K extends keyof TeamForm>(key: K, value: TeamForm[K]) => void }) {
  const input = "mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base outline-none focus:border-brand dark:border-white/10 dark:bg-zinc-900";
  const fieldError = (field: string) => fieldErrors[field]?.[0];
  const inputClass = (field: string) => `${input} ${fieldError(field) ? "border-rose-500 focus:border-rose-500" : ""}`;

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"><form onSubmit={onSubmit} noValidate className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#111827]"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-white/5"><div><h2 className="text-xl font-bold text-slate-900 dark:text-white">{editing ? "Edit TeamMember" : "Add TeamMember"}</h2><p className="mt-1 text-sm text-slate-500">Profile details and login access are managed together.</p></div><button type="button" aria-label="Close profile form" disabled={submitting} onClick={onClose}><X className="h-5 w-5" /></button></div><div className="flex-1 overflow-y-auto p-6"><p className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">Required profile fields are marked with <span aria-hidden="true">*</span>. Login access is granted from the controlled Access &amp; Role selector.</p>{legacyDepartment ? <p className="mb-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">Legacy department “{legacyDepartment}” is not supported. Select a department below.</p> : null}<div className="grid gap-5 sm:grid-cols-2"><Field label="Full name" field="name" required error={fieldError("name")}><input id="team-member-name" value={draft.name ?? ""} onChange={(event) => { const name = event.target.value || null; onChange("name", name); if (!editing) onChange("slug", name ? slugify(name) || null : null); }} className={inputClass("name")} /></Field><Field label="Public title" field="role" required error={fieldError("role")}><input id="team-member-role" value={draft.role ?? ""} onChange={(event) => onChange("role", event.target.value || null)} className={inputClass("role")} /></Field><Field label="Access & Role" field="accessRole" required error={fieldError("accessRole")}><select id="team-member-accessRole" value={draft.accessRole ?? "NONE"} onChange={(event) => { const value = event.target.value as TeamAccessChoice; onChange("accessRole", value); if (value === "SALES_MANAGER") { onChange("department", "SALES"); onChange("salesRole", "SALES_MANAGER"); onChange("role", "Sales Manager"); } else if (value === "SALES_AGENT") { onChange("department", "SALES"); onChange("salesRole", "SALES_AGENT"); onChange("role", "Business Development Executive"); } else { onChange("salesRole", null); } }} className={inputClass("accessRole")}><option value="NONE">No Login Access</option><option value="ADMINISTRATOR">Administrator</option><option value="SALES_MANAGER">Sales Manager</option><option value="SALES_AGENT">Business Development Executive</option></select></Field><Field label="Slug" field="slug" required error={fieldError("slug")}><input id="team-member-slug" value={draft.slug ?? ""} onChange={(event) => onChange("slug", slugify(event.target.value) || null)} className={inputClass("slug")} /></Field><Field label="Department" field="department" required error={fieldError("department")}><select id="team-member-department" value={draft.department ?? ""} onChange={(event) => onChange("department", (event.target.value || null) as TeamForm["department"])} className={inputClass("department")}><option value="">Choose a department</option>{TEAM_MEMBER_DEPARTMENTS.map((department) => <option key={department.value} value={department.value}>{department.label}</option>)}</select></Field><Field label="Email" field="email" error={fieldError("email")}><input id="team-member-email" type="email" value={draft.email ?? ""} onChange={(event) => onChange("email", event.target.value || null)} className={inputClass("email")} /></Field><Field label="Phone" field="phone" error={fieldError("phone")}><input id="team-member-phone" value={draft.phone ?? ""} onChange={(event) => onChange("phone", event.target.value || null)} className={inputClass("phone")} /></Field><Field label="LinkedIn URL" field="linkedinUrl" error={fieldError("linkedinUrl")}><input id="team-member-linkedin" type="url" value={draft.linkedinUrl ?? ""} onChange={(event) => onChange("linkedinUrl", event.target.value || null)} className={inputClass("linkedinUrl")} /></Field><Field label="Facebook URL" field="facebookUrl" error={fieldError("facebookUrl")}><input id="team-member-facebook" type="url" value={draft.facebookUrl ?? ""} onChange={(event) => onChange("facebookUrl", event.target.value || null)} className={inputClass("facebookUrl")} /></Field><Field label="Twitter URL" field="twitterUrl" error={fieldError("twitterUrl")}><input id="team-member-twitter" type="url" value={draft.twitterUrl ?? ""} onChange={(event) => onChange("twitterUrl", event.target.value || null)} className={inputClass("twitterUrl")} /></Field><Field label="GitHub URL" field="githubUrl" error={fieldError("githubUrl")}><input id="team-member-github" type="url" value={draft.githubUrl ?? ""} onChange={(event) => onChange("githubUrl", event.target.value || null)} className={inputClass("githubUrl")} /></Field><Field label="Display order" field="displayOrder" error={fieldError("displayOrder")}><input id="team-member-display-order" type="number" min="0" value={draft.displayOrder} onChange={(event) => onChange("displayOrder", Number(event.target.value) || 0)} className={inputClass("displayOrder")} /></Field><Field label="Image URL" field="image" error={fieldError("image")}><input id="team-member-image" type="url" value={draft.image ?? ""} onChange={(event) => onChange("image", event.target.value || null)} className={inputClass("image")} /></Field><Field label="Public status" field="status" error={fieldError("status")}><select id="team-member-status" value={draft.status} onChange={(event) => onChange("status", event.target.value as TeamForm["status"])} className={inputClass("status")}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></Field><label className="flex items-center gap-3 text-base font-bold text-slate-700 dark:text-zinc-300"><input aria-label="Feature this member" type="checkbox" checked={draft.featured} onChange={(event) => onChange("featured", event.target.checked)} className="h-5 w-5" />Feature this member</label><Field label="Biography" field="bio" required error={fieldError("bio")} wide><textarea id="team-member-bio" rows={4} value={draft.bio ?? ""} onChange={(event) => onChange("bio", event.target.value || null)} className={inputClass("bio")} /></Field></div>{error ? <p role="alert" className="mt-4 text-base text-rose-600">{error}</p> : null}</div><div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-white/5 dark:bg-zinc-900/50"><button type="button" onClick={onClose} disabled={submitting} className="rounded-lg px-5 py-2.5 font-bold">Cancel</button><button disabled={submitting} className="rounded-lg bg-brand px-5 py-2.5 font-bold text-white disabled:opacity-60">{submitting ? "Saving…" : "Save Profile"}</button></div></form></div>;
}

function SalesMemberModal({ draft, editing, error, fieldErrors, submitting, onClose, onSubmit, onChange, input, inputClass, fieldError }: { draft: TeamForm; editing: boolean; error: string | null; fieldErrors: FieldErrors; submitting: boolean; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onChange: <K extends keyof TeamForm>(key: K, value: TeamForm[K]) => void; input: string; inputClass: (field: string) => string; fieldError: (field: string) => string | undefined }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"><form onSubmit={onSubmit} noValidate className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#111827]"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-white/5"><div><h2 className="text-xl font-bold text-slate-900 dark:text-white">{editing ? "Edit Sales TeamMember" : "New Sales TeamMember"}</h2><p className="mt-1 text-sm text-slate-500">Sales access is granted only by the structured role below.</p></div><button type="button" aria-label="Close profile form" disabled={submitting} onClick={onClose}><X className="h-5 w-5" /></button></div><div className="flex-1 overflow-y-auto p-6"><div className="grid gap-5 sm:grid-cols-2"><Field label="Full name" field="name" required error={fieldError("name")}><input id="team-member-name" value={draft.name ?? ""} onChange={(event) => { const name = event.target.value || null; onChange("name", name); if (!editing) onChange("slug", name ? slugify(name) || null : null); }} className={inputClass("name")} /></Field><Field label="Public title" field="role" required error={fieldError("role")}><select id="team-member-role" value={draft.role ?? ""} onChange={(event) => onChange("role", event.target.value || null)} className={inputClass("role")}><option value="">Choose a title</option><option value="Sales Manager">Sales Manager</option><option value="Business Development Executive">Business Development Executive</option></select></Field><Field label="Slug" field="slug" required error={fieldError("slug")}><input id="team-member-slug" value={draft.slug ?? ""} onChange={(event) => onChange("slug", slugify(event.target.value) || null)} className={inputClass("slug")} /></Field><Field label="Category" field="department" required error={fieldError("department")}><select id="team-member-department" value="SALES" disabled className={inputClass("department")}><option value="SALES">Sales</option></select></Field><Field label="Structured Sales Role" field="salesRole" required error={fieldError("salesRole")}><select id="team-member-salesRole" value={draft.salesRole ?? ""} onChange={(event) => { const role = (event.target.value || null) as TeamForm["salesRole"]; onChange("salesRole", role); onChange("role", role === "SALES_MANAGER" ? "Sales Manager" : role === "SALES_AGENT" ? "Business Development Executive" : null); }} className={inputClass("salesRole")}><option value="">Choose a Sales Role</option><option value="SALES_MANAGER">Sales Manager</option><option value="SALES_AGENT">Sales Agent</option></select></Field><Field label="Email" field="email" required error={fieldError("email")}><input id="team-member-email" type="email" value={draft.email ?? ""} onChange={(event) => onChange("email", event.target.value || null)} className={inputClass("email")} /></Field><Field label="Phone" field="phone" error={fieldError("phone")}><input id="team-member-phone" value={draft.phone ?? ""} onChange={(event) => onChange("phone", event.target.value || null)} className={inputClass("phone")} /></Field><Field label="Public status" field="status" error={fieldError("status")}><select id="team-member-status" value={draft.status} onChange={(event) => onChange("status", event.target.value as TeamForm["status"])} className={inputClass("status")}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></Field><Field label="Biography" field="bio" required error={fieldError("bio")} wide><textarea id="team-member-bio" rows={4} value={draft.bio ?? ""} onChange={(event) => onChange("bio", event.target.value || null)} className={inputClass("bio")} /></Field></div>{error ? <p role="alert" className="mt-4 text-base text-rose-600">{error}</p> : null}</div><div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-white/5 dark:bg-zinc-900/50"><button type="button" onClick={onClose} disabled={submitting} className="rounded-lg px-5 py-2.5 font-bold">Cancel</button><button disabled={submitting} className="rounded-lg bg-brand px-5 py-2.5 font-bold text-white disabled:opacity-60">{submitting ? "Saving…" : "Save Sales Profile"}</button></div></form></div>;
}

function Field({ label, field, required = false, error, wide = false, children }: { label: string; field: string; required?: boolean; error?: string; wide?: boolean; children: ReactNode }) {
  const id = `team-member-${field}`;
  return <div className={`text-base font-bold text-slate-700 dark:text-zinc-300 ${wide ? "sm:col-span-2" : ""}`}><label htmlFor={id}>{label}{required ? <span className="ml-1 text-rose-600" aria-hidden="true">*</span> : null}</label>{children}{error ? <p id={`${id}-error`} role="alert" className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-300">{error}</p> : null}</div>;
}
