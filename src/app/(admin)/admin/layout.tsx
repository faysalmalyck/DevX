import { redirect } from "next/navigation";

import { authorizeOperationsWorkspace } from "@/lib/auth/sales-governance";

export default async function AdminWorkspaceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const authorization = await authorizeOperationsWorkspace();

  if (!authorization.ok) {
    redirect(
      authorization.status === 401
        ? "/login?returnTo=/admin"
        : authorization.salesRole
          ? "/sales"
          : "/login"
    );
  }

  return children;
}
