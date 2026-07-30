import React from "react";
import { getPlanData } from "@/data/pricingdata";
import ProductPage from "@/app/(site)/pricing/product/page"; // Verify this import path matches your project structure

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicPlanPage({ params }: PageProps) {
  const { slug } = await params;
  const productData = getPlanData(slug);

  return <ProductPage data={productData} />;
}