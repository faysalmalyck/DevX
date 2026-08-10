"use client";

import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
}

export default function QuantitySelector({ quantity, onChange }: QuantitySelectorProps) {
  return (
    <div
      className="group relative inline-flex h-9 w-24 items-center justify-center rounded-full border border-[#3b455d] bg-[#242d43] text-white"
      aria-label="Quantity selector"
    >
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label="Decrease quantity"
        className="absolute inset-y-0 left-0 grid w-7 place-items-center rounded-l-full text-white/0 transition group-hover:text-white/50 focus:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
      >
        <Minus className="h-3 w-3" />
      </button>

      <span className="text-base font-medium text-white" aria-live="polite">
        {quantity}
      </span>

      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        aria-label="Increase quantity"
        className="absolute inset-y-0 right-0 grid w-7 place-items-center rounded-r-full text-white/0 transition group-hover:text-white/50 focus:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}