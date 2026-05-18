"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { lenses, reviews, brands, accessories, Lens, Accessory } from "@/lib/data";
import PrescriptionGuideModal from "@/components/PrescriptionGuideModal";

const sphOptions = ["-1.25", "-1.50", "-1.75", "-2.00", "-2.50", "-3.00", "-3.50", "-4.00"];

type TabId = "details" | "about" | "specs" | "reviews" | "installments";
type EyeMode = "same" | "different";

function SphGrid({
  label,
  selected,
  onChange,
}: {
  label?: string;
  selected: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p className="text-[#434654]" style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", fontFamily: "'Inter'", textTransform: "uppercase" }}>
          {label}
        </p>
      )}
      <div className="grid grid-cols-4 gap-1.5">
        {sphOptions.map((sph, i) => (
          <button
            key={sph}
            onClick={() => onChange(i)}
            className="py-2 rounded-[0.25rem] font-bold transition-all"
            style={{
              border: i === selected ? "2px solid #003d9b" : "1px solid #c3c6d6",
              background: i === selected ? "rgba(0,61,155,0.08)" : "#ffffff",
              color: i === selected ? "#003d9b" : "#191c1e",
              fontSize: "13px",
              lineHeight: "18px",
            }}
          >
            {sph}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const lens = lenses.find((l) => l.id === Number(id)) || accessories.find((a) => a.id === Number(id));
  const isAccessory = lens && !("dia" in lens);
  const brand = lens ? brands.find((b) => "brandId" in lens ? b.id === lens.brandId : b.name === lens.brand) : null;
  const lensReviews = lens ? reviews.filter((r) => r.lensId === lens.id) : [];

  const [eyeMode, setEyeMode] = useState<EyeMode>("same");
  const [sphSame, setSphSame]   = useState(0);
  const [sphOD, setSphOD]       = useState(0);
  const [sphOS, setSphOS]       = useState(0);
  const [cylSame, setCylSame]   = useState(0);
  const [cylOD, setCylOD]       = useState(0);
  const [cylOS, setCylOS]       = useState(0);
  const [axisSame, setAxisSame] = useState(0);
  const [axisOD, setAxisOD]     = useState(0);
  const [axisOS, setAxisOS]     = useState(0);
  const [selectedBc]  = useState(`${"bc"  in (lens || {}) ? (lens as Lens).bc  : 8.5} mm`);
  const [selectedDia] = useState(`${"dia" in (lens || {}) ? (lens as Lens).dia : 14.2} mm`);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [prescriptionFile, setPrescriptionFile] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  if (!lens) {
    return (
      <div className="pt-24 max-w-[1280px] mx-auto px-8 py-20 text-center">
        <span className="material-symbols-outlined" style={{ fontSize: "64px", color: "#c3c6d6" }}>search_off</span>
        <h1 className="text-2xl font-bold text-[#191c1e] mt-4">Ürün bulunamadı</h1>
        <Link href="/" className="mt-4 inline-block text-[#003d9b] hover:underline">Anasayfaya Dön</Link>
      </div>
    );
  }

  const discount = lens.originalPrice
    ? Math.round(((lens.originalPrice - lens.price) / lens.originalPrice) * 100)
    : 0;

  const usagePeriodLabel = !isAccessory
    ? ({ daily: "Günlük", monthly: "Aylık", yearly: "Yıllık" }[(lens as Lens).usagePeriod] ?? "Belirtilmemiş")
    : "Belirtilmemiş";

  const needsPrescription = !isAccessory && (lens as Lens).color === "clear";

  const handleAddToCart = () => {
    if (needsPrescription && !prescriptionFile) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const brandBgMap: Record<string, string> = {
    acuvue: "#003d9b", dailies: "#0052cc", biofinity: "#004e5d",
    freshlook: "#6a3600", airoptix: "#004e5d", bausch: "#003d9b",
  };
  const bannerBg = !isAccessory ? (brandBgMap[(lens as Lens).brandId] ?? "#003d9b") : "#003d9b";

  const tabs: { id: TabId; label: string }[] = [
    { id: "details",      label: "Ürün Detayları" },
    { id: "about",        label: "Ürün Hakkında" },
    { id: "specs",        label: "Teknik Özellikler" },
    { id: "reviews",      label: `Değerlendirmeler (${lensReviews.length})` },
    { id: "installments", label: "Taksit Seçenekleri" },
  ];

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-[1280px] mx-auto">

      {/* ── Top grid: image + sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: image + prescription */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
          <div className="bg-white rounded-[0.5rem] p-8 border border-[#c3c6d6] shadow-sm flex items-center justify-center min-h-[300px]">
            {lens.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={lens.imageUrl} alt={lens.name} className="max-w-full h-auto object-contain max-h-96" />
            ) : (
              <div className="text-[120px] opacity-30">👁️</div>
            )}
          </div>

          {/* Prescription upload — clear lenses only */}
          {needsPrescription && (
            <div className="flex-1 flex flex-col border border-[#8c4a00]/30 rounded-[0.5rem] overflow-hidden">
              {/* Header */}
              <div className="bg-[#ffdcc3] px-5 py-4 flex items-start gap-3">
                <span
                  className="material-symbols-outlined shrink-0 mt-0.5"
                  style={{ fontSize: "20px", color: "#6a3600", fontVariationSettings: "'FILL' 1" }}
                >
                  {prescriptionFile ? "check_circle" : "error"}
                </span>
                <div>
                  <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "16px", lineHeight: "24px", fontWeight: 700, color: "#2f1500" }}>
                    {prescriptionFile ? "Reçete Yüklendi" : "Reçete Gereklidir"}
                  </p>
                  <p style={{ fontSize: "13px", lineHeight: "20px", color: "#4a2000", opacity: 0.85 }}>
                    {prescriptionFile
                      ? "Siparişinizi tamamlamak için reçeteniz hazır."
                      : "Bu lens tıbbi sınıf ürün olduğundan geçerli bir optometri reçetesi gerekmektedir."}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 flex flex-col bg-[#fff9f5] px-5 py-4">
                {prescriptionFile ? (
                  /* Uploaded state */
                  <div className="flex items-center gap-3 bg-white border border-[#8c4a00]/20 rounded-lg px-4 py-3">
                    <span className="material-symbols-outlined text-[#6a3600] shrink-0" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>
                      description
                    </span>
                    <span className="flex-1 truncate text-[#191c1e] font-medium" style={{ fontSize: "13px" }}>
                      {prescriptionFile}
                    </span>
                    <label
                      className="cursor-pointer text-[#003d9b] hover:underline shrink-0 font-semibold"
                      style={{ fontSize: "12px", fontFamily: "'Inter'" }}
                    >
                      Değiştir
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => setPrescriptionFile(e.target.files?.[0]?.name ?? null)}
                      />
                    </label>
                    <button
                      onClick={() => setPrescriptionFile(null)}
                      className="text-[#737685] hover:text-[#c0392b] transition-colors shrink-0 ml-1"
                      title="Reçeteyi kaldır"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
                    </button>
                  </div>
                ) : (
                  /* Empty state */
                  <label className="cursor-pointer group flex-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#8c4a00]/30 rounded-lg py-6 hover:border-[#6a3600] hover:bg-[#fff4ec] transition-all">
                    <span className="material-symbols-outlined text-[#8c4a00] group-hover:scale-110 transition-transform" style={{ fontSize: "32px" }}>
                      upload_file
                    </span>
                    <div className="text-center">
                      <p className="font-bold text-[#2f1500]" style={{ fontSize: "13px" }}>Reçete yüklemek için tıklayın</p>
                      <p className="text-[#6a3600]/70 mt-0.5" style={{ fontSize: "11px" }}>PDF, JPG veya PNG — maks. 5 MB</p>
                    </div>
                    <span
                      className="mt-1 bg-[#6a3600] text-white px-5 py-2 rounded-full font-bold hover:bg-[#8c4a00] transition-colors"
                      style={{ fontSize: "12px", letterSpacing: "0.04em" }}
                    >
                      Dosya Seç
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => setPrescriptionFile(e.target.files?.[0]?.name ?? null)}
                    />
                  </label>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: purchase sidebar ── */}
        <aside className="lg:col-span-5 flex flex-col gap-6 sticky top-24">

          {/* Rating + Title + Price */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {!isAccessory && (
                <span className="bg-[#50dcff] text-[#001f27] rounded-full uppercase px-2 py-0.5" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em" }}>
                  Klinik Onaylı
                </span>
              )}
              <div className="flex text-[#6a3600]">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} style={{ fontSize: s <= Math.round(lens.rating) ? "16px" : "14px", fontVariationSettings: s <= Math.round(lens.rating) ? "'FILL' 1" : "'FILL' 0" }}>★</span>
                ))}
              </div>
              <span className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>({lens.rating})</span>
            </div>
            <h1 className="text-[#003d9b]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "32px", lineHeight: "40px", fontWeight: 600 }}>
              {lens.name}
            </h1>
            <div className="flex items-baseline gap-2">
              <span className="text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "24px", lineHeight: "32px", fontWeight: 600 }}>
                {lens.price.toLocaleString("tr-TR")} ₺
              </span>
              {lens.originalPrice && (
                <span className="text-[#434654] line-through" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>
                  {lens.originalPrice.toLocaleString("tr-TR")} ₺{discount > 0 && <> (%{discount} indirim)</>}
                </span>
              )}
            </div>
          </div>

          {/* Parameters */}
          <div className="flex flex-col gap-4 p-4 rounded-[0.5rem] border border-[#c3c6d6] bg-[#f3f4f6]">
            {!isAccessory && (
              <>
                {/* Eye mode toggle */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>
                    Göz Seçimi
                  </label>
                  <div className="flex rounded-[0.375rem] overflow-hidden border border-[#c3c6d6] bg-white">
                    {(["same", "different"] as EyeMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setEyeMode(mode)}
                        className="flex-1 py-2 font-bold transition-all"
                        style={{
                          fontSize: "12px",
                          letterSpacing: "0.04em",
                          fontFamily: "'Inter'",
                          background: eyeMode === mode ? "#003d9b" : "transparent",
                          color: eyeMode === mode ? "#ffffff" : "#434654",
                        }}
                      >
                        {mode === "same" ? "İki Göz Aynı" : "İki Göz Farklı"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SPH selection */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>
                      Sferik Güç (PWR/SPH)
                    </label>
                    <span
                      onClick={() => setShowGuide(true)}
                      className="text-[#003d9b] cursor-pointer hover:underline"
                      style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}
                    >
                      Rehber
                    </span>
                  </div>

                  {eyeMode === "same" ? (
                    <SphGrid selected={sphSame} onChange={setSphSame} />
                  ) : (
                    <div className="flex flex-col gap-4">
                      <SphGrid label="Sağ Göz (OD)" selected={sphOD} onChange={setSphOD} />
                      <SphGrid label="Sol Göz (OS)" selected={sphOS} onChange={setSphOS} />
                    </div>
                  )}
                </div>

                {/* CYL + AXIS — sadece toric lenslerde */}
                {(lens as Lens).isToric && (
                  <>
                    {/* CYL */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>
                        Silindirik Güç (CYL)
                      </label>
                      {eyeMode === "same" ? (
                        <div className="grid grid-cols-4 gap-1.5">
                          {((lens as Lens).cylOptions ?? []).map((cyl, i) => (
                            <button
                              key={cyl}
                              onClick={() => setCylSame(i)}
                              className="py-2 rounded-[0.25rem] font-bold transition-all"
                              style={{
                                border: i === cylSame ? "2px solid #00687b" : "1px solid #c3c6d6",
                                background: i === cylSame ? "rgba(0,104,123,0.08)" : "#ffffff",
                                color: i === cylSame ? "#00687b" : "#191c1e",
                                fontSize: "13px",
                              }}
                            >
                              {cyl.toFixed(2)}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {[
                            { label: "Sağ Göz (OD)", val: cylOD, set: setCylOD },
                            { label: "Sol Göz (OS)", val: cylOS, set: setCylOS },
                          ].map(({ label, val, set }) => (
                            <div key={label} className="flex flex-col gap-1.5">
                              <p className="text-[#434654] uppercase" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em" }}>{label}</p>
                              <div className="grid grid-cols-4 gap-1.5">
                                {((lens as Lens).cylOptions ?? []).map((cyl, i) => (
                                  <button
                                    key={cyl}
                                    onClick={() => set(i)}
                                    className="py-2 rounded-[0.25rem] font-bold transition-all"
                                    style={{
                                      border: i === val ? "2px solid #00687b" : "1px solid #c3c6d6",
                                      background: i === val ? "rgba(0,104,123,0.08)" : "#ffffff",
                                      color: i === val ? "#00687b" : "#191c1e",
                                      fontSize: "13px",
                                    }}
                                  >
                                    {cyl.toFixed(2)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* AXIS */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>
                        Aks (AXIS) — °
                      </label>
                      {eyeMode === "same" ? (
                        <select
                          value={axisSame}
                          onChange={(e) => setAxisSame(Number(e.target.value))}
                          className="w-full bg-white border border-[#c3c6d6] rounded-[0.25rem] p-2"
                          style={{ fontSize: "14px" }}
                        >
                          {((lens as Lens).axisOptions ?? []).map((ax) => (
                            <option key={ax} value={ax}>{ax}°</option>
                          ))}
                        </select>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: "Sağ Göz (OD)", val: axisOD, set: setAxisOD },
                            { label: "Sol Göz (OS)", val: axisOS, set: setAxisOS },
                          ].map(({ label, val, set }) => (
                            <div key={label} className="flex flex-col gap-1.5">
                              <p className="text-[#434654] uppercase" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em" }}>{label}</p>
                              <select
                                value={val}
                                onChange={(e) => set(Number(e.target.value))}
                                className="w-full bg-white border border-[#c3c6d6] rounded-[0.25rem] p-2"
                                style={{ fontSize: "14px" }}
                              >
                                {((lens as Lens).axisOptions ?? []).map((ax) => (
                                  <option key={ax} value={ax}>{ax}°</option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* BC + DIA */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>Taban Eğrilik (BC)</label>
                    <select defaultValue={selectedBc} className="w-full bg-white border border-[#c3c6d6] rounded-[0.25rem] p-2" style={{ fontSize: "14px" }}>
                      <option>{(lens as Lens).bc} mm</option>
                      <option>{((lens as Lens).bc + 0.2).toFixed(1)} mm</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>Çap (DIA)</label>
                    <select defaultValue={selectedDia} className="w-full bg-white border border-[#c3c6d6] rounded-[0.25rem] p-2" style={{ fontSize: "14px" }}>
                      <option>{(lens as Lens).dia} mm</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Quantity */}
            <div className="flex flex-col gap-2">
              <label className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>Adet (Kutu)</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#c3c6d6] rounded-[0.25rem] overflow-hidden bg-white">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2 px-4 hover:bg-[#edeef0] transition-colors">
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="px-4 font-bold" style={{ fontSize: "16px" }}>{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} className="p-2 px-4 hover:bg-[#edeef0] transition-colors">
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
                <span className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>
                  {!isAccessory ? `${(lens as Lens).packSizes[0]}'li Paket` : "1 Kutu"}
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleAddToCart}
            disabled={needsPrescription && !prescriptionFile}
            className="w-full font-bold py-4 rounded-[0.5rem] shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            style={{
              background: added ? "#004e5d" : (needsPrescription && !prescriptionFile) ? "#c3c6d6" : "#8c4a00",
              color: (needsPrescription && !prescriptionFile) ? "#737685" : "#ffc9a0",
              cursor: (needsPrescription && !prescriptionFile) ? "not-allowed" : "pointer",
              fontFamily: "'Inter'",
              fontSize: "14px",
              letterSpacing: "0.05em",
              fontWeight: 700,
            }}
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {added
              ? "Sepete Eklendi!"
              : (needsPrescription && !prescriptionFile)
              ? "Önce Reçete Yükleyin"
              : "Sepete Ekle"}
          </button>

          {/* Shipping note */}
          <div className="flex items-center gap-4 p-4 border border-[#c3c6d6] rounded-[0.25rem] bg-white">
            <span className="material-symbols-outlined text-[#003d9b]" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
            <p className="text-[#434654]" style={{ fontSize: "14px", lineHeight: "20px" }}>
              500 ₺ üzeri siparişlerde ücretsiz kargo. Tahmini teslimat 1-3 iş günü.
            </p>
          </div>
        </aside>
      </div>

      {/* ══ Full-width tabs section ══ */}
      <div className="mt-12 border-t border-[#edeef3] pt-8">

        {/* Tab nav */}
        <div className="flex w-full justify-between border-b border-[#edeef3] mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 text-center px-2 py-4 transition-colors relative whitespace-nowrap"
              style={{
                fontFamily: "'Inter'",
                fontSize: "13px",
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? "#003d9b" : "#434654",
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#003d9b] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content — full width */}
        <div>

          {/* Ürün Detayları — tam genişlik afiş */}
          {activeTab === "details" && (
            <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: "460px" }}>
              {/* Arka plan fotoğrafı */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4zTqZpGie9ab2vSOSpI40VUOHF2iW48JjAmsqnrdNJgxdwyBGhe4-c1WjyaprB4X8tSnf1bv4UIP49yi4IKgyixzSwfgX-Ucuzy0ihxhRAHRvkEyUN7Au9JW8epRKIj5DsCEOHCS844vpBJReNWvnLmeCw6Pm2VTkoFqlNeeo6vzZ8O7rZf8qUaIMNV0zssoeeqwKJFG_CxnivLdXEVJGFAYG4uXX4qocQEMKap21ga9yCqZ-4beY0jTrixYOAqY_maUtx-oSUKzE"
                alt=""
              />
              {/* Renk gradyanı */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(105deg, ${bannerBg}ee 0%, ${bannerBg}99 45%, ${bannerBg}22 100%)`,
                }}
              />
              {/* İçerik */}
              <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-14">
                <span
                  className="inline-flex items-center gap-1.5 mb-4 self-start px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "#ffffff", textTransform: "uppercase" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>verified</span>
                  Özel Partner
                </span>
                <h2
                  className="text-white mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1.1, fontWeight: 800, letterSpacing: "-0.02em", textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
                >
                  {brand?.name ?? lens.brand}
                </h2>
                <p
                  className="text-white mb-3"
                  style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "clamp(16px, 2vw, 22px)", lineHeight: 1.4, fontWeight: 500, opacity: 0.9, maxWidth: "520px" }}
                >
                  {lens.name}
                </p>
                <p
                  className="text-white/75"
                  style={{ fontSize: "15px", lineHeight: "22px", maxWidth: "420px" }}
                >
                  {brand?.tagline ?? "Uzun süreli konfor ve nem deneyimi yaşayın."}
                </p>
              </div>
            </div>
          )}

          {/* Ürün Hakkında */}
          {activeTab === "about" && (
            <div className="w-full">
              <p className="text-[#434654]" style={{ fontSize: "15px", lineHeight: "26px" }}>{lens.description}</p>
              {!isAccessory && (
                <p className="text-[#434654] mt-4" style={{ fontSize: "15px", lineHeight: "26px" }}>
                  {(lens as Lens).color === "colored"
                    ? `${lens.name}, doğal görünümünü koruyan ya da farklı bir göz rengine kavuşmak isteyenler için tasarlanmış ${usagePeriodLabel.toLowerCase()} renkli kontakt lenstir. Reçete gerektirmez; görme bozukluğu olmayan kullanıcılar da güvenle kullanabilir.`
                    : `${lens.name}, ${(lens as Lens).material} malzemesinden üretilmiş, yüksek oksijen geçirgenliğine sahip bir ${usagePeriodLabel.toLowerCase()} kontakt lenstir. Gün boyu göz sağlığını korurken maksimum görüş netliği sağlar. Tıbbi sınıf ürün olduğundan geçerli bir optometri reçetesi ile satışı yapılmaktadır.`
                  }
                </p>
              )}
              {!isAccessory && (lens as Lens).tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {(lens as Lens).tags.map((tag) => (
                    <span key={tag} className="bg-[#f0f1f8] text-[#434654] px-3 py-1.5 rounded-full" style={{ fontSize: "12px", fontWeight: 600 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Teknik Özellikler */}
          {activeTab === "specs" && !isAccessory && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
              {[
                { label: "Materyal / Malzeme",        value: (lens as Lens).material },
                { label: "Su İçeriği",                value: `%${(lens as Lens).waterContent}` },
                { label: "Oksijen Geçirgenliği",      value: `${(lens as Lens).oxygenPermeability} Dk/t` },
                { label: "Çap (DIA)",                 value: `${(lens as Lens).dia} mm` },
                { label: "Taban Eğrilik (BC)",        value: `${(lens as Lens).bc} mm` },
                { label: "Sferik Güç Aralığı",        value: (lens as Lens).sphRange },
                { label: "Kullanım Süresi",           value: usagePeriodLabel },
                { label: "UV Koruma",                 value: (lens as Lens).uvProtection ? "Var — Sınıf 2" : "Yok" },
                { label: "Renk",                      value: (lens as Lens).color === "colored" ? `Renkli${(lens as Lens).colorName ? ` — ${(lens as Lens).colorName}` : ""}` : "Şeffaf" },
                { label: "Paket Boyutları",           value: (lens as Lens).packSizes.map((s) => `${s} adet`).join(" / ") },
                { label: "Reçete Gereksinimi",        value: (lens as Lens).color === "clear" ? "Gerekli" : "Gerekmiyor" },
                { label: "Stok Durumu",               value: (lens as Lens).stock > 0 ? `Mevcut (${(lens as Lens).stock} adet)` : "Tükendi" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-[#edeef3] last:border-0">
                  <span className="text-[#737685]" style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'Inter'" }}>{label}</span>
                  <span className="text-[#191c1e] text-right" style={{ fontSize: "14px", fontWeight: 500, maxWidth: "55%" }}>{value}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === "specs" && isAccessory && (
            <div className="max-w-2xl space-y-3">
              <p style={{ fontSize: "15px", lineHeight: "24px", color: "#434654" }}>{lens.description}</p>
              <div className="flex items-center justify-between py-3 border-b border-[#edeef3]">
                <span className="text-[#737685]" style={{ fontSize: "13px", fontWeight: 600 }}>Kategori</span>
                <span className="text-[#191c1e]" style={{ fontSize: "14px" }}>{(lens as Accessory).category === "solution" ? "Bakım Solüsyonu" : "Göz Damlası"}</span>
              </div>
            </div>
          )}

          {/* Değerlendirmeler */}
          {activeTab === "reviews" && (
            <div>
              {lensReviews.length === 0 ? (
                <div className="text-center py-16">
                  <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#c3c6d6" }}>star</span>
                  <p className="text-[#434654] mt-3">Henüz yorum yok. İlk sen ol!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lensReviews.map((rev) => (
                    <div key={rev.id} className="bg-white border border-[#c3c6d6] rounded-[0.5rem] p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-[#191c1e]" style={{ fontSize: "14px" }}>{rev.user}</span>
                        {rev.verified && (
                          <span className="text-[#00687b] bg-[#afecff] rounded-full px-2 py-0.5" style={{ fontSize: "10px", fontWeight: 700 }}>✓ Doğrulandı</span>
                        )}
                        <span className="text-[#737685] ml-auto" style={{ fontSize: "12px" }}>{rev.date}</span>
                      </div>
                      <div className="flex mb-3">
                        {[1,2,3,4,5].map((s) => (
                          <span key={s} className={s <= rev.rating ? "text-[#6a3600]" : "text-[#c3c6d6]"}>★</span>
                        ))}
                      </div>
                      <p className="text-[#191c1e]" style={{ fontSize: "14px", lineHeight: "20px" }}>{rev.comment}</p>
                      <p className="text-[#737685] mt-3 text-xs">{rev.helpful} kişi bu yorumu faydalı buldu</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 bg-[#f3f4f6] rounded-[0.5rem] p-6 text-center border border-[#c3c6d6]">
                <p className="font-bold text-[#191c1e] mb-1">Bu ürünü kullandınız mı?</p>
                <p className="text-[#434654] mb-4" style={{ fontSize: "14px" }}>Deneyiminizi paylaşın ve diğerlerine yardımcı olun.</p>
                <button className="bg-[#003d9b] text-white px-6 py-2.5 rounded-[0.75rem] font-semibold" style={{ fontSize: "12px", letterSpacing: "0.05em" }}>
                  Yorum Yaz
                </button>
              </div>
            </div>
          )}

          {/* Taksit Seçenekleri */}
          {activeTab === "installments" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                <span key="advantage" style={{ color: "#f26422", fontStyle: "italic", fontWeight: 900, fontSize: "18px", letterSpacing: "-0.5px" }}>advantage</span>,
                <span key="axess" style={{ color: "#000000", fontWeight: 900, fontSize: "20px", letterSpacing: "-0.5px" }}>axess</span>,
                <span key="bonus" style={{ color: "#8cc63f", fontWeight: 900, fontSize: "20px", letterSpacing: "-0.5px" }}>+bonus</span>,
                <span key="cardfinans" style={{ color: "#00509d", fontWeight: 900, fontSize: "16px", letterSpacing: "-0.5px", textTransform: "uppercase" }}>CardFinans</span>,
                <span key="bankkart" style={{ color: "#e3000f", fontWeight: 900, fontSize: "18px", letterSpacing: "-0.5px" }}>bankkart</span>,
                <span key="maximum" style={{ color: "#e20074", fontStyle: "italic", fontWeight: 900, fontSize: "18px", letterSpacing: "-0.5px" }}>maximum</span>,
                <span key="paraf" style={{ color: "#00a7e1", fontStyle: "italic", fontWeight: 900, fontSize: "18px" }}>Paraf</span>,
                <span key="saglam" style={{ color: "#008033", fontWeight: 900, fontSize: "15px", letterSpacing: "0px", textTransform: "uppercase" }}>SAĞLAM KART</span>,
                <span key="world" style={{ color: "#5e2a84", fontWeight: 900, fontSize: "18px", letterSpacing: "1px", textTransform: "uppercase" }}>WORLD</span>,
              ].map((logo, i) => (
                <div key={i} className="border border-[#edeef3] rounded-[0.5rem] bg-white overflow-hidden shadow-sm flex flex-col">
                  <div className="py-6 flex items-center justify-center min-h-[80px]">
                    {logo}
                  </div>
                  <div className="flex items-center justify-between px-4 py-2 bg-[#f9f9fb] border-y border-[#edeef3]">
                    <span className="text-[#737685]" style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em", fontFamily: "'Inter'" }}>TAKSİT TUTARI</span>
                    <span className="text-[#737685]" style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em", fontFamily: "'Inter'" }}>TOPLAM TUTAR</span>
                  </div>
                  <div className="flex flex-col p-4 space-y-4">
                    {[
                      { m: 3, multi: 1.07638 },
                      { m: 6, multi: 1.15461 },
                      { m: 9, multi: 1.24523 },
                      { m: 12, multi: 1.35091 },
                    ].map(({ m, multi }) => {
                      const total = lens.price * multi;
                      const monthly = total / m;
                      return (
                        <div key={m} className="flex items-center justify-between">
                          <span className="text-[#434654]" style={{ fontSize: "12px", fontWeight: 600, fontFamily: "'Inter'" }}>
                            {m} x {monthly.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
                          </span>
                          <span className="text-[#191c1e]" style={{ fontSize: "12px", fontWeight: 800, fontFamily: "'Inter'" }}>
                            {total.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Customers also viewed ── */}
      <section className="mt-20 pt-12 border-t border-[#edeef3]">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "24px", lineHeight: "32px", fontWeight: 600 }}>
              Bunları da İnceleyenler
            </h2>
            <p className="text-[#434654]" style={{ fontSize: "14px", lineHeight: "20px" }}>
              Optometristler tarafından önerilen klinik olarak benzer alternatifler.
            </p>
          </div>
          <Link href="/" className="text-[#003d9b] flex items-center gap-1 hover:underline" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>
            Tümünü Gör <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {lenses.filter((l) => l.id !== lens.id).slice(0, 4).map((rel) => (
            <Link key={rel.id} href={`/urun/${rel.id}`} className="group cursor-pointer">
              <div className="bg-[#f3f4f6] rounded-[0.5rem] p-4 mb-2 relative overflow-hidden aspect-square flex items-center justify-center border border-[#c3c6d6] group-hover:border-[#003d9b] transition-all shadow-sm">
                {rel.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={rel.imageUrl} alt={rel.name} className="max-w-[80%] h-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <span className="text-5xl opacity-30">👁️</span>
                )}
                {rel.badge && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-white/80 backdrop-blur-sm text-[#00687b] rounded-full font-bold shadow-sm px-2 py-1 whitespace-nowrap" style={{ fontSize: "10px", fontWeight: 700 }}>
                      {rel.badge}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>{rel.brand}</p>
              <h3 className="text-[#191c1e] group-hover:text-[#003d9b] transition-colors" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", lineHeight: "28px", fontWeight: 600 }}>
                {rel.name}
              </h3>
              <p className="text-[#003d9b] mt-1" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", lineHeight: "28px", fontWeight: 600 }}>
                {rel.price.toLocaleString("tr-TR")} ₺
              </p>
            </Link>
          ))}
        </div>
      </section>
      {showGuide && <PrescriptionGuideModal onClose={() => setShowGuide(false)} />}
    </div>
  );
}
