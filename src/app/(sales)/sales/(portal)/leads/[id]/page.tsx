import LeadDetailContent from "@/components/sales/LeadDetailContent";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function LeadDetailPage({ params }: PageProps) {
  return <LeadDetailContent params={params} basePath="/sales" />;
}
