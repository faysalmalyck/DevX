import type { Metadata } from "next";

import LoginCard from "@/components/auth/LoginCard";
import {
  isSalesReturnPath,
  safeReturnTo,
} from "@/lib/auth/login-redirect";

export const metadata: Metadata = {
  title: "Login | DevX Solutions",    
};

type LoginPageProps = {
  searchParams: Promise<{
    portal?: string;
    redirect?: string;
    returnTo?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const returnTo = safeReturnTo(params.returnTo ?? params.redirect);
  const salesContext = params.portal === "sales" || isSalesReturnPath(returnTo);
  const initialPortal = salesContext ? "sales" : "admin";

  return (
    <main className="premium-shell premium-mesh min-h-screen px-4 pt-32 pb-20">
      <LoginCard
        initialRole={salesContext || params.portal === "admin" ? "admin" : "user"}
        initialPortal={initialPortal}
        returnTo={returnTo ?? undefined}
      />
    </main>
  );
}
