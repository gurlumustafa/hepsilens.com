import CampaignBanner from "@/components/CampaignBanner";
import CategoryQuickLinks from "@/components/CategoryQuickLinks";
import PopularProductsCarousel from "@/components/PopularProductsCarousel";
import OtherProductsSection from "@/components/OtherProductsSection";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import BrandStrip from "@/components/BrandStrip";
import NewsletterSection from "@/components/NewsletterSection";
import ShippingFeatures from "@/components/ShippingFeatures";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <main className="pt-[72px]">
      {/* Hero banner — anında görünür */}
      <div id="hero-banner">
        <CampaignBanner />
        <div className="w-full bg-[#E5E7EB] border-b border-[#edeef3] py-2.5 flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.02)] relative z-10">
          <p className="text-[#434654] flex items-center gap-2" style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'Inter'" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "#003d9b", fontVariationSettings: "'FILL' 1" }}>info</span>
            Türkiye’deki yasal düzenlemelere göre kontakt lensler reçete ile satılmaktadır.
          </p>
        </div>
      </div>

      {/* Popüler ürünler */}
      <ScrollReveal variant="up" delay={60} threshold={0.22}>
        <PopularProductsCarousel />
      </ScrollReveal>

      {/* Kategori kartları */}
      <ScrollReveal variant="up" delay={80} threshold={0.22}>
        <CategoryQuickLinks />
      </ScrollReveal>

      {/* Diğer ürünler — soldan */}
      <ScrollReveal variant="left" delay={60} threshold={0.2}>
        <OtherProductsSection />
      </ScrollReveal>

      {/* Marka şeridi — sadece fade */}
      <ScrollReveal variant="fade" threshold={0.25}>
        <BrandStrip />
      </ScrollReveal>

      {/* Müşteri yorumları */}
      <ScrollReveal variant="up" delay={80} threshold={0.2}>
        <ReviewsCarousel />
      </ScrollReveal>

      {/* Bülten — scale */}
      <ScrollReveal variant="scale" delay={60} threshold={0.25}>
        <NewsletterSection />
      </ScrollReveal>

      {/* Güven şeridi */}
      <ScrollReveal variant="up" delay={40} threshold={0.22}>
        <ShippingFeatures />
      </ScrollReveal>
    </main>
  );
}
