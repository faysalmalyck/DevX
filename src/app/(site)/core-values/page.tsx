import type { Metadata } from "next";
import CoreValues from "@/components/core-values/CoreValue";

export const metadata: Metadata = {
  title: "Core Values | DevX",
  description: "Explore the core values that drive everything we do at DevX Solutions.",
  alternates: {
    canonical: "/core-values",
  },
};

export default function CoreValuesPage() {
  return <CoreValues />;
}
