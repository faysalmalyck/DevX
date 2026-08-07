import type { Metadata } from "next";
import { redirect } from "next/navigation";

import ApplicationsManagement from "@/components/admin/applications/ApplicationsManagement";
import type {
  ApplicationStatistics,
  ApplicationsListResponse,
} from "@/components/admin/applications/types";
import { getActiveSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { requirePermission } from "@/lib/permissions/rbac.server";

export const metadata: Metadata = {
  title: "Applications",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const session = await getActiveSession();

  if (!session || session.userType !== "admin") {
    redirect("/login?portal=admin&redirect=/admin/applications");
  }

  const canViewApplications = await requirePermission("Applications", "VIEW");
  if (!canViewApplications) {
    redirect("/admin");
  }

  const [applications, total, statusCounts, jobs] = await Promise.all([
    prisma.application.findMany({
      select: {
        id: true,
        careerId: true,
        fullName: true,
        email: true,
        phone: true,
        yearsOfExperience: true,
        resumeOriginalFilename: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        career: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.application.count(),
    prisma.application.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.career.findMany({
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
  ]);

  const stats: ApplicationStatistics = {
    total,
    new: 0,
    reviewing: 0,
    shortlisted: 0,
    interview: 0,
    hired: 0,
    rejected: 0,
  };

  for (const statusCount of statusCounts) {
    switch (statusCount.status) {
      case "NEW":
        stats.new = statusCount._count._all;
        break;
      case "REVIEWING":
        stats.reviewing = statusCount._count._all;
        break;
      case "SHORTLISTED":
        stats.shortlisted = statusCount._count._all;
        break;
      case "INTERVIEW":
        stats.interview = statusCount._count._all;
        break;
      case "HIRED":
        stats.hired = statusCount._count._all;
        break;
      case "REJECTED":
        stats.rejected = statusCount._count._all;
        break;
      case "WITHDRAWN":
        break;
    }
  }

  const initialData: ApplicationsListResponse = {
    applications: applications.map((application) => ({
      ...application,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    })),
    pagination: {
      page: 1,
      pageSize: 20,
      total,
      pageCount: Math.max(1, Math.ceil(total / 20)),
    },
    stats,
  };

  return <ApplicationsManagement initialData={initialData} jobs={jobs} />;
}
