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
            className="transition-colors duration-200 group flex items-center gap-1 hover:text-[color:var(--ds-primary)]"
            style={{ fontSize: "13px", fontWeight: 600, color: "var(--ds-text-3)" }}
          >
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform" style={{ fontSize: "16px" }}>home</span>
            Anasayfa
          </Link>
          <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--ds-border)" }}>chevron_right</span>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ds-primary)" }}>{pageTitle}</span>
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
                  className="truncate text-[20px] lg:text-[28px]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: "1.3", fontWeight: 700, color: "var(--ds-text-1)" }}
                >
                  {pageTitle}
                </h1>
                <p className="mt-0.5" style={{ fontSize: "13px", color: "var(--ds-text-3)" }}>
                  {filtered.length} ürün bulundu
                </p>
              </div>
              <div className="relative shrink-0" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 lg:px-4 lg:py-2.5 transition-all duration-300 shadow-sm hover:shadow-md outline-none border-2
                    ${isSortOpen
                      ? "border-[color:var(--ds-primary)] ring-4 ring-[color:var(--ds-primary)]/10"
                      : "hover:border-[color:var(--ds-border)]"}`}
                  style={{ background: "var(--ds-surface)", borderColor: isSortOpen ? "var(--ds-primary)" : "var(--ds-border-subtle)" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "17px", color: "var(--ds-text-3)" }}>sort</span>
                  <span className="hidden sm:inline" style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'Inter'", color: "var(--ds-text-1)" }}>
                    {SORT_OPTIONS.find(opt => opt.value === filters.sortBy)?.label || "Sırala"}
                  </span>
                  <span className="sm:hidden" style={{ fontSize: "12px", fontWeight: 600, fontFamily: "'Inter'", color: "var(--ds-text-1)" }}>Sırala</span>
                  <span className={`material-symbols-outlined transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} style={{ fontSize: "18px", color: "var(--ds-text-3)" }}>
                    expand_more
                  </span>
                </button>

                {/* Dropdown menü */}
                <div
                  className={`absolute top-[calc(100%+6px)] right-0 w-[200px] lg:w-[240px] rounded-xl shadow-lg overflow-hidden transition-all duration-200 z-50 origin-top border
                    ${isSortOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"}`}
                  style={{ background: "var(--ds-surface)", borderColor: "var(--ds-border-subtle)" }}
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleFilterChange({ ...filters, sortBy: option.value as Filters["sortBy"] });
                        setIsSortOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 transition-colors duration-150 flex items-center justify-between"
                      style={{
                        fontSize: "13px",
                        fontWeight: filters.sortBy === option.value ? 700 : 500,
                        fontFamily: "'Inter'",
                        background: filters.sortBy === option.value ? "var(--ds-primary-hover)" : "transparent",
                        color: filters.sortBy === option.value ? "var(--ds-primary)" : "var(--ds-text-2)",
                      }}
                      onMouseEnter={(e) => {
                        if (filters.sortBy !== option.value) {
                          (e.currentTarget as HTMLButtonElement).style.background = "var(--ds-surface-2)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (filters.sortBy !== option.value) {
                          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        }
                      }}
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
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold transition-colors border"
                style={{ fontSize: "13px", fontFamily: "'Inter'", background: "var(--ds-surface)", borderColor: "var(--ds-border-subtle)", color: "var(--ds-text-1)" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "17px", color: "var(--ds-primary)", fontVariationSettings: "'FILL' 1" }}>tune</span>
                Filtrele
                {(filters.brands.length + (isDigerUrunler ? filters.category.length : filters.usage.length + (filters.color !== "all" ? 1 : 0))) > 0 && (
                  <span className="bg-[color:var(--ds-primary)] text-white rounded-full leading-5 px-1.5 text-[10px] font-bold">
                    {filters.brands.length + (isDigerUrunler ? filters.category.length : filters.usage.length + (filters.color !== "all" ? 1 : 0))}
                  </span>
                )}
              </button>
            </div>

            {/* Izgara */}
            {paginated.length === 0 ? (
              <div className="text-center py-24" style={{ color: "var(--ds-text-3)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "64px", color: "var(--ds-border)" }}>search_off</span>
                <p className="text-xl font-bold mt-4" style={{ color: "var(--ds-text-1)" }}>Ürün bulunamadı</p>
                <p className="mt-2" style={{ fontSize: "14px" }}>Filtrelerinizi değiştirmeyi deneyin</p>
                <button
                  onClick={() => handleFilterChange(defaultFilters)}
                  className="mt-6 px-6 py-3 rounded-[0.5rem] font-bold text-white hover:opacity-90 hover:scale-105 transition-all duration-200"
                  style={{ background: "var(--ds-primary)", fontSize: "13px" }}
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
                  className="w-10 h-10 flex items-center justify-center rounded-[0.5rem] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 border hover:bg-[color:var(--ds-primary)] hover:text-white hover:border-[color:var(--ds-primary)]"
                  style={{ borderColor: "var(--ds-border)", color: "var(--ds-text-2)" }}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-10 h-10 flex items-center justify-center rounded-[0.5rem] font-bold transition-all duration-200 hover:scale-105"
                    style={{
                      background: p === page ? "var(--ds-primary)" : "transparent",
                      color:      p === page ? "#ffffff" : "var(--ds-text-2)",
                      border:     p === page ? "none"    : `1px solid var(--ds-border)`,
                    }}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-[0.5rem] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 border hover:bg-[color:var(--ds-primary)] hover:text-white hover:border-[color:var(--ds-primary)]"
                  style={{ borderColor: "var(--ds-border)", color: "var(--ds-text-2)" }}
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
        <div style={{ color: "var(--ds-text-3)" }}>Yükleniyor...</div>
      </div>
    }>
      <UrunlerContent />
    </Suspense>
  );
}
