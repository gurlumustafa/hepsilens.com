"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// ── Tipler ────────────────────────────────────────────────────

export type Address = {
  id: number;
  title: string;
  full_name: string;
  phone?: string;
  city: string;
  district: string;
  neighborhood?: string;
  postal_code?: string;
  full_address: string;
  is_default: boolean;
};

export type OrderItem = {
  product_name: string;
  product_brand?: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  id: number;
  order_no: string;
  status: "yeni" | "isleniyor" | "kargoda" | "teslim" | "iptal";
  total_amount: number;
  created_at: string;
  tracking_code?: string;
  carrier?: string;
  items?: OrderItem[];
};

export type User = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  is_anonymous: boolean;
  notif_email: boolean;
  notif_sms: boolean;
  member_since: string;
};

// ── Context tipi ──────────────────────────────────────────────

type AuthContextType = {
  user:      User | null;
  addresses: Address[];
  orders:    Order[];
  favorites: number[];
  loaded:    boolean;

  login:    (email: string, password: string) => Promise<{ error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout:   () => Promise<void>;
  refresh:  () => Promise<void>;

  updateUser:        (data: Partial<Pick<User, "name" | "email" | "phone" | "notif_email" | "notif_sms">>) => Promise<void>;
  addAddress:        (a: Omit<Address, "id">) => Promise<{ error?: string }>;
  removeAddress:     (id: number) => Promise<void>;
  setDefaultAddress: (id: number) => Promise<void>;
  toggleFavorite:    (id: number) => Promise<void>;
  isFavorite:        (id: number) => boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,      setUser]      = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders,    setOrders]    = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loaded,    setLoaded]    = useState(false);

  /** Sunucudan oturum verisini çek */
  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        setUser(null); setAddresses([]); setOrders([]); setFavorites([]);
        return;
      }
      const data = await res.json();
      const u = data.user;
      setUser({
        id:          u.id,
        name:        u.name,
        email:       u.email ?? null,
        phone:       u.phone ?? null,
        is_anonymous: !!u.is_anonymous,
        notif_email: !!u.notif_email,
        notif_sms:   !!u.notif_sms,
        member_since: u.member_since,
      });
      setAddresses(data.addresses || []);
      setOrders(data.orders   || []);
      setFavorites(data.favorites || []);
    } catch {
      setUser(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // ── Auth ──────────────────────────────────────────────────

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return { error: d.error || "Giriş başarısız" };
    }
    await refresh();
    return {};
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return { error: d.error || "Kayıt başarısız" };
    }
    await refresh();
    return {};
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null); setAddresses([]); setOrders([]); setFavorites([]);
  };

  // ── Kullanıcı güncelle ────────────────────────────────────

  const updateUser = async (data: Partial<Pick<User, "name" | "email" | "phone" | "notif_email" | "notif_sms">>) => {
    await fetch("/api/auth/me", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });
    setUser((u) => (u ? { ...u, ...data } : u));
  };

  // ── Adresler ──────────────────────────────────────────────

  const addAddress = async (a: Omit<Address, "id">): Promise<{ error?: string }> => {
    try {
      const res = await fetch("/api/addresses", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(a),
      });
      if (res.ok) {
        const { id } = await res.json();
        const newAddr: Address = { ...a, id };
        setAddresses((prev) => {
          const next = a.is_default
            ? prev.map((x) => ({ ...x, is_default: false }))
            : [...prev];
          return [...next, newAddr];
        });
        return {};
      }
      const d = await res.json().catch(() => ({}));
      return { error: d.error || `Hata (${res.status})` };
    } catch {
      return { error: "Bağlantı hatası" };
    }
  };

  const removeAddress = async (id: number) => {
    await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefaultAddress = async (id: number) => {
    await fetch(`/api/addresses/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ is_default: true }),
    });
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, is_default: a.id === id }))
    );
  };

  // ── Favoriler ─────────────────────────────────────────────

  const toggleFavorite = async (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    await fetch("/api/favorites", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ productId: id }),
    });
  };

  const isFavorite = (id: number) => favorites.includes(id);

  return (
    <AuthContext.Provider
      value={{
        user, addresses, orders, favorites, loaded,
        login, register, logout, refresh,
        updateUser,
        addAddress, removeAddress, setDefaultAddress,
        toggleFavorite, isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
