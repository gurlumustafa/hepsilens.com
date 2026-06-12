"use client";
import { useState } from "react";
import Link from "next/link";
import { Lens, Accessory } from "@/lib/data";
import QuickViewModal from "@/components/QuickViewModal";
import { useCart } from "@/contexts/CartContext";
import FavoriteButton from "@/components/FavoriteButton";

type Props = {
  lens: Lens | Accessory;
  variant?: "home" | "grid";
};

export default function ProductCard({ lens, variant = "grid" }: Props) {
  const { addItem } = useCart();
  const [showModal, setShowModal] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: lens.id, name: lens.name, brand: lens.brand, price: lens.price, imageUrl: lens.image_url });
  }
  const discount = lens.original_price
    ? Math.round(((lens.original_price - lens.price) / lens.original_price) * 100)
    : 0;

  const quickViewOverlay = (
    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
      <div className="absolute inset-0 bg-[#0f1223]/10" />
      <button
        className="relative z-10 bg-white text-[var(--ds-primary)] font-bold px-4 py-2 rounded-full shadow-lg border border-[#003d9b]/15 scale-90 group-hover:scale-100 transition-transform duration-200 flex items-center gap-1.5 whitespace-nowrap hover:bg-[var(--ds-primary)] hover:text-white hover:border-[var(--ds-primary)]"
        style={{ fontSize: "12px", letterSpacing: "0.04em", fontFamily: "'Inter'" }}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowModal(true); }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>visibility</span>
        Hızlı Bakış
      </button>
    </div>
  );

  if (variant === "home") {
    return (
      <>
        <Link href={`/urun/${lens.id}`} className="group bg-white rounded-[0.75rem] overflow-hidden shadow-sm border border-[var(--ds-border)] hover:shadow-2xl hover:-translate-y-2 hover:border-[#003d9b]/30 transition-all duration-250 flex flex-col">
          {/* Image */}
          <div className="relative aspect-square bg-[var(--ds-surface)] p-4 flex items-center justify-center overflow-hidden">
            <FavoriteButton productId={lens.id} size="sm" className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            {lens.badge && (
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none z-20">
                <div
                  className="absolute text-center py-1.5 shadow-md font-bold uppercase"
                  style={{
                    background: "#50dcff",
                    color: "#005f71",
                    fontSize: "9.5px",
                    letterSpacing: "0.05em",
                    width: "115px",
                    top: "16px",
                    right: "-28px",
                    transform: "rotate(45deg)",
                  }}
                >
                  {lens.badge}
                </div>
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lens.image_url || "/placeholder-lens.jpg"}
              alt={lens.name}
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
            />
            {quickViewOverlay}
          </div>
          {/* Info */}
          <div className="p-4 flex flex-col flex-grow">
            <span className="text-[var(--ds-text-2)]" style={{ fontFamily: "'Inter'", fontSize: "12px", lineHeight: "16px", letterSpacing: "0.05em", fontWeight: 600 }}>
              {lens.brand}
            </span>
            <h3 className="text-[var(--ds-text-1)] mt-1 mb-2" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", lineHeight: "28px", fontWeight: 600 }}>
              {lens.name}
            </h3>
            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={s <= Math.round(lens.rating) ? "text-[#6a3600]" : "text-[var(--ds-border)]"}
                  style={{ fontSize: "19px", fontVariationSettings: s <= Math.round(lens.rating) ? "'FILL' 1" : "'FILL' 0" }}
                >
                  ★
                </span>
              ))}
              <span className="text-[var(--ds-text-2)] ml-2" style={{ fontSize: "13.5px", letterSpacing: "0.05em", fontWeight: 600 }}>
                ({lens.review_count})
              </span>
            </div>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-[var(--ds-primary)]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", lineHeight: "28px", fontWeight: 600 }}>
                {lens.price.toLocaleString("tr-TR")} ₺
              </span>
              <button
                className="bg-[#d97706] text-white font-bold px-4 py-2 rounded-[0.5rem] hover:bg-[#b45309] hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md"
                onClick={handleAddToCart}
                style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, fontFamily: "'Inter'" }}
              >
                Sepete Ekle
              </button>
            </div>
          </div>
        </Link>
        {showModal && <QuickViewModal product={lens} onClose={() => setShowModal(false)} />}
      </>
    );
  }

  // Grid variant (category page)
  return (
    <>
      <Link
        href={`/urun/${lens.id}`}
        className="group bg-[var(--ds-surface)] rounded-[0.75rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-250 border border-transparent hover:border-[#003d9b]/25 flex flex-row sm:flex-col"
      >
        {/* Image — square on mobile-left, full-width on sm+ */}
        <div className="relative w-[110px] sm:w-auto flex-shrink-0 sm:flex-shrink-1 sm:aspect-square bg-[var(--ds-surface)] flex items-center justify-center p-2 sm:p-4 sm:border-b border-r sm:border-r-0 border-[var(--ds-border-subtle)] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lens.image_url || "/placeholder-lens.jpg"}
            alt={lens.name}
            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          <FavoriteButton productId={lens.id} size="sm" className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          {lens.badge && (
            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none z-20">
              <div
                className="absolute text-center py-1 shadow-sm font-bold uppercase"
                style={{
                  background: "#50dcff",
                  color: "#005f71",
                  fontSize: "8.5px",
                  letterSpacing: "0.05em",
                  width: "95px",
                  top: "13px",
                  right: "-24px",
                  transform: "rotate(45deg)",
                }}
              >
                {lens.badge}
              </div>
            </div>
          )}
          {discount > 0 && (
            <span
              className="absolute bottom-2 left-2 bg-[#ffdcc3] text-[#2f1500] px-1.5 py-0.5 rounded-full whitespace-nowrap z-10"
              style={{ fontSize: "9px", fontWeight: 700 }}
            >
              -%{discount}
            </span>
          )}
          <div className="hidden sm:block">{quickViewOverlay}</div>
        </div>
        {/* Info */}
        <div className="flex flex-col flex-1 p-3 sm:p-4">
          <div className="flex justify-between items-start gap-1">
            <div className="min-w-0">
              <p className="text-[var(--ds-text-2)] uppercase truncate" style={{ fontSize: "10px", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "'Inter'" }}>
                {lens.brand}
              </p>
              <h3
                className="text-[var(--ds-text-1)] group-hover:text-[var(--ds-primary)] transition-colors line-clamp-2"
                style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px", lineHeight: "22px", fontWeight: 600 }}
              >
                {lens.name}
              </h3>
            </div>
            <div className="flex items-center gap-0.5 text-[#6a3600] shrink-0 mt-0.5">
              <span className="material-symbols-outlined" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>star</span>
              <span style={{ fontSize: "12px", fontWeight: 600, fontFamily: "'Inter'" }}>{lens.rating}</span>
            </div>
          </div>
          {lens.description && (
            <p className="text-[var(--ds-text-2)] line-clamp-2 mt-1 hidden sm:block" style={{ fontSize: "13px", lineHeight: "18px" }}>
              {lens.description.length > 100 ? lens.description.slice(0, 100) + "…" : lens.description}
            </p>
          )}
          <div className="flex items-center justify-between mt-auto pt-2 sm:pt-4">
            <div className="flex flex-col">
              {lens.original_price && (
                <span className="text-[var(--ds-text-3)] line-through" style={{ fontSize: "10px", fontWeight: 600, fontFamily: "'Inter'" }}>
                  {lens.original_price.toLocaleString("tr-TR")} ₺
                </span>
              )}
              <span className="text-[var(--ds-primary)]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "18px", lineHeight: "26px", fontWeight: 600 }}>
                {lens.price.toLocaleString("tr-TR")} ₺
              </span>
            </div>
            <button
              className="bg-[#d97706] text-white font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-[0.5rem] hover:bg-[#b45309] hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md"
              onClick={handleAddToCart}
              style={{ fontSize: "11px", letterSpacing: "0.04em", fontWeight: 600, fontFamily: "'Inter'" }}
            >
              Sepete Ekle
            </button>
          </div>
        </div>
      </Link>
      {showModal && <QuickViewModal product={lens} onClose={() => setShowModal(false)} />}
    </>
  );
}
