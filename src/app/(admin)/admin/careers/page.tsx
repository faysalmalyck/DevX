import { prisma } from "@/lib/db/prisma";
import CareerTable from "@/components/admin/careers/CareerTable";
import CareerStats from "@/components/admin/careers/CareerStats";
import CareerFilters from "@/components/admin/careers/CareerFilters";
import CareerManagement from "@/components/admin/careers/CareerManagement";

export default async function CareersPage() {
  const careers = await prisma.career.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const published = careers.filter(
    (career) => career.status === "Published"
  ).length;

  const draft = careers.filter(
    (career) => career.status === "Draft"
  ).length;

  const featured = careers.filter(
    (career) => career.featured
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Career Management
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Manage all career opportunities from one place.
          </p>
        </div>

        <button className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700">
          Add Career
        </button>
      </div>

      <CareerStats
        total={careers.length}
        published={published}
        draft={draft}
        featured={featured}
      />

      <CareerFilters />

      <CareerTable careers={careers} />
    </div>
  );
}