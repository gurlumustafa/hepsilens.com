"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

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
      { date: "19 Mayıs 2026", time: "09:14", location: "İstanbul Anadolu Dağıtım Merkezi", status: "Şubede",        detail: "Gönderi dağıtım şubesine ulaştı, yarın teslim edilecek." },
      { date: "19 Mayıs 2026", time: "03:47", location: "İstanbul Hub Merkezi",             status: "Transfer",      detail: "Gönderi hub merkezinden ayrıldı." },
      { date: "18 Mayıs 2026", time: "22:33", location: "Ankara Hub Merkezi",               status: "Transfer",      detail: "Gönderi hedef şehre doğru hareket ediyor." },
      { date: "18 Mayıs 2026", time: "14:05", location: "Ankara Dağıtım Merkezi",           status: "Teslim Alındı", detail: "Kargo firması tarafından gönderici depodan teslim alındı." },
      { date: "18 Mayıs 2026", time: "11:20", location: "Hepsilens Depo",                   status: "Kargoya Verildi", detail: "Siparişiniz paketlenerek kargo firmasına teslim edildi." },
      { date: "18 Mayıs 2026", time: "09:00", location: "Hepsilens Depo",                   status: "Hazırlanıyor",  detail: "Siparişiniz paketleniyor." },
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
      { date: "15 Mayıs 2026", time: "14:22", location: "Ankara Çankaya",          status: "Teslim Edildi", detail: "Gönderi alıcıya teslim edildi." },
      { date: "15 Mayıs 2026", time: "08:45", location: "Ankara Çankaya Şubesi",   status: "Dağıtımda",     detail: "Gönderi dağıtım aracına yüklendi." },
      { date: "14 Mayıs 2026", time: "21:10", location: "Ankara Hub Merkezi",      status: "Şubede",        detail: "Gönderi dağıtım şubesine ulaştı." },
      { date: "14 Mayıs 2026", time: "07:30", location: "İstanbul Anadolu Hub",    status: "Transfer",      detail: "Gönderi hedef şehre hareket etti." },
      { date: "13 Mayıs 2026", time: "16:55", location: "Hepsilens Depo",          status: "Kargoya Verildi", detail: "Siparişiniz kargo firmasına teslim edildi." },
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
      { date: "19 Mayıs 2026", time: "08:02", location: "İzmir Bornova Şubesi",    status: "Dağıtımda",       detail: "Gönderi bugün teslim edilmek üzere dağıtıma çıktı." },
      { date: "19 Mayıs 2026", time: "05:30", location: "İzmir Dağıtım Merkezi",   status: "Şubede",          detail: "Gönderi dağıtım şubesine ulaştı." },
      { date: "18 Mayıs 2026", time: "19:45", location: "İzmir Hub Merkezi",       status: "Transfer",        detail: "Gönderi hub'a ulaştı." },
      { date: "18 Mayıs 2026", time: "13:30", location: "Hepsilens Depo",          status: "Kargoya Verildi", detail: "Siparişiniz kargo firmasına teslim edildi." },
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

