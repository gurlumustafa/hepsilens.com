import BlogLayout from "@/components/BlogLayout";

export const metadata = { title: "Göz Sağlığı — Hepsilens Blog" };

export default function GozSagligi() {
  return (
    <BlogLayout
      title="Göz Sağlığı: Gözlerinizi Korumak İçin Bilmeniz Gerekenler"
      subtitle="Göz kuruluğundan mavi ışık zararına, UV korumasından düzenli muayeneye kadar göz sağlığının temel taşları."
      icon="visibility"
      iconColor="#00687b"
      iconBg="#afecff"
      readTime="10 dk"
      date="Ocak 2025"
    >
      <h2>Göz Kuruluğu: Dijital Çağın Sessiz Sorunu</h2>
      <p>
        Günde ortalama 7-9 saat ekran karşısında geçiren modern insanın en yaygın göz şikayeti kuruluktur. Normalde dakikada 15-20 kez kırpınan göz, ekrana bakarken bu sayıyı 5-7'ye indirger. Azalan kırpma, göz yüzeyindeki gözyaşı filminin buharlaşmasına ve kurumaya yol açar.
      </p>
      <p>
        Göz kuruluğunun belirtileri arasında yanma, batma, kızarıklık, aşırı sulanma (paradoks olarak kurulukta göz daha fazla sulanabilir), ışığa hassasiyet ve görme dalgalanması sayılabilir. Kontakt lens kullanıcıları bu belirtilere daha duyarlıdır çünkü lens, gözyaşı filminin üzerinde konumlanır.
      </p>
      <ul>
        <li><strong>20-20-20 kuralını uygulayın:</strong> Her 20 dakikada bir, 20 saniye boyunca 20 feet (6 metre) uzaktaki bir nesneye bakın.</li>
        <li><strong>Bilinçli kırpın:</strong> Ekran kullanırken göz kırpmayı hatırlatıcılar kurun.</li>
        <li><strong>Yapay gözyaşı kullanın:</strong> Koruyucu içermeyen (preservative-free) damla lens kullanıcıları için daha uygundur.</li>
        <li><strong>Hava nemini artırın:</strong> İç mekan nem oranı %40-60 arasında tutulmalıdır. Kış aylarında radyatör nemlendiricisi kullanabilirsiniz.</li>
      </ul>

      <div className="callout">
        <p><strong>Bilgi:</strong> Göz kuruluğu basit bir rahatsızlık gibi görünse de uzun vadede tedavi edilmezse kornea yüzeyinde hasara yol açabilir. Kronik kuruluk yaşıyorsanız göz doktorunuz kuru göz için özel reçeteli damla veya pluglar (gözyaşı kanalı tıkacı) önerebilir.</p>
      </div>

      <h2>Mavi Işık ve Dijital Göz Yorgunluğu</h2>
      <p>
        Ekranlar, güneş ışığında da bulunan mavi ışık (380-500 nm dalga boyu) yayar. Araştırmalar, mavi ışığın retina hasarına doğrudan yol açtığına dair kesin kanıt sunmamıştır; ancak <strong>sirkadiyen ritmi bozduğu</strong> (uyku düzenini etkiler) ve göz yorgunluğunu artırdığı belgelenmiştir.
      </p>
      <p>
        Mavi ışık filtreli gözlük veya ekran filtresi kullanabilirsiniz. Bunların yanı sıra ekran parlaklığını ortam ışığıyla dengeli tutmak, gece modunu etkinleştirmek (sarıya kayan ton göze daha az uyarıcıdır) ve yatmadan 1-2 saat önce ekran kullanımını azaltmak pratik önlemlerdir.
      </p>

      <h2>UV Koruması: Güneş Yalnızca Cilde Zarar Vermez</h2>
      <p>
        Ultraviyole (UV) ışınları, güneş gözlüğü takılmayan gözlerde birikimli hasara yol açar. UV maruziyetiyle ilişkili göz sorunları şunlardır:
      </p>
      <ul>
        <li><strong>Katarakt:</strong> Gözün merceğinde opaklık oluşumu. UV-A ve UV-B birikimli hasarın başlıca nedeni arasındadır.</li>
        <li><strong>Maküla dejenerasyonu:</strong> Retina merkezini etkileyen ve merkezi görüşü zayıflatan hastalık. UV, bu hastalığın ilerlemesinde rol oynar.</li>
        <li><strong>Pterygium:</strong> Konjonktivada büyüyen doku. Özellikle yoğun güneş ışığına maruz kalan kişilerde görülür.</li>
        <li><strong>Fotokeratit:</strong> Korneanın güneş yanığı. Kardan yansıyan UV'de ya da kaynak işlerinde koruyucu takılmadan çalışınca oluşur.</li>
      </ul>
      <p>
        Bazı kontakt lensler UV-A ve UV-B koruma sunar (genellikle Class 1 ve Class 2 olarak etiketlenir). Ancak lensler göz kapağını ve göz beyazını kapsamaz; bu nedenle UV korumalı güneş gözlüğü hâlâ zorunludur.
      </p>

      <div className="callout warning">
        <p><strong>Dikkat:</strong> Ucuz güneş gözlükleri yeterli UV filtresi içermeyebilir. Koyu camlı ama UV koruyucu olmayan gözlük, göz bebeğini genişleterek aslında daha fazla UV girmesine neden olur. Satın almadan önce "UV400" veya "%100 UV koruma" etiketini kontrol edin.</p>
      </div>

      <h2>Beslenme ve Göz Sağlığı</h2>
      <p>
        Göz sağlığını destekleyen başlıca besinler şunlardır:
      </p>
      <table>
        <thead>
          <tr><th>Besin</th><th>Faydası</th><th>Kaynaklar</th></tr>
        </thead>
        <tbody>
          <tr><td>Lutein &amp; Zeaksantin</td><td>Makula pigmentini korur, yaşa bağlı görme kaybını önler</td><td>Ispanak, lahana, mısır, yumurta sarısı</td></tr>
          <tr><td>Omega-3 yağ asitleri</td><td>Göz kuruluğunu azaltır, retina yapısını destekler</td><td>Somon, uskumru, ceviz, keten tohumu</td></tr>
          <tr><td>Vitamin C</td><td>Antioksidan; katarakt ve maküla dejenerasyonuna karşı koruyucu</td><td>Turunçgiller, biber, çilek</td></tr>
          <tr><td>Vitamin E</td><td>Serbest radikal hasarını önler</td><td>Badem, fındık, zeytinyağı</td></tr>
          <tr><td>Çinko</td><td>A vitamininin retinaya taşınmasına yardımcı olur</td><td>Kırmızı et, kabak çekirdeği, baklagiller</td></tr>
        </tbody>
      </table>

      <h2>Göz Egzersizleri: İşe Yarıyor mu?</h2>
      <p>
        Göz egzersizlerinin miyopiyi geri döndürdüğüne dair bilimsel kanıt yoktur. Ancak ekran yorgunluğunu azaltmada ve akomodasyon (odaklama) kaslarını rahatlatmada faydalı olabilirler.
      </p>
      <ul>
        <li><strong>Odak değiştirme:</strong> Parmağınızı burnunuzdan 15 cm uzakta tutun, 3 saniye bakın; ardından 3-6 metre uzaktaki nesneye 3 saniye bakın. 10 kez tekrarlayın.</li>
        <li><strong>Sekiz çizme:</strong> Hayali büyük bir sekizi gözlerinizle takip edin. 30 saniye bir yönde, 30 saniye diğer yönde.</li>
        <li><strong>Palming:</strong> Ellerinizi ısıtın, kapalı gözlerinize nazikçe koyun ve 1-2 dakika boyunca karanlıkta dinlendirin.</li>
      </ul>

      <h2>Düzenli Göz Muayenesi Ne Sıklıkla Yapılmalı?</h2>
      <p>
        Dünya Sağlık Örgütü ve Avrupa Optometri Derneği'nin önerilerine göre:
      </p>
      <ul>
        <li><strong>0-5 yaş:</strong> İlk muayene 6. ayda, ardından her 1-2 yılda bir.</li>
        <li><strong>6-18 yaş:</strong> Yılda bir (okul dönemi boyunca miyopi hızla ilerleyebilir).</li>
        <li><strong>18-40 yaş (şikayetsiz):</strong> Her 2 yılda bir.</li>
        <li><strong>40 yaş ve üzeri:</strong> Her yıl (glokom, katarakt ve presbyopi riski artar).</li>
        <li><strong>Kontakt lens kullananlar:</strong> Yılda en az bir kez mutlaka muayene (lens uyum kontrolü dahil).</li>
      </ul>

      <div className="callout success">
        <p><strong>Unutmayın:</strong> Birçok ciddi göz hastalığı erken evrede belirti vermez. Düzenli muayene, asemptomatik evredeki glokomu, maküla dejenerasyonunu ve diyabetik retinopatiyi erkenden tespit etmenin tek yoludur.</p>
      </div>
    </BlogLayout>
  );
}
