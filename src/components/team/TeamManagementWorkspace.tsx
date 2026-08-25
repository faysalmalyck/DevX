"use client";

import { useState } from "react";
import { KeyRound, Users } from "lucide-react";

import TeamAccessManagement from "@/components/admin/TeamAccessManagement";
import type { TeamMemberRecord } from "@/lib/team/types";

import TeamAdmin from "./TeamAdmin";

type TeamWorkspaceTab = "profiles" | "access";

type TeamManagementWorkspaceProps = {
  initialMembers: TeamMemberRecord[];
  initialTab?: TeamWorkspaceTab;
};

const tabs: { id: TeamWorkspaceTab; label: string; description: string; icon: typeof Users }[] = [
  { id: "profiles", label: "Profiles", description: "Directory and public profiles", icon: Users },
  { id: "access", label: "Login Access", description: "Administrator and Sales access", icon: KeyRound },
];

export default function TeamManagementWorkspace({
  initialMembers,
  initialTab = "profiles",
}: TeamManagementWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<TeamWorkspaceTab>(initialTab);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Manage</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">Team</h1>
        <p className="mt-2 max-w-3xl text-base text-slate-500 dark:text-zinc-400">Manage team profiles and the secure login access linked to each member.</p>
      </div>

      <div role="tablist" aria-label="Team management sections" className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-white/[0.08] dark:bg-[#111827]">
        {tabs.map(({ id, label, description, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              id={`${id}-tab`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${id}-panel`}
              onClick={() => setActiveTab(id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition sm:px-4 ${
                isActive
                  ? "bg-brand text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06]"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              <span className="hidden text-xs font-medium opacity-80 lg:inline">{description}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`${activeTab}-panel`}
        role="tabpanel"
        aria-labelledby={`${activeTab}-tab`}
      >
        {activeTab === "profiles" ? (
          <TeamAdmin initialMembers={initialMembers} />
        ) : (
          <TeamAccessManagement />
        )}
      </div>
    </div>
  );
}
