import Link from "next/link";
import Logo from "@/components/Logo";

const siteBrands = ["Acuvue", "Dailies", "Biofinity", "FreshLook", "Air Optix", "Bausch + Lomb"];

const siteLinks = [
  {
    section: "Lensler", links: [
      { label: "Tüm Lensler", href: "/urunler" },
      { label: "Kozmetik Lensler", href: "/urunler?tip=tum" },
      { label: "Renkli Lensler", href: "/urunler?renk=renkli" },
      { label: "Günlük Lensler", href: "/urunler?tur=gunluk" },
      { label: "Toric Lensler", href: "/urunler?tur=toric" },
    ]
  },
  {
    section: "Müşteri Hizmetleri", links: [
      { label: "SSS", href: "/yardim/sss" },
      { label: "Kargo Politikası", href: "/yardim/kargo" },
      { label: "İade & Değişim", href: "/yardim/iade" },
      { label: "Sipariş Takibi", href: "/siparis-takip" },
    ]
  },
  {
    section: "Kurumsal", links: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "Lens Bakımı", href: "/blog/lens-bakimi" },
      { label: "Göz Sağlığı", href: "/blog/goz-sagligi" },
      { label: "Ürün İncelemeleri", href: "/blog/urun-incelemeleri" },
      { label: "İpuçları & Rehber", href: "/blog/ipuclari" },
    ]
  },
  {
    section: "Yasal", links: [
      { label: "Gizlilik Politikası", href: "/gizlilik" },
      { label: "KVKK Aydınlatma Metni", href: "/kvkk" },
      { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
      { label: "Çerez Politikası", href: "/cerez-politikasi" },
      { label: "Mesafeli Satış Sözleşmesi", href: "/mesafeli-satis" },
    ]
  },
];

/* ── section: footer ── */
export default function Footer() {
  return (
    <footer id="footer" className="bg-[#191c1e] text-white mt-0">
      <div className="max-w-[1280px] mx-auto px-8">

        {/* Üst kısım */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">

          {/* Marka & İletişim */}
          <div className="lg:col-span-2">
            <Link href="/" className="group inline-block pt-1">
              <Logo scale={1.05} theme="dark" className="group-hover:opacity-90 transition-opacity duration-200" />
            </Link>
            <p className="text-[#737685] mt-4 leading-relaxed" style={{ fontSize: "14px", lineHeight: "22px" }}>
              Türkiye&apos;nin en geniş kontakt lens kataloğu. Premium göz sağlığı ürünleri, hızlı teslimat, uzman desteği.
            </p>

            {/* İletişim */}
            <div className="mt-6 flex flex-col gap-3">
              {[
                { icon: "location_on", text: "Selimiye, Selimiye Kışla Cd. No:23/A, 34668 Üsküdar/İstanbul" },
                { icon: "phone", text: "0552 354 26 36" },
                { icon: "mail", text: "info@hepsilens.com" }
              ].map((item) => (
                <div key={item.icon} className="flex items-start gap-3 group">
                  <span className="material-symbols-outlined text-[#50dcff] flex-shrink-0 group-hover:scale-110 transition-transform duration-200" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>
                    {item.icon}
                  </span>
                  <span className="text-[#737685] group-hover:text-[#c3c6d6] transition-colors duration-200" style={{ fontSize: "13px" }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Sosyal medya */}
            <div className="flex gap-3 mt-6">
              {[
                {
                  label: "Instagram",
                  href: "https://www.instagram.com/hepsilens",
                  icon: (
                    <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  )
                },
                {
                  label: "Twitter (X)",
                  href: "https://x.com/hepsilenscom",
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )
                },
                {
                  label: "Facebook",
                  href: "https://www.facebook.com/HepsiLens",
                  icon: (
                    <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z" />
                    </svg>
                  )
                }
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:border-white hover:text-white hover:scale-110 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Site linkleri — 4 sütun */}
          {siteLinks.map((col) => (
            <div key={col.section}>
              <p
                className="text-white font-bold mb-4 uppercase"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", letterSpacing: "0.1em" }}
              >
                {col.section}
              </p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[#737685] hover:text-[#50dcff] transition-colors duration-200 hover:pl-1 inline-block"
                      style={{ fontSize: "13px" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Markalar şeridi */}
        <div className="border-t border-[#2e3132] py-6">
          <p
            className="text-[#737685] uppercase mb-4"
            style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em" }}
          >
            Çalıştığımız Markalar
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {siteBrands.map((b) => (
              <Link
                key={b}
                href={`/urunler?marka=${b.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-[#434654] hover:text-[#50dcff] font-bold transition-colors duration-200 hover:scale-105 inline-block"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "16px" }}
              >
                {b}
              </Link>
            ))}
          </div>
        </div>

        {/* Alt çizgi */}
        <div className="border-t border-[#2e3132] py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[#737685]" style={{ fontSize: "13px" }}>
              © 2026 Hepsilens Medikal Optometri. Tüm hakları saklıdır.
            </p>

            {/* Yasal linkler — alt çizgi */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              {[
                { label: "Gizlilik", href: "/gizlilik" },
                { label: "KVKK", href: "/kvkk" },
                { label: "Kullanım Şartları", href: "/kullanim-sartlari" },
                { label: "Çerez Politikası", href: "/cerez-politikasi" },
                { label: "Mesafeli Satış", href: "/mesafeli-satis" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[#434654] hover:text-[#50dcff] transition-colors"
                  style={{ fontSize: "11px", fontWeight: 500 }}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Güvenlik rozetleri */}
            <div className="flex items-center gap-2 text-[#737685]" style={{ fontSize: "12px" }}>
              <span className="material-symbols-outlined text-[#50dcff]" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              SSL Güvenli
              <span className="text-[#2e3132]">·</span>
              <span className="material-symbols-outlined text-[#50dcff]" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>credit_card</span>
              3D Secure
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
