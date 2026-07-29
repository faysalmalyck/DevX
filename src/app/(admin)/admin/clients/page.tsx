import type { Metadata } from "next"; import ClientManager from "@/components/admin/clients/ClientManager";
export const metadata: Metadata = { title: "Client management", robots: { index: false, follow: false } };
export default function ClientsPage() { return <ClientManager />; }
