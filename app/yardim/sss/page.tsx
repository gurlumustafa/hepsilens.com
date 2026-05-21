import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular — Hepsilens",
  description: "Sipariş, kargo, iade, reçete ve lens kullanımı hakkında en çok sorulan sorular ve cevapları.",
};

const faqGroups = [
  {
    icon: "shopping_bag",
    color: "#003d9b",
    bg: "#dae2ff",
    title: "Sipariş & Ödeme",
    faqs: [
      {
        q: "Nasıl sipariş verebilirim?",
        a: "Ürünü sepetinize ekleyin, adres ve ödeme bilgilerinizi girerek siparişi tamamlayın. Numaralı lens için reçetenizi yüklemeniz istenecektir. Tüm süreç birkaç dakika içinde tamamlanır.",
      },
      {
        q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
        a: "Kredi kartı, banka kartı (Visa, Mastercard, Troy), havale/EFT ve kapıda ödeme (kargo firması ücreti dahil) kabul etmekteyiz. Kredi kartıyla 3 ila 12 taksit imkânı mevcuttur.",
      },
      {
        q: "Ödeme güvenli mi?",
        a: "Tüm ödemeler 256-bit SSL şifrelemesiyle korunmaktadır. 3D Secure sistemini destekleyen bankalarla ekstra güvenlik katmanı sağlanmaktadır. Kart bilgileriniz Hepsilens sistemlerinde saklanmamaktadır.",
      },
      {
        q: "Fatura nasıl alırım?",
        a: "E-fatura, sipariş onayının ardından kayıtlı e-posta adresinize otomatik olarak gönderilir. Kurumsal fatura için sipariş notuna vergi numaranızı ve şirket adınızı yazabilirsiniz.",
      },
    ],
  },
  {
    icon: "local_shipping",
    color: "#00687b",
    bg: "#ccf4f9",
    title: "Kargo & Teslimat",
    faqs: [
      {
        q: "Kargo ne kadar sürer?",
        a: "Stokta bulunan ürünler, hafta içi saat 14:00'e kadar verilen siparişler için aynı gün kargoya verilir ve 1-2 iş günü içinde teslim edilir. Uzak bölgeler için bu süre 3-4 iş gününe kadar uzayabilir.",
      },
      {
        q: "Kargo ücreti ne kadar?",
        a: "300 TL ve üzeri siparişlerde kargo ücretsizdir. 300 TL altındaki siparişlerde kargo ücreti 49,90 TL olarak uygulanır.",
      },
      {
        q: "Sipariş takibi yapabilir miyim?",
        a: "Evet. Kargoya verildikten sonra size gönderilen takip kodu ile kargo firmasının web sitesinden veya Hepsilens Sipariş Takip sayfasından anlık takip yapabilirsiniz.",
      },
      {
        q: "Siparişi değiştirebilir ya da iptal edebilir miyim?",
        a: "Siparişiniz kargoya verilmeden önce iptal veya değişiklik talebi oluşturabilirsiniz. Müşteri hizmetlerimizi arayın ya da e-posta gönderin; 1 saat içinde yanıt veririz.",
      },
    ],
  },
  {
    icon: "assignment_return",
    color: "#b45309",
    bg: "#fef3c7",
    title: "İade & Değişim",
    faqs: [
      {
        q: "Ürünü iade edebilir miyim?",
        a: "Açılmamış, orijinal ambalajında olan ürünleri teslim tarihinden itibaren 14 gün içinde iade edebilirsiniz. Hijyenik nedenlerle açılmış lens ürünleri iade kapsamı dışındadır.",
      },
      {
        q: "İade süreci nasıl işler?",
        a: "Müşteri hizmetlerimizi veya info@hepsilens.com adresini arayarak iade talebi açın. Anlaşmalı kargo firmasıyla ürünü bize gönderin (iade kargo bedeli size aittir). Ürün bize ulaştıktan sonra 3-5 iş günü içinde ödemeniz iade edilir.",
      },
      {
        q: "Yanlış ürün geldiyse ne yapmalıyım?",
        a: "Yanlış ürün teslimatı durumunda kargo bedeli tarafımıza aittir. Müşteri hizmetlerimize fotoğrafla bildirin; 24 saat içinde çözüm üretiriz.",
      },
    ],
  },
  {
    icon: "ophthalmology",
    color: "#16a34a",
    bg: "#dcfce7",
    title: "Reçete & Lens",
    faqs: [
      {
        q: "Reçete olmadan lens satın alabilir miyim?",
        a: "Numarasız (0.00 / plano) renkli veya şeffaf lensler reçetesiz satın alınabilir. Numaralı tüm lensler için geçerli bir göz doktoru reçetesi gerekmektedir.",
      },
      {
        q: "Reçetemi nasıl yüklerim?",
        a: "Sipariş sırasında reçete yükleme adımı otomatik olarak karşınıza gelir. Fotoğraf veya PDF formatında yükleyebilirsiniz. Reçeteniz uzman ekibimiz tarafından doğrulanır.",
      },
      {
        q: "Gözlük reçetemle lens alabilir miyim?",
        a: "Gözlük ve lens reçeteleri farklıdır. Göz doktorunuzdan özellikle kontakt lens reçetesi istemeniz gerekmektedir. Gözlük numaranız ve lens numaranız genellikle aynı değildir.",
      },
      {
        q: "Lens numarası aralık dışındaysa ne yapmalıyım?",
        a: "Bazı özel numaralar için stok durumu farklılık gösterebilir. Ürün sayfasında 'Stok Bildirimi Al' butonunu kullanabilir veya müşteri hizmetlerimize danışabilirsiniz.",
      },
    ],
  },
];

