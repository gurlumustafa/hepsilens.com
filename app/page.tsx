import CampaignBanner from "@/components/CampaignBanner";
import CategoryQuickLinks from "@/components/CategoryQuickLinks";
import PopularProductsCarousel from "@/components/PopularProductsCarousel";
import OtherProductsSection from "@/components/OtherProductsSection";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import BrandStrip from "@/components/BrandStrip";
import NewsletterSection from "@/components/NewsletterSection";
import ShippingFeatures from "@/components/ShippingFeatures";

/*
 * Ana Sayfa Bölümleri (id ile erişilebilir):
 *   #hero-banner        – kampanya slider
 *   #kategori-linkleri  – 4 kategori kartı
 *   #populer-urunler    – kaydırmalı popüler ürünler
 *   #diger-urunler      – solüsyonlar & göz damlaları
 *   #musteri-yorumlari  – 5 yıldızlı yorumlar carousel
 *   #marka-seridi       – marka marquee
 *   #bülten             – bülten aboneliği
 */
export default function Home() {
  return (
    <main className="pt-[72px]">
      {/* ── Kampanya Banner ── */}
      <div id="hero-banner">
        <CampaignBanner />
      </div>

      {/* ── Kategori Hızlı Linkleri ── */}
      <CategoryQuickLinks />

      {/* ── Popüler Ürünler Carousel ── */}
      <PopularProductsCarousel />

      {/* ── Diğer Ürünler (Solüsyon & Göz Damlası) ── */}
      <OtherProductsSection />

      {/* ── Marka Şeridi ── */}
      <BrandStrip />

      {/* ── Müşteri Yorumları ── */}
      <ReviewsCarousel />

      {/* ── Bülten ── */}
      <NewsletterSection />

      {/* ── Güven Şeridi (Kargo & Güvenlik) ── */}
      <ShippingFeatures />
    </main>
  );
}
