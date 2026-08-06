import type { Metadata } from "next";
import ResetPasswordCard from "@/components/auth/ResetPasswordCard";

export const metadata: Metadata = {
  title: "Reset Password | DevX Solutions",    
};

export default function ResetPasswordPage() {
  return (
    <main className="premium-shell premium-mesh min-h-screen px-4 pt-32 pb-20">
      <ResetPasswordCard />
    </main>
  );
}