export default function SSSPage() {
  return (
    <div className="pt-[72px] pb-20">

      {/* Hero */}
      <section className="bg-[#f5f6fc] border-b border-[#edeef3]">
        <div className="max-w-[960px] mx-auto px-8 py-14">
          <nav className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-[#737685] hover:text-[#003d9b] transition-colors flex items-center gap-1" style={{ fontSize: "13px", fontWeight: 600 }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>home</span>Anasayfa
            </Link>
            <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "16px" }}>chevron_right</span>
            <span className="text-[#737685]" style={{ fontSize: "13px", fontWeight: 600 }}>Yardım</span>
            <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "16px" }}>chevron_right</span>
            <span className="text-[#003d9b]" style={{ fontSize: "13px", fontWeight: 600 }}>SSS</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#dae2ff]">
              <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>help</span>
            </div>
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: "#191c1e", lineHeight: 1.2 }}>
            Sık Sorulan Sorular
          </h1>
          <p className="text-[#737685] mt-3" style={{ fontSize: "16px", lineHeight: "26px" }}>
            En çok merak edilen konuları derledik. Yanıtını bulamazsan müşteri hizmetlerimiz her zaman yanında.
          </p>
        </div>
      </section>

      {/* SSS grupları */}
      <div className="max-w-[960px] mx-auto px-8 mt-12 flex flex-col gap-12">
        {faqGroups.map((group) => (
          <section key={group.title}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: group.bg }}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: group.color, fontVariationSettings: "'FILL' 1" }}>{group.icon}</span>
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", fontWeight: 800, color: "#191c1e" }}>{group.title}</h2>
            </div>

            <div className="flex flex-col gap-3">
              {group.faqs.map((faq, i) => (
                <details key={i} className="group border border-[#edeef3] rounded-2xl bg-white overflow-hidden">
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer select-none hover:bg-[#f5f6fc] transition-colors">
                    <span style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "14px", fontWeight: 700, color: "#191c1e" }}>{faq.q}</span>
                    <span className="material-symbols-outlined text-[#737685] flex-shrink-0 group-open:rotate-180 transition-transform duration-200" style={{ fontSize: "20px" }}>expand_more</span>
                  </summary>
                  <div className="px-5 pb-5 pt-1 text-[#737685]" style={{ fontSize: "14px", lineHeight: "24px" }}>
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Hâlâ sorun var mı? */}
      <div className="max-w-[960px] mx-auto px-8 mt-14">
        <div className="rounded-2xl bg-[#003d9b] p-8 text-center text-white">
          <span className="material-symbols-outlined" style={{ fontSize: "32px", fontVariationSettings: "'FILL' 1" }}>support_agent</span>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", fontWeight: 800, marginTop: "10px" }}>Hâlâ yardıma ihtiyacın var mı?</h3>
          <p style={{ fontSize: "14px", opacity: 0.8, marginTop: "6px" }}>Uzman ekibimiz hafta içi 09:00–20:00, hafta sonu 10:00–18:00 hizmetindedir.</p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <a href="tel:+902120000000"
              className="flex items-center gap-2 bg-white rounded-xl px-5 py-2.5 font-bold hover:bg-[#f5f6fc] transition-colors"
              style={{ fontSize: "13px", color: "#003d9b" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "17px", fontVariationSettings: "'FILL' 1" }}>phone</span>
              +90 (212) 000 00 00
            </a>
            <a href="mailto:info@hepsilens.com"
              className="flex items-center gap-2 border border-white/30 rounded-xl px-5 py-2.5 font-bold hover:bg-white/10 transition-colors"
              style={{ fontSize: "13px", color: "white" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "17px", fontVariationSettings: "'FILL' 1" }}>mail</span>
              info@hepsilens.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
