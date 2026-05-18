"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CartItem = {
  id: number;
  name: string;
  brand: string;
  price: number;
  imageUrl?: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  count: number;
  total: number;
  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "hepsilens_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems]         = useState<CartItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  function persist(next: CartItem[]) {
    setItems(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }

  function addItem(item: Omit<CartItem, "quantity">) {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      const next = existing
        ? prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
    setSidebarOpen(true);
  }

  function removeItem(id: number) {
    persist(items.filter((i) => i.id !== id));
  }

  function updateQty(id: number, qty: number) {
    if (qty < 1) return removeItem(id);
    persist(items.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  }

  function clearCart() { persist([]); }

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, total, sidebarOpen, openSidebar: () => setSidebarOpen(true), closeSidebar: () => setSidebarOpen(false), addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
