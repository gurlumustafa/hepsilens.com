/* ── section: hızlı kargo & güvence şeridi ── */
export default function ShippingFeatures() {
  const features = [
    {
      icon: "local_shipping",
      title: "Ücretsiz Kargo",
      description: "Türkiye'nin her yerine ücretsiz kargo.",
    },
    {
      icon: "inventory_2",
      title: "Stoktan Hızlı Teslimat",
      description: "Mevcut stoklarımızdan aynı gün kargo ile bekleme yok.",
    },
    {
      icon: "verified_user",
      title: "Güvenli Alışveriş",
      description: "SSL ile korunan ödeme altyapısı ve güvenli ödeme seçenekleri.",
    },
    {
      icon: "headset_mic",
      title: "Sizi Dinliyoruz",
      description: "Tecrübeli optisyenlerimizden yardım alabilirsiniz.",
    },
  ];

  return (
    <section id="guven-seridi" className="max-w-[1280px] mx-auto px-10 pt-25 pb-12 mt-4 border-t border-[#e5e7eb]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {features.map((f, i) => (
          <div
            key={i}
            className="group flex flex-col items-center text-center p-6 rounded-[1rem]  "
          >
            {/* İkon dairesi */}
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#003d9b]/10 mb-4  ">
              <span
                className="material-symbols-outlined text-[#003d9b]"
                style={{ fontSize: "28px" }}
              >
                {f.icon}
              </span>
            </div>

            {/* Başlık */}
            <h3
              className="text-[#191c1e] mb-1.5"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "15px",
                fontWeight: 700,
                lineHeight: "22px",
              }}
            >
              {f.title}
            </h3>

            {/* Açıklama */}
            <p
              className="text-[#737685]"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                lineHeight: "20px",
              }}
            >
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
