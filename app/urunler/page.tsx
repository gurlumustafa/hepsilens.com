"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { lenses, accessories, Lens, Accessory } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import FilterSidebar, { Filters } from "@/components/FilterSidebar";

const ITEMS_PER_PAGE = 9;

const defaultFilters: Filters = {
  brands: [],
  lensTypes: [],
  color: "all",
  usage: [],
  category: [],
  priceMin: 0,
  priceMax: 500,
  sortBy: "popular",
};

const SORT_OPTIONS = [
  { value: "popular", label: "Popülerliğe Göre" },
  { value: "price-asc", label: "Fiyat: Düşükten Yükseğe" },
  { value: "price-desc", label: "Fiyat: Yüksekten Düşüğe" },
  { value: "rating", label: "En Çok Beğenilen" },
];

/*
 * Ürünler Sayfası
 * URL parametreleri: ?tur=gunluk|aylik|toric  ?renk=renkli|seffaf  ?recete=gerekli|serbest
 */
function UrunlerContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => {
    const base = { ...defaultFilters };
    const tur    = searchParams.get("tur");
    const recete = searchParams.get("recete");
    const renk   = searchParams.get("renk");
    if (tur === "gunluk")        base.usage = ["daily"];
    else if (tur === "aylik")    base.usage = ["monthly"];
    if (tur === "toric")         base.lensTypes = ["toric"];
    if (renk === "renkli")       base.color = "colored";
    else if (renk === "seffaf")  base.color = "clear";
    if (recete === "gerekli")    { /* requiresPrescription filter handled below */ }
    return base;
  });
  const [page, setPage] = useState(1);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tip = searchParams.get("tip");
  const isDigerUrunler = tip === "diger";
  const isAllLenses    = tip === "tum";

  const requiresPrescription = searchParams.get("recete") === "gerekli"
    ? true
    : searchParams.get("recete") === "serbest"
    ? false
    : null;

  const filtered = useMemo(() => {
    // Sayfa moduna göre başlangıç listesi
    let list: (Lens | Accessory)[] = isDigerUrunler
      ? [...accessories]
      : isAllLenses
      ? [...lenses]
      : [...lenses, ...accessories];

    if (filters.brands.length) {
      list = list.filter((l) => {
        if (!("brandId" in l)) return false;
        const bId = (l as { brandId?: string }).brandId;
        if (!bId) return false;
        // Aksesuar modunda: doğrudan brandId eşleşmesi
        if (isDigerUrunler) return filters.brands.includes(bId);
        // Lens modunda: markanın alt markaları da dahil
        if (filters.brands.includes(bId)) return true;
        if (filters.brands.includes("johnson") && bId === "acuvue") return true;
        if (filters.brands.includes("alcon") && ["dailies", "freshlook", "airoptix"].includes(bId)) return true;
        if (filters.brands.includes("cooper") && bId === "biofinity") return true;
        return false;
      });
    }

    // Aksesuar modunda: kategori filtresi (solüsyon / göz damlası)
    if (isDigerUrunler) {
      if (filters.category.length > 0) {
        list = list.filter((l) => "category" in l && filters.category.includes((l as Accessory).category));
      }
    } else {
      // Lens moduna özgü filtreler
      if (filters.lensTypes.length > 0) {
        list = list.filter((l) => {
          if (!("color" in l)) return false;
          if (filters.lensTypes.includes("saydam") && l.color === "clear") return true;
          if (filters.lensTypes.includes("renkli") && l.color === "colored") return true;
          if (filters.lensTypes.includes("toric") && (l.name.toLowerCase().includes("toric") || l.name.toLowerCase().includes("astigmat") || (l as Lens).tags?.includes("astigmat uyumlu"))) return true;
          if (filters.lensTypes.includes("multifocal") && (l.name.toLowerCase().includes("multifocal") || l.name.toLowerCase().includes("presbyopia"))) return true;
          if (filters.lensTypes.includes("indirimli") && l.originalPrice) return true;
          return false;
        });
      }

      if (filters.color !== "all") {
        list = list.filter((l) => "color" in l && l.color === filters.color);
      }

      if (filters.usage.length > 0) {
        list = list.filter((l) => "usagePeriod" in l && filters.usage.includes((l as Lens).usagePeriod));
      }

      if (requiresPrescription !== null) {
        list = list.filter((l) => "requiresPrescription" in l && (l as Lens).requiresPrescription === requiresPrescription);
      }
    }

    list = list.filter((l) => l.price >= filters.priceMin && l.price <= filters.priceMax);

    if (filters.sortBy === "price-asc")       list.sort((a, b) => a.price - b.price);
    else if (filters.sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (filters.sortBy === "rating")     list.sort((a, b) => b.rating - a.rating);
    else                                      list.sort((a, b) => b.reviewCount - a.reviewCount);

    return list;
  }, [filters, requiresPrescription, isDigerUrunler, isAllLenses]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleFilterChange = (f: Filters) => { setFilters(f); setPage(1); };

  const pageTitle =
    isDigerUrunler ? "Diğer Ürünler" :
    isAllLenses    ? "Tüm Lensler" :
    filters.usage.includes("daily")   && filters.usage.length === 1 ? "Günlük Kontakt Lensler" :
    filters.usage.includes("monthly") && filters.usage.length === 1 ? "Aylık Kontakt Lensler"  :
    filters.color === "colored"  ? "Renkli Kontakt Lensler" :
    filters.color === "clear"    ? "Saydam Kontakt Lensler"  :
    requiresPrescription === true  ? "Numaralı Lensler" :
    requiresPrescription === false ? "Kozmetik Lensler" :
    "Tüm Lensler";

  return (
    <main className="pt-[72px] pb-12">
      <div className="max-w-[1280px] mx-auto px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 py-5">
          <Link
            href="/"
            className="text-[#737685] hover:text-[#003d9b] transition-colors duration-200 group flex items-center gap-1"
            style={{ fontSize: "13px", fontWeight: 600 }}
          >
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform" style={{ fontSize: "16px" }}>home</span>
            Anasayfa
          </Link>
          <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "16px" }}>chevron_right</span>
          <span className="text-[#003d9b]" style={{ fontSize: "13px", fontWeight: 600 }}>{pageTitle}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtre Kenar Çubuğu */}
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            mode={isDigerUrunler ? "accessories" : "lens"}
          />

          {/* Ürün Izgarası */}
          <div className="flex-1">
            {/* Başlık + Sıralama */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1
                  className="text-[#191c1e]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "28px", lineHeight: "36px", fontWeight: 700 }}
                >
                  {pageTitle}
                </h1>
                <p className="text-[#737685] mt-1" style={{ fontSize: "14px" }}>
                  {filtered.length} ürün bulundu
                </p>
              </div>
              <div className="relative group" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className={`flex items-center justify-between w-full sm:w-[240px] bg-white border-2 rounded-xl px-4 py-2.5 transition-all duration-300 shadow-sm hover:shadow-md outline-none
                    ${isSortOpen ? "border-[#003d9b] ring-4 ring-[#003d9b]/10" : "border-[#e2e4ee] hover:border-[#c8d6f7]"}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#737685] transition-colors duration-300 group-hover:text-[#003d9b]" style={{ fontSize: "18px" }}>sort</span>
                    <span style={{ fontSize: "13.5px", fontWeight: 600, fontFamily: "'Inter'", color: "#191c1e" }}>
                      {SORT_OPTIONS.find(opt => opt.value === filters.sortBy)?.label || "Popülerliğe Göre"}
                    </span>
                  </div>
                  <span 
                    className={`material-symbols-outlined text-[#737685] transition-transform duration-300 group-hover:text-[#003d9b] ${isSortOpen ? "rotate-180" : ""}`} 
                    style={{ fontSize: "20px" }}
                  >
                    expand_more
                  </span>
                </button>
                
                {/* Dropdown menü */}
                <div 
                  className={`absolute top-[calc(100%+8px)] right-0 w-full sm:w-[240px] bg-white border border-[#e2e4ee] rounded-xl shadow-lg overflow-hidden transition-all duration-200 z-50 origin-top
                    ${isSortOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"}`}
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleFilterChange({ ...filters, sortBy: option.value as Filters["sortBy"] });
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 transition-colors duration-150 flex items-center justify-between
                        ${filters.sortBy === option.value ? "bg-[#f0f4ff] text-[#003d9b]" : "hover:bg-[#f8f9fb] text-[#434654]"}`}
                      style={{ fontSize: "13px", fontWeight: filters.sortBy === option.value ? 700 : 500, fontFamily: "'Inter'" }}
                    >
                      {option.label}
                      {filters.sortBy === option.value && (
                        <span className="material-symbols-outlined" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>check</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Izgara */}
            {paginated.length === 0 ? (
              <div className="text-center py-24 text-[#737685]">
                <span className="material-symbols-outlined" style={{ fontSize: "64px", color: "#c3c6d6" }}>search_off</span>
                <p className="text-xl font-bold mt-4 text-[#191c1e]">Ürün bulunamadı</p>
                <p className="mt-2" style={{ fontSize: "14px" }}>Filtrelerinizi değiştirmeyi deneyin</p>
                <button
                  onClick={() => handleFilterChange(defaultFilters)}
                  className="mt-6 px-6 py-3 bg-[#003d9b] text-white rounded-[0.5rem] font-bold hover:bg-[#0052cc] hover:scale-105 transition-all duration-200"
                  style={{ fontSize: "13px" }}
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginated.map((lens) => (
                  <ProductCard key={lens.id} lens={lens} variant="grid" />
                ))}
              </div>
            )}

            {/* Sayfalama */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-[0.5rem] border border-[#c3c6d6] hover:bg-[#003d9b] hover:text-white hover:border-[#003d9b] transition-all duration-200 text-[#434654] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-10 h-10 flex items-center justify-center rounded-[0.5rem] font-bold transition-all duration-200 hover:scale-105"
                    style={{
                      background: p === page ? "#003d9b" : "transparent",
                      color:      p === page ? "#ffffff" : "#434654",
                      border:     p === page ? "none"    : "1px solid #c3c6d6",
                    }}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-[0.5rem] border border-[#c3c6d6] hover:bg-[#003d9b] hover:text-white hover:border-[#003d9b] transition-all duration-200 text-[#434654] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function UrunlerPage() {
  return (
    <Suspense fallback={
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="text-[#737685]">Yükleniyor...</div>
      </div>
    }>
      <UrunlerContent />
    </Suspense>
  );
}
