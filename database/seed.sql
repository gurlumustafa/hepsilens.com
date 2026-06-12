-- ============================================================
-- HepsiLens — Başlangıç Verisi (Seed)
-- ============================================================
-- KULLANIM:
--   Önce schema.sql çalıştırın, sonra bu dosyayı import edin.
--   mysql -h 127.0.0.1 -u u607457950_hepsilens -p u607457950_hepsilens < seed.sql
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Tüm veriyi temizle (yeniden çalıştırmaya karşı güvenli)
TRUNCATE TABLE oauth_states;
TRUNCATE TABLE reviews;
TRUNCATE TABLE cart_items;
TRUNCATE TABLE carts;
TRUNCATE TABLE favorites;
TRUNCATE TABLE order_items;
TRUNCATE TABLE orders;
TRUNCATE TABLE addresses;
TRUNCATE TABLE products;
TRUNCATE TABLE campaigns;
TRUNCATE TABLE brands;

-- ============================================================
-- 1. MARKALAR (12 adet)
-- ============================================================

INSERT INTO brands (id, name, logo, tagline, is_active) VALUES
  ('johnson',      'Acuvue (Johnson & Johnson)', '👁️',  'Dünyanın 1 numaralı lens markası',            1),
  ('alcon',        'Alcon',                       '💧',  'Göz sağlığında küresel lider',                 1),
  ('freshlook',    'FreshLook',                   '🌈',  'Renkli lensde ikonik marka',                   1),
  ('coopervision', 'CooperVision',                '🔵',  'Her göz için doğru lens',                      1),
  ('bausch',       'Bausch + Lomb',               '⚡',  '170 yıllık göz sağlığı deneyimi',              1),
  ('hoya',         'Hoya',                        '🏔️', 'Japon optik mühendisliği',                     1),
  ('menicon',      'Menicon',                     '🇯🇵', 'Japonya''nın köklü lens üreticisi',             1),
  ('avizor',       'Avizor',                      '🧪',  'İspanyol optik kalitesi',                      1),
  ('renu',         'ReNu',                        '💦',  'Bausch + Lomb bakım solüsyonu serisi',         1),
  ('optifree',     'Opti-Free',                   '🔬',  'Alcon profesyonel bakım serisi',               1),
  ('biotrue',      'Biotrue',                     '🌿',  'Doğadan ilham alan lens bakımı',               1),
  ('blink',        'Blink',                       '✨',  'Yapay gözyaşı ve nemlendirici damla serisi',   1);


-- ============================================================
-- 2. ÜRÜNLER — LENSLER (10 adet)
-- ============================================================
-- Not: rating ve review_count alanları INSERT sonrası
--      reviews tablosundan tetikleyici ile otomatik hesaplanır.

INSERT INTO products (
  product_type, name, brand, brand_id,
  price, original_price,
  color, color_name, usage_period, requires_prescription,
  dia, bc, sph_range, material, water_content, oxygen_permeability,
  uv_protection, is_toric, cyl_options, axis_options,
  pack_sizes, tags, description, badge, stock, is_active
) VALUES

-- ── 1. Acuvue Oasys 1-Day ─────────────────────────────────
(
  'lens', 'Acuvue Oasys 1-Day', 'Acuvue', 'johnson',
  489.90, 589.90,
  'clear', NULL, 'daily', 1,
  14.3, 8.5, '-0.50 ile -12.00 arası',
  'Senofilcon A', 38, 121.0,
  1, 0, NULL, NULL,
  '[30, 90]',
  '["günlük","silikon hidrojel","uv koruma","kuru göz"]',
  'HYDRALUXE teknolojisiyle göz salgısı taklidi yapan nem faktörü ile her gün taze lens konforu. UV-A ve UV-B filtresi ile göz sağlığını korur.',
  'Çok Satan', 250, 1
),

-- ── 2. Dailies Total1 ─────────────────────────────────────
(
  'lens', 'Dailies Total1', 'Alcon', 'alcon',
  529.90, NULL,
  'clear', NULL, 'daily', 1,
  14.1, 8.5, '-0.50 ile -10.00 arası',
  'Delefilcon A', 33, 156.0,
  0, 0, NULL, NULL,
  '[30, 90]',
  '["günlük","su bazlı","nefes alabilir","premium"]',
  'Yüzeyi %100 suya benzer bileşimli Water Gradient teknolojisi ile eşsiz konfor ve yüksek oksijen geçirgenliği. Günün sonunda bile taze hissettiren lens.',
  'Premium', 180, 1
),

