import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SolutionDetail from "@/components/services/SolutionDetail";
import {
  getServiceSolutionBySlug,
  serviceSolutions,
} from "@/data/service-solutions";

type SolutionPageProps = Readonly<{
  params: Promise<{
    slug: string;
  }>;
}>;

export function generateStaticParams() {
  return serviceSolutions.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = getServiceSolutionBySlug(slug);

  if (!solution) notFound();

  const title = `${solution.title} Services`;
  const url = `/services/${solution.slug}`;

  return {
    title,
    description: solution.summary,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: solution.summary,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: solution.summary,
    },
  };
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  const solution = getServiceSolutionBySlug(slug);

  if (!solution) notFound();

  return <SolutionDetail solution={solution} />;
}
