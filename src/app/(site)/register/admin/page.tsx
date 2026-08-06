import type { Metadata } from "next";
import AdminRegisterCard from "@/components/auth/AdminRegisterCard";

export const metadata: Metadata = {
  title: "Admin Registration | DevX Solutions",    
};

export default function AdminRegisterPage() {
  return (
    <main className="premium-shell premium-mesh min-h-screen px-4 pt-32 pb-20">
      <AdminRegisterCard />
    </main>
  );
}
