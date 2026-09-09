import type { Metadata } from "next";
import { redirect } from "next/navigation";

import AdminSecurityWorkspace from "@/components/admin/security/AdminSecurityWorkspace";
import { getActiveSession } from "@/lib/auth/session";
import { isSalesRole } from "@/lib/auth/sales-governance";

export const metadata: Metadata = {
  title: "Set your Sales password",
  robots: { index: false, follow: false },
};

/**
 * This route intentionally sits outside the normal /sales portal layout so a
 * new Sales account can satisfy its required password change before lead APIs
 * and the wider Sales workspace become available.
 */
export default async function SalesPasswordChangePage() {
  const session = await getActiveSession();
  if (!session || session.userType !== "admin") {
    redirect("/login?portal=sales&returnTo=/sales/password-change");
  }
  if (!isSalesRole(session.role)) {
    redirect("/admin/security?forcePasswordChange=1");
  }

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-slate-900 dark:bg-[#181d2b] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <section className="mb-8 cart-skin-box rounded-2xl p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Sales account setup</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight">Set a private password to continue</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Your account was created with an initial credential. Change it now before accessing Sales leads and follow-ups.</p>
        </section>
        <AdminSecurityWorkspace />
      </div>
    </main>
  );
}
