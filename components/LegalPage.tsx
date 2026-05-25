import Link from "next/link";

export type LegalSection = {
  id: string;
  icon: string;
  title: string;
  content: React.ReactNode;
};

type Props = {
  title: string;
  description: string;
  icon: string;
  badge?: string;
  updatedAt?: string;
  sections: LegalSection[];
  cta?: { icon: string; title: string; body: React.ReactNode };
  breadcrumb: string;
};

export default function LegalPage({ title, description, icon, badge, updatedAt = "Mayıs 2026", sections, cta, breadcrumb }: Props) {
  return (
    <div className="pt-[72px] pb-20">

      {/* Hero */}
      <section className="bg-[#f5f6fc] border-b border-[#edeef3]">
        <div className="max-w-[900px] mx-auto px-8 py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-[#737685] hover:text-[#003d9b] transition-colors flex items-center gap-1" style={{ fontSize: "13px", fontWeight: 600 }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>home</span>Anasayfa
            </Link>
            <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "16px" }}>chevron_right</span>
            <span className="text-[#003d9b]" style={{ fontSize: "13px", fontWeight: 600 }}>{breadcrumb}</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#dae2ff]">
              <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>{icon}</span>
            </div>
            <div className="flex items-center gap-3 text-[#737685]" style={{ fontSize: "12px" }}>
              <span>{updatedAt}</span>
              {badge && <><span>·</span><span>{badge}</span></>}
            </div>
          </div>

          <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: "#191c1e", lineHeight: 1.2 }}>
            {title}
          </h1>
          <p className="text-[#737685] mt-3" style={{ fontSize: "16px", lineHeight: "26px" }}>
            {description}
          </p>
        </div>
      </section>

      {/* İçerik */}
      <div className="max-w-[900px] mx-auto px-8">

        {/* İçindekiler */}
        <nav className="my-10 p-5 bg-[#f5f6fc] rounded-2xl border border-[#edeef3]">
          <p className="text-[#737685] font-bold mb-3" style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>İçindekiler</p>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-[#003d9b] hover:underline" style={{ fontSize: "13px", fontWeight: 500 }}>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Bölümler */}
        <div className="blog-content flex flex-col gap-12">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#dae2ff] flex-shrink-0">
                  <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                </div>
                <h2 style={{ margin: 0, fontSize: "clamp(17px,2vw,21px)" }}>{s.title}</h2>
              </div>
              <div className="pl-12">{s.content}</div>
            </section>
          ))}
        </div>

        {/* CTA */}
        {cta && (
          <div className="mt-14 p-6 bg-[#dae2ff] rounded-2xl">
            <div className="flex items-start gap-4">
              <span className="material-symbols-outlined text-[#003d9b] flex-shrink-0" style={{ fontSize: "24px", fontVariationSettings: "'FILL' 1" }}>{cta.icon}</span>
              <div>
                <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px", fontWeight: 700, color: "#003d9b", marginBottom: "4px" }}>{cta.title}</p>
                <div className="text-[#003d9b]" style={{ fontSize: "13px", lineHeight: "20px", opacity: 0.85 }}>{cta.body}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
