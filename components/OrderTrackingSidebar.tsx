"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useOrderTracking } from "@/contexts/OrderTrackingContext";

type ShipmentEvent = {
  date: string;
  time: string;
  location: string;
  status: string;
  detail: string;
};

type Shipment = {
  trackingNo: string;
  carrier: string;
  carrierCode: string;
  status: "preparing" | "in_transit" | "out_for_delivery" | "delivered" | "failed";
  estimatedDelivery: string;
  recipient: string;
  city: string;
  weight: string;
  orderNo: string;
  events: ShipmentEvent[];
};

const mockShipments: Record<string, Shipment> = {
  "TR1234567890": {
    trackingNo: "TR1234567890",
    carrier: "Yurtiçi Kargo",
    carrierCode: "yurtici",
    status: "in_transit",
    estimatedDelivery: "20 Mayıs 2026",
    recipient: "M*** A*** G***",
    city: "İstanbul",
    weight: "0.32 kg",
    orderNo: "HL-2026-4821",
    events: [
      { date: "19 Mayıs 2026", time: "09:14", location: "İstanbul Anadolu Dağıtım Merkezi", status: "Şubede", detail: "Gönderi dağıtım şubesine ulaştı, yarın teslim edilecek." },
      { date: "19 Mayıs 2026", time: "03:47", location: "İstanbul Hub Merkezi", status: "Transfer", detail: "Gönderi hub merkezinden ayrıldı." },
      { date: "18 Mayıs 2026", time: "22:33", location: "Ankara Hub Merkezi", status: "Transfer", detail: "Gönderi hedef şehre doğru hareket ediyor." },
      { date: "18 Mayıs 2026", time: "14:05", location: "Ankara Dağıtım Merkezi", status: "Teslim Alındı", detail: "Kargo firması tarafından gönderici depodan teslim alındı." },
      { date: "18 Mayıs 2026", time: "11:20", location: "Hepsilens Depo", status: "Kargoya Verildi", detail: "Siparişiniz paketlenerek kargo firmasına teslim edildi." },
    ],
  },
  "TR9876543210": {
    trackingNo: "TR9876543210",
    carrier: "MNG Kargo",
    carrierCode: "mng",
    status: "delivered",
    estimatedDelivery: "15 Mayıs 2026",
    recipient: "M*** A*** G***",
    city: "Ankara",
    weight: "0.18 kg",
    orderNo: "HL-2026-3174",
    events: [
      { date: "15 Mayıs 2026", time: "14:22", location: "Ankara Çankaya", status: "Teslim Edildi", detail: "Gönderi alıcıya teslim edildi." },
      { date: "15 Mayıs 2026", time: "08:45", location: "Ankara Çankaya Şubesi", status: "Dağıtımda", detail: "Gönderi dağıtım aracına yüklendi." },
      { date: "14 Mayıs 2026", time: "21:10", location: "Ankara Hub Merkezi", status: "Şubede", detail: "Gönderi dağıtım şubesine ulaştı." },
      { date: "14 Mayıs 2026", time: "07:30", location: "İstanbul Anadolu Hub", status: "Transfer", detail: "Gönderi hedef şehre hareket etti." },
      { date: "13 Mayıs 2026", time: "16:55", location: "Hepsilens Depo", status: "Kargoya Verildi", detail: "Siparişiniz kargo firmasına teslim edildi." },
    ],
  },
  "TR5555000111": {
    trackingNo: "TR5555000111",
    carrier: "Yurtiçi Kargo",
    carrierCode: "yurtici",
    status: "out_for_delivery",
    estimatedDelivery: "19 Mayıs 2026",
    recipient: "M*** A*** G***",
    city: "İzmir",
    weight: "0.45 kg",
    orderNo: "HL-2026-2201",
    events: [
      { date: "19 Mayıs 2026", time: "08:02", location: "İzmir Bornova Şubesi", status: "Dağıtımda", detail: "Gönderi bugün teslim edilmek üzere dağıtıma çıktı." },
      { date: "19 Mayıs 2026", time: "05:30", location: "İzmir Dağıtım Merkezi", status: "Şubede", detail: "Gönderi dağıtım şubesine ulaştı." },
      { date: "18 Mayıs 2026", time: "19:45", location: "İzmir Hub Merkezi", status: "Transfer", detail: "Gönderi hub'a ulaştı." },
      { date: "18 Mayıs 2026", time: "13:30", location: "Hepsilens Depo", status: "Kargoya Verildi", detail: "Siparişiniz kargo firmasına teslim edildi." },
    ],
  },
};

