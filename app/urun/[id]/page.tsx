"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Lens, Accessory } from "@/lib/data";
// 🔒 REÇETELİ LENS DEVRE DIŞI — modal importları yorum satırında
// import PrescriptionGuideModal from "@/components/PrescriptionGuideModal";
// import PrescriptionMapModal from "@/components/PrescriptionMapModal";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import FavoriteButton from "@/components/FavoriteButton";

const sphOptions = ["-1.25", "-1.50", "-1.75", "-2.00", "-2.50", "-3.00", "-3.50", "-4.00"];

type TabId = "details" | "about" | "specs" | "reviews" | "installments" | "faq";
type EyeMode = "same" | "different";

type ProductDetail = (Lens | Accessory) & {
  brand_full_name?: string;
  tagline?: string;
};

type Review = {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  helpful_count: number;
  verified: boolean;
  created_at: string;
};

type RelatedProduct = {
  id: number;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  image_url?: string;
  badge?: string;
  rating: number;
};

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
        <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", fontFamily: "'Inter'", textTransform: "uppercase", color: "var(--ds-text-2)" }}>
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
              border: i === selected ? "2px solid var(--ds-primary)" : "1px solid var(--ds-border)",
              background: i === selected ? "var(--ds-primary-soft)" : "var(--ds-surface)",
              color: i === selected ? "var(--ds-primary)" : "var(--ds-text-1)",
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

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setProduct(d.product || null);
        setReviews(d.reviews || []);
        setRelated(d.related || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

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
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabId>("details");
  const [added, setAdded] = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);
  // 🔒 REÇETELİ LENS DEVRE DIŞI — reçete modalları yorum satırında
  // const [showGuide, setShowGuide] = useState(false);
  // const [showMapModal, setShowMapModal] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const tabsSectionRef = useRef<HTMLDivElement>(null);

  const openInstallments = () => {
    setActiveTab("installments");
    setTimeout(() => {
      tabsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div style={{ color: "var(--ds-text-3)" }}>Yükleniyor...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 max-w-[1280px] mx-auto px-8 py-20 text-center">
        <span className="material-symbols-outlined" style={{ fontSize: "64px", color: "var(--ds-border)" }}>search_off</span>
        <h1 className="text-2xl font-bold mt-4" style={{ color: "var(--ds-text-1)" }}>Ürün bulunamadı</h1>
        <Link href="/" className="mt-4 inline-block hover:underline" style={{ color: "var(--ds-primary)" }}>Anasayfaya Dön</Link>
      </div>
    );
  }

  const isAccessory = product.product_type === "accessory";
  const lens = product as Lens & ProductDetail;
  const accessory = product as Accessory & ProductDetail;

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const usagePeriodLabel = !isAccessory
    ? ({ daily: "Günlük", biweekly: "Haftalık", monthly: "Aylık", yearly: "Yıllık" }[lens.usage_period] ?? "Belirtilmemiş")
    : "Belirtilmemiş";

  // 🔒 REÇETELİ LENS DEVRE DIŞI — needsPrescription her zaman false
  const needsPrescription = false;

  const selectedBc = !isAccessory ? `${lens.bc} mm` : "";
  const selectedDia = !isAccessory ? `${lens.dia} mm` : "";

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      imageUrl: product.image_url,
      needsPrescription: needsPrescription,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const brandBgMap: Record<string, string> = {
    acuvue: "#003d9b", dailies: "#0052cc", biofinity: "#004e5d",
    alcon: "#090109ff", airoptix: "#890b6dff", bausch: "#003d9b",
  };
  const bannerBg = !isAccessory ? (brandBgMap[lens.brand_id] ?? "#003d9b") : "#003d9b";

  const tabs: { id: TabId; label: string }[] = [
    { id: "details", label: "Ürün Detayları" },
    { id: "about", label: "Ürün Hakkında" },
    { id: "specs", label: "Teknik Özellikler" },
    { id: "reviews", label: `Değerlendirmeler (${reviews.length})` },
    { id: "installments", label: "Taksit Seçenekleri" },
    { id: "faq", label: "Sıkça Sorulan Sorular" },
  ];

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-[1280px] mx-auto">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 py-4">
        <Link href="/" className="transition-colors flex items-center gap-1" style={{ fontSize: "13px", fontWeight: 600, color: "var(--ds-text-3)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>home</span>
          Anasayfa
        </Link>
        <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--ds-border)" }}>chevron_right</span>
        <Link href="/urunler" className="transition-colors" style={{ fontSize: "13px", fontWeight: 600, color: "var(--ds-text-3)" }}>
          Ürünler
        </Link>
        <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--ds-border)" }}>chevron_right</span>
        <span className="truncate max-w-[200px] md:max-w-xs" style={{ fontSize: "13px", fontWeight: 600, color: "var(--ds-primary)" }}>{product.name}</span>
      </nav>

      {/* ── Top grid: image + sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: image + prescription */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
          <div className="rounded-[0.5rem] p-10 shadow-sm flex items-center justify-center" style={{ minHeight: "480px", background: "var(--ds-surface-2)", border: "1px solid var(--ds-border)" }}>
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image_url} alt={product.name} className="max-w-full h-auto object-contain" style={{ maxHeight: "420px" }} />
            ) : (
              <div className="text-[120px] opacity-30">👁️</div>
            )}
          </div>

          {/* Ürün avantajları — tüm lensler */}
          {!isAccessory && (
            <div className="rounded-xl p-6 flex flex-col gap-4" style={{ border: "1px solid var(--ds-border-subtle)", background: "var(--ds-surface)" }}>
              {/* <p className="text-[#434654] leading-relaxed line-clamp-3" style={{ fontSize: "14px", lineHeight: "22px" }}>
                {product.description}
              </p> */}
              <ul className="flex flex-col gap-2.5">
                {[
                  lens.color === "colored"
                    ? "Reçete gerektirmez — kozmetik kullanıma uygundur"
                    : `%${lens.water_content} su içeriği ile gün boyu konfor`,
                  lens.usage_period === "daily"
                    ? `${lens.pack_sizes?.[0]} adetlik paket — her gün temiz ve hijyenik`
                    : `${usagePeriodLabel} kullanım — ${lens.pack_sizes?.[0]} adetlik ekonomik paket`,
                  lens.uv_protection
                    ? "UV Koruma Sınıf 2 — güneş ışınlarına karşı ekstra koruma"
                    : `${lens.oxygen_permeability} Dk/t oksijen geçirgenliği — gözler nefes alır`,
                  lens.color === "colored" && lens.color_name
                    ? `${lens.color_name} renk seçeneği — doğal ve etkileyici görünüm`
                    : `${lens.dia} mm çap, ${lens.bc} mm taban eğrilik`,
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span
                      className="material-symbols-outlined shrink-0 mt-0.5"
                      style={{ fontSize: "16px", color: "#16a34a", fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <span style={{ fontSize: "13px", lineHeight: "20px", color: "var(--ds-text-2)" }}>
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
                <span className="rounded-full uppercase px-2 py-0.5" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", background: "var(--ds-teal)", color: "#001f27" }}>
                  Klinik Onaylı
                </span>
              )}
              <div className="flex" style={{ color: "var(--ds-amber)" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ fontSize: s <= Math.round(product.rating) ? "16px" : "14px", fontVariationSettings: s <= Math.round(product.rating) ? "'FILL' 1" : "'FILL' 0" }}>★</span>
                ))}
              </div>
              <span style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, color: "var(--ds-text-2)" }}>({product.rating})</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "32px", lineHeight: "40px", fontWeight: 600, color: "var(--ds-primary)" }}>
                {product.name}
              </h1>
              <FavoriteButton productId={product.id} size="lg" className="shrink-0 mt-1" />
            </div>
            <div className="flex items-baseline gap-2">
              <span style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "24px", lineHeight: "32px", fontWeight: 600, color: "var(--ds-text-1)" }}>
                {product.price.toLocaleString("tr-TR")} ₺
              </span>
              {product.original_price && (
                <span className="line-through" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, color: "var(--ds-text-2)" }}>
                  {product.original_price.toLocaleString("tr-TR")} ₺{discount > 0 && <> (%{discount} indirim)</>}
                </span>
              )}
            </div>

            {/* Taksit bilgisi */}
            <button
              onClick={openInstallments}
              className="flex items-center gap-1 self-start hover:opacity-75 transition-opacity"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "14px", color: "var(--ds-teal)" }}>credit_card</span>
              <span style={{ fontSize: "12px", color: "var(--ds-teal)", fontWeight: 600, fontFamily: "'Inter'" }}>
                12 aya kadar taksit imkanlarıyla
              </span>
            </button>
          </div>

          {/* Parameters */}
          <div className="flex flex-col gap-4 p-4 rounded-[0.5rem]" style={{ border: "1px solid var(--ds-border)", background: "var(--ds-surface-2)" }}>
            {!isAccessory && (
              <>
                {/* Eye mode toggle */}
                <div className="flex flex-col gap-2">
                  <label style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, color: "var(--ds-text-2)" }}>
                    Göz Seçimi
                  </label>
                  <div className="flex rounded-[0.375rem] overflow-hidden" style={{ border: "1px solid var(--ds-border)", background: "var(--ds-surface)" }}>
                    {(["same", "different"] as EyeMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setEyeMode(mode)}
                        className="flex-1 py-2 font-bold transition-all"
                        style={{
                          fontSize: "12px",
                          letterSpacing: "0.04em",
                          fontFamily: "'Inter'",
                          background: eyeMode === mode ? "var(--ds-primary)" : "transparent",
                          color: eyeMode === mode ? "#ffffff" : "var(--ds-text-2)",
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
                    <label style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, color: "var(--ds-text-2)" }}>
                      Sferik Güç (PWR/SPH)
                    </label>
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
                {!!lens.is_toric && (
                  <>
                    {/* CYL */}
                    <div className="flex flex-col gap-2">
                      <label style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, color: "var(--ds-text-2)" }}>
                        Silindirik Güç (CYL)
                      </label>
                      {eyeMode === "same" ? (
                        <div className="grid grid-cols-4 gap-1.5">
                          {(lens.cyl_options ?? []).map((cyl, i) => (
                            <button
                              key={cyl}
                              onClick={() => setCylSame(i)}
                              className="py-2 rounded-[0.25rem] font-bold transition-all"
                              style={{
                                border: i === cylSame ? "2px solid var(--ds-teal)" : "1px solid var(--ds-border)",
                                background: i === cylSame ? "rgba(0,104,123,0.08)" : "var(--ds-surface)",
                                color: i === cylSame ? "var(--ds-teal)" : "var(--ds-text-1)",
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
                              <p className="uppercase" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", color: "var(--ds-text-2)" }}>{label}</p>
                              <div className="grid grid-cols-4 gap-1.5">
                                {(lens.cyl_options ?? []).map((cyl, i) => (
                                  <button
                                    key={cyl}
                                    onClick={() => set(i)}
                                    className="py-2 rounded-[0.25rem] font-bold transition-all"
                                    style={{
                                      border: i === val ? "2px solid var(--ds-teal)" : "1px solid var(--ds-border)",
                                      background: i === val ? "rgba(0,104,123,0.08)" : "var(--ds-surface)",
                                      color: i === val ? "var(--ds-teal)" : "var(--ds-text-1)",
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
                      <label style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, color: "var(--ds-text-2)" }}>
                        Aks (AXIS) — °
                      </label>
                      {eyeMode === "same" ? (
                        <select
                          value={axisSame}
                          onChange={(e) => setAxisSame(Number(e.target.value))}
                          className="w-full rounded-[0.25rem] p-2"
                          style={{ fontSize: "14px", background: "var(--ds-surface)", border: "1px solid var(--ds-border)", color: "var(--ds-text-1)" }}
                        >
                          {(lens.axis_options ?? []).map((ax) => (
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
                              <p className="uppercase" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", color: "var(--ds-text-2)" }}>{label}</p>
                              <select
                                value={val}
                                onChange={(e) => set(Number(e.target.value))}
                                className="w-full rounded-[0.25rem] p-2"
                                style={{ fontSize: "14px", background: "var(--ds-surface)", border: "1px solid var(--ds-border)", color: "var(--ds-text-1)" }}
                              >
                                {(lens.axis_options ?? []).map((ax) => (
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
                    <label style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, color: "var(--ds-text-2)" }}>Taban Eğrilik (BC)</label>
                    <select defaultValue={selectedBc} className="w-full rounded-[0.25rem] p-2" style={{ fontSize: "14px", background: "var(--ds-surface)", border: "1px solid var(--ds-border)", color: "var(--ds-text-1)" }}>
                      <option>{lens.bc} mm</option>
                      <option>{(lens.bc + 0.2).toFixed(1)} mm</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, color: "var(--ds-text-2)" }}>Çap (DIA)</label>
                    <select defaultValue={selectedDia} className="w-full rounded-[0.25rem] p-2" style={{ fontSize: "14px", background: "var(--ds-surface)", border: "1px solid var(--ds-border)", color: "var(--ds-text-1)" }}>
                      <option>{lens.dia} mm</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Quantity */}
            <div className="flex flex-col gap-2">
              <label style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, color: "var(--ds-text-2)" }}>Adet (Kutu)</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-[0.25rem] overflow-hidden" style={{ border: "1px solid var(--ds-border)", background: "var(--ds-surface)" }}>
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2 px-4 transition-colors" style={{ color: "var(--ds-text-1)" }}>
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="px-4 font-bold" style={{ fontSize: "16px", color: "var(--ds-text-1)" }}>{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} className="p-2 px-4 transition-colors" style={{ color: "var(--ds-text-1)" }}>
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
                <span style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, color: "var(--ds-text-2)" }}>
                  {!isAccessory ? `${lens.pack_sizes?.[0]}'li Paket` : "1 Kutu"}
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
              background: added ? "var(--ds-amber-hover)" : hoverBtn ? "var(--ds-amber-hover)" : "var(--ds-amber)",
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
          <div className="flex items-center gap-4 p-4 rounded-[0.25rem]" style={{ border: "1px solid var(--ds-border)", background: "var(--ds-surface)" }}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", color: "var(--ds-primary)" }}>local_shipping</span>
            <p style={{ fontSize: "14px", lineHeight: "20px", color: "var(--ds-text-2)" }}>
              500 ₺ üzeri siparişlerde ücretsiz kargo. Tahmini teslimat 1-3 iş günü.
            </p>
          </div>
        </aside>
      </div>

      {/* ══ Full-width tabs section ══ */}
      <div ref={tabsSectionRef} className="mt-12 pt-8" style={{ borderTop: "1px solid var(--ds-border-subtle)" }}>

        {/* Tab nav */}
        <div className="flex w-full justify-between mb-8" style={{ borderBottom: "1px solid var(--ds-border-subtle)" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 text-center px-2 py-4 transition-colors relative whitespace-nowrap"
              style={{
                fontFamily: "'Inter'",
                fontSize: "13px",
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? "var(--ds-primary)" : "var(--ds-text-2)",
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full" style={{ background: "var(--ds-primary)" }} />
              )}
            </button>
          ))}
        </div>

        {/* Tab content — full width */}
        <div>

          {/* Ürün Detayları — tam genişlik afiş */}
          {activeTab === "details" && (
            <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: "460px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="absolute inset-0 w-full h-full object-cover"
                src="/images/banners/freshlook.png"
                alt=""
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(105deg, ${bannerBg}ee 0%, ${bannerBg}99 45%, ${bannerBg}22 100%)`,
                }}
              />
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
                  {product.brand_full_name ?? product.brand}
                </h2>
                <p
                  className="text-white mb-3"
                  style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "clamp(16px, 2vw, 22px)", lineHeight: 1.4, fontWeight: 500, opacity: 0.9, maxWidth: "520px" }}
                >
                  {product.name}
                </p>
                <p
                  className="text-white/75"
                  style={{ fontSize: "15px", lineHeight: "22px", maxWidth: "420px" }}
                >
                  {product.tagline ?? "Uzun süreli konfor ve nem deneyimi yaşayın."}
                </p>
              </div>
            </div>
          )}

          {/* Ürün Hakkında */}
          {activeTab === "about" && (
            <div className="w-full">
              <p style={{ fontSize: "15px", lineHeight: "26px", color: "var(--ds-text-2)" }}>{product.description}</p>
              {!isAccessory && (
                <p className="mt-4" style={{ fontSize: "15px", lineHeight: "26px", color: "var(--ds-text-2)" }}>
                  {lens.color === "colored"
                    ? `${product.name}, doğal görünümünü koruyan ya da farklı bir göz rengine kavuşmak isteyenler için tasarlanmış ${usagePeriodLabel.toLowerCase()} renkli kontakt lenstir. Reçete gerektirmez; görme bozukluğu olmayan kullanıcılar da güvenle kullanabilir.`
                    : `${product.name}, ${lens.material} malzemesinden üretilmiş, yüksek oksijen geçirgenliğine sahip bir ${usagePeriodLabel.toLowerCase()} kontakt lenstir. Gün boyu göz sağlığını korurken maksimum görüş netliği sağlar.`
                  }
                </p>
              )}
              {!isAccessory && lens.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {lens.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1.5 rounded-full" style={{ fontSize: "12px", fontWeight: 600, background: "var(--ds-surface-3)", color: "var(--ds-text-2)" }}>
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
                { label: "Materyal / Malzeme", value: lens.material },
                { label: "Su İçeriği", value: `%${lens.water_content}` },
                { label: "Oksijen Geçirgenliği", value: `${lens.oxygen_permeability} Dk/t` },
                { label: "Çap (DIA)", value: `${lens.dia} mm` },
                { label: "Taban Eğrilik (BC)", value: `${lens.bc} mm` },
                { label: "Sferik Güç Aralığı", value: lens.sph_range },
                { label: "Kullanım Süresi", value: usagePeriodLabel },
                { label: "UV Koruma", value: lens.uv_protection ? "Var — Sınıf 2" : "Yok" },
                { label: "Renk", value: lens.color === "colored" ? `Renkli${lens.color_name ? ` — ${lens.color_name}` : ""}` : "Şeffaf" },
                { label: "Paket Boyutları", value: lens.pack_sizes?.map((s: number) => `${s} adet`).join(" / ") },
                { label: "Reçete Gereksinimi", value: lens.color === "clear" ? "Gerekli" : "Gerekmiyor" },
                { label: "Stok Durumu", value: lens.stock > 0 ? `Mevcut (${lens.stock} adet)` : "Tükendi" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-3 last:border-0" style={{ borderBottom: "1px solid var(--ds-border-subtle)" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'Inter'", color: "var(--ds-text-3)" }}>{label}</span>
                  <span className="text-right" style={{ fontSize: "14px", fontWeight: 500, maxWidth: "55%", color: "var(--ds-text-1)" }}>{value}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === "specs" && isAccessory && (
            <div className="max-w-2xl space-y-3">
              <p style={{ fontSize: "15px", lineHeight: "24px", color: "var(--ds-text-2)" }}>{product.description}</p>
              <div className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid var(--ds-border-subtle)" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ds-text-3)" }}>Kategori</span>
                <span style={{ fontSize: "14px", color: "var(--ds-text-1)" }}>{accessory.accessory_category === "solution" ? "Bakım Solüsyonu" : "Göz Damlası"}</span>
              </div>
            </div>
          )}

          {/* Değerlendirmeler */}
          {activeTab === "reviews" && (
            <div>
              {reviews.length === 0 ? (
                <div className="text-center py-16">
                  <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--ds-border)" }}>star</span>
                  <p className="mt-3" style={{ color: "var(--ds-text-2)" }}>Henüz yorum yok. İlk sen ol!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="rounded-[0.5rem] p-5" style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold" style={{ fontSize: "14px", color: "var(--ds-text-1)" }}>{rev.user_name}</span>
                        {rev.verified && (
                          <span className="rounded-full px-2 py-0.5" style={{ fontSize: "10px", fontWeight: 700, color: "var(--ds-teal)", background: "rgba(0,200,230,0.12)" }}>✓ Doğrulandı</span>
                        )}
                        <span className="ml-auto" style={{ fontSize: "12px", color: "var(--ds-text-3)" }}>{new Date(rev.created_at).toLocaleDateString("tr-TR")}</span>
                      </div>
                      <div className="flex mb-3">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} style={{ color: s <= rev.rating ? "var(--ds-amber)" : "var(--ds-border)" }}>★</span>
                        ))}
                      </div>
                      <p style={{ fontSize: "14px", lineHeight: "20px", color: "var(--ds-text-1)" }}>{rev.comment}</p>
                      <p className="mt-3 text-xs" style={{ color: "var(--ds-text-3)" }}>{rev.helpful_count} kişi bu yorumu faydalı buldu</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 rounded-xl p-6 text-center" style={{ border: "1px solid var(--ds-border-subtle)", background: "var(--ds-surface)" }}>
                {user ? (
                  <>
                    <p className="font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans'", color: "var(--ds-text-1)" }}>Bu ürünü kullandınız mı?</p>
                    <p className="mb-4" style={{ fontSize: "14px", color: "var(--ds-text-3)" }}>Deneyiminizi paylaşın ve diğerlerine yardımcı olun.</p>
                    <button
                      className="text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                      style={{ fontSize: "13px", letterSpacing: "0.04em", background: "var(--ds-primary)" }}
                    >
                      Yorum Yaz
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "var(--ds-primary-hover)" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "24px", color: "var(--ds-primary)" }}>lock</span>
                    </div>
                    <p className="font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans'", color: "var(--ds-text-1)" }}>Yorum yapmak için giriş yapın</p>
                    <p className="mb-4" style={{ fontSize: "14px", color: "var(--ds-text-3)" }}>Deneyiminizi paylaşmak için hesabınıza giriş yapmanız gerekmektedir.</p>
                    <button
                      onClick={() => router.push(`/hesap/giris?mode=login`)}
                      className="text-white px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
                      style={{ fontSize: "13px", letterSpacing: "0.04em", background: "var(--ds-primary)" }}
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
              {([
                { key: "advantage",  bank: "Yapı Kredi"     },
                { key: "axess",      bank: "Akbank"         },
                { key: "bonus",      bank: "Garanti BBVA"   },
                { key: "cardfinans", bank: "Finansbank QNB" },
                { key: "bankkart",   bank: "Ziraat Bankası" },
                { key: "maximum",    bank: "İş Bankası"     },
                { key: "paraf",      bank: "Halkbank"       },
                { key: "saglam",     bank: "Vakıfbank"      },
                { key: "world",      bank: "Yapı Kredi"     },
              ] as const).map(({ key, bank }) => (
                <div
                  key={key}
                  className="rounded-2xl overflow-hidden flex flex-col"
                  style={{ colorScheme: "only light", backgroundColor: "#ffffff", border: "1.5px solid #e8eaf0", boxShadow: "0 2px 12px rgba(15,18,35,0.07)" }}
                >
                  <div className="flex flex-col items-center justify-center gap-2 py-5 px-6" style={{ backgroundColor: "#ffffff", colorScheme: "only light" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/images/taksit/${key}.png`}
                      alt={bank}
                      style={{ height: "40px", width: "100%", objectFit: "contain", objectPosition: "center" }}
                    />
                    <span style={{ color: "#737685", fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em", fontFamily: "'Inter'", textTransform: "uppercase" }}>
                      {bank}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-2" style={{ backgroundColor: "#f4f5f9", borderTop: "1px solid #e8eaf0", borderBottom: "1px solid #e8eaf0", colorScheme: "only light" }}>
                    <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em", fontFamily: "'Inter'", color: "#737685" }}>TAKSİT</span>
                    <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em", fontFamily: "'Inter'", color: "#737685" }}>AYLIK</span>
                    <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em", fontFamily: "'Inter'", color: "#737685" }}>TOPLAM</span>
                  </div>
                  <div className="flex flex-col divide-y divide-[#f0f1f5]" style={{ backgroundColor: "#ffffff", colorScheme: "only light" }}>
                    {[
                      { m: 3,  multi: 1.07638 },
                      { m: 6,  multi: 1.15461 },
                      { m: 9,  multi: 1.24523 },
                      { m: 12, multi: 1.35091 },
                    ].map(({ m, multi }) => {
                      const rowTotal = product.price * multi;
                      const monthly  = rowTotal / m;
                      return (
                        <div key={m} className="flex items-center justify-between px-4 py-2.5" style={{ colorScheme: "only light" }}>
                          <span style={{ fontSize: "12px", fontWeight: 700, fontFamily: "'Inter'", color: "#003d9b", minWidth: "28px" }}>{m}x</span>
                          <span style={{ fontSize: "12px", fontWeight: 600, fontFamily: "'Inter'", color: "#434654" }}>
                            {monthly.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                          </span>
                          <span style={{ fontSize: "12px", fontWeight: 800, fontFamily: "'Inter'", color: "#191c1e" }}>
                            {rowTotal.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
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
                { q: "BC Nedir?", a: "Base Curve teriminin kısaltmasıdır. Temel eğri değerini gösterir. Bir diğer ifadeyle korneanın bombelik değeridir. Doktor tarafından yapılan ölçümle belli olur ve bu değerlerin lens reçetesinde yazması gerekmektedir." },
                { q: "Dia Nedir?", a: "Kontakt lensin mm olarak çapını ifade eder. Lensin iki kenarının birbirine olan uzaklığını anlatmaktadır." },
                { q: "Gözlük Reçetesi ile Lens Alabilir Miyim?", a: "Gözlük reçetesi ile lens reçetesinde olması gereken değerler farklıdır. Bu nedenle göz doktorunuzun lens kullanımına özel bir reçete oluşturması gerekmektedir." },
                { q: "Ücretsiz Kargonun Koşulu Var Mı?", a: "Alt limit ve hiçbir koşul olmadan tüm siparişlerinizi ücretsiz kargo avantajı ile oluşturabilirsiniz." },
                { q: "Hangi Ödeme Yöntemleri Var?", a: "Kapıda ödeme, havale/EFT veya kredi kartı ödeme seçeneklerinden birini kullanarak sipariş oluşturabilirsiniz." },
                { q: "Lens Nasıl Takılır?", a: "Kontakt lens nasıl takılır? Öğrenmek için blog sayfamızı ziyaret ederek size özel oluşturduğumuz yazımızı okuyabilir ve uygulamalı olarak anlattığımız videomuzu izleyebilirsiniz." },
                { q: "Kontakt Lens Reçetemi Nasıl Okuyabilirim?", a: "Kontakt lens reçetelerinin hepsi aynı formatta olmasa bile kullanılan temel değerler ve terimler aynıdır. Dioptri (miyopi veya hipermetropi değeri), BC (temel eğri), Çap (Dia), Cyl (silindir veya toric astigmat değeri), Aks (Ax — astigmatın açısı)." },
                { q: "Gözlük Reçetesiyle Kontakt Lens Alınır Mı?", a: "Maalesef gözlük reçetesi ile kontakt lens almak mümkün olmamaktadır. Gözlük camı gözden 12-14 mm arasında bir mesafede konumlanır; kontakt lens ise göz yüzeyinde (kornea) bulunduğundan numaralar birbirinden farklı olabilir." },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden transition-colors"
                  style={{ border: `1px solid ${openFaq === i ? "var(--ds-primary)" : "var(--ds-border-subtle)"}` }}
                >
                  <button
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left transition-colors"
                    style={{ background: openFaq === i ? "var(--ds-primary-hover)" : "var(--ds-surface)" }}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span style={{ fontSize: "14px", fontWeight: 600, fontFamily: "'Plus Jakarta Sans'", color: openFaq === i ? "var(--ds-primary)" : "var(--ds-text-1)" }}>
                      {item.q}
                    </span>
                    <span
                      className="material-symbols-outlined shrink-0 transition-transform duration-200"
                      style={{ fontSize: "20px", color: openFaq === i ? "var(--ds-primary)" : "var(--ds-text-3)", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}
                    >
                      expand_more
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 border-t" style={{ borderColor: "var(--ds-border)" }}>
                      <p className="pt-4" style={{ fontSize: "14px", lineHeight: "22px", color: "var(--ds-text-2)" }}>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── Customers also viewed ── */}
      {related.length > 0 && (
        <section className="mt-20 pt-12" style={{ borderTop: "1px solid var(--ds-border-subtle)" }}>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "24px", lineHeight: "32px", fontWeight: 600, color: "var(--ds-text-1)" }}>
                Bunları da İnceleyenler
              </h2>
              <p style={{ fontSize: "14px", lineHeight: "20px", color: "var(--ds-text-2)" }}>
                Optometristler tarafından önerilen klinik olarak benzer alternatifler.
              </p>
            </div>
            <Link href="/urunler" className="flex items-center gap-1 hover:underline" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, color: "var(--ds-primary)" }}>
              Tümünü Gör <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((rel) => (
              <Link key={rel.id} href={`/urun/${rel.id}`} className="group cursor-pointer">
                <div className="rounded-[0.5rem] p-4 mb-2 relative overflow-hidden aspect-square flex items-center justify-center transition-all shadow-sm" style={{ background: "var(--ds-surface-2)", border: "1px solid var(--ds-border)" }}>
                  {rel.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={rel.image_url} alt={rel.name} className="max-w-[80%] h-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <span className="text-5xl opacity-30">👁️</span>
                  )}
                  {rel.badge && (
                    <div className="absolute top-2 right-2">
                      <span className="backdrop-blur-sm rounded-full font-bold shadow-sm px-2 py-1 whitespace-nowrap" style={{ fontSize: "10px", fontWeight: 700, background: "rgba(255,255,255,0.8)", color: "var(--ds-teal)" }}>
                        {rel.badge}
                      </span>
                    </div>
                  )}
                </div>
                <p style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, color: "var(--ds-text-2)" }}>{rel.brand}</p>
                <h3 className="transition-colors group-hover:opacity-75" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", lineHeight: "28px", fontWeight: 600, color: "var(--ds-text-1)" }}>
                  {rel.name}
                </h3>
                <p className="mt-1" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", lineHeight: "28px", fontWeight: 600, color: "var(--ds-primary)" }}>
                  {rel.price.toLocaleString("tr-TR")} ₺
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
