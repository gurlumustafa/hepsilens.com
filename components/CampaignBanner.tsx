"use client";
import { useState, useEffect, useCallback } from "react";

const slides = [
  {
    id: 1,
    badge: "Sınırlı Fırsat",
    title: "Acuvue Oasys ile hassas görüş.",
    desc: "Tüm gün konfor ve nem deneyimi yaşayın. Bu ay Air Optix ve Acuvue markalarında toplu siparişlerde %30'a varan indirim.",
    btn1: "Fırsatları Gör",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDocRANQ75YmANj8xXoCkLsfS-Da0nQvivQRHPuPVbmq91P61w7cPKOjGSgFjhHSr7YMzatlEJpbgCgIcdCaCazK9MEmkc3RTXvwzSBIDJ-I08rmXmV9AHw_78DEa6vY6HW-pK8AVpG2STXsxRhV6_IKNG_kvPUaGziJT2K7cXIBURrkCh0wrF8ei2QBc58k-ju8_6B7--0GG_1dZgY27FOMycDw2f60IWFmZodu_MPPnGoQChMOtjCGdzcHzbXCfPDpwuBRF2azngA",
  },
  {
    id: 2,
    badge: "Yeni Sezon",
    title: "Dailies Total1. Farkı hissedin.",
    desc: "Su gradyanı teknolojisi — yüzeyde %80 su içeriği. Şimdiye kadar üretilen en konforlu günlük lens.",
    btn1: "Hemen Al",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQYJ88f4Vm-kGwXqb6w9gnE6rUM5THU2-EhEDRsyyzq45g76LwHK_M7sI_Xa1_TjTJKamyx-NRUpGuHQ1XGIKWW7iyVepYTyqVOepgA06TNLT0qDqQXVNCCG6f0-CU7U7EOEdCMRnY4Okiu5KboSu4pyADNoxuQodJsy3GOsSlA058XZNksL9U_GFE71EPhnVUWFICjN-6gxdj9dNc9ZSCcq26Ri-2CaoYq2KeSnYVbdjM_tCEzp3QelohxcQStPmbVG6fuWSRtwj9",
  },
  {
    id: 3,
    badge: "Özel Partner",
    title: "Bausch + Lomb ULTRA®. Tüm gün nem.",
    desc: "MoistureSeal® teknolojisi lensleri günde 16 saat nemli tutar. Dijital çağ için tasarlandı.",
    btn1: "Ürünü Gör",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoh2vwobD5TfxBMrtI3zg4V1Uep16DgKOeDtu90GMrAQEIZdiULlDJi_2o13wQu-DoWycLE3F3-wiQ_kVuueLj9wxsYsViW8m2jnha32iU-7336TdUclU9Tn6wjNdYWQM-dT8O0UhxXxW7-9Dww5vgInHAgkY8AOkhyEjQ00wjh25WFW81WuvvlEjmt5C_cd09jb25g792AZlRGDlUR028mZTiRVT6lKuTeptC1b7vQ4jCTQu_gMMO-_4k46NLl7x60g734HpsO-55",
  },
];

export default function CampaignBanner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full overflow-hidden bg-white h-[500px] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slide.img}
          alt=""
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2">
        <div
          className="p-8 rounded-[0.5rem] border border-white shadow-xl max-w-lg"
          style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)" }}
        >
          <span
            className="inline-block px-3 py-1 rounded-[0.75rem] mb-4 text-[#005f71]"
            style={{
              background: "#50dcff",
              fontFamily: "'Inter', sans-serif",
              fontSize: "12px",
              lineHeight: "16px",
              letterSpacing: "0.05em",
              fontWeight: 600,
            }}
          >
            {slide.badge}
          </span>
          <h1
            className="text-[#003d9b] mb-4 leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "48px", lineHeight: "56px", fontWeight: 700, letterSpacing: "-0.02em" }}
          >
            {slide.title}
          </h1>
          <p className="text-[#434654] mb-8" style={{ fontSize: "18px", lineHeight: "28px" }}>
            {slide.desc}
          </p>
          <div className="flex gap-4">
            <button
              className="bg-[#003d9b] text-white px-8 py-4 rounded-[0.5rem] hover:bg-[#0052cc] transition-all"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}
            >
              {slide.btn1}
            </button>
          </div>
        </div>
      </div>

      {/* Slider dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === current ? "48px" : "12px",
              backgroundColor: i === current ? "#003d9b" : "#c3c6d6",
            }}
          />
        ))}
      </div>
    </section>
  );
}