-- ── 3. Biofinity Aylık ────────────────────────────────────
(
  'lens', 'Biofinity', 'CooperVision', 'coopervision',
  349.90, 419.90,
  'clear', NULL, 'monthly', 1,
  14.0, 8.6, '-0.25 ile -10.00 arası',
  'Comfilcon A', 48, 160.0,
  0, 0, NULL, NULL,
  '[3, 6]',
  '["aylık","yüksek oksijen","gece kullanım onaylı","silikon hidrojel"]',
  'Aquaform teknolojisiyle aylık kullanım için üstün konfor ve oksijen geçirgenliği. Göz doktoru onaylı, sürekli kullanım için uygundur.',
  NULL, 320, 1
),

-- ── 4. Air Optix Aqua ─────────────────────────────────────
(
  'lens', 'Air Optix Aqua', 'Alcon', 'alcon',
  299.90, NULL,
  'clear', NULL, 'monthly', 1,
  14.2, 8.6, '-0.75 ile -8.00 arası',
  'Lotrafilcon B', 33, 138.0,
  0, 0, NULL, NULL,
  '[3, 6]',
  '["aylık","nefes alabilir","hassas gözler"]',
  'SmartShield teknolojisiyle protein ve lipid birikimini önler. Hassas gözler için özel olarak geliştirilmiştir.',
  NULL, 410, 1
),

-- ── 5. Acuvue Oasys for Astigmatism (Toric) ───────────────
(
  'lens', 'Acuvue Oasys Astigmatizm', 'Acuvue', 'johnson',
  619.90, 699.90,
  'clear', NULL, 'biweekly', 1,
  14.5, 8.6, '-0.75 ile -5.75 arası',
  'Senofilcon A', 38, 147.0,
  1, 1,
  '[-0.75, -1.25, -1.75, -2.25]',
  '[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180]',
  '[6]',
  '["toric","astigmat","iki haftada bir","uv koruma","silikon hidrojel"]',
  'HYDRACLEAR Plus ve STEREO PRECISION teknolojisiyle astigmat lenslerinde konfor zirvesi. UV-A ve UV-B koruması ile göz sağlığını destekler.',
  NULL, 150, 1
),

-- ── 6. Bausch+Lomb Ultra Aylık ────────────────────────────
(
  'lens', 'Bausch+Lomb Ultra', 'Bausch + Lomb', 'bausch',
  389.90, NULL,
  'clear', NULL, 'monthly', 1,
  14.2, 8.5, '-0.25 ile -9.00 arası',
  'Samfilcon A', 46, 163.0,
  0, 0, NULL, NULL,
  '[3, 6]',
  '["aylık","silikon hidrojel","MoistureSeal","uzun süre kullanım"]',
  'MoistureSeal teknolojisiyle 16 saat boyunca tüm gün boyunca büyük konfor. Dijital göz yorgunluğunu azaltmak için tasarlanmış aylık lens.',
  'Yeni', 200, 1
),

-- ── 7. FreshLook ColorBlends Mavi ─────────────────────────
(
  'lens', 'FreshLook ColorBlends Mavi', 'FreshLook', 'freshlook',
  279.90, 329.90,
  'colored', 'Mavi', 'monthly', 0,
  14.5, 8.6, '0.00 ile -6.00 arası',
  'Etafilcon A', 55, 26.0,
  0, 0, NULL, NULL,
  '[2]',
  '["renkli","kozmetik","aylık","mavi","reçetesiz"]',
  '3 tonlu renk teknolojisiyle doğal ve etkileyici mavi göz rengi. Reçete gerektirmez; görme bozukluğu olmayan kullanıcılar da güvenle kullanabilir.',
  NULL, 290, 1
),

