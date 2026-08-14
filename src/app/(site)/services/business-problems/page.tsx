import type { Metadata } from "next";
import ServicesExperience from "@/components/services/ServicesExperience";
import HeroSub from "@/components/shared/HeroSub";

export const metadata: Metadata = {
  title: "Business Problems & Services Experience",
  description:
    "Explore tailored digital solution paths for your business problems, legacy modernization, workflow automation, and system integration.",
  alternates: {
    canonical: "/services/business-problems",
  },
};

export default function BusinessProblemsPage() {
  return (
    <>
      <HeroSub
        title="Business Problems|& Solutions"
        description="Select your operational challenges, legacy constraints, automation goals, and integration needs to build a custom solution blueprint."
      />
      <ServicesExperience />
    </>
  );
}
