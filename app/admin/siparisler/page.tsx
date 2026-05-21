"use client";
import { useEffect, useState } from "react";
import { mockOrders, Order, OrderStatus, STATUS_COLORS, STATUS_LABELS } from "@/lib/adminData";

const ALL_STATUSES: OrderStatus[] = ["yeni", "isleniyor", "kargoda", "teslim", "iptal"];

export default function AdminSiparisler() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Simulate new order after 8s
  useEffect(() => {
    const t = setTimeout(() => {
      const newOrder: Order = {
        id: "HL-2026-0092", customer: "Burak Şahin", email: "burak@gmail.com",
        phone: "0536 000 1122", product: "Acuvue Oasys 1-Day (90'lı)",
        amount: 899.90, status: "yeni", date: "2026-05-21 09:35", city: "İstanbul", requiresPrescription: true,
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

  const filtered = orders.filter(o => {
    const matchFilter = filter === "all" || o.status === filter;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = ALL_STATUSES.reduce((acc, s) => { acc[s] = orders.filter(o => o.status === s).length; return acc; }, {} as Record<OrderStatus, number>);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", height: "100%" }}>

      {/* Bildirim */}
      {notification && (
        <div style={{ background: "#003d9b", color: "white", borderRadius: "12px", padding: "12px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
          <span style={{ fontSize: "13px", fontWeight: 600, flex: 1 }}>Yeni sipariş: <strong>{notification}</strong> — Burak Şahin</span>
          <button onClick={() => setNotification(null)} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", display: "flex" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
          </button>
        </div>
      )}

      {/* Başlık */}
      <div>
        <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "22px", fontWeight: 800, color: "#111827" }}>Sipariş Yönetimi</p>
        <p style={{ fontSize: "13px", color: "#6b7280" }}>Toplam {orders.length} sipariş · Bugün {orders.filter(o => o.date.startsWith("2026-05-21")).length} yeni</p>
      </div>

      {/* Durum filtreleri */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button onClick={() => setFilter("all")} style={{ padding: "7px 14px", borderRadius: "999px", border: "1px solid", fontSize: "12px", fontWeight: 700, cursor: "pointer", background: filter === "all" ? "#111827" : "white", color: filter === "all" ? "white" : "#374151", borderColor: filter === "all" ? "#111827" : "#e5e7eb" }}>
          Tümü ({orders.length})
        </button>
        {ALL_STATUSES.map(s => {
          const sc = STATUS_COLORS[s];
          const active = filter === s;
          return (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "7px 14px", borderRadius: "999px", border: "1px solid", fontSize: "12px", fontWeight: 700, cursor: "pointer", background: active ? sc.text : sc.bg, color: active ? "white" : sc.text, borderColor: sc.text }}>
              {STATUS_LABELS[s]} ({counts[s]})
            </button>
          );
        })}
      </div>

      {/* Arama */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "9px 14px" }}>
        <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#9ca3af" }}>search</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Sipariş no, müşteri adı veya ürün ara…" style={{ border: "none", outline: "none", fontSize: "13px", color: "#111827", width: "100%", background: "transparent" }} />
      </div>

      {/* Tablo + Detay */}
      <div style={{ display: "flex", gap: "16px", flex: 1, minHeight: 0 }}>

        {/* Tablo */}
        <div style={{ flex: 1, background: "white", borderRadius: "14px", border: "1px solid #e5e7eb", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ overflowY: "auto", flex: 1 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ position: "sticky", top: 0, background: "#f9fafb", zIndex: 1 }}>
                <tr>
                  {["Sipariş No", "Müşteri", "Ürün", "Tutar", "Tarih", "Durum", "İşlem"].map(h => (
                    <th key={h} style={{ padding: "11px 14px", fontSize: "10px", fontWeight: 700, color: "#6b7280", textAlign: "left", letterSpacing: "0.05em", textTransform: "uppercase", borderBottom: "1px solid #f3f4f6" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const sc = STATUS_COLORS[order.status];
                  const isSelected = selected?.id === order.id;
                  return (
                    <tr key={order.id}
                      onClick={() => setSelected(isSelected ? null : order)}
                      style={{ borderBottom: "1px solid #f9fafb", cursor: "pointer", background: isSelected ? "#f0f9ff" : undefined }}
                      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#fafafa"; }}
                      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#003d9b", fontFamily: "monospace" }}>{order.id}</span>
                        {order.requiresPrescription && <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#9ca3af", marginLeft: "4px", fontVariationSettings: "'FILL' 1", verticalAlign: "middle" }}>receipt_long</span>}
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: "#111827" }}>{order.customer}</p>
                        <p style={{ fontSize: "11px", color: "#9ca3af" }}>{order.city}</p>
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <p style={{ fontSize: "12px", color: "#374151", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.product}</p>
                      </td>
                      <td style={{ padding: "11px 14px", fontSize: "13px", fontWeight: 700, color: "#111827", whiteSpace: "nowrap" }}>₺{order.amount.toLocaleString("tr-TR")}</td>
                      <td style={{ padding: "11px 14px", fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap" }}>{order.date}</td>
                      <td style={{ padding: "11px 14px" }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "999px", background: sc.bg, color: sc.text, whiteSpace: "nowrap" }}>{STATUS_LABELS[order.status]}</span>
                      </td>
                      <td style={{ padding: "11px 14px" }}>
                        <select
                          value={order.status}
                          onClick={e => e.stopPropagation()}
                          onChange={e => { e.stopPropagation(); updateStatus(order.id, e.target.value as OrderStatus); }}
                          style={{ padding: "5px 8px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "11px", color: "#374151", background: "white", cursor: "pointer" }}
                        >
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

        {/* Detay paneli */}
        {selected && (
          <div style={{ width: "280px", background: "white", borderRadius: "14px", border: "1px solid #e5e7eb", padding: "20px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "14px", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "14px", fontWeight: 700, color: "#111827" }}>Sipariş Detayı</p>
              <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
              </button>
            </div>
            <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "12px" }}>
              <p style={{ fontSize: "12px", fontWeight: 800, color: "#003d9b", fontFamily: "monospace" }}>{selected.id}</p>
              <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: STATUS_COLORS[selected.status].bg, color: STATUS_COLORS[selected.status].text }}>{STATUS_LABELS[selected.status]}</span>
            </div>
            {[
              { icon: "person", label: "Müşteri", val: selected.customer },
              { icon: "mail", label: "E-posta", val: selected.email },
              { icon: "phone", label: "Telefon", val: selected.phone },
              { icon: "location_on", label: "Şehir", val: selected.city },
              { icon: "inventory_2", label: "Ürün", val: selected.product },
              { icon: "payments", label: "Tutar", val: `₺${selected.amount.toLocaleString("tr-TR")}` },
              { icon: "schedule", label: "Tarih", val: selected.date },
              { icon: "receipt_long", label: "Reçete", val: selected.requiresPrescription ? "Gerekli" : "Gerekmiyor" },
            ].map(r => (
              <div key={r.icon} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#9ca3af", fontVariationSettings: "'FILL' 1", marginTop: "1px", flexShrink: 0 }}>{r.icon}</span>
                <div>
                  <p style={{ fontSize: "10px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.label}</p>
                  <p style={{ fontSize: "12px", color: "#111827", fontWeight: 500 }}>{r.val}</p>
                </div>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>Durum Güncelle</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {ALL_STATUSES.map(s => {
                  const sc = STATUS_COLORS[s];
                  const active = selected.status === s;
                  return (
                    <button key={s} onClick={() => updateStatus(selected.id, s)} style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid", fontSize: "12px", fontWeight: 700, cursor: "pointer", textAlign: "left", background: active ? sc.text : sc.bg, color: active ? "white" : sc.text, borderColor: sc.text }}>
                      {STATUS_LABELS[s]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
