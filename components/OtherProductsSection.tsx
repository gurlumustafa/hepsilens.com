"use client";
import Link from "next/link";
import { accessories, Accessory } from "@/lib/data";

function AccessoryCard({ item }: { item: Accessory }) {
  const discount = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  const emoji = item.category === "solution" ? "💧" : "👁️";

  return (
    <div className="group bg-white rounded-[0.75rem] border border-[#c3c6d6] p-4 flex gap-4 items-start hover:shadow-lg hover:-translate-y-0.5 hover:border-[#003d9b]/30 transition-all duration-250 cursor-pointer">
      {/* Görsel */}
      <div className="w-20 h-20 flex-shrink-0 bg-[#f3f4f6] rounded-[0.5rem] flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-200">
        {emoji}
      </div>

      {/* Bilgi */}
      <div className="flex-1 min-w-0">
        <p className="text-[#737685] uppercase" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em" }}>
          {item.brand}
        </p>
        <h3
          className="text-[#191c1e] group-hover:text-[#003d9b] transition-colors duration-200 leading-snug mt-0.5"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px", fontWeight: 700 }}
        >
          {item.name}
        </h3>
        <p className="text-[#737685] mt-1 line-clamp-2" style={{ fontSize: "12px", lineHeight: "16px" }}>
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[#003d9b]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "17px", fontWeight: 700 }}>
              {item.price.toLocaleString("tr-TR")} ₺
            </span>
            {item.originalPrice && (
              <span className="text-[#737685] line-through" style={{ fontSize: "11px" }}>
                {item.originalPrice.toLocaleString("tr-TR")} ₺
              </span>
            )}
          </div>
          {item.badge && (
            <span
              className="bg-[#50dcff] text-[#005f71] px-2 py-0.5 rounded-full whitespace-nowrap"
              style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.04em" }}
            >
              {item.badge}
            </span>
          )}
        </div>
        {/* Yıldız + yorum */}
        <div className="flex items-center gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} style={{ fontSize: "11px", color: s <= Math.round(item.rating) ? "#6a3600" : "#c3c6d6" }}>★</span>
          ))}
          <span style={{ fontSize: "11px", color: "#737685" }}>({item.reviewCount})</span>
        </div>
      </div>

      {/* Sepet butonu */}
      <button
        className="flex-shrink-0 self-center bg-[#d97706] text-white p-2.5 rounded-[0.5rem] hover:bg-[#b45309] hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
        onClick={(e) => e.preventDefault()}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add_shopping_cart</span>
      </button>
    </div>
  );
}

/* ── section: diger-urunler ── */
export default function OtherProductsSection() {
  // En çok puan alan 4 solüsyon ve 4 göz damlası
  const solutions = accessories.filter((a) => a.category === "solution").sort((a, b) => b.rating - a.rating).slice(0, 4);
  const eyedrops = accessories.filter((a) => a.category === "eyedrop").sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <section id="diger-urunler" className="max-w-[1280px] mx-auto px-8 py-12 border-t border-[#edeef0]">
      <div className="mb-8">
        <h2
          className="text-[#191c1e]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "32px", lineHeight: "40px", fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          Diğer Ürünler
        </h2>
        <p className="text-[#737685] mt-1" style={{ fontSize: "15px" }}>
          Lens bakımı için ihtiyacınız olan her şey
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Solüsyonlar */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#afecff] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#00687b]" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>water_drop</span>
              </div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#191c1e" }}>
                Solüsyonlar
              </h3>
            </div>
            <Link
              href="/urunler?kategori=solüsyon"
              className="text-[#003d9b] hover:underline flex items-center gap-0.5 group"
              style={{ fontSize: "12px", fontWeight: 700 }}
            >
              Tümü
              <span className="material-symbols-outlined group-hover:translate-x-0.5 transition-transform" style={{ fontSize: "14px" }}>arrow_forward</span>
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {solutions.map((item) => <AccessoryCard key={item.id} item={item} />)}
          </div>
        </div>

        {/* Göz Damlaları */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#dae2ff] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>visibility</span>
              </div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#191c1e" }}>
                Göz Damlaları
              </h3>
            </div>
            <Link
              href="/urunler?kategori=goz-damlasi"
              className="text-[#003d9b] hover:underline flex items-center gap-0.5 group"
              style={{ fontSize: "12px", fontWeight: 700 }}
            >
              Tümü
              <span className="material-symbols-outlined group-hover:translate-x-0.5 transition-transform" style={{ fontSize: "14px" }}>arrow_forward</span>
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {eyedrops.map((item) => <AccessoryCard key={item.id} item={item} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
