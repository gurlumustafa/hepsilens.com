"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Lens, Accessory, Product } from "@/lib/data";
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
  priceMax: 9999,
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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    setLoadingProducts(true);
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setAllProducts(d.products || []))
      .catch(console.error)
      .finally(() => setLoadingProducts(false));
  }, []);

  const [filters, setFilters] = useState<Filters>(() => {
    const base = { ...defaultFilters };
    const tur    = searchParams.get("tur");
    const renk   = searchParams.get("renk");
    if (tur === "gunluk")        base.usage = ["daily"];
    else if (tur === "haftalik") base.usage = ["biweekly"];
    else if (tur === "aylik")    base.usage = ["monthly"];
    if (tur === "toric")         base.lensTypes = ["toric"];
    if (renk === "renkli")       base.color = "colored";
    else if (renk === "seffaf")  base.color = "clear";
    return base;
  });
  const [page, setPage] = useState(1);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
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

  // Reçete filtresi devre dışı
  const requiresPrescription: boolean | null = null;

  const filtered = useMemo(() => {
    // Sayfa moduna göre başlangıç listesi
    let list: Product[] = isDigerUrunler
      ? allProducts.filter((p) => p.product_type === "accessory")
      : isAllLenses
      ? allProducts.filter((p) => p.product_type === "lens")  // ?tip=tum → sadece lensler (Kozmetik Lensler)
      : [...allProducts];                                       // varsayılan → tüm ürünler (lens + aksesuar)

    if (filters.brands.length) {
      list = list.filter((l) => {
        const bId = l.brand_id;
        if (!bId) return false;
        // Aksesuar modunda: doğrudan brand_id eşleşmesi
        if (isDigerUrunler) return filters.brands.includes(bId);
        // Lens modunda: markanın alt markaları da dahil
        if (filters.brands.includes(bId)) return true;
        if (filters.brands.includes("johnson") && bId === "acuvue") return true;
        if (filters.brands.includes("alcon")    && ["dailies", "freshlook", "airoptix"].includes(bId)) return true;
        if (filters.brands.includes("freshlook") && ["alcon", "dailies", "airoptix"].includes(bId)) return true;
        if (filters.brands.includes("cooper") && bId === "biofinity") return true;
        return false;
      });
    }

    // Aksesuar modunda: kategori filtresi (solüsyon / göz damlası)
    if (isDigerUrunler) {
      if (filters.category.length > 0) {
        list = list.filter((l) => l.product_type === "accessory" && filters.category.includes(l.accessory_category));
      }
    } else {
      // Lens moduna özgü filtreler
      if (filters.lensTypes.length > 0) {
        list = list.filter((l) => {
          if (l.product_type !== "lens") return false;
          if (filters.lensTypes.includes("saydam") && l.color === "clear") return true;
          if (filters.lensTypes.includes("renkli") && l.color === "colored") return true;
          if (filters.lensTypes.includes("toric") && (l.name.toLowerCase().includes("toric") || l.name.toLowerCase().includes("astigmat") || l.tags?.includes("astigmat uyumlu"))) return true;
          if (filters.lensTypes.includes("multifocal") && (l.name.toLowerCase().includes("multifocal") || l.name.toLowerCase().includes("presbyopia"))) return true;
          if (filters.lensTypes.includes("indirimli") && l.original_price) return true;
          return false;
        });
      }

      if (filters.color !== "all") {
        list = list.filter((l) => l.product_type === "lens" && l.color === filters.color);
      }

      if (filters.usage.length > 0) {
        list = list.filter((l) => l.product_type === "lens" && filters.usage.includes(l.usage_period));
      }

      if (requiresPrescription !== null) {
        list = list.filter((l) => l.product_type === "lens" && l.requires_prescription === requiresPrescription);
      }
    }

    list = list.filter((l) => l.price >= filters.priceMin && l.price <= filters.priceMax);

    if (filters.sortBy === "price-asc")       list.sort((a, b) => a.price - b.price);
    else if (filters.sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (filters.sortBy === "rating")     list.sort((a, b) => b.rating - a.rating);
    else                                      list.sort((a, b) => b.review_count - a.review_count);

    return list;
  }, [allProducts, filters, requiresPrescription, isDigerUrunler, isAllLenses]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleFilterChange = (f: Filters) => { setFilters(f); setPage(1); };

  const pageTitle =
    isDigerUrunler ? "Diğer Ürünler" :
    isAllLenses    ? "Kozmetik Lensler" :
    filters.usage.includes("daily")      && filters.usage.length === 1 ? "Günlük Kontakt Lensler"   :
    filters.usage.includes("biweekly")   && filters.usage.length === 1 ? "Haftalık Kontakt Lensler" :
    filters.usage.includes("monthly")    && filters.usage.length === 1 ? "Aylık Kontakt Lensler"    :
    filters.color === "colored"  ? "Renkli Kontakt Lensler" :
    filters.color === "clear"    ? "Saydam Kontakt Lensler"  :
    "Tüm Ürünler";

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
            mobileOpen={mobileFilterOpen}
            onMobileClose={() => setMobileFilterOpen(false)}
          />

          {/* Ürün Izgarası */}
          <div className="flex-1">
            {/* Başlık + Sıralama (her ekranda tek satır) */}
            <div className="flex items-start justify-between gap-2 mb-6 lg:mb-8">
              <div className="flex-1 min-w-0">
                <h1
                  className="text-[#191c1e] truncate text-[20px] lg:text-[28px]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: "1.3", fontWeight: 700 }}
                >
                  {pageTitle}
                </h1>
                <p className="text-[#737685] mt-0.5" style={{ fontSize: "13px" }}>
                  {filtered.length} ürün bulundu
                </p>
              </div>
              <div className="relative shrink-0" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className={`flex items-center gap-1.5 bg-white border-2 rounded-xl px-3 py-2 lg:px-4 lg:py-2.5 transition-all duration-300 shadow-sm hover:shadow-md outline-none
                    ${isSortOpen ? "border-[#003d9b] ring-4 ring-[#003d9b]/10" : "border-[#e2e4ee] hover:border-[#c8d6f7]"}`}
                >
                  <span className="material-symbols-outlined text-[#737685]" style={{ fontSize: "17px" }}>sort</span>
                  <span className="hidden sm:inline text-[#191c1e]" style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'Inter'" }}>
                    {SORT_OPTIONS.find(opt => opt.value === filters.sortBy)?.label || "Sırala"}
                  </span>
                  <span className="sm:hidden text-[#191c1e]" style={{ fontSize: "12px", fontWeight: 600, fontFamily: "'Inter'" }}>Sırala</span>
                  <span className={`material-symbols-outlined text-[#737685] transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} style={{ fontSize: "18px" }}>
                    expand_more
                  </span>
                </button>

                {/* Dropdown menü */}
                <div
                  className={`absolute top-[calc(100%+6px)] right-0 w-[200px] lg:w-[240px] bg-white border border-[#e2e4ee] rounded-xl shadow-lg overflow-hidden transition-all duration-200 z-50 origin-top
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

            {/* Mobil filtre butonu */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-[#e2e4ee] rounded-xl text-[#191c1e] font-semibold hover:border-[#003d9b] transition-colors"
                style={{ fontSize: "13px", fontFamily: "'Inter'" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "17px", color: "#003d9b", fontVariationSettings: "'FILL' 1" }}>tune</span>
                Filtrele
                {(filters.brands.length + (isDigerUrunler ? filters.category.length : filters.usage.length + (filters.color !== "all" ? 1 : 0))) > 0 && (
                  <span className="bg-[#003d9b] text-white rounded-full leading-5 px-1.5 text-[10px] font-bold">
                    {filters.brands.length + (isDigerUrunler ? filters.category.length : filters.usage.length + (filters.color !== "all" ? 1 : 0))}
                  </span>
                )}
              </button>
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
