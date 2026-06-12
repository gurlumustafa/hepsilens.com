-- ============================================================
-- HepsiLens — MySQL 8.0+ Veritabanı Şeması  (v2)
-- ============================================================
-- KULLANIM:
--   phpMyAdmin → Import → Bu dosyayı yükle  (metin kutusuna yapıştırma)
--   veya:  mysql -h 127.0.0.1 -u u607457950_hepsilens -p u607457950_hepsilens < schema.sql
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ── Temizlik: tüm tabloları ters bağımlılık sırasıyla sil ──
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS support_tickets;
DROP TABLE IF EXISTS prescription_files;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS email_verifications;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS oauth_states;


-- ============================================================
-- 1. MARKALAR
-- ============================================================

CREATE TABLE brands (
  id           VARCHAR(40)   NOT NULL,
  name         VARCHAR(120)  NOT NULL,
  logo         VARCHAR(20)   NULL,
  banner_image VARCHAR(255)  NULL,
  banner_bg    VARCHAR(120)  NULL,
  tagline      VARCHAR(255)  NULL,
  is_active    TINYINT(1)    NOT NULL DEFAULT 1,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 2. KULLANICILAR
-- ============================================================

CREATE TABLE users (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name           VARCHAR(120)    NOT NULL,
  email          VARCHAR(255)    NULL UNIQUE,
  phone          VARCHAR(20)     NULL,
  password_hash  VARCHAR(255)    NULL,
  email_verified TINYINT(1)      NOT NULL DEFAULT 0,
  is_anonymous   TINYINT(1)      NOT NULL DEFAULT 0,
  notif_email    TINYINT(1)      NOT NULL DEFAULT 1,
  notif_sms      TINYINT(1)      NOT NULL DEFAULT 1,
  member_since   DATE            NOT NULL DEFAULT (CURDATE()),
  created_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 3. OTURUMLAR
-- ============================================================

CREATE TABLE sessions (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  session_token VARCHAR(128)    NOT NULL UNIQUE,
  user_id       BIGINT UNSIGNED NOT NULL,
  ip_address    VARCHAR(45)     NULL,
  user_agent    VARCHAR(512)    NULL,
  expires_at    DATETIME        NOT NULL,
  last_activity DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_sessions_user    (user_id),
  INDEX idx_sessions_expires (expires_at),
  CONSTRAINT fk_sessions_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 4. ŞİFRE SIFIRLAMA
-- ============================================================

CREATE TABLE password_reset_tokens (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NOT NULL,
  token_hash VARCHAR(64)     NOT NULL UNIQUE,
  expires_at DATETIME        NOT NULL,
  used_at    DATETIME        NULL,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_prt_user    (user_id),
  INDEX idx_prt_expires (expires_at),
  CONSTRAINT fk_prt_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 5. E-POSTA DOĞRULAMA
-- ============================================================

CREATE TABLE email_verifications (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  email       VARCHAR(255)    NOT NULL,
  token_hash  VARCHAR(64)     NOT NULL UNIQUE,
  expires_at  DATETIME        NOT NULL,
  verified_at DATETIME        NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_ev_user (user_id),
  CONSTRAINT fk_ev_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 6. ÜRÜNLER
-- ============================================================

CREATE TABLE products (
  id                    BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  product_type          ENUM('lens','accessory') NOT NULL DEFAULT 'lens',

  -- Ortak alanlar
  name                  VARCHAR(255)     NOT NULL,
  brand                 VARCHAR(120)     NOT NULL,
  brand_id              VARCHAR(40)      NULL,
  price                 DECIMAL(10,2)    NOT NULL,
  original_price        DECIMAL(10,2)    NULL,
  rating                DECIMAL(3,2)     NOT NULL DEFAULT 0.00,
  review_count          INT UNSIGNED     NOT NULL DEFAULT 0,
  image                 VARCHAR(255)     NULL,
  image_url             TEXT             NULL,
  description           TEXT             NULL,
  badge                 VARCHAR(60)      NULL,
  stock                 INT UNSIGNED     NOT NULL DEFAULT 0,
  is_active             TINYINT(1)       NOT NULL DEFAULT 1,
  created_at            DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Lens alanları
  color                 ENUM('clear','colored') NULL,
  color_name            VARCHAR(60)      NULL,
  usage_period          ENUM('daily','biweekly','monthly','yearly') NULL,
  requires_prescription TINYINT(1)       NOT NULL DEFAULT 0,
  dia                   DECIMAL(4,1)     NULL,
  bc                    DECIMAL(4,2)     NULL,
  sph_range             VARCHAR(40)      NULL,
  pack_sizes            JSON             NULL,
  material              VARCHAR(120)     NULL,
  water_content         TINYINT UNSIGNED NULL,
  oxygen_permeability   DECIMAL(5,1)     NULL,
  uv_protection         TINYINT(1)       NOT NULL DEFAULT 0,
  tags                  JSON             NULL,
  is_toric              TINYINT(1)       NOT NULL DEFAULT 0,
  cyl_options           JSON             NULL,
  axis_options          JSON             NULL,

  -- Aksesuar alanları
  accessory_category    ENUM('solution','eyedrop') NULL,

  PRIMARY KEY (id),
  INDEX idx_products_brand_id  (brand_id),
  INDEX idx_products_type      (product_type),
  INDEX idx_products_color     (color),
  INDEX idx_products_usage     (usage_period),
  INDEX idx_products_is_active (is_active),
  FULLTEXT idx_products_search (name, description),
  CONSTRAINT fk_products_brand
    FOREIGN KEY (brand_id) REFERENCES brands (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 7. YORUMLAR + TETİKLEYİCİLER
-- ============================================================

CREATE TABLE reviews (
  id            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  product_id    BIGINT UNSIGNED  NOT NULL,
  user_id       BIGINT UNSIGNED  NULL,
  user_name     VARCHAR(120)     NOT NULL,
  rating        TINYINT UNSIGNED NOT NULL,
  comment       TEXT             NULL,
  helpful_count INT UNSIGNED     NOT NULL DEFAULT 0,
  verified      TINYINT(1)       NOT NULL DEFAULT 0,
  created_at    DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_reviews_product (product_id),
  INDEX idx_reviews_user    (user_id),
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT fk_reviews_product
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rating otomatik güncelleme tetikleyicileri
DELIMITER $$

CREATE TRIGGER trg_reviews_after_insert
AFTER INSERT ON reviews FOR EACH ROW
BEGIN
  UPDATE products
  SET
    rating       = (SELECT ROUND(AVG(rating), 2) FROM reviews WHERE product_id = NEW.product_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
END$$

CREATE TRIGGER trg_reviews_after_update
AFTER UPDATE ON reviews FOR EACH ROW
BEGIN
  UPDATE products
  SET
    rating       = (SELECT ROUND(AVG(rating), 2) FROM reviews WHERE product_id = NEW.product_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
END$$

CREATE TRIGGER trg_reviews_after_delete
AFTER DELETE ON reviews FOR EACH ROW
BEGIN
  UPDATE products
  SET
    rating       = COALESCE((SELECT ROUND(AVG(rating), 2) FROM reviews WHERE product_id = OLD.product_id), 0.00),
    review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = OLD.product_id)
  WHERE id = OLD.product_id;
END$$

DELIMITER ;


-- ============================================================
-- 8. FAVORİLER
-- ============================================================

CREATE TABLE favorites (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_favorites         (user_id, product_id),
  INDEX      idx_favorites_product (product_id),
  CONSTRAINT fk_favorites_user
    FOREIGN KEY (user_id)    REFERENCES users    (id) ON DELETE CASCADE,
  CONSTRAINT fk_favorites_product
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 9. ADRESLER + TETİKLEYİCİLER
-- ============================================================

CREATE TABLE addresses (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id      BIGINT UNSIGNED NOT NULL,
  title        VARCHAR(80)     NOT NULL,
  full_name    VARCHAR(120)    NOT NULL,
  phone        VARCHAR(20)     NULL,
  city         VARCHAR(80)     NOT NULL,
  district     VARCHAR(80)     NOT NULL,
  neighborhood VARCHAR(120)    NULL,
  postal_code  VARCHAR(10)     NULL,
  full_address TEXT            NOT NULL,
  is_default   TINYINT(1)      NOT NULL DEFAULT 0,
  created_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_addresses_user (user_id),
  CONSTRAINT fk_addresses_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- ============================================================
-- 10. SİPARİŞLER
-- ============================================================

CREATE TABLE orders (
  id                    BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  order_no              VARCHAR(20)      NOT NULL UNIQUE,
  user_id               BIGINT UNSIGNED  NULL,

  customer_name         VARCHAR(120)     NOT NULL,
  customer_email        VARCHAR(255)     NULL,
  customer_phone        VARCHAR(20)      NULL,

  status                ENUM('yeni','isleniyor','kargoda','teslim','iptal')
                                         NOT NULL DEFAULT 'yeni',

  subtotal              DECIMAL(10,2)    NOT NULL,
  shipping_cost         DECIMAL(10,2)    NOT NULL DEFAULT 0.00,
  total_amount          DECIMAL(10,2)    NOT NULL,

  ship_full_name        VARCHAR(120)     NULL,
  ship_phone            VARCHAR(20)      NULL,
  ship_city             VARCHAR(80)      NULL,
  ship_district         VARCHAR(80)      NULL,
  ship_neighborhood     VARCHAR(120)     NULL,
  ship_postal_code      VARCHAR(10)      NULL,
  ship_full_address     TEXT             NULL,

  requires_prescription TINYINT(1)       NOT NULL DEFAULT 0,
  prescription_status   ENUM('bekleniyor','yuklendi','onaylandi','reddedildi') NULL,

  tracking_code         VARCHAR(60)      NULL,
  carrier               VARCHAR(80)      NULL,
  estimated_delivery    DATE             NULL,
  shipped_at            DATETIME         NULL,

  pay_method            ENUM('credit_card','cod','transfer') NOT NULL DEFAULT 'credit_card',
  installments          TINYINT UNSIGNED NULL,
  card_last4            CHAR(4)          NULL,

  customer_note         TEXT             NULL,
  admin_note            TEXT             NULL,

  created_at            DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_orders_user       (user_id),
  INDEX idx_orders_status     (status),
  INDEX idx_orders_created_at (created_at),
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 11. SİPARİŞ KALEMLERİ
-- ============================================================

CREATE TABLE order_items (
  id            BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  order_id      BIGINT UNSIGNED   NOT NULL,
  product_id    BIGINT UNSIGNED   NULL,
  product_name  VARCHAR(255)      NOT NULL,
  product_brand VARCHAR(120)      NULL,
  unit_price    DECIMAL(10,2)     NOT NULL,
  quantity      SMALLINT UNSIGNED NOT NULL,
  subtotal      DECIMAL(10,2)     NOT NULL,

  PRIMARY KEY (id),
  INDEX idx_order_items_order   (order_id),
  INDEX idx_order_items_product (product_id),
  CONSTRAINT chk_order_items_qty CHECK (quantity > 0),
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id)   REFERENCES orders   (id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 12. REÇETE DOSYALARI
-- ============================================================

CREATE TABLE prescription_files (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_id    BIGINT UNSIGNED NULL,
  user_id     BIGINT UNSIGNED NULL,
  file_name   VARCHAR(255)    NOT NULL,
  file_size   VARCHAR(20)     NULL,
  file_url    TEXT            NOT NULL,
  file_type   ENUM('pdf','image') NOT NULL,
  uploaded_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_prescriptions_order (order_id),
  INDEX idx_prescriptions_user  (user_id),
  CONSTRAINT fk_prescriptions_order
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE SET NULL,
  CONSTRAINT fk_prescriptions_user
    FOREIGN KEY (user_id)  REFERENCES users  (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 13. DESTEK TALEPLERİ
-- ============================================================

CREATE TABLE support_tickets (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  ticket_no   VARCHAR(15)     NOT NULL UNIQUE,
  user_id     BIGINT UNSIGNED NULL,
  name        VARCHAR(120)    NOT NULL,
  email       VARCHAR(255)    NULL,
  phone       VARCHAR(20)     NULL,
  subject     VARCHAR(255)    NOT NULL,
  message     TEXT            NOT NULL,
  status      ENUM('acik','yanitlandi','kapali') NOT NULL DEFAULT 'acik',
  priority    ENUM('dusuk','normal','yuksek','kritik') NOT NULL DEFAULT 'normal',
  category    VARCHAR(60)     NULL,
  admin_reply TEXT            NULL,
  created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_tickets_user     (user_id),
  INDEX idx_tickets_status   (status),
  INDEX idx_tickets_priority (priority),
  CONSTRAINT fk_tickets_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 14. SEPET
-- ============================================================

CREATE TABLE carts (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NULL UNIQUE,
  session_id VARCHAR(64)     NULL,
  created_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_carts_session (session_id),
  CONSTRAINT chk_carts_owner CHECK (user_id IS NOT NULL OR session_id IS NOT NULL),
  CONSTRAINT fk_carts_user
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cart_items (
  id         BIGINT UNSIGNED   NOT NULL AUTO_INCREMENT,
  cart_id    BIGINT UNSIGNED   NOT NULL,
  product_id BIGINT UNSIGNED   NOT NULL,
  quantity   SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  added_at   DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_cart_item         (cart_id, product_id),
  INDEX      idx_cart_items_product (product_id),
  CONSTRAINT chk_cart_items_qty CHECK (quantity > 0),
  CONSTRAINT fk_cart_items_cart
    FOREIGN KEY (cart_id)    REFERENCES carts    (id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_items_product
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 15. KAMPANYALAR / BANNERLAR
-- ============================================================

CREATE TABLE campaigns (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title         VARCHAR(120) NOT NULL,
  subtitle      VARCHAR(255) NULL,
  description   TEXT         NULL,
  cta           VARCHAR(60)  NULL,
  bg            VARCHAR(120) NULL,
  accent        VARCHAR(120) NULL,
  emoji         VARCHAR(10)  NULL,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  display_order TINYINT      NOT NULL DEFAULT 0,
  valid_from    DATETIME     NULL,
  valid_until   DATETIME     NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 16. OAUTH STATE (sunucu yeniden başlasa da state kaybolmaz)
-- ============================================================

CREATE TABLE oauth_states (
  state      VARCHAR(64)  NOT NULL,
  expires_at DATETIME     NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (state),
  INDEX idx_oauth_states_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
SET FOREIGN_KEY_CHECKS = 1;
-- ============================================================
