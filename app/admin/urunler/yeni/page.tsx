"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Brand = { id: string; name: string };

/* ─── Tipler ──────────────────────────────────────────────────────────────── */
type FormData = {
  productType: "lens" | "accessory";
  // Ortak
  name: string; brand: string; brandId: string;
  price: string; originalPrice: string; stock: string; badge: string;
  imageUrl: string; description: string; tags: string;
  // Lens'e özel
  color: "clear" | "colored"; colorName: string;
  usagePeriod: "daily" | "monthly" | "yearly";
  requiresPrescription: boolean; isToric: boolean; uvProtection: boolean;
  dia: string; bc: string; sphRange: string;
  material: string; waterContent: string; oxygenPermeability: string;
  packSizes: string; cylOptions: string; axisOptions: string;
  // Aksesuara özel
  accessoryCategory: "solution" | "eyedrop";
  volume: string;
};

/* ─── Sabit listeler ──────────────────────────────────────────────────────── */
const LENS_COLORS = [
  "Mavi", "Yeşil", "Kahverengi", "Ela", "Gri",
  "Mor", "Turkuaz", "Bal", "Fındık", "Lacivert", "Safir", "Aqua",
];

const MATERIALS = [
  "Silikon Hidrojel",
  "Hidrojel (HEMA)",
  "Lotrafilcon B",
  "Senofilcon A",
  "Narafilcon A",
  "Etafilcon A",
  "Delefilcon A",
  "Stenfilcon A",
  "Comfilcon A",
  "Omafilcon A",
  "Nelfilcon A",
];

/* ─── Başlangıç değerleri ─────────────────────────────────────────────────── */
const init: FormData = {
  productType: "lens",
  name: "", brand: "", brandId: "",
  price: "", originalPrice: "", stock: "", badge: "",
  imageUrl: "", description: "", tags: "",
  color: "clear", colorName: "",
  usagePeriod: "daily",
  requiresPrescription: true, isToric: false, uvProtection: false,
  dia: "14.2", bc: "8.6", sphRange: "-0.50 ile -8.00 arası",
  material: "Silikon Hidrojel", waterContent: "33", oxygenPermeability: "103",
  packSizes: "30", cylOptions: "", axisOptions: "",
  accessoryCategory: "solution",
  volume: "",
};

/* ─── Ortak bileşenler ────────────────────────────────────────────────────── */
const Section = ({
  title, icon, children,
}: { title: string; icon: string; children: React.ReactNode }) => (
  <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
    <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: "10px" }}>
      <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#003d9b", fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px", fontWeight: 700, color: "#111827" }}>{title}</p>
    </div>
    <div style={{ padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>{children}</div>
  </div>
);

const Field = ({
  label, required, full, children,
}: { label: string; required?: boolean; full?: boolean; children: React.ReactNode }) => (
  <div style={{ gridColumn: full ? "1 / -1" : undefined, display: "flex", flexDirection: "column", gap: "6px" }}>
    <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151", letterSpacing: "0.04em" }}>
      {label}{required && <span style={{ color: "#dc2626", marginLeft: "3px" }}>*</span>}
    </label>
    {children}
  </div>
);

const inputStyle = {
  border: "1px solid #e5e7eb", borderRadius: "8px", padding: "9px 12px",
  fontSize: "13px", color: "#111827", outline: "none", width: "100%",
  boxSizing: "border-box" as const, background: "white",
};
const selectStyle = { ...inputStyle, cursor: "pointer" };
const textareaStyle = { ...inputStyle, resize: "vertical" as const, minHeight: "90px" };

const Toggle = ({
  label, value, onChange, sub,
}: { label: string; value: boolean; onChange: (v: boolean) => void; sub?: string }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", background: "#f9fafb", borderRadius: "10px", padding: "12px 14px" }}>
    <div>
      <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>{label}</p>
      {sub && <p style={{ fontSize: "11px", color: "#6b7280" }}>{sub}</p>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        width: "44px", height: "24px", borderRadius: "999px", border: "none", cursor: "pointer",
        background: value ? "#003d9b" : "#d1d5db", position: "relative", transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute", top: "2px", left: value ? "22px" : "2px",
        width: "20px", height: "20px", borderRadius: "999px", background: "white",
        transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }} />
    </button>
  </div>
);

