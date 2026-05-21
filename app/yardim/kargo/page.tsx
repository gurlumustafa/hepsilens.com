import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kargo Politikası — Hepsilens",
  description: "Hepsilens kargo süreleri, ücretleri, ücretsiz kargo koşulları ve teslimat hakkında her şey.",
};

const zones = [
  { city: "İstanbul, Ankara, İzmir", time: "1 iş günü", note: "Saat 14:00'e kadar verilen siparişlerde" },
  { city: "Diğer büyük şehirler", time: "1–2 iş günü", note: "" },
  { city: "İlçe ve kasabalar", time: "2–3 iş günü", note: "" },
  { city: "Uzak ve köy adresleri", time: "3–5 iş günü", note: "Posta kodu bölgesine bağlı" },
];

export default function KargoPolitikasiPage() {
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
            <span className="text-[#003d9b]" style={{ fontSize: "13px", fontWeight: 600 }}>Kargo Politikası</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#ccf4f9]">
              <span className="material-symbols-outlined text-[#00687b]" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
            </div>
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: "#191c1e", lineHeight: 1.2 }}>
            Kargo Politikası
          </h1>
          <p className="text-[#737685] mt-3" style={{ fontSize: "16px", lineHeight: "26px" }}>
            Siparişleriniz özel ambalajlarla, hızlı ve güvenli biçimde kapınıza ulaşır. Kargo süreleri ve ücretleri hakkında bilmeniz gereken her şey.
          </p>
        </div>
      </section>

      <div className="max-w-[860px] mx-auto px-8 blog-content">

        {/* Ücretsiz kargo banner */}
        <div className="mt-10 p-5 bg-[#dcfce7] rounded-2xl flex items-center gap-4">
          <span className="material-symbols-outlined text-[#16a34a] flex-shrink-0" style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }}>local_offer</span>
          <div>
            <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px", fontWeight: 700, color: "#166534" }}>300 TL ve üzeri siparişlerde kargo ücretsiz!</p>
            <p style={{ fontSize: "13px", color: "#166534", opacity: 0.85 }}>Bu limitin altındaki siparişler için kargo ücreti 49,90 TL olarak uygulanır.</p>
          </div>
        </div>

        <h2>Kargo Süreleri</h2>
        <p>Stoktaki ürünler için kargo süreleri teslimat bölgesine göre değişmektedir.</p>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Bölge</th>
                <th>Tahmini Süre</th>
                <th>Not</th>
              </tr>
            </thead>
            <tbody>
              {zones.map((z) => (
                <tr key={z.city}>
                  <td style={{ fontWeight: 600, color: "#191c1e" }}>{z.city}</td>
                  <td style={{ color: "#003d9b", fontWeight: 700 }}>{z.time}</td>
                  <td style={{ fontSize: "13px", color: "#737685" }}>{z.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="callout">
          <p><strong>Kesim saati:</strong> Hafta içi saat 14:00&apos;e kadar verilen siparişler aynı gün kargoya verilir. 14:00 sonrası ve hafta sonu siparişleri bir sonraki iş günü kargoya verilir.</p>
        </div>

        <h2>Kargo Ücretleri</h2>
        <ul>
          <li><strong>0 – 299,99 TL:</strong> 49,90 TL kargo ücreti</li>
          <li><strong>300 TL ve üzeri:</strong> Ücretsiz kargo</li>
          <li><strong>Kapıda ödeme:</strong> 49,90 TL kargo + 15 TL kapıda ödeme hizmet bedeli</li>
        </ul>

        <h2>Kargo Firmaları</h2>
        <p>
          Hepsilens, Yurtiçi Kargo ve Aras Kargo anlaşmalı kargo firmaları aracılığıyla teslimat yapmaktadır. Kargoya verme anında SMS ve e-posta ile takip kodunuz iletilir.
        </p>

        <h2>Ambalaj ve Soğuk Zincir</h2>
        <p>
          Kontakt lensler ısı ve basınca duyarlı ürünlerdir. Tüm siparişlerimiz <strong>çift katlı özel ambalaj</strong> içinde kargoya verilir. Yaz aylarında veya ısı koridorlarına yakın bölgelere yapılan teslimatlar için soğutucu ek ambalaj kullanılmaktadır. Paket her koşulda orijinal kutusunda, kırılmaya karşı korumalı biçimde gönderilir.
        </p>

        <h2>Teslimat Yok veya Gecikme Durumunda</h2>
        <p>Tahmini teslimat süresini geçen siparişler için:</p>
        <ol>
          <li>Kargo takip numaranızla kargo firmasının web sitesini kontrol edin.</li>
          <li>Sorun devam ederse <a href="mailto:info@hepsilens.com">info@hepsilens.com</a> adresine sipariş numaranızı yazın.</li>
          <li>Müşteri hizmetlerimiz 24 saat içinde dönüş yaparak kargo firmasıyla takibi başlatır.</li>
        </ol>

        <h2>Hasarlı Teslimat</h2>
        <p>
          Kargo görevlisinden teslim alırken pakette hasar görürseniz <strong>teslim almadan önce tutanak tutturun</strong>. Hasarlı ürün fotoğrafını ve tutanağı <a href="mailto:info@hepsilens.com">info@hepsilens.com</a> adresine 24 saat içinde iletin; ücretsiz yeniden gönderim sağlanır.
        </p>

        <div className="callout warning">
          <p><strong>Önemli:</strong> Hasarlı paketi kargo tutanağı tutulmadan teslim almayınız. Tutanaksız hasarlı teslimat taleplerinde yeniden gönderim süreci uzayabilir.</p>
        </div>

        <h2>Yurt Dışı Teslimat</h2>
        <p>
          Şu anda yalnızca Türkiye genelinde teslimat yapılmaktadır. Uluslararası kargo seçeneği yakında hizmete girecektir.
        </p>

      </div>
    </div>
  );
}
