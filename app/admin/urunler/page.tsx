"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { lenses } from "@/lib/data";
import { DiscountEntry, getAllDiscounts, setDiscount, removeDiscount } from "@/lib/discountStore";

type DiscountModal = { lensId: number; name: string; currentPrice: number } | null;

export default function AdminUrunler() {
  const [search, setSearch] = useState("");
  const [filterColor, setFilterColor] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [discounts, setDiscounts] = useState<DiscountEntry[]>([]);
  const [discountModal, setDiscountModal] = useState<DiscountModal>(null);
  const [discountPct, setDiscountPct] = useState("10");
  const [discountSaved, setDiscountSaved] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => { setDiscounts(getAllDiscounts()); }, []);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const filtered = lenses.filter(l => {
    if (deletedIds.includes(l.id)) return false;
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.brand.toLowerCase().includes(search.toLowerCase());
    const matchColor = filterColor === "all" || l.color === filterColor;
    const matchPeriod = filterPeriod === "all" || l.usagePeriod === filterPeriod;
    return matchSearch && matchColor && matchPeriod;
  });

  const openDiscountModal = (l: typeof lenses[0]) => {
    const existing = discounts.find(d => d.lensId === l.id);
    setDiscountPct(existing ? String(existing.percent) : "10");
    setDiscountModal({ lensId: l.id, name: l.name, currentPrice: l.price });
    setDiscountSaved(false);
  };

  const applyDiscount = () => {
    if (!discountModal) return;
    const pct = Math.max(1, Math.min(90, Number(discountPct)));
    const original = discountModal.currentPrice;
    const sale = parseFloat((original * (1 - pct / 100)).toFixed(2));
    const entry: DiscountEntry = { lensId: discountModal.lensId, originalPrice: original, salePrice: sale, badge: `%${pct} İndirim`, percent: pct };
    setDiscount(entry);
    setDiscounts(getAllDiscounts());
    setDiscountSaved(true);
    setTimeout(() => { setDiscountModal(null); setDiscountSaved(false); }, 1200);
  };

  const deleteDiscount = (lensId: number) => {
    removeDiscount(lensId);
    setDiscounts(getAllDiscounts());
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* İndirim modalı */}
      {discountModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setDiscountModal(null)}>
          <div style={{ background: "white", borderRadius: "20px", padding: "24px", width: "min(360px, calc(100vw - 32px))", boxShadow: "0 24px 60px rgba(0,0,0,0.25)", margin: "0 16px" }} onClick={e => e.stopPropagation()}>
            <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "16px", fontWeight: 800, color: "#111827", marginBottom: "4px" }}>İndirim Ekle</p>
            <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>{discountModal.name}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", display: "block", marginBottom: "6px" }}>İndirim Oranı (%)</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input type="range" min="1" max="90" value={discountPct} onChange={e => setDiscountPct(e.target.value)} style={{ flex: 1 }} />
                  <input type="number" min="1" max="90" value={discountPct} onChange={e => setDiscountPct(e.target.value)} style={{ width: "60px", padding: "7px 10px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", fontWeight: 700, color: "#003d9b", textAlign: "center", outline: "none" }} />
                </div>
              </div>

              {/* Fiyat önizleme */}
              <div style={{ background: "#f0f9ff", borderRadius: "12px", padding: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>Orijinal fiyat</span>
                  <span style={{ fontSize: "14px", color: "#9ca3af", textDecoration: "line-through" }}>₺{discountModal.currentPrice.toLocaleString("tr-TR")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>İndirimli fiyat</span>
                  <span style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", fontWeight: 800, color: "#003d9b" }}>
                    ₺{(discountModal.currentPrice * (1 - Number(discountPct) / 100)).toLocaleString("tr-TR", { maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={{ background: "#dc2626", color: "white", borderRadius: "999px", padding: "3px 10px", display: "inline-block", fontSize: "11px", fontWeight: 800 }}>
                  %{discountPct} İndirim
                </div>
              </div>

              <p style={{ fontSize: "11px", color: "#6b7280" }}>
                Ürün kartında indirim rozeti ve üzeri çizili eski fiyat gösterilir. Ürün detay sayfasında banner olarak yansır.
              </p>

              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => setDiscountModal(null)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "white", fontSize: "13px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>İptal</button>
                <button onClick={applyDiscount} style={{ flex: 2, padding: "10px", borderRadius: "10px", background: discountSaved ? "#16a34a" : "#003d9b", color: "white", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>{discountSaved ? "check_circle" : "local_offer"}</span>
                  {discountSaved ? "Kaydedildi!" : "İndirimi Uygula"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Başlık */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", gap: "12px" }}>
        <div>
          <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: isMobile ? "18px" : "22px", fontWeight: 800, color: "#111827" }}>Ürün Yönetimi</p>
          <p style={{ fontSize: "13px", color: "#6b7280" }}>{filtered.length} ürün listeleniyor · {discounts.length} aktif indirim</p>
        </div>
        <Link href="/admin/urunler/yeni" style={{ display: "flex", alignItems: "center", gap: "8px", background: "#003d9b", color: "white", padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 700, textDecoration: "none", alignSelf: isMobile ? "stretch" : undefined, justifyContent: isMobile ? "center" : undefined }}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add</span>Yeni Ürün Ekle
        </Link>
      </div>

      {/* Filtreler */}
      <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e5e7eb", padding: "14px 18px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "200px", display: "flex", alignItems: "center", gap: "8px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 12px" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#9ca3af" }}>search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ürün adı veya marka ara…" style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", color: "#111827", width: "100%" }} />
        </div>
        <select value={filterColor} onChange={e => setFilterColor(e.target.value)} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px", color: "#374151", background: "white", cursor: "pointer" }}>
          <option value="all">Tüm Renkler</option><option value="clear">Şeffaf</option><option value="colored">Renkli</option>
        </select>
        <select value={filterPeriod} onChange={e => setFilterPeriod(e.target.value)} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px", color: "#374151", background: "white", cursor: "pointer" }}>
          <option value="all">Tüm Süreler</option><option value="daily">Günlük</option><option value="monthly">Aylık</option>
        </select>
      </div>

      {/* Tablo */}
      <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e5e7eb", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
              {["Ürün", "Marka", "Fiyat", "İndirim", "Stok", "Tip", "Süre", "İşlem"].map(h => (
                <th key={h} style={{ padding: "11px 16px", fontSize: "11px", fontWeight: 700, color: "#6b7280", textAlign: "left", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((lens) => {
              const disc = discounts.find(d => d.lensId === lens.id);
              return (
                <tr key={lens.id} style={{ borderBottom: "1px solid #f9fafb" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#fafafa"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {lens.imageUrl
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={lens.imageUrl} alt="" style={{ width: "36px", height: "36px", objectFit: "contain", borderRadius: "8px", background: "#f3f4f6" }} />
                        : <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "18px" }}>👁️</span></div>
                      }
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{lens.name}</p>
                        {lens.badge && <span style={{ fontSize: "10px", background: "#dae2ff", color: "#003d9b", padding: "1px 6px", borderRadius: "999px", fontWeight: 700 }}>{lens.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", color: "#374151" }}>{lens.brand}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {disc ? (
                      <>
                        <p style={{ fontSize: "13px", fontWeight: 800, color: "#003d9b" }}>₺{disc.salePrice.toLocaleString("tr-TR")}</p>
                        <p style={{ fontSize: "11px", color: "#9ca3af", textDecoration: "line-through" }}>₺{disc.originalPrice.toLocaleString("tr-TR")}</p>
                      </>
                    ) : (
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>₺{lens.price.toLocaleString("tr-TR")}</p>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {disc ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 800, padding: "3px 8px", borderRadius: "999px", background: "#fee2e2", color: "#dc2626" }}>{disc.badge}</span>
                        <button onClick={() => deleteDiscount(lens.id)} title="İndirimi kaldır" style={{ background: "transparent", border: "none", cursor: "pointer", color: "#dc2626", display: "flex", alignItems: "center", padding: "2px" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>close</span>
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: "11px", color: "#9ca3af" }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: lens.stock > 20 ? "#16a34a" : lens.stock > 0 ? "#b45309" : "#dc2626" }}>
                      {lens.stock > 0 ? `${lens.stock} adet` : "Tükendi"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: "11px", padding: "3px 8px", borderRadius: "999px", fontWeight: 700, background: lens.color === "colored" ? "#fdf4ff" : "#f0f9ff", color: lens.color === "colored" ? "#7e22ce" : "#0369a1" }}>
                      {lens.color === "colored" ? "Renkli" : "Şeffaf"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "12px", color: "#374151" }}>{{ daily: "Günlük", monthly: "Aylık", yearly: "Yıllık" }[lens.usagePeriod]}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <Link href={`/urun/${lens.id}`} target="_blank" title="Önizle" style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#f3f4f6", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "#6b7280" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>visibility</span>
                      </Link>
                      <button title="İndirim ekle" onClick={() => openDiscountModal(lens)} style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#fef3c7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#b45309" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>local_offer</span>
                      </button>
                      <button title="Sil" onClick={() => { if (confirm(`"${lens.name}" silinsin mi?`)) setDeletedIds(p => [...p, lens.id]); }} style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#fee2e2", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#dc2626" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: "48px", textAlign: "center", color: "#9ca3af" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px" }}>search_off</span>
            <p style={{ marginTop: "8px", fontSize: "14px" }}>Aramanızla eşleşen ürün bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
}
