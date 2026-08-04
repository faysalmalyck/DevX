"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, LockKeyhole } from "lucide-react";
import { useCart, formatCurrency, CartItem } from "@/contexts/CartContext";

function CheckoutHeader() {
  return (
    <div className="flex gap-4">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500">
        <CheckCircle2 className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-primary">Checkout ready</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Your project brief is saved
        </h1>
        <p className="mt-2 leading-7 text-slate-600 dark:text-white/60">
          We’ll use the selected plan and project details below to complete your order securely.
        </p>
      </div>
    </div>
  );
}

function OrderSummary({ items, total, itemCount }: { items: CartItem[]; total: number; itemCount: number }) {
  if (items.length === 0) {
    return (
      <p className="mt-8 rounded-xl bg-slate-100 p-4 text-sm text-slate-600 dark:bg-white/[0.05] dark:text-white/60">
        Your cart is currently empty. Select a plan to continue.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-3 border-y border-slate-200 py-6 dark:border-white/[0.1]">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-4 text-sm">
          <span className="font-semibold text-slate-900 dark:text-white">
            {item.plan.name}{" "}
            <span className="font-normal text-slate-500 dark:text-white/50">
              × {item.quantity}
            </span>
          </span>
          <span className="font-bold text-slate-900 dark:text-white">
            {formatCurrency(item.plan.price * item.quantity)}
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between pt-3 text-base font-bold text-slate-900 dark:text-white">
        <span>Total ({itemCount} item{itemCount === 1 ? "" : "s"})</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, total, itemCount } = useCart();

  return (
    <main className="premium-shell min-h-screen px-4 pb-20 pt-32 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-primary dark:text-white/60 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue browsing plans
        </Link>

        <div className="mt-7 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-service dark:border-white/[0.12] dark:bg-white/[0.06] sm:p-9">
          <CheckoutHeader />
          
          <OrderSummary items={items} total={total} itemCount={itemCount} />

          <div className="mt-7 flex items-center gap-2 text-xs text-slate-500 dark:text-white/45">
            <LockKeyhole className="h-4 w-4" />
            Your purchase information is retained locally until payment is completed.
          </div>
        </div>
      </div>
    </main>
  );
}