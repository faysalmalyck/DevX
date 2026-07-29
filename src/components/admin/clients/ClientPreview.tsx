import type { ClientRecord } from "@/lib/validation/client";
import ClientCard from "./ClientCard";
export default function ClientPreview({ client }: { client: ClientRecord }) { return <div><p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Public card preview</p><ClientCard client={{ ...client, companyName: client.companyName || "Company name", logo: client.logo || "/images/logo/logo.svg", website: client.website || "https://DevX.com" }} /></div>; }
