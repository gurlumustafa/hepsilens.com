import BlogLayout from "@/components/BlogLayout";

export const metadata = { title: "Kontakt Lens Bakımı — Hepsilens Blog" };

export default function LensBakimi() {
  return (
    <BlogLayout
      title="Kontakt Lens Bakımı: Bilmeniz Gereken Her Şey"
      subtitle="Lenslerinizi doğru bakımla koruyun, göz sağlığınızı riske atmayın. Temizlik, saklama ve kullanım süreleri hakkında kapsamlı rehber."
      icon="water_drop"
      iconColor="#003d9b"
      iconBg="#dae2ff"
      readTime="8 dk"
      date="Ocak 2025"
    >
      <div className="callout">
        <p><strong>Önemli:</strong> Yanlış lens bakımı göz enfeksiyonlarının en sık görülen nedenlerinden biridir. Bu rehberdeki adımları düzenli uygulamak gözlerinizi korur.</p>
      </div>

      <h2>Elleri Yıkamak Neden Bu Kadar Önemli?</h2>
      <p>
        Lens takmadan ve çıkarmadan önce ellerinizi en az 20 saniye sabun ve suyla yıkamanız şarttır. Eller parmak uçları dahil iyice ovulmalı, ardından temiz bir havluyla kurulanmalıdır. Tüy bırakan kumaşlardan kaçının; lens yüzeyine yapışan lifler kornea tahrişine yol açabilir.
      </p>
      <p>
        Araştırmalar, lens kullananların %70'inden fazlasının hijyen kurallarına tam uymadığını ortaya koymaktadır. Gün içinde lens takmak veya çıkarmak için uzun süreli konfor mola vermek gerektiğinde lavaboya gidemeseniz bile lens dokunmaktan kaçının.
      </p>

      <h2>Doğru Solüsyon Seçimi</h2>
      <p>
        Piyasada üç temel solüsyon tipi bulunur:
      </p>
      <ul>
        <li><strong>Çok amaçlı solüsyon (MPS):</strong> Temizlik, durulama, dezenfeksiyon ve saklama işlevlerini tek üründe birleştirir. Günlük ve aylık lens kullanıcıları için pratik seçenektir.</li>
        <li><strong>Hidrojen peroksit bazlı solüsyon:</strong> Daha güçlü dezenfeksiyon sağlar. Özellikle hassas gözler için idealdir. Ancak nötralizasyon süresi tamamlanmadan lens takılmamalıdır; aksi hâlde ciddi yanma oluşur. Kullanım süresi genellikle 6 saattir.</li>
        <li><strong>Salin solüsyonu:</strong> Tek başına dezenfeksiyona yetmez; yalnızca durulama amacıyla kullanılır.</li>
      </ul>
      <p>
        Solüsyon seçiminde gözlem yapın: Bir markayla göz kızarıklığı, batma veya bulanıklık yaşıyorsanız göz doktorunuza danışarak alternatife geçin. Solüsyonlar arasında geçiş yaparken uyum süreci gerekebilir.
      </p>

      <div className="callout warning">
        <p><strong>Asla su kullanmayın.</strong> Musluk suyu, havuz suyu ve hatta damıtılmış su, lens bakımında kesinlikle kullanılmamalıdır. Su içindeki Acanthamoeba mikroorganizması ciddi ve tedavisi güç kornea enfeksiyonlarına (keratite) neden olabilir.</p>
      </div>

      <h2>Adım Adım Günlük Bakım Rutini</h2>
      <ol>
        <li><strong>Çıkarma:</strong> Lensi çıkardıktan hemen sonra avucunuza birkaç damla solüsyon koyun ve lensi dairesel hareketlerle 20 saniye ovun.</li>
        <li><strong>Durulama:</strong> Temiz solüsyonla her iki tarafını durulayın. Eski solüsyon kullanmayın.</li>
        <li><strong>Kap temizliği:</strong> Her kullanımdan sonra kabı da solüsyonla durulayın ve ağzı açık kurutun. Suyla yıkamayın.</li>
        <li><strong>Yeni solüsyon:</strong> Kabı her seferinde taze solüsyonla doldurun; artık kalan solüsyona yeni solüsyon eklemeyin.</li>
        <li><strong>Kap değişimi:</strong> Lens kabını her 3 ayda bir yenileyin. Çoğu solüsyon kutusuyla yedek kap gelir.</li>
      </ol>

      <h2>Saklama Kuralları</h2>
      <p>
        Aylık veya iki haftalık lensler kullanılmadıkları süre içinde mutlaka temiz solüsyon içinde saklanmalıdır. Kuru bırakılan lens şeklini kaybeder ve kornea yüzeyine zarar verebilir. Lensi solüsyonda bıraktığınız süre solüsyon üreticisinin önerdiği süreden fazla olmamalıdır; aşıldığında solüsyonu yenileyin.
      </p>
      <p>
        Seyahat sırasında lensleri el bagajınızda taşıyın; kargo bölmesindeki sıcaklık değişimleri solüsyonun ve lensin bozulmasına yol açabilir.
      </p>

      <h2>Kullanım Sürelerine Kesinlikle Uyun</h2>
      <table>
        <thead>
          <tr><th>Lens Tipi</th><th>Değişim Süresi</th><th>Dikkat Edilecek Nokta</th></tr>
        </thead>
        <tbody>
          <tr><td>Günlük</td><td>Her gün yeni lens</td><td>Aynı gün bile olsa çıkardıktan sonra atın</td></tr>
          <tr><td>İki haftalık</td><td>İlk açılıştan 14 gün</td><td>Kaç gün taktığınız değil, takvim tarihi esas</td></tr>
          <tr><td>Aylık</td><td>İlk açılıştan 30 gün</td><td>Az takılsa bile 30. günde değiştirin</td></tr>
        </tbody>
      </table>
      <p>
        Lensi önerilen süreden fazla kullanmak, oksijen geçirgenliğini düşürür. Bu durum, kornea yeni kan damarı oluşturarak oksijeni doğrudan kandan almaya çalıştığı <strong>neovaskülarizasyon</strong> adı verilen bir komplikasyona yol açabilir.
      </p>

      <h2>Lens Takarken Kaçınılması Gerekenler</h2>
      <ul>
        <li>Uyurken lens takmak (uyku lensleri hariç — bunlar özel onaylıdır)</li>
        <li>Duş alırken veya yüzerken lens kullanmak</li>
        <li>Göz damlası yerine herhangi bir damla kullanmak</li>
        <li>Makyaj uyguladıktan sonra lens takmak (önce lens, sonra makyaj)</li>
        <li>Saç spreyi veya parfüm sıkarken gözleri açık tutmak</li>
        <li>Kuru, kızarık veya ağrılı gözle lense devam etmek</li>
      </ul>

      <div className="callout success">
        <p><strong>İpucu:</strong> Lensinizi takarken her zaman aynı gözden başlayın (örneğin hep sağdan). Bu alışkanlık, sol-sağ karışıklığını önler ve kullanım sürenizi doğru takip etmenizi sağlar.</p>
      </div>

      <h2>Ne Zaman Lenslerinizi Çıkarmalısınız?</h2>
      <p>
        Aşağıdaki belirtilerden birini yaşıyorsanız lensi hemen çıkarın ve göz doktoruna başvurun:
      </p>
      <ul>
        <li>Ani görme bulanıklığı</li>
        <li>Işığa karşı hassasiyet (fotofobi)</li>
        <li>Göz ağrısı veya yanma</li>
        <li>Gözde kızarıklık ve akıntı</li>
        <li>Uyum sağlayamadığınız yabancı cisim hissi</li>
      </ul>
      <p>
        Bu belirtiler enfeksiyonun, kornea çizilmesinin veya lense bağlı başka bir komplikasyonun işareti olabilir. Erken müdahale kalıcı hasarı önler.
      </p>
    </BlogLayout>
  );
}