/* ─── Ana sayfa ───────────────────────────────────────────────────────────── */
export default function YeniUrun() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(init);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [brandList, setBrandList] = useState<Brand[]>([]);

  useEffect(() => {
    fetch("/api/brands")
      .then(r => r.json())
      .then(d => setBrandList(d.brands || []))
      .catch(console.error);
  }, []);

  const set = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value }));

  /* Marka seçilince hem brand hem brandId güncelle */
  const handleBrandSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const found = brandList.find(b => b.id === id);
    setForm(p => ({ ...p, brandId: id, brand: found?.name ?? "" }));
  };

  /* Ürün tipi değişince markaları sıfırla */
  const handleProductTypeChange = (t: "lens" | "accessory") => {
    setForm(p => ({ ...p, productType: t, brand: "", brandId: "" }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim())        e.name = "Ürün adı zorunlu";
    if (!form.brandId)            e.brandId = "Marka seçimi zorunlu";
    if (!form.price || isNaN(+form.price)) e.price = "Geçerli fiyat girin";
    if (!form.stock || isNaN(+form.stock)) e.stock = "Geçerli stok girin";
    if (!form.description.trim()) e.description = "Açıklama zorunlu";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaved(true);
    setTimeout(() => router.push("/admin/urunler"), 1500);
  };

  const isLens      = form.productType === "lens";
  const isAccessory = form.productType === "accessory";

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Başlık ────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "22px", fontWeight: 800, color: "#111827" }}>Yeni Ürün Ekle</p>
          <p style={{ fontSize: "13px", color: "#6b7280" }}>Tüm alanları doldurun ve kaydedin</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="button" onClick={() => router.push("/admin/urunler")}
            style={{ padding: "9px 18px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "white", fontSize: "13px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>
            İptal
          </button>
          <button type="submit"
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 20px", borderRadius: "10px", background: saved ? "#16a34a" : "#003d9b", color: "white", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{saved ? "check_circle" : "save"}</span>
            {saved ? "Kaydedildi!" : "Kaydet"}
          </button>
        </div>
      </div>

      {/* ── Ürün Tipi Seçici ─────────────────────────────────────────────── */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e5e7eb", padding: "20px" }}>
        <p style={{ fontSize: "12px", fontWeight: 700, color: "#374151", letterSpacing: "0.04em", marginBottom: "12px" }}>
          ÜRÜN TİPİ <span style={{ color: "#dc2626", marginLeft: "3px" }}>*</span>
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {([
            { type: "lens",      icon: "visibility",   label: "Kontakt Lens",       sub: "Günlük, aylık, renkli lensler" },
            { type: "accessory", icon: "water_drop",    label: "Solüsyon / Göz Damlası", sub: "Bakım solüsyonu, yapay gözyaşı" },
          ] as const).map(opt => (
            <button
              key={opt.type}
              type="button"
              onClick={() => handleProductTypeChange(opt.type)}
              style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "14px 18px", borderRadius: "12px", cursor: "pointer",
                border: `2px solid ${form.productType === opt.type ? "#003d9b" : "#e5e7eb"}`,
                background: form.productType === opt.type ? "#f0f4ff" : "#f9fafb",
                transition: "all 0.15s",
              }}
            >
              <span className="material-symbols-outlined"
                style={{ fontSize: "28px", color: form.productType === opt.type ? "#003d9b" : "#9ca3af", fontVariationSettings: "'FILL' 1" }}>
                {opt.icon}
              </span>
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: form.productType === opt.type ? "#003d9b" : "#111827" }}>{opt.label}</p>
                <p style={{ fontSize: "11px", color: "#6b7280" }}>{opt.sub}</p>
              </div>
              {form.productType === opt.type && (
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#003d9b", marginLeft: "auto", fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Temel Bilgiler ───────────────────────────────────────────────── */}
      <Section title="Temel Bilgiler" icon="info">
        {/* Ürün Adı */}
        <Field label="Ürün Adı" required full>
          <input value={form.name} onChange={set("name")}
            style={{ ...inputStyle, borderColor: errors.name ? "#dc2626" : "#e5e7eb" }}
            placeholder={isLens ? "örn. Acuvue Oasys 1-Day" : "örn. Renu Advanced 360 ml"} />
          {errors.name && <p style={{ fontSize: "11px", color: "#dc2626" }}>{errors.name}</p>}
        </Field>

        {/* Marka dropdown */}
        <Field label="Marka" required full>
          <select value={form.brandId} onChange={handleBrandSelect}
            style={{ ...selectStyle, borderColor: errors.brandId ? "#dc2626" : "#e5e7eb" }}>
            <option value="">— Marka seçin —</option>
            {brandList.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          {errors.brandId && <p style={{ fontSize: "11px", color: "#dc2626" }}>{errors.brandId}</p>}
        </Field>

        {/* Fiyat */}
        <Field label="Fiyat (₺)" required>
          <input type="number" value={form.price} onChange={set("price")}
            style={{ ...inputStyle, borderColor: errors.price ? "#dc2626" : "#e5e7eb" }}
            placeholder="örn. 389.90" step="0.01" min="0" />
          {errors.price && <p style={{ fontSize: "11px", color: "#dc2626" }}>{errors.price}</p>}
        </Field>

        {/* İndirimli fiyat */}
        <Field label="Orijinal / Liste Fiyatı (₺)">
          <input type="number" value={form.originalPrice} onChange={set("originalPrice")}
            style={inputStyle} placeholder="İndirimli değilse boş bırakın" step="0.01" min="0" />
        </Field>

        {/* Stok */}
        <Field label="Stok Adedi" required>
          <input type="number" value={form.stock} onChange={set("stock")}
            style={{ ...inputStyle, borderColor: errors.stock ? "#dc2626" : "#e5e7eb" }}
            placeholder="örn. 150" min="0" />
          {errors.stock && <p style={{ fontSize: "11px", color: "#dc2626" }}>{errors.stock}</p>}
        </Field>

        {/* Rozet */}
        <Field label="Rozet Etiketi (opsiyonel)">
          <input value={form.badge} onChange={set("badge")}
            style={inputStyle} placeholder="örn. Çok Satan, %20 İndirim" />
        </Field>

        {/* Aksesuar: Hacim/Adet */}
        {isAccessory && (
          <Field label="Hacim / Adet Bilgisi">
            <input value={form.volume} onChange={set("volume")}
              style={inputStyle} placeholder="örn. 360 ml, 30 flakon, 10 ml" />
          </Field>
        )}

        {/* Görsel */}
        <Field label="Ürün Görseli" full>
          <label
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", border: "2px dashed #e5e7eb", borderRadius: "12px", padding: "20px", cursor: "pointer", background: "#f9fafb", transition: "border-color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "#003d9b")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "#e5e7eb")}
          >
            {form.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.imageUrl} alt="Önizleme" style={{ width: "100px", height: "100px", objectFit: "contain", borderRadius: "10px", background: "white" }} />
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: "32px", color: "#9ca3af" }}>cloud_upload</span>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Görsel Yükle</p>
                <p style={{ fontSize: "11px", color: "#9ca3af" }}>PNG, JPG, WebP — maks. 5 MB</p>
              </>
            )}
            <input type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) setForm(p => ({ ...p, imageUrl: URL.createObjectURL(file) }));
              }}
            />
          </label>
          {form.imageUrl && (
            <button type="button" onClick={() => setForm(p => ({ ...p, imageUrl: "" }))}
              style={{ marginTop: "6px", fontSize: "11px", color: "#dc2626", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600 }}>
              Görseli Kaldır
            </button>
          )}
        </Field>
      </Section>

      {/* ── Aksesuar: Kategori ───────────────────────────────────────────── */}
      {isAccessory && (
        <Section title="Ürün Kategorisi" icon="category">
          <Field label="Kategori" required full>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {([
                { val: "solution", icon: "science",    label: "Lens Solüsyonu",    sub: "Çok amaçlı bakım solüsyonu" },
                { val: "eyedrop",  icon: "water_drop", label: "Göz Damlası",       sub: "Yapay gözyaşı, nemlendirici damla" },
              ] as const).map(opt => (
                <button key={opt.val} type="button"
                  onClick={() => setForm(p => ({ ...p, accessoryCategory: opt.val }))}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px",
                    borderRadius: "12px", cursor: "pointer",
                    border: `2px solid ${form.accessoryCategory === opt.val ? "#003d9b" : "#e5e7eb"}`,
                    background: form.accessoryCategory === opt.val ? "#f0f4ff" : "#f9fafb",
                    transition: "all 0.15s",
                  }}
                >
                  <span className="material-symbols-outlined"
                    style={{ fontSize: "24px", color: form.accessoryCategory === opt.val ? "#003d9b" : "#9ca3af", fontVariationSettings: "'FILL' 1" }}>
                    {opt.icon}
                  </span>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: form.accessoryCategory === opt.val ? "#003d9b" : "#111827" }}>{opt.label}</p>
                    <p style={{ fontSize: "11px", color: "#6b7280" }}>{opt.sub}</p>
                  </div>
                  {form.accessoryCategory === opt.val && (
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#003d9b", marginLeft: "auto", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </Field>
        </Section>
      )}

      {/* ── Lens: Ürün Tipi ve Reçete ────────────────────────────────────── */}
      {isLens && (
        <Section title="Ürün Tipi ve Reçete" icon="category">
          {/* Saydam / Renkli */}
          <Field label="Lens Rengi">
            <div style={{ display: "flex", borderRadius: "8px", overflow: "hidden", border: "1px solid #e5e7eb" }}>
              {(["clear", "colored"] as const).map(c => (
                <button key={c} type="button"
                  onClick={() => setForm(p => ({ ...p, color: c, requiresPrescription: c === "clear", colorName: c === "clear" ? "" : p.colorName }))}
                  style={{ flex: 1, padding: "9px", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer", background: form.color === c ? "#003d9b" : "white", color: form.color === c ? "white" : "#374151" }}>
                  {c === "clear" ? "Şeffaf" : "Renkli"}
                </button>
              ))}
            </div>
          </Field>

          {/* Renk adı — dropdown */}
          {form.color === "colored" && (
            <Field label="Renk Adı">
              <select value={form.colorName} onChange={set("colorName")} style={selectStyle}>
                <option value="">— Renk seçin —</option>
                {LENS_COLORS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          )}

          {/* Kullanım süresi */}
          <Field label="Kullanım Süresi">
            <select value={form.usagePeriod} onChange={set("usagePeriod")} style={selectStyle}>
              <option value="daily">Günlük</option>
              <option value="monthly">Aylık</option>
              <option value="yearly">Yıllık</option>
            </select>
          </Field>

          {/* Paket boyutları */}
          <Field label="Paket Boyutları (adet, virgülle ayırın)">
            <input value={form.packSizes} onChange={set("packSizes")} style={inputStyle} placeholder="örn. 30, 90" />
          </Field>

          {/* Toggle'lar */}
          <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <Toggle label="Reçete Gerekli" sub="Numaralı lens için" value={form.requiresPrescription} onChange={v => setForm(p => ({ ...p, requiresPrescription: v }))} />
            <Toggle label="Toric Lens" sub="Astigmat kullanıcıları için" value={form.isToric} onChange={v => setForm(p => ({ ...p, isToric: v }))} />
            <Toggle label="UV Koruma" sub="UV-A/B filtreli" value={form.uvProtection} onChange={v => setForm(p => ({ ...p, uvProtection: v }))} />
          </div>
        </Section>
      )}

      {/* ── Lens: Teknik Özellikler ───────────────────────────────────────── */}
      {isLens && (
        <Section title="Teknik Özellikler" icon="biotech">
          {/* Malzeme — dropdown */}
          <Field label="Malzeme / Materyal">
            <select value={form.material} onChange={set("material")} style={selectStyle}>
              {MATERIALS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </Field>

          <Field label="Su İçeriği (%)">
            <input type="number" value={form.waterContent} onChange={set("waterContent")} style={inputStyle} placeholder="örn. 33" min="0" max="100" />
          </Field>

          <Field label="Oksijen Geçirgenliği (Dk/t)">
            <input type="number" value={form.oxygenPermeability} onChange={set("oxygenPermeability")} style={inputStyle} placeholder="örn. 103" min="0" />
          </Field>

          <Field label="Çap — DIA (mm)">
            <input type="number" value={form.dia} onChange={set("dia")} style={inputStyle} placeholder="örn. 14.2" step="0.1" min="10" max="20" />
          </Field>

          <Field label="Taban Eğrilik — BC (mm)">
            <input type="number" value={form.bc} onChange={set("bc")} style={inputStyle} placeholder="örn. 8.6" step="0.1" min="6" max="10" />
          </Field>

          <Field label="Sferik Güç Aralığı (SPH)">
            <input value={form.sphRange} onChange={set("sphRange")} style={inputStyle} placeholder="örn. -0.50 ile -8.00 arası" />
          </Field>

          {form.isToric && (
            <>
              <Field label="CYL Seçenekleri (virgülle)">
                <input value={form.cylOptions} onChange={set("cylOptions")} style={inputStyle} placeholder="örn. -0.75, -1.25, -1.75, -2.25" />
              </Field>
              <Field label="AXIS Seçenekleri (virgülle)">
                <input value={form.axisOptions} onChange={set("axisOptions")} style={inputStyle} placeholder="örn. 10, 20, 30, ..., 180" />
              </Field>
            </>
          )}
        </Section>
      )}

      {/* ── Ürün İçeriği ─────────────────────────────────────────────────── */}
      <Section title="Ürün İçeriği" icon="description">
        <Field label="Ürün Açıklaması" required full>
          <textarea value={form.description} onChange={set("description")}
            style={{ ...textareaStyle, borderColor: errors.description ? "#dc2626" : "#e5e7eb" }}
            placeholder={
              isLens
                ? "Ürünün öne çıkan özelliklerini, teknolojisini ve kullanım avantajlarını yazın…"
                : "Ürünün içeriğini, kullanım talimatlarını ve faydalarını yazın…"
            }
          />
          {errors.description && <p style={{ fontSize: "11px", color: "#dc2626" }}>{errors.description}</p>}
        </Field>
        <Field label="Etiketler (virgülle ayırın)" full>
          <input value={form.tags} onChange={set("tags")} style={inputStyle}
            placeholder={isLens ? "örn. Günlük, Asferik, Kuru Göz, UV Koruma" : "örn. Kuru Göz, Hyaluronat, Lens Uyumlu"} />
          {form.tags && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
              {form.tags.split(",").map(t => t.trim()).filter(Boolean).map(tag => (
                <span key={tag} style={{ fontSize: "11px", background: "#f0f9ff", color: "#0369a1", padding: "3px 8px", borderRadius: "999px", fontWeight: 600 }}>{tag}</span>
              ))}
            </div>
          )}
        </Field>
      </Section>

      {/* ── Özet önizleme ────────────────────────────────────────────────── */}
      {form.name && form.price && form.brandId && (
        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "14px", padding: "16px 20px" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#0369a1", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Ürün Özeti</p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px", color: isLens ? "#003d9b" : "#0369a1", fontVariationSettings: "'FILL' 1" }}
            >
              {isLens ? "visibility" : form.accessoryCategory === "solution" ? "science" : "water_drop"}
            </span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#0369a1", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {isLens ? "Kontakt Lens" : form.accessoryCategory === "solution" ? "Lens Solüsyonu" : "Göz Damlası"}
            </span>
          </div>
          <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "18px", fontWeight: 800, color: "#111827" }}>{form.name}</p>
          <p style={{ fontSize: "13px", color: "#374151" }}>
            {form.brand}
            {isLens && ` · ${form.color === "colored" ? (form.colorName || "Renkli") : "Şeffaf"} · ${{ daily: "Günlük", monthly: "Aylık", yearly: "Yıllık" }[form.usagePeriod]}`}
            {isAccessory && form.volume && ` · ${form.volume}`}
          </p>
          <p style={{ fontSize: "20px", fontWeight: 800, color: "#003d9b", marginTop: "6px" }}>₺{(+form.price).toLocaleString("tr-TR")}</p>
        </div>
      )}

      {/* ── Alt butonlar ─────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button type="button" onClick={() => router.push("/admin/urunler")}
          style={{ padding: "11px 22px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "white", fontSize: "13px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>
          İptal
        </button>
        <button type="submit"
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 24px", borderRadius: "10px", background: saved ? "#16a34a" : "#003d9b", color: "white", border: "none", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{saved ? "check_circle" : "save"}</span>
          {saved ? "Kaydedildi! Yönlendiriliyor…" : "Ürünü Kaydet"}
        </button>
      </div>

    </form>
  );
}
