import type { Metadata } from "next";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Çerez Politikası — Hepsilens",
  description: "Hepsilens web sitesinde kullanılan çerezler, amaçları ve nasıl yönetebileceğinize dair bilgiler.",
};

const sections: LegalSection[] = [
  {
    id: "cerez-nedir",
    icon: "cookie",
    title: "1. Çerez Nedir?",
    content: (
      <>
        <p>
          Çerezler (cookies), bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza
          yerleştirilen küçük metin dosyalarıdır. Çerezler, oturum bilgisi, dil tercihi veya sepet içeriği
          gibi verileri geçici ya da kalıcı olarak saklar.
        </p>
        <p>
          Hepsilens, yalnızca sitenin işleyişi, kullanıcı deneyimi ve —açık rızanız dahilinde— pazarlama
          faaliyetleri için çerez kullanmaktadır.
        </p>
      </>
    ),
  },
  {
    id: "cerez-turleri",
    icon: "category",
    title: "2. Kullandığımız Çerezler",
    content: (
      <>
        <table>
          <thead>
            <tr><th>Çerez Türü</th><th>Amacı</th><th>Saklama Süresi</th><th>Rıza</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Zorunlu Çerezler</strong></td>
              <td>Oturum yönetimi (hl_session), CSRF koruması, sepet verisi</td>
              <td>Oturum / 30 gün</td>
              <td>Gerekmez</td>
            </tr>
            <tr>
              <td><strong>İşlevsel Çerezler</strong></td>
              <td>Dil ve bölge tercihi, son görüntülenen ürünler</td>
              <td>1 yıl</td>
              <td>Gerekmez</td>
            </tr>
            <tr>
              <td><strong>Analitik Çerezler</strong></td>
              <td>Sayfa ziyareti istatistikleri, kullanıcı davranışı (anonim)</td>
              <td>12 ay</td>
              <td>Açık rıza</td>
            </tr>
            <tr>
              <td><strong>Pazarlama Çerezleri</strong></td>
              <td>İlgi alanına göre reklam, yeniden hedefleme</td>
              <td>90 gün</td>
              <td>Açık rıza</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    id: "birinci-ucuncu",
    icon: "hub",
    title: "3. Birinci Taraf ve Üçüncü Taraf Çerezler",
    content: (
      <>
        <p>
          <strong>Birinci taraf çerezler</strong>, doğrudan Hepsilens tarafından yerleştirilir ve yalnızca
          sitemizin işleyişi için kullanılır.
        </p>
        <p>
          <strong>Üçüncü taraf çerezler</strong>, aşağıdaki hizmet sağlayıcılar tarafından yerleştirilebilir:
        </p>
        <table>
          <thead>
            <tr><th>Sağlayıcı</th><th>Amaç</th><th>Gizlilik Politikası</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Google Analytics</td>
              <td>Anonim site trafiği analizi</td>
              <td><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com</a></td>
            </tr>
            <tr>
              <td>Google OAuth</td>
              <td>Google ile giriş işlemi</td>
              <td><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com</a></td>
            </tr>
            <tr>
              <td>Ödeme altyapı sağlayıcısı</td>
              <td>Güvenli ödeme doğrulaması</td>
              <td>Sağlayıcı politikasına tabidir</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    id: "yonetim",
    icon: "settings",
    title: "4. Çerezleri Nasıl Yönetebilirsiniz?",
    content: (
      <>
        <p>
          Zorunlu çerezler dışındakileri dilediğiniz zaman devre dışı bırakabilirsiniz:
        </p>
        <ul>
          <li>
            <strong>Tarayıcı ayarları:</strong> Çerezleri engellemek, silmek veya uyarı almak için
            tarayıcınızın gizlilik / güvenlik ayarlarını kullanın.
            (<a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a>,{" "}
            <a href="https://support.mozilla.org/tr/kb/cerezleri-etkinlestirme-ve-devre-disi-birakma" target="_blank" rel="noopener noreferrer">Firefox</a>,{" "}
            <a href="https://support.apple.com/tr-tr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a>)
          </li>
          <li>
            <strong>Hesap tercihleriniz:</strong> Pazarlama bildirimlerini hesabınızın &quot;Ayarlar&quot;
            bölümünden kapatabilirsiniz.
          </li>
        </ul>
        <p>
          <strong>Uyarı:</strong> Zorunlu çerezlerin kapatılması, sepet, oturum ve ödeme gibi temel
          işlevlerin çalışmamasına yol açabilir.
        </p>
      </>
    ),
  },
  {
    id: "guncelleme",
    icon: "update",
    title: "5. Politika Güncellemeleri",
    content: (
      <>
        <p>
          Bu Çerez Politikası, mevzuat değişiklikleri veya kullandığımız araçların güncellenmesi
          halinde revize edilebilir. Önemli değişiklikler sitede duyurulur.
        </p>
        <p><strong>Son güncelleme:</strong> Mayıs 2026</p>
      </>
    ),
  },
];

export default function CerezPolitikasiPage() {
  return (
    <LegalPage
      title="Çerez Politikası"
      description="Hepsilens olarak çerezleri yalnızca sitenin çalışması ve deneyiminizi iyileştirmek için kullanıyoruz. Hangi çerezleri neden kullandığımızı aşağıda açıklıyoruz."
      icon="cookie"
      badge="ePrivacy Uyumlu"
      updatedAt="Mayıs 2026"
      breadcrumb="Çerez Politikası"
      sections={sections}
      cta={{
        icon: "help",
        title: "Çerezler hakkında sorunuz mu var?",
        body: (
          <p>
            <a href="mailto:kvkk@hepsilens.com" className="font-bold underline">kvkk@hepsilens.com</a>{" "}
            adresine yazarak bilgi alabilirsiniz.
          </p>
        ),
      }}
    />
  );
}
