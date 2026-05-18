import BlogLayout from "@/components/BlogLayout";
import Link from "next/link";

export const metadata = { title: "Ürün İncelemeleri — Hepsilens Blog" };

const reviews = [
  {
    id: 1,
    name: "Acuvue Oasys 1-Day",
    brand: "Johnson & Johnson",
    type: "Günlük / Şeffaf",
    rating: 5,
    badge: "Editörün Seçimi",
    badgeColor: "#003d9b",
    badgeBg: "#dae2ff",
    summary: "Piyasadaki en konforlu günlük lens olarak uzmanlar tarafından sürekli önerilen Acuvue Oasys 1-Day, HYDRALUXE teknolojisiyle gözyaşı filmini taklit eden bir nem katmanı oluşturur.",
    pros: [
      "Gün sonunda dahi kuruluk hissi minimal",
      "UV-A ve UV-B koruması (Class 1)",
      "Yüksek oksijen geçirgenliği: 118 Dk/t",
      "İnce kenar tasarımı takma-çıkarmayı kolaylaştırır",
    ],
    cons: [
      "Piyasadaki en pahalı günlük lenslerden biri",
      "Bazı kullanıcılar ikinci günlük seçeneklere göre daha dar renk seçeneği olduğunu belirtir",
    ],
    verdict: "Konfor her şeyin önünde geliyorsa ve bütçeniz esnekse Acuvue Oasys 1-Day tartışmasız en iyi günlük lens seçeneğidir. Özellikle uzun mesai yapan, kuru ortamda çalışan veya sık uçuş yapan kullanıcılar için idealdir.",
    href: "/urun/1",
  },
  {
    id: 2,
    name: "Dailies Total1",
    brand: "Alcon",
    type: "Günlük / Şeffaf",
    rating: 5,
    badge: "En Çok Satan",
    badgeColor: "#16a34a",
    badgeBg: "#dcfce7",
    summary: "Su gradyanı teknolojisiyle geliştirilen Dailies Total1, dış yüzeyinde %80'i aşan su içeriğiyle neredeyse lensi takmazmış gibi bir his yaratır. Silikon hidrojel ve hidrojeli birleştiren hibrit yapısı rakiplerinden ayrışır.",
    pros: [
      "Su gradyanı: Dış yüzey %80+ su içeriği",
      "İnanılmaz ince ve hafif yapı",
      "Nefes alan silikon hidrojel çekirdeği",
      "Triton teknolojisiyle üstün oksijen geçirgenliği: 156 Dk/t",
    ],
    cons: [
      "Suya dokunan yüzey çok kaygandır, deneyimsiz kullanıcılar için tutmak güçleşebilir",
      "Yüksek fiyat aralığı",
    ],
    verdict: "Acuvue Oasys ile baş başa mücadele eden Dailies Total1, dış yüzey hissi açısından bir adım öndedir. İlk kez lens takan kullanıcılar veya konfor sorunları yaşayanlar için mükemmel bir tercih.",
    href: "/urun/2",
  },
  {
    id: 3,
    name: "Biofinity",
    brand: "CooperVision",
    type: "Aylık / Şeffaf",
    rating: 4,
    badge: "Fiyat-Performans",
    badgeColor: "#b45309",
    badgeBg: "#fef3c7",
    summary: "Aquaform teknolojisiyle nemliliği korurken yüksek oksijen geçirgenliği sunan Biofinity, aylık lens kullananların en yaygın tercihidir. Gece de takılmasına izin verilen (6 gece, extended wear) nadir aylık lenslerden biridir.",
    pros: [
      "Aquaform: Silikon ve hidrüj polimerlerin doğal bağı, kaplama gerektirmez",
      "Extended wear onaylı (göz doktoru onayıyla)",
      "Asferik tasarım: Gece görüşünü ve netliği artırır",
      "Uygun fiyat/konfor dengesi",
    ],
    cons: [
      "Günlük lenslere kıyasla bakım gerektirmesi zahmetli bulunabilir",
      "İlk takma konforunda bazı marka rakiplerine karşı hafif geri kalır",
    ],
    verdict: "Aylık lens kullanan ve bakıma zaman ayırabilen kişiler için Biofinity güvenilir, ekonomik ve sağlıklı bir seçimdir. Göz doktoru onayıyla hafta sonu evde uyuyarak bile takılabilmesi büyük avantajdır.",
    href: "/urun/3",
  },
  {
    id: 4,
    name: "FreshLook Colorblends",
    brand: "Alcon",
    type: "Aylık / Renkli",
    rating: 4,
    badge: "Renkli Lens Lideri",
    badgeColor: "#6a3600",
    badgeBg: "#ffdcc3",
    summary: "3 katmanlı renk teknolojisiyle göz rengini değiştirirken doğal görünümü koruyan FreshLook Colorblends, renkli lens pazarının tartışmasız standardıdır. Limbal halka (göz kenarındaki koyu çizgi) göze derinlik katarak iris rengini belirginleştirir.",
    pros: [
      "3 katman: Limbal halka + arka plan rengi + ön yüzey deseni",
      "12 renk seçeneği",
      "Reçetesiz kullanıma uygun (0.00 numaralı seçenek mevcut)",
      "Geniş kullanıcı kitlesi tarafından onaylanmış doğal görünüm",
    ],
    cons: [
      "Aylık ürün olduğundan bakım gerektirir",
      "Koyu gözlerde bazı renkler yeterince belirgin görünmeyebilir",
      "Oksijen geçirgenliği premium şeffaf lenslerin altında kalır",
    ],
    verdict: "Renkli lens kullanmak isteyenler için başlangıç noktası FreshLook Colorblends olmalıdır. Hem estetik hem doğallık açısından tatmin edici sonuç verir.",
    href: "/urun/5",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <span key={s} style={{ fontSize: "16px", color: s <= n ? "#b45309" : "#e2e8f0" }}>★</span>
      ))}
    </div>
  );
}

