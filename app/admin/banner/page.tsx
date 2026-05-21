"use client";
import { useState } from "react";

type Slide = {
  id: number;
  badge: string;
  title: string;
  desc: string;
  btn1: string;
  link: string;
  img: string;
};

const defaultSlides: Slide[] = [
  {
    id: 1,
    badge: "Sınırlı Fırsat",
    title: "Acuvue Oasys ile hassas görüş.",
    desc: "Tüm gün konfor ve nem deneyimi yaşayın. Bu ay Air Optix ve Acuvue markalarında toplu siparişlerde %30'a varan indirim.",
    btn1: "Fırsatları Gör",
    link: "/urun/1",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDocRANQ75YmANj8xXoCkLsfS-Da0nQvivQRHPuPVbmq91P61w7cPKOjGSgFjhHSr7YMzatlEJpbgCgIcdCaCazK9MEmkc3RTXvwzSBIDJ-I08rmXmV9AHw_78DEa6vY6HW-pK8AVpG2STXsxRhV6_IKNG_kvPUaGziJT2K7cXIBURrkCh0wrF8ei2QBc58k-ju8_6B7--0GG_1dZgY27FOMycDw2f60IWFmZodu_MPPnGoQChMOtjCGdzcHzbXCfPDpwuBRF2azngA",
  },
  {
    id: 2,
    badge: "Yeni Sezon",
    title: "Dailies Total1. Farkı hissedin.",
    desc: "Su gradyanı teknolojisi — yüzeyde %80 su içeriği. Şimdiye kadar üretilen en konforlu günlük lens.",
    btn1: "Hemen Al",
    link: "/urun/4",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQYJ88f4Vm-kGwXqb6w9gnE6rUM5THU2-EhEeDRsyyzq45g76LwHK_M7sI_Xa1_TjTJKamyx-NRUpGuHQ1XGIKWW7iyVepYTyqVOepgA06TNLT0qDqQXVNCCG6f0-CU7U7EOEdCMRnY4Okiu5KboSu4pyADNoxuQodJsy3GOsSlA058XZNksL9U_GFE71EPhnVUWFICjN-6gxdj9dNc9ZSCcq26Ri-2CaoYq2KeSnYVbdjM_tCEzp3QelohxcQStPmbVG6fuWSRtwj9",
  },
  {
    id: 3,
    badge: "Özel Partner",
    title: "Bausch + Lomb ULTRA®. Tüm gün nem.",
    desc: "MoistureSeal® teknolojisi lensleri günde 16 saat nemli tutar. Dijital çağ için tasarlandı.",
    btn1: "Ürünü Gör",
    link: "/urun/14",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCoh2vwobD5TfxBMrtI3zg4V1Uep16DgKOeDtu90GMrAQEIZdiULlDJi_2o13wQu-DoWycLE3F3-wiQ_kVuueLj9wxsYsViW8m2jnha32iU-7336TdUclU9Tn6wjNdYWQM-dT8O0UhxXxW7-9Dww5vgInHAgkY8AOkhyEjQ00wjh25WFW81WuvvlEjmt5C_cd09jb25g792AZlRGDlUR028mZTiRVT6lKuTeptC1b7vQ4jCTQu_gMMO-_4k46NLl7x60g734HpsO-55",
  },
];