-- ── 8. FreshLook ColorBlends Yeşil ────────────────────────
(
  'lens', 'FreshLook ColorBlends Yeşil', 'FreshLook', 'freshlook',
  279.90, 329.90,
  'colored', 'Yeşil', 'monthly', 0,
  14.5, 8.6, '0.00 ile -6.00 arası',
  'Etafilcon A', 55, 26.0,
  0, 0, NULL, NULL,
  '[2]',
  '["renkli","kozmetik","aylık","yeşil","reçetesiz"]',
  '3 tonlu renk teknolojisiyle doğal ve büyüleyici yeşil göz rengi. Reçete gerektirmez.',
  NULL, 210, 1
),

-- ── 9. FreshLook ColorBlends Gri ──────────────────────────
(
  'lens', 'FreshLook ColorBlends Gri', 'FreshLook', 'freshlook',
  279.90, 329.90,
  'colored', 'Gri', 'monthly', 0,
  14.5, 8.6, '0.00 ile -6.00 arası',
  'Etafilcon A', 55, 26.0,
  0, 0, NULL, NULL,
  '[2]',
  '["renkli","kozmetik","aylık","gri","reçetesiz"]',
  '3 tonlu renk teknolojisiyle sofistike ve etkileyici gri göz rengi. Reçete gerektirmez.',
  '%15 İndirim', 185, 1
),

-- ── 10. Air Optix Colors Kahverengi ───────────────────────
(
  'lens', 'Air Optix Colors Kahverengi', 'Alcon', 'alcon',
  319.90, NULL,
  'colored', 'Kahverengi', 'monthly', 0,
  14.2, 8.6, '0.00 ile -6.00 arası',
  'Lotrafilcon B', 33, 138.0,
  0, 0, NULL, NULL,
  '[2]',
  '["renkli","kozmetik","aylık","kahverengi","reçetesiz"]',
  'SmartShield teknolojisiyle sağlıklı ve canlı kahverengi renk. Nefes alabilen lens yapısıyla tüm gün konfor.',
  NULL, 140, 1
);


-- ============================================================
-- 3. ÜRÜNLER — AKSESUARLAR (7 adet)
-- ============================================================

INSERT INTO products (
  product_type, name, brand, brand_id,
  price, original_price,
  accessory_category, description, badge, stock, is_active
) VALUES

-- ── Lens Solüsyonları ──────────────────────────────────────
(
  'accessory', 'ReNu Advanced 360 ml', 'ReNu', 'renu',
  189.90, 229.90,
  'solution',
  'Çok amaçlı lens solüsyonu. Temizleme, durulama, dezenfeksiyon ve saklama tek üründe. Tüm yumuşak lens tipleriyle uyumlu.',
  '%20 İndirim', 380, 1
),
(
  'accessory', 'Opti-Free Puremoist 300 ml', 'Opti-Free', 'optifree',
  209.90, NULL,
  'solution',
  'ALDOX ve HydraGlyde teknolojisiyle tüm yumuşak lens tipleriyle uyumlu. Günlük ve aylık lensler için üstün temizleme gücü.',
  'Çok Satan', 290, 1
),
(
  'accessory', 'Biotrue 300 ml', 'Biotrue', 'biotrue',
  199.90, NULL,
  'solution',
  'Doğal gözyaşıyla aynı pH değerinde, hiyalüronik asit katkılı. 20 saat nem etkisi. Tüm yumuşak lenslerle uyumlu.',
  NULL, 220, 1
),
(
  'accessory', 'ReNu MultiPlus 360 ml', 'ReNu', 'renu',
  179.90, 219.90,
  'solution',
  'Üçlü dezenfeksiyon etkisiyle güçlü temizleme. Günlük ve aylık lensler için uygundur. Ekonomik boy seçeneği.',
  NULL, 160, 1
),

-- ── Göz Damlaları ─────────────────────────────────────────
(
  'accessory', 'Blink Intensive Tears 10 ml', 'Blink', 'blink',
  129.90, NULL,
  'eyedrop',
  'Yoğun nemlendirici göz damlası. Lens içinde ve çıkardıktan sonra kullanılabilir. Kuru göz sendromu için önerilir.',
  NULL, 450, 1
),
(
  'accessory', 'Blink N Clean 15 ml', 'Blink', 'blink',
  119.90, 149.90,
  'eyedrop',
  'Lens üzerindeki protein birikimini anında temizler, görüş netliğini artırır. Silikon hidrojel ve standart yumuşak lenslerle uyumlu.',
  NULL, 310, 1
),
(
  'accessory', 'Biotrue Göz Damlası 10 ml', 'Biotrue', 'biotrue',
  139.90, NULL,
  'eyedrop',
  'Hiyalüronik asit katkılı, uzun süreli nemlendirme etkisi. Lens uyumlu özel formülü ile gün boyu konforu destekler.',
  'Yeni', 280, 1
);


