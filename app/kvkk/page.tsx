import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni — Hepsilens",
  description: "6698 sayılı KVKK kapsamında Hepsilens tarafından kişisel verilerinizin işlenmesine ilişkin aydınlatma metni.",
};

const sections: LegalSection[] = [
  {
    id: "veri-sorumlusu",
    icon: "business",
    title: "1. Veri Sorumlusunun Kimliği",
    content: (
      <>
        <p>
          Bu aydınlatma metni, <strong>Hepsilens Medikal Optometri A.Ş.</strong> tarafından 6698 sayılı
          Kişisel Verilerin Korunması Kanunu&apos;nun (&quot;KVKK&quot;) 10. maddesi kapsamında, veri sorumlusu
          sıfatıyla hazırlanmıştır.
        </p>
        <table>
          <tbody>
            <tr><td><strong>Ticaret Unvanı</strong></td><td>Hepsilens Medikal Optometri A.Ş.</td></tr>
            <tr><td><strong>Adres</strong></td><td>Levent Mah. Büyükdere Cad. No:127, Şişli / İstanbul</td></tr>
            <tr><td><strong>Vergi No</strong></td><td>1234567890 – İstanbul VD</td></tr>
            <tr><td><strong>KEP</strong></td><td>hepsilens@hs01.kep.tr</td></tr>
            <tr><td><strong>E-posta</strong></td><td>kvkk@hepsilens.com</td></tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    id: "islenen-veriler",
    icon: "database",
    title: "2. İşlenen Kişisel Veriler",
    content: (
      <>
        <p>Sitemizi kullanmanıza bağlı olarak aşağıdaki kişisel veriler işlenmektedir:</p>
        <table>
          <thead>
            <tr><th>Veri Kategorisi</th><th>İşlenen Veriler</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Kimlik</strong></td>
              <td>Ad, soyad</td>
            </tr>
            <tr>
              <td><strong>İletişim</strong></td>
              <td>E-posta adresi, telefon numarası, teslimat ve fatura adresi</td>
            </tr>
            <tr>
              <td><strong>Müşteri İşlem</strong></td>
              <td>Sipariş geçmişi, sepet içeriği, iade talepleri</td>
            </tr>
            <tr>
              <td><strong>Özel Nitelikli Sağlık Verisi</strong></td>
              <td>Göz reçetesi / numarası (yalnızca reçeteli lens siparişlerinde, açık rızayla)</td>
            </tr>
            <tr>
              <td><strong>Finans</strong></td>
              <td>Ödeme yöntemi türü, taksit bilgisi (kart numarası Hepsilens sistemlerinde saklanmaz)</td>
            </tr>
            <tr>
              <td><strong>Teknik / İşlem Güvenliği</strong></td>
              <td>IP adresi, tarayıcı türü, oturum token&apos;ı, çerezler, son giriş tarihi</td>
            </tr>
            <tr>
              <td><strong>Pazarlama</strong></td>
              <td>E-posta / SMS tercihleri, favori ürünler (açık rızayla)</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    id: "isleme-amaci",
    icon: "task",
    title: "3. Kişisel Verilerin İşlenme Amaçları ve Hukuki Dayanakları",
    content: (
      <>
        <table>
          <thead>
            <tr><th>Amaç</th><th>Hukuki Dayanak (KVKK Md. 5)</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Üyelik ve hesap yönetimi</td>
              <td>Sözleşmenin kurulması ve ifası</td>
            </tr>
            <tr>
              <td>Sipariş alınması, hazırlanması, kargoya verilmesi</td>
              <td>Sözleşmenin ifası</td>
            </tr>
            <tr>
              <td>Fatura düzenlenmesi, muhasebe ve vergi yükümlülükleri</td>
              <td>Kanuni yükümlülük (VUK, TTK)</td>
            </tr>
            <tr>
              <td>Müşteri hizmetleri, iade ve değişim işlemleri</td>
              <td>Sözleşmenin ifası / Kanuni yükümlülük</td>
            </tr>
            <tr>
              <td>Dolandırıcılık önleme, site güvenliği</td>
              <td>Meşru menfaat</td>
            </tr>
            <tr>
              <td>E-posta / SMS ile kampanya ve bildirim gönderimi</td>
              <td>Açık rıza</td>
            </tr>
            <tr>
              <td>Göz reçetesi işlenmesi (özel nitelikli veri)</td>
              <td>Açık rıza (KVKK Md. 6)</td>
            </tr>
            <tr>
              <td>İstatistik ve analitik (anonimleştirilmiş)</td>
              <td>Meşru menfaat</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    id: "aktarim",
    icon: "share",
    title: "4. Kişisel Verilerin Aktarıldığı Taraflar",
    content: (
      <>
        <p>Kişisel verileriniz yalnızca aşağıdaki kategorideki alıcı gruplarına ve gereken minimum düzeyde aktarılmaktadır:</p>
        <table>
          <thead>
            <tr><th>Alıcı Grubu</th><th>Aktarım Amacı</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Kargo ve lojistik firmaları</td>
              <td>Siparişin teslim edilmesi (ad, adres, telefon)</td>
            </tr>
            <tr>
              <td>Ödeme altyapı sağlayıcısı</td>
              <td>Güvenli ödeme işlemi (PCI-DSS uyumlu; kart verisi Hepsilens&apos;te saklanmaz)</td>
            </tr>
            <tr>
              <td>Bulut / hosting hizmet sağlayıcısı</td>
              <td>Veri barındırma — Türkiye veya AB sunucuları</td>
            </tr>
            <tr>
              <td>E-posta / SMS altyapı sağlayıcısı</td>
              <td>Bildirim ve kampanya gönderimi (yalnızca rızanız dahilinde)</td>
            </tr>
            <tr>
              <td>Mali müşavir / muhasebe</td>
              <td>Yasal muhasebe yükümlülükleri</td>
            </tr>
            <tr>
              <td>Yetkili kamu kurum ve kuruluşları</td>
              <td>Yasal talep / zorunluluk halinde</td>
            </tr>
          </tbody>
        </table>
        <p>Verileriniz hiçbir koşulda üçüncü taraf reklam şirketlerine veya veri aracılarına <strong>satılmamakta</strong> ya da kiralanmamaktadır.</p>
      </>
    ),
  },
  {
    id: "toplama-yontemi",
    icon: "wifi",
    title: "5. Kişisel Veri Toplama Yöntemi",
    content: (
      <>
        <p>Kişisel verileriniz aşağıdaki yöntemlerle toplanmaktadır:</p>
        <ul>
          <li><strong>Elektronik ortam:</strong> Web sitesi kayıt ve sipariş formları, ödeme sayfası, canlı destek, e-posta ve SMS</li>
          <li><strong>Otomatik yöntemler:</strong> Çerezler, sunucu logları, IP adresi kaydı</li>
          <li><strong>Üçüncü taraf:</strong> Google ile giriş (OAuth 2.0) aracılığıyla alınan ad ve e-posta</li>
        </ul>
      </>
    ),
  },
  {
    id: "saklama",
    icon: "schedule",
    title: "6. Veri Saklama Süreleri",
    content: (
      <>
        <table>
          <thead>
            <tr><th>Veri</th><th>Saklama Süresi</th><th>Dayanak</th></tr>
          </thead>
          <tbody>
            <tr><td>Fatura ve sipariş kayıtları</td><td>10 yıl</td><td>TTK Md. 82, VUK Md. 253</td></tr>
            <tr><td>Sözleşme ve kullanım şartları</td><td>10 yıl</td><td>TTK Md. 82</td></tr>
            <tr><td>Üyelik ve hesap bilgileri</td><td>Hesap silme + 1 yıl</td><td>Meşru menfaat</td></tr>
            <tr><td>Destek talebi kayıtları</td><td>Kapanma + 1 yıl</td><td>Meşru menfaat</td></tr>
            <tr><td>Göz reçetesi bilgisi</td><td>Sipariş + 2 yıl</td><td>Açık rıza</td></tr>
            <tr><td>Pazarlama tercihleri</td><td>Rıza geri alınana kadar</td><td>Açık rıza</td></tr>
            <tr><td>Teknik log kayıtları</td><td>90 gün</td><td>Meşru menfaat</td></tr>
          </tbody>
        </table>
        <p>Saklama süreleri sona erdiğinde verileriniz geri döndürülemez biçimde silinmekte veya anonimleştirilmektedir.</p>
      </>
    ),
  },
  {
    id: "haklariniz",
    icon: "verified_user",
    title: "7. KVKK Madde 11 Kapsamındaki Haklarınız",
    content: (
      <>
        <p>Veri sahibi olarak aşağıdaki haklara sahipsiniz:</p>
        <ul>
          <li>Kişisel verilerinizin işlenip işlenmediğini <strong>öğrenme</strong></li>
          <li>İşleniyorsa buna ilişkin bilgi <strong>talep etme</strong></li>
          <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını <strong>öğrenme</strong></li>
          <li>Yurt içinde / yurt dışında aktarıldığı üçüncü kişileri <strong>bilme</strong></li>
          <li>Eksik veya yanlış verilerin <strong>düzeltilmesini isteme</strong></li>
          <li>Şartların oluşması halinde verilerin <strong>silinmesini veya yok edilmesini</strong> isteme</li>
          <li>Düzeltme / silme işlemlerinin üçüncü taraflara <strong>bildirilmesini</strong> talep etme</li>
          <li>Yalnızca otomatik işlemle aleyhinize sonuç doğurulmasına <strong>itiraz etme</strong></li>
          <li>Kanuna aykırı işleme nedeniyle uğranılan <strong>zararın tazminini</strong> talep etme</li>
        </ul>
        <p>
          Başvurularınızı <strong>kvkk@hepsilens.com</strong> adresine veya yukarıdaki posta adresimize yazılı olarak iletebilirsiniz.
          Kimlik doğrulama sonrasında başvurular en geç <strong>30 gün</strong> içinde yanıtlanır.
          Başvurunun reddedilmesi ya da yanıttan tatmin olunmaması halinde{" "}
          <strong>Kişisel Verileri Koruma Kurulu&apos;na</strong> (kvkk.gov.tr) başvurma hakkınız saklıdır.
        </p>
      </>
    ),
  },
];

export default function KvkkPage() {
  return (
    <LegalPage
      title="KVKK Aydınlatma Metni"
      description="6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 10. maddesi uyarınca kişisel verilerinizin işlenmesine ilişkin bilgiler aşağıda sunulmaktadır."
      icon="privacy_tip"
      badge="KVKK Md. 10 Uyumlu"
      updatedAt="Mayıs 2026"
      breadcrumb="KVKK Aydınlatma Metni"
      sections={sections}
      cta={{
        icon: "mail",
        title: "KVKK Başvurusu",
        body: (
          <p>
            Haklarınızı kullanmak için{" "}
            <a href="mailto:kvkk@hepsilens.com" className="font-bold underline">kvkk@hepsilens.com</a>{" "}
            adresine e-posta gönderin. Kimlik doğrulamanızın ardından başvurunuz 30 gün içinde yanıtlanır.
          </p>
        ),
      }}
    />
  );
}
