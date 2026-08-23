import { redirect } from "next/navigation";

import { authorizeLead } from "@/lib/auth/lead-authorization";
import SalesShell from "@/components/sales/SalesShell";

export default async function SalesPortalLayout({ children }: { children: React.ReactNode }) {
  const authorization = await authorizeLead("VIEW");

  if (!authorization.ok) {
    redirect(
      authorization.status === 401
        ? "/login?portal=sales&returnTo=/sales"
        : authorization.passwordChangeRequired
          ? "/sales/password-change"
          : "/admin"
    );
  }

  return (
    <SalesShell
      canManage={authorization.scope === "ALL"}
      user={{
        firstName: authorization.session.firstName,
        lastName: authorization.session.lastName,
        avatar: authorization.session.avatar,
        role: authorization.session.role,
      }}
    >
      {children}
    </SalesShell>
  );
}
