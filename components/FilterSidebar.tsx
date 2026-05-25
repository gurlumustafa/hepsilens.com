"use client";
import { brands, accessoryBrands } from "@/lib/data";

export type Filters = {
  brands: string[];
  lensTypes: string[];
  color: "all" | "clear" | "colored";
  usage: string[];
  category: string[]; // "solution" | "eyedrop"
  priceMin: number;
  priceMax: number;
  sortBy: "popular" | "price-asc" | "price-desc" | "rating";
};

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
  mode?: "lens" | "accessories";
};

const LENS_TYPES = [
  { value: "saydam", label: "Saydam Lens", icon: "water_drop" },
  { value: "renkli", label: "Renkli Lens", icon: "palette" },
  { value: "toric", label: "Toric (Astigmat) Lens", icon: "adjust" },
  { value: "multifocal", label: "Multifocal (Uzak-Yakın)", icon: "center_focus_strong" },
  { value: "indirimli", label: "İndirimli Lens Setleri", icon: "local_offer" },
];

const DURATIONS = [
  { value: "daily", label: "Günlük Kullan-At", icon: "wb_sunny" },
  { value: "biweekly", label: "2 Haftalık", icon: "date_range" },
  { value: "monthly", label: "Aylık", icon: "calendar_month" },
];

const CATEGORIES = [
  { value: "solution", label: "Lens Solüsyonları", icon: "water_drop" },
  { value: "eyedrop", label: "Göz Damlaları", icon: "opacity" },
];

