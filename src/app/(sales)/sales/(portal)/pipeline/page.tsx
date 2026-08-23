import type { Metadata } from "next";

import SalesPipeline from "@/components/sales/SalesPipeline";

export const metadata: Metadata = {
  title: "Sales pipeline",
  robots: { index: false, follow: false },
};

export default function SalesPipelinePage() {
  return <SalesPipeline />;
}
