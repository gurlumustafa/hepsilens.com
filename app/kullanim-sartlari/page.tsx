import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Kullanım Şartları — Hepsilens",
  description: "Hepsilens web sitesi ve hizmetlerini kullanımına ilişkin genel kullanım şartları ve koşulları.",
};

const sections: LegalSection[] = [
  {
    id: "taraflar",
    icon: "handshake",
    title: "1. Taraflar ve Kapsam",
    content: (
      <>
        <p>
          Bu Kullanım Şartları (&quot;Şartlar&quot;), <strong>Hepsilens Medikal Optometri A.Ş.</strong> (&quot;Hepsilens&quot;)
          ile <strong>hepsilens.com</strong> adresini ziyaret eden veya hizmetlerini kullanan bireyler (&quot;Kullanıcı&quot;)
          arasındaki ilişkiyi düzenlemektedir.
        </p>
        <p>
          Siteyi kullanmaya başlamanız, bu Şartları okuduğunuzu ve kabul ettiğinizi ifade eder.
          Şartları kabul etmiyorsanız lütfen siteyi kullanmayınız.
        </p>
      </>
    ),
  },
  {
    id: "hizmet",
    icon: "storefront",
    title: "2. Hizmetin Tanımı",
    content: (
      <>
        <p>
          Hepsilens; kontakt lens, lens solüsyonu ve ilgili göz bakım ürünlerinin satışını gerçekleştiren
          bir e-ticaret platformudur. Hepsilens, sunduğu ürün yelpazesini, fiyatları ve hizmet koşullarını
          önceden haber vermeksizin değiştirme hakkını saklı tutar.
        </p>
      </>
    ),
  },
  {
    id: "uyelik",
    icon: "person",
    title: "3. Üyelik Koşulları",
    content: (
      <>
        <ul>
          <li>Üye olmak için <strong>18 yaşını doldurmuş</strong> olmanız ya da veli/vasi onayı gereklidir.</li>
          <li>Kayıt sırasında doğru, güncel ve eksiksiz bilgi vermek zorunludur.</li>
          <li>Hesabınızın güvenliğinden ve şifrenizin gizliliğinden <strong>siz sorumlusunuzdur</strong>.</li>
          <li>Yetkisiz erişim tespit etmeniz halinde derhal <strong>destek@hepsilens.com</strong> adresine bildiriniz.</li>
          <li>Hepsilens; sahte bilgi verildiği, hizmet şartlarının ihlal edildiği ya da kötüye kullanım
              tespit edildiği durumlarda hesabı askıya alma veya kapatma hakkını saklı tutar.</li>
        </ul>
      </>
    ),
  },
  {
    id: "siparis",
    icon: "shopping_bag",
    title: "4. Sipariş, Fiyat ve Ödeme",
    content: (
      <>
        <ul>
          <li>Sipariş oluşturulması bir <strong>satın alma teklifi</strong> niteliğindedir; sipariş onay
              e-postasının gönderilmesiyle satış sözleşmesi kurulmuş olur.</li>
          <li>Fiyatlara <strong>KDV dahildir</strong>; kargo ücreti sepet özetinde ayrıca gösterilir.</li>
          <li>Hepsilens, stok tükenmesi veya fiyat hatası durumunda siparişi iptal etme ve bedeli iade etme
              hakkını saklı tutar; bu durum kullanıcıya e-posta ile bildirilir.</li>
          <li>Ödeme; kredi/banka kartı veya havale / EFT ile yapılır. Kart bilgileri Hepsilens sistemlerinde
              saklanmaz; işlemler PCI-DSS uyumlu altyapı üzerinden gerçekleştirilir.</li>
          <li>Taksit seçenekleri, bankalara ve kampanya dönemlerine göre değişiklik gösterebilir.</li>
        </ul>
      </>
    ),
  },
  {
    id: "teslimat",
    icon: "local_shipping",
    title: "5. Teslimat",
    content: (
      <>
        <ul>
          <li>Siparişler, stok ve ödeme onayına bağlı olarak genellikle <strong>1–3 iş günü</strong> içinde kargoya verilir.</li>
          <li><strong>500 TL ve üzeri</strong> siparişlerde kargo ücretsizdir.</li>
          <li>Teslimat adresi yanlış veya eksik girilmesi durumunda doğan zarardan Hepsilens sorumlu tutulamaz.</li>
          <li>Kargo takip numarası, sipariş onay e-postasında ve hesabınızın sipariş sayfasında yer alır.</li>
        </ul>
      </>
    ),
  },
  {
    id: "fikri-mulkiyet",
    icon: "copyright",
    title: "6. Fikri Mülkiyet",
    content: (
      <>
        <p>
          Site üzerindeki tüm içerikler (logo, metin, görsel, yazılım kodu, veri tabanı) <strong>Hepsilens&apos;e
          ait</strong> olup Türkiye Cumhuriyeti ve uluslararası fikri mülkiyet mevzuatı kapsamında korunmaktadır.
        </p>
        <ul>
          <li>İçeriklerin izinsiz kopyalanması, dağıtılması veya ticari amaçla kullanılması yasaktır.</li>
          <li>Siteden sağlanan veriler otomatik araçlarla toplu olarak çekilemez (scraping / crawling).</li>
          <li>Kullanıcılar, siteye yorum veya değerlendirme göndererek Hepsilens&apos;e söz konusu içeriği
              yayımlama ve kullanma için münhasır olmayan, ücretsiz bir lisans vermiş olur.</li>
        </ul>
      </>
    ),
  },
  {
    id: "sorumluluk",
    icon: "shield",
    title: "7. Sorumluluk Sınırlaması",
    content: (
      <>
        <ul>
          <li>Hepsilens, sitenin kesintisiz veya hatasız çalışacağını garanti etmez.</li>
          <li>Üçüncü taraf sitelere yönlendiren bağlantıların içeriğinden Hepsilens sorumlu değildir.</li>
          <li>Ürünlerin kullanımından kaynaklanan tıbbi sonuçlar için Hepsilens&apos;in sorumluluğu, ilgili
              ürünün satış bedeli ile sınırlıdır.</li>
          <li>Mücbir sebep (doğal afet, salgın, siber saldırı, vb.) durumlarında Hepsilens&apos;in
              yükümlülükleri geçici olarak askıya alınabilir.</li>
        </ul>
      </>
    ),
  },
  {
    id: "uyusmazlik",
    icon: "gavel",
    title: "8. Uyuşmazlık Çözümü ve Yetkili Mahkeme",
    content: (
      <>
        <p>
          Bu Şartlar Türkiye Cumhuriyeti hukukuna tabidir. Tüketici uyuşmazlıklarında öncelikle
          <strong> Tüketici Hakem Heyeti</strong>&apos;ne başvurulabilir (2025 yılı için alt sınır: 66.000 TL).
          Bu sınırın üzerindeki uyuşmazlıklar için <strong>İstanbul (Anadolu) Tüketici Mahkemeleri</strong> yetkilidir.
        </p>
      </>
    ),
  },
  {
    id: "degisiklik",
    icon: "update",
    title: "9. Şartlarda Değişiklik",
    content: (
      <>
        <p>
          Hepsilens bu Şartları dilediği zaman güncelleyebilir. Önemli değişiklikler sitede ve/veya
          e-posta ile duyurulur. Değişiklik sonrası siteyi kullanmaya devam etmeniz, güncel Şartları
          kabul ettiğiniz anlamına gelir.
        </p>
        <p><strong>Son güncelleme:</strong> Mayıs 2026</p>
      </>
    ),
  },
];

export default function KullanimSartlariPage() {
  return (
    <LegalPage
      title="Kullanım Şartları"
      description="Hepsilens web sitesini ve hizmetlerini kullanmadan önce lütfen bu şartları dikkatlice okuyun. Siteyi kullanmaya devam etmeniz bu şartları kabul ettiğiniz anlamına gelir."
      icon="gavel"
      badge="Türk Hukuku Uyumlu"
      updatedAt="Mayıs 2026"
      breadcrumb="Kullanım Şartları"
      sections={sections}
      cta={{
        icon: "support_agent",
        title: "Sorularınız mı var?",
        body: (
          <p>
            Kullanım şartlarıyla ilgili her türlü sorunuz için{" "}
            <a href="mailto:destek@hepsilens.com" className="font-bold underline">destek@hepsilens.com</a>{" "}
            adresine yazabilirsiniz.
          </p>
        ),
      }}
    />
  );
}
