// ──────────────────────────────────────────────────────────────
// HepsiLens — Tip tanımlamaları
// Mock veriler kaldırıldı; tüm veri artık MySQL DB'den geliyor.
// API: /api/products, /api/brands, /api/campaigns
// ──────────────────────────────────────────────────────────────

export type Lens = {
  id: number;
  product_type: "lens";
  name: string;
  brand: string;
  brand_id: string;
  price: number;
  original_price?: number;
  rating: number;
  review_count: number;
  image?: string;
  image_url?: string;
  color: "clear" | "colored";
  color_name?: string;
  usage_period: "daily" | "biweekly" | "monthly" | "yearly";
  requires_prescription: boolean;
  stock: number;
  badge?: string;
  description: string;
  dia: number;
  bc: number;
  sph_range: string;
  pack_sizes: number[];
  material: string;
  water_content: number;
  oxygen_permeability: number;
  uv_protection: boolean;
  tags: string[];
  is_toric?: boolean;
  cyl_options?: number[];
  axis_options?: number[];
};

export type Accessory = {
  id: number;
  product_type: "accessory";
  name: string;
  brand: string;
  brand_id: string;
  price: number;
  original_price?: number;
  rating: number;
  review_count: number;
  image_url?: string;
  description: string;
  badge?: string;
  accessory_category: "solution" | "eyedrop";
  stock: number;
};

// Ortak ürün tipi (listede/kartta kullanılır)
export type Product = Lens | Accessory;

export type Brand = {
  id: string;
  name: string;
  logo?: string;
  banner_image?: string;
  banner_bg?: string;
  tagline?: string;
};

export type AccessoryBrand = {
  id: string;
  name: string;
  tagline?: string;
};

export type Review = {
  id: number;
  product_id: number;
  user_name: string;
  rating: number;
  comment?: string;
  helpful_count: number;
  verified: boolean;
  created_at: string;
};

export type Testimonial = {
  id: number;
  user: string;
  location: string;
  rating: number;
  comment: string;
  product: string;
  initials: string;
  color: string;
};

export type Campaign = {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  cta?: string;
  bg?: string;
  accent?: string;
  emoji?: string;
};

// Ürünün lens mi aksesuar mı olduğunu kontrol et
export function isLens(p: Product): p is Lens {
  return p.product_type === "lens";
}
export function isAccessory(p: Product): p is Accessory {
  return p.product_type === "accessory";
}

// Ürün görselini döndür (varsa imageUrl, yoksa image, yoksa undefined)
export function getProductImage(p: Product): string | undefined {
  return (p as Lens).image_url || (p as Lens).image || undefined;
}
