import { getActiveSession, type SessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export type SalesTeamAuthorization =
  | { ok: true; session: SessionUser }
  | { ok: false; status: 401 | 403; error: string };

export async function authorizeSalesManagerTeam(): Promise<SalesTeamAuthorization> {
  const session = await getActiveSession();
  if (!session || session.userType !== "admin") {
    return { ok: false, status: 401, error: "Authentication is required." };
  }
  if (session.requirePasswordChange) {
    return { ok: false, status: 403, error: "Change your password before managing the Sales team." };
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.id, deletedAt: null },
    select: { status: true, role: { select: { name: true } } },
  });
  if (!admin || admin.status !== "ACTIVE") {
    return { ok: false, status: 401, error: "Your Admin session is no longer active." };
  }
  if (admin.role.name !== "Sales Manager") {
    return { ok: false, status: 403, error: "Only an active Sales Manager can manage Sales TeamMembers." };
  }
  return { ok: true, session };
}
