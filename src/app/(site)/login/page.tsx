import type { Metadata } from "next";
import LoginCard from "@/components/auth/LoginCard";

export const metadata: Metadata = {
  title: "Login | DevX Solutions",    
};

export default function LoginPage() {
  return (
    <main className="premium-shell premium-mesh min-h-screen px-4 pt-32 pb-20">
      <LoginCard />
    </main>
  );
}