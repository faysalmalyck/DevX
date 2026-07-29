"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Plus, RefreshCw } from "lucide-react";
import { CLIENT_STORAGE_KEY, clientSort, defaultClients } from "@/data/clients";
import type { ClientRecord } from "@/lib/validation/client";
import { slugify } from "@/lib/validation/client";
import ClientFilters, { type ClientFiltersState } from "./ClientFilters";
import ClientTable from "./ClientTable";
import ClientForm from "./ClientForm";
import DeleteDialog from "./DeleteDialog";

const blank = (): ClientRecord => {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    companyName: "",
    slug: "",
    logo: "",
    website: "https://",
    description: "",
    industry: "",
    country: "",
    displayOrder: 0,
    featured: false,
    status: "ACTIVE",
    openInNewTab: true,
    seoTitle: "",
    seoDescription: "",
    createdAt: now,
    updatedAt: now,
    deletedAt: null
  };
};

const initialFilters: ClientFiltersState = {
  search: "",
  status: "All statuses",
  featured: "All clients",
  industry: "",
  country: "",
  sort: "Display order"
};

export default function ClientManager() {
  const [clients, setClients] = useState(defaultClients);
  const [ready, setReady] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<ClientRecord | null>(null);
  const [removing, setRemoving] = useState<ClientRecord[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CLIENT_STORAGE_KEY);
      if (stored) setClients(JSON.parse(stored));
    } catch {
      localStorage.removeItem(CLIENT_STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(clients));
  }, [clients, ready]);

  const visible = useMemo(() => {
    return clients
      .filter((client) => !client.deletedAt)
      .filter(
        (client) =>
          (!filters.search || client.companyName.toLowerCase().includes(filters.search.toLowerCase())) &&
          (filters.status === "All statuses" || client.status === filters.status) &&
          (filters.featured === "All clients" || (filters.featured === "Featured") === client.featured) &&
          (!filters.industry || client.industry.toLowerCase().includes(filters.industry.toLowerCase())) &&
          (!filters.country || client.country.toLowerCase().includes(filters.country.toLowerCase()))
      )
      .sort(
        filters.sort === "Company name"
          ? (a, b) => a.companyName.localeCompare(b.companyName)
          : filters.sort === "Newest"
          ? (a, b) => b.createdAt.localeCompare(a.createdAt)
          : clientSort
      );
  }, [clients, filters]);

  const save = (client: ClientRecord) => {
    setClients((current) =>
      current.some((item) => item.id === client.id)
        ? current.map((item) => (item.id === client.id ? client : item))
        : [...current, client]
    );
    setEditing(null);
  };

  const exportCsv = (rows = visible) => {
    const csv = [
      "Company,Website,Industry,Country,Featured,Status,Display Order",
      ...rows.map((c) =>
        [c.companyName, c.website, c.industry, c.country, c.featured, c.status, c.displayOrder]
          .map((v) => `"${String(v).replaceAll('"', '""')}"`)
          .join(",")
      )
    ].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "DevX-clients.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const active = clients.filter((c) => !c.deletedAt && c.status === "ACTIVE").length;
  const featured = clients.filter((c) => !c.deletedAt && c.featured).length;
  const hidden = clients.filter((c) => !c.deletedAt && c.status === "HIDDEN").length;

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.18em] text-primary">
            Client Management
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Clients
          </h2>
          <p className="mt-2 text-zinc-400">
            Manage companies that trust our software and SaaS solutions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => exportCsv()}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-bold text-zinc-300 hover:text-white transition cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => location.reload()}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm font-bold text-zinc-300 hover:text-white transition cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => setEditing(blank())}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Client
          </button>
        </div>
      </div>

      {/* Cards Stat Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total Clients", clients.filter((c) => !c.deletedAt).length],
          ["Active Partners", active],
          ["Featured Brand", featured],
          ["Hidden Profiles", hidden]
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.01] p-5 shadow-xl backdrop-blur-md"
          >
            <p className="text-3xl font-black text-white">{value}</p>
            <p className="mt-1 text-sm font-semibold text-zinc-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters Section */}
      <ClientFilters value={filters} onChange={setFilters} />

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl bg-primary/10 border border-primary/20 p-3 text-sm font-bold text-primary animate-fade-in">
          <span>{selected.length} Selected Clients</span>
          <button
            onClick={() => setRemoving(clients.filter((c) => selected.includes(c.id)))}
            className="ml-auto text-rose-500 hover:underline cursor-pointer"
          >
            Delete
          </button>
          <button
            onClick={() => {
              setClients((c) => c.map((x) => (selected.includes(x.id) ? { ...x, status: "HIDDEN" } : x)));
              setSelected([]);
            }}
            className="text-zinc-400 hover:text-white cursor-pointer"
          >
            Hide
          </button>
          <button
            onClick={() => {
              setClients((c) => c.map((x) => (selected.includes(x.id) ? { ...x, status: "ACTIVE" } : x)));
              setSelected([]);
            }}
            className="text-zinc-400 hover:text-white cursor-pointer"
          >
            Activate
          </button>
          <button
            onClick={() => exportCsv(clients.filter((c) => selected.includes(c.id)))}
            className="text-zinc-400 hover:text-white cursor-pointer"
          >
            CSV Export
          </button>
        </div>
      )}

      {/* Table grid */}
      <div className="mt-4">
        <ClientTable
          clients={visible}
          selected={selected}
          onSelect={setSelected}
          onEdit={setEditing}
          onDelete={(c) => setRemoving([c])}
          onDuplicate={(c) =>
            setEditing({
              ...c,
              id: crypto.randomUUID(),
              companyName: `${c.companyName} copy`,
              slug: slugify(`${c.companyName} copy`),
              createdAt: new Date().toISOString()
            })
          }
          onToggle={(c) =>
            setClients((current) =>
              current.map((x) =>
                x.id === c.id ? { ...x, status: x.status === "ACTIVE" ? "HIDDEN" : "ACTIVE" } : x
              )
            )
          }
        />
      </div>

      {editing && (
        <ClientForm
          client={editing}
          clients={clients}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}

      {removing.length > 0 && (
        <DeleteDialog
          count={removing.length}
          onCancel={() => setRemoving([])}
          onConfirm={() => {
            const ids = new Set(removing.map((c) => c.id));
            setClients((current) =>
              current.map((c) => (ids.has(c.id) ? { ...c, deletedAt: new Date().toISOString() } : c))
            );
            setSelected([]);
            setRemoving([]);
          }}
        />
      )}
    </div>
  );
}
