import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi — Hepsilens",
  description: "6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında Hepsilens mesafeli satış sözleşmesi ön bilgilendirme formu.",
};

const sections: LegalSection[] = [
  {
    id: "satici",
    icon: "business",
    title: "1. Satıcı Bilgileri",
    content: (
      <>
        <table>
          <tbody>
            <tr><td><strong>Ticaret Unvanı</strong></td><td>Hepsilens Medikal Optometri A.Ş.</td></tr>
            <tr><td><strong>Adres</strong></td><td>Levent Mah. Büyükdere Cad. No:127, Şişli / İstanbul</td></tr>
            <tr><td><strong>Telefon</strong></td><td>+90 (212) 000 00 00</td></tr>
            <tr><td><strong>E-posta</strong></td><td>destek@hepsilens.com</td></tr>
            <tr><td><strong>Vergi No</strong></td><td>1234567890 – İstanbul VD</td></tr>
            <tr><td><strong>MERSİS No</strong></td><td>0123456789000001</td></tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    id: "sozlesme-konusu",
    icon: "inventory_2",
    title: "2. Sözleşmenin Konusu ve Ürün Bilgileri",
    content: (
      <>
        <p>
          Bu Sözleşme; Alıcı&apos;nın hepsilens.com üzerinden elektronik ortamda sipariş verdiği ürün(ler)in
          satışı ve teslimatına ilişkin olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve
          Mesafeli Sözleşmeler Yönetmeliği hükümleri çerçevesinde Satıcı ile Alıcı arasında kurulmaktadır.
        </p>
        <p>
          Ürün bilgileri (ad, marka, teknik özellikler, birim fiyat, adet, toplam tutar ve KDV oranı)
          sipariş özeti ve onay e-postasında yer almaktadır. Söz konusu bilgiler sözleşmenin ayrılmaz
          birer parçasıdır.
        </p>
      </>
    ),
  },
  {
    id: "fiyat-odeme",
    icon: "payments",
    title: "3. Fiyat ve Ödeme",
    content: (
      <>
        <ul>
          <li>Tüm fiyatlara <strong>KDV dahildir</strong>. Varsa kargo ücreti sipariş özetinde ayrıca gösterilir.</li>
          <li><strong>500 TL ve üzeri</strong> siparişlerde kargo <strong>ücretsizdir</strong>.</li>
          <li>Ödeme; kredi kartı, banka kartı veya havale / EFT ile yapılabilir.</li>
          <li>Taksitli ödemelerde vade farkı, kart sahibi ile bankası arasındaki anlaşmaya tabidir;
              Hepsilens vade farkı talep etmez.</li>
          <li>Ödeme bilgileri Hepsilens sistemlerinde saklanmaz; tüm işlemler PCI-DSS uyumlu
              altyapı üzerinden gerçekleşir.</li>
        </ul>
      </>
    ),
  },
  {
    id: "teslimat",
    icon: "local_shipping",
    title: "4. Teslimat Koşulları",
    content: (
      <>
        <ul>
          <li>Siparişler, ödeme onayının ardından genellikle <strong>1–3 iş günü</strong> içinde kargoya verilir.</li>
          <li>Teslimat süresi, kargo firmasının yoğunluğuna bağlı olarak <strong>en fazla 30 gün</strong>dür;
              bu sürenin aşılması halinde Alıcı sözleşmeden dönme hakkına sahiptir.</li>
          <li>Kargo takip bilgisi, sipariş onay e-postasına ve hesap sayfasına yansıtılır.</li>
          <li>Adresin hatalı girilmesinden kaynaklanan teslimat sorunlarından Satıcı sorumlu tutulmaz.</li>
        </ul>
      </>
    ),
  },
  {
    id: "cayma-hakki",
    icon: "undo",
    title: "5. Cayma Hakkı",
    content: (
      <>
        <p>
          Alıcı, teslim tarihinden itibaren <strong>14 (on dört) takvim günü</strong> içinde herhangi
          bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir.
        </p>
        <p><strong>Cayma hakkının kullanımı:</strong></p>
        <ul>
          <li>
            <strong>destek@hepsilens.com</strong> adresine e-posta göndererek veya hesabınızdaki
            &quot;Siparişlerim&quot; bölümünden talep oluşturarak cayma hakkını kullanabilirsiniz.
          </li>
          <li>
            Ürün(ler) orijinal ambalajında, kullanılmamış ve eksiksiz olarak iade edilmelidir.
          </li>
          <li>
            İade kargo ücreti, ürün hatalı veya hasarlı değilse <strong>Alıcı</strong> tarafından karşılanır.
          </li>
          <li>
            Cayma bildiriminin Satıcı&apos;ya ulaşmasından itibaren en geç <strong>14 gün</strong> içinde
            ödeme iadesi yapılır. İade, ödemenin gerçekleştirildiği yöntemle (banka havalesi / kart
            iadesi) gerçekleştirilir.
          </li>
        </ul>
        <p><strong>Cayma hakkının kullanılamayacağı istisnalar (Yönetmelik Md. 15):</strong></p>
        <ul>
          <li>Alıcı&apos;nın isteği veya açıkça kişisel ihtiyaçları doğrultusunda hazırlanan ürünler</li>
          <li>Ambalajı açılmış, hijyen açısından iade edilmesi uygun olmayan ürünler
              (açılmış lens kutusu, göz damlası vb.)</li>
          <li>Fiyatı döviz kuruna bağlı olarak değişen ürünler</li>
        </ul>
      </>
    ),
  },
  {
    id: "garanti",
    icon: "verified",
    title: "6. Garanti ve Ayıplı Mal",
    content: (
      <>
        <p>
          Satıcı, teslim ettiği ürünlerin sipariş anındaki tanıma uygun, sağlam ve kullanıma elverişli
          olduğunu garanti eder.
        </p>
        <ul>
          <li>
            Teslimatta hasarlı veya yanlış ürün gönderilmesi halinde Alıcı; <strong>ücretsiz değişim</strong>,
            <strong> tam iade</strong> veya <strong>ayıp oranında indirim</strong> haklarından birini seçebilir.
          </li>
          <li>
            Ayıplı mal bildirimi teslim tarihinden itibaren <strong>2 yıl</strong> içinde yapılmalıdır.
          </li>
          <li>
            Ambalajı açılmış ve kullanılmış kontakt lensler hijyenik nedenlerle değiştirilemez;
            ancak üretim hatası söz konusuysa tedarikçi garantisi kapsamında işlem yapılır.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "uyusmazlik",
    icon: "gavel",
    title: "7. Uyuşmazlık Çözümü",
    content: (
      <>
        <p>
          Alıcı, şikâyetlerini öncelikle <strong>destek@hepsilens.com</strong> adresine iletebilir.
          Çözüme kavuşturulamazsa aşağıdaki mercilere başvurulabilir:
        </p>
        <ul>
          <li>
            <strong>Tüketici Hakem Heyeti:</strong> 2025 yılı için belirlenen parasal sınır altındaki
            uyuşmazlıklar (ilçe veya il heyetleri)
          </li>
          <li>
            <strong>Tüketici Mahkemesi:</strong> Parasal sınırın üzerindeki uyuşmazlıklar
          </li>
          <li>
            <strong>e-Devlet / BTK:</strong> E-ticaret şikâyetleri için şikayetvar.gov.tr
          </li>
        </ul>
        <p>
          Bu Sözleşme Türkiye Cumhuriyeti hukukuna tabi olup yetkili mahkeme <strong>İstanbul (Anadolu)
          Tüketici Mahkemesi</strong>&apos;dir.
        </p>
      </>
    ),
  },
  {
    id: "genel",
    icon: "info",
    title: "8. Genel Hükümler",
    content: (
      <>
        <ul>
          <li>
            Alıcı, sipariş vermeden önce bu ön bilgilendirme formunu okuduğunu ve onayladığını
            kabul eder.
          </li>
          <li>
            Sözleşme, taraflarca imzalanmamakta; elektronik onay (sipariş butonu) ile kurulmaktadır.
            Bu onay 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun kapsamında geçerlidir.
          </li>
          <li>
            Sözleşme bir nüshası, sipariş onay e-postasına eklenerek Alıcı&apos;ya iletilir ve
            Alıcı&apos;nın hesap sayfasında erişilebilir olarak tutulur.
          </li>
        </ul>
        <p><strong>Son güncelleme:</strong> Mayıs 2026</p>
      </>
    ),
  },
];

export default function MesafeliSatisPage() {
  return (
    <LegalPage
      title="Mesafeli Satış Sözleşmesi"
      description="6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında hazırlanmış ön bilgilendirme formu ve sözleşme metni."
      icon="description"
      badge="6502 Sayılı Kanun Uyumlu"
      updatedAt="Mayıs 2026"
      breadcrumb="Mesafeli Satış Sözleşmesi"
      sections={sections}
      cta={{
        icon: "support_agent",
        title: "İade ve değişim talebi oluşturun",
        body: (
          <p>
            Cayma hakkınızı kullanmak veya hasarlı ürün bildirmek için{" "}
            <a href="mailto:destek@hepsilens.com" className="font-bold underline">destek@hepsilens.com</a>{" "}
            adresine e-posta gönderin ya da hesabınızdaki &quot;Siparişlerim&quot; bölümünden talep oluşturun.
          </p>
        ),
      }}
    />
  );
}
