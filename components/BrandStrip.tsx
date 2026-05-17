/* ── section: marka-seridi ── */
const brandNames = [
  "ACUVUE", "Alcon", "Bausch + Lomb", "CooperVision", "AIR OPTIX", "FreshLook",
  "ACUVUE", "Alcon", "Bausch + Lomb", "CooperVision", "AIR OPTIX", "FreshLook",
];

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
      <div
        className="flex gap-20 items-center opacity-50 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-700 cursor-default animate-marquee"
        style={{ width: "max-content" }}
      >
        {brandNames.map((name, i) => (
          <span
            key={i}
            className="text-[#434654] font-extrabold whitespace-nowrap hover:text-[#003d9b] transition-colors duration-200"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "30px", lineHeight: "40px" }}
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
