import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reçete Rehberi — Hepsilens",
  description: "Kontakt lens reçetesini nasıl okuyacağınızı, gözlük reçetesiyle farkını ve reçetenizi nasıl yükleyeceğinizi öğrenin.",
};

export default function ReceteRehberiPage() {
  return (
    <div className="pt-[72px] pb-20">

      {/* Hero */}
      <section className="bg-[#f5f6fc] border-b border-[#edeef3]">
        <div className="max-w-[860px] mx-auto px-8 py-14">
          <nav className="flex items-center gap-2 mb-8">
            <Link href="/" className="text-[#737685] hover:text-[#003d9b] transition-colors flex items-center gap-1" style={{ fontSize: "13px", fontWeight: 600 }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>home</span>Anasayfa
            </Link>
            <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "16px" }}>chevron_right</span>
            <Link href="/yardim/sss" className="text-[#737685] hover:text-[#003d9b] transition-colors" style={{ fontSize: "13px", fontWeight: 600 }}>Yardım</Link>
            <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "16px" }}>chevron_right</span>
            <span className="text-[#003d9b]" style={{ fontSize: "13px", fontWeight: 600 }}>Reçete Rehberi</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#dcfce7]">
              <span className="material-symbols-outlined text-[#16a34a]" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>ophthalmology</span>
            </div>
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: "#191c1e", lineHeight: 1.2 }}>
            Reçete Rehberi
          </h1>
          <p className="text-[#737685] mt-3" style={{ fontSize: "16px", lineHeight: "26px" }}>
            Kontakt lens reçetesini nasıl okuyacağınızı, gözlük reçetesinden farkını ve siparişte nasıl kullanacağınızı adım adım açıklıyoruz.
          </p>
        </div>
      </section>

      <div className="max-w-[860px] mx-auto px-8 blog-content">

        <div className="callout mt-10">
          <p><strong>Önemli:</strong> Kontakt lens reçetesi, gözlük reçetesinden farklıdır. Göz doktorunuzdan özellikle <strong>kontakt lens reçetesi</strong> istemeniz gerekir.</p>
        </div>

        <h2>Reçetenin Kısımları Ne Anlama Gelir?</h2>
        <p>Kontakt lens reçetenizde aşağıdaki değerleri göreceksiniz:</p>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Kısaltma</th>
                <th>Açık Adı</th>
                <th>Anlamı</th>
                <th>Örnek</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>PWR / SPH</strong></td>
                <td>Power / Sphere</td>
                <td>Miyopi (–) veya hipermetropi (+) numarası</td>
                <td>–2.50</td>
              </tr>
              <tr>
                <td><strong>BC</strong></td>
                <td>Base Curve</td>
                <td>Lensin arka eğriliği; kornea eğriliğinize uyum sağlar</td>
                <td>8.6 mm</td>
              </tr>
              <tr>
                <td><strong>DIA</strong></td>
                <td>Diameter</td>
                <td>Lensin çapı</td>
                <td>14.2 mm</td>
              </tr>
              <tr>
                <td><strong>CYL</strong></td>
                <td>Cylinder</td>
                <td>Astigmat düzeltme gücü (toric lenslerde)</td>
                <td>–1.25</td>
              </tr>
              <tr>
                <td><strong>AXIS / AX</strong></td>
                <td>Axis</td>
                <td>Astigmatın yönü (0–180 derece)</td>
                <td>90°</td>
              </tr>
              <tr>
                <td><strong>ADD</strong></td>
                <td>Addition</td>
                <td>Yakın görmek için ilave güç (multifokal lenslerde)</td>
                <td>+1.50</td>
              </tr>
              <tr>
                <td><strong>OD / RE</strong></td>
                <td>Oculus Dexter</td>
                <td>Sağ göz</td>
                <td>—</td>
              </tr>
              <tr>
                <td><strong>OS / LE</strong></td>
                <td>Oculus Sinister</td>
                <td>Sol göz</td>
                <td>—</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Gözlük Reçetesiyle Farkı</h2>
        <p>
          Gözlük ve kontakt lens numaraları genellikle aynı değildir. Farkın nedenleri:
        </p>
        <ul>
          <li><strong>Gözlük gözden uzakta durur</strong> (yaklaşık 12–15 mm); lens ise doğrudan kornea üzerindedir. Bu mesafe farkı gerekli numarayı etkiler.</li>
          <li>Kontakt lens reçetesi ayrıca <strong>BC ve DIA</strong> değerlerini içerir; gözlük reçetesinde bu değerler bulunmaz.</li>
          <li>Yüksek numaralarda (±4.00 ve üzeri) gözlük numarası ile lens numarası arasındaki fark belirginleşir.</li>
        </ul>

        <div className="callout warning">
          <p><strong>Uyarı:</strong> Gözlük reçetenizle doğrudan lens satın almayın. Yanlış numara konforsuzu olduğu gibi kornea sağlığınızı da olumsuz etkileyebilir.</p>
        </div>

        <h2>Reçetemi Nasıl Yüklerim?</h2>
        <ol>
          <li>Sepetinize ürünü ekleyin ve ödemeye geçin.</li>
          <li>Adres bilgileri adımından sonra <strong>"Reçete Yükle"</strong> adımı karşınıza gelir.</li>
          <li>Reçetenizin net bir fotoğrafını veya PDF&apos;ini yükleyin. Fotoğraf ışıklı ortamda çekilmeli, tüm değerler okunabilir olmalıdır.</li>
          <li>Ekibimiz reçeteyi inceler; onay verildiğinde sipariş kargoya verilir. Ortalama inceleme süresi 1 iş saatidir.</li>
        </ol>

        <h2>Reçete Olmadan Sipariş Verebilir miyim?</h2>
        <p>
          <strong>Numarasız (plano / 0.00)</strong> lensler için reçete gerekmez. Renkli ve şeffaf tüm numarasız lensler serbestçe sipariş edilebilir.
        </p>
        <p>
          <strong>Numaralı</strong> lensler için reçete zorunludur. Bu Türkiye&apos;de yasal bir gerekliliktir. Reçetesiz numaralı lens satışı yasal kapsamda mümkün değildir.
        </p>

        <h2>Reçetem Geçerli mi?</h2>
        <p>
          Çoğu göz doktoru lens reçetesinin geçerlilik süresini 1 yıl olarak belirler. 1 yılı geçmiş reçetelerle sipariş verilmesi halinde ekibimiz sizi bilgilendirecektir. Göz numaranız değişmiş olabileceğinden düzenli göz muayenesi önerilir.
        </p>

        <h2>Reçete ile İlgili Sorunlar</h2>
        <p>Reçete yükleme veya onay sürecinde bir sorun yaşıyorsanız:</p>
        <ul>
          <li>Fotoğrafın net ve tüm değerleri kapsadığından emin olun.</li>
          <li>Reçetenin doktor mührü veya imzasını içerdiğini kontrol edin.</li>
          <li>Sorun devam ediyorsa <a href="mailto:info@hepsilens.com">info@hepsilens.com</a> adresine reçetenizi gönderin; uzman ekibimiz yardımcı olur.</li>
        </ul>

        <div className="callout">
          <p><strong>İpucu:</strong> Reçetenizi telefon kameranızla taratıp bulut depolamanıza (Drive, iCloud) kaydedin. Bir sonraki siparişinizde kolayca erişebilirsiniz.</p>
        </div>

      </div>
    </div>
  );
}
