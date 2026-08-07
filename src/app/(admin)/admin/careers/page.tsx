import { prisma } from "@/lib/db/prisma";
import CareerManagement from "@/components/admin/careers/CareerManagement";

export default async function CareersPage() {
  const careers = await prisma.career.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return <CareerManagement careers={careers} />;
}