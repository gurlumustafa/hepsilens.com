-- ============================================================
-- HepsiLens — Sık Kullanılan SQL Sorguları
-- ============================================================


-- ════════════════════════════════════════════════════════════
-- AUTH
-- ════════════════════════════════════════════════════════════

-- Kayıt: yeni kullanıcı oluştur
INSERT INTO users (name, email, password_hash)
VALUES ('Mustafa Gürlü', 'mustafa@ornek.com', '$2b$12$...');

-- Giriş: e-posta ile kullanıcı bul (password_hash'i JS tarafında bcrypt ile karşılaştır)
SELECT id, name, email, password_hash, email_verified, is_anonymous
FROM users
WHERE email = 'mustafa@ornek.com'
LIMIT 1;

-- Session oluştur (başarılı girişten sonra)
INSERT INTO sessions (session_token, user_id, ip_address, user_agent, expires_at)
VALUES (
  SHA2(CONCAT(UUID(), RAND()), 256),       -- sunucu tarafında üret, burada örnek
  1,
  '85.105.1.1',
  'Mozilla/5.0...',
  DATE_ADD(NOW(), INTERVAL 30 DAY)         -- 30 günlük oturum
);

-- Session doğrula (her istek başında cookie'deki token ile)
SELECT s.user_id, s.expires_at,
       u.name, u.email, u.is_anonymous, u.notif_email, u.notif_sms
FROM sessions s
JOIN users u ON u.id = s.user_id
WHERE s.session_token = :token
  AND s.expires_at > NOW();

-- Session aktivitesini güncelle
UPDATE sessions
SET last_activity = NOW()
WHERE session_token = :token;

-- Çıkış yap: session sil
DELETE FROM sessions WHERE session_token = :token;

-- Şifre sıfırlama token'ı oluştur
INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
VALUES (
  :user_id,
  SHA2(:plain_token, 256),               -- plain_token e-posta ile gönderilir
  DATE_ADD(NOW(), INTERVAL 1 HOUR)       -- 1 saatte geçersiz
);

-- Şifre sıfırlama token'ını doğrula
SELECT id, user_id
FROM password_reset_tokens
WHERE token_hash = SHA2(:plain_token, 256)
  AND expires_at > NOW()
  AND used_at IS NULL;

-- Şifreyi güncelle & token'ı kullanıldı olarak işaretle
UPDATE users SET password_hash = :new_hash WHERE id = :user_id;
UPDATE password_reset_tokens SET used_at = NOW() WHERE id = :token_id;

-- Eski süresi dolmuş session'ları temizle (cron job ile çalıştır)
DELETE FROM sessions WHERE expires_at < NOW();
DELETE FROM password_reset_tokens WHERE expires_at < NOW();


-- ════════════════════════════════════════════════════════════
-- ÜRÜNLER
-- ════════════════════════════════════════════════════════════

-- Tüm aktif lensler
SELECT id, name, brand, price, original_price, rating, review_count,
       image_url, color, color_name, usage_period, badge, stock
FROM products
WHERE is_active = 1 AND product_type = 'lens'
ORDER BY review_count DESC;

-- Renkli lensler
SELECT * FROM products
WHERE is_active = 1 AND product_type = 'lens' AND color = 'colored';

-- Günlük lensler
SELECT * FROM products
WHERE is_active = 1 AND product_type = 'lens' AND usage_period = 'daily';

-- Haftalık lensler
SELECT * FROM products
WHERE is_active = 1 AND product_type = 'lens' AND usage_period = 'biweekly';

-- Aylık lensler
SELECT * FROM products
WHERE is_active = 1 AND product_type = 'lens' AND usage_period = 'monthly';

-- Markaya göre filtrele
SELECT * FROM products
WHERE is_active = 1 AND brand_id = 'freshlook';

-- Tam metin arama
SELECT *, MATCH(name, description) AGAINST (:q IN BOOLEAN MODE) AS score
FROM products
WHERE is_active = 1
  AND MATCH(name, description) AGAINST (:q IN BOOLEAN MODE)
ORDER BY score DESC;

-- Ürün detayı (yorumlarla birlikte)
SELECT p.*,
       r.id AS review_id, r.user_name, r.rating AS review_rating,
       r.comment, r.verified, r.created_at AS review_date
FROM products p
LEFT JOIN reviews r ON r.product_id = p.id
WHERE p.id = :product_id AND p.is_active = 1;

-- Admin: stok güncelle
UPDATE products SET stock = :new_stock, updated_at = NOW() WHERE id = :id;

-- Admin: ürün ekle
INSERT INTO products (
  product_type, name, brand, brand_id, price, original_price,
  color, usage_period, requires_prescription, stock,
  dia, bc, sph_range, pack_sizes, material, water_content,
  oxygen_permeability, uv_protection, tags, description, badge, image_url
) VALUES (
  'lens', 'FreshLook Colorblends - Mavi', 'FreshLook', 'freshlook',
  189.00, 229.00, 'colored', 'monthly', 0, 180,
  14.5, 8.6, '-8.00 / +6.00', '[2, 6]', 'Phemfilcon A', 55,
  19.0, 0, '["aylık","renkli","mavi"]',
  'Doğal görünümlü mavi göz rengi.', 'Trend',
  '/lenses/freshlook-blue.jpg'
);


-- ════════════════════════════════════════════════════════════
-- FAVORİLER
-- ════════════════════════════════════════════════════════════

-- Kullanıcının favorilerini getir (ürün bilgileriyle)
SELECT p.id, p.name, p.brand, p.price, p.original_price,
       p.image_url, p.rating, p.badge
FROM favorites f
JOIN products p ON p.id = f.product_id
WHERE f.user_id = :user_id AND p.is_active = 1
ORDER BY f.created_at DESC;

-- Favori ekle (zaten varsa yoksay)
INSERT IGNORE INTO favorites (user_id, product_id) VALUES (:user_id, :product_id);

-- Favoriden çıkar
DELETE FROM favorites WHERE user_id = :user_id AND product_id = :product_id;

-- Ürün favori mi? (kalp butonu için)
SELECT COUNT(*) AS is_favorited
FROM favorites
WHERE user_id = :user_id AND product_id = :product_id;


-- ════════════════════════════════════════════════════════════
-- ADRESLER
-- ════════════════════════════════════════════════════════════

-- Kullanıcının adreslerini getir
SELECT * FROM addresses WHERE user_id = :user_id ORDER BY is_default DESC, created_at DESC;

-- Yeni adres ekle
INSERT INTO addresses (user_id, title, full_name, phone, city, district, postal_code, full_address, is_default)
VALUES (:user_id, 'Ev', 'Mustafa Gürlü', '05xx', 'İstanbul', 'Kadıköy', '34710', 'Moda Cad. No:5', 1);
-- Not: is_default=1 verilirse trigger otomatik diğerlerini sıfırlar

-- Varsayılan adresi değiştir
UPDATE addresses SET is_default = 0 WHERE user_id = :user_id;
UPDATE addresses SET is_default = 1 WHERE id = :addr_id AND user_id = :user_id;

-- Adres sil
DELETE FROM addresses WHERE id = :addr_id AND user_id = :user_id;


-- ════════════════════════════════════════════════════════════
-- SİPARİŞLER
-- ════════════════════════════════════════════════════════════

-- Sipariş no üret (uygulama tarafında da yapılabilir)
-- Örnek format: HL-2026-XXXX
SELECT CONCAT('HL-', YEAR(NOW()), '-', LPAD(AUTO_INCREMENT, 4, '0')) AS next_order_no
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'hepsilens' AND TABLE_NAME = 'orders';

-- Sipariş oluştur
INSERT INTO orders (
  order_no, user_id, customer_name, customer_email, customer_phone,
  subtotal, shipping_cost, total_amount,
  ship_full_name, ship_phone, ship_city, ship_district,
  ship_postal_code, ship_full_address,
  pay_method, installments, card_last4,
  requires_prescription, customer_note
) VALUES (
  'HL-2026-0092', 1, 'Mustafa Gürlü', 'mustafa@ornek.com', '05xx',
  189.00, 39.00, 228.00,
  'Mustafa Gürlü', '05xx', 'İstanbul', 'Kadıköy',
  '34710', 'Moda Cad. No:5',
  'credit_card', 1, '4521',
  0, NULL
);

-- Sipariş kalemi ekle (her ürün için ayrı INSERT)
INSERT INTO order_items (order_id, product_id, product_name, product_brand, unit_price, quantity, subtotal)
VALUES (LAST_INSERT_ID(), 8, 'FreshLook Colorblends - Mavi', 'FreshLook', 189.00, 1, 189.00);

-- Kullanıcının sipariş geçmişi
SELECT o.id, o.order_no, o.status, o.total_amount, o.created_at,
       GROUP_CONCAT(oi.product_name ORDER BY oi.id SEPARATOR ', ') AS products
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE o.user_id = :user_id
GROUP BY o.id
ORDER BY o.created_at DESC;

-- Admin: sipariş durumu güncelle
UPDATE orders SET status = 'kargoda', tracking_code = '7318529461',
  carrier = 'Yurtiçi Kargo', shipped_at = NOW(),
  estimated_delivery = DATE_ADD(CURDATE(), INTERVAL 2 DAY)
WHERE id = :order_id;

-- Admin: tüm siparişler (filtreli)
SELECT o.*, COUNT(oi.id) AS item_count
FROM orders o
JOIN order_items oi ON oi.order_id = o.id
WHERE o.status = 'yeni'      -- isteğe bağlı filtre
GROUP BY o.id
ORDER BY o.created_at DESC
LIMIT 20 OFFSET 0;           -- sayfalama


-- ════════════════════════════════════════════════════════════
-- SEPET
-- ════════════════════════════════════════════════════════════

-- Sepeti getir veya oluştur (kayıtlı kullanıcı)
INSERT IGNORE INTO carts (user_id) VALUES (:user_id);
SELECT id FROM carts WHERE user_id = :user_id;

-- Sepete ürün ekle (varsa miktarı artır)
INSERT INTO cart_items (cart_id, product_id, quantity)
VALUES (:cart_id, :product_id, 1)
ON DUPLICATE KEY UPDATE quantity = quantity + 1;

-- Sepet içeriğini getir (ürün bilgileriyle)
SELECT ci.product_id, ci.quantity,
       p.name, p.brand, p.price, p.image_url, p.stock
FROM cart_items ci
JOIN products p ON p.id = ci.product_id
WHERE ci.cart_id = :cart_id AND p.is_active = 1;

-- Miktarı güncelle
UPDATE cart_items SET quantity = :qty WHERE cart_id = :cart_id AND product_id = :product_id;

-- Sepetten ürün çıkar
DELETE FROM cart_items WHERE cart_id = :cart_id AND product_id = :product_id;

-- Sepeti boşalt (sipariş tamamlandıktan sonra)
DELETE FROM cart_items WHERE cart_id = :cart_id;

-- Misafir sepeti → kayıtlı kullanıcıya aktar (giriş yapınca)
UPDATE cart_items
SET cart_id = :user_cart_id
WHERE cart_id = :guest_cart_id;
DELETE FROM carts WHERE session_id = :session_id;


-- ════════════════════════════════════════════════════════════
-- ADMIN — DASHBOARD İSTATİSTİKLERİ
-- ════════════════════════════════════════════════════════════

-- Bugünkü sipariş sayısı ve cirosu
SELECT COUNT(*) AS order_count, COALESCE(SUM(total_amount), 0) AS revenue
FROM orders
WHERE DATE(created_at) = CURDATE() AND status != 'iptal';

-- Haftalık ciro (son 7 gün)
SELECT DATE(created_at) AS day, SUM(total_amount) AS daily_revenue
FROM orders
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND status != 'iptal'
GROUP BY DATE(created_at)
ORDER BY day;

-- En çok satan ürünler (bu ay)
SELECT oi.product_name, SUM(oi.quantity) AS total_sold, SUM(oi.subtotal) AS revenue
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE o.created_at >= DATE_FORMAT(NOW(), '%Y-%m-01') AND o.status != 'iptal'
GROUP BY oi.product_name
ORDER BY total_sold DESC
LIMIT 10;

-- Düşük stok uyarısı
SELECT id, name, brand, stock FROM products
WHERE is_active = 1 AND stock < 10
ORDER BY stock ASC;

-- Bekleyen reçeteler
SELECT o.order_no, o.customer_name, pf.file_name, pf.uploaded_at
FROM orders o
JOIN prescription_files pf ON pf.order_id = o.id
WHERE o.prescription_status = 'yuklendi'
ORDER BY pf.uploaded_at;

-- Toplam kullanıcı / aktif sipariş / açık talep sayıları (özet kart)
SELECT
  (SELECT COUNT(*) FROM users WHERE is_anonymous = 0)                    AS total_users,
  (SELECT COUNT(*) FROM orders WHERE status NOT IN ('teslim','iptal'))   AS active_orders,
  (SELECT COUNT(*) FROM support_tickets WHERE status = 'acik')           AS open_tickets,
  (SELECT COALESCE(SUM(total_amount),0) FROM orders
   WHERE MONTH(created_at) = MONTH(NOW()) AND status != 'iptal')        AS monthly_revenue;
