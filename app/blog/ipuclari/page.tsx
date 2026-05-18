import BlogLayout from "@/components/BlogLayout";

export const metadata = { title: "İpuçları & Rehber — Hepsilens Blog" };

export default function Ipuclari() {
  return (
    <BlogLayout
      title="Kontakt Lens Rehberi: Başlangıçtan İleri Seviyeye"
      subtitle="İlk kez lens takacaklar için adım adım rehber, deneyimliler için pratik ipuçları ve sık yapılan hatalar."
      icon="lightbulb"
      iconColor="#16a34a"
      iconBg="#dcfce7"
      readTime="11 dk"
      date="Ocak 2025"
    >
      <h2>İlk Kez Lens Takacaklar İçin: Hazırlık Aşaması</h2>
      <p>
        Kontakt lens kullanmaya karar vermeden önce bir göz doktoruna muayene olmanız zorunludur. Muayenede kornea eğriliği (K değerleri), göz çapı ve refraksiyon (numara) ölçülür; bu değerler reçetenizde yer alır. Gözlük numaranız ve lens numaranız aynı değildir; aralarındaki farkı doktorunuz hesaplar.
      </p>
      <p>
        Muayene sonucunda doktorunuz size uygun lens tipini (günlük, aylık, toric, vb.) ve solüsyonu önerecektir. İlk kullanıcılar için genellikle günlük lensler tercih edilir; bakım gerektirmez ve alışma sürecini kolaylaştırır.
      </p>

      <div className="callout">
        <p><strong>İpucu:</strong> Muayene randevusuna gitmeden önce gözünüzün hassasiyetini değerlendirmek için taktığınız makyajı temizleyin ve varsa soft lens takıyorsanız randevudan en az 24 saat önce çıkarın. Rijit lens kullanıcıları için bu süre 2-3 haftaya kadar uzayabilir.</p>
      </div>

      <h2>İlk Kez Lens Takma: Adım Adım</h2>
      <ol>
        <li><strong>Elleri yıkayın.</strong> En az 20 saniye sabunla yıkayıp temiz, tüy bırakmayan havluyla kurulayın.</li>
        <li><strong>Lensi kabından çıkarın.</strong> İşaret parmağınızın ucuna koyun; kase şeklinde bükülmüş olmalıdır. Düzgün bükülmüş lensde kenarlar içe doğru kıvrılır. Kenarlar dışa kıvrılıyorsa lens ters duruyor demektir.</li>
        <li><strong>Gözü açık tutun.</strong> Sağ elinizin orta parmağıyla alt kapağı aşağı çekin, sol elinizin orta parmağıyla üst kapağı yukarı kaldırın.</li>
        <li><strong>Yukarı bakın.</strong> Gözbebeğinizi hafifçe yukarı yöneltin ve lensi korneanın alt kısmına yerleştirin.</li>
        <li><strong>Gözü yavaşça kapatın.</strong> Gözü kaparken yavaşça yukarı bakış yönünden düz bakışa geçin; lens yerine oturacaktır.</li>
        <li><strong>Kırpın.</strong> Birkaç kez kırparak lensin merkezlenmesini sağlayın. Görüş netleşmeli ve yabancı cisim hissi kaybolmalıdır.</li>
      </ol>
      <p>
        İlk deneyimde lens yerleştirmek 5-10 dakika alabilir; bu normaldir. Pratik yapıldıkça 30 saniyenin altına inecektir.
      </p>

      <h2>Göz Kasılıyorsa Ne Yapmalı?</h2>
      <p>
        Yeni başlayanların en büyük sorunu refleks göz kapamadır. Gözünüze herhangi bir şey yaklaşınca kapanma refleksi devreye girer. Bunu aşmanın en etkili yöntemi <strong>sabır ve pratik</strong>tir. Aşağıdaki teknikler yardımcı olabilir:
      </p>
      <ul>
        <li>Aynaya bakarak çalışın; doğrudan gözbebeğinize odaklanmak yerine yansımanıza bakın.</li>
        <li>Plastik bir tıraş bıçağı kapağı gibi küçük bir cismi gözünüze yaklaştırarak refleksi yavaş yavaş sönümleyin.</li>
        <li>Yapay gözyaşı damlatın; nem, daha az irritasyon ve daha rahat yerleştirme sağlar.</li>
        <li>Kesinlikle acele etmeyin; stresli ortamda refleks daha güçlü çalışır.</li>
      </ul>

      <h2>Reçeteyi Doğru Okumak</h2>
      <p>
        Lens reçetenizde şu değerleri göreceksiniz:
      </p>
      <table>
        <thead>
          <tr><th>Kısaltma</th><th>Anlamı</th><th>Örnek Değer</th></tr>
        </thead>
        <tbody>
          <tr><td>PWR / SPH</td><td>Sferik güç (miyopi/hipermetropi)</td><td>-2.50</td></tr>
          <tr><td>BC</td><td>Taban eğrilik (Base Curve)</td><td>8.6 mm</td></tr>
          <tr><td>DIA</td><td>Çap</td><td>14.2 mm</td></tr>
          <tr><td>CYL</td><td>Silindirik güç (astigmat için)</td><td>-1.25</td></tr>
          <tr><td>AXIS / AX</td><td>Astigmat yönü (derece)</td><td>90°</td></tr>
          <tr><td>ADD</td><td>İlave güç (presbitopi/bifocal lens için)</td><td>+1.50</td></tr>
          <tr><td>OD / RE</td><td>Sağ göz (Oculus Dexter)</td><td>—</td></tr>
          <tr><td>OS / LE</td><td>Sol göz (Oculus Sinister)</td><td>—</td></tr>
        </tbody>
      </table>

      <h2>Seyahatte Lens Kullanımı</h2>
      <p>
        Seyahat edenlerin en çok ihmal ettiği konulardan biri lens hijyenidir. Uzun uçuşlar, farklı iklimler ve değişen rutinler göz sağlığını olumsuz etkileyebilir.
      </p>
      <ul>
        <li><strong>Uçuşlarda:</strong> Uçak kabinleri çok düşük nemde (%10-20) çalışır. Solüsyon damlatın veya mümkünse lenleri çıkarın; gözlüğünüzü yanınızda bulundurun.</li>
        <li><strong>Farklı su kaynakları:</strong> Yurt dışında su kalitesi değişir. Lens kabını ve lensleri asla musluk suyuyla yıkamayın.</li>
        <li><strong>Sıcak bölgeler:</strong> Sıcaklık ve terleme nedeniyle gözler daha hızlı kurur. Nem damlaları yanınızda olsun.</li>
        <li><strong>Havuz ve deniz:</strong> Lensle yüzmeyin. Yüzmek zorundaysanız su geçirmez yüzücü gözlüğü takın ve sonrasında lensleri değiştirin.</li>
      </ul>

      <h2>Lens Kaybolursa Panik Yapmayın</h2>
      <p>
        Lens çok nadiren gözün arkasına "kaçar". Gözün anatomisi bunu engelleyen bir zar (konjonktiva) ile korunur. Lens genellikle ya gözün bir köşesinde kıvrılmıştır ya da düşmüştür.
      </p>
      <ol>
        <li>Elinizi yüzünüze götürmeyin; lens ellerdeki yağla kirlenebilir.</li>
        <li>Gözlerinizi dört bir yana çevirin; lens konjunktivada bir yerde olabilir.</li>
        <li>Birkaç damla yapay gözyaşı damlatın; kaygan ortam lensin kendi yerine gelmesini sağlayabilir.</li>
        <li>Yine de bulamazsanız aynaya bakarak göz kapağınızı kaldırıp kontrol edin.</li>
        <li>Gözünüzde lens hissi devam ediyorsa göz doktoruna gidin.</li>
      </ol>

      <div className="callout warning">
        <p><strong>Uyarı:</strong> Gözde şiddetli ağrı veya görme kaybı yaşıyorsanız lensi hemen çıkarıp göz doktoruna ya da acile gidin. Bu belirtiler, nadir de olsa ciddi kornea hasarının işareti olabilir.</p>
      </div>

      <h2>Makyaj ve Lens Kullanımı</h2>
      <ul>
        <li>Her zaman önce lens takın, sonra makyaj yapın.</li>
        <li>Çıkarırken önce makyajı temizleyin, ardından lensi çıkarın.</li>
        <li>Göz kapağı iç kesimine (waterline) sürme veya kalem sürmeyin; göz kanalını tıkayarak kuru göze yol açar.</li>
        <li>Su geçirmez maskara ve eyeliner, lens yüzeyine yapışan tortu bırakabilir; hafif formüller tercih edin.</li>
        <li>Göz makyajı temizleyicileri lens takılıyken kullanmayın.</li>
        <li>Her 3 ayda bir makyaj fırçalarınızı değiştirin; bakteri birikimi göz enfeksiyonu riskini artırır.</li>
      </ul>

      <h2>Akıllı Telefon Hatırlatıcıları: Lens Rutinini Otomatikleştirin</h2>
      <p>
        Aylık veya iki haftalık lens kullananlar için en sık yapılan hata, değişim tarihini unutmaktır. Bunu önlemek için:
      </p>
      <ul>
        <li>Lensi ilk taktığınız günü telefonunuzda not edin veya takvime ekleyin.</li>
        <li>30 gün sonrası için "Lens Değiştir" hatırlatıcısı kurun.</li>
        <li>Kaçan değişim sonrasında lensi yenilemeyi ertelemeyin; günde 1-2 gün geçmiş bile olsa temiz lensi takın.</li>
      </ul>

      <div className="callout success">
        <p><strong>Son söz:</strong> Kontakt lens, doğru kullanıldığında son derece güvenli ve konforlu bir görme düzeltme yöntemidir. Hijyen, süre ve düzenli muayene kurallarına uyan kullanıcıların büyük çoğunluğu herhangi bir sorun yaşamaz. Şüphe duyduğunuzda daima göz doktorunuza danışın.</p>
      </div>
    </BlogLayout>
  );
}