export default function UrunIncelemeleri() {
  return (
    <BlogLayout
      title="2025 Kontakt Lens İncelemeleri"
      subtitle="En çok tercih edilen lens markalarını bağımsız gözle değerlendirdik. Artıları, eksileri ve kimin için uygun olduğunu bulun."
      icon="star"
      iconColor="#b45309"
      iconBg="#fef3c7"
      readTime="12 dk"
      date="Ocak 2025"
    >
      <div className="callout">
        <p><strong>Değerlendirme Notu:</strong> Bu incelemeler klinik verilere, üretici dokümantasyonuna ve gerçek kullanıcı geri bildirimlerine dayanmaktadır. Hiçbir marka sponsorluğu bulunmamaktadır. Göz sağlığı açısından nihai karar için her zaman göz doktorunuza danışın.</p>
      </div>

      {reviews.map((r) => (
        <div key={r.id} style={{ marginBottom: "48px", paddingBottom: "48px", borderBottom: "1px solid #edeef3" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
            <div>
              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", color: r.badgeColor, background: r.badgeBg, padding: "2px 8px", borderRadius: "999px", textTransform: "uppercase" as const }}>
                {r.badge}
              </span>
            </div>
            <Stars n={r.rating} />
          </div>

          <h2 style={{ marginTop: "8px" }}>{r.name}</h2>
          <p style={{ fontSize: "13px", color: "#737685", marginBottom: "12px" }}>{r.brand} · {r.type}</p>
          <p>{r.summary}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", margin: "20px 0" }}>
            <div style={{ background: "#f0fdf4", borderRadius: "12px", padding: "16px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#16a34a", marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>✓ Artılar</p>
              <ul style={{ paddingLeft: "16px", margin: 0 }}>
                {r.pros.map((p) => <li key={p} style={{ fontSize: "13px", color: "#166534", marginBottom: "4px", lineHeight: "20px" }}>{p}</li>)}
              </ul>
            </div>
            <div style={{ background: "#fef2f2", borderRadius: "12px", padding: "16px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#dc2626", marginBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>✗ Eksiler</p>
              <ul style={{ paddingLeft: "16px", margin: 0 }}>
                {r.cons.map((c) => <li key={c} style={{ fontSize: "13px", color: "#991b1b", marginBottom: "4px", lineHeight: "20px" }}>{c}</li>)}
              </ul>
            </div>
          </div>

          <div style={{ background: "#f8f9fb", borderRadius: "12px", padding: "16px", borderLeft: "4px solid #003d9b" }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#003d9b", marginBottom: "4px" }}>Sonuç</p>
            <p style={{ fontSize: "14px", color: "#434654", margin: 0, lineHeight: "22px" }}>{r.verdict}</p>
          </div>

          <div style={{ marginTop: "16px" }}>
            <Link href={r.href} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 20px", background: "#003d9b", color: "white", borderRadius: "10px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
              Ürün Sayfasına Git →
            </Link>
          </div>
        </div>
      ))}

      <h2>Hangisini Seçmeliyim?</h2>
      <table>
        <thead>
          <tr><th>Profil</th><th>Önerilen Lens</th></tr>
        </thead>
        <tbody>
          <tr><td>Kuru gözlü, uzun saatler lens kullanan</td><td>Acuvue Oasys 1-Day veya Dailies Total1</td></tr>
          <tr><td>Pratiklik arayanlar (bakım istemeyenler)</td><td>Herhangi bir günlük lens</td></tr>
          <tr><td>Ekonomik aylık arayan</td><td>Biofinity</td></tr>
          <tr><td>Göz rengi değiştirmek isteyen</td><td>FreshLook Colorblends</td></tr>
          <tr><td>Astigmatı olan</td><td>Acuvue Oasys for Astigmatism</td></tr>
        </tbody>
      </table>
    </BlogLayout>
  );
}
