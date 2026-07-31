"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { useCart } from "./CartContext";

function useModalFocusTrap(isOpen: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusableSelector =
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return { dialogRef, closeButtonRef };
}

function EmptyCartState({ onGoToPricing }: { onGoToPricing: () => void }) {
  return (
    <div className="grid place-items-center px-6 py-8 text-center">
      <div>
        <p className="text-base font-medium tracking-[-0.02em] text-[#c9d0e1]">
          No items found.
        </p>
        <button
          type="button"
          onClick={onGoToPricing}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#2473fa] to-[#3e35f4] px-6 text-sm font-bold tracking-[-0.02em] text-white shadow-[0_8px_20px_rgba(36,93,255,0.25)] transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        >
          Go to pricing
        </button>
      </div>
    </div>
  );
}

export default function CartModal() {
  const {
    isOpen,
    closeCart,
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    tax,
    total,
  } = useCart();

  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { dialogRef, closeButtonRef } = useModalFocusTrap(isOpen, closeCart);

  const handleCheckout = () => {
    if (items.length === 0 || isCheckingOut) return;
    setIsCheckingOut(true);

    try {
      window.sessionStorage.setItem(
        "devx-checkout-cart-v1",
        JSON.stringify(items)
      );
    } catch {
      // Session storage failover safely ignored
    }

    closeCart();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10050] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden={!isOpen}
        >
          <motion.button
            type="button"
            aria-label="Close cart"
            className="absolute inset-0 cursor-default bg-slate-950/75 backdrop-blur-md"
            onClick={closeCart}
          />

          <motion.section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="relative flex max-h-[80dvh] py-8 w-full max-w-lg flex-col overflow-hidden rounded-lg border border-[#414b62] bg-[linear-gradient(180deg,#222a40_0%,#131927_100%)] shadow-[0_28px_100px_rgba(0,0,0,0.65)]"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
          >
            <header className="flex items-center justify-between border-b border-[#414b62] px-4 pb-3 pt-2 sm:px-6 sm:pb-3.5 sm:pt-2.5">
              <h2
                id="cart-title"
                className="text-xl font-bold tracking-[-0.035em] text-white sm:text-2xl"
              >
                Your Cart
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center rounded-xl text-white transition hover:bg-white/[0.09] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                <X className="h-5 w-5 stroke-[1.75]" />
              </button>
            </header>

            {items.length === 0 ? (
              <EmptyCartState
                onGoToPricing={() => {
                  closeCart();
                  router.push("/pricing");
                }}
              />
            ) : (
              <>
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-2 sm:px-6">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onRemove={() => removeItem(item.id)}
                      onQuantityChange={(quantity) =>
                        updateQuantity(item.id, quantity)
                      }
                    />
                  ))}
                </div>

                <footer className="border-t border-[#414b62] bg-[#111725]/65 px-5 py-4 sm:px-6">
                  <CartSummary
                    subtotal={subtotal}
                    discount={discount}
                    tax={tax}
                    total={total}
                  />
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
className="mt-3 flex min-h-10 w-full sm:w-auto items-center justify-center rounded-full bg-blue-600 px-10 py-6 text-center text-sm font-medium text-white shadow-[0_8px_20px_rgba(36,93,255,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:translate-y-0 disabled:cursor-wait disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 mx-auto"                  >
                    {isCheckingOut
                      ? "Preparing checkout…"
                      : "Continue to Checkout"}
                  </button>
                </footer>
              </>
            )}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}