import { CareerStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  careerListQuerySchema,
  type CareerListQuery,
} from "@/lib/validations/career";
import { toCareerContent, type CareerContent } from "./types";

export const CAREERS_PAGE_SIZE = 20;

export type CareerManagementData = {
  careers: CareerContent[];
  categories: string[];
  filters: CareerListQuery;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  stats: {
    total: number;
    published: number;
    draft: number;
    featured: number;
  };
};

function toCareerOrderBy(
  sort: CareerListQuery["sort"]
): Prisma.CareerOrderByWithRelationInput[] {
  switch (sort) {
    case "displayOrder_desc":
      return [{ displayOrder: "desc" }, { createdAt: "asc" }];
    case "title_asc":
      return [{ title: "asc" }, { createdAt: "asc" }];
    case "title_desc":
      return [{ title: "desc" }, { createdAt: "asc" }];
    case "createdAt_desc":
      return [{ createdAt: "desc" }];
    case "createdAt_asc":
      return [{ createdAt: "asc" }];
    case "updatedAt_desc":
      return [{ updatedAt: "desc" }];
    default:
      return [{ displayOrder: "asc" }, { createdAt: "asc" }];
  }
}

export async function getCareerManagementData(
  rawQuery: Record<string, string | string[] | undefined>
): Promise<CareerManagementData> {
  const filters = careerListQuerySchema.parse({
    q: typeof rawQuery.q === "string" ? rawQuery.q : undefined,
    category: typeof rawQuery.category === "string" ? rawQuery.category : undefined,
    status: typeof rawQuery.status === "string" ? rawQuery.status : undefined,
    sort: typeof rawQuery.sort === "string" ? rawQuery.sort : undefined,
    page: typeof rawQuery.page === "string" ? rawQuery.page : undefined,
  });

  const where: Prisma.CareerWhereInput = {
    ...(filters.category ? { category: filters.category } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q, mode: "insensitive" } },
            { slug: { contains: filters.q, mode: "insensitive" } },
            { department: { contains: filters.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const total = await prisma.career.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / CAREERS_PAGE_SIZE));
  const page = Math.min(filters.page, totalPages);

  const [careers, categoryRows, groupedStats, featured] = await Promise.all([
    prisma.career.findMany({
      where,
      orderBy: toCareerOrderBy(filters.sort),
      skip: (page - 1) * CAREERS_PAGE_SIZE,
      take: CAREERS_PAGE_SIZE,
    }),
    prisma.career.findMany({
      where: { category: { not: null } },
      distinct: ["category"],
      select: { category: true },
      orderBy: { category: "asc" },
    }),
    prisma.career.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.career.count({ where: { featured: true } }),
  ]);

  const statusCounts = new Map(
    groupedStats.map((entry) => [entry.status, entry._count._all])
  );

  return {
    careers: careers.map(toCareerContent),
    categories: categoryRows.flatMap((entry) =>
      entry.category && entry.category.trim() ? [entry.category] : []
    ),
    filters: { ...filters, page },
    pagination: {
      page,
      pageSize: CAREERS_PAGE_SIZE,
      total,
      totalPages,
    },
    stats: {
      total: [...statusCounts.values()].reduce((sum, count) => sum + count, 0),
      published: statusCounts.get(CareerStatus.PUBLISHED) ?? 0,
      draft: statusCounts.get(CareerStatus.DRAFT) ?? 0,
      featured,
    },
  };
}
