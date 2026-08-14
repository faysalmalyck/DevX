"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { CareerStatus } from "@prisma/client";
import { Plus } from "lucide-react";
import { getClientCsrfToken } from "@/lib/auth/client-csrf";
import type { CareerManagementData } from "@/lib/careers/admin-queries";
import type { CareerContent } from "@/lib/careers/types";
import type { CareerListQuery } from "@/lib/validations/career";
import { showToast } from "@/components/ui/Toast";
import CareerDrawer from "./CareerDrawer";
import CareerFilters from "./CareerFilters";
import CareerStats from "./CareerStats";
import CareerTable from "./CareerTable";
import DeleteDialog from "./DeleteDialog";

type ApiResponse = {
  error?: string;
};

function buildQuery(filters: CareerListQuery): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.status) params.set("status", filters.status);
  if (filters.sort !== "displayOrder_asc") params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));
  return params.toString();
}

export default function CareerManagement({
  careers,
  categories,
  filters,
  pagination,
  stats,
}: CareerManagementData) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<CareerContent | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CareerContent | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/auth/csrf", { credentials: "same-origin" });
  }, []);

  const updateFilters = (next: Partial<CareerListQuery>) => {
    const query = buildQuery({ ...filters, ...next });
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  const ensureCsrfToken = async (): Promise<string | undefined> => {
    let token = getClientCsrfToken();
    if (token) return token;
    await fetch("/api/auth/csrf", { credentials: "same-origin" });
    token = getClientCsrfToken();
    return token;
  };

  const runAction = async (
    career: CareerContent,
    path: string,
    method: "POST" | "PATCH" | "DELETE",
    body?: Record<string, unknown>
  ): Promise<boolean> => {
    setBusyId(career.id);
    try {
      const csrfToken = await ensureCsrfToken();
      if (!csrfToken) {
        showToast.error("Your session security token could not be created. Please try again.");
        return false;
      }

      const response = await fetch(path, {
        method,
        credentials: "same-origin",
        headers: {
          "X-CSRF-Token": csrfToken,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const payload: unknown = await response.json().catch(() => ({}));
      const message =
        typeof payload === "object" && payload !== null && "error" in payload
          ? (payload as ApiResponse).error
          : undefined;

      if (!response.ok) {
        showToast.error(message ?? "This job could not be updated.");
        return false;
      }

      showToast.success(
        method === "DELETE" ? "Job deleted." : "Job updated successfully."
      );
      router.refresh();
      return true;
    } catch {
      showToast.error("This job could not be updated. Please try again.");
      return false;
    } finally {
      setBusyId(null);
    }
  };

  const handleCreate = () => {
    setSelectedCareer(null);
    setDrawerOpen(true);
  };

  const handleEdit = (career: CareerContent) => {
    setSelectedCareer(career);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteError(null);
    const success = await runAction(
      deleteTarget,
      `/api/admin/careers/${deleteTarget.id}`,
      "DELETE"
    );
    if (success) {
      setDeleteTarget(null);
    } else {
      setDeleteError("The job could not be deleted. Review any applications or try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Career Management</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Manage the public job records, publishing state, ordering, and featured jobs.</p>
        </div>
        <button onClick={handleCreate} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 font-semibold text-white transition hover:bg-brand">
          <Plus className="h-4 w-4" />
          Add job
        </button>
      </div>

      <CareerStats {...stats} />
      <CareerFilters categories={categories} filters={filters} onChange={updateFilters} />
      <CareerTable
        careers={careers}
        busyId={busyId}
        onEdit={handleEdit}
        onDelete={(career) => {
          setDeleteError(null);
          setDeleteTarget(career);
        }}
        onDuplicate={(career) => {
          void runAction(career, `/api/admin/careers/${career.id}/duplicate`, "POST");
        }}
        onStatus={(career, status: CareerStatus) => {
          void runAction(career, `/api/admin/careers/${career.id}/status`, "PATCH", { status });
        }}
        onFeature={(career) => {
          void runAction(career, `/api/admin/careers/${career.id}/feature`, "PATCH", { featured: !career.featured });
        }}
        onOrder={(career, displayOrder) => {
          void runAction(career, `/api/admin/careers/${career.id}/order`, "PATCH", { displayOrder });
        }}
      />

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 text-base text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>Showing {careers.length} of {pagination.total} jobs</p>
        <div className="flex items-center gap-2">
          <button type="button" disabled={pagination.page <= 1} onClick={() => updateFilters({ page: pagination.page - 1 })} className="rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800">Previous</button>
          <span>Page {pagination.page} of {pagination.totalPages}</span>
          <button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => updateFilters({ page: pagination.page + 1 })} className="rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800">Next</button>
        </div>
      </div>

      <CareerDrawer
        open={drawerOpen}
        mode={selectedCareer ? "edit" : "create"}
        career={selectedCareer}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => router.refresh()}
      />
      <DeleteDialog
        open={Boolean(deleteTarget)}
        title={deleteTarget?.title ?? "this job"}
        loading={busyId === deleteTarget?.id}
        error={deleteError}
        onClose={() => {
          if (!busyId) setDeleteTarget(null);
        }}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
}
