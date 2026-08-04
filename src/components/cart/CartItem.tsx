"use client";

import { formatCurrency, type CartItem as CartItemType } from "@/contexts/CartContext";
import QuantitySelector from "./QuantitySelector";

const labels: Record<string, string> = {
  companyName: "Company name",
  contactPerson: "Contact person",
  email: "Email",
  phone: "Phone",
  projectType: "Project type",
  package: "Package",
  duration: "Duration",
  additionalNotes: "Additional notes",
};

interface CartItemProps {
  item: CartItemType;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
}

export default function CartItem({ item, onRemove, onQuantityChange }: CartItemProps) {
  const details = Object.entries(item.purchaseDetails).filter(([, value]) => Boolean(value?.trim()));

  return (
    <article className="border-b border-[#3b4557] py-4 last:border-b-0 sm:py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold tracking-[-0.035em] text-[#edf2ff] sm:text-lg">
            {item.plan.name}
          </h3>
          <p className="mt-1 text-sm font-semibold tracking-[-0.025em] text-white sm:text-base">
            {formatCurrency(item.plan.price)} USD
          </p>
          <p className="mt-1 text-xs tracking-[-0.025em] text-[#d5dced]">
            duration:{" "}
            <span className="font-medium text-white">
              {item.purchaseDetails.duration ?? item.plan.developmentHours ?? "—"}
            </span>
          </p>
        </div>
        <QuantitySelector quantity={item.quantity} onChange={onQuantityChange} />
      </div>

      {details.filter(([key]) => key !== "duration").length > 0 && (
        <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 border-l border-white/15 pl-3 text-xs sm:grid-cols-2">
          {details
            .filter(([key]) => key !== "duration")
            .map(([key, value]) => (
              <div key={key} className="min-w-0">
                <dt className="text-white/45">{labels[key] ?? key.replace(/([A-Z])/g, " $1")}</dt>
                <dd className="truncate pt-0.5 text-white/80" title={value}>
                  {value}
                </dd>
              </div>
            ))}
        </dl>
      )}

      <button
        type="button"
        onClick={onRemove}
        className="mt-3 rounded-lg py-0.5 text-xs font-medium tracking-[-0.025em] text-white/70 transition hover:text-rose-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300"
      >
        Remove
      </button>
    </article>
  );
}