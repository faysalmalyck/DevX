"use client";

import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";

import ApplicationDetailsDialog from "./ApplicationDetailsDialog";
import ApplicationFilters from "./ApplicationFilters";
import ApplicationStats from "./ApplicationStats";
import ApplicationTable from "./ApplicationTable";
import { getAdminCsrfHeaders } from "./csrf";
import DeleteApplicationDialog from "./DeleteApplicationDialog";
import {
  type ApplicationDetail,
  type ApplicationJobFilter,
  type ApplicationListItem,
  type ApplicationStatusValue,
  type ApplicationsListResponse,
} from "./types";

interface ApplicationsManagementProps {
  initialData: ApplicationsListResponse;
  jobs: ApplicationJobFilter[];
}

function responseError(payload: unknown, fallback: string): string {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return payload.error;
  }

  return fallback;
}

function listResponseFromPayload(value: unknown): ApplicationsListResponse | null {
  if (
    typeof value !== "object" ||
    value === null ||
    !("applications" in value) ||
    !Array.isArray(value.applications) ||
    !("pagination" in value) ||
    typeof value.pagination !== "object" ||
    value.pagination === null ||
    !("stats" in value) ||
    typeof value.stats !== "object" ||
    value.stats === null
  ) {
    return null;
  }

  return value as ApplicationsListResponse;
}

export default function ApplicationsManagement({
  initialData,
  jobs,
}: ApplicationsManagementProps) {
  const [applications, setApplications] = useState(initialData.applications);
  const [pagination, setPagination] = useState(initialData.pagination);
  const [stats, setStats] = useState(initialData.stats);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [careerId, setCareerId] = useState("");
  const [status, setStatus] = useState<ApplicationStatusValue | "">("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<ApplicationListItem | null>(
    null
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const requestCounter = useRef(0);
  const hasSkippedInitialFetch = useRef(false);

  const loadApplications = useCallback(
    async (signal?: AbortSignal) => {
      const requestId = ++requestCounter.current;
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams({
        page: String(page),
        pageSize: String(pagination.pageSize),
        sort,
      });
      const trimmedSearch = deferredSearch.trim();

      if (trimmedSearch) searchParams.set("q", trimmedSearch);
      if (careerId) searchParams.set("careerId", careerId);
      if (status) searchParams.set("status", status);

      try {
        const response = await fetch(
          `/api/admin/applications?${searchParams.toString()}`,
          { cache: "no-store", signal }
        );
        const payload: unknown = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(responseError(payload, "Unable to load applications."));
        }

        const nextData = listResponseFromPayload(payload);
        if (!nextData) {
          throw new Error("Unable to load applications.");
        }

        if (requestId !== requestCounter.current) return;

        setApplications(nextData.applications);
        setPagination(nextData.pagination);
        setStats(nextData.stats);
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === "AbortError") {
          return;
        }

        if (requestId === requestCounter.current) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load applications."
          );
        }
      } finally {
        if (requestId === requestCounter.current && !signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [careerId, deferredSearch, page, pagination.pageSize, sort, status]
  );

  useEffect(() => {
    if (!hasSkippedInitialFetch.current) {
      hasSkippedInitialFetch.current = true;
      return;
    }

    const controller = new AbortController();
    void loadApplications(controller.signal);
    return () => controller.abort();
  }, [loadApplications]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCareerChange = (value: string) => {
    setCareerId(value);
    setPage(1);
  };

  const handleStatusChange = (value: ApplicationStatusValue | "") => {
    setStatus(value);
    setPage(1);
  };

  const handleSortChange = (value: "newest" | "oldest") => {
    setSort(value);
    setPage(1);
  };

  const handleApplicationSaved = useCallback(
    (updatedApplication: ApplicationDetail) => {
      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === updatedApplication.id
            ? {
                ...application,
                status: updatedApplication.status,
                updatedAt: updatedApplication.updatedAt,
              }
            : application
        )
      );
      void loadApplications();
    },
    [loadApplications]
  );

  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      const csrfHeaders = await getAdminCsrfHeaders();
      const response = await fetch(
        `/api/admin/applications/${encodeURIComponent(deleteTarget.id)}`,
        {
          method: "DELETE",
          headers: csrfHeaders,
        }
      );
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(responseError(payload, "Unable to delete the application."));
      }

      if (selectedApplicationId === deleteTarget.id) {
        setSelectedApplicationId(null);
      }

      const shouldGoBackOnePage = applications.length === 1 && page > 1;
      setDeleteTarget(null);
      if (shouldGoBackOnePage) {
        setPage((currentPage) => currentPage - 1);
      } else {
        void loadApplications();
      }
    } catch (deleteApplicationError) {
      setDeleteError(
        deleteApplicationError instanceof Error
          ? deleteApplicationError.message
          : "Unable to delete the application."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand dark:text-brand">
            Careers
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Applications
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
            Review candidates, manage hiring stages, and securely access resumes.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadApplications()}
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#111827] dark:text-zinc-300 dark:hover:bg-white/5"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <ApplicationStats stats={stats} />

      <ApplicationFilters
        search={search}
        careerId={careerId}
        status={status}
        sort={sort}
        jobs={jobs}
        onSearchChange={handleSearchChange}
        onCareerChange={handleCareerChange}
        onStatusChange={handleStatusChange}
        onSortChange={handleSortChange}
      />

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
        >
          {error}
        </p>
      )}

      <ApplicationTable
        applications={applications}
        loading={loading}
        onOpen={setSelectedApplicationId}
        onDelete={(application) => {
          setDeleteError(null);
          setDeleteTarget(application);
        }}
      />

      <footer className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500 dark:text-zinc-500">
          Showing {applications.length === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1}
          {applications.length > 0
            ? `–${Math.min(
                pagination.page * pagination.pageSize,
                pagination.total
              )}`
            : ""} {" "}
          of {pagination.total.toLocaleString()} applications
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            disabled={loading || pagination.page <= 1}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="min-w-20 text-center text-sm font-semibold text-slate-600 dark:text-zinc-400">
            Page {pagination.page} of {pagination.pageCount}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((currentPage) =>
                Math.min(pagination.pageCount, currentPage + 1)
              )
            }
            disabled={loading || pagination.page >= pagination.pageCount}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>

      <ApplicationDetailsDialog
        applicationId={selectedApplicationId}
        onClose={() => setSelectedApplicationId(null)}
        onSaved={handleApplicationSaved}
      />

      <DeleteApplicationDialog
        application={deleteTarget}
        deleting={deleting}
        error={deleteError}
        onClose={() => {
          if (!deleting) {
            setDeleteError(null);
            setDeleteTarget(null);
          }
        }}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
