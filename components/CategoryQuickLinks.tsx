import Link from "next/link";
import Image from "next/image";

export default function CategoryQuickLinks() {
  return (
    <section id="kategori-linkleri" className="max-w-[1280px] mx-auto px-8 py-16">
      <div className="mb-10 text-center md:text-left">
        <h2
          className="text-[#191c1e] text-3xl md:text-4xl"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          Size uygun lens türlerini keşfedin
        </h2>
        <p className="text-[#737685] mt-2 max-w-xl text-sm md:text-base">
          Göz sağlığınız ve konforunuz için özel olarak tasarlanmış geniş ürün yelpazemizi inceleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[220px]">
        {/* 1. SAYDAM LENS (Featured - Tall Card, spans 2 cols, 2 rows) */}
        <Link
          href="/urunler?renk=seffaf"
          className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ebf3ff] to-[#ffffff] border border-[#d0e1fd] p-8 flex flex-col justify-between group hover:shadow-2xl hover:border-[#003d9b] transition-all duration-300 cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none flex items-center justify-center p-4">
            <div className="relative w-full h-full max-w-[240px] max-h-[240px] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out">
              <Image
                src="/images/categories/saydam.png"
                alt="Saydam Lensler"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 300px"
                priority
              />
            </div>
          </div>
          <div className="relative z-10 max-w-[55%] flex flex-col h-full justify-between">
            <div>
              <span className="bg-[#003d9b] text-white font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md inline-block mb-3 shadow-sm">
                En Çok Tercih Edilen
              </span>
              <h3
                className="text-[#191c1e] text-2xl group-hover:text-[#003d9b] transition-colors duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, lineHeight: "1.2" }}
              >
                Saydam Lensler
              </h3>
              <p className="text-[#434654] text-xs md:text-sm mt-3 leading-relaxed">
                Maksimum oksijen geçirgenliği ve gün boyu süren ipeksi konfor hissi ile doğal görüş kalitesi.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-[#003d9b] font-bold text-xs">
              Koleksiyonu Keşfet
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>
        </Link>

        {/* 2. RENKLİ LENS (Wide Card, spans 2 cols, 1 row) */}
        <Link
          href="/urunler?renk=renkli"
          className="md:col-span-2 md:row-span-1 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fdf5eb] to-[#ffffff] border border-[#fde4d0] p-8 flex justify-between items-center group hover:shadow-2xl hover:border-[#6a3600] transition-all duration-300 cursor-pointer"
        >
          <div className="relative z-10 max-w-[60%] flex flex-col justify-between h-full">
            <div>
              <h3
                className="text-[#191c1e] text-xl group-hover:text-[#6a3600] transition-colors duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
              >
                Renkli Lensler
              </h3>
              <p className="text-[#434654] text-xs mt-2 leading-relaxed">
                Doğal tonlar ve göz kamaştırıcı estetik değişim sunan renk alternatifleri.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[#6a3600] font-bold text-xs">
              Modelleri İncele
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>
          <div className="relative w-[140px] h-[140px] shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 ease-out">
            <Image
              src="/images/categories/renkli.png"
              alt="Renkli Lensler"
              fill
              className="object-contain"
              sizes="150px"
            />
          </div>
        </Link>

        {/* 3. TORIC LENS (Square Card, spans 1 col, 1 row) */}
        <Link
          href="/urunler?tur=toric"
          className="md:col-span-1 md:row-span-1 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#eafafc] to-[#ffffff] border border-[#d0f6fd] p-6 flex flex-col justify-between group hover:shadow-2xl hover:border-[#00687b] transition-all duration-300 cursor-pointer"
        >
          <div className="absolute -bottom-6 -right-6 w-[120px] h-[120px] pointer-events-none group-hover:scale-110 transition-all duration-500 ease-out">
            <Image
              src="/images/categories/toric.png"
              alt="Toric Lensler"
              fill
              className="object-contain opacity-90 group-hover:opacity-100"
              sizes="120px"
            />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h3
                className="text-[#191c1e] text-base group-hover:text-[#00687b] transition-colors duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
              >
                Toric Lensler
              </h3>
              <p className="text-[#434654] text-[11px] mt-1.5 leading-relaxed max-w-[85%]">
                Astigmatizma için kristal netliğinde görüş.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[#00687b] font-bold text-[11px]">
              Göz At
              <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>
        </Link>

        {/* 4. GÜNLÜK LENS (Square Card, spans 1 col, 1 row) */}
        <Link
          href="/urunler?tur=gunluk"
          className="md:col-span-1 md:row-span-1 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ebfff5] to-[#ffffff] border border-[#d0fde4] p-6 flex flex-col justify-between group hover:shadow-2xl hover:border-[#0f7d46] transition-all duration-300 cursor-pointer"
        >
          <div className="absolute -bottom-6 -right-6 w-[120px] h-[120px] pointer-events-none group-hover:scale-110 transition-all duration-500 ease-out">
            <Image
              src="/images/categories/gunluk.png"
              alt="Günlük Lensler"
              fill
              className="object-contain opacity-90 group-hover:opacity-100"
              sizes="120px"
            />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h3
                className="text-[#191c1e] text-base group-hover:text-[#0f7d46] transition-colors duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
              >
                Günlük Lensler
              </h3>
              <p className="text-[#434654] text-[11px] mt-1.5 leading-relaxed max-w-[85%]">
                Her gün taze ve zahmetsiz bir başlangıç.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[#0f7d46] font-bold text-[11px]">
              Göz At
              <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
