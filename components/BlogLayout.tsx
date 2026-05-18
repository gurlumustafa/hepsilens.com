import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  readTime: string;
  date: string;
  children: ReactNode;
};

export default function BlogLayout({ title, subtitle, icon, iconColor, iconBg, readTime, date, children }: Props) {
  return (
    <div className="pt-[72px] pb-20 px-4 md:px-8 max-w-[800px] mx-auto">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 py-6">
        <Link href="/" className="text-[#737685] hover:text-[#003d9b] transition-colors flex items-center gap-1" style={{ fontSize: "13px", fontWeight: 600 }}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>home</span>Anasayfa
        </Link>
        <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "16px" }}>chevron_right</span>
        <span className="text-[#737685]" style={{ fontSize: "13px", fontWeight: 600 }}>Blog</span>
        <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "16px" }}>chevron_right</span>
        <span className="text-[#003d9b]" style={{ fontSize: "13px", fontWeight: 600 }}>{title}</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: iconBg }}>
            <span className="material-symbols-outlined" style={{ fontSize: "22px", color: iconColor, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
          </div>
          <div className="flex items-center gap-3 text-[#737685]" style={{ fontSize: "12px" }}>
            <span>{date}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>schedule</span>
              {readTime} okuma
            </span>
          </div>
        </div>
        <h1 className="text-[#191c1e] mb-3" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "clamp(26px,4vw,38px)", lineHeight: 1.2, fontWeight: 800 }}>
          {title}
        </h1>
        <p className="text-[#737685]" style={{ fontSize: "17px", lineHeight: "26px" }}>{subtitle}</p>
      </div>

      <hr style={{ borderColor: "#edeef3", marginBottom: "40px" }} />

      {/* İçerik */}
      <div className="blog-content">{children}</div>

      {/* Diğer Yazılar */}
      <div className="mt-16 pt-10 border-t border-[#edeef3]">
        <p className="font-bold text-[#191c1e] mb-4" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "16px" }}>Diğer Blog Yazıları</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { href: "/blog/lens-bakimi",       icon: "water_drop",  label: "Lens Bakımı",          color: "#003d9b" },
            { href: "/blog/goz-sagligi",        icon: "visibility",  label: "Göz Sağlığı",          color: "#00687b" },
            { href: "/blog/urun-incelemeleri",  icon: "star",        label: "Ürün İncelemeleri",    color: "#b45309" },
            { href: "/blog/ipuclari",           icon: "lightbulb",   label: "İpuçları & Rehber",    color: "#16a34a" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#edeef3] hover:border-[#003d9b]/30 hover:bg-[#f5f6fc] transition-all"
              style={{ fontSize: "13px", fontWeight: 600, color: "#434654" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: item.color, fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
