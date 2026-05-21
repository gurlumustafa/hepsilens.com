"use client";
import { useState } from "react";
import { lenses } from "@/lib/data";

export default function AdminPopuler() {
  const sorted = [...lenses].sort((a, b) => b.reviewCount - a.reviewCount);
  const [selected, setSelected] = useState<number[]>(sorted.slice(0, 4).map(l => l.id));
  const [saved, setSaved] = useState(false);

  const toggle = (id: number) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : prev.length < 8 ? [...prev, id] : prev
    );
  };

  const moveUp = (id: number) => {
    const i = selected.indexOf(id);
    if (i <= 0) return;
    const next = [...selected];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    setSelected(next);
  };

  const moveDown = (id: number) => {
    const i = selected.indexOf(id);
    if (i < 0 || i >= selected.length - 1) return;
    const next = [...selected];
    [next[i + 1], next[i]] = [next[i], next[i + 1]];
    setSelected(next);
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const selectedLenses = selected.map(id => lenses.find(l => l.id === id)!).filter(Boolean);
  const rest = lenses.filter(l => !selected.includes(l.id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "22px", fontWeight: 800, color: "#111827" }}>Popüler Ürünler</p>
          <p style={{ fontSize: "13px", color: "#6b7280" }}>Ana sayfadaki &quot;Popüler Ürünler&quot; bölümünü buradan yönetin. Maksimum 8 ürün.</p>
        </div>
        <button onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 20px", borderRadius: "10px", background: saved ? "#16a34a" : "#003d9b", color: "white", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{saved ? "check_circle" : "save"}</span>
          {saved ? "Kaydedildi!" : "Kaydet"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {/* Seçili ürünler */}
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "14px", fontWeight: 700, color: "#111827" }}>Seçili Ürünler</p>
            <span style={{ fontSize: "12px", background: "#dae2ff", color: "#003d9b", padding: "2px 10px", borderRadius: "999px", fontWeight: 700 }}>{selected.length}/8</span>
          </div>
          <div style={{ padding: "8px" }}>
            {selectedLenses.map((lens, i) => (
              <div key={lens.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "10px", background: "#f9fafb", marginBottom: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#003d9b", width: "20px", flexShrink: 0 }}>#{i + 1}</span>
                {lens.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={lens.imageUrl} alt="" style={{ width: "36px", height: "36px", objectFit: "contain", borderRadius: "6px", background: "white" }} />
                  : <div style={{ width: "36px", height: "36px", borderRadius: "6px", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>👁️</div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lens.name}</p>
                  <p style={{ fontSize: "11px", color: "#6b7280" }}>₺{lens.price.toLocaleString("tr-TR")}</p>
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button onClick={() => moveUp(lens.id)} disabled={i === 0} style={{ width: "26px", height: "26px", borderRadius: "6px", border: "1px solid #e5e7eb", background: "white", cursor: i === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: i === 0 ? 0.4 : 1 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_upward</span>
                  </button>
                  <button onClick={() => moveDown(lens.id)} disabled={i === selectedLenses.length - 1} style={{ width: "26px", height: "26px", borderRadius: "6px", border: "1px solid #e5e7eb", background: "white", cursor: i === selectedLenses.length - 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: i === selectedLenses.length - 1 ? 0.4 : 1 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_downward</span>
                  </button>
                  <button onClick={() => toggle(lens.id)} style={{ width: "26px", height: "26px", borderRadius: "6px", border: "none", background: "#fee2e2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#dc2626" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>remove</span>
                  </button>
                </div>
              </div>
            ))}
            {selected.length === 0 && (
              <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "13px", padding: "24px" }}>Henüz ürün seçilmedi</p>
            )}
          </div>
        </div>

        {/* Tüm ürünler */}
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #f3f4f6" }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "14px", fontWeight: 700, color: "#111827" }}>Tüm Ürünler</p>
            <p style={{ fontSize: "11px", color: "#6b7280" }}>+ butonuna basarak popüler listeye ekleyin</p>
          </div>
          <div style={{ padding: "8px", maxHeight: "500px", overflowY: "auto" }}>
            {rest.map((lens) => (
              <div key={lens.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "10px", marginBottom: "4px" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#f9fafb"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                {lens.imageUrl
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={lens.imageUrl} alt="" style={{ width: "32px", height: "32px", objectFit: "contain", borderRadius: "6px", background: "#f3f4f6" }} />
                  : <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>👁️</div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lens.name}</p>
                  <p style={{ fontSize: "11px", color: "#6b7280" }}>{lens.brand} · ₺{lens.price.toLocaleString("tr-TR")}</p>
                </div>
                <button
                  onClick={() => toggle(lens.id)}
                  disabled={selected.length >= 8}
                  style={{ width: "28px", height: "28px", borderRadius: "8px", border: "none", background: selected.length >= 8 ? "#f3f4f6" : "#dae2ff", cursor: selected.length >= 8 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: selected.length >= 8 ? "#9ca3af" : "#003d9b" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
