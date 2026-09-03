import type { Metadata } from "next";
import Development from "@/components/home/development/Development";
import SolutionLeadCTA from "@/components/services/SolutionLeadCTA";
import HeroSub from "@/components/shared/HeroSub";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore DevX digital solution services across web, SaaS, AI, cloud, and product engineering.",
};

export default function ServicesPage() {
  return (
    <>
      <HeroSub
        title="Our|Services"
        description="
Learn more about our services and find the right solution for your business. Have a project in mind or need guidance? Contact us today for a consultation.
"
      />
      <Development
        showCornerFlares={false}
        showHeading={false}
        showImprovementCta={false}
      />
      <SolutionLeadCTA solutionTitle="Digital Solution" />
    </>
  );
}
