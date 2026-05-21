import Link from "next/link";
import Logo from "@/components/Logo";

const siteBrands = ["Acuvue", "Dailies", "Biofinity", "FreshLook", "Air Optix", "Bausch + Lomb"];

const siteLinks = [
  {
    section: "Lensler", links: [
      { label: "Tüm Lensler", href: "/urunler" },
      { label: "Numaralı Lensler", href: "/urunler?recete=gerekli" },
      { label: "Kozmetik Lensler", href: "/urunler?recete=serbest" },
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
      { label: "Reçete Rehberi", href: "/yardim/recete" },
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
      { label: "Gizlilik Politikası", href: "/gizlilik" },
    ]
  },
];

/* ── section: footer ── */
export default function Footer() {
  return (
    <footer id="footer" className="bg-[#191c1e] text-white mt-0">
      <div className="max-w-[1280px] mx-auto px-8">

        {/* Üst kısım */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
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
                { icon: "location_on", text: "Levent Mah. Büyükdere Cad. No:127 Şişli, İstanbul" },
                { icon: "phone", text: "+90 (212) 000 00 00" },
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
                { icon: "photo_camera", label: "Instagram" },
                { icon: "social_leaderboard", label: "Twitter" },
                { icon: "brand_awareness", label: "Facebook" },
                { icon: "smart_display", label: "YouTube" },
              ].map((s) => (
                <button
                  key={s.icon}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-[#434654] flex items-center justify-center text-[#737685] hover:border-[#50dcff] hover:text-[#50dcff] hover:scale-110 transition-all duration-200"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{s.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Site linkleri */}
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
        <div className="border-t border-[#2e3132] py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[#737685]" style={{ fontSize: "13px" }}>
            © 2026 Hepsilens Medikal Optometri. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-2 text-[#737685]" style={{ fontSize: "12px" }}>
            <span className="material-symbols-outlined text-[#50dcff]" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            SSL Güvenli Alışveriş
            <span className="text-[#2e3132]">·</span>
            <span className="material-symbols-outlined text-[#50dcff]" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>credit_card</span>
            3D Secure Ödeme
          </div>
        </div>
      </div>
    </footer>
  );
}
