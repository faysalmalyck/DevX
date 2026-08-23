import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { salesLoginReturnTo } from "@/lib/auth/login-redirect";

export const metadata: Metadata = {
  title: "Sales portal login",
  robots: { index: false, follow: false },
};

type SalesLoginPageProps = {
  searchParams: Promise<{
    next?: string;
    redirect?: string;
    returnTo?: string;
  }>;
};

export default async function SalesLoginPage({ searchParams }: SalesLoginPageProps) {
  const params = await searchParams;
  const returnTo = salesLoginReturnTo(
    params.returnTo ?? params.redirect ?? params.next
  );

  redirect(`/login?portal=sales&returnTo=${encodeURIComponent(returnTo)}`);
}
