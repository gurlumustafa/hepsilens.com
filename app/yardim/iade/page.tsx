import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "İade & Değişim — Hepsilens",
  description: "Hepsilens iade ve değişim koşulları, adımları ve sıkça sorulan sorular.",
};

const steps = [
  { icon: "mail", title: "Talep Oluşturun", desc: "info@hepsilens.com adresine sipariş numaranızı ve iade nedeninizi bildirin." },
  { icon: "inventory_2", title: "Ürünü Hazırlayın", desc: "Açılmamış, orijinal ambalajında ürünü güvenli bir kutuda paketleyin. İçine sipariş numaranızı yazın." },
  { icon: "local_shipping", title: "Kargoya Verin", desc: "Anlaşmalı kargo firmaları aracılığıyla belirtilen adrese gönderin. İade kargo bedeli size aittir." },
  { icon: "price_check", title: "İade Alın", desc: "Ürün bize ulaştıktan sonra 3–5 iş günü içinde ödemeniz orijinal ödeme yönteminize iade edilir." },
];

export default function IadeDegisimPage() {
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
            <span className="text-[#003d9b]" style={{ fontSize: "13px", fontWeight: 600 }}>İade & Değişim</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#fef3c7]">
              <span className="material-symbols-outlined text-[#b45309]" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>assignment_return</span>
            </div>
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, color: "#191c1e", lineHeight: 1.2 }}>
            İade & Değişim
          </h1>
          <p className="text-[#737685] mt-3" style={{ fontSize: "16px", lineHeight: "26px" }}>
            Memnun kalmadığınız her ürünü kolayca iade edebilirsiniz. Koşullar ve adımlar aşağıda açıklanmıştır.
          </p>
        </div>
      </section>

      <div className="max-w-[860px] mx-auto px-8 blog-content">

        {/* Adımlar */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={s.title} className="bg-white border border-[#edeef3] rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#dae2ff] flex items-center justify-center">
                  <span style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "12px", fontWeight: 800, color: "#003d9b" }}>{i + 1}</span>
                </div>
                <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              </div>
              <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "14px", fontWeight: 700, color: "#191c1e", marginBottom: "6px" }}>{s.title}</p>
              <p style={{ fontSize: "12px", color: "#737685", lineHeight: "18px" }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <h2>İade Koşulları</h2>
        <ul>
          <li>İade süresi teslim tarihinden itibaren <strong>14 takvim günü</strong>dür.</li>
          <li>Ürün <strong>açılmamış, orijinal ambalajında</strong> olmalıdır.</li>
          <li>Hijyenik nedenlerle <strong>açılmış, folyo veya kapak kaldırılmış lens ambalajları</strong> iade edilemez. Bu kural yasal zorunluluk kapsamındadır (TKHK Madde 15/1-f).</li>
          <li>Reçete doğrulama sürecinde hata yapılmadıysa sipariş reçeteye uygun üretilmiş ürünler iade kabul edilmez.</li>
        </ul>

        <div className="callout">
          <p><strong>İpucu:</strong> Ürünleri açmadan önce kutunun dışından göz attığınızda doğru ürünü aldığınızı teyit edebilirsiniz. Kozmetik lens yerine numaralı lens geldi gibi durumlarda bize hemen ulaşın; yanlış gönderim tamamen ücretsiz değiştirilir.</p>
        </div>

        <h2>Değişim</h2>
        <p>
          Farklı bir ürünle değişim yapmak istiyorsanız mevcut ürünü iade edip yeni siparişi ayrıca oluşturmanızı öneririz. Bu sayede stok garantisi alınmış olur ve süreç daha hızlı ilerler.
        </p>
        <p>
          Yanlış numara veya yanlış ürün gönderiminde değişim kargo bedeli tarafımıza aittir.
        </p>

        <h2>Para İadesi Süresi</h2>
        <table>
          <thead>
            <tr><th>Ödeme Yöntemi</th><th>İade Süresi</th></tr>
          </thead>
          <tbody>
            <tr><td>Kredi Kartı</td><td>3–10 iş günü (bankanıza bağlı)</td></tr>
            <tr><td>Banka Kartı (Debit)</td><td>3–5 iş günü</td></tr>
            <tr><td>Havale / EFT</td><td>2–3 iş günü</td></tr>
            <tr><td>Kapıda Ödeme</td><td>Havale ile 2–3 iş günü</td></tr>
          </tbody>
        </table>
        <p>
          İade işlemi tarafımızca tamamlandığında e-posta bildirim alırsınız. Süre banka işlem hızına göre değişebilir.
        </p>

        <h2>Hasarlı veya Hatalı Ürün</h2>
        <p>
          Hasarlı veya hatalı (yanlış ürün, yanlış numara) teslimat durumunda:
        </p>
        <ol>
          <li>Ürünün ve ambalajın fotoğrafını çekin.</li>
          <li><a href="mailto:info@hepsilens.com">info@hepsilens.com</a> adresine sipariş numaranız ve fotoğraflarla bildirin.</li>
          <li>24 saat içinde size dönüş yapılır; iade veya ücretsiz yeniden gönderim planlanır.</li>
        </ol>

        <div className="callout warning">
          <p><strong>Hasarlı kargo:</strong> Kargo görevlisinden teslim alırken ambalaj hasarı görürseniz paketi açmadan tutanak tutturun. Tutanaksız hasar taleplerinde süreç uzayabilir.</p>
        </div>

      </div>
    </div>
  );
}