/* ── Yardımcı: bölüm başlığı ── */
function SectionLabel({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span
        className="material-symbols-outlined"
        style={{ fontSize: "16px", color: "#003d9b", fontVariationSettings: "'FILL' 1" }}
      >
        {icon}
      </span>
      <span
        style={{
          fontSize: "11px",
          fontWeight: 800,
          letterSpacing: "0.08em",
          fontFamily: "'Inter'",
          color: "#434654",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Yardımcı: checkbox satırı ── */
function CheckRow({
  checked,
  onChange,
  label,
  icon,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  icon?: string;
}) {
  return (
    <label
      className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 group"
      style={{
        background: checked ? "#f0f4ff" : "transparent",
        border: checked ? "1.5px solid #c8d6f7" : "1.5px solid transparent",
      }}
    >
      {/* Gizli gerçek checkbox — erişilebilirlik + onChange */}
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />

      {/* Görsel özel checkbox kutusu */}
      <span
        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all duration-150"
        style={{
          background: checked ? "#003d9b" : "#fff",
          border: checked ? "none" : "1.5px solid #c3c6d6",
          boxShadow: checked ? "0 2px 6px rgba(0,61,155,0.25)" : "none",
        }}
      >
        {checked && (
          <span
            className="material-symbols-outlined text-white"
            style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1, 'wght' 700" }}
          >
            check
          </span>
        )}
      </span>

      {/* İkon (varsa) */}
      {icon && (
        <span
          className="material-symbols-outlined shrink-0 transition-colors duration-150"
          style={{
            fontSize: "15px",
            color: checked ? "#003d9b" : "#9ea3b5",
            fontVariationSettings: "'FILL' 1",
          }}
        >
          {icon}
        </span>
      )}

      <span
        style={{
          fontSize: "13.5px",
          lineHeight: "20px",
          fontFamily: "'Inter'",
          color: checked ? "#003d9b" : "#434654",
          fontWeight: checked ? 600 : 400,
          transition: "all 0.15s",
        }}
      >
        {label}
      </span>
    </label>
  );
}

export default function FilterSidebar({ filters, onChange, mode = "lens" }: Props) {
  const activeCount =
    filters.brands.length +
    (mode === "lens" ? filters.usage.length + (filters.color !== "all" ? 1 : 0) : 0) +
    (mode === "accessories" ? filters.category.length : 0);

  const toggleBrand = (id: string) => {
    const arr = filters.brands;
    onChange({ ...filters, brands: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] });
  };

  const toggleLensType = (id: string) => {
    const arr = filters.lensTypes;
    onChange({ ...filters, lensTypes: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] });
  };

  const toggleUsage = (id: string) => {
    const arr = filters.usage;
    onChange({ ...filters, usage: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] });
  };

  const toggleCategory = (id: string) => {
    const arr = filters.category;
    onChange({ ...filters, category: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] });
  };

  const clearAll = () =>
    onChange({ brands: [], lensTypes: [], color: "all", usage: [], category: [], priceMin: 0, priceMax: 500, sortBy: "popular" });

  return (
    <aside
      className="hidden lg:flex flex-col gap-0 sticky top-24 h-fit w-64 overflow-hidden"
      style={{
        background: "#fff",
        border: "1.5px solid #e2e4ee",
        borderRadius: "18px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
      }}
    >
      {/* ── Üst bant: Filtrele başlığı ── */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          background: "linear-gradient(135deg, #f0f4ff 0%, #fefce8 100%)",
          borderBottom: "1.5px solid #e2e4ee",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "#dae2ff" }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "17px", color: "#003d9b", fontVariationSettings: "'FILL' 1" }}
            >
              tune
            </span>
          </div>
          <div>
            <p style={{ fontSize: "15px", fontWeight: 800, color: "#191c1e", fontFamily: "'Plus Jakarta Sans'", letterSpacing: "-0.01em" }}>
              Filtrele
            </p>
            <p style={{ fontSize: "11px", color: "#737685", fontFamily: "'Inter'" }}>
              Gözlerinize özel hassas uyum
            </p>
          </div>
        </div>

        {/* Aktif filtre badge */}
        {activeCount > 0 && (
          <span
            className="px-2.5 py-1 rounded-full"
            style={{ fontSize: "10px", fontWeight: 800, background: "#003d9b", color: "#fff", letterSpacing: "0.05em" }}
          >
            {activeCount}
          </span>
        )}
      </div>

      {/* ── Filtre grupları ── */}
      <div className="flex flex-col divide-y divide-[#f0f1f5]">

        {/* Marka */}
        <div className="px-4 py-5">
          <SectionLabel icon="sell" label="Marka" />
          <div className="flex flex-col gap-1">
            {(mode === "accessories" ? accessoryBrands : brands).map((b) => (
              <CheckRow
                key={b.id}
                checked={filters.brands.includes(b.id)}
                onChange={() => toggleBrand(b.id)}
                label={b.name}
              />
            ))}
          </div>
        </div>

        {mode === "lens" && (
          <>
            {/* Değişim Sıklığı */}
            <div className="px-4 py-5">
              <SectionLabel icon="schedule" label="Değişim Sıklığı" />
              <div className="flex flex-col gap-1">
                {DURATIONS.map((d) => (
                  <CheckRow
                    key={d.value}
                    checked={filters.usage.includes(d.value)}
                    onChange={() => toggleUsage(d.value)}
                    label={d.label}
                    icon={d.icon}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {mode === "accessories" && (
          /* Ürün Kategorisi */
          <div className="px-4 py-5">
            <SectionLabel icon="category" label="Ürün Kategorisi" />
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((c) => (
                <CheckRow
                  key={c.value}
                  checked={filters.category.includes(c.value)}
                  onChange={() => toggleCategory(c.value)}
                  label={c.label}
                  icon={c.icon}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Alt bant: Temizle butonu ── */}
      <div className="px-4 py-4" style={{ borderTop: "1.5px solid #e2e4ee", background: "#fafbff" }}>
        <button
          onClick={clearAll}
          disabled={activeCount === 0}
          className="w-full py-2.5 rounded-xl font-bold transition-all duration-200"
          style={{
            fontSize: "12.5px",
            letterSpacing: "0.04em",
            fontFamily: "'Inter'",
            background: activeCount > 0 ? "#f0f4ff" : "#f3f4f6",
            color: activeCount > 0 ? "#003d9b" : "#9ea3b5",
            border: activeCount > 0 ? "1.5px solid #c8d6f7" : "1.5px solid #e2e4ee",
            cursor: activeCount > 0 ? "pointer" : "not-allowed",
          }}
        >
          {activeCount > 0 ? `${activeCount} Filtreyi Temizle` : "Filtre Seçilmedi"}
        </button>
      </div>
    </aside>
  );
}
