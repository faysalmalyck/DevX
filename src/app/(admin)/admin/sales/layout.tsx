import { redirect } from "next/navigation";

import { authorizeSalesGovernance } from "@/lib/auth/sales-governance";

export default async function SalesGovernanceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const authorization = await authorizeSalesGovernance();

  if (!authorization.ok) {
    redirect(
      authorization.status === 401
        ? "/login?returnTo=/admin/sales"
        : "/admin"
    );
  }

  return children;
}
