-- ============================================================
-- HepsiLens — Seed Verisi
-- Çalıştırmadan önce schema.sql'i çalıştırmış olun.
-- Kullanım: mysql -u root -p hepsilens < database/seed.sql
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- MARKALAR
-- ============================================================

INSERT INTO brands (id, name, logo, tagline, is_active) VALUES
  ('johnson',      'Acuvue (Johnson & Johnson)', '👁️',  'Dünyanın 1 numaralı lens markası',          1),
  ('alcon',        'Alcon',                       '💧',  'Göz sağlığında küresel lider',               1),
  ('freshlook',    'FreshLook',                   '🌈',  'Renkli lensde ikonik marka',                 1),
  ('coopervision', 'CooperVision',                '🔵',  'Her göz için doğru lens',                    1),
  ('bausch',       'Bausch + Lomb',               '⚡',  '170 yıllık göz sağlığı deneyimi',            1),
  ('hoya',         'Hoya',                        '🏔️', 'Japon optik mühendisliği',                   1),
  ('menicon',      'Menicon',                     '🇯🇵', 'Japonya\'nın köklü lens üreticisi',           1),
  ('avizor',       'Avizor',                      '🧪',  'İspanyol optik kalitesi',                    1),
  ('renu',         'ReNu',                        '💦',  'Bausch + Lomb bakım solüsyonu serisi',       1),
  ('optifree',     'Opti-Free',                   '🔬',  'Alcon\'ın profesyonel bakım serisi',         1),
  ('biotrue',      'Biotrue',                     '🌿',  'Doğadan ilham alan lens bakımı',             1),
  ('blink',        'Blink',                       '✨',  'Yapay gözyaşı ve nemlendirici damla serisi', 1);


-- ============================================================
-- ÖRNEK ÜRÜNLER — LENSLER
-- ============================================================

INSERT INTO products (
  product_type, name, brand, brand_id, price, original_price,
  color, usage_period, requires_prescription,
  dia, bc, sph_range, material, water_content, oxygen_permeability,
  uv_protection, pack_sizes, tags, description, badge, stock, rating, review_count
) VALUES

-- Günlük şeffaf lensler
(
  'lens', 'Acuvue Oasys 1-Day', 'Acuvue', 'johnson',
  489.90, 589.90,
  'clear', 'daily', 1,
  14.3, 8.5, '-0.50 ile -12.00 arası',
  'Senofilcon A', 38, 121.0,
  1, '[30, 90]', '["günlük","silikon hidrojel","uv koruma","kuru göz"]',
  'HYDRALUXE teknolojisiyle göz salgısı taklidi yapan nem faktörü. UV-A/B filtresi.',
  'Çok Satan', 250, 4.85, 312
),
(
  'lens', 'Dailies Total1', 'Alcon', 'alcon',
  529.90, NULL,
  'clear', 'daily', 1,
  14.1, 8.5, '-0.50 ile -10.00 arası',
  'Delefilcon A', 33, 156.0,
  0, '[30, 90]', '["günlük","su bazlı","nefes alabilir"]',
  'Yüzeyi %100 suya benzer bileşimli, eşsiz konfor ve oksijen geçirgenliği.',
  'Yeni', 180, 4.78, 198
),
(
  'lens', 'Biofinity', 'CooperVision', 'coopervision',
  349.90, 419.90,
  'clear', 'monthly', 1,
  14.0, 8.6, '-0.25 ile -10.00 arası',
  'Comfilcon A', 48, 160.0,
  0, '[3, 6]', '["aylık","yüksek oksijen","gece kullanım onaylı"]',
  'Aquaform teknolojisiyle aylık kullanım için üstün konfor.',
  NULL, 320, 4.72, 245
),
(
  'lens', 'Air Optix Aqua', 'Alcon', 'alcon',
  299.90, NULL,
  'clear', 'monthly', 1,
  14.2, 8.6, '-0.75 ile -8.00 arası',
  'Lotrafilcon B', 33, 138.0,
  0, '[3, 6]', '["aylık","nefes alabilir","hassas gözler"]',
  'SmartShield teknolojisiyle protein ve lipid birikimini önler.',
  NULL, 410, 4.65, 187
),
(
  'lens', 'Acuvue Oasys Astigmatizm', 'Acuvue', 'johnson',
  619.90, 699.90,
  'clear', 'biweekly', 1,
  14.5, 8.6, '-0.75 ile -5.75 arası',
  'Senofilcon A', 38, 147.0,
  1, '[6]', '["toric","astigmat","iki haftada bir","uv koruma"]',
  'HYDRACLEAR Plus teknolojisiyle astigmat lenslerinde konfor zirvesi.',
  NULL, 150, 4.80, 143
),