-- ============================================================
-- 3b. ÜRÜNLER — FRESHLOOK COLORBLENDS SERISI (10 renk)
-- ============================================================

INSERT INTO products (
  product_type, name, brand, brand_id,
  price, original_price,
  image_url,
  description, badge, stock, is_active,
  color, color_name, usage_period, requires_prescription,
  dia, bc, sph_range, pack_sizes,
  material, water_content, oxygen_permeability, uv_protection,
  is_toric, cyl_options, axis_options
) VALUES

(
  'lens', 'FreshLook ColorBlends Honey (Bal Rengi) Numarasız Renkli Lens - Hareli', 'Alcon', 'alcon',
  1274.00, NULL,
  'https://freshlook.com.tr/ups/2025/12/honey-freshlook-renkli-lens-scaled.webp',
  'FreshLook ColorBlends Honey (Bal Rengi) – Numarasız Hareli Renkli Lens (Aylık) FreshLook ColorBlends Honey (Bal Rengi) numarasız (kozmetik) hareli renkli lens, gözlere sıcak bal/kehribar tonunu kazandırmak isteyenler için geliştirilmiş aylık kullanım planlı renkli kontakt lenstir.',
  'Çok Satan', 464, 1,
  'colored', 'Bal Rengi (Honey)', 'monthly', 0,
  14.5, 8.60, NULL, '[2]',
  'Phemfilcon A', 55, 20.0, 0,
  0, NULL, NULL
),
(
  'lens', 'FreshLook ColorBlends Gemstone Green (Zümrüt Yeşili) Numarasız Renkli Lens - Hareli', 'Alcon', 'alcon',
  1274.00, NULL,
  'https://freshlook.com.tr/ups/2025/12/gemstone-green-freshlook-renkli-lens-scaled.webp',
  'FreshLook ColorBlends Gemstone Green (Zümrüt Yeşili) – Numarasız Hareli Renkli Lens (Aylık) FreshLook ColorBlends Gemstone Green (Zümrüt Yeşili) numarasız (kozmetik) hareli renkli lens, göz renginde daha yoğun ve çarpıcı bir yeşil dönüşüm isteyenler için geliştirilmiş aylık kullanım planlı kontakt lenstir.',
  'Çok Satan', 2267, 1,
  'colored', 'Zümrüt Yeşili (Gemstone Green)', 'monthly', 0,
  14.5, 8.60, NULL, '[2]',
  'Phemfilcon A', 55, 20.0, 0,
  0, NULL, NULL
),
(
  'lens', 'FreshLook ColorBlends Brilliant Blue (Parlak Mavi) Numarasız Renkli Lens - Hareli', 'Alcon', 'alcon',
  799.00, NULL,
  'https://freshlook.com.tr/ups/2025/12/brilliant-blue-freshlook-renkli-lens-scaled.webp',
  'FreshLook ColorBlends Brilliant Blue (Parlak Mavi) – Numarasız Hareli Renkli Lens (Aylık) FreshLook ColorBlends Brilliant Blue (Parlak Mavi) numarasız (kozmetik) hareli renkli lens, göz renginde dikkat çekici, canlı ve parlak mavi bir etki isteyenler için geliştirilmiş aylık kullanım planlı kontakt lenstir.',
  'Çok Satan', 1015, 1,
  'colored', 'Parlak Mavi (Brilliant Blue)', 'monthly', 0,
  14.5, 8.60, NULL, '[2]',
  'Phemfilcon A', 55, 20.0, 0,
  0, NULL, NULL
),
(
  'lens', 'FreshLook ColorBlends Sterling Gray (Gümüş Gri) Numarasız Renkli Lens - Hareli', 'Alcon', 'alcon',
  1274.00, NULL,
  'https://freshlook.com.tr/ups/2025/12/sterling-gray-freshlook-renkli-lens-scaled.webp',
  'FreshLook ColorBlends Sterling Gray (Gümüş Gri) – Numarasız Hareli Renkli Lens (Aylık) FreshLook ColorBlends Sterling Gray (Gümüş Gri) numarasız (kozmetik) hareli renkli lens, göz renginde daha güçlü bir değişim ve daha belirgin gri görünüm isteyenler için geliştirilmiş aylık kullanım planlı kontakt lenstir.',
  'Çok Satan', 2236, 1,
  'colored', 'Gümüş Gri (Sterling Gray)', 'monthly', 0,
  14.5, 8.60, NULL, '[2]',
  'Phemfilcon A', 55, 20.0, 0,
  0, NULL, NULL
),
(
  'lens', 'FreshLook ColorBlends Pure Hazel (Saf Ela) Numarasız Renkli Lens - Hareli', 'Alcon', 'alcon',
  1274.00, NULL,
  'https://freshlook.com.tr/ups/2025/12/pure-hazel-freshlook-renkli-lens-scaled.webp',
  'FreshLook ColorBlends Pure Hazel (Saf Ela) – Numarasız Hareli Renkli Lens (Aylık) FreshLook ColorBlends Pure Hazel (Saf Ela) numarasız (kozmetik) hareli renkli lens, gözlerde sıcak, yumuşak ve doğal bir ela görünüm isteyen kullanıcılar için geliştirilmiş aylık kullanım planlı kontakt lenstir.',
  'Çok Satan', 506, 1,
  'colored', 'Saf Ela (Pure Hazel)', 'monthly', 0,
  14.5, 8.60, NULL, '[2]',
  'Phemfilcon A', 55, 20.0, 0,
  0, NULL, NULL
),
(
  'lens', 'FreshLook ColorBlends Green (Yeşil) Numarasız Renkli Lens - Hareli', 'Alcon', 'alcon',
  1274.00, NULL,
  'https://freshlook.com.tr/ups/2025/12/green-freshlook-renkli-lens-scaled.webp',
  'FreshLook ColorBlends Green (Yeşil) – Numarasız Hareli Renkli Lens (Aylık) FreshLook ColorBlends Green (Yeşil) numarasız (kozmetik) hareli renkli lens, günlük kullanımda doğal yeşil bakış isteyenler için geliştirilmiş aylık kullanım planlı kontakt lenstir.',
  'Çok Satan', 3172, 1,
  'colored', 'Yeşil (Green)', 'monthly', 0,
  14.5, 8.60, NULL, '[2]',
  'Phemfilcon A', 55, 20.0, 0,
  0, NULL, NULL
),
(
  'lens', 'FreshLook ColorBlends Gray (Gri) Numarasız Renkli Lens - Hareli', 'Alcon', 'alcon',
  1274.00, NULL,
  'https://freshlook.com.tr/ups/2025/12/gray-freshlook-renkli-lens-scaled.webp',
  'FreshLook ColorBlends Gray (Gri) – Numarasız Hareli Renkli Lens (Aylık) FreshLook ColorBlends Gray (Gri) numarasız (kozmetik) hareli renkli lens, göz rengini doğal görünümü koruyarak gri tona taşımak isteyenler için geliştirilmiş aylık kullanım planlı kontakt lenstir.',
  'Çok Satan', 1023, 1,
  'colored', 'Gri (Gray)', 'monthly', 0,
  14.5, 8.60, NULL, '[2]',
  'Phemfilcon A', 55, 20.0, 0,
  0, NULL, NULL
),
(
  'lens', 'FreshLook ColorBlends Blue (Mavi) Numarasız Renkli Lens - Hareli', 'Alcon', 'alcon',
  1274.00, NULL,
  'https://freshlook.com.tr/ups/2025/12/blue-freshlook-renkli-lens-scaled.webp',
  'FreshLook ColorBlends Blue (Mavi) – Numarasız Hareli Renkli Lens (Aylık) FreshLook ColorBlends Blue (Mavi) numarasız (kozmetik) hareli renkli lens, günlük kullanımda doğal görünümü korurken mavi göz etkisini fark edilir şekilde isteyenler için geliştirilmiş aylık kullanım planlı kontakt lenstir.',
  'Çok Satan', 1045, 1,
  'colored', 'Mavi (Blue)', 'monthly', 0,
  14.5, 8.60, NULL, '[2]',
  'Phemfilcon A', 55, 20.0, 0,
  0, NULL, NULL
),
(
  'lens', 'FreshLook ColorBlends Amethyst (Ametist) Numarasız Renkli Lens - Hareli', 'Alcon', 'alcon',
  1274.00, NULL,
  'https://freshlook.com.tr/ups/2026/01/amethyst-freshlook-renkli-lens-scaled.webp',
  'FreshLook ColorBlends Amethyst (Ametist) – Numarasız Hareli Renkli Lens (Aylık) FreshLook ColorBlends Amethyst (Ametist) numarasız (kozmetik) hareli renkli lens, gözlerde mor/ametist tonunu daha stil sahibi ve dikkat çekici bir görünümle buluşturmak isteyenler için geliştirilmiş aylık kullanım planlı kontakt lenstir.',
  'Çok Satan', 371, 1,
  'colored', 'Ametist Moru (Amethyst)', 'monthly', 0,
  14.5, 8.60, NULL, '[2]',
  'Phemfilcon A', 55, 20.0, 0,
  0, NULL, NULL
),
(
  'lens', 'FreshLook ColorBlends Turquoise (Turkuaz) Numarasız Renkli Lens – Hareli', 'Alcon', 'alcon',
  1274.00, NULL,
  'https://freshlook.com.tr/ups/2026/01/turquoise-freshlook-renkli-lens-scaled.webp',
  'FreshLook ColorBlends Turquoise (Turkuaz) – Hareli Renkli Lens (Aylık) FreshLook ColorBlends Turquoise (Turkuaz) hareli renkli lens, gözlerde ferah, canlı ve dikkat çekici turkuaz ton isteyenler için geliştirilmiş aylık kullanım planlı kontakt lenstir.',
  'Çok Satan', 366, 1,
  'colored', 'Turkuaz (Turquoise)', 'monthly', 0,
  14.5, 8.60, NULL, '[2]',
  'Phemfilcon A', 55, 20.0, 0,
  0, NULL, NULL
);


