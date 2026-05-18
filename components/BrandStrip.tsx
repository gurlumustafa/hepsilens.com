"use client";

const brands = [
  "ACUVUE", "Alcon", "Bausch + Lomb", "CooperVision", "AIR OPTIX", "FreshLook", "Biofinity",
];

/* ── section: marka-seridi ── */
export default function BrandStrip() {
  return (
    <section id="marka-seridi" className="bg-[#f3f4f6] py-10 border-y border-[#c3c6d6] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-8 mb-6 text-center">
        <p
          className="text-[#737685] uppercase tracking-widest"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em" }}
        >
          Dünyanın lider optik markaları ile iş birliğindeyiz
        </p>
      </div>

      {/* İki özdeş şerit yan yana — her biri kendi genişliğince kayar */}
      <div
        className="flex items-center opacity-50 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-700 cursor-default"
        style={{ width: "max-content" }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex items-center flex-shrink-0"
            style={{ animation: "brandScroll 28s linear infinite" }}
            aria-hidden={copy === 1}
          >
            {brands.map((name, i) => (
              <span
                key={i}
                className="text-[#434654] font-extrabold whitespace-nowrap hover:text-[#003d9b] transition-colors duration-200"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "30px",
                  lineHeight: "40px",
                  padding: "0 48px",
                }}
              >
                {name}
              </span>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes brandScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
      `}</style>
    </section>
  );
}
