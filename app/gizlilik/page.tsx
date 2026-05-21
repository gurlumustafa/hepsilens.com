import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gizlilik Politikası — Hepsilens",
  description: "Hepsilens gizlilik politikası: kişisel verilerinizi nasıl topladığımız, işlediğimiz ve koruduğumuz hakkında bilgi edinin.",
};

const sections = [
  {
    id: "veri-sorumlusu",
    icon: "business",
    title: "1. Veri Sorumlusu",
    content: (
      <>
        <p>
          Bu Gizlilik Politikası, <strong>Hepsilens Medikal Optometri A.Ş.</strong> (&quot;Hepsilens&quot;, &quot;biz&quot; veya &quot;şirket&quot;) tarafından, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamındaki yükümlülüklerimiz çerçevesinde hazırlanmıştır.
        </p>
        <p>
          Adres: Levent Mah. Büyükdere Cad. No:127, Şişli / İstanbul<br />
          E-posta: <a href="mailto:kvkk@hepsilens.com">kvkk@hepsilens.com</a>
        </p>
      </>
    ),
  },
  {
    id: "toplanan-veriler",
    icon: "database",
    title: "2. Toplanan Kişisel Veriler",
    content: (
      <>
        <p>Hepsilens, aşağıdaki kategorilerde kişisel veri işlemektedir:</p>
        <table>
          <thead>
            <tr><th>Veri Kategorisi</th><th>Örnekler</th><th>Toplama Yöntemi</th></tr>
          </thead>
          <tbody>
            <tr><td>Kimlik Bilgileri</td><td>Ad, soyad</td><td>Üyelik / sipariş formu</td></tr>
            <tr><td>İletişim Bilgileri</td><td>E-posta, telefon, adres</td><td>Üyelik / sipariş formu</td></tr>
            <tr><td>Sipariş Bilgileri</td><td>Ürün seçimi, fatura, teslimat</td><td>Alışveriş süreci</td></tr>
            <tr><td>Sağlık Verisi</td><td>Göz numarası / reçete</td><td>Reçete yükleme formu</td></tr>
            <tr><td>Finansal Bilgiler</td><td>Ödeme yöntemi (kart bilgisi saklanmaz)</td><td>Ödeme altyapısı</td></tr>
            <tr><td>Teknik Veriler</td><td>IP adresi, tarayıcı, çerezler</td><td>Otomatik – site kullanımı</td></tr>
          </tbody>
        </table>
        <p>
          <strong>Özel nitelikli kişisel veri:</strong> Göz reçeteleri KVKK kapsamında özel nitelikli sağlık verisi olarak değerlendirilmektedir. Bu veriler yalnızca sipariş işlemleri için kullanılmakta ve şifreli olarak saklanmaktadır.
        </p>
      </>
    ),
  },
  {
    id: "isleme-amaci",
    icon: "task",
    title: "3. Kişisel Verilerin İşlenme Amaçları",
    content: (
      <>
        <p>Toplanan veriler aşağıdaki amaçlarla işlenmektedir:</p>
        <ul>
          <li>Üyelik oluşturulması ve hesap yönetimi</li>
          <li>Siparişlerin alınması, işlenmesi ve teslimatın sağlanması</li>
          <li>Fatura düzenlenmesi ve muhasebe yükümlülüklerinin yerine getirilmesi</li>
          <li>Müşteri hizmetleri ve iade/değişim işlemlerinin yürütülmesi</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi (vergi, SGK, vb.)</li>
          <li>Açık rızanız bulunması halinde: e-posta veya SMS ile kampanya bildirimi</li>
          <li>Site güvenliğinin sağlanması ve dolandırıcılık önleme</li>
        </ul>
      </>
    ),
  },
  {
    id: "hukuki-sebep",
    icon: "gavel",
    title: "4. İşlemenin Hukuki Dayanağı",
    content: (
      <>
        <p>Kişisel verileriniz KVKK Madde 5 kapsamında aşağıdaki hukuki dayanaklara göre işlenmektedir:</p>
        <ul>
          <li><strong>Sözleşmenin ifası:</strong> Sipariş ve teslimat işlemleri için zorunlu veriler</li>
          <li><strong>Kanuni yükümlülük:</strong> Muhasebe ve yasal raporlama verileri</li>
          <li><strong>Meşru menfaat:</strong> Site güvenliği ve dolandırıcılık önleme verileri</li>
          <li><strong>Açık rıza:</strong> Pazarlama ve kampanya bildirimleri; sağlık verisi işleme</li>
        </ul>
      </>
    ),
  },
  {
    id: "veri-aktarimi",
    icon: "share",
    title: "5. Kişisel Verilerin Aktarımı",
    content: (
      <>
        <p>Kişisel verileriniz; hizmet kalitesini sağlamak amacıyla aşağıdaki taraflarla, yalnızca gerekli minimum kapsamda paylaşılmaktadır:</p>
        <ul>
          <li><strong>Kargo ve lojistik firmaları:</strong> Siparişin teslimi için ad, adres ve telefon bilgisi</li>
          <li><strong>Ödeme altyapı sağlayıcıları:</strong> Ödeme güvenliğinin sağlanması için (PCI-DSS uyumlu; kart verisi Hepsilens sistemlerinde saklanmaz)</li>
          <li><strong>Bulut hizmet sağlayıcıları:</strong> Veri barındırma — Türkiye veya AB sınırları içinde</li>
          <li><strong>Yetkili kamu kurum ve kuruluşları:</strong> Yasal zorunluluk halinde ilgili mevzuat çerçevesinde</li>
        </ul>
        <p>Verileriniz üçüncü taraf reklam şirketlerine veya veri aracılarına <strong>satılmamaktadır</strong>.</p>
      </>
    ),
  },
  {
    id: "cerezler",
    icon: "cookie",
    title: "6. Çerezler (Cookies)",
    content: (
      <>
        <p>
          Hepsilens web sitesi, kullanıcı deneyimini geliştirmek ve siteyi işletmek amacıyla çerezler kullanmaktadır.
        </p>
        <table>
          <thead>
            <tr><th>Çerez Türü</th><th>Amacı</th><th>Süre</th></tr>
          </thead>
          <tbody>
            <tr><td>Zorunlu Çerezler</td><td>Oturum yönetimi, sepet, güvenlik</td><td>Oturum süresi</td></tr>
            <tr><td>Analitik Çerezler</td><td>Sayfa ziyareti ve kullanım istatistikleri</td><td>12 ay</td></tr>
            <tr><td>Pazarlama Çerezleri</td><td>Kişiselleştirilmiş reklam (rızayla)</td><td>90 gün</td></tr>
          </tbody>
        </table>
        <p>
          Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz. Zorunlu çerezlerin kapatılması, sitenin düzgün çalışmasını etkileyebilir.
        </p>
      </>
    ),
  },
  {
    id: "saklama-suresi",
    icon: "schedule",
    title: "7. Veri Saklama Süresi",
    content: (
      <>
        <p>Kişisel verileriniz, işlenme amacının ortadan kalkmasının ardından aşağıdaki süreler boyunca saklanmaktadır:</p>
        <ul>
          <li><strong>Sipariş ve fatura kayıtları:</strong> 10 yıl (Türk Ticaret Kanunu gereği)</li>
          <li><strong>Üyelik ve hesap bilgileri:</strong> Hesap silinmesinin ardından 1 yıl</li>
          <li><strong>Reçete (göz numarası) bilgisi:</strong> Siparişin tamamlanmasından itibaren 2 yıl</li>
          <li><strong>İletişim ve destek talepleri:</strong> Talebin kapanmasından itibaren 1 yıl</li>
          <li><strong>Analitik ve teknik loglar:</strong> 90 gün</li>
        </ul>
        <p>Saklama süresi dolan veriler, geri dönüşümsüz biçimde silinmekte veya anonimleştirilmektedir.</p>
      </>
    ),
  },
  {
    id: "haklariniz",
    icon: "verified_user",
    title: "8. KVKK Kapsamındaki Haklarınız",
    content: (
      <>
        <p>KVKK Madde 11 çerçevesinde aşağıdaki haklara sahipsiniz:</p>
        <ul>
          <li>Kişisel verilerinizin işlenip işlenmediğini <strong>öğrenme</strong></li>
          <li>İşleniyorsa buna ilişkin bilgi <strong>talep etme</strong></li>
          <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını <strong>öğrenme</strong></li>
          <li>Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri <strong>bilme</strong></li>
          <li>Eksik veya yanlış işlenmiş verilerin <strong>düzeltilmesini isteme</strong></li>
          <li>Kanunda öngörülen şartlar çerçevesinde verilerin <strong>silinmesini veya yok edilmesini isteme</strong></li>
          <li>İşlenen verilerin münhasıran otomatik sistemler aracılığıyla analiz edilmesi sureti ile aleyhinize bir sonucun ortaya çıkmasına <strong>itiraz etme</strong></li>
          <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle <strong>zararın giderilmesini talep etme</strong></li>
        </ul>
        <p>
          Başvurularınızı <a href="mailto:kvkk@hepsilens.com">kvkk@hepsilens.com</a> adresine e-posta yoluyla veya aşağıdaki adresimize yazılı olarak iletebilirsiniz. Başvurular 30 gün içinde yanıtlanır.
        </p>
      </>
    ),
  },
  {
    id: "guncelleme",
    icon: "update",
    title: "9. Politika Güncellemeleri",
    content: (
      <>
        <p>
          Bu Gizlilik Politikası zaman zaman güncellenebilir. Önemli değişiklikler yapılması halinde kayıtlı e-posta adresinize bildirim gönderilecektir. Politikanın güncel halini her zaman bu sayfada bulabilirsiniz.
        </p>
        <p><strong>Son güncelleme:</strong> Mayıs 2026</p>
      </>
    ),
  },
];

