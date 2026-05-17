"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { lenses, reviews, brands } from "@/lib/data";

const sphOptions = ["-1.25", "-1.50", "-1.75", "-2.00", "-2.50", "-3.00", "-3.50", "-4.00"];

export default function ProductDetail() {
  const { id } = useParams();
  const lens = lenses.find((l) => l.id === Number(id));
  const brand = lens ? brands.find((b) => b.id === lens.brandId) : null;
  const lensReviews = lens ? reviews.filter((r) => r.lensId === lens.id) : [];

  const [selectedSph, setSelectedSph] = useState(0);
  const [selectedBc] = useState(`${lens?.bc ?? 8.5} mm`);
  const [selectedDia] = useState(`${lens?.dia ?? 14.2} mm`);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "reviews" | "shipping">("specs");
  const [prescriptionFile, setPrescriptionFile] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  if (!lens) {
    return (
      <div className="pt-24 max-w-[1280px] mx-auto px-8 py-20 text-center">
        <span className="material-symbols-outlined" style={{ fontSize: "64px", color: "#c3c6d6" }}>search_off</span>
        <h1 className="text-2xl font-bold text-[#191c1e] mt-4">Ürün bulunamadı</h1>
        <Link href="/" className="mt-4 inline-block text-[#003d9b] hover:underline">
          Anasayfaya Dön
        </Link>
      </div>
    );
  }

  const discount = lens.originalPrice
    ? Math.round(((lens.originalPrice - lens.price) / lens.originalPrice) * 100)
    : 0;

  const usagePeriodLabel = { daily: "Günlük", monthly: "Aylık", yearly: "Yıllık" }[lens.usagePeriod];

  const handleAddToCart = () => {
    if (lens.requiresPrescription && !prescriptionFile) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const brandBg = {
    acuvue: "#003d9b",
    dailies: "#0052cc",
    biofinity: "#004e5d",
    freshlook: "#6a3600",
    airoptix: "#004e5d",
    bausch: "#003d9b",
  }[lens.brandId] ?? "#003d9b";

  return (
    <div className="pt-24 pb-8 px-4 md:px-8 max-w-[1280px] mx-auto">
      {/* Brand Banner */}
      <section
        className="mb-8 rounded-[0.5rem] overflow-hidden relative h-48 md:h-64 flex items-center"
        style={{ background: brandBg }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4zTqZpGie9ab2vSOSpI40VUOHF2iW48JjAmsqnrdNJgxdwyBGhe4-c1WjyaprB4X8tSnf1bv4UIP49yi4IKgyixzSwfgX-Ucuzy0ihxhRAHRvkEyUN7Au9JW8epRKIj5DsCEOHCS844vpBJReNWvnLmeCw6Pm2VTkoFqlNeeo6vzZ8O7rZf8qUaIMNV0zssoeeqwKJFG_CxnivLdXEVJGFAYG4uXX4qocQEMKap21ga9yCqZ-4beY0jTrixYOAqY_maUtx-oSUKzE"
          alt=""
        />
        <div className="relative z-10 px-8">
          <p
            className="text-[#c4d2ff] uppercase tracking-widest mb-2"
            style={{ fontSize: "12px", letterSpacing: "0.1em", fontWeight: 600 }}
          >
            Özel Partner
          </p>
          <h2
            className="text-white mb-1"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "32px", lineHeight: "40px", fontWeight: 600 }}
          >
            {brand?.name ?? lens.brand}
          </h2>
          <p className="text-[#c4d2ff] max-w-md" style={{ fontSize: "16px", lineHeight: "24px" }}>
            {brand?.tagline ?? "Uzun süreli konfor ve nem deneyimi yaşayın."}
          </p>
        </div>
      </section>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Image + Prescription + Tabs */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Product image */}
          <div className="bg-[#ffffff] rounded-[0.5rem] p-8 border border-[#c3c6d6] shadow-sm flex items-center justify-center min-h-[300px]">
            {lens.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={lens.imageUrl}
                alt={lens.name}
                className="max-w-full h-auto object-contain max-h-96"
              />
            ) : (
              <div className="text-[120px] opacity-30">👁️</div>
            )}
          </div>

          {/* Prescription Notice */}
          {lens.requiresPrescription && (
            <div className="bg-[#ffdcc3] text-[#2f1500] p-4 rounded-[0.5rem] flex items-center justify-between border border-[#8c4a00]/20">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[#6a3600]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                <div>
                  <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", lineHeight: "28px", fontWeight: 600 }}>
                    Reçete Gereklidir
                  </p>
                  <p style={{ fontSize: "14px", lineHeight: "20px", opacity: 0.9 }}>
                    Tıbbi sınıf lensler geçerli bir optometri reçetesi gerektirir.
                  </p>
                </div>
              </div>
              <label className="cursor-pointer bg-[#6a3600] text-white px-4 py-2 rounded-[0.25rem] hover:bg-[#8c4a00] transition-colors whitespace-nowrap"
                style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>
                {prescriptionFile ? "✓ Yüklendi" : "Şimdi Yükle"}
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => setPrescriptionFile(e.target.files?.[0]?.name ?? null)}
                />
              </label>
            </div>
          )}

          {/* Tabs */}
          <div className="mt-4">
            <div className="border-b border-[#c3c6d6]">
              <div className="flex gap-8">
                {(["specs", "reviews", "shipping"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="pb-3 transition-colors"
                    style={{
                      fontFamily: "'Inter'",
                      fontSize: "12px",
                      letterSpacing: "0.05em",
                      fontWeight: 600,
                      color: activeTab === tab ? "#003d9b" : "#434654",
                      borderBottom: activeTab === tab ? "2px solid #003d9b" : "2px solid transparent",
                    }}
                  >
                    {tab === "specs" ? "Teknik Özellikler" : tab === "reviews" ? `Değerlendirmeler (${lensReviews.length})` : "Kargo & İade"}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="py-8">
              {activeTab === "specs" && (
                <dl className="grid grid-cols-2 gap-y-4">
                  {[
                    { label: "Materyal", value: lens.material },
                    { label: "Su İçeriği", value: `%${lens.waterContent}` },
                    { label: "Oksijen Geçirgenliği", value: `${lens.oxygenPermeability} Dk/t` },
                    { label: "Değişim Takvimi", value: usagePeriodLabel },
                    { label: "UV Koruma", value: lens.uvProtection ? "Var" : "Yok" },
                    { label: "Renk Tipi", value: lens.color === "colored" ? `Renkli (${lens.colorName})` : "Şeffaf" },
                  ].map((item) => (
                    <div key={item.label} className="contents">
                      <dt className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>{item.label}</dt>
                      <dd className="text-[#191c1e]" style={{ fontSize: "16px", lineHeight: "24px" }}>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {lensReviews.length === 0 ? (
                    <div className="text-center py-12">
                      <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#c3c6d6" }}>star</span>
                      <p className="text-[#434654] mt-3">Henüz yorum yok. İlk sen ol!</p>
                    </div>
                  ) : lensReviews.map((rev) => (
                    <div key={rev.id} className="bg-[#ffffff] border border-[#c3c6d6] rounded-[0.5rem] p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-[#191c1e]" style={{ fontSize: "14px" }}>{rev.user}</span>
                        {rev.verified && (
                          <span className="text-[#00687b] bg-[#afecff] rounded-full px-2 py-0.5" style={{ fontSize: "10px", fontWeight: 700 }}>
                            ✓ Doğrulandı
                          </span>
                        )}
                        <span className="text-[#737685]" style={{ fontSize: "12px" }}>{rev.date}</span>
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
                  <div className="mt-8 bg-[#f3f4f6] rounded-[0.5rem] p-6 text-center border border-[#c3c6d6]">
                    <p className="font-bold text-[#191c1e] mb-1">Bu ürünü kullandınız mı?</p>
                    <p className="text-[#434654] mb-4" style={{ fontSize: "14px" }}>Deneyiminizi paylaşın ve diğerlerine yardımcı olun.</p>
                    <button className="bg-[#003d9b] text-white px-6 py-2.5 rounded-[0.75rem] font-semibold" style={{ fontSize: "12px", letterSpacing: "0.05em" }}>
                      Yorum Yaz
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-4 text-[#434654]" style={{ fontSize: "14px", lineHeight: "20px" }}>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#003d9b]" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                    <div>
                      <p className="font-semibold text-[#191c1e]">Ücretsiz Kargo</p>
                      <p>500 ₺ üzeri siparişlerde ücretsiz kargo. Genellikle 1-3 iş günü teslimat.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#003d9b]" style={{ fontVariationSettings: "'FILL' 1" }}>replay</span>
                    <div>
                      <p className="font-semibold text-[#191c1e]">Kolay İade</p>
                      <p>Açılmamış ürünleri 14 gün içinde tam iade ile iade edin. Reçeteli ürünler için farklı politikalar geçerli olabilir.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Purchase sidebar (sticky) */}
        <aside className="lg:col-span-5 flex flex-col gap-8 sticky top-24 h-fit">
          {/* Rating + Title */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span
                className="bg-[#50dcff] text-[#001f27] rounded-full uppercase px-2 py-0.5"
                style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em" }}
              >
                Klinik Onaylı
              </span>
              <div className="flex text-[#6a3600]">
                {[1,2,3,4,5].map((s) => (
                  <span key={s} style={{ fontSize: s <= Math.round(lens.rating) ? "16px" : "14px", fontVariationSettings: s <= Math.round(lens.rating) ? "'FILL' 1" : "'FILL' 0" }}>★</span>
                ))}
              </div>
              <span className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>({lens.rating})</span>
            </div>
            <h1
              className="text-[#003d9b]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "32px", lineHeight: "40px", fontWeight: 600 }}
            >
              {lens.name}
            </h1>
            <div className="flex items-baseline gap-2">
              <span
                className="text-[#191c1e]"
                style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "24px", lineHeight: "32px", fontWeight: 600 }}
              >
                {lens.price.toLocaleString("tr-TR")} ₺
              </span>
              {lens.originalPrice && (
                <span className="text-[#434654] line-through" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>
                  {lens.originalPrice.toLocaleString("tr-TR")} ₺
                  {discount > 0 && <> (%{discount} indirim)</>}
                </span>
              )}
            </div>
          </div>

          {/* Parameters */}
          <div
            className="flex flex-col gap-4 p-4 rounded-[0.5rem] border border-[#c3c6d6]"
            style={{ background: "#f3f4f6" }}
          >
            {/* SPH */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Sferik Güç (PWR/SPH)
                </label>
                <span className="text-[#003d9b] cursor-pointer hover:underline" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Rehber
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {sphOptions.map((sph, i) => (
                  <button
                    key={sph}
                    onClick={() => setSelectedSph(i)}
                    className="py-2 rounded-[0.25rem] font-bold transition-all"
                    style={{
                      border: i === selectedSph ? "2px solid #003d9b" : "1px solid #c3c6d6",
                      background: i === selectedSph ? "rgba(0,61,155,0.08)" : "#ffffff",
                      color: i === selectedSph ? "#003d9b" : "#191c1e",
                      fontSize: "14px",
                      lineHeight: "20px",
                    }}
                  >
                    {sph}
                  </button>
                ))}
              </div>
            </div>

            {/* BC + DIA */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Taban Eğrilik (BC)
                </label>
                <select
                  defaultValue={selectedBc}
                  className="w-full bg-white border border-[#c3c6d6] rounded-[0.25rem] p-2"
                  style={{ fontSize: "14px" }}
                >
                  <option>{lens.bc} mm</option>
                  <option>{(lens.bc + 0.2).toFixed(1)} mm</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>
                  Çap (DIA)
                </label>
                <select
                  defaultValue={selectedDia}
                  className="w-full bg-white border border-[#c3c6d6] rounded-[0.25rem] p-2"
                  style={{ fontSize: "14px" }}
                >
                  <option>{lens.dia} mm</option>
                </select>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-2">
              <label className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>
                Adet (Kutu)
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#c3c6d6] rounded-[0.25rem] overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 px-4 hover:bg-[#edeef0] transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="px-4 font-bold" style={{ fontSize: "16px" }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 px-4 hover:bg-[#edeef0] transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
                <span className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>
                  {lens.packSizes[0]}&apos;li Paket
                </span>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleAddToCart}
              disabled={lens.requiresPrescription && !prescriptionFile}
              className="w-full font-bold py-4 rounded-[0.5rem] shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              style={{
                background: added ? "#004e5d" : lens.requiresPrescription && !prescriptionFile ? "#c3c6d6" : "#8c4a00",
                color: lens.requiresPrescription && !prescriptionFile ? "#737685" : "#ffc9a0",
                cursor: lens.requiresPrescription && !prescriptionFile ? "not-allowed" : "pointer",
                fontFamily: "'Inter'",
                fontSize: "14px",
                letterSpacing: "0.05em",
                fontWeight: 700,
              }}
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {added ? "Sepete Eklendi!" : lens.requiresPrescription && !prescriptionFile ? "Önce Reçete Yükleyin" : "Sepete Ekle"}
            </button>
            <button
              className="w-full border-2 border-[#00687b] text-[#00687b] font-bold py-4 rounded-[0.5rem] hover:bg-[#00687b]/5 transition-all"
              style={{ fontFamily: "'Inter'", fontSize: "14px", letterSpacing: "0.05em", fontWeight: 700 }}
            >
              Abone Ol ve %15 Tasarruf Et
            </button>
          </div>

          {/* Shipping note */}
          <div className="flex items-center gap-4 p-4 border border-[#c3c6d6] rounded-[0.25rem] bg-[#ffffff]">
            <span className="material-symbols-outlined text-[#003d9b]" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
            <p className="text-[#434654]" style={{ fontSize: "14px", lineHeight: "20px" }}>
              500 ₺ üzeri siparişlerde ücretsiz kargo. Tahmini teslimat 1-3 iş günü.
            </p>
          </div>
        </aside>
      </div>

      {/* Customers also viewed */}
      <section className="mt-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2
              className="text-[#191c1e]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "24px", lineHeight: "32px", fontWeight: 600 }}
            >
              Bunları da İnceleyenler
            </h2>
            <p className="text-[#434654]" style={{ fontSize: "14px", lineHeight: "20px" }}>
              Optometristler tarafından önerilen klinik olarak benzer alternatifler.
            </p>
          </div>
          <Link
            href="/"
            className="text-[#003d9b] flex items-center gap-1 hover:underline"
            style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}
          >
            Tümünü Gör <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {lenses
            .filter((l) => l.id !== lens.id)
            .slice(0, 4)
            .map((rel) => (
              <Link key={rel.id} href={`/urun/${rel.id}`} className="group cursor-pointer">
                <div className="bg-[#f3f4f6] rounded-[0.5rem] p-4 mb-2 relative overflow-hidden aspect-square flex items-center justify-center border border-[#c3c6d6] group-hover:border-[#003d9b] transition-all shadow-sm">
                  {rel.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={rel.imageUrl}
                      alt={rel.name}
                      className="max-w-[80%] h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-5xl opacity-30">👁️</span>
                  )}
                  {rel.badge && (
                    <div className="absolute top-2 right-2">
                      <span
                        className="bg-white/80 backdrop-blur-sm text-[#00687b] rounded-full font-bold shadow-sm px-2 py-1 whitespace-nowrap"
                        style={{ fontSize: "10px", fontWeight: 700 }}
                      >
                        {rel.badge}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-[#434654]" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>{rel.brand}</p>
                <h3
                  className="text-[#191c1e] group-hover:text-[#003d9b] transition-colors"
                  style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", lineHeight: "28px", fontWeight: 600 }}
                >
                  {rel.name}
                </h3>
                <p
                  className="text-[#003d9b] mt-1"
                  style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", lineHeight: "28px", fontWeight: 600 }}
                >
                  {rel.price.toLocaleString("tr-TR")} ₺
                </p>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
