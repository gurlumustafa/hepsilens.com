"use client";
import { useEffect, useState } from "react";
import { SupportTicket, TicketStatus, TICKET_STATUS_COLORS, TICKET_STATUS_LABELS, TICKET_PRIORITY_COLORS, TICKET_PRIORITY_LABELS } from "@/lib/adminData";

const ALL_STATUSES: TicketStatus[] = ["acik", "yanitlandi", "kapali"];

export default function AdminDestek() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filter, setFilter] = useState<TicketStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    fetch("/api/admin/tickets")
      .then(r => r.json())
      .then(d => setTickets(d.tickets || []))
      .catch(console.error);
  }, []);

  const filtered = tickets.filter(t => {
    const matchF = filter === "all" || t.status === filter;
    const matchS = String(t.id).toLowerCase().includes(search.toLowerCase())
      || t.name.toLowerCase().includes(search.toLowerCase())
      || t.subject.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  const updateStatus = (id: number, status: TicketStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = tickets.filter(t => t.status === s).length;
    return acc;
  }, {} as Record<TicketStatus, number>);

  const priorityIcon = (p: SupportTicket["priority"]) =>
    ({ dusuk: "info", normal: "help", yuksek: "warning", kritik: "error" }[p]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", height: "100%" }}>
      <div>
        <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "22px", fontWeight: 800, color: "#111827" }}>Destek Talepleri</p>
        <p style={{ fontSize: "13px", color: "#6b7280" }}>Toplam {tickets.length} talep · {counts.acik} açık</p>
      </div>

      {/* Filtreler */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" }}>
        <button onClick={() => setFilter("all")} style={{ padding: "7px 14px", borderRadius: "999px", border: "1px solid", fontSize: "12px", fontWeight: 700, cursor: "pointer", background: filter === "all" ? "#111827" : "white", color: filter === "all" ? "white" : "#374151", borderColor: filter === "all" ? "#111827" : "#e5e7eb" }}>
          Tümü ({tickets.length})
        </button>
        {ALL_STATUSES.map(s => {
          const sc = TICKET_STATUS_COLORS[s];
          const active = filter === s;
          return (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "7px 14px", borderRadius: "999px", border: "1px solid", fontSize: "12px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, background: active ? sc.text : sc.bg, color: active ? "white" : sc.text, borderColor: sc.text }}>
              {TICKET_STATUS_LABELS[s]} ({counts[s]})
            </button>
          );
        })}
      </div>

      {/* Arama */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", border: "1px solid #e5e7eb", borderRadius: "10px", padding: "9px 14px" }}>
        <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#9ca3af" }}>search</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Talep no, müşteri adı veya konu ara…" style={{ border: "none", outline: "none", fontSize: "13px", color: "#111827", width: "100%", background: "transparent" }} />
      </div>

      <div style={{ display: "flex", gap: "16px", flex: 1, minHeight: 0 }}>
        {/* Liste */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto" }}>
          {filtered.map((t) => {
            const sc = TICKET_STATUS_COLORS[t.status];
            const isSelected = selected?.id === t.id;
            return (
              <div key={t.id} onClick={() => setSelected(isSelected ? null : t)}
                style={{ background: "white", borderRadius: "12px", border: `1px solid ${isSelected ? "#003d9b" : "#e5e7eb"}`, padding: "14px 16px", cursor: "pointer", transition: "all 0.15s", boxShadow: isSelected ? "0 0 0 3px rgba(0,61,155,0.12)" : undefined }}
                onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = "#bfdbfe"; }}
                onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", flex: 1, minWidth: 0 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px", color: TICKET_PRIORITY_COLORS[t.priority], flexShrink: 0, fontVariationSettings: "'FILL' 1", marginTop: "1px" }}>{priorityIcon(t.priority)}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subject}</p>
                      <p style={{ fontSize: "12px", color: "#6b7280" }}>{t.name} · {t.category}</p>
                      <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.message}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: sc.bg, color: sc.text }}>{TICKET_STATUS_LABELS[t.status]}</span>
                    <span style={{ fontSize: "10px", color: "#9ca3af" }}>{t.created_at}</span>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: TICKET_PRIORITY_COLORS[t.priority] }}>{TICKET_PRIORITY_LABELS[t.priority]}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e5e7eb", padding: "48px", textAlign: "center", color: "#9ca3af" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "48px" }}>inbox</span>
              <p style={{ marginTop: "8px", fontSize: "14px" }}>Talep bulunamadı</p>
            </div>
          )}
        </div>

        {/* Detay paneli — desktop yan panel, mobile full-screen modal */}
        {selected && (
          <div style={isMobile ? { position: "fixed", inset: 0, zIndex: 600, display: "flex", flexDirection: "column" } : { width: "300px", background: "white", borderRadius: "14px", border: "1px solid #e5e7eb", flexShrink: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Mobile backdrop */}
            {isMobile && <div onClick={() => setSelected(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />}
            {/* Panel container */}
            <div style={isMobile ? { position: "relative", background: "white", marginTop: "60px", borderRadius: "20px 20px 0 0", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" } : { display: "contents" }}>
            {/* Header */}
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", flexShrink: 0 }}>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 800, color: "#003d9b", fontFamily: "monospace" }}>{selected.id}</p>
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: TICKET_STATUS_COLORS[selected.status].bg, color: TICKET_STATUS_COLORS[selected.status].text }}>{TICKET_STATUS_LABELS[selected.status]}</span>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: isMobile ? "#f3f4f6" : "transparent", border: "none", cursor: "pointer", color: "#374151", display: "flex", padding: "6px", borderRadius: "999px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
              </button>
            </div>

            <div style={{ padding: "16px 18px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Konu */}
              <div>
                <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "2px" }}>{selected.subject}</p>
                <p style={{ fontSize: "12px", color: "#6b7280" }}>
                  {selected.category} ·{" "}
                  <span style={{ color: TICKET_PRIORITY_COLORS[selected.priority], fontWeight: 700 }}>{TICKET_PRIORITY_LABELS[selected.priority]}</span>
                </p>
              </div>

              {/* Mesaj */}
              <div style={{ background: "#f0f9ff", borderRadius: "10px", padding: "14px", borderLeft: "3px solid #003d9b" }}>
                <p style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6 }}>{selected.message}</p>
              </div>

              {/* İletişim bilgileri */}
              <div style={{ background: "#f9fafb", borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: "0.06em" }}>Müşteri İletişim Bilgileri</p>

                {/* Müşteri adı */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#9ca3af", fontVariationSettings: "'FILL' 1" }}>person</span>
                  <span style={{ fontSize: "13px", color: "#374151", fontWeight: 600 }}>{selected.name}</span>
                </div>

                {/* E-posta */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#9ca3af", fontVariationSettings: "'FILL' 1" }}>mail</span>
                  <a href={`mailto:${selected.email}`} style={{ fontSize: "13px", color: "#003d9b", fontWeight: 600, textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
                  >{selected.email}</a>
                </div>

                {/* Telefon */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#9ca3af", fontVariationSettings: "'FILL' 1" }}>phone</span>
                  <a href={`tel:${(selected.phone ?? "").replace(/\s/g, "")}`} style={{ fontSize: "13px", color: "#003d9b", fontWeight: 600, textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
                  >{selected.phone ?? "—"}</a>
                </div>

                {/* Tarih */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#9ca3af" }}>schedule</span>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>{selected.created_at}</span>
                </div>
              </div>

              {/* İletişim butonları */}
              <div style={{ display: "flex", gap: "8px" }}>
                <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px 12px", borderRadius: "10px", background: "#dae2ff", color: "#003d9b", textDecoration: "none", fontSize: "12px", fontWeight: 700 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>mail</span>
                  E-posta Gönder
                </a>
                <a href={`tel:${(selected.phone ?? "").replace(/\s/g, "")}`}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px 12px", borderRadius: "10px", background: "#dcfce7", color: "#166534", textDecoration: "none", fontSize: "12px", fontWeight: 700 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>phone</span>
                  Ara
                </a>
              </div>

              {/* Durum güncelle */}
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Durumu Güncelle</p>
                <div style={{ display: "flex", gap: "6px" }}>
                  {ALL_STATUSES.map(s => {
                    const sc = TICKET_STATUS_COLORS[s];
                    const active = selected.status === s;
                    return (
                      <button key={s} onClick={() => updateStatus(selected.id, s)} style={{ flex: 1, padding: "7px 4px", borderRadius: "8px", border: "1px solid", fontSize: "11px", fontWeight: 700, cursor: "pointer", textAlign: "center", background: active ? sc.text : sc.bg, color: active ? "white" : sc.text, borderColor: sc.text }}>
                        {TICKET_STATUS_LABELS[s]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            </div>{/* Panel container end */}
          </div>
        )}
      </div>
    </div>
  );
}