export default function GizlilikPage() {
  return (
    <div className="pt-[72px] pb-20">

      {/* Hero */}
      <section className="bg-[#f5f6fc] border-b border-[#edeef3]">
        <div className="max-w-[900px] mx-auto px-8 py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-[#737685] hover:text-[#003d9b] transition-colors flex items-center gap-1" style={{ fontSize: "13px", fontWeight: 600 }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>home</span>Anasayfa
            </Link>
            <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "16px" }}>chevron_right</span>
            <span className="text-[#003d9b]" style={{ fontSize: "13px", fontWeight: 600 }}>Gizlilik Politikası</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#dae2ff]">
              <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>privacy_tip</span>
            </div>
            <div className="flex items-center gap-3 text-[#737685]" style={{ fontSize: "12px" }}>
              <span>Mayıs 2026</span>
              <span>·</span>
              <span>KVKK Uyumlu</span>
            </div>
          </div>

          <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: "#191c1e", lineHeight: 1.2 }}>
            Gizlilik Politikası
          </h1>
          <p className="text-[#737685] mt-3" style={{ fontSize: "16px", lineHeight: "26px" }}>
            Kişisel verilerinizin gizliliği ve güvenliği bizim için birinci önceliktir. Bu politika, hangi verileri topladığımızı, neden topladığımızı ve haklarınızı açıklar.
          </p>
        </div>
      </section>

      {/* İçerik */}
      <div className="max-w-[900px] mx-auto px-8">

        {/* Hızlı gezinme */}
        <nav className="my-10 p-5 bg-[#f5f6fc] rounded-2xl border border-[#edeef3]">
          <p className="text-[#737685] font-bold mb-3" style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }}>İçindekiler</p>
          <ol className="flex flex-col gap-1.5" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`}
                  className="text-[#003d9b] hover:underline"
                  style={{ fontSize: "13px", fontWeight: 500 }}>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Bölümler */}
        <div className="blog-content flex flex-col gap-12">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#dae2ff] flex-shrink-0">
                  <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                </div>
                <h2 style={{ margin: 0, fontSize: "clamp(17px,2vw,21px)" }}>{s.title}</h2>
              </div>
              <div className="pl-12">
                {s.content}
              </div>
            </section>
          ))}
        </div>

        {/* Başvuru CTA */}
        <div className="mt-14 p-6 bg-[#dae2ff] rounded-2xl">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-[#003d9b] flex-shrink-0" style={{ fontSize: "24px", fontVariationSettings: "'FILL' 1" }}>mail</span>
            <div>
              <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px", fontWeight: 700, color: "#003d9b", marginBottom: "4px" }}>
                KVKK Başvurusu için bize ulaşın
              </p>
              <p className="text-[#003d9b]" style={{ fontSize: "13px", lineHeight: "20px", opacity: 0.8 }}>
                Kişisel verilerinizle ilgili her türlü talebinizi{" "}
                <a href="mailto:kvkk@hepsilens.com" className="font-bold underline">kvkk@hepsilens.com</a>{" "}
                adresine iletebilirsiniz. Başvurular 30 gün içinde yanıtlanır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
