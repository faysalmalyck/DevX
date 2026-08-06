import type { Metadata } from "next";
import ForgotPasswordCard from "@/components/auth/ForgotPasswordCard";

export const metadata: Metadata = {
  title: "Recover Password | DevX Solutions",    
};

export default function ForgotPasswordPage() {
  return (
    <main className="premium-shell premium-mesh min-h-screen px-4 pt-32 pb-20">
      <ForgotPasswordCard />
    </main>
  );
}
