export type DiscountEntry = {
  lensId: number;
  originalPrice: number;   // orijinal fiyat (yüksek)
  salePrice: number;       // indirimli fiyat (düşük)
  badge: string;           // örn. "%20 İndirim"
  percent: number;
};

const KEY = "hl_discounts";

export function getDiscount(lensId: number): DiscountEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const list: DiscountEntry[] = JSON.parse(raw);
    return list.find((d) => d.lensId === lensId) ?? null;
  } catch { return null; }
}

export function getAllDiscounts(): DiscountEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function setDiscount(entry: DiscountEntry) {
  const list = getAllDiscounts().filter((d) => d.lensId !== entry.lensId);
  localStorage.setItem(KEY, JSON.stringify([...list, entry]));
}

export function removeDiscount(lensId: number) {
  const list = getAllDiscounts().filter((d) => d.lensId !== lensId);
  localStorage.setItem(KEY, JSON.stringify(list));
}
