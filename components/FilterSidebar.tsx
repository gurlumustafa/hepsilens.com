"use client";
import { brands } from "@/lib/data";

export type Filters = {
  brands: string[];
  lensTypes: string[];
  color: "all" | "clear" | "colored";
  usage: string[];
  priceMin: number;
  priceMax: number;
  sortBy: "popular" | "price-asc" | "price-desc" | "rating";
};

type Props = {
  filters: Filters;
  onChange: (f: Filters) => void;
};

const LENS_TYPES = [
  { value: "saydam", label: "Saydam Lens" },
  { value: "renkli", label: "Renkli Lens" },
  { value: "toric", label: "Toric (Astigmat) Lens" },
  { value: "multifocal", label: "Multifocal (Uzak-Yakın) Lens" },
  { value: "indirimli", label: "İndirimli Lens Setleri" },
];

const DURATIONS = [
  { value: "daily", label: "Günlük Kullan-At Lensler" },
  { value: "biweekly", label: "2 Haftalık Lensler" },
  { value: "monthly", label: "Aylık Lensler" },
];

export default function FilterSidebar({ filters, onChange }: Props) {
  const toggleBrand = (id: string) => {
    const arr = filters.brands;
    onChange({
      ...filters,
      brands: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
    });
  };

  const toggleLensType = (id: string) => {
    const arr = filters.lensTypes;
    onChange({
      ...filters,
      lensTypes: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
    });
  };

  const toggleUsage = (id: string) => {
    const arr = filters.usage;
    onChange({
      ...filters,
      usage: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
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
            <span style={{ fontSize: "12px", lineHeight: "16px", letterSpacing: "0.05em", fontWeight: 600, fontFamily: "'Inter'" }}>Lens Tipleri</span>
          </div>
          <div className="flex flex-col gap-1">
            {LENS_TYPES.map((t) => (
              <label
                key={t.value}
                className="flex items-center gap-3 px-3 py-2 hover:bg-[#e7e8ea] rounded-[0.5rem] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.lensTypes.includes(t.value)}
                  onChange={() => toggleLensType(t.value)}
                  className="rounded border-[#c3c6d6] text-[#003d9b] focus:ring-[#003d9b]"
                />
                <span style={{ fontSize: "14px", lineHeight: "20px", fontFamily: "'Inter'" }}>{t.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-2">
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            <span style={{ fontSize: "12px", lineHeight: "16px", letterSpacing: "0.05em", fontWeight: 600, fontFamily: "'Inter'" }}>Değişim Sıklığı</span>
          </div>
          <div className="flex flex-col gap-1">
            {DURATIONS.map((d) => (
              <label
                key={d.value}
                className="flex items-center gap-3 px-3 py-2 hover:bg-[#e7e8ea] rounded-[0.5rem] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.usage.includes(d.value)}
                  onChange={() => toggleUsage(d.value)}
                  className="rounded border-[#c3c6d6] text-[#003d9b] focus:ring-[#003d9b]"
                />
                <span style={{ fontSize: "14px", lineHeight: "20px", fontFamily: "'Inter'" }}>{d.label}</span>
              </label>
            ))}
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
        onClick={() => onChange({ brands: [], lensTypes: [], color: "all", usage: [], priceMin: 0, priceMax: 500, sortBy: "popular" })}
        className="mt-8 w-full py-3 border border-[#003d9b] text-[#003d9b] rounded-[0.5rem] hover:bg-[#003d9b]/5 transition-all duration-300"
        style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, fontFamily: "'Inter'" }}
      >
        Temizle
      </button>
    </aside>
  );
}