-- ============================================================
-- 4. KAMPANYALAR (3 adet)
-- ============================================================

INSERT INTO campaigns
  (title, subtitle, description, cta, bg, accent, emoji, is_active, display_order)
VALUES
(
  'Günlük Lens Kampanyası',
  '90''lık Pakette %25 İndirim',
  'Acuvue ve Dailies günlük lenslerinde 90''lık pakete özel fırsat. Sınırlı süre.',
  'Hemen Alışveriş Yap',
  'from-[#003d9b] to-[#0056e0]',
  '#50dcff',
  '👁️',
  1, 1
),
(
  'Ücretsiz Kargo',
  '500 TL Üzeri Tüm Siparişlerde',
  'Sepetinizi doldurun, kargo bizden. Tüm Türkiye''ye kapı kapı teslimat.',
  'Ürünleri Keşfet',
  'from-[#00687b] to-[#009ab3]',
  '#afecff',
  '🚀',
  1, 2
),
(
  'Renkli Lens Sezonu',
  'FreshLook ColorBlends Serisi',
  '3 tonlu renk teknolojisiyle göz renginizi değiştirin. Reçetesiz kullanım.',
  'Renkleri Gör',
  'from-[#6d28d9] to-[#9333ea]',
  '#e9d5ff',
  '🌈',
  1, 3
);


