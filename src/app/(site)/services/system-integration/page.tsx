import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SolutionDetail from "@/components/services/SolutionDetail";
import { getServiceSolutionBySlug } from "@/data/service-solutions";
import FinalCTA from "@/components/home/final-cta/FinalCTA";

export async function generateMetadata(): Promise<Metadata> {
  const solution = getServiceSolutionBySlug("system-integration");

  if (!solution) {
    return {
      title: "System Integration Services",
    };
  }

  const title = `${solution.title} Services`;
  const url = `/services/system-integration`;

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

export default function SystemIntegrationPage() {
  const solution = getServiceSolutionBySlug("system-integration");

  if (!solution) notFound();

  return (
    <>
      <SolutionDetail solution={solution} />
      <FinalCTA />
    </>
  );
}
