"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { lenses } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import FilterSidebar, { Filters } from "@/components/FilterSidebar";

const ITEMS_PER_PAGE = 9;

const defaultFilters: Filters = {
  brands: [],
  color: "all",
  usage: "all",
  priceMin: 0,
  priceMax: 500,
  sortBy: "popular",
};

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
    if (tur === "gunluk")        base.usage = "daily";
    else if (tur === "aylik")    base.usage = "monthly";
    if (renk === "renkli")       base.color = "colored";
    else if (renk === "seffaf")  base.color = "clear";
    if (recete === "gerekli")    { /* requiresPrescription filter handled below */ }
    return base;
  });
  const [page, setPage] = useState(1);

  const requiresPrescription = searchParams.get("recete") === "gerekli"
    ? true
    : searchParams.get("recete") === "serbest"
    ? false
    : null;

  const filtered = useMemo(() => {
    let list = [...lenses];
    if (filters.brands.length) list = list.filter((l) => filters.brands.includes(l.brandId));
    if (filters.color !== "all") list = list.filter((l) => l.color === filters.color);
    if (filters.usage !== "all") list = list.filter((l) => l.usagePeriod === filters.usage);
    if (requiresPrescription !== null) list = list.filter((l) => l.requiresPrescription === requiresPrescription);
    list = list.filter((l) => l.price >= filters.priceMin && l.price <= filters.priceMax);
    if (filters.sortBy === "price-asc")  list.sort((a, b) => a.price - b.price);
    else if (filters.sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (filters.sortBy === "rating")     list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => b.reviewCount - a.reviewCount);
    return list;
  }, [filters, requiresPrescription]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleFilterChange = (f: Filters) => { setFilters(f); setPage(1); };

  const pageTitle =
    filters.usage === "daily"    ? "Günlük Kontakt Lensler" :
    filters.usage === "monthly"  ? "Aylık Kontakt Lensler"  :
    filters.color === "colored"  ? "Renkli Kontakt Lensler" :
    filters.color === "clear"    ? "Saydam Kontakt Lensler"  :
    "Tüm Kontakt Lensler";

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
          <FilterSidebar filters={filters} onChange={handleFilterChange} />

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
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value as Filters["sortBy"] })}
                className="bg-white border border-[#c3c6d6] rounded-[0.5rem] px-4 py-2.5 hover:border-[#003d9b] transition-colors duration-200 cursor-pointer"
                style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'Inter'" }}
              >
                <option value="popular">Popülerliğe Göre</option>
                <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                <option value="rating">En Çok Beğenilen</option>
              </select>
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