-- Renkli lensler
(
  'lens', 'FreshLook ColorBlends Mavi', 'FreshLook', 'freshlook',
  279.90, 329.90,
  'colored', 'monthly', 0,
  14.5, 8.6, '0.00 ile -6.00 arası',
  'Etafilcon A', 55, 26.0,
  0, '[2]', '["renkli","kozmetik","aylık","mavi"]',
  '3 tonlu renk teknolojisiyle doğal görünüm. Reçetesiz kullanılabilir.',
  NULL, 290, 4.55, 421
),
(
  'lens', 'FreshLook ColorBlends Yeşil', 'FreshLook', 'freshlook',
  279.90, 329.90,
  'colored', 'monthly', 0,
  14.5, 8.6, '0.00 ile -6.00 arası',
  'Etafilcon A', 55, 26.0,
  0, '[2]', '["renkli","kozmetik","aylık","yeşil"]',
  '3 tonlu renk teknolojisiyle doğal yeşil görünüm.',
  NULL, 210, 4.50, 298
),
(
  'lens', 'FreshLook ColorBlends Gri', 'FreshLook', 'freshlook',
  279.90, 329.90,
  'colored', 'monthly', 0,
  14.5, 8.6, '0.00 ile -6.00 arası',
  'Etafilcon A', 55, 26.0,
  0, '[2]', '["renkli","kozmetik","aylık","gri"]',
  '3 tonlu renk teknolojisiyle sofistike gri görünüm.',
  '%15 İndirim', 185, 4.62, 267
),
(
  'lens', 'Air Optix Colors Kahverengi', 'Alcon', 'alcon',
  319.90, NULL,
  'colored', 'monthly', 0,
  14.2, 8.6, '0.00 ile -6.00 arası',
  'Lotrafilcon B', 33, 138.0,
  0, '[2]', '["renkli","kozmetik","aylık","kahverengi"]',
  'SmartShield teknolojisiyle sağlıklı ve canlı renk.',
  NULL, 140, 4.48, 156
);


-- ============================================================
-- ÖRNEK ÜRÜNLER — AKSESUARLAR
-- ============================================================

INSERT INTO products (
  product_type, name, brand, brand_id, price, original_price,
  accessory_category, description, badge, stock, rating, review_count
) VALUES

-- Solüsyonlar
(
  'accessory', 'ReNu Advanced 360 ml', 'ReNu', 'renu',
  189.90, 229.90,
  'solution',
  'Çok amaçlı lens solüsyonu. Temizleme, durulama, dezenfeksiyon ve saklama tek üründe.',
  '%20 İndirim', 380, 4.70, 312
),
(
  'accessory', 'Opti-Free Puremoist 300 ml', 'Opti-Free', 'optifree',
  209.90, NULL,
  'solution',
  'ALDOX ve HydraGlyde teknolojisiyle tüm yumuşak lens tipleriyle uyumlu.',
  'Çok Satan', 290, 4.75, 287
),
(
  'accessory', 'Biotrue 300 ml', 'Biotrue', 'biotrue',
  199.90, NULL,
  'solution',
  'Doğal gözyaşıyla aynı pH değerinde, HA katkılı. 20 saat nem etkisi.',
  NULL, 220, 4.68, 198
),
(
  'accessory', 'ReNu MultiPlus 360 ml', 'ReNu', 'renu',
  179.90, 219.90,
  'solution',
  'Üçlü dezenfeksiyon etkisi. Günlük ve aylık lensler için uygundur.',
  NULL, 160, 4.55, 143
),

-- Göz damlaları
(
  'accessory', 'Blink Intensive Tears 10 ml', 'Blink', 'blink',
  129.90, NULL,
  'eyedrop',
  'Yoğun nemlendirici göz damlası. Lens içinde ve çıkardıktan sonra kullanılabilir.',
  NULL, 450, 4.60, 203
),
(
  'accessory', 'Blink N Clean 15 ml', 'Blink', 'blink',
  119.90, 149.90,
  'eyedrop',
  'Lens üzerindeki protein birikimini anında temizler, netliği artırır.',
  NULL, 310, 4.45, 167
),
(
  'accessory', 'Biotrue Göz Damlası 10 ml', 'Biotrue', 'biotrue',
  139.90, NULL,
  'eyedrop',
  'Hiyalüronik asit katkılı, uzun süreli nemlendirme. Lens uyumlu formül.',
  'Yeni', 280, 4.72, 89
);


-- ============================================================
-- KAMPANYALAR / BANNERLAR
-- ============================================================

INSERT INTO campaigns (title, subtitle, description, cta, bg, accent, emoji, is_active, display_order) VALUES
(
  'Günlük Lens Kampanyası',
  '90'lık Pakette %25 İndirim',
  'Acuvue ve Dailies günlük lenslerinde 90'lık pakete özel fırsat.',
  'Hemen Alışveriş Yap',
  'from-[#003d9b] to-[#0056e0]',
  '#50dcff',
  '👁️',
  1, 1
),
(
  'Ücretsiz Kargo',
  '500 TL Üzeri Tüm Siparişlerde',
  'Sepetinizi doldurun, kargo bizden.',
  'Ürünleri Keşfet',
  'from-[#00687b] to-[#009ab3]',
  '#afecff',
  '🚀',
  1, 2
),
(
  'Renkli Lens Sezonu',
  'FreshLook ColorBlends Serisi',
  '3 tonlu renk teknolojisiyle göz renginizi değiştirin.',
  'Renkleri Gör',
  'from-[#6d28d9] to-[#9333ea]',
  '#e9d5ff',
  '🌈',
  1, 3
);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- Kontrol sorgusu
-- ============================================================
SELECT CONCAT('Markalar: ', COUNT(*)) AS ozet FROM brands
UNION ALL
SELECT CONCAT('Ürünler: ',  COUNT(*)) FROM products
UNION ALL
SELECT CONCAT('Kampanyalar: ', COUNT(*)) FROM campaigns;