-- ============================================================
-- 5. ÖRNEK YORUMLAR
-- ============================================================
-- user_id NULL = misafir yorum
-- Tetikleyiciler products.rating ve review_count'u otomatik günceller

-- Acuvue Oasys 1-Day (product_id = 1) için yorumlar
INSERT INTO reviews (product_id, user_id, user_name, rating, comment, helpful_count, verified) VALUES
(1, NULL, 'Merve K.',  5, 'Çok rahat bir lens, sabahtan akşama kadar göz kuruluğu yaşamadım. Kesinlikle tavsiye ederim!', 24, 1),
(1, NULL, 'Ahmet Y.',  5, 'Acuvue ürünlerini yıllardır kullanıyorum, bu ürün gerçekten en iyisi. UV koruması da artı puan.', 18, 1),
(1, NULL, 'Selin T.',  4, 'Çok memnunum ama fiyatı biraz yüksek. Konfor açısından mükemmel.', 12, 1),
(1, NULL, 'Can Ö.',   5, 'Astigmatım var ama bu lensler gayet iyi oturdu. Doktorum da önerdi.', 9, 0),
(1, NULL, 'Ayşe D.',  5, 'Sporla uğraşıyorum, günlük lens kullanmak çok pratik. Hiç kayma yok.', 15, 1);

