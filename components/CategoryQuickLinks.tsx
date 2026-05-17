import Link from "next/link";

/* ── Kategori Hızlı Bağlantıları ── */
const categories = [
  {
    href: "/urunler?renk=seffaf",
    icon: "water_drop",
    label: "Saydam Lens",
    sub: "Şeffaf & Konforlu",
    iconColor: "#003d9b",
    iconBg: "#dae2ff",
    hoverBorder: "#003d9b",
  },
  {
    href: "/urunler?renk=renkli",
    icon: "palette",
    label: "Renkli Lens",
    sub: "Estetik Değişim",
    iconColor: "#6a3600",
    iconBg: "#ffdcc3",
    hoverBorder: "#6a3600",
  },
  {
    href: "/urunler?tur=toric",
    icon: "adjust",
    label: "Toric Lens",
    sub: "Astigmat Düzeltme",
    iconColor: "#00687b",
    iconBg: "#afecff",
    hoverBorder: "#00687b",
  },
  {
    href: "/urunler?tur=gunluk",
    icon: "wb_sunny",
    label: "Günlük Lens",
    sub: "Tek Kullanımlık",
    iconColor: "#003d9b",
    iconBg: "#dae2ff",
    hoverBorder: "#003d9b",
  },
];

export default function CategoryQuickLinks() {
  return (
    /* ── section: kategori-linkleri ── */
    <section id="kategori-linkleri" className="max-w-[1280px] mx-auto px-8 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {categories.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="group flex flex-col items-center p-5 bg-white rounded-[0.75rem] border-2 border-[#c3c6d6] hover:border-current hover:shadow-xl hover:-translate-y-1 transition-all duration-250 cursor-pointer"
            style={{ "--hover-color": cat.hoverBorder } as React.CSSProperties}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-125 group-hover:shadow-md transition-all duration-250"
              style={{ background: cat.iconBg }}
            >
              <span
                className="material-symbols-outlined group-hover:scale-110 transition-transform duration-200"
                style={{ fontSize: "30px", color: cat.iconColor, fontVariationSettings: "'FILL' 1" }}
              >
                {cat.icon}
              </span>
            </div>
            <span
              className="font-bold text-[#191c1e] group-hover:text-[#003d9b] transition-colors duration-200"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "18px", lineHeight: "24px" }}
            >
              {cat.label}
            </span>
            <span
              className="text-[#737685] mt-1 text-center group-hover:text-[#434654] transition-colors duration-200"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", letterSpacing: "0.04em", fontWeight: 500 }}
            >
              {cat.sub}
            </span>
            <span
              className="mt-3 flex items-center gap-0.5 text-[#003d9b] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200"
              style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em" }}
            >
              İncele
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_forward</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
