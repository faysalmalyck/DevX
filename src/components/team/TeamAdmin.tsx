"use client";

import { useMemo, useState, useEffect, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, RotateCcw, Trash2, Users, Search, Grid as GridIcon, List as ListIcon, X } from "lucide-react";
import { teamMembers, departments, TEAM_STORAGE_KEY } from "@/data/team";
import type { TeamMember } from "@/data/team";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

const emptyMember = (): TeamMember => ({
  id: typeof window !== "undefined" && window.crypto?.randomUUID ? window.crypto.randomUUID() : String(Date.now()),
  name: "",
  role: "",
  bio: "",
  imageUrl: "/images/hero/",
  slug: "",
  department: departments[0] || "Engineering",
  visible: true,
});

export default function TeamAdmin() {
  const [members, setMembers] = useState<TeamMember[]>(teamMembers);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [ready, setReady] = useState(false);
  
  // View states
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(TEAM_STORAGE_KEY);
      if (stored) setMembers(JSON.parse(stored));
    } catch {
      window.localStorage.removeItem(TEAM_STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      window.localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(members));
    }
  }, [members, ready]);

  const activeCount = useMemo(() => members.filter((m) => m.visible !== false).length, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            member.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = departmentFilter === "All" || member.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [members, searchQuery, departmentFilter]);

  const update = (member: TeamMember) => {
    setMembers((current) => current.map((item) => (item.id === member.id ? member : item)));
  };

  const move = (id: string, direction: -1 | 1) => {
    // Only allow manual sorting when not searching/filtering
    if (searchQuery || departmentFilter !== "All") return;
    
    setMembers((current) => {
      const index = current.findIndex((member) => member.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;

    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.name),
    };

    setMembers((current) =>
      current.some((member) => member.id === payload.id)
        ? current.map((member) => (member.id === payload.id ? payload : member))
        : [...current, payload]
    );
    setEditing(null);
  };

  if (!ready) {
    return <div className="min-h-[400px] flex items-center justify-center animate-pulse"><div className="h-8 w-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" /></div>;
  }

  return (
    <div className="pb-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">Team Management</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
            Manage your team directory, roles, and public profiles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (window.confirm("Restore the original team list?")) setMembers(teamMembers);
            }}
            className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-50 dark:bg-[#111827] dark:text-zinc-300 dark:ring-white/10 dark:hover:bg-white/5"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button onClick={() => setEditing(emptyMember())} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-blue-500/20">
            <Plus className="h-4 w-4" /> Add Member
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">Total Members</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{members.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111827]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">Visible Profiles</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{activeCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#111827]">
        <div className="flex flex-1 items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-zinc-900 dark:focus:bg-[#181d2b]"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium outline-none dark:border-white/10 dark:bg-zinc-900"
          >
            <option value="All">All Departments</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg dark:bg-zinc-900">
           <button 
             onClick={() => setViewMode("list")} 
             className={`rounded-md p-1.5 transition ${viewMode === "list" ? "bg-white text-slate-900 shadow-sm dark:bg-[#181d2b] dark:text-white" : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"}`}
           >
             <ListIcon className="h-4 w-4" />
           </button>
           <button 
             onClick={() => setViewMode("grid")} 
             className={`rounded-md p-1.5 transition ${viewMode === "grid" ? "bg-white text-slate-900 shadow-sm dark:bg-[#181d2b] dark:text-white" : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"}`}
           >
             <GridIcon className="h-4 w-4" />
           </button>
        </div>
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 py-16 dark:border-white/10 dark:bg-[#111827]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No members found</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">Adjust your search or filters to see more results.</p>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && filteredMembers.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMembers.map((member) => (
             <div key={member.id} className="group relative flex flex-col items-center rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-[#111827]">
               <div className="absolute right-4 top-4 flex gap-1 opacity-0 transition group-hover:opacity-100">
                 <button onClick={() => setEditing(member)} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-blue-600 hover:bg-blue-100 dark:bg-zinc-800 dark:text-blue-400 dark:hover:bg-blue-900/30">
                   <Pencil className="h-4 w-4" />
                 </button>
               </div>
               
               <img 
                 src={member.imageUrl} 
                 alt={member.name} 
                 className="h-24 w-24 rounded-full border-4 border-slate-50 object-cover shadow-sm dark:border-zinc-800"
                 onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(member.name || "U"); }}
               />
               <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{member.name || "Untitled"}</h3>
               <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{member.role || "No role"}</p>
               <span className="mt-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-white/5 dark:text-zinc-300">
                 {member.department || "General"}
               </span>
               
               <div className="mt-6 flex w-full items-center justify-between border-t border-slate-100 pt-4 dark:border-white/5">
                 <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${member.visible !== false ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`}>
                   <span className={`h-2 w-2 rounded-full ${member.visible !== false ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                   {member.visible !== false ? "Visible" : "Hidden"}
                 </span>
                 <button 
                    onClick={() => {
                      if (window.confirm(`Delete ${member.name}?`)) {
                        setMembers((c) => c.filter((i) => i.id !== member.id));
                      }
                    }}
                    className="text-slate-400 hover:text-rose-500 transition"
                 >
                   <Trash2 className="h-4 w-4" />
                 </button>
               </div>
             </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && filteredMembers.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111827]">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider dark:border-white/10 dark:bg-zinc-900/50 dark:text-zinc-400">
                   <tr>
                     <th className="px-6 py-4">Team Member</th>
                     <th className="px-6 py-4">Department</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                   {filteredMembers.map((member, index) => {
                     const isVisible = member.visible !== false;
                     return (
                       <tr key={member.id} className="group transition hover:bg-slate-50 dark:hover:bg-zinc-900/50">
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-4">
                             <img 
                               src={member.imageUrl} 
                               alt="" 
                               className="h-10 w-10 rounded-full object-cover shadow-sm"
                               onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(member.name || "U"); }}
                             />
                             <div>
                               <p className="font-bold text-slate-900 dark:text-white">{member.name || "Untitled"}</p>
                               <p className="font-medium text-slate-500 dark:text-zinc-400">{member.role || "No role"}</p>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4 font-medium text-slate-600 dark:text-zinc-300">
                           {member.department || "General"}
                         </td>
                         <td className="px-6 py-4">
                           <button
                             onClick={() => update({ ...member, visible: !isVisible })}
                             className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition ${
                               isVisible 
                                 ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20" 
                                 : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
                             }`}
                           >
                             {isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                             {isVisible ? "Visible" : "Hidden"}
                           </button>
                         </td>
                         <td className="px-6 py-4">
                           <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                             {(!searchQuery && departmentFilter === "All") && (
                               <>
                                 <button
                                   disabled={index === 0}
                                   onClick={() => move(member.id, -1)}
                                   className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 dark:hover:bg-white/10 dark:hover:text-white"
                                 >
                                   <ArrowUp className="h-4 w-4" />
                                 </button>
                                 <button
                                   disabled={index === filteredMembers.length - 1}
                                   onClick={() => move(member.id, 1)}
                                   className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 dark:hover:bg-white/10 dark:hover:text-white"
                                 >
                                   <ArrowDown className="h-4 w-4" />
                                 </button>
                               </>
                             )}
                             <button
                               onClick={() => setEditing(member)}
                               className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                             >
                               <Pencil className="h-4 w-4" />
                             </button>
                             <button
                               onClick={() => {
                                 if (window.confirm(`Delete ${member.name}?`)) {
                                   setMembers((current) => current.filter((item) => item.id !== member.id));
                                 }
                               }}
                               className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                             >
                               <Trash2 className="h-4 w-4" />
                             </button>
                           </div>
                         </td>
                       </tr>
                     );
                   })}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {/* Edit Form Modal (Slide-over / Centered style) */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:p-6">
          <form 
            onSubmit={submit} 
            className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-[#111827] dark:ring-white/10 flex flex-col max-h-full"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-white/5 shrink-0">
               <div>
                 <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                   {members.some((m) => m.id === editing.id) ? "Edit Profile" : "New Team Member"}
                 </h2>
               </div>
               <button type="button" onClick={() => setEditing(null)} className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white">
                  <X className="h-5 w-5" />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Full Name" value={editing.name} onChange={(name) => setEditing({ ...editing, name })} required />
                <Field label="Job Role" value={editing.role} onChange={(role) => setEditing({ ...editing, role })} required />
                
                <div className="sm:col-span-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                    Profile Image URL
                    <div className="mt-2 flex gap-3">
                       <img 
                         src={editing.imageUrl || "https://ui-avatars.com/api/?name=User"} 
                         className="h-10 w-10 rounded-full bg-slate-100 object-cover dark:bg-zinc-800" 
                         alt=""
                         onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(editing.name || "U"); }}
                       />
                       <input
                         required
                         value={editing.imageUrl}
                         onChange={(event) => setEditing({ ...editing, imageUrl: event.target.value })}
                         className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-zinc-900"
                         placeholder="/images/hero/name.png or https://..."
                       />
                    </div>
                  </label>
                </div>
                
                <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                  Department
                  <select
                    value={editing.department || departments[0]}
                    onChange={(event) => setEditing({ ...editing, department: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-zinc-900"
                  >
                    {departments.map((dep) => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                </label>
                
                <div className="flex items-center pt-8">
                  <label className="flex items-center gap-3 text-sm font-bold text-slate-700 cursor-pointer dark:text-zinc-300">
                    <input
                      type="checkbox"
                      checked={editing.visible !== false}
                      onChange={(event) => setEditing({ ...editing, visible: event.target.checked })}
                      className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                    />
                    Display publicly on Team page
                  </label>
                </div>
                
                <div className="sm:col-span-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
                    Biography
                    <textarea
                      required
                      rows={4}
                      value={editing.bio}
                      onChange={(event) => setEditing({ ...editing, bio: event.target.value })}
                      className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-zinc-900"
                      placeholder="Brief description of experience and role..."
                    />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-white/5 dark:bg-zinc-900/50">
              <button type="button" onClick={() => setEditing(null)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-200 dark:text-zinc-300 dark:hover:bg-white/10">
                Cancel
              </button>
              <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-blue-500/20">
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, required }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
      {label}
      <input
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-zinc-900"
      />
    </label>
  );
}