import Link from "next/link";
import { Building2, ClipboardList, KeyRound, LayoutDashboard, ShieldCheck, Users, Settings, User, LogOut } from "lucide-react";
import { useSession } from "@/contexts/SessionContext";

export type AdminArea = "dashboard" | "clients" | "team" | "admins" | "roles" | "permissions" | "activity" | "sessions" | "profile" | "security";

export default function AdminSidebar({ active }: { active: AdminArea }) {
  const { user, logout } = useSession();

  const primaryNav = [
    { label: "Dashboard", href: "/admin", key: "dashboard", icon: LayoutDashboard },
    { label: "Manage Team", href: "/admin/team", key: "team", icon: Users },
    { label: "Manage Clients", href: "/admin/clients", key: "clients", icon: Building2 },
  ] as const;

  const adminNav = [
    { label: "Administrators", href: "/admin/administration/admins", key: "admins", icon: Users },
    { label: "Roles", href: "/admin/administration/roles", key: "roles", icon: ShieldCheck },
    { label: "Permissions", href: "/admin/administration/permissions", key: "permissions", icon: KeyRound },
    { label: "Activity Logs", href: "/admin/administration/activity", key: "activity", icon: ClipboardList },
    { label: "Login Sessions", href: "/admin/administration/sessions", key: "sessions", icon: KeyRound },
  ] as const;

  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-white/5 bg-[#181d2b] p-5 md:flex">
      <div>
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tight text-white">
            DevX<span className="text-primary">.</span>
          </Link>
          <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase">
            Ops
          </span>
        </div>

        <nav className="space-y-6">
          <div className="space-y-1">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[.15em] text-zinc-500">Core Modules</p>
            {primaryNav.map(({ label, href, key, icon: Icon }) => (
              <Link
                key={key}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition duration-200 ${
                  active === key
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>

          <div className="space-y-1">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[.15em] text-zinc-500">Administration</p>
            {adminNav.map(({ label, href, key, icon: Icon }) => (
              <Link
                key={key}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition duration-200 ${
                  active === key
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className="border-t border-white/5 pt-4 space-y-4">
        {user && (
          <Link href="/admin/admin/profile" className="flex items-center gap-3 group px-2 py-1.5 rounded-xl hover:bg-white/5 transition">
            <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary">
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="h-full w-full rounded-full object-cover" />
              ) : (
                user.firstName[0]
              )}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight group-hover:text-primary transition">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-zinc-500 truncate leading-none">{user.role}</p>
            </div>
          </Link>
        )}

        <div className="flex gap-2">
          <Link
            href="/admin/admin/security"
            title="Operator Security Settings"
            className={`flex-1 flex justify-center items-center gap-2 rounded-xl py-2 text-xs font-semibold border transition duration-200 ${
              active === "security"
                ? "bg-primary border-primary text-white"
                : "border-white/10 bg-black/20 text-zinc-400 hover:text-white hover:border-white/20"
            }`}
          >
            <Settings className="h-4 w-4" />
            Security
          </Link>
          <button
            onClick={logout}
            title="Sign Out"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition duration-200 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
