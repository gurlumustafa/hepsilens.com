"use client";
import { useState } from "react";
import { testimonials } from "@/lib/data";

const ITEMS_PER_VIEW = 3;

/* ── section: musteri-yorumlari ── */
export default function ReviewsCarousel() {
  const [start, setStart] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const total = testimonials.length;

  const canGoLeft = start > 0;
  const canGoRight = start + ITEMS_PER_VIEW < total;

  const go = (dir: "left" | "right") => {
    if (dir === "left") setStart((s) => Math.max(0, s - 1));
    else setStart((s) => Math.min(total - ITEMS_PER_VIEW, s + 1));
    setAnimKey((k) => k + 1);
  };

  const visible = testimonials.slice(start, start + ITEMS_PER_VIEW);

  return (
    <section id="musteri-yorumlari" className="py-25 border-t border-[#edeef0]" style={{ background: "linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%)" }}>
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Başlık */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="text-[#6a3600]" style={{ fontSize: "20px" }}>★</span>
              ))}
            </div>
            <h2
              className="text-[#191c1e]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "32px", lineHeight: "40px", fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Müşteri Yorumları
            </h2>

          </div>

          <div className="flex gap-2">
            <button
              onClick={() => go("left")}
              disabled={!canGoLeft}
              className={[
                "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                canGoLeft
                  ? "border-[#c3c6d6] text-[#434654] hover:border-[#003d9b] hover:bg-[#003d9b] hover:text-white hover:scale-110 active:scale-95"
                  : "border-[#edeef0] text-[#c3c6d6] opacity-40 cursor-not-allowed",
              ].join(" ")}
              aria-label="Önceki yorumlar"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>chevron_left</span>
            </button>
            <button
              onClick={() => go("right")}
              disabled={!canGoRight}
              className={[
                "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                canGoRight
                  ? "border-[#c3c6d6] text-[#434654] hover:border-[#003d9b] hover:bg-[#003d9b] hover:text-white hover:scale-110 active:scale-95"
                  : "border-[#edeef0] text-[#c3c6d6] opacity-40 cursor-not-allowed",
              ].join(" ")}
              aria-label="Sonraki yorumlar"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>chevron_right</span>
            </button>
          </div>
        </div>

        {/* Yorum kartları */}
        <div key={animKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-slide">
          {visible.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-[0.75rem] p-6 border border-[#edeef0] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-250 flex flex-col gap-4 group"
            >
              {/* Yıldızlar */}
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} style={{ fontSize: "18px", color: s <= t.rating ? "#6a3600" : "#c3c6d6" }}>★</span>
                ))}
              </div>

              {/* Yorum metni */}
              <p
                className="text-[#434654] flex-1 leading-relaxed"
                style={{ fontSize: "14px", lineHeight: "22px" }}
              >
                &ldquo;{t.comment}&rdquo;
              </p>

              {/* Ürün etiketi */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full self-start"
                style={{ background: "#f3f4f6", fontSize: "11px", fontWeight: 600, color: "#737685" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>verified</span>
                {t.product}
              </div>

              {/* Kullanıcı */}
              <div className="flex items-center gap-3 pt-2 border-t border-[#f3f4f6]">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold group-hover:scale-110 transition-transform duration-200"
                  style={{ background: t.color, fontSize: "13px" }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-[#191c1e] font-bold" style={{ fontSize: "14px" }}>{t.user}</p>
                  <p className="text-[#737685]" style={{ fontSize: "12px" }}>{t.location}</p>
                </div>
                <div className="ml-auto">
                  <span
                    className="text-[#00687b] bg-[#afecff] rounded-full px-2 py-0.5 flex items-center gap-0.5"
                    style={{ fontSize: "10px", fontWeight: 700 }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "11px", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Doğrulandı
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nokta göstergesi */}
        <div className="flex justify-center gap-1.5 mt-8">
          {Array.from({ length: total - ITEMS_PER_VIEW + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => { setStart(i); setAnimKey((k) => k + 1); }}
              className="h-1.5 rounded-full transition-all duration-300 hover:opacity-80"
              style={{
                width: start === i ? "28px" : "8px",
                background: start === i ? "#003d9b" : "#c3c6d6",
              }}
              aria-label={`Yorum ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
