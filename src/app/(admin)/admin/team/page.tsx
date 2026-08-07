import type { Metadata } from "next";
import { redirect } from "next/navigation";
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

  return <TeamAdmin initialMembers={members.map(serializeTeamMember)} />;
}
