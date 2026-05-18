"use client";
import { useState } from "react";
import Link from "next/link";
import { lenses } from "@/lib/data";
import ProductCard from "./ProductCard";

const ITEMS_PER_PAGE = 4;

/* ── section: populer-urunler ── */
export default function PopularProductsCarousel() {
  const popularProducts = [...lenses].sort((a, b) => b.reviewCount - a.reviewCount);
  const total = popularProducts.length;
  const [start, setStart] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const canGoLeft = start > 0;
  const canGoRight = start + ITEMS_PER_PAGE < total;

  const go = (dir: "left" | "right") => {
    if (dir === "left") setStart((s) => Math.max(0, s - ITEMS_PER_PAGE));
    else setStart((s) => Math.min(total - ITEMS_PER_PAGE, s + ITEMS_PER_PAGE));
    setAnimKey((k) => k + 1);
  };

  const visible = popularProducts.slice(start, start + ITEMS_PER_PAGE);

  return (
    <section id="populer-urunler" className="max-w-[1280px] mx-auto px-8 py-12">
      {/* Başlık + oklar */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2
            className="text-[#191c1e]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "32px", lineHeight: "40px", fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            Popüler Ürünler
          </h2>
          <p className="text-[#737685] mt-1" style={{ fontSize: "15px" }}>
            En çok tercih edilen kontakt lensler
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/urunler"
            className="hidden sm:flex items-center gap-1 text-[#003d9b] hover:text-[#0052cc] hover:underline transition-colors group"
            style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 700 }}
          >
            Tümünü Gör
            <span className="material-symbols-outlined group-hover:translate-x-0.5 transition-transform" style={{ fontSize: "16px" }}>
              arrow_forward
            </span>
          </Link>

          {/* Navigasyon okları */}
          <div className="flex gap-2">
            <button
              onClick={() => go("left")}
              disabled={!canGoLeft}
              className={[
                "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                canGoLeft
                  ? "border-[#c3c6d6] text-[#434654] hover:border-[#003d9b] hover:bg-[#003d9b] hover:text-white hover:scale-110 active:scale-95 cursor-pointer"
                  : "border-[#edeef0] text-[#c3c6d6] cursor-not-allowed opacity-40",
              ].join(" ")}
              aria-label="Önceki ürünler"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>chevron_left</span>
            </button>
            <button
              onClick={() => go("right")}
              disabled={!canGoRight}
              className={[
                "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                canGoRight
                  ? "border-[#c3c6d6] text-[#434654] hover:border-[#003d9b] hover:bg-[#003d9b] hover:text-white hover:scale-110 active:scale-95 cursor-pointer"
                  : "border-[#edeef0] text-[#c3c6d6] cursor-not-allowed opacity-40",
              ].join(" ")}
              aria-label="Sonraki ürünler"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ürün kartları */}
      <div key={animKey} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-slide">
        {visible.map((lens) => (
          <ProductCard key={lens.id} lens={lens} variant="home" />
        ))}
      </div>

      {/* Sayfa göstergesi */}
      <div className="flex justify-center gap-1.5 mt-8">
        {Array.from({ length: Math.ceil(total / ITEMS_PER_PAGE) }, (_, i) => {
          const isActive = Math.floor(start / ITEMS_PER_PAGE) === i;
          return (
            <button
              key={i}
              onClick={() => { setStart(i * ITEMS_PER_PAGE); setAnimKey((k) => k + 1); }}
              className="h-1.5 rounded-full transition-all duration-300 hover:opacity-80"
              style={{
                width: isActive ? "32px" : "8px",
                background: isActive ? "#003d9b" : "#c3c6d6",
              }}
              aria-label={`Sayfa ${i + 1}`}
            />
          );
        })}
      </div>
    </section>
  );
}