-- Dailies Total1 (product_id = 2) için yorumlar
INSERT INTO reviews (product_id, user_id, user_name, rating, comment, helpful_count, verified) VALUES
(2, NULL, 'Zeynep A.', 5, 'Su bazlı formülü gerçekten fark yaratıyor. Lens taktığımı unutuyorum bazen.', 31, 1),
(2, NULL, 'Burak M.',  5, 'Premium fiyatına değer. Uzun mesafe sürüş yapıyorum, hiç sorun yaşamadım.', 22, 1),
(2, NULL, 'Elif Ş.',   4, 'Mükemmel konfor, sadece fiyatı yüksek. Ama kaliteye bakınca anlıyorsunuz.', 14, 0),
(2, NULL, 'Hasan K.',  5, 'Kuru göz problemi yaşıyordum, bu ürünle geçti. Çok memnunum.', 19, 1);

-- Biofinity (product_id = 3) için yorumlar
INSERT INTO reviews (product_id, user_id, user_name, rating, comment, helpful_count, verified) VALUES
(3, NULL, 'Pınar B.',  5, 'Aylık lens arayanlar için en iyi seçenek. 30 gün boyunca konforlu kullanım.', 27, 1),
(3, NULL, 'Mert A.',   4, 'Çok iyi bir ürün, oksijen geçirgenliği sayesinde gözlerim nefes alıyor.', 16, 1),
(3, NULL, 'Fatma Y.',  5, 'Doktorum önerdi, çok memnunum. Göz kuruluğu yok.', 11, 1),
(3, NULL, 'Kerem S.',  4, 'Fiyat/performans açısından en iyisi. İkinci kutuyu sipariş ettim.', 8, 0);

-- FreshLook ColorBlends Mavi (product_id = 7) için yorumlar
INSERT INTO reviews (product_id, user_id, user_name, rating, comment, helpful_count, verified) VALUES
(7, NULL, 'Büşra T.',  5, 'Çok doğal görünüyor! Herkes gözümün rengini soruyor. Harika ürün.', 42, 1),
(7, NULL, 'Derya K.',  4, 'Renkli lens almak isteyenlere kesinlikle tavsiye ederim. Rahat kullanım.', 28, 1),
(7, NULL, 'Neslihan Ö.', 5, '3 tonlu teknoloji gerçekten fark yaratıyor, çok doğal duruyor.', 35, 1),
(7, NULL, 'İrem S.',   4, 'Güzel renk, reçetesiz kullanabiliyorum. Pratik ve şık.', 19, 0);

-- ReNu Advanced (product_id = 11) için yorumlar
INSERT INTO reviews (product_id, user_id, user_name, rating, comment, helpful_count, verified) VALUES
(11, NULL, 'Ali C.',   5, 'Lenslerimi temizlemek için yıllardır bu ürünü kullanıyorum. Güvenilir.', 13, 1),
(11, NULL, 'Gül Y.',   4, 'İyi bir solüsyon. Lens kutusu içinde 20 saat sakladım, lens taze kaldı.', 9, 1);


-- ============================================================
SET FOREIGN_KEY_CHECKS = 1;
-- ============================================================

-- Kontrol sorgusu
SELECT CONCAT('Markalar    : ', COUNT(*)) AS ozet FROM brands
UNION ALL SELECT CONCAT('Ürünler     : ', COUNT(*)) FROM products
UNION ALL SELECT CONCAT('  - Lens    : ', COUNT(*)) FROM products WHERE product_type = 'lens'
UNION ALL SELECT CONCAT('    - Renkli: ', COUNT(*)) FROM products WHERE product_type = 'lens' AND color = 'colored'
UNION ALL SELECT CONCAT('  - Aksesuar: ', COUNT(*)) FROM products WHERE product_type = 'accessory'
UNION ALL SELECT CONCAT('Kampanyalar : ', COUNT(*)) FROM campaigns
UNION ALL SELECT CONCAT('Yorumlar    : ', COUNT(*)) FROM reviews;
