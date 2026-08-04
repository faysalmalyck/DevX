import React from "react";
import Link from "next/link";
import { Check, ArrowLeft } from "lucide-react";
import {
  SimpleProductDetails,
  FullProductDetails,
  professionalProductData,
} from "@/data/pricingdata";
import AddToCartCard from "@/components/pricing/AddToCartCard";
import type { PricingPlan } from "@/contexts/CartContext";

type AnyProductData = SimpleProductDetails | FullProductDetails;

interface ProductPageProps {
  data?: AnyProductData;
}

export default function ProductPage({
  data = professionalProductData,
}: ProductPageProps) {
  const features = data?.features ?? [];
  const bottomContent =
    data && "bottomContent" in data ? data.bottomContent : undefined;
  const hours = data.features.find((feature) => /hours of development/i.test(feature.text))?.text;
  const extraHourlyRate = data.features.find((feature) => /extra hours/i.test(feature.text))?.text;
  const plan: PricingPlan = {
    id: data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    name: data.title,
    price: data.price,
    developmentHours: hours,
    extraHourlyRate,
  };

  return (
    <section className="relative mx-auto mt-12 max-w-7xl px-4 pt-16 pb-12 transition-colors duration-300 sm:px-6 sm:pt-24 lg:mt-16 lg:px-8 lg:pt-32">
      {/* Top Left Back Button (Borderless) */}
      <div className="flex justify-start mb-6 lg:mb-8">
        <Link
          href="/pricing"
          className="mt-12 mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-x-1 hover:text-blue-500 dark:text-slate-200 dark:hover:text-blue-500"
>
  <ArrowLeft className="h-4 w-4" />
          <span>Back to Pricing</span>
        </Link>
      </div>

      {/* 12-column grid layout */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
        
        {/* Left Column: Takes 7 of 12 columns */}
        <div className="flex flex-col space-y-8 pr-0 sm:pr-4 lg:col-span-7 lg:pr-9">
          <div className="space-y-6 sm:space-y-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl dark:text-white">
              {data?.title}
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {data?.description}
            </p>

            {/* Main Features */}
            <ul className="space-y-3 sm:space-y-4">
              {features.map((feature) => (
                <li key={feature.id} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-500" />
                  <span className="text-sm sm:text-base font-medium text-slate-800 dark:text-white">
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {bottomContent && (
            <div className="border-t border-slate-200 dark:border-slate-600 pt-8">
              <div className="prose prose-blue dark:prose-invert max-w-none space-y-6 sm:space-y-8 text-slate-700 dark:text-white">
                {bottomContent.heading && (
                  <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white">
                    {bottomContent.heading}
                  </h2>
                )}
                {bottomContent.paragraph1 && (
                  <p className="text-sm sm:text-base leading-relaxed">
                    {bottomContent.paragraph1}
                  </p>
                )}
                {bottomContent.subheading && (
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {bottomContent.subheading}
                  </h3>
                )}
                {bottomContent.paragraph2 && (
                  <p className="text-sm sm:text-base leading-relaxed">
                    {bottomContent.paragraph2}
                  </p>
                )}

                {/* Bottom Bullets */}
                {bottomContent.bullets && bottomContent.bullets.length > 0 && (
                  <ul className="space-y-3 pl-0">
                    {bottomContent.bullets.map((bullet, index) => (
                      <li key={index} className="flex items-start space-x-3 text-sm sm:text-base text-slate-700 dark:text-white">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-500" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {bottomContent.paragraph3 && (
                  <p className="text-sm sm:text-base leading-relaxed">
                    {bottomContent.paragraph3}
                  </p>
                )}
                {bottomContent.paragraph4 && (
                  <p className="text-sm sm:text-base leading-relaxed">
                    {bottomContent.paragraph4}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="flex min-h-[450px] sm:min-h-[500px] w-full flex-col justify-self-end lg:sticky lg:top-24 lg:col-span-5">
          <AddToCartCard
            cardTitle={data?.cardTitle}
            cardDescription={data?.cardDescription}
            price={data?.price}
            durationOptions={data?.durationOptions}
            plan={plan}
          />
        </div>

      </div>
    </section>
  );
}
