import type { Metadata } from "next";
import Development from "@/components/home/development/Development";
import ServicesExperience from "@/components/services/ServicesExperience";
import FinalCTA from "@/components/home/final-cta/FinalCTA";
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
        description="Empowering businesses with innovative digital solutions that accelerate growth, enhance efficiency, and create lasting competitive advantage."
      />
      <Development showImprovementCta={false} />
      <ServicesExperience />
      <FinalCTA />
    </>
  );
}
