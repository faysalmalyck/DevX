import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import TeamAdmin from "@/components/team/TeamAdmin";
import { authorizeAdmin } from "@/lib/auth/admin-authorization";
import { prisma } from "@/lib/db/prisma";
import { serializeTeamMember } from "@/lib/team/types";

export const metadata: Metadata = { title: "Team management", robots: { index: false, follow: false } };

export default async function TeamAdminPage() {
  const authorized = await authorizeAdmin("Team Members", "VIEW");

  if (!authorized.ok) {
    redirect(authorized.status === 401 ? "/login?portal=admin" : "/admin");
  }

  const members = await prisma.teamMember.findMany({
    where: { deletedAt: null },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Link href="/admin/administration/access" className="rounded-lg border border-brand/30 bg-brand/10 px-4 py-2.5 text-sm font-bold text-brand hover:bg-brand/15 dark:text-cyan-200">
          Manage login access
        </Link>
      </div>
      <TeamAdmin initialMembers={members.map(serializeTeamMember)} />
    </div>
  );
}
