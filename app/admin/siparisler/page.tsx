"use client";
import { useEffect, useRef, useState } from "react";
import {
  mockOrders, Order, OrderStatus, PrescriptionStatus,
  STATUS_COLORS, STATUS_LABELS,
  PRESCRIPTION_STATUS_COLORS, PRESCRIPTION_STATUS_LABELS,
} from "@/lib/adminData";

const ALL_STATUSES: OrderStatus[] = ["yeni", "isleniyor", "kargoda", "teslim", "iptal"];

function SecLabel({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
      <span className="material-symbols-outlined" style={{ fontSize: "15px", color: "#9ca3af", fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      <p style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</p>
    </div>
  );
}

export default function AdminSiparisler() {
  const [orders, setOrders]           = useState<Order[]>(mockOrders);
  const [filter, setFilter]           = useState<OrderStatus | "all">("all");
  const [search, setSearch]           = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selected, setSelected]       = useState<Order | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isMobile, setIsMobile]       = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);



  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const newOrder: Order = {
        id: "HL-2026-0092", orderCode: "#2092",
        customer: "Burak Şahin", email: "burak@gmail.com", phone: "0536 000 1122",
        product: "Acuvue Oasys 1-Day (90'lı)", quantity: 1, amount: 899.90,
        status: "yeni", date: "2026-05-21 09:35",
        address: "Bağdat Cad. No: 120 D: 5", neighborhood: "Caddebostan Mah.", district: "Kadıköy", city: "İstanbul", postalCode: "34728",
        requiresPrescription: true, prescriptionStatus: "bekleniyor",
        paymentMethod: "Kredi Kartı", installments: 3, cardLast4: "1234",
      };
      setOrders(prev => {
        if (prev.find(o => o.id === newOrder.id)) return prev;
        return [newOrder, ...prev];
      });
      setNotification(newOrder.id);
      setTimeout(() => setNotification(null), 5000);
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const approvePrescription = (id: string, approve: boolean) => {
    const newStatus: PrescriptionStatus = approve ? "onaylandi" : "reddedildi";
    setOrders(prev => prev.map(o => o.id === id ? { ...o, prescriptionStatus: newStatus } : o));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, prescriptionStatus: newStatus } : null);
  };



  const copy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const filtered = orders.filter(o => {
    const matchFilter = filter === "all" || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || o.id.toLowerCase().includes(q) || o.orderCode.toLowerCase().includes(q) ||
      o.customer.toLowerCase().includes(q) || o.product.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  // Dropdown suggestions — always from full order list regardless of active filter
  const suggestions = search.trim().length > 0
    ? orders.filter(o => {
        const q = search.toLowerCase();
        return o.id.toLowerCase().includes(q) || o.orderCode.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) || o.product.toLowerCase().includes(q);
      }).slice(0, 6)
    : [];
  const showDropdown = searchFocused && suggestions.length > 0;

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {} as Record<OrderStatus, number>);

  const prescIcon = (o: Order) => {
    if (!o.requiresPrescription) return null;
    return PRESCRIPTION_STATUS_COLORS[o.prescriptionStatus || "bekleniyor"];
  };

  const pendingPrescCount = orders.filter(o => o.requiresPrescription && o.prescriptionStatus === "bekleniyor").length;

  /* ─────────── Detail Panel Content (shared mobile/desktop) ─────────── */
  const DetailContent = ({ order }: { order: Order }) => (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "22px" }}>

      {/* Sipariş Kodu */}
      <div style={{ background: "linear-gradient(135deg, #003d9b 0%, #0056e0 100%)", borderRadius: "14px", padding: "18px 20px", color: "white" }}>
        <p style={{ fontSize: "10px", fontWeight: 700, opacity: 0.65, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2px" }}>Sipariş Kodu</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
          <p style={{ fontSize: "32px", fontWeight: 900, fontFamily: "'Plus Jakarta Sans'", letterSpacing: "-1px", lineHeight: 1 }}>{order.orderCode}</p>
          <button onClick={() => copy(order.orderCode, "orderCode")} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "8px", color: "white", cursor: "pointer", padding: "6px 12px", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "5px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>{copiedField === "orderCode" ? "check" : "content_copy"}</span>
            {copiedField === "orderCode" ? "Kopyalandı!" : "Kopyala"}
          </button>
        </div>
        <p style={{ fontSize: "12px", opacity: 0.6, fontFamily: "monospace", marginBottom: "12px" }}>{order.id}</p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px", background: "rgba(255,255,255,0.2)" }}>{STATUS_LABELS[order.status]}</span>
          <span style={{ fontSize: "11px", opacity: 0.6 }}>{order.date}</span>
        </div>
      </div>

      {/* Ürün & Ödeme */}
      <div>
        <SecLabel icon="inventory_2" label="Ürün & Ödeme" />
        <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", flex: 1, lineHeight: "1.4" }}>{order.product}</p>
            <p style={{ fontSize: "15px", fontWeight: 800, color: "#111827", whiteSpace: "nowrap" }}>₺{order.amount.toLocaleString("tr-TR")}</p>
          </div>
          <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "12px" }}>Adet: {order.quantity}</p>
          <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "10px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>Ödeme</p>
              <p style={{ fontSize: "12px", color: "#374151", fontWeight: 600 }}>{order.paymentMethod}</p>
            </div>
            {order.installments && order.installments > 1 && (
              <div>
                <p style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>Taksit</p>
                <p style={{ fontSize: "12px", color: "#374151", fontWeight: 600 }}>{order.installments}x</p>
              </div>
            )}
            {order.cardLast4 && (
              <div>
                <p style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "2px" }}>Kart</p>
                <p style={{ fontSize: "12px", color: "#374151", fontWeight: 600, fontFamily: "monospace" }}>**** {order.cardLast4}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Müşteri */}
      <div>
        <SecLabel icon="person" label="Müşteri Bilgileri" />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { icon: "badge", label: "Ad Soyad", val: order.customer, field: "customer" },
            { icon: "mail", label: "E-posta", val: order.email, field: "email" },
            { icon: "phone", label: "Telefon", val: order.phone, field: "phone" },
          ].map(r => (
            <div key={r.field} style={{ display: "flex", gap: "10px", alignItems: "center", background: "#f9fafb", borderRadius: "10px", padding: "10px 12px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#6b7280", fontVariationSettings: "'FILL' 1" }}>{r.icon}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.label}</p>
                <p style={{ fontSize: "12px", color: "#111827", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.val}</p>
              </div>
              <button onClick={() => copy(r.val, r.field)} style={{ background: "transparent", border: "none", cursor: "pointer", color: copiedField === r.field ? "#16a34a" : "#d1d5db", padding: "4px", display: "flex", flexShrink: 0 }}>
                <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>{copiedField === r.field ? "check" : "content_copy"}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Teslimat Adresi */}
      <div>
        <SecLabel icon="location_on" label="Teslimat Adresi" />
        <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "14px", lineHeight: "1.9" }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{order.customer}</p>
          <p style={{ fontSize: "12px", color: "#374151" }}>{order.address}</p>
          <p style={{ fontSize: "12px", color: "#374151" }}>{order.neighborhood}, {order.district}</p>
          <p style={{ fontSize: "12px", color: "#374151" }}>{order.city} / {order.postalCode}</p>
          <p style={{ fontSize: "12px", color: "#374151" }}>{order.phone}</p>
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <button onClick={() => copy(`${order.customer}\n${order.address}\n${order.neighborhood}, ${order.district}\n${order.city} ${order.postalCode}\n${order.phone}`, "address")} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: "11px", color: copiedField === "address" ? "#16a34a" : "#374151", fontWeight: 600 }}>
            <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>{copiedField === "address" ? "check" : "content_copy"}</span>
            {copiedField === "address" ? "Kopyalandı!" : "Adresi Kopyala"}
          </button>
          <a href={`https://www.google.com/maps/search/${encodeURIComponent(`${order.address} ${order.district} ${order.city}`)}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: "11px", color: "#374151", fontWeight: 600, textDecoration: "none" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>map</span>
            Haritada Gör
          </a>
        </div>
      </div>

      {/* Reçete */}
      <div>
        <SecLabel icon="receipt_long" label="Reçete" />
        {!order.requiresPrescription ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#dcfce7", borderRadius: "10px", padding: "10px 14px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#16a34a", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <p style={{ fontSize: "12px", color: "#166534", fontWeight: 600 }}>Bu ürün için reçete gerekmiyor</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {order.prescriptionStatus && (
              <div style={{ display: "flex", alignItems: "center", gap: "7px", background: PRESCRIPTION_STATUS_COLORS[order.prescriptionStatus].bg, borderRadius: "10px", padding: "10px 14px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: PRESCRIPTION_STATUS_COLORS[order.prescriptionStatus].text, fontVariationSettings: "'FILL' 1" }}>{PRESCRIPTION_STATUS_COLORS[order.prescriptionStatus].icon}</span>
                <p style={{ fontSize: "12px", color: PRESCRIPTION_STATUS_COLORS[order.prescriptionStatus].text, fontWeight: 700 }}>{PRESCRIPTION_STATUS_LABELS[order.prescriptionStatus]}</p>
              </div>
            )}
            {order.prescriptionFile ? (
              <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: order.prescriptionFile.type === "pdf" ? "#fee2e2" : "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "24px", color: order.prescriptionFile.type === "pdf" ? "#dc2626" : "#2563eb", fontVariationSettings: "'FILL' 1" }}>{order.prescriptionFile.type === "pdf" ? "picture_as_pdf" : "image"}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>{order.prescriptionFile.name}</p>
                    <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>{order.prescriptionFile.size} · {order.prescriptionFile.uploadedAt}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "8px", borderRadius: "8px", border: "1px solid #003d9b", background: "#003d9b", cursor: "pointer", fontSize: "11px", color: "white", fontWeight: 700 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>visibility</span>Görüntüle
                  </button>
                  <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "8px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: "11px", color: "#374151", fontWeight: 700 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>download</span>İndir
                  </button>
                </div>
                {order.prescriptionStatus === "yuklendi" && (
                  <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                    <button onClick={() => approvePrescription(order.id, true)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "8px", borderRadius: "8px", border: "1px solid #16a34a", background: "#dcfce7", cursor: "pointer", fontSize: "11px", color: "#16a34a", fontWeight: 700 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>verified</span>Onayla
                    </button>
                    <button onClick={() => approvePrescription(order.id, false)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", padding: "8px", borderRadius: "8px", border: "1px solid #dc2626", background: "#fee2e2", cursor: "pointer", fontSize: "11px", color: "#dc2626", fontWeight: 700 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>cancel</span>Reddet
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background: "#fffbeb", border: "1px dashed #fbbf24", borderRadius: "10px", padding: "14px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#d97706", fontVariationSettings: "'FILL' 1", flexShrink: 0, marginTop: "1px" }}>warning</span>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#92400e" }}>Reçete henüz yüklenmedi</p>
                  <p style={{ fontSize: "11px", color: "#b45309", marginTop: "3px", lineHeight: "1.5" }}>Müşteriyle iletişime geçin veya siparişi beklemeye alın.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Kargo */}
      {(order.trackingCode || order.carrier) && (
        <div>
          <SecLabel icon="local_shipping" label="Kargo Bilgileri" />
          <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {order.carrier && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Kargo Firması</p>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>{order.carrier}</p>
              </div>
            )}
            {order.trackingCode && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Takip Kodu</p>
                  <button onClick={() => copy(order.trackingCode!, "tracking")} style={{ display: "flex", alignItems: "center", gap: "3px", background: "transparent", border: "none", cursor: "pointer", color: copiedField === "tracking" ? "#16a34a" : "#9ca3af", fontSize: "11px", fontWeight: 700 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>{copiedField === "tracking" ? "check" : "content_copy"}</span>
                    {copiedField === "tracking" ? "Kopyalandı!" : "Kopyala"}
                  </button>
                </div>
                <p style={{ fontSize: "16px", fontWeight: 800, color: "#003d9b", fontFamily: "monospace", letterSpacing: "2px" }}>{order.trackingCode}</p>
              </div>
            )}
            {order.shippedAt && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Kargoya Verildi</p>
                <p style={{ fontSize: "12px", color: "#374151" }}>{order.shippedAt}</p>
              </div>
            )}
            {order.estimatedDelivery && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Tahmini Teslimat</p>
                <p style={{ fontSize: "12px", fontWeight: 700, color: "#166534" }}>{order.estimatedDelivery}</p>
              </div>
            )}
          </div>
        </div>
      )}



      {/* Durum Güncelle */}
      <div>
        <SecLabel icon="tune" label="Durum Güncelle" />
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {ALL_STATUSES.map(s => {
            const sc = STATUS_COLORS[s];
            const active = order.status === s;
            return (
              <button key={s} onClick={() => updateStatus(order.id, s)} style={{ padding: "9px 14px", borderRadius: "10px", border: "1px solid", fontSize: "12px", fontWeight: 700, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px", background: active ? sc.text : sc.bg, color: active ? "white" : sc.text, borderColor: sc.text }}>
                <span className="material-symbols-outlined" style={{ fontSize: "15px", fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{active ? "radio_button_checked" : "radio_button_unchecked"}</span>
                {STATUS_LABELS[s]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  /* ─────────── Shared header/filter/search ─────────── */
  const Header = () => (
    <>
      {notification && (
        <div style={{ background: "#003d9b", color: "white", borderRadius: "12px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
          <span style={{ fontSize: "13px", fontWeight: 600, flex: 1 }}>Yeni sipariş: <strong>{notification}</strong></span>
          <button onClick={() => setNotification(null)} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", display: "flex" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
          </button>
        </div>
      )}

      <div>
        <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: isMobile ? "18px" : "22px", fontWeight: 800, color: "#111827" }}>Sipariş Yönetimi</p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginTop: "2px" }}>
          <p style={{ fontSize: "13px", color: "#6b7280" }}>Toplam {orders.length} sipariş · Bugün {orders.filter(o => o.date.startsWith("2026-05-21")).length} yeni</p>
          {pendingPrescCount > 0 && (
            <span style={{ background: "#fffbeb", color: "#92400e", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", border: "1px solid #fde68a" }}>⚠ {pendingPrescCount} reçete bekliyor</span>
          )}
        </div>
      </div>

      {/* Filter pills — horizontal scroll on mobile */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" }}>
        <button onClick={() => setFilter("all")} style={{ padding: "7px 14px", borderRadius: "999px", border: "1px solid", fontSize: "12px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, background: filter === "all" ? "#111827" : "white", color: filter === "all" ? "white" : "#374151", borderColor: filter === "all" ? "#111827" : "#e5e7eb" }}>
          Tümü ({orders.length})
        </button>
        {ALL_STATUSES.map(s => {
          const sc = STATUS_COLORS[s];
          const active = filter === s;
          return (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "7px 14px", borderRadius: "999px", border: "1px solid", fontSize: "12px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, background: active ? sc.text : sc.bg, color: active ? "white" : sc.text, borderColor: sc.text }}>
              {STATUS_LABELS[s]} ({counts[s]})
            </button>
          );
        })}
      </div>

      {/* Search with dropdown */}
      <div ref={searchRef} style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", border: `1px solid ${searchFocused ? "#003d9b" : "#e5e7eb"}`, borderRadius: showDropdown ? "10px 10px 0 0" : "10px", padding: "9px 14px", transition: "border-color 0.15s" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: searchFocused ? "#003d9b" : "#9ca3af" }}>search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Sipariş no, kod, müşteri veya ürün ara…"
            style={{ border: "none", outline: "none", fontSize: "13px", color: "#111827", width: "100%", background: "transparent" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
            </button>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div style={{ position: "absolute", left: 0, right: 0, top: "100%", background: "white", border: "1px solid #003d9b", borderTop: "1px solid #e5e7eb", borderRadius: "0 0 12px 12px", overflow: "hidden", zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
            {suggestions.map(o => {
              const sc = STATUS_COLORS[o.status];
              const pi = prescIcon(o);
              return (
                <button key={o.id} onMouseDown={() => { setSelected(o); setSearch(""); setSearchFocused(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: "white", border: "none", borderBottom: "1px solid #f9fafb", cursor: "pointer", textAlign: "left" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                  onMouseLeave={e => (e.currentTarget.style.background = "white")}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 800, color: "#111827" }}>{o.orderCode}</span>
                      <span style={{ fontSize: "10px", color: "#9ca3af", fontFamily: "monospace" }}>{o.id}</span>
                      {pi && <span className="material-symbols-outlined" style={{ fontSize: "13px", color: pi.text, fontVariationSettings: "'FILL' 1" }}>{pi.icon}</span>}
                    </div>
                    <p style={{ fontSize: "12px", color: "#374151" }}>{o.customer} · <span style={{ color: "#9ca3af" }}>{o.product}</span></p>
                  </div>
                  <div style={{ marginLeft: "auto", flexShrink: 0 }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: sc.bg, color: sc.text }}>{STATUS_LABELS[o.status]}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );

  /* ════════════════════════════════════════
     MOBILE VIEW
  ════════════════════════════════════════ */
  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Header />

        {/* Card list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map(order => {
            const sc = STATUS_COLORS[order.status];
            const pi = prescIcon(order);
            return (
              <button key={order.id} onClick={() => setSelected(order)} style={{ display: "block", width: "100%", background: "white", borderRadius: "14px", border: "1px solid #e5e7eb", padding: "14px 16px", cursor: "pointer", textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "16px", fontWeight: 900, color: "#111827", fontFamily: "'Plus Jakarta Sans'" }}>{order.orderCode}</span>
                    <span style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "monospace" }}>{order.id}</span>
                    {pi && <span className="material-symbols-outlined" style={{ fontSize: "14px", color: pi.text, fontVariationSettings: "'FILL' 1" }}>{pi.icon}</span>}
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "999px", background: sc.bg, color: sc.text, whiteSpace: "nowrap" }}>{STATUS_LABELS[order.status]}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{order.customer}</p>
                  <p style={{ fontSize: "14px", fontWeight: 800, color: "#111827" }}>₺{order.amount.toLocaleString("tr-TR")}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "12px", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: "8px" }}>{order.product} · {order.quantity} adet</p>
                  <p style={{ fontSize: "11px", color: "#9ca3af", whiteSpace: "nowrap" }}>{order.district}, {order.city}</p>
                </div>
                <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "6px" }}>{order.date}</p>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px", padding: "40px 0" }}>Sonuç bulunamadı</div>
          )}
        </div>

        {/* Mobile detail modal (full screen) */}
        {selected && (
          <div style={{ position: "fixed", inset: 0, zIndex: 600, display: "flex", flexDirection: "column" }}>
            <div style={{ background: "rgba(0,0,0,0.4)", position: "absolute", inset: 0 }} onClick={() => setSelected(null)} />
            <div style={{ position: "relative", background: "white", marginTop: "60px", borderRadius: "20px 20px 0 0", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Modal header */}
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px", fontWeight: 800, color: "#111827" }}>{selected.orderCode}</p>
                  <span style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "monospace" }}>{selected.id}</span>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "#f3f4f6", border: "none", cursor: "pointer", color: "#374151", display: "flex", padding: "6px", borderRadius: "999px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>close</span>
                </button>
              </div>
              {/* Scrollable content */}
              <div style={{ overflowY: "auto", flex: 1 }}>
                <DetailContent order={selected} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ════════════════════════════════════════
     DESKTOP VIEW
  ════════════════════════════════════════ */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", height: "100%" }}>
      <Header />

      {/* Table + Detail panel */}
      <div style={{ display: "flex", gap: "16px", flex: 1, minHeight: 0 }}>

        {/* Table */}
        <div style={{ flex: 1, background: "white", borderRadius: "14px", border: "1px solid #e5e7eb", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ overflowY: "auto", flex: 1 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ position: "sticky", top: 0, background: "#f9fafb", zIndex: 1 }}>
                <tr>
                  {["Sipariş", "Müşteri", "Ürün", "Tutar", "Tarih", "Durum", "İşlem"].map(h => (
                    <th key={h} style={{ padding: "11px 14px", fontSize: "10px", fontWeight: 700, color: "#6b7280", textAlign: "left", letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid #f3f4f6" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const sc = STATUS_COLORS[order.status];
                  const isSelected = selected?.id === order.id;
                  const pi = prescIcon(order);
                  return (
                    <tr key={order.id}
                      onClick={() => setSelected(isSelected ? null : order)}
                      style={{ borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isSelected ? "#f0f9ff" : undefined }}
                      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <td style={{ padding: "11px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div>
                            <p style={{ fontSize: "11px", color: "#9ca3af", fontFamily: "monospace" }}>{order.id}</p>
                            <p style={{ fontSize: "13px", fontWeight: 800, color: "#111827" }}>{order.orderCode}</p>
                          </div>
                          {pi && <span className="material-symbols-outlined" style={{ fontSize: "14px", color: pi.text, fontVariationSettings: "'FILL' 1" }} title={order.prescriptionStatus}>{pi.icon}</span>}
                        </div>
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: "#111827" }}>{order.customer}</p>
                        <p style={{ fontSize: "11px", color: "#9ca3af" }}>{order.district}, {order.city}</p>
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <p style={{ fontSize: "12px", color: "#374151", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.product}</p>
                        <p style={{ fontSize: "11px", color: "#9ca3af" }}>{order.quantity} adet</p>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: "13px", fontWeight: 700, color: "#111827", whiteSpace: "nowrap" }}>₺{order.amount.toLocaleString("tr-TR")}</td>
                      <td style={{ padding: "11px 14px", fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap" }}>{order.date}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "999px", background: sc.bg, color: sc.text, whiteSpace: "nowrap" }}>{STATUS_LABELS[order.status]}</span>
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <select value={order.status} onClick={e => e.stopPropagation()} onChange={e => { e.stopPropagation(); updateStatus(order.id, e.target.value as OrderStatus); }} style={{ padding: "5px 8px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "11px", color: "#374151", background: "white", cursor: "pointer" }}>
                          {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px", padding: "40px" }}>Sonuç bulunamadı</p>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ width: "420px", background: "white", borderRadius: "14px", border: "1px solid #e5e7eb", flexShrink: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", flexShrink: 0 }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "14px", fontWeight: 700, color: "#111827" }}>Sipariş Detayı</p>
              <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
              </button>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              <DetailContent order={selected} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
