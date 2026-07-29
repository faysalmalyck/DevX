import type { Metadata } from "next"; import AdminManager from "@/components/admin/admins/AdminManager";
export const metadata: Metadata = { title: "Administrators", robots: { index: false, follow: false } };
export default function AdminsPage() { return <AdminManager />; }
