import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hakkımızda — Hepsilens",
  description: "Hepsilens, Türkiye'nin en geniş kontakt lens kataloğunu sunan sağlık odaklı e-ticaret platformudur. Misyonumuz, göz sağlığını herkes için erişilebilir kılmaktır.",
};

const stats = [
  { value: "50.000+", label: "Aktif Müşteri" },
  { value: "200+", label: "Ürün Çeşidi" },
  { value: "12", label: "Premium Marka" },
  { value: "24 sa", label: "Müşteri Desteği" },
];

const values = [
  {
    icon: "favorite",
    color: "#dc2626",
    bg: "#fef2f2",
    title: "Göz Sağlığı Önce Gelir",
    desc: "Her ürün seçimimizde ve içeriğimizde göz sağlığını ön plana koyarız. Yalnızca klinik olarak onaylanmış markaları listeliyoruz; indirim uğruna kaliteden taviz vermiyoruz.",
  },
  {
    icon: "verified",
    color: "#003d9b",
    bg: "#dae2ff",
    title: "Şeffaf ve Dürüst",
    desc: "Ürün açıklamalarımız, kullanıcı yorumlarımız ve blog içeriklerimiz bağımsız editöryal anlayışla hazırlanır. Hiçbir marka sponsorluğu, içeriklerimizi etkilemez.",
  },
  {
    icon: "local_shipping",
    color: "#00687b",
    bg: "#ccf4f9",
    title: "Hızlı ve Güvenli Teslimat",
    desc: "Siparişler ortalama 24-48 saat içinde kapınıza ulaşır. Lensler özel soğuk muhafaza ambalajlarıyla sevk edilir; ulaşana kadar ürün kalitesi güvence altındadır.",
  },
  {
    icon: "support_agent",
    color: "#16a34a",
    bg: "#dcfce7",
    title: "Uzman Desteği",
    desc: "Lens seçimi, reçete okuma ve bakım konularında uzman ekibimiz her gün hizmetinizdedir. Sorularınızı canlı destek, e-posta veya telefon aracılığıyla iletebilirsiniz.",
  },
];

const team = [
  {
    name: "Dr. Zeynep Arslan",
    title: "Göz Sağlığı Danışmanı",
    bio: "15 yıllık klinik deneyimiyle platformun tıbbi içerik danışmanıdır. Kornea hastalıkları ve kontakt lens uyumu üzerine ihtisas sahibidir.",
    icon: "ophthalmology",
    color: "#003d9b",
    bg: "#dae2ff",
  },
  {
    name: "Murat Demir",
    title: "Kurucu & CEO",
    bio: "E-ticaret ve sağlık teknolojileri alanında 10 yıllık deneyim. Hepsilens'i 2021 yılında göz sağlığını herkes için erişilebilir kılma misyonuyla kurdu.",
    icon: "person",
    color: "#00687b",
    bg: "#ccf4f9",
  },
  {
    name: "Selin Kaya",
    title: "Müşteri Deneyimi Direktörü",
    bio: "Müşteri memnuniyetini merkeze alan operasyon sistemleri tasarlar. Her geri bildirim, ürün ve hizmet geliştirme sürecine doğrudan dahil edilir.",
    icon: "supervisor_account",
    color: "#16a34a",
    bg: "#dcfce7",
  },
];