const statusConfig = {
  preparing:        { label: "Hazırlanıyor",    color: "#b45309", bg: "#fef3c7", icon: "inventory_2"          },
  in_transit:       { label: "Kargoda",          color: "#003d9b", bg: "#dae2ff", icon: "local_shipping"       },
  out_for_delivery: { label: "Dağıtımda",        color: "#0369a1", bg: "#e0f2fe", icon: "delivery_truck_speed" },
  delivered:        { label: "Teslim Edildi",    color: "#16a34a", bg: "#dcfce7", icon: "check_circle"         },
  failed:           { label: "Teslim Edilemedi", color: "#dc2626", bg: "#fee2e2", icon: "cancel"               },
};

const steps = [
  { key: "preparing",        label: "Hazırlandı", icon: "inventory_2"          },
  { key: "in_transit",       label: "Kargoda",    icon: "local_shipping"       },
  { key: "out_for_delivery", label: "Dağıtımda",  icon: "delivery_truck_speed" },
  { key: "delivered",        label: "Teslim",     icon: "check_circle"         },
] as const;

const statusOrder: Record<string, number> = {
  preparing: 0, in_transit: 1, out_for_delivery: 2, delivered: 3, failed: 3,
};

function ProgressBar({ status }: { status: Shipment["status"] }) {
  const current = statusOrder[status] ?? 0;
  return (
    <div className="flex items-center px-1">
      {steps.map((step, i) => {
        const done   = i < current;
        const active = i === current && status !== "failed";
        const failed = status === "failed" && i === current;
        const filled = done || active;
        const color  = failed ? "#dc2626" : filled ? "#003d9b" : "#c3c6d6";
        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ background: filled ? (failed ? "#fee2e2" : "#003d9b") : "#f0f1f5" }}>
                <span className="material-symbols-outlined"
                  style={{ fontSize: "16px", color: filled ? (failed ? "#dc2626" : "#fff") : "#c3c6d6", fontVariationSettings: "'FILL' 1" }}>
                  {step.icon}
                </span>
              </div>
              <p style={{ fontSize: "9px", fontWeight: 600, color, whiteSpace: "nowrap" }}>{step.label}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-1.5 mb-4 rounded-full" style={{ background: done ? "#003d9b" : "#edeef3" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrderTrackingSidebar() {
  const { open, prefillNo, closeTracking } = useOrderTracking();
  const [mounted, setMounted]  = useState(false);
  const [input, setInput]      = useState("");
  const [submitted, setSubmitted] = useState("");
  const [shipment, setShipment]   = useState<Shipment | null | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Dışarıdan takip no gelince otomatik sorgula
  useEffect(() => {
    if (open && prefillNo) {
      const q = prefillNo.trim().toUpperCase();
      setInput(q);
      setSubmitted(q);
      setShipment(mockShipments[q] ?? null);
    }
    if (!open) {
      // Kapanınca sıfırla (gecikmeli — kapanış animasyonu bitince)
      const t = setTimeout(() => {
        setInput("");
        setSubmitted("");
        setShipment(undefined);
      }, 350);
      return () => clearTimeout(t);
    }
  }, [open, prefillNo]);

  // ESC + scroll kilidi
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeTracking(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    if (!prefillNo) setTimeout(() => inputRef.current?.focus(), 100);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, closeTracking, prefillNo]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim().toUpperCase();
    if (!q) return;
    setSubmitted(q);
    setShipment(mockShipments[q] ?? null);
  }

  if (!mounted) return null;

  const cfg = shipment ? statusConfig[shipment.status] : null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={closeTracking}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(15,18,35,0.55)",
          backdropFilter: "blur(2px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 9999,
        width: "min(460px, 100vw)",
        background: "#ffffff",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
        display: "flex", flexDirection: "column",
      }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#edeef3]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "18px", fontWeight: 700, color: "#191c1e" }}>Sipariş Takibi</h2>
          </div>
          <button
            onClick={closeTracking}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#737685] hover:bg-[#f3f4f6] hover:text-[#191c1e] transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>close</span>
          </button>
        </div>

        {/* Arama formu */}
        <div className="px-5 py-4 border-b border-[#edeef3]">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#737685]" style={{ fontSize: "18px" }}>
                barcode_scanner
              </span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Takip numarası (örn: TR1234567890)"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#c3c6d6] bg-[#f8f9fb] outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/15 transition-all"
                style={{ fontSize: "13px" }}
              />
            </div>
            <button type="submit"
              className="px-4 py-2.5 rounded-xl font-bold text-white transition-all active:scale-95 flex items-center gap-1.5"
              style={{ background: "#003d9b", fontSize: "13px", fontFamily: "'Inter'" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>search</span>
              Sorgula
            </button>
          </form>

          {/* Demo numaralar */}
          {shipment === undefined && (
            <p className="text-[#737685] mt-2.5" style={{ fontSize: "11px" }}>
              Demo:{" "}
              {["TR1234567890", "TR9876543210", "TR5555000111"].map((n, i) => (
                <span key={n}>
                  <button type="button" onClick={() => setInput(n)}
                    className="font-bold text-[#003d9b] hover:underline">{n}</button>
                  {i < 2 ? ", " : ""}
                </span>
              ))}
            </p>
          )}
        </div>

        {/* İçerik */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          {/* Boş durum */}
          {shipment === undefined && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-16">
              <div className="w-20 h-20 rounded-full bg-[#f0f4ff] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "40px" }}>local_shipping</span>
              </div>
              <div>
                <p className="font-bold text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "16px" }}>Kargo takibi yapın</p>
                <p className="text-[#737685] mt-1" style={{ fontSize: "13px" }}>Takip numaranızı girerek siparişinizin durumunu öğrenin.</p>
              </div>
            </div>
          )}

          {/* Bulunamadı */}
          {shipment === null && (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-[#fee2e2] flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500" style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }}>search_off</span>
              </div>
              <p className="font-bold text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px" }}>Gönderi bulunamadı</p>
              <p className="text-[#737685]" style={{ fontSize: "13px" }}>
                <strong className="text-[#191c1e]">{submitted}</strong> numaralı gönderi bulunamadı.
              </p>
            </div>
          )}

          {/* Gönderi bulundu */}
          {shipment && cfg && (
            <>
              {/* Durum banner */}
              <div className="rounded-xl overflow-hidden border border-[#edeef3]">
                <div className="flex items-center gap-3 px-4 py-3.5" style={{ background: cfg.bg }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.7)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "20px", color: cfg.color, fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate" style={{ fontSize: "15px", color: cfg.color, fontFamily: "'Plus Jakarta Sans'" }}>{cfg.label}</p>
                    {shipment.status !== "delivered"
                      ? <p style={{ fontSize: "12px", color: cfg.color, opacity: 0.8 }}>Tahmini: <strong>{shipment.estimatedDelivery}</strong></p>
                      : <p style={{ fontSize: "12px", color: cfg.color, opacity: 0.8 }}>{shipment.events[0].date} teslim edildi</p>
                    }
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-full font-bold" style={{ fontSize: "10px", background: "rgba(255,255,255,0.6)", color: cfg.color }}>
                    {shipment.trackingNo}
                  </span>
                </div>

                {/* Detaylar */}
                <div className="grid grid-cols-2 divide-x divide-y divide-[#f0f1f5]">
                  {[
                    { icon: "local_shipping", label: "Kargo",   value: shipment.carrier,   color: shipment.carrierCode === "mng" ? "#e65100" : "#d32f2f" },
                    { icon: "location_on",    label: "Şehir",   value: shipment.city },
                    { icon: "person",         label: "Alıcı",   value: shipment.recipient },
                    { icon: "scale",          label: "Ağırlık", value: shipment.weight },
                  ].map(({ icon, label, value, color }) => (
                    <div key={label} className="flex items-center gap-2 px-4 py-3">
                      <span className="material-symbols-outlined shrink-0" style={{ fontSize: "16px", color: color ?? "#737685", fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                      <div className="min-w-0">
                        <p className="text-[#737685]" style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</p>
                        <p className="font-semibold text-[#191c1e] truncate" style={{ fontSize: "12px" }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* İlerleme */}
              <div className="bg-white rounded-xl border border-[#edeef3] px-4 py-4">
                <ProgressBar status={shipment.status} />
              </div>

              {/* Zaman çizelgesi */}
              <div className="bg-white rounded-xl border border-[#edeef3] p-4">
                <p className="font-bold text-[#191c1e] mb-4" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "13px" }}>Gönderi Hareketleri</p>
                <div className="flex flex-col">
                  {shipment.events.map((ev, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5"
                          style={{ background: i === 0 ? cfg.color : "#c3c6d6", boxShadow: i === 0 ? `0 0 0 3px ${cfg.bg}` : "none" }} />
                        {i < shipment.events.length - 1 && (
                          <div className="w-px flex-1 mt-1" style={{ background: "#edeef3", minHeight: "28px" }} />
                        )}
                      </div>
                      <div className="pb-4 flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="min-w-0">
                            <p className="font-bold text-[#191c1e]" style={{ fontSize: "12px" }}>{ev.status}</p>
                            <p className="text-[#737685]" style={{ fontSize: "11px" }}>{ev.location}</p>
                            <p className="text-[#737685] mt-0.5" style={{ fontSize: "11px", lineHeight: "16px" }}>{ev.detail}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-[#434654]" style={{ fontSize: "11px" }}>{ev.date}</p>
                            <p className="text-[#737685]" style={{ fontSize: "10px" }}>{ev.time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
