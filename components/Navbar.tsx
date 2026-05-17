"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

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

export default function Navbar() {
  const [blogOpen, setBlogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(3);
  const blogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (blogRef.current && !blogRef.current.contains(e.target as Node)) {
        setBlogOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 bg-white border border-[#c3c6d6] rounded-[0.5rem] shadow-2xl py-2 min-w-[210px] z-50 animate-fade-slide"
                >
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
          {/* Arama */}
          <div className="hidden md:flex items-center bg-[#f3f4f6] px-5 py-2 rounded-[0.75rem] border border-[#c3c6d6] hover:border-[#003d9b] focus-within:border-[#003d9b] focus-within:ring-2 focus-within:ring-[#003d9b]/20 transition-all duration-200 group">
            <span className="material-symbols-outlined text-[#737685] group-focus-within:text-[#003d9b] transition-colors mr-1.5" style={{ fontSize: "18px" }}>
              search
            </span>
            <input
              className="bg-transparent border-none outline-none text-[13px] w-36 xl:w-44 text-[#191c1e] placeholder-[#737685]"
              placeholder="Lens ara..."
              type="text"
            />
          </div>

          {/* Hesap */}
          <button className="p-4 rounded-[0.5rem]  text-[#434654] hover:text-[#003d9b] hover:bg-[#f3f4f6] transition-all duration-200 hover:scale-110 group">
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
