import { CareerStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { toPublicCareer, type PublicCareer } from "./types";
import { type PublicCareerCategory } from "./constants";

export async function getPublishedCareers(
  category: PublicCareerCategory = "all"
): Promise<PublicCareer[]> {
  const careers = await prisma.career.findMany({
    where: {
      status: CareerStatus.PUBLISHED,
      ...(category === "all" ? {} : { category }),
    },
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "asc" },
    ],
  });

  return careers.map(toPublicCareer);
}

export async function getPublishedCareerBySlug(
  slug: string
): Promise<PublicCareer | null> {
  const career = await prisma.career.findFirst({
    where: {
      slug,
      status: CareerStatus.PUBLISHED,
    },
  });

  return career ? toPublicCareer(career) : null;
}