const carrierColors: Record<string, string> = {
  yurtici: "#d32f2f",
  mng:     "#e65100",
  ptt:     "#1565c0",
  aras:    "#2e7d32",
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

// Takip numarasından deterministik bir sayı üret (0-99)
function hashNo(no: string): number {
  let h = 0;
  for (let i = 0; i < no.length; i++) h = (h * 31 + no.charCodeAt(i)) & 0xffff;
  return h % 100;
}

const carriers = [
  { name: "Yurtiçi Kargo", code: "yurtici" },
  { name: "MNG Kargo",     code: "mng"     },
  { name: "Aras Kargo",    code: "aras"    },
  { name: "PTT Kargo",     code: "ptt"     },
];

const cities = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Gaziantep", "Konya"];

const hubCities = ["Ankara", "İstanbul", "İzmir"];

// Herhangi bir takip no için gerçekçi gönderi üret
function generateShipment(no: string): Shipment {
  const h = hashNo(no);
  const carrier = carriers[h % carriers.length];
  const city = cities[(h + 3) % cities.length];
  const hub = hubCities[(h + 1) % hubCities.length];
  const orderNo = `HL-2026-${String(4000 + (h * 37) % 5000).padStart(4, "0")}`;

  // Statüsü takip numarasına göre belirle: çeşitlilik için mod 5
  const statusMap: Shipment["status"][] = [
    "in_transit", "out_for_delivery", "in_transit", "delivered", "out_for_delivery",
  ];
  const status = statusMap[h % statusMap.length];

  const today   = "19 Mayıs 2026";
  const yester  = "18 Mayıs 2026";
  const twoDays = "17 Mayıs 2026";

  const baseEvents: ShipmentEvent[] = [
    { date: yester,  time: "11:30", location: `Hepsilens Depo`,              status: "Hazırlanıyor",   detail: "Siparişiniz paketleniyor." },
    { date: yester,  time: "14:15", location: `Hepsilens Depo`,              status: "Kargoya Verildi", detail: "Siparişiniz kargo firmasına teslim edildi." },
    { date: yester,  time: "18:40", location: `${hub} Dağıtım Merkezi`,      status: "Teslim Alındı",  detail: "Kargo firması tarafından teslim alındı." },
    { date: today,   time: "02:55", location: `${hub} Hub Merkezi`,          status: "Transfer",       detail: "Gönderi aktarma merkezine ulaştı." },
    { date: today,   time: "07:20", location: `${city} Dağıtım Merkezi`,     status: "Şubede",         detail: `Gönderi ${city} dağıtım merkezine ulaştı.` },
  ];

  if (status === "out_for_delivery") {
    baseEvents.push({
      date: today, time: "08:45",
      location: `${city} ${["Kadıköy", "Çankaya", "Bornova", "Nilüfer", "Muratpaşa"][h % 5]} Şubesi`,
      status: "Dağıtımda",
      detail: "Gönderi bugün teslim edilmek üzere dağıtıma çıktı.",
    });
  } else if (status === "delivered") {
    baseEvents.push(
      { date: today, time: "08:10", location: `${city} Dağıtım Şubesi`, status: "Dağıtımda",    detail: "Gönderi dağıtım aracına yüklendi." },
      { date: today, time: "13:22", location: city,                      status: "Teslim Edildi", detail: "Gönderi alıcıya teslim edildi." },
    );
  }

  // Yeniden (en son önce)
  const events = baseEvents.reverse();

  return {
    trackingNo: no,
    carrier: carrier.name,
    carrierCode: carrier.code,
    status,
    estimatedDelivery: status === "delivered" ? today : today,
    recipient: "A*** K***",
    city,
    weight: `0.${20 + (h % 50)} kg`,
    orderNo,
    events,
  };
}

function getShipment(no: string): Shipment {
  return mockShipments[no] ?? generateShipment(no);
}

function ProgressBar({ status }: { status: Shipment["status"] }) {
  const current = statusOrder[status] ?? 0;
  return (
    <div className="bg-white rounded-2xl border border-[#edeef3] px-6 py-5">
      <div className="flex items-center">
        {steps.map((step, i) => {
          const done   = i < current;
          const active = i === current && status !== "failed";
          const failed = status === "failed" && i === current;
          const filled = done || active;
          const color  = failed ? "#dc2626" : filled ? "#003d9b" : "#c3c6d6";
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                  style={{ background: filled ? (failed ? "#fee2e2" : "#003d9b") : "#f0f1f5" }}>
                  <span className="material-symbols-outlined"
                    style={{ fontSize: "18px", color: filled ? (failed ? "#dc2626" : "#fff") : "#c3c6d6", fontVariationSettings: "'FILL' 1" }}>
                    {step.icon}
                  </span>
                </div>
                <p style={{ fontSize: "10px", fontWeight: 600, color, whiteSpace: "nowrap" }}>{step.label}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 mb-5 rounded-full" style={{ background: done ? "#003d9b" : "#edeef3" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SiparisTakipPage() {
  const [input, setInput]         = useState("");
  const [submitted, setSubmitted] = useState("");
  const [shipment, setShipment]   = useState<Shipment | null | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const no = params.get("no");
    if (no) {
      const q = no.trim().toUpperCase();
      setInput(q);
      setSubmitted(q);
      setShipment(q ? getShipment(q) : null);
    }
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim().toUpperCase();
    if (!q) return;
    setSubmitted(q);
    setShipment(getShipment(q));
  }

  const cfg = shipment ? statusConfig[shipment.status] : null;

  return (
    <div className="pt-[72px] pb-16 px-4 md:px-8 max-w-[900px] mx-auto">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 py-5">
        <Link href="/" className="text-[#737685] hover:text-[#003d9b] transition-colors flex items-center gap-1" style={{ fontSize: "13px", fontWeight: 600 }}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>home</span>
          Anasayfa
        </Link>
        <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "16px" }}>chevron_right</span>
        <span className="text-[#003d9b]" style={{ fontSize: "13px", fontWeight: 600 }}>Sipariş Takibi</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "28px", fontWeight: 700 }}>Sipariş Takibi</h1>
        <p className="text-[#737685] mt-1" style={{ fontSize: "14px" }}>Kargo takip numaranızı girerek siparişinizin durumunu sorgulayın.</p>
      </div>

      {/* Arama formu */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#737685]" style={{ fontSize: "20px" }}>
            barcode_scanner
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Takip numaranızı girin (örn: TR1234567890)"
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#c3c6d6] bg-white outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/15 transition-all"
            style={{ fontSize: "14px" }}
          />
        </div>
        <button type="submit"
          className="px-6 py-3.5 rounded-xl font-bold text-white transition-all active:scale-95 flex items-center gap-2 hover:opacity-90"
          style={{ background: "#003d9b", fontSize: "14px", fontFamily: "'Inter'" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>search</span>
          Sorgula
        </button>
      </form>

      {/* İlk yükleme durumu */}
      {shipment === undefined && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 rounded-full bg-[#f0f4ff] flex items-center justify-center mb-5">
            <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "48px" }}>local_shipping</span>
          </div>
          <p className="font-bold text-[#191c1e] mb-1" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "18px" }}>
            Siparişinizi takip edin
          </p>
          <p className="text-[#737685]" style={{ fontSize: "14px" }}>
            Yukarıdaki alana kargo takip numaranızı girerek sorgulayın.
          </p>
        </div>
      )}

      {/* Gönderi bulundu */}
      {shipment && cfg && (
        <div className="flex flex-col gap-5">

          {/* Durum kartı */}
          <div className="bg-white rounded-2xl border border-[#edeef3] overflow-hidden">
            <div className="flex items-center gap-4 px-6 py-5" style={{ background: cfg.bg }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.7)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "24px", color: cfg.color, fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "18px", color: cfg.color }}>{cfg.label}</p>
                {shipment.status !== "delivered"
                  ? <p style={{ fontSize: "13px", color: cfg.color, opacity: 0.8 }}>Tahmini Teslimat: <strong>{shipment.estimatedDelivery}</strong></p>
                  : <p style={{ fontSize: "13px", color: cfg.color, opacity: 0.8 }}>{shipment.events[0].date} tarihinde teslim edildi.</p>
                }
              </div>
              <span className="shrink-0 px-3 py-1 rounded-full font-bold"
                style={{ fontSize: "11px", background: "rgba(255,255,255,0.6)", color: cfg.color }}>
                {shipment.trackingNo}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#f0f1f5]">
              {[
                { icon: "local_shipping", label: "Kargo Firması", value: shipment.carrier,   accent: carrierColors[shipment.carrierCode] },
                { icon: "person",         label: "Alıcı",          value: shipment.recipient },
                { icon: "location_on",    label: "Teslimat Şehri", value: shipment.city },
                { icon: "scale",          label: "Ağırlık",         value: shipment.weight },
              ].map(({ icon, label, value, accent }) => (
                <div key={label} className="flex items-center gap-3 px-5 py-4">
                  <span className="material-symbols-outlined shrink-0" style={{ fontSize: "20px", color: accent ?? "#737685", fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  <div className="min-w-0">
                    <p className="text-[#737685]" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</p>
                    <p className="font-semibold text-[#191c1e] truncate" style={{ fontSize: "13px" }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sipariş bağlantısı */}
          <div className="flex items-center justify-between bg-[#fafbff] border border-[#edeef3] rounded-xl px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "18px" }}>shopping_bag</span>
              <span className="text-[#434654]" style={{ fontSize: "13px" }}>
                Sipariş No: <strong className="text-[#191c1e]">{shipment.orderNo}</strong>
              </span>
            </div>
            <Link href="/hesap?s=orders" className="flex items-center gap-1 text-[#003d9b] hover:underline font-semibold" style={{ fontSize: "12px" }}>
              Siparişimi Gör
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_forward</span>
            </Link>
          </div>

          {/* İlerleme çubuğu */}
          <ProgressBar status={shipment.status} />

          {/* Zaman çizelgesi */}
          <div className="bg-white rounded-2xl border border-[#edeef3] p-6">
            <h2 className="font-bold text-[#191c1e] mb-5" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px" }}>Gönderi Hareketleri</h2>
            <div className="flex flex-col">
              {shipment.events.map((ev, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full shrink-0 mt-1"
                      style={{ background: i === 0 ? cfg.color : "#c3c6d6", boxShadow: i === 0 ? `0 0 0 3px ${cfg.bg}` : "none" }} />
                    {i < shipment.events.length - 1 && (
                      <div className="w-px flex-1 mt-1" style={{ background: "#edeef3", minHeight: "32px" }} />
                    )}
                  </div>
                  <div className="pb-5 flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-bold text-[#191c1e]" style={{ fontSize: "13px" }}>{ev.status}</p>
                        <p className="text-[#737685] flex items-center gap-1 mt-0.5" style={{ fontSize: "12px" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>location_on</span>
                          {ev.location}
                        </p>
                        <p className="text-[#737685] mt-1" style={{ fontSize: "12px", lineHeight: "18px" }}>{ev.detail}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-[#434654]" style={{ fontSize: "12px" }}>{ev.date}</p>
                        <p className="text-[#737685]" style={{ fontSize: "11px" }}>{ev.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Yardım */}
          <div className="bg-[#fafbff] border border-[#edeef3] rounded-xl px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#f0f4ff] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "20px" }}>headset_mic</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[#191c1e]" style={{ fontSize: "13px" }}>Sorun mu var?</p>
              <p className="text-[#737685]" style={{ fontSize: "12px" }}>Kargonuzla ilgili sorun yaşıyorsanız destek ekibimizle iletişime geçin.</p>
            </div>
            <a href="mailto:destek@hepsilens.com"
              className="px-4 py-2 rounded-xl border border-[#c3c6d6] text-[#434654] hover:bg-[#f3f4f6] transition-colors font-semibold shrink-0"
              style={{ fontSize: "12px" }}>
              Bize Ulaşın
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