const inputStyle = { border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", color: "#111827", outline: "none", width: "100%", boxSizing: "border-box" as const };

export default function AdminBanner() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [selected, setSelected] = useState(0);
  const [saved, setSaved] = useState(false);

  const current = slides[selected];

  const update = (field: keyof Slide, val: string) => {
    setSlides(prev => prev.map((s, i) => i === selected ? { ...s, [field]: val } : s));
  };

  const addSlide = () => {
    const newSlide: Slide = { id: Date.now(), badge: "Yeni", title: "Yeni Slide Başlığı", desc: "Açıklama yazın.", btn1: "İncele", link: "/urunler", img: "" };
    setSlides(prev => [...prev, newSlide]);
    setSelected(slides.length);
  };

  const removeSlide = (i: number) => {
    if (slides.length <= 1) return;
    setSlides(prev => prev.filter((_, idx) => idx !== i));
    setSelected(Math.max(0, i - 1));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "22px", fontWeight: 800, color: "#111827" }}>Banner Yönetimi</p>
          <p style={{ fontSize: "13px", color: "#6b7280" }}>Ana sayfa hero slider içeriklerini buradan düzenleyin</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={addSlide} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "white", fontSize: "13px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>Slide Ekle
          </button>
          <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 20px", borderRadius: "10px", background: saved ? "#16a34a" : "#003d9b", color: "white", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{saved ? "check_circle" : "save"}</span>
            {saved ? "Kaydedildi!" : "Kaydet"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "20px" }}>

        {/* Slide listesi */}
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <p style={{ padding: "12px 16px", fontSize: "11px", fontWeight: 700, color: "#6b7280", borderBottom: "1px solid #f3f4f6", textTransform: "uppercase", letterSpacing: "0.06em" }}>Slide Listesi</p>
          <div style={{ padding: "8px" }}>
            {slides.map((s, i) => (
              <div key={s.id} onClick={() => setSelected(i)} style={{
                display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", borderRadius: "10px", cursor: "pointer",
                background: i === selected ? "#dae2ff" : "transparent",
                marginBottom: "2px",
              }}>
                <div style={{ width: "36px", height: "28px", borderRadius: "6px", background: "#f3f4f6", overflow: "hidden", flexShrink: 0 }}>
                  {s.img
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={s.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", background: "#e5e7eb" }} />
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: i === selected ? "#003d9b" : "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Slide {i + 1}</p>
                  <p style={{ fontSize: "11px", color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.badge}</p>
                </div>
                {slides.length > 1 && (
                  <button onClick={(e) => { e.stopPropagation(); removeSlide(i); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#dc2626", opacity: 0.7, display: "flex", alignItems: "center", padding: "2px" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Slide editör */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Önizleme */}
          <div style={{ background: "#12151a", borderRadius: "14px", overflow: "hidden", height: "200px", position: "relative" }}>
            {current.img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={current.img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
            )}
            <div style={{ position: "absolute", inset: 0, padding: "24px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#50dcff", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>{current.badge}</span>
              <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "22px", fontWeight: 800, color: "white", lineHeight: 1.2, marginBottom: "6px" }}>{current.title}</p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5, maxWidth: "480px" }}>{current.desc}</p>
            </div>
            <div style={{ position: "absolute", top: "12px", right: "12px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", borderRadius: "8px", padding: "4px 12px" }}>
              <p style={{ fontSize: "11px", color: "white", fontWeight: 700 }}>Önizleme</p>
            </div>
          </div>

          {/* Form alanları */}
          <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e5e7eb", padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            {[
              { label: "Rozet / Badge", key: "badge" as const, placeholder: "örn. Sınırlı Fırsat" },
              { label: "Buton Metni", key: "btn1" as const, placeholder: "örn. Hemen Al" },
              { label: "Başlık", key: "title" as const, placeholder: "Ana başlık metni" },
              { label: "Hedef Link", key: "link" as const, placeholder: "/urun/1" },
            ].map(f => (
              <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151" }}>{f.label}</label>
                <input value={current[f.key] as string} onChange={e => update(f.key, e.target.value)} style={inputStyle} placeholder={f.placeholder} />
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151" }}>Açıklama Metni</label>
              <textarea value={current.desc} onChange={e => update("desc", e.target.value)} style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }} placeholder="Kampanya açıklaması…" />
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151" }}>Arka Plan Görseli</label>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", border: "2px dashed #e5e7eb", borderRadius: "12px", padding: "14px 16px", cursor: "pointer", background: "#f9fafb" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#003d9b")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#e5e7eb")}
              >
                {current.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={current.img} alt="" style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "6px" }} />
                ) : (
                  <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "#9ca3af" }}>image</span>
                )}
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{current.img ? "Görseli Değiştir" : "Görsel Yükle"}</p>
                  <p style={{ fontSize: "11px", color: "#9ca3af" }}>PNG, JPG, WebP — maks. 5 MB</p>
                </div>
                <input type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) update("img", URL.createObjectURL(file));
                  }}
                />
              </label>
              {current.img && (
                <button type="button" onClick={() => update("img", "")} style={{ fontSize: "11px", color: "#dc2626", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600, textAlign: "left" }}>
                  Görseli Kaldır
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
