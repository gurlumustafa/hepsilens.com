"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { lenses, accessories, Lens, Accessory } from "@/lib/data";

const navLinks = [
  { href: "/urunler", label: "Tüm Ürünler" },
  { href: "/urunler?tip=tum", label: "Tüm Lensler" },
  { href: "/urunler?recete=gerekli", label: "Numaralı Lensler" },
  { href: "/urunler?recete=serbest", label: "Numarasız Lensler" },
];

const blogDropdown = [
  { href: "/blog/lens-bakimi", label: "Lens Bakımı", icon: "water_drop" },
  { href: "/blog/goz-sagligi", label: "Göz Sağlığı", icon: "favorite" },
  { href: "/blog/urun-incelemeleri", label: "Ürün İncelemeleri", icon: "star" },
  { href: "/blog/ipuclari", label: "İpuçları & Rehber", icon: "lightbulb" },
];

const allProducts: (Lens | Accessory)[] = [...lenses, ...accessories];

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[#dae2ff] text-[#003d9b] rounded-sm px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [blogOpen, setBlogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(3);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const blogRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // En yakın 3 sonuç
  const results = useCallback((): (Lens | Accessory)[] => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];
    return allProducts
      .filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
      .slice(0, 3);
  }, [query])();

  // Dışarı tıklanınca kapat
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (blogRef.current && !blogRef.current.contains(e.target as Node)) setBlogOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ESC ile kapat
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setSearchOpen(false); setQuery(""); }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function handleSelect(id: number) {
    setQuery("");
    setSearchOpen(false);
    router.push(`/urun/${id}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    router.push(`/urunler?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-[#c3c6d6] shadow-sm" style={{ height: "72px" }}>
      <div className="flex justify-between items-center px-6 h-full max-w-[1280px] mx-auto gap-4">

        {/* ── Marka & Navigasyon ── */}
        <div className="flex items-center gap-5 min-w-0">
          <Link href="/" className="flex-shrink-0 group">
            <span
              className="font-bold text-[#003d9b] group-hover:text-[#0052cc] transition-colors duration-200"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "26px", lineHeight: "32px" }}
            >
              Hepsilens
            </span>
          </Link>

          <nav className="hidden lg:flex items-center">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="relative px-3 py-2 text-[#434654] hover:text-[#003d9b] transition-colors duration-200 group whitespace-nowrap"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600 }}
              >
                {l.label}
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#003d9b] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
              </Link>
            ))}

            {/* Blog Dropdown */}
            <div className="relative" ref={blogRef} onMouseEnter={() => setBlogOpen(true)} onMouseLeave={() => setBlogOpen(false)}>
              <button
                onClick={() => setBlogOpen((o) => !o)}
                className="relative px-3 py-2 text-[#434654] hover:text-[#003d9b] transition-colors duration-200 flex items-center gap-0.5 group whitespace-nowrap"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 600 }}
              >
                Blog
                <span
                  className="material-symbols-outlined transition-transform duration-200"
                  style={{ fontSize: "16px", transform: blogOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  expand_more
                </span>
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#003d9b] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
              </button>

              {blogOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-[#c3c6d6] rounded-[0.5rem] shadow-2xl py-2 min-w-[210px] z-50 animate-fade-slide">
                  {blogDropdown.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-3 px-4 py-2.5 text-[#434654] hover:bg-[#f3f4f6] hover:text-[#003d9b] transition-all duration-150 group/item"
                      style={{ fontSize: "13px", fontWeight: 500 }}
                      onClick={() => setBlogOpen(false)}
                    >
                      <span className="material-symbols-outlined text-[#003d9b] group-hover/item:scale-110 transition-transform" style={{ fontSize: "18px" }}>
                        {l.icon}
                      </span>
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* ── Arama & Eylemler ── */}
        <div className="flex items-center gap-1.5 flex-shrink-0">

          {/* ── Canlı Arama ── */}
          <div className="relative hidden md:block" ref={searchRef}>
            <form onSubmit={handleSubmit}>
              <div
                className="flex items-center bg-[#f3f4f6] px-4 py-2 rounded-[0.75rem] border transition-all duration-200 group mr-5"
                style={{
                  borderColor: searchOpen ? "#003d9b" : "#c3c6d6",
                  boxShadow: searchOpen ? "0 0 0 3px rgba(0,61,155,0.12)" : "none",
                }}
              >
                <span
                  className="material-symbols-outlined mr-1.5 transition-colors duration-200"
                  style={{ fontSize: "18px", color: searchOpen ? "#003d9b" : "#737685" }}
                >
                  search
                </span>
                <input
                  ref={inputRef}
                  className="bg-transparent border-none outline-none text-[13px] w-36 xl:w-48 text-[#191c1e] placeholder-[#737685]"
                  placeholder="Lens ara..."
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  autoComplete="off"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => { setQuery(""); setSearchOpen(false); inputRef.current?.focus(); }}
                    className="text-[#737685] hover:text-[#191c1e] transition-colors ml-1 shrink-0"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
                  </button>
                )}
              </div>
            </form>

            {/* Sonuçlar */}
            {searchOpen && query.trim().length > 0 && (
              <div
                className="absolute top-full mt-2 right-0 bg-white border border-[#c3c6d6] rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-slide"
                style={{ width: "340px" }}
              >
                {results.length === 0 ? (
                  <div className="flex items-center gap-3 px-4 py-5 text-[#737685]">
                    <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>search_off</span>
                    <p style={{ fontSize: "13px" }}>
                      &ldquo;<strong className="text-[#191c1e]">{query}</strong>&rdquo; için sonuç bulunamadı
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="px-4 pt-3 pb-1.5 text-[#737685] uppercase" style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em" }}>
                      En İyi Eşleşmeler
                    </p>
                    {results.map((product) => {
                      const discount = product.originalPrice
                        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                        : 0;
                      return (
                        <button
                          key={product.id}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f5f6fc] transition-colors text-left group/item border-t border-[#f0f1f5] first:border-0"
                          onClick={() => handleSelect(product.id)}
                        >
                          {/* Küçük ürün görseli */}
                          <div className="w-12 h-12 rounded-lg bg-[#f4f5f9] flex items-center justify-center shrink-0 overflow-hidden border border-[#edeef3]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={product.imageUrl || "/placeholder-lens.jpg"}
                              alt={product.name}
                              className="w-10 h-10 object-contain mix-blend-multiply"
                            />
                          </div>
                          {/* Bilgiler */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[#737685] uppercase truncate" style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.06em" }}>
                              {product.brand}
                            </p>
                            <p className="text-[#191c1e] font-semibold truncate group-hover/item:text-[#003d9b] transition-colors" style={{ fontSize: "13px" }}>
                              {highlight(product.name, query)}
                            </p>
                          </div>
                          {/* Fiyat */}
                          <div className="text-right shrink-0">
                            <p className="text-[#003d9b] font-bold" style={{ fontSize: "13px", fontFamily: "'Plus Jakarta Sans'" }}>
                              {product.price.toLocaleString("tr-TR")} ₺
                            </p>
                            {discount > 0 && (
                              <p className="text-[#8c4a00]" style={{ fontSize: "10px", fontWeight: 600 }}>-%{discount}</p>
                            )}
                          </div>
                        </button>
                      );
                    })}

                    {/* Tümünü gör */}
                    <button
                      className="w-full flex items-center justify-center gap-1.5 py-3 text-[#003d9b] hover:bg-[#f0f4ff] transition-colors border-t border-[#edeef3] font-semibold"
                      style={{ fontSize: "12px", letterSpacing: "0.04em" }}
                      onClick={() => {
                        setSearchOpen(false);
                        router.push(`/urunler?q=${encodeURIComponent(query.trim())}`);
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>search</span>
                      &ldquo;{query}&rdquo; için tüm sonuçları gör
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Hesap */}
          <button className="p-4 rounded-[0.5rem] text-[#434654] hover:text-[#003d9b] hover:bg-[#f3f4f6] transition-all duration-200 hover:scale-110 group">
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform duration-200 block" style={{ fontSize: "22px" }}>
              person
            </span>
          </button>

          {/* Sepet */}
          <button className="relative p-4 rounded-[0.5rem] text-[#434654] hover:text-[#003d9b] hover:bg-[#f3f4f6] transition-all duration-200 hover:scale-110 group">
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform duration-200 block" style={{ fontSize: "22px" }}>
              shopping_cart
            </span>
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-[#6a3600] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold leading-none">
                {cartCount}
              </span>
            )}
          </button>

          {/* Sipariş Takibi */}
          <Link
            href="/siparis-takibi"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-2 rounded-[0.5rem] text-[#434654] hover:text-[#003d9b] hover:bg-[#f3f4f6] transition-all duration-200 group hover:scale-105"
            style={{ fontSize: "11px", fontWeight: 600 }}
          >
            <span className="material-symbols-outlined group-hover:scale-110 transition-transform duration-200" style={{ fontSize: "20px" }}>
              local_shipping
            </span>
            <span className="hidden xl:block whitespace-nowrap">Sipariş Takibi</span>
          </Link>

          {/* Mobil Hamburger */}
          <button
            className="lg:hidden p-2 rounded-[0.5rem] text-[#434654] hover:text-[#003d9b] hover:bg-[#f3f4f6] transition-all duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobil Menü */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-[#c3c6d6] px-6 py-4 space-y-1 shadow-lg animate-fade-slide">
          {/* Mobil Arama */}
          <form onSubmit={handleSubmit} className="mb-3">
            <div className="flex items-center bg-[#f3f4f6] px-4 py-2.5 rounded-xl border border-[#c3c6d6] focus-within:border-[#003d9b] transition-colors">
              <span className="material-symbols-outlined text-[#737685] mr-2" style={{ fontSize: "18px" }}>search</span>
              <input
                className="bg-transparent border-none outline-none text-[13px] flex-1 text-[#191c1e] placeholder-[#737685]"
                placeholder="Lens ara..."
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </form>

          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center px-3 py-2.5 text-[#434654] hover:text-[#003d9b] hover:bg-[#f3f4f6] rounded-[0.5rem] transition-all duration-150"
              style={{ fontSize: "14px", fontWeight: 600 }}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="border-t border-[#c3c6d6] pt-2 mt-2">
            <p className="px-3 pb-1 text-[#737685] uppercase" style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em" }}>Blog</p>
            {blogDropdown.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-2 px-3 py-2 text-[#434654] hover:text-[#003d9b] hover:bg-[#f3f4f6] rounded-[0.5rem] transition-all duration-150"
                style={{ fontSize: "13px" }}
                onClick={() => setMenuOpen(false)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
