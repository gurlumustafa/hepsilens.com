import Link from "next/link";
import Image from "next/image";

export default function CategoryQuickLinks() {
  return (
    <section id="kategori-linkleri" className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="mb-8 md:mb-10 text-center md:text-left">
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 md:auto-rows-[220px]">

        {/* 1. RENKLİ LENS */}
        <Link
          href="/urunler?renk=renkli"
          className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fdf5eb] to-[#ffffff] border border-[#fde4d0] p-5 md:p-8 min-h-[180px] flex flex-col justify-between group hover:shadow-2xl hover:border-[#6a3600] transition-all duration-300 cursor-pointer"
        >
          <div className="absolute right-0 top-0 h-full w-[44%] pointer-events-none flex items-center justify-center p-3 md:p-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out">
            <div className="relative w-full h-[80%]">
              <Image
                src="/images/categories/renkli.png"
                alt="Renkli Lensler"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 44vw, 280px"
                priority
              />
            </div>
          </div>
          <div className="relative z-10 max-w-[52%] flex flex-col h-full justify-between">
            <div>
              <span className="bg-[#6a3600] text-white font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md inline-block mb-3 shadow-sm">
                En Çok Tercih Edilen
              </span>
              <h3
                className="text-[#191c1e] text-xl md:text-2xl group-hover:text-[#6a3600] transition-colors duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, lineHeight: "1.2" }}
              >
                Renkli Lensler
              </h3>
              {/* Mobil için kısa açıklama */}
              <p className="text-[#434654] text-xs mt-2 leading-relaxed sm:hidden">
                Tarzını renklere yansıt.
              </p>
              {/* Masaüstü için tam açıklama */}
              <p className="text-[#434654] text-xs md:text-sm mt-3 leading-relaxed hidden sm:block">
                Doğal tonlar ve göz kamaştırıcı estetik değişim sunan renk alternatifleri ile tarzını yansıt.
              </p>
            </div>
            <div className="mt-3 md:mt-4 flex items-center gap-1.5 text-[#6a3600] font-bold text-xs">
              Göz At
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>
        </Link>

        {/* 2. GÜNLÜK LENS */}
        <Link
          href="/urunler?tur=gunluk"
          className="md:col-span-2 md:row-span-1 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ebfff5] to-[#ffffff] border border-[#d0fde4] p-5 md:p-8 min-h-[160px] flex flex-col justify-between group hover:shadow-2xl hover:border-[#0f7d46] transition-all duration-300 cursor-pointer"
        >
          <div className="absolute right-0 top-0 h-full w-[44%] pointer-events-none flex items-center justify-center p-3 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 ease-out">
            <div className="relative w-full h-[80%]">
              <Image
                src="/images/categories/gunluk.png"
                alt="Günlük Lensler"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 44vw, 200px"
              />
            </div>
          </div>
          <div className="relative z-10 max-w-[52%] flex flex-col h-full justify-between">
            <div>
              <h3
                className="text-[#191c1e] text-lg md:text-xl group-hover:text-[#0f7d46] transition-colors duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
              >
                Günlük Lensler
              </h3>
              <p className="text-[#434654] text-xs mt-2 leading-relaxed">
                Her gün taze ve zahmetsiz bir başlangıç — tek kullanımlık kolaylık.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[#0f7d46] font-bold text-xs">
              Göz At
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>
        </Link>

        {/* 3. HAFTALIK LENS */}
        <Link
          href="/urunler?tur=haftalik"
          className="md:col-span-1 md:row-span-1 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f5ebff] to-[#ffffff] border border-[#e4d0fd] p-5 md:p-6 min-h-[160px] flex flex-col justify-between group hover:shadow-2xl hover:border-[#6a00a8] transition-all duration-300 cursor-pointer"
        >
          <div className="absolute right-0 top-0 h-full w-[44%] pointer-events-none flex items-center justify-center p-3 group-hover:scale-110 transition-all duration-500 ease-out">
            <div className="relative w-full h-[80%]">
              <Image
                src="/images/categories/saydam.png"
                alt="Haftalık Lensler"
                fill
                className="object-contain opacity-80 group-hover:opacity-100"
                sizes="120px"
              />
            </div>
          </div>
          <div className="relative z-10 max-w-[52%] flex flex-col h-full justify-between">
            <div>
              <h3
                className="text-[#191c1e] text-base group-hover:text-[#6a00a8] transition-colors duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
              >
                Haftalık Lensler
              </h3>
              <p className="text-[#434654] text-[11px] mt-1.5 leading-relaxed">
                2 haftaya kadar taze konfor ve netlik.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[#6a00a8] font-bold text-[11px]">
              Göz At
              <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>
        </Link>

        {/* 4. AYLIK LENS */}
        <Link
          href="/urunler?tur=aylik"
          className="md:col-span-1 md:row-span-1 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ebedff] to-[#ffffff] border border-[#d0d4fd] p-5 md:p-6 min-h-[160px] flex flex-col justify-between group hover:shadow-2xl hover:border-[#1a0098] transition-all duration-300 cursor-pointer"
        >
          <div className="absolute right-0 top-0 h-full w-[44%] pointer-events-none flex items-center justify-center p-3 group-hover:scale-110 transition-all duration-500 ease-out">
            <div className="relative w-full h-[80%]">
              <Image
                src="/images/categories/toric.png"
                alt="Aylık Lensler"
                fill
                className="object-contain opacity-80 group-hover:opacity-100"
                sizes="120px"
              />
            </div>
          </div>
          <div className="relative z-10 max-w-[52%] flex flex-col h-full justify-between">
            <div>
              <h3
                className="text-[#191c1e] text-base group-hover:text-[#1a0098] transition-colors duration-200"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
              >
                Aylık Lensler
              </h3>
              <p className="text-[#434654] text-[11px] mt-1.5 leading-relaxed">
                30 gün boyunca üstün konfor ve uzun ömür.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[#1a0098] font-bold text-[11px]">
              Göz At
              <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </div>
          </div>
        </Link>

      </div>
    </section>
  );
}
