"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DurationOption, defaultAddToCartData } from "@/data/pricingdata";
import { useCart, type PricingPlan, type PurchaseDetails } from "@/contexts/CartContext";

export interface AddToCartCardProps {
  cardTitle?: string;
  cardDescription?: string;
  price?: number | string;
  durationOptions?: DurationOption[];
  plan?: PricingPlan;
  purchaseDetails?: PurchaseDetails;
  onAddToCart?: (selectedDuration: string) => void;
}

export default function AddToCartCard({
  cardTitle = defaultAddToCartData.cardTitle,
  cardDescription = defaultAddToCartData.cardDescription,
  price = defaultAddToCartData.price,
  durationOptions = defaultAddToCartData.durationOptions,
  plan,
  purchaseDetails,
  onAddToCart,
}: AddToCartCardProps) {
  const [selectedDuration, setSelectedDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

  const { labels } = defaultAddToCartData;

  const formattedPrice =
    typeof price === "number"
      ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price)
      : `$${price} USD`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDuration) {
      alert(labels.validationAlert);
      return;
    }

    setIsLoading(true);

    const selectedOption = durationOptions.find((option) => option.value === selectedDuration);
    const basePlan: PricingPlan = plan ?? {
      id: cardTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      name: cardTitle,
      price: typeof price === "number" ? price : Number(price.replace(/[^0-9.]/g, "")) || 0,
    };
    const isHourlySelection = /\+\s*\d+\s*hr/i.test(selectedOption?.label ?? selectedDuration);
    const hourlyRate = `${selectedOption?.label ?? ""} ${basePlan.extraHourlyRate ?? ""}`.match(/\$(\d+(?:\.\d+)?)/)?.[1];
    const cartPlan: PricingPlan = {
      ...basePlan,
      price: isHourlySelection && hourlyRate ? Number(hourlyRate) : basePlan.price,
    };
    addItem(cartPlan, { ...purchaseDetails, duration: selectedOption?.label ?? selectedDuration });
    onAddToCart?.(selectedDuration);
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-2xl lg:max-w-none min-h-[500px] sm:min-h-[620px] rounded-lg border border-slate-200 dark:border-slate-600/80 bg-slate-50 dark:bg-[linear-gradient(to_bottom,#262d43,#1a2031)] p-6 sm:p-8 lg:p-10 shadow-xl dark:shadow-2xl flex flex-col justify-between transition-colors duration-300">
      <div>
        <div className="mb-6 mt-4 sm:mt-8 px-2 sm:px-4 space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {cardTitle}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {cardDescription}
          </p>
        </div>

        <div className="mb-6 text-2xl sm:text-3xl px-2 sm:px-4 font-bold text-slate-900 dark:text-white">
          {formattedPrice}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 px-2 sm:px-4 space-y-6">
          <div className="relative">
            <label
              htmlFor="duration"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2"
            >
              {labels.durationSelect}
            </label>
            
            <div className="relative">
              <select
                id="duration"
                name="duration"
                required
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="block w-full appearance-none rounded-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1e2538] px-6 sm:px-8 py-4 sm:py-5 pr-12 text-sm sm:text-base text-slate-900 dark:text-white shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-slate-600 active:ring-1 active:ring-slate-600 cursor-pointer"
              >
                <option value="" disabled className="bg-white dark:bg-[#1a2031] text-slate-400">
                  {labels.durationPlaceholder}
                </option>
                {durationOptions.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-white dark:bg-[#1a2031] text-slate-900 dark:text-white"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Custom Chevron Icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5 text-slate-500 dark:text-slate-400">
                <ChevronDown className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-brand px-6 py-4 sm:py-5 text-center text-lg font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? labels.loadingBtn : labels.addToCartBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
