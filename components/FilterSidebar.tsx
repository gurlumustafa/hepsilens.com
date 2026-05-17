"use client";
import { brands } from "@/lib/data";

export type Filters = {
  brands: string[];
  color: "all" | "clear" | "colored";
  usage: "all" | "daily" | "monthly" | "yearly";
  priceMin: number;
  priceMax: number;
  sortBy: "popular" | "price-asc" | "price-desc" | "rating";
};

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
};

const LENS_TYPES = [
  { value: "Spherical", label: "Sferik" },
  { value: "Toric", label: "Torik (Astigmat)" },
  { value: "Multifocal", label: "Multifokal" },
];

const DURATIONS = [
  { value: "daily", label: "Günlük" },
  { value: "monthly", label: "Aylık" },
  { value: "yearly", label: "Yıllık" },
];

export default function FilterSidebar({ filters, onChange }: Props) {
  const toggleBrand = (id: string) => {
    const arr = filters.brands;
    onChange({
      ...filters,
      brands: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
    });
  };

  return (
    <aside className="hidden lg:flex flex-col gap-2 p-4 sticky top-24 h-fit w-64 bg-[#f3f4f6] border-r border-[#c3c6d6] shadow-sm rounded-r-[0.5rem]">
      {/* Header */}
      <div className="mb-4">
        <h2
          className="text-[#003d9b]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", lineHeight: "28px", fontWeight: 600 }}
        >
          Filtrele
        </h2>
        <p className="text-[#434654]" style={{ fontSize: "12px", lineHeight: "16px", letterSpacing: "0.05em", fontWeight: 600, fontFamily: "'Inter'" }}>
          Gözlerinize özel hassas uyum
        </p>
      </div>

      <div className="space-y-6">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-2">
            <span className="material-symbols-outlined text-[18px]">sell</span>
            <span style={{ fontSize: "12px", lineHeight: "16px", letterSpacing: "0.05em", fontWeight: 600, fontFamily: "'Inter'" }}>Marka</span>
          </div>
          <div className="flex flex-col gap-1">
            {brands.map((b) => (
              <label
                key={b.id}
                className="flex items-center gap-3 px-3 py-2 hover:bg-[#e7e8ea] rounded-[0.5rem] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.brands.includes(b.id)}
                  onChange={() => toggleBrand(b.id)}
                  className="rounded border-[#c3c6d6] text-[#003d9b] focus:ring-[#003d9b]"
                />
                <span style={{ fontSize: "14px", lineHeight: "20px", fontFamily: "'Inter'" }}>{b.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Lens Type */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-2">
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span style={{ fontSize: "12px", lineHeight: "16px", letterSpacing: "0.05em", fontWeight: 600, fontFamily: "'Inter'" }}>Lens Tipi</span>
          </div>
          {LENS_TYPES.map((t, i) => (
            i === 0 ? (
              <div
                key={t.value}
                className="bg-[#50dcff] text-[#005f71] font-bold rounded-[0.5rem] px-3 py-2 mb-1 flex items-center justify-between"
                style={{ fontSize: "14px", fontFamily: "'Inter'" }}
              >
                <span>{t.label}</span>
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
            ) : (
              <div
                key={t.value}
                className="text-[#434654] hover:bg-[#e7e8ea] rounded-[0.5rem] px-3 py-2 cursor-pointer"
                style={{ fontSize: "14px", fontFamily: "'Inter'" }}
              >
                {t.label}
              </div>
            )
          ))}
        </div>

        {/* Duration */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-2">
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            <span style={{ fontSize: "12px", lineHeight: "16px", letterSpacing: "0.05em", fontWeight: 600, fontFamily: "'Inter'" }}>Kullanım Süresi</span>
          </div>
          <div className="flex flex-wrap gap-2 px-2">
            {DURATIONS.map((d) => {
              const isActive = filters.usage === d.value;
              return (
                <button
                  key={d.value}
                  onClick={() => onChange({ ...filters, usage: isActive ? "all" : d.value as Filters["usage"] })}
                  className="px-3 py-1 rounded-full transition-colors"
                  style={{
                    border: `1px solid ${isActive ? "#003d9b" : "#c3c6d6"}`,
                    background: isActive ? "#003d9b" : "transparent",
                    color: isActive ? "#ffffff" : "inherit",
                    fontSize: "11px",
                    fontWeight: 600,
                    fontFamily: "'Inter'",
                    letterSpacing: "0.05em",
                  }}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-2">
            <span className="material-symbols-outlined text-[18px]">sort</span>
            <span style={{ fontSize: "12px", lineHeight: "16px", letterSpacing: "0.05em", fontWeight: 600, fontFamily: "'Inter'" }}>Sıralama</span>
          </div>
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value as Filters["sortBy"] })}
            className="bg-[#f3f4f6] border border-[#c3c6d6] rounded-[0.25rem] px-3 py-1 w-full"
            style={{ fontSize: "12px", fontFamily: "'Inter'" }}
          >
            <option value="popular">Popülerlik</option>
            <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
            <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
            <option value="rating">En Çok Beğenilen</option>
          </select>
        </div>
      </div>

      {/* Clear All */}
      <button
        onClick={() => onChange({ brands: [], color: "all", usage: "all", priceMin: 0, priceMax: 500, sortBy: "popular" })}
        className="mt-8 w-full py-3 border border-[#003d9b] text-[#003d9b] rounded-[0.5rem] hover:bg-[#003d9b]/5 transition-all duration-300"
        style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, fontFamily: "'Inter'" }}
      >
        Temizle
      </button>
    </aside>
  );
}
