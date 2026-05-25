"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Order, SupportTicket, STATUS_LABELS, STATUS_COLORS, TICKET_PRIORITY_COLORS, TICKET_PRIORITY_LABELS } from "@/lib/adminData";

const StatCard = ({ icon, label, value, sub, color, bg }: { icon: string; label: string; value: string | number; sub?: string; color: string; bg: string }) => (
  <div style={{ background: "white", borderRadius: "16px", padding: "20px 24px", border: "1px solid #e5e7eb", display: "flex", alignItems: "flex-start", gap: "16px" }}>
    <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span className="material-symbols-outlined" style={{ fontSize: "24px", color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
    </div>
    <div>
      <p style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>{label}</p>
      <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "28px", fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>{value}</p>
      {sub && <p style={{ fontSize: "12px", color, fontWeight: 600, marginTop: "2px" }}>{sub}</p>}
    </div>
  </div>
);

export default function AdminDashboard() {
  const [activeUsers, setActiveUsers] = useState(47);
  const [newOrderAlert, setNewOrderAlert] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    fetch("/api/admin/orders").then(r => r.json()).then(d => setOrders(d.orders || [])).catch(console.error);
    fetch("/api/admin/tickets").then(r => r.json()).then(d => setTickets(d.tickets || [])).catch(console.error);
  }, []);

  const newOrders = orders.filter(o => o.status === "yeni").length;
  const totalOrders = orders.length;
  const openTickets = tickets.filter(t => t.status === "acik").length;
  const today = new Date().toISOString().slice(0, 10);
  const todayRevenue = orders.filter(o => o.created_at.startsWith(today) && o.status !== "iptal").reduce((s, o) => s + o.total_amount, 0);

  // Simulate real-time active users
  useEffect(() => {
    const id = setInterval(() => {
      setActiveUsers(n => Math.max(30, n + Math.floor(Math.random() * 7) - 3));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Polling for new orders
  useEffect(() => {
    const id = setInterval(() => {
      fetch("/api/admin/orders").then(r => r.json()).then(d => setOrders(d.orders || [])).catch(console.error);
    }, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Yeni sipariş bildirimi */}
      {newOrderAlert && (
        <div style={{ background: "#003d9b", color: "white", borderRadius: "14px", padding: "14px 20px", display: "flex", alignItems: "center", gap: "12px", animation: "slideDown 0.3s ease" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "14px", fontWeight: 700 }}>Yeni sipariş geldi! 🎉</p>
            <p style={{ fontSize: "12px", opacity: 0.85 }}>Sipariş No: {newOrderAlert} — hemen incele</p>
          </div>
          <Link href="/admin/siparisler" style={{ background: "white", color: "#003d9b", padding: "6px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}>İncele</Link>
          <button onClick={() => setNewOrderAlert(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "white", opacity: 0.7, display: "flex", alignItems: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>close</span>
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
        <StatCard icon="person" label="Aktif Kullanıcı" value={activeUsers} sub="Şu an sitede" color="#003d9b" bg="#dae2ff" />
        <StatCard icon="shopping_bag" label="Toplam Sipariş" value={totalOrders} sub="Tüm zamanlar" color="#16a34a" bg="#dcfce7" />
        <StatCard icon="package_2" label="Yeni Sipariş" value={newOrders} sub="İşlem bekliyor" color="#b45309" bg="#fef3c7" />
        <StatCard icon="support_agent" label="Açık Destek" value={openTickets} sub="Yanıt bekliyor" color="#dc2626" bg="#fee2e2" />
        <StatCard icon="payments" label="Bugünkü Ciro" value={`₺${todayRevenue.toLocaleString("tr-TR", { maximumFractionDigits: 0 })}`} sub="Bugün" color="#00687b" bg="#ccf4f9" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "20px" }}>

        {/* Son siparişler */}
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px", fontWeight: 700, color: "#111827" }}>Son Siparişler</p>
            <Link href="/admin/siparisler" style={{ fontSize: "12px", color: "#003d9b", fontWeight: 600, textDecoration: "none" }}>Tümü →</Link>
          </div>
          <div>
            {orders.slice(0, 5).map((order) => {
              const sc = STATUS_COLORS[order.status];
              return (
                <div key={order.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", borderBottom: "1px solid #f9fafb" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.customer_name}</p>
                    <p style={{ fontSize: "11px", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.order_no} · {(order.products ?? "").slice(0, 24)}…</p>
                  </div>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", whiteSpace: "nowrap" }}>₺{order.total_amount.toLocaleString("tr-TR")}</p>
                  <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: sc.bg, color: sc.text, whiteSpace: "nowrap" }}>{STATUS_LABELS[order.status]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Son destek talepleri */}
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px", fontWeight: 700, color: "#111827" }}>Destek Talepleri</p>
            <Link href="/admin/destek" style={{ fontSize: "12px", color: "#003d9b", fontWeight: 600, textDecoration: "none" }}>Tümü →</Link>
          </div>
          <div>
            {tickets.slice(0, 5).map((t) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", borderBottom: "1px solid #f9fafb" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: TICKET_PRIORITY_COLORS[t.priority], flexShrink: 0, fontVariationSettings: "'FILL' 1" }}>
                  {t.status === "acik" ? "error" : t.status === "yanitlandi" ? "schedule" : "check_circle"}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subject}</p>
                  <p style={{ fontSize: "11px", color: "#6b7280" }}>{t.name} · {t.category}</p>
                </div>
                <span style={{ fontSize: "10px", fontWeight: 700, color: TICKET_PRIORITY_COLORS[t.priority] }}>{TICKET_PRIORITY_LABELS[t.priority]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hızlı işlemler */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "20px" }}>
        <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "16px" }}>Hızlı İşlemler</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {[
            { href: "/admin/urunler/yeni", icon: "add_circle", label: "Yeni Ürün Ekle", color: "#003d9b", bg: "#dae2ff" },
            { href: "/admin/banner", icon: "image", label: "Banner Düzenle", color: "#00687b", bg: "#ccf4f9" },
            { href: "/admin/populer", icon: "trending_up", label: "Popüler Ürünleri Güncelle", color: "#b45309", bg: "#fef3c7" },
            { href: "/admin/siparisler", icon: "shopping_bag", label: "Siparişleri Gör", color: "#16a34a", bg: "#dcfce7" },
            { href: "/admin/destek", icon: "support_agent", label: "Destek Talepleri", color: "#dc2626", bg: "#fee2e2" },
          ].map((a) => (
            <Link key={a.href} href={a.href} style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 16px", borderRadius: "10px",
              background: a.bg, textDecoration: "none",
              fontSize: "13px", fontWeight: 600, color: a.color,
              transition: "opacity 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
