-- ============================================================
-- HepsiLens — Referans Sorguları
-- Bu dosya doğrudan çalıştırılmaz; yalnızca referans amaçlıdır.
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- AUTH
-- ════════════════════════════════════════════════════════════

-- Yeni kullanıcı kaydı
INSERT INTO users (name, email, password_hash)
VALUES ('Mustafa Gürlü', 'mustafa@hepsilens.com', '$2b$12$...');

-- Giriş: kullanıcıyı bul (password_hash, JS tarafında bcrypt ile karşılaştırılır)
SELECT id, name, email, phone, password_hash, is_anonymous, member_since, notif_email, notif_sms
FROM users
WHERE email = 'mustafa@hepsilens.com'
LIMIT 1;

-- Session oluştur (başarılı girişten sonra — uygulama tarafında üretilir)
INSERT INTO sessions (session_token, user_id, ip_address, user_agent, expires_at)
VALUES (
  :token,              -- crypto.randomBytes(48).toString("hex")
  :user_id,
  :ip_address,
  :user_agent,
  DATE_ADD(NOW(), INTERVAL 30 DAY)
);

-- Session doğrula (her istekte cookie token'ı ile)
SELECT u.id, u.name, u.email, u.phone, u.is_anonymous, u.notif_email, u.notif_sms, u.member_since
FROM sessions s
JOIN users u ON u.id = s.user_id
WHERE s.session_token = :token
  AND s.expires_at > NOW()
LIMIT 1;

-- Session aktivitesini güncelle (fire-and-forget)
UPDATE sessions SET last_activity = NOW() WHERE session_token = :token;

-- Çıkış: session sil
DELETE FROM sessions WHERE session_token = :token;

-- Süresi dolmuş session'ları temizle (cron job)
DELETE FROM sessions WHERE expires_at < DATE_SUB(NOW(), INTERVAL 1 DAY);


-- ════════════════════════════════════════════════════════════
-- ÜRÜNLER
-- ════════════════════════════════════════════════════════════

-- Aktif lensler — tüm alanlar
SELECT
  p.id, p.product_type, p.name, p.brand, p.brand_id,
  p.price, p.original_price, p.rating, p.review_count,
  p.image, p.image_url, p.description, p.badge, p.stock,
  p.color, p.color_name, p.usage_period, p.requires_prescription,
  p.dia, p.bc, p.sph_range,
  p.pack_sizes, p.material, p.water_content, p.oxygen_permeability,
  p.uv_protection, p.tags, p.is_toric, p.cyl_options, p.axis_options,
  p.accessory_category
FROM products p
WHERE p.is_active = 1 AND p.product_type = 'lens'
ORDER BY p.review_count DESC;

-- Renkli lensler
SELECT * FROM products
WHERE is_active = 1 AND product_type = 'lens' AND color = 'colored';

-- Günlük lensler
SELECT * FROM products
WHERE is_active = 1 AND product_type = 'lens' AND usage_period = 'daily';

-- Toric lensler
SELECT * FROM products
WHERE is_active = 1 AND product_type = 'lens' AND is_toric = 1;

-- Aksesuarlar — solüsyonlar
SELECT * FROM products
WHERE is_active = 1 AND product_type = 'accessory' AND accessory_category = 'solution';

-- Markaya göre filtrele
SELECT * FROM products
WHERE is_active = 1 AND brand_id = 'freshlook';

-- Tam metin arama
SELECT *, MATCH(name, description) AGAINST (:q IN BOOLEAN MODE) AS score
FROM products
WHERE is_active = 1
  AND MATCH(name, description) AGAINST (:q IN BOOLEAN MODE)
ORDER BY score DESC;

-- Ürün detayı (marka bilgisiyle)
SELECT
  p.*,
  b.name AS brand_full_name, b.logo, b.banner_image, b.banner_bg, b.tagline
FROM products p
LEFT JOIN brands b ON b.id = p.brand_id
WHERE p.id = :product_id AND p.is_active = 1;

-- Ürüne ait yorumlar
SELECT id, user_name, rating, comment, helpful_count, verified, created_at
FROM reviews
WHERE product_id = :product_id
ORDER BY created_at DESC;

-- Benzer ürünler (aynı tip, en çok incelenenler)
SELECT id, name, brand, price, original_price, image_url, badge, rating
FROM products
WHERE is_active = 1 AND id != :product_id AND product_type = :type
ORDER BY review_count DESC
LIMIT 4;

-- Popüler ürünler (anasayfa)
SELECT id, name, brand, price, original_price, rating, review_count,
       image_url, color, usage_period, badge, stock, product_type
FROM products
WHERE is_active = 1
ORDER BY review_count DESC
LIMIT 8;


-- ════════════════════════════════════════════════════════════
-- FAVORİLER
-- ════════════════════════════════════════════════════════════

-- Kullanıcının favori ürün id'leri
SELECT product_id FROM favorites WHERE user_id = :user_id;

-- Favori ekle (zaten varsa yoksay)
INSERT IGNORE INTO favorites (user_id, product_id) VALUES (:user_id, :product_id);

-- Favoriden çıkar
DELETE FROM favorites WHERE user_id = :user_id AND product_id = :product_id;

-- Kullanıcının favorilerini ürün bilgileriyle getir
SELECT p.id, p.name, p.brand, p.price, p.original_price, p.image_url, p.rating, p.badge
FROM favorites f
JOIN products p ON p.id = f.product_id
WHERE f.user_id = :user_id AND p.is_active = 1
ORDER BY f.created_at DESC;


-- ════════════════════════════════════════════════════════════
-- ADRESLER
-- ════════════════════════════════════════════════════════════

-- Kullanıcının adresleri (varsayılan önce)
SELECT * FROM addresses WHERE user_id = :user_id ORDER BY is_default DESC, created_at DESC;

-- Yeni adres ekle (tetikleyici diğerlerini otomatik sıfırlar)
INSERT INTO addresses (user_id, title, full_name, phone, city, district, neighborhood, postal_code, full_address, is_default)
VALUES (:user_id, 'Ev', 'Ad Soyad', '05xx', 'İstanbul', 'Kadıköy', NULL, '34710', 'Tam adres', 1);

-- Varsayılan değiştir
UPDATE addresses SET is_default = 0 WHERE user_id = :user_id;
UPDATE addresses SET is_default = 1 WHERE id = :addr_id AND user_id = :user_id;

-- Adres sil
DELETE FROM addresses WHERE id = :addr_id AND user_id = :user_id;


-- ════════════════════════════════════════════════════════════
-- SİPARİŞLER
-- ════════════════════════════════════════════════════════════

-- Sipariş oluştur
INSERT INTO orders (
  order_no, user_id,
  customer_name, customer_email, customer_phone,
  subtotal, shipping_cost, total_amount,
  ship_full_name, ship_phone, ship_city, ship_district, ship_postal_code, ship_full_address,
  pay_method, installments, card_last4, customer_note
) VALUES (
  'HL-2026-10001', :user_id,
  'Ad Soyad', 'email@ornek.com', '05xx',
  489.90, 0.00, 489.90,
  'Ad Soyad', '05xx', 'İstanbul', 'Kadıköy', '34710', 'Tam adres',
  'credit_card', NULL, NULL, NULL
);

-- Sipariş kalemi ekle
INSERT INTO order_items (order_id, product_id, product_name, product_brand, unit_price, quantity, subtotal)
VALUES (LAST_INSERT_ID(), 1, 'Acuvue Oasys 1-Day', 'Acuvue', 489.90, 1, 489.90);

-- Kullanıcının sipariş geçmişi
SELECT o.id, o.order_no, o.status, o.total_amount, o.created_at, o.tracking_code, o.carrier, o.estimated_delivery
FROM orders o
WHERE o.user_id = :user_id
ORDER BY o.created_at DESC;

-- Sipariş kalemleri
SELECT product_name, product_brand, unit_price, quantity, subtotal
FROM order_items
WHERE order_id = :order_id;

-- Admin: sipariş durumu güncelle
UPDATE orders
SET status = 'kargoda', tracking_code = '7318529461',
    carrier = 'Yurtiçi Kargo', shipped_at = NOW(),
    estimated_delivery = DATE_ADD(CURDATE(), INTERVAL 2 DAY)
WHERE id = :order_id;


-- ════════════════════════════════════════════════════════════
-- SEPET
-- ════════════════════════════════════════════════════════════

-- Sepet oluştur veya bul
INSERT IGNORE INTO carts (user_id) VALUES (:user_id);
SELECT id FROM carts WHERE user_id = :user_id;

-- Sepete ürün ekle (varsa miktarı artır)
INSERT INTO cart_items (cart_id, product_id, quantity)
VALUES (:cart_id, :product_id, 1)
ON DUPLICATE KEY UPDATE quantity = quantity + 1;

-- Sepet içeriğini ürün bilgileriyle getir
SELECT ci.product_id, ci.quantity,
       p.name, p.brand, p.price, p.image_url, p.stock
FROM cart_items ci
JOIN products p ON p.id = ci.product_id
WHERE ci.cart_id = :cart_id AND p.is_active = 1;

-- Miktarı güncelle
UPDATE cart_items SET quantity = :qty WHERE cart_id = :cart_id AND product_id = :product_id;

-- Sepetten ürün çıkar
DELETE FROM cart_items WHERE cart_id = :cart_id AND product_id = :product_id;

-- Sepeti tamamen boşalt
DELETE FROM cart_items WHERE cart_id = :cart_id;


-- ════════════════════════════════════════════════════════════
-- KAMPANYALAR
-- ════════════════════════════════════════════════════════════

-- Aktif ve geçerli kampanyaları getir
SELECT * FROM campaigns
WHERE is_active = 1
  AND (valid_from IS NULL OR valid_from <= NOW())
  AND (valid_until IS NULL OR valid_until >= NOW())
ORDER BY display_order ASC;


-- ════════════════════════════════════════════════════════════
-- MARKALAR
-- ════════════════════════════════════════════════════════════

-- Aktif markalar (filtre için)
SELECT id, name FROM brands WHERE is_active = 1 ORDER BY name;


-- ════════════════════════════════════════════════════════════
-- ADMIN — DASHBOARD
-- ════════════════════════════════════════════════════════════

-- Özet istatistikler
SELECT
  (SELECT COUNT(*) FROM users WHERE is_anonymous = 0)                   AS total_users,
  (SELECT COUNT(*) FROM orders WHERE status NOT IN ('teslim','iptal'))  AS active_orders,
  (SELECT COUNT(*) FROM support_tickets WHERE status = 'acik')          AS open_tickets,
  (SELECT COALESCE(SUM(total_amount),0)
   FROM orders WHERE MONTH(created_at) = MONTH(NOW()) AND status != 'iptal') AS monthly_revenue;

-- Günlük sipariş sayısı ve cirosu
SELECT COUNT(*) AS order_count, COALESCE(SUM(total_amount), 0) AS revenue
FROM orders
WHERE DATE(created_at) = CURDATE() AND status != 'iptal';

-- Haftalık ciro (son 7 gün)
SELECT DATE(created_at) AS gun, SUM(total_amount) AS gunluk_ciro
FROM orders
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND status != 'iptal'
GROUP BY DATE(created_at)
ORDER BY gun;

-- En çok satan ürünler (bu ay)
SELECT oi.product_name, SUM(oi.quantity) AS toplam_adet, SUM(oi.subtotal) AS ciro
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE o.created_at >= DATE_FORMAT(NOW(), '%Y-%m-01') AND o.status != 'iptal'
GROUP BY oi.product_name
ORDER BY toplam_adet DESC
LIMIT 10;

-- Düşük stok uyarısı (10 altı)
SELECT id, name, brand, stock FROM products
WHERE is_active = 1 AND stock < 10
ORDER BY stock ASC;

-- Bekleyen reçeteler
SELECT o.order_no, o.customer_name, pf.file_name, pf.uploaded_at
FROM orders o
JOIN prescription_files pf ON pf.order_id = o.id
WHERE o.prescription_status = 'yuklendi'
ORDER BY pf.uploaded_at;

-- Tüm siparişler (sayfalı)
SELECT o.*, COUNT(oi.id) AS kalem_sayisi
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
GROUP BY o.id
ORDER BY o.created_at DESC
LIMIT 20 OFFSET 0;
