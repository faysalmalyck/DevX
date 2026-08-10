"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Download, Plus, Search, ShieldCheck } from "lucide-react";
import { ADMIN_STORAGE_KEY, defaultAdministrators } from "@/data/administrators";
import { type Administrator, type AdminRole, isProtectedCeo } from "@/lib/permissions/rbac";
import { validateAdministrator } from "@/lib/validation/admin";

const roles: AdminRole[] = [
  "CEO",
  "Administrator",
  "Content Manager",
  "Marketing Manager",
  "HR Manager",
  "Sales Manager",
  "Finance Manager",
  "Project Manager",
  "Support Manager",
  "Developer",
  "Custom Role"
];

const blank = (): Administrator => ({
  id: crypto.randomUUID(),
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  username: "",
  avatar: "",
  designation: "",
  department: "",
  bio: "",
  role: "Administrator",
  status: "INVITED",
  twoFactorEnabled: false,
  lastLogin: null,
  createdAt: new Date().toISOString(),
  permissions: []
});

export default function AdminManager() {
  const [admins, setAdmins] = useState(defaultAdministrators);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [editing, setEditing] = useState<Administrator | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) setAdmins(JSON.parse(stored));
    } catch {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admins));
  }, [admins, ready]);

  const rows = useMemo(() => {
    return admins
      .filter(
        (a) =>
          a.firstName.toLowerCase().includes(search.toLowerCase()) ||
          a.lastName.toLowerCase().includes(search.toLowerCase()) ||
          a.email.toLowerCase().includes(search.toLowerCase())
      )
      .filter((a) => status === "ALL" || a.status === status)
      .sort((a, b) => Number(Boolean(b.isCeo)) - Number(Boolean(a.isCeo)) || a.firstName.localeCompare(b.firstName));
  }, [admins, search, status]);

  const save = (admin: Administrator) => {
    setAdmins((current) =>
      current.some((a) => a.id === admin.id)
        ? current.map((a) => (a.id === admin.id ? admin : a))
        : [...current, admin]
    );
    setEditing(null);
  };

  const active = admins.filter((a) => a.status === "ACTIVE").length;
  const suspended = admins.filter((a) => a.status === "SUSPENDED").length;
  const pending = admins.filter((a) => a.status === "INVITED").length;

  return (
    <div className="space-y-6">
      {/* Header and Action Panel */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-base font-bold uppercase tracking-[.18em] text-primary">
            Administration
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Administrators
          </h2>
          <p className="mt-2 text-zinc-400">
            Manage secure access, roles, and administrative accounts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-base font-bold text-zinc-300 hover:text-white transition cursor-pointer">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setEditing(blank())}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-base font-bold text-white hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Administrator
          </button>
        </div>
      </div>

      {/* Cards Stat Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          ["Total Admins", admins.length],
          ["Active Status", active],
          ["Super Admins", admins.filter((a) => a.role === "CEO" || a.isCeo).length],
          ["Suspended Accs", suspended],
          [
            "Online Recent",
            admins.filter(
              (a) =>
                a.lastLogin && Date.now() - new Date(a.lastLogin).getTime() < 86400000
            ).length,
          ],
          ["Pending Invitations", pending],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 shadow-xl backdrop-blur-md"
          >
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="mt-1 text-xs text-zinc-400 font-semibold">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-4 shadow-xl backdrop-blur-md sm:flex-row">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search administrators..."
            className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-9 pr-3 text-base text-white placeholder-zinc-600 outline-none focus:border-primary/50"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0c1222] px-4 py-2.5 text-base text-zinc-300 outline-none focus:border-primary/50"
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="INVITED">Invited</option>
          <option value="LOCKED">Locked</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] shadow-xl backdrop-blur-md">
        <table className="w-full min-w-[1100px] text-left text-base">
          <thead className="sticky top-0 border-b border-white/10 bg-[#0c1222] text-xs uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="p-4">Administrator</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Created</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((admin) => (
              <tr
                key={admin.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {admin.avatar ? (
                      <img src={admin.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/20 font-bold text-primary">
                        {admin.firstName[0]}
                      </span>
                    )}
                    <div>
                      <p className="font-bold text-white">
                        {admin.firstName} {admin.lastName}
                      </p>
                      <p className="text-xs text-zinc-500">@{admin.username}</p>
                    </div>
                  </div>
                </td>
                <td className="text-zinc-300">{admin.designation || "—"}</td>
                <td className="text-zinc-300">{admin.department || "—"}</td>
                <td className="text-zinc-300">
                  <p>{admin.email}</p>
                  <p className="text-xs text-zinc-500">{admin.phone || "—"}</p>
                </td>
                <td>
                  {admin.id === "ceo-faysal-mushtaq" || admin.role === "CEO" || admin.isCeo ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      CEO • Super Admin
                    </span>
                  ) : (
                    <span className="text-zinc-300">{admin.role}</span>
                  )}
                </td>
                <td>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold border ${
                      admin.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-zinc-500/10 text-zinc-400 border-white/10"
                    }`}
                  >
                    {admin.status}
                  </span>
                </td>
                <td className="text-zinc-300">
                  {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : "Never"}
                </td>
                <td className="text-zinc-300">{new Date(admin.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditing(admin)}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 transition cursor-pointer"
                    >
                      Edit
                    </button>
                    {!isProtectedCeo(admin) && (
                      <>
                        <button
                          onClick={() =>
                            setAdmins((a) =>
                              a.map((x) =>
                                x.id === admin.id
                                  ? {
                                      ...x,
                                      status: x.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED"
                                    }
                                  : x
                              )
                            )
                          }
                          className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-zinc-300 hover:bg-white/5 transition cursor-pointer"
                        >
                          {admin.status === "SUSPENDED" ? "Activate" : "Suspend"}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Soft delete ${admin.firstName}?`)) {
                              setAdmins((a) => a.filter((x) => x.id !== admin.id));
                            }
                          }}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <AdminForm
          admin={editing}
          admins={admins}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function AdminForm({
  admin,
  admins,
  onClose,
  onSave
}: {
  admin: Administrator;
  admins: Administrator[];
  onClose: () => void;
  onSave: (admin: Administrator) => void;
}) {
  const [value, setValue] = useState(admin);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (isProtectedCeo(value) && value.role !== "CEO") return;
    const next = validateAdministrator(value, admins, password, confirmPassword);
    setErrors(next);
    if (!Object.keys(next).length) onSave(value);
  };

  const field = (key: keyof Administrator, label: string, type = "text") => (
    <label className="text-base font-semibold text-zinc-300 block">
      {label}
      <input
        type={type}
        value={String(value[key] ?? "")}
        onChange={(e) => setValue({ ...value, [key]: e.target.value })}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-primary/50 transition placeholder-zinc-600"
      />
      {errors[key] && <span className="text-xs text-rose-500 mt-1 block">{errors[key]}</span>}
    </label>
  );

  return (
    <div className="fixed inset-0 z-[80] flex justify-end bg-black/60 backdrop-blur-xs">
      <form
        onSubmit={submit}
        className="h-full w-full max-w-2xl overflow-y-auto bg-[#0c1222] border-l border-white/10 p-8 shadow-2xl space-y-6"
      >
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-white">
              {admins.some((a) => a.id === value.id) ? "Edit Administrator" : "Add Administrator"}
            </h2>
            <p className="mt-1 text-base text-zinc-500">
              {isProtectedCeo(value)
                ? "CEO controls are protected."
                : "Create a secure administrator operator account."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-black/20 px-3.5 py-1.5 text-base font-bold text-zinc-400 hover:text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {field("firstName", "First name *")}
          {field("lastName", "Last name")}
          {field("designation", "Job title")}
          {field("department", "Department")}
          {field("email", "Email address *", "email")}
          {field("phone", "Phone number")}
          {field("username", "Username *")}

          <label className="text-base font-semibold text-zinc-300 block">
            Role
            <select
              disabled={isProtectedCeo(value)}
              value={value.role}
              onChange={(e) => setValue({ ...value, role: e.target.value as AdminRole })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0c1222] px-4 py-3 text-zinc-300 outline-none focus:border-primary/50"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          {!admins.some((a) => a.id === value.id) && (
            <>
              <label className="text-base font-semibold text-zinc-300 block">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-primary/50 transition"
                />
                {errors.password && (
                  <span className="text-xs text-rose-500 mt-1 block">{errors.password}</span>
                )}
              </label>
              <label className="text-base font-semibold text-zinc-300 block">
                Confirm password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-primary/50 transition"
                />
              </label>
            </>
          )}
        </div>

        <div className="space-y-3 pt-4 border-t border-white/5">
          <label className="flex items-center gap-2.5 text-base font-semibold text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={value.twoFactorEnabled}
              onChange={(e) => setValue({ ...value, twoFactorEnabled: e.target.checked })}
              className="h-4 w-4 rounded border-white/10 bg-black/20 text-primary focus:ring-0"
            />
            Two-factor authentication
          </label>
          <label className="flex items-center gap-2.5 text-base font-semibold text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={value.status === "ACTIVE"}
              disabled={isProtectedCeo(value)}
              onChange={(e) => setValue({ ...value, status: e.target.checked ? "ACTIVE" : "SUSPENDED" })}
              className="h-4 w-4 rounded border-white/10 bg-black/20 text-primary focus:ring-0"
            />
            Active account
          </label>
        </div>

        <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-2.5 text-base font-bold text-zinc-400 hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button className="rounded-xl bg-primary px-5 py-2.5 text-base font-bold text-white hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-primary/20 cursor-pointer">
            Save Administrator
          </button>
        </div>
      </form>
    </div>
  );
}
