"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface PurchaseDetails {
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  package?: string;
  duration?: string;
  additionalNotes?: string;
  [key: string]: string | undefined;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  developmentHours?: string;
  extraHourlyRate?: string;
}

export interface CartItem {
  id: string;
  plan: PricingPlan;
  purchaseDetails: PurchaseDetails;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  itemCount: number;
}

interface CartContextValue extends CartState {
  isOpen: boolean;
  addItem: (plan: PricingPlan, purchaseDetails?: PurchaseDetails) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const STORAGE_KEY = "devx-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

function getItemId(plan: PricingPlan, details: PurchaseDetails) {
  return `${plan.id}:${details.duration ?? "default"}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasRestoredCart, setHasRestoredCart] = useState(false);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart) as unknown;
        if (Array.isArray(parsed)) setItems(parsed as CartItem[]);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHasRestoredCart(true);
    }
  }, []);

  useEffect(() => {
    if (!hasRestoredCart) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hasRestoredCart]);

  const addItem = useCallback((plan: PricingPlan, purchaseDetails: PurchaseDetails = {}) => {
    const itemId = getItemId(plan, purchaseDetails);
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === itemId);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...currentItems, { id: itemId, plan, purchaseDetails, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
      return;
    }
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, item) => sum + item.plan.price * item.quantity, 0);
    const discount = 0;
    const tax = 0;
    return {
      items,
      subtotal,
      discount,
      tax,
      total: subtotal - discount + tax,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      isOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
    };
  }, [addItem, clearCart, closeCart, isOpen, items, openCart, removeItem, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