export default function HakkimizdaPage() {
  return (
    <div className="pt-[72px]">

      {/* Hero */}
      <section className="bg-[#f5f6fc] border-b border-[#edeef3]">
        <div className="max-w-[1280px] mx-auto px-8 py-16 md:py-24">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-[#737685] hover:text-[#003d9b] transition-colors flex items-center gap-1" style={{ fontSize: "13px", fontWeight: 600 }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>home</span>Anasayfa
            </Link>
            <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "16px" }}>chevron_right</span>
            <span className="text-[#003d9b]" style={{ fontSize: "13px", fontWeight: 600 }}>Hakkımızda</span>
          </nav>

          <div className="max-w-[680px]">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#dae2ff] mb-6">
              <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>info</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#003d9b", letterSpacing: "0.06em", textTransform: "uppercase" }}>Hakkımızda</span>
            </div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, lineHeight: 1.15, color: "#191c1e" }}>
              Göz sağlığınız<br />
              <span style={{ color: "#003d9b" }}>bizim önceliğimiz.</span>
            </h1>
            <p className="mt-6 text-[#737685]" style={{ fontSize: "17px", lineHeight: "28px", maxWidth: "580px" }}>
              Hepsilens, 2021 yılında "göz sağlığı herkes için erişilebilir olmalı" felsefesiyle kuruldu. Türkiye&apos;nin en geniş kontakt lens kataloğunu sunarak milyonlarca kullanıcının güvenli ve konforlu görme deneyimine katkıda bulunuyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* İstatistikler */}
      <section className="border-b border-[#edeef3]">
        <div className="max-w-[1280px] mx-auto px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.value} className="text-center">
                <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, color: "#003d9b" }}>{s.value}</p>
                <p className="text-[#737685] mt-1" style={{ fontSize: "14px", fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hikayemiz */}
      <section className="max-w-[1280px] mx-auto px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#003d9b] font-bold mb-3 uppercase" style={{ fontSize: "12px", letterSpacing: "0.1em" }}>Hikayemiz</p>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: "#191c1e", lineHeight: 1.25 }}>
              Küçük bir fikirden büyük bir platforma
            </h2>
            <div className="mt-6 flex flex-col gap-4 text-[#737685]" style={{ fontSize: "15px", lineHeight: "26px" }}>
              <p>
                Kurucumuz Murat Demir, yakınlarının lens almak için şehrin farklı optiklerini gezmek zorunda kalması üzerine dijital bir çözüm geliştirme fikrine kapıldı. 2021 yılında kurulan Hepsilens, ilk altı ayda 5.000 müşteriye ulaştı.
              </p>
              <p>
                Bugün 50.000&apos;i aşkın aktif müşteri, 200&apos;den fazla ürün ve 12 premium markayla Türkiye&apos;nin lider kontakt lens platformu konumundayız. Tüm süreçlerimizde göz doktorlarıyla iş birliği yaparak yalnızca klinik olarak onaylı ürünleri listeliyoruz.
              </p>
              <p>
                Önümüzdeki dönemde abonelik sistemi, yapay zeka destekli lens önerisi ve daha geniş bir marka yelpazesiyle hizmetimizi büyütmeyi hedefliyoruz.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex flex-col gap-0">
            {[
              { year: "2021", title: "Kuruluş", desc: "İstanbul merkezli ekip, platformu hayata geçirdi. İlk altı ayda 5.000 müşteriye ulaşıldı." },
              { year: "2022", title: "Büyüme", desc: "100'ü aşkın ürün kataloğa eklendi. 24 saatlik müşteri desteği başlatıldı." },
              { year: "2023", title: "Blog & Eğitim", desc: "Göz sağlığı blog platformu açıldı. 10.000+ okuyucuya ulaşıldı." },
              { year: "2024", title: "50K Müşteri", desc: "Aktif müşteri sayısı 50.000'i geçti. Hızlı teslimat ağı genişletildi." },
            ].map((item, i, arr) => (
              <div key={item.year} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#dae2ff] flex items-center justify-center flex-shrink-0">
                    <span style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "11px", fontWeight: 800, color: "#003d9b" }}>{item.year.slice(2)}</span>
                  </div>
                  {i < arr.length - 1 && <div className="w-px flex-1 bg-[#edeef3] my-1" />}
                </div>
                <div className="pb-8">
                  <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px", fontWeight: 700, color: "#191c1e" }}>{item.year} — {item.title}</p>
                  <p className="text-[#737685] mt-1" style={{ fontSize: "13px", lineHeight: "20px" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Değerlerimiz */}
      <section className="bg-[#f5f6fc] border-y border-[#edeef3]">
        <div className="max-w-[1280px] mx-auto px-8 py-16 md:py-20">
          <div className="text-center mb-12">
            <p className="text-[#003d9b] font-bold mb-2 uppercase" style={{ fontSize: "12px", letterSpacing: "0.1em" }}>Değerlerimiz</p>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: "#191c1e" }}>
              Neden Hepsilens?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-[#edeef3] hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: v.bg }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "22px", color: v.color, fontVariationSettings: "'FILL' 1" }}>{v.icon}</span>
                </div>
                <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px", fontWeight: 700, color: "#191c1e", marginBottom: "8px" }}>{v.title}</p>
                <p className="text-[#737685]" style={{ fontSize: "13px", lineHeight: "21px" }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* İletişim CTA */}
      <section className="bg-[#003d9b]">
        <div className="max-w-[1280px] mx-auto px-8 py-14 text-center">
          <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, color: "white" }}>
            Sorularınız için buradayız
          </h2>
          <p className="mt-3 mb-8" style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: "24px" }}>
            Uzman ekibimiz lens seçimi, reçete okuma ve kargo konularında size yardımcı olmaya hazır.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="mailto:info@hepsilens.com"
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl font-bold hover:bg-[#f5f6fc] transition-colors"
              style={{ fontSize: "14px", color: "#003d9b" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>mail</span>
              info@hepsilens.com
            </a>
            <a href="tel:+902120000000"
              className="flex items-center gap-2 px-6 py-3 border border-white/30 rounded-xl font-bold hover:bg-white/10 transition-colors"
              style={{ fontSize: "14px", color: "white" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>phone</span>
              +90 (212) 000 00 00
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
