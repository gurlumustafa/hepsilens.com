"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { lenses, reviews, brands, accessories, accessoryBrands, Lens, Accessory } from "@/lib/data";
import PrescriptionGuideModal from "@/components/PrescriptionGuideModal";
import PrescriptionMapModal from "@/components/PrescriptionMapModal";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import FavoriteButton from "@/components/FavoriteButton";

const sphOptions = ["-1.25", "-1.50", "-1.75", "-2.00", "-2.50", "-3.00", "-3.50", "-4.00"];

type TabId = "details" | "about" | "specs" | "reviews" | "installments" | "faq";
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
  const router = useRouter();
  const { user } = useAuth();
  const { addItem } = useCart();
  const lens = lenses.find((l) => l.id === Number(id)) || accessories.find((a) => a.id === Number(id));
  const isAccessory = lens && !("dia" in lens);
  const brand = lens
    ? (isAccessory
        ? accessoryBrands.find((b) => b.id === (lens as Accessory).brandId)
        : brands.find((b) => b.id === (lens as Lens).brandId))
    : null;
  const lensReviews = lens ? reviews.filter((r) => r.lensId === lens.id) : [];

  const [eyeMode, setEyeMode] = useState<EyeMode>("same");
  const [sphSame, setSphSame] = useState(0);
  const [sphOD, setSphOD] = useState(0);
  const [sphOS, setSphOS] = useState(0);
  const [cylSame, setCylSame] = useState(0);
  const [cylOD, setCylOD] = useState(0);
  const [cylOS, setCylOS] = useState(0);
  const [axisSame, setAxisSame] = useState(0);
  const [axisOD, setAxisOD] = useState(0);
  const [axisOS, setAxisOS] = useState(0);
  const [selectedBc] = useState(`${"bc" in (lens || {}) ? (lens as Lens).bc : 8.5} mm`);
  const [selectedDia] = useState(`${"dia" in (lens || {}) ? (lens as Lens).dia : 14.2} mm`);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [added, setAdded] = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    addItem({
      id: lens.id,
      name: lens.name,
      brand: lens.brand,
      price: lens.price,
      imageUrl: lens.imageUrl,
      needsPrescription: needsPrescription,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const brandBgMap: Record<string, string> = {
    acuvue: "#003d9b", dailies: "#0052cc", biofinity: "#004e5d",
    freshlook: "#6a3600", airoptix: "#004e5d", bausch: "#003d9b",
  };
  const bannerBg = !isAccessory ? (brandBgMap[(lens as Lens).brandId] ?? "#003d9b") : "#003d9b";

  const tabs: { id: TabId; label: string }[] = [
    { id: "details", label: "Ürün Detayları" },
    { id: "about", label: "Ürün Hakkında" },
    { id: "specs", label: "Teknik Özellikler" },
    { id: "reviews", label: `Değerlendirmeler (${lensReviews.length})` },
    { id: "installments", label: "Taksit Seçenekleri" },
    { id: "faq", label: "Sıkça Sorulan Sorular" },
  ];

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-[1280px] mx-auto">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 py-4">
        <Link href="/" className="text-[#737685] hover:text-[#003d9b] transition-colors flex items-center gap-1" style={{ fontSize: "13px", fontWeight: 600 }}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>home</span>
          Anasayfa
        </Link>
        <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "16px" }}>chevron_right</span>
        <Link href="/urunler" className="text-[#737685] hover:text-[#003d9b] transition-colors" style={{ fontSize: "13px", fontWeight: 600 }}>
          Ürünler
        </Link>
        <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "16px" }}>chevron_right</span>
        <span className="text-[#003d9b] truncate max-w-[200px] md:max-w-xs" style={{ fontSize: "13px", fontWeight: 600 }}>{lens.name}</span>
      </nav>

      {/* ── Top grid: image + sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: image + prescription */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
          <div className="bg-white rounded-[0.5rem] p-10 border border-[#c3c6d6] shadow-sm flex items-center justify-center" style={{ minHeight: "480px" }}>
            {lens.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={lens.imageUrl} alt={lens.name} className="max-w-full h-auto object-contain" style={{ maxHeight: "420px" }} />
            ) : (
              <div className="text-[120px] opacity-30">👁️</div>
            )}
          </div>

          {/* Ürün avantajları — tüm lensler */}
          {!isAccessory && (
            <div className="rounded-xl border border-[#edeef3] bg-white p-6 flex flex-col gap-4">
              {/* Reçete bilgi notu */}
              {needsPrescription && (
                <div
                  className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5"
                  style={{ background: "#f0f4ff", border: "1px solid #c8d6f7" }}
                >
                  <span
                    className="material-symbols-outlined shrink-0"
                    style={{ fontSize: "16px", color: "#003d9b", fontVariationSettings: "'FILL' 1" }}
                  >
                    receipt_long
                  </span>
                  <p style={{ fontSize: "12px", color: "#003d9b", fontWeight: 600, lineHeight: "17px" }}>
                    Bu ürün reçete gerektirir — reçetenizi sepete ekledikten sonra yükleyebilirsiniz.
                  </p>
                </div>
              )}

              <p className="text-[#434654] leading-relaxed line-clamp-3" style={{ fontSize: "14px", lineHeight: "22px" }}>
                {lens.description}
              </p>
              <ul className="flex flex-col gap-2.5">
                {[
                  (lens as Lens).color === "colored"
                    ? "Reçete gerektirmez — kozmetik kullanıma uygundur"
                    : `%${(lens as Lens).waterContent} su içeriği ile gün boyu konfor`,
                  (lens as Lens).usagePeriod === "daily"
                    ? `${(lens as Lens).packSizes[0]} adetlik paket — her gün temiz ve hijyenik`
                    : `Aylık kullanım — ${(lens as Lens).packSizes[0]} adetlik ekonomik paket`,
                  (lens as Lens).uvProtection
                    ? "UV Koruma Sınıf 2 — güneş ışınlarına karşı ekstra koruma"
                    : `${(lens as Lens).oxygenPermeability} Dk/t oksijen geçirgenliği — gözler nefes alır`,
                  (lens as Lens).color === "colored" && (lens as Lens).colorName
                    ? `${(lens as Lens).colorName} renk seçeneği — doğal ve etkileyici görünüm`
                    : `${(lens as Lens).dia} mm çap, ${(lens as Lens).bc} mm taban eğrilik`,
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span
                      className="material-symbols-outlined shrink-0 mt-0.5"
                      style={{ fontSize: "16px", color: "#16a34a", fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <span className="text-[#434654]" style={{ fontSize: "13px", lineHeight: "20px" }}>
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
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
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ fontSize: s <= Math.round(lens.rating) ? "16px" : "14px", fontVariationSettings: s <= Math.round(lens.rating) ? "'FILL' 1" : "'FILL' 0" }}>★</span>
                ))}
              </div>
              <span className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>({lens.rating})</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-[#003d9b]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "32px", lineHeight: "40px", fontWeight: 600 }}>
                {lens.name}
              </h1>
              <FavoriteButton productId={lens.id} size="lg" className="shrink-0 mt-1" />
            </div>
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

            {/* Taksit bilgisi */}
            <p
              className="flex items-center gap-1.5 self-start hover:opacity-80 transition-opacity"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "#00687b" }}>credit_card</span>
              <span style={{ fontSize: "12px", color: "#00687b", fontWeight: 600, fontFamily: "'Inter'" }}>
                12 aya kadar taksit imkanlarıyla
              </span>
            </p>
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
                  <button
                    onClick={() => setShowMapModal(true)}
                    className="flex items-center gap-1 mt-1 text-[#003d9b] hover:underline self-start transition-opacity hover:opacity-80"
                  >
                    <span style={{ fontSize: "12.5px", letterSpacing: "0.02em", fontWeight: 600, fontFamily: "'Inter'" }}>
                      Reçetemdeki numaraları nasıl seçebilirim?
                    </span>
                  </button>
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
            onMouseEnter={() => setHoverBtn(true)}
            onMouseLeave={() => setHoverBtn(false)}
            className="w-full font-bold py-4 rounded-[0.5rem] active:scale-95 transition-all flex items-center justify-center gap-2"
            style={{
              background: added ? "#b45309" : hoverBtn ? "#b45309" : "#d97706",
              color: "#ffffff",
              cursor: "pointer",
              fontFamily: "'Inter'",
              fontSize: "14px",
              letterSpacing: "0.05em",
              fontWeight: 700,
              boxShadow: added || hoverBtn ? "0 8px 24px rgba(217,119,6,0.45)" : "0 4px 16px rgba(217,119,6,0.3)",
              transform: added || hoverBtn ? "scale(1.02) translateY(-2px)" : "scale(1) translateY(0)",
            }}
          >
            <span className="material-symbols-outlined">
              {added ? "check_circle" : "shopping_cart"}
            </span>
            {added ? "Sepete Eklendi!" : "Sepete Ekle"}
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
                { label: "Materyal / Malzeme", value: (lens as Lens).material },
                { label: "Su İçeriği", value: `%${(lens as Lens).waterContent}` },
                { label: "Oksijen Geçirgenliği", value: `${(lens as Lens).oxygenPermeability} Dk/t` },
                { label: "Çap (DIA)", value: `${(lens as Lens).dia} mm` },
                { label: "Taban Eğrilik (BC)", value: `${(lens as Lens).bc} mm` },
                { label: "Sferik Güç Aralığı", value: (lens as Lens).sphRange },
                { label: "Kullanım Süresi", value: usagePeriodLabel },
                { label: "UV Koruma", value: (lens as Lens).uvProtection ? "Var — Sınıf 2" : "Yok" },
                { label: "Renk", value: (lens as Lens).color === "colored" ? `Renkli${(lens as Lens).colorName ? ` — ${(lens as Lens).colorName}` : ""}` : "Şeffaf" },
                { label: "Paket Boyutları", value: (lens as Lens).packSizes.map((s) => `${s} adet`).join(" / ") },
                { label: "Reçete Gereksinimi", value: (lens as Lens).color === "clear" ? "Gerekli" : "Gerekmiyor" },
                { label: "Stok Durumu", value: (lens as Lens).stock > 0 ? `Mevcut (${(lens as Lens).stock} adet)` : "Tükendi" },
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
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={s <= rev.rating ? "text-[#6a3600]" : "text-[#c3c6d6]"}>★</span>
                        ))}
                      </div>
                      <p className="text-[#191c1e]" style={{ fontSize: "14px", lineHeight: "20px" }}>{rev.comment}</p>
                      <p className="text-[#737685] mt-3 text-xs">{rev.helpful} kişi bu yorumu faydalı buldu</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 rounded-xl border border-[#edeef3] p-6 text-center bg-white">
                {user ? (
                  <>
                    <p className="font-bold text-[#191c1e] mb-1" style={{ fontFamily: "'Plus Jakarta Sans'" }}>Bu ürünü kullandınız mı?</p>
                    <p className="text-[#737685] mb-4" style={{ fontSize: "14px" }}>Deneyiminizi paylaşın ve diğerlerine yardımcı olun.</p>
                    <button
                      className="bg-[#003d9b] text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                      style={{ fontSize: "13px", letterSpacing: "0.04em" }}
                    >
                      Yorum Yaz
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-[#f0f4ff] flex items-center justify-center mx-auto mb-3">
                      <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "24px" }}>lock</span>
                    </div>
                    <p className="font-bold text-[#191c1e] mb-1" style={{ fontFamily: "'Plus Jakarta Sans'" }}>Yorum yapmak için giriş yapın</p>
                    <p className="text-[#737685] mb-4" style={{ fontSize: "14px" }}>Deneyiminizi paylaşmak için hesabınıza giriş yapmanız gerekmektedir.</p>
                    <button
                      onClick={() => router.push(`/hesap/giris`)}
                      className="bg-[#003d9b] text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
                      style={{ fontSize: "13px", letterSpacing: "0.04em" }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>login</span>
                      Giriş Yap
                    </button>
                  </>
                )}
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
          {/* Sıkça Sorulan Sorular */}
          {activeTab === "faq" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
              {[
                {
                  q: "BC Nedir?",
                  a: "Base Curve teriminin kısaltmasıdır. Temel eğri değerini gösterir. Bir diğer ifadeyle korneanın bombelik değeridir. Doktor tarafından yapılan ölçümle belli olur ve bu değerlerin lens reçetesinde yazması gerekmektedir.",
                },
                {
                  q: "Dia Nedir?",
                  a: "Kontakt lensin mm olarak çapını ifade eder. Lensin iki kenarının birbirine olan uzaklığını anlatmaktadır.",
                },
                {
                  q: "Gözlük Reçetesi ile Lens Alabilir Miyim?",
                  a: "Gözlük reçetesi ile lens reçetesinde olması gereken değerler farklıdır. Bu nedenle göz doktorunuzun lens kullanımına özel bir reçete oluşturması gerekmektedir.",
                },
                {
                  q: "Ücretsiz Kargonun Koşulu Var Mı?",
                  a: "Alt limit ve hiçbir koşul olmadan tüm siparişlerinizi ücretsiz kargo avantajı ile oluşturabilirsiniz.",
                },
                {
                  q: "Hangi Ödeme Yöntemleri Var?",
                  a: "Kapıda ödeme, havale/EFT veya kredi kartı ödeme seçeneklerinden birini kullanarak sipariş oluşturabilirsiniz.",
                },
                {
                  q: "Lens Nasıl Takılır?",
                  a: "Kontakt lens nasıl takılır? Öğrenmek için blog sayfamızı ziyaret ederek size özel oluşturduğumuz yazımızı okuyabilir ve uygulamalı olarak anlattığımız videomuzu izleyebilirsiniz.",
                },
                {
                  q: "Kontakt Lens Reçetemi Nasıl Okuyabilirim?",
                  a: "Kontakt lens reçetelerinin hepsi aynı formatta olmasa bile kullanılan temel değerler ve terimler aynıdır. Dioptri (miyopi veya hipermetropi değeri), BC (temel eğri), Çap (Dia), Cyl (silindir veya toric astigmat değeri), Aks (Ax — astigmatın açısı). Bu değerlerden reçetenizde bulunanları lens sepete ekleme esnasında seçerek siparişinizi kolaylıkla verebilirsiniz.",
                },
                {
                  q: "Gözlük Reçetesiyle Kontakt Lens Alınır Mı?",
                  a: "Maalesef gözlük reçetesi ile kontakt lens almak mümkün olmamaktadır. Gözlük camı gözden 12-14 mm arasında bir mesafede konumlanır; kontakt lens ise göz yüzeyinde (kornea) bulunduğundan numaralar birbirinden farklı olabilir. Ayrıca BC (temel eğri) ve Dia (çap) gibi değerlerin ölçümü yapılarak kontakt lens reçetesine yazılır; gözlük reçetesinde bu değerler bulunmaz. Bundan dolayı kontakt lens kullanımı için göz hekiminize giderek lens muayenesi olmanız gereklidir.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden border transition-colors"
                  style={{ borderColor: openFaq === i ? "#003d9b" : "#edeef3" }}
                >
                  <button
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left transition-colors"
                    style={{ background: openFaq === i ? "#f0f4ff" : "#ffffff" }}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        fontFamily: "'Plus Jakarta Sans'",
                        color: openFaq === i ? "#003d9b" : "#191c1e",
                      }}
                    >
                      {item.q}
                    </span>
                    <span
                      className="material-symbols-outlined shrink-0 transition-transform duration-200"
                      style={{
                        fontSize: "20px",
                        color: openFaq === i ? "#003d9b" : "#737685",
                        transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      expand_more
                    </span>
                  </button>

                  {openFaq === i && (
                    <div className="px-5 pb-5 border-t" style={{ borderColor: "#dae2ff" }}>
                      <p className="text-[#434654] pt-4" style={{ fontSize: "14px", lineHeight: "22px" }}>
                        {item.a}
                      </p>
                    </div>
                  )}
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
      {showMapModal && <PrescriptionMapModal onClose={() => setShowMapModal(false)} />}
    </div>
  );
}
