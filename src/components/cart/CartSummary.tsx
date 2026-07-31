"use client";

import { formatCurrency, type CartState } from "./CartContext";

export default function CartSummary({
  subtotal,
  discount,
  tax,
}: Pick<CartState, "subtotal" | "discount" | "tax" | "total">) {
  const amount = subtotal - discount + tax;

  return (
    <div className="flex items-baseline justify-between gap-4 text-[#d5dced]">
      <span className="text-sm tracking-[-0.02em]">Subtotal</span>
      <span className="whitespace-nowrap text-base font-bold tracking-[-0.035em] text-white sm:text-lg">
        {formatCurrency(amount)} USD
      </span>
    </div>
  );
}