import React from "react";
import { getPlanData } from "@/data/pricingdata";
import ProductPageContent from "@/components/pricing/ProductPageContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicPlanPage({ params }: PageProps) {
  const { slug } = await params;
  const productData = getPlanData(slug);

  return <ProductPageContent data={productData} />;
}