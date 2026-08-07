import { redirect } from "next/navigation";
import CareerManagement from "@/components/admin/careers/CareerManagement";
import { authorizeAdmin } from "@/lib/auth/admin-authorization";
import { getCareerManagementData } from "@/lib/careers/admin-queries";

type CareersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CareersPage({ searchParams }: CareersPageProps) {
  const authorized = await authorizeAdmin("Careers", "VIEW");
  if (!authorized.ok) {
    redirect("/login?portal=admin&redirect=/admin/careers");
  }

  const data = await getCareerManagementData(await searchParams);
  return <CareerManagement {...data} />;
}
