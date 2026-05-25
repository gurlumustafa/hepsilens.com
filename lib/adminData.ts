// ──────────────────────────────────────────────────────────────
// HepsiLens Admin — Tip tanımlamaları ve sabitler
// Mock veriler kaldırıldı; tüm veri MySQL DB'den geliyor.
// API: /api/admin/orders, /api/admin/tickets, /api/admin/stats
// ──────────────────────────────────────────────────────────────

export type OrderStatus      = "yeni" | "isleniyor" | "kargoda" | "teslim" | "iptal";
export type TicketStatus     = "acik" | "yanitlandi" | "kapali";
export type TicketPriority   = "dusuk" | "normal" | "yuksek" | "kritik";
export type PrescriptionStatus = "bekleniyor" | "yuklendi" | "onaylandi" | "reddedildi";

export type Order = {
  id: number;
  order_no: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  status: OrderStatus;
  total_amount: number;
  subtotal?: number;
  shipping_cost?: number;
  pay_method: string;
  installments?: number;
  card_last4?: string;
  ship_full_name?: string;
  ship_phone?: string;
  ship_city?: string;
  ship_district?: string;
  ship_neighborhood?: string;
  ship_postal_code?: string;
  ship_full_address?: string;
  requires_prescription: boolean;
  prescription_status?: PrescriptionStatus;
  tracking_code?: string;
  carrier?: string;
  estimated_delivery?: string;
  shipped_at?: string;
  customer_note?: string;
  admin_note?: string;
  created_at: string;
  products?: string;       // GROUP_CONCAT sonucu
  total_qty?: number;
};

export type SupportTicket = {
  id: number;
  ticket_no: string;
  user_id?: number;
  name: string;
  email?: string;
  phone?: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  category?: string;
  admin_reply?: string;
  created_at: string;
  updated_at: string;
};

// ── Durum etiketleri ve renkleri ──────────────────────────────

export const STATUS_LABELS: Record<OrderStatus, string> = {
  yeni:      "Yeni",
  isleniyor: "İşleniyor",
  kargoda:   "Kargoda",
  teslim:    "Teslim Edildi",
  iptal:     "İptal",
};

export const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  yeni:      { bg: "#dbeafe", text: "#1d4ed8" },
  isleniyor: { bg: "#fef3c7", text: "#92400e" },
  kargoda:   { bg: "#ccf4f9", text: "#00687b" },
  teslim:    { bg: "#dcfce7", text: "#166534" },
  iptal:     { bg: "#fee2e2", text: "#991b1b" },
};

export const PRESCRIPTION_STATUS_LABELS: Record<PrescriptionStatus, string> = {
  bekleniyor: "Reçete Bekleniyor",
  yuklendi:   "Yüklendi — İnceleniyor",
  onaylandi:  "Reçete Onaylandı",
  reddedildi: "Reçete Reddedildi",
};

export const PRESCRIPTION_STATUS_COLORS: Record<PrescriptionStatus, { bg: string; text: string; icon: string }> = {
  bekleniyor: { bg: "#fffbeb", text: "#92400e",  icon: "hourglass_empty" },
  yuklendi:   { bg: "#dbeafe", text: "#1d4ed8",  icon: "pending" },
  onaylandi:  { bg: "#dcfce7", text: "#166534",  icon: "verified" },
  reddedildi: { bg: "#fee2e2", text: "#991b1b",  icon: "cancel" },
};

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  acik:       "Açık",
  yanitlandi: "Yanıtlandı",
  kapali:     "Kapalı",
};

export const TICKET_STATUS_COLORS: Record<TicketStatus, { bg: string; text: string }> = {
  acik:       { bg: "#fee2e2", text: "#991b1b" },
  yanitlandi: { bg: "#fef3c7", text: "#92400e" },
  kapali:     { bg: "#f1f5f9", text: "#64748b" },
};

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  dusuk:  "Düşük",
  normal: "Normal",
  yuksek: "Yüksek",
  kritik: "Kritik",
};

export const TICKET_PRIORITY_COLORS: Record<TicketPriority, string> = {
  dusuk:  "#64748b",
  normal: "#003d9b",
  yuksek: "#b45309",
  kritik: "#dc2626",
};
