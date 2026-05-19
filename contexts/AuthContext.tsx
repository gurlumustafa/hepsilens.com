"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Prescription = {
  id: string;
  fileName: string;
  doctorName: string;
  issueDate: string;   // YYYY-MM-DD
  uploadDate: string;  // YYYY-MM-DD
  expiryDate: string;  // issueDate + 6 months
  notes: string;
};

export type Address = {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  postalCode: string;
  fullAddress: string;
  isDefault: boolean;
};

export type Order = {
  id: string;
  date: string;
  status: "preparing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: { name: string; qty: number; price: number }[];
  trackingNo?: string;
};

export type EmailPreferences = {
  campaigns: boolean;
  orderUpdates: boolean;
  newsletter: boolean;
  stockAlerts: boolean;
  smsNotifications: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAnonymous: boolean;
  avatar?: string;
  memberSince: string;
};

type AuthState = {
  user: User | null;
  prescriptions: Prescription[];
  addresses: Address[];
  orders: Order[];
  emailPreferences: EmailPreferences;
  favorites: number[]; // product ids
};

type AuthContextType = AuthState & {
  loaded: boolean;
  register: (name: string, email: string) => void;
  loginAnonymous: () => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  addPrescription: (p: Omit<Prescription, "id" | "uploadDate" | "expiryDate">) => void;
  removePrescription: (id: string) => void;
  addAddress: (a: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  updateEmailPreferences: (prefs: Partial<EmailPreferences>) => void;
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
};

const defaultPreferences: EmailPreferences = {
  campaigns: true,
  orderUpdates: true,
  newsletter: false,
  stockAlerts: false,
  smsNotifications: false,
};

const mockOrders: Order[] = [
  {
    id: "HL-2026-4821",
    date: "2026-05-18",
    status: "shipped",
    total: 389,
    trackingNo: "TR1234567890",
    items: [{ name: "Acuvue Oasys for Astigmatism", qty: 1, price: 389 }],
  },
  {
    id: "HL-2026-3174",
    date: "2026-05-13",
    status: "delivered",
    total: 558,
    trackingNo: "TR9876543210",
    items: [
      { name: "Dailies Total1", qty: 2, price: 249 },
      { name: "Renu MultiPlus", qty: 1, price: 89 },
    ],
  },
  {
    id: "HL-2026-2201",
    date: "2026-04-29",
    status: "delivered",
    total: 245,
    trackingNo: "TR5555000111",
    items: [{ name: "FreshLook Colorblends - Mavi", qty: 1, price: 245 }],
  },
];

const STORAGE_KEY = "hepsilens_auth";

const AuthContext = createContext<AuthContextType | null>(null);

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}

function uuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    favorites: [],
    user: null,
    prescriptions: [],
    addresses: [],
    orders: mockOrders,
    emailPreferences: defaultPreferences,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  function persist(next: AuthState) {
    setState(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }

  function register(name: string, email: string) {
    const user: User = {
      id: uuid(),
      name,
      email,
      phone: "",
      isAnonymous: false,
      memberSince: new Date().toISOString().split("T")[0],
    };
    persist({ ...state, user });
  }

  function loginAnonymous() {
    const user: User = {
      id: uuid(),
      name: "Misafir Kullanıcı",
      email: "",
      phone: "",
      isAnonymous: true,
      memberSince: new Date().toISOString().split("T")[0],
    };
    persist({ ...state, user });
  }

  function logout() {
    const next: AuthState = { user: null, prescriptions: [], addresses: [], orders: mockOrders, emailPreferences: defaultPreferences, favorites: [] };
    persist(next);
  }

  function updateUser(data: Partial<User>) {
    if (!state.user) return;
    persist({ ...state, user: { ...state.user, ...data } });
  }

  function addPrescription(p: Omit<Prescription, "id" | "uploadDate" | "expiryDate">) {
    const today = new Date().toISOString().split("T")[0];
    const prescription: Prescription = {
      ...p,
      id: uuid(),
      uploadDate: today,
      expiryDate: addMonths(p.issueDate, 6),
    };
    persist({ ...state, prescriptions: [...state.prescriptions, prescription] });
  }

  function removePrescription(id: string) {
    persist({ ...state, prescriptions: state.prescriptions.filter((p) => p.id !== id) });
  }

  function addAddress(a: Omit<Address, "id">) {
    const address: Address = { ...a, id: uuid() };
    const addresses = a.isDefault
      ? [...state.addresses.map((x) => ({ ...x, isDefault: false })), address]
      : [...state.addresses, address];
    persist({ ...state, addresses });
  }

  function removeAddress(id: string) {
    persist({ ...state, addresses: state.addresses.filter((a) => a.id !== id) });
  }

  function setDefaultAddress(id: string) {
    persist({ ...state, addresses: state.addresses.map((a) => ({ ...a, isDefault: a.id === id })) });
  }

  function updateEmailPreferences(prefs: Partial<EmailPreferences>) {
    persist({ ...state, emailPreferences: { ...state.emailPreferences, ...prefs } });
  }

  function toggleFavorite(id: number) {
    const favs = state.favorites ?? [];
    const next = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
    persist({ ...state, favorites: next });
  }

  function isFavorite(id: number) {
    return (state.favorites ?? []).includes(id);
  }

  return (
    <AuthContext.Provider value={{ ...state, loaded, register, loginAnonymous, logout, updateUser, addPrescription, removePrescription, addAddress, removeAddress, setDefaultAddress, updateEmailPreferences, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function isExpired(expiryDate: string) {
  return new Date(expiryDate) < new Date();
}

export function isNearExpiry(expiryDate: string) {
  const diff = new Date(expiryDate).getTime() - Date.now();
  return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
}
