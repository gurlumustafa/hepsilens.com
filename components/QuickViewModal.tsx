"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Lens, Accessory } from "@/lib/data";
import { useCart } from "@/contexts/CartContext";

type Props = {
  product: Lens | Accessory;
  onClose: () => void;
};

export default function QuickViewModal({ product, onClose }: Props) {
  const { addItem } = useCart();
  const isLens = "color" in product;
  const needsPrescription = isLens && (product as Lens).requiresPrescription;
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15, 18, 35, 0.70)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col sm:flex-row"
        style={{ maxHeight: "min(90vh, 580px)", animation: "quickViewIn 0.22s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sol: Görsel */}
        <div className="relative bg-[#f4f5f9] flex items-center justify-center p-8 sm:w-[42%] shrink-0">
          {product.badge && (
            <span
              className="absolute top-4 left-4 bg-[#50dcff] text-[#005f71] px-3 py-1 rounded-full uppercase"
              style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em" }}
            >
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span
              className="absolute top-4 right-4 bg-[#ffdcc3] text-[#2f1500] px-3 py-1 rounded-full"
              style={{ fontSize: "10px", fontWeight: 700 }}
            >
              -%{discount}
            </span>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl || "/placeholder-lens.jpg"}
            alt={product.name}
            className="object-contain mix-blend-multiply"
            style={{ maxHeight: "240px", width: "100%" }}
          />
        </div>

        {/* Sağ: Detaylar */}
        <div className="flex flex-col flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="flex justify-between items-start mb-3">
            <span
              className="text-[#434654] uppercase"
              style={{ fontSize: "10px", letterSpacing: "0.12em", fontWeight: 700, fontFamily: "'Inter'" }}
            >
              {product.brand}
            </span>
            <button
              onClick={onClose}
              className="text-[#737685] hover:text-[#191c1e] hover:bg-[#edeef3] rounded-full transition-colors flex items-center justify-center shrink-0"
              style={{ width: "32px", height: "32px" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>close</span>
            </button>
          </div>

          <h2
            className="text-[#191c1e] mb-2"
            style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "22px", lineHeight: "30px", fontWeight: 700 }}
          >
            {product.name}
          </h2>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={s <= Math.round(product.rating) ? "text-[#6a3600]" : "text-[#c3c6d6]"}
                  style={{ fontSize: "14px" }}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-[#737685]" style={{ fontSize: "12px", fontWeight: 600, fontFamily: "'Inter'" }}>
              ({product.reviewCount} değerlendirme)
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <span
              className="text-[#003d9b]"
              style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "28px", lineHeight: "36px", fontWeight: 700 }}
            >
              {product.price.toLocaleString("tr-TR")} ₺
            </span>
            {product.originalPrice && (
              <span className="text-[#737685] line-through" style={{ fontSize: "13px", fontWeight: 600, fontFamily: "'Inter'" }}>
                {product.originalPrice.toLocaleString("tr-TR")} ₺
              </span>
            )}
          </div>

          <p className="text-[#434654] leading-relaxed mb-5" style={{ fontSize: "13px", lineHeight: "20px" }}>
            {product.description}
          </p>

          {isLens && (
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { label: "Malzeme", value: (product as Lens).material },
                { label: "Su İçeriği", value: `%${(product as Lens).waterContent}` },
                { label: "O₂ Geçirgenliği", value: `${(product as Lens).oxygenPermeability} Dk` },
                { label: "UV Koruma", value: (product as Lens).uvProtection ? "Var ✓" : "Yok" },
                { label: "Çap (DIA)", value: `${(product as Lens).dia} mm` },
                { label: "Eğrilik (BC)", value: `${(product as Lens).bc} mm` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#f4f5f9] rounded-lg px-3 py-2">
                  <p
                    className="text-[#737685] uppercase mb-0.5"
                    style={{ fontSize: "9px", letterSpacing: "0.08em", fontWeight: 600 }}
                  >
                    {label}
                  </p>
                  <p className="text-[#191c1e] font-bold" style={{ fontSize: "12px", fontFamily: "'Inter'" }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {needsPrescription && (
            <div className="flex items-start gap-2.5 bg-[#fff8e6] border border-[#f5c842]/60 rounded-xl px-4 py-3 mb-3">
              <span className="material-symbols-outlined shrink-0 mt-0.5" style={{ fontSize: "16px", color: "#b45309" }}>warning</span>
              <p style={{ fontSize: "12px", lineHeight: "18px", fontWeight: 500, color: "#92400e" }}>
                Bu ürün <strong>reçete gerektirmektedir.</strong> Satın alabilmek için ürün sayfasından reçetenizi yüklemeniz gerekmektedir.
              </p>
            </div>
          )}

          <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-2">
            {needsPrescription ? (
              <div
                className="flex-1 bg-[#f0f1f5] text-[#9ea3b8] font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed select-none"
                style={{ fontSize: "13px", fontFamily: "'Inter'", letterSpacing: "0.04em" }}
                title="Sepete eklemek için önce reçetenizi yükleyin"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "17px" }}>lock</span>
                Reçete Gerekli
              </div>
            ) : (
              <button
                onClick={() => { addItem({ id: product.id, name: product.name, brand: product.brand, price: product.price, imageUrl: product.imageUrl }); onClose(); }}
                className="flex-1 bg-[#6a3600] text-white font-bold py-3 rounded-xl hover:bg-[#8c4a00] active:scale-95 transition-all flex items-center justify-center gap-2"
                style={{ fontSize: "13px", fontFamily: "'Inter'", letterSpacing: "0.04em" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>add_shopping_cart</span>
                Sepete Ekle
              </button>
            )}
            <Link
              href={`/urun/${product.id}`}
              onClick={onClose}
              className="flex-1 text-center font-bold py-3 rounded-xl transition-all border-2 border-[#003d9b] text-[#003d9b] hover:bg-[#003d9b] hover:text-white"
              style={{ fontSize: "13px", fontFamily: "'Inter'", letterSpacing: "0.04em" }}
            >
              {needsPrescription ? "Reçete Yükle" : "Ürün Detayı"}
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes quickViewIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
