"use client";
import Link from "next/link";
import { Lens } from "@/lib/data";

type Props = {
  lens: Lens;
  variant?: "home" | "grid";
};

export default function ProductCard({ lens, variant = "grid" }: Props) {
  const discount = lens.originalPrice
    ? Math.round(((lens.originalPrice - lens.price) / lens.originalPrice) * 100)
    : 0;

  if (variant === "home") {
    return (
      <Link href={`/urun/${lens.id}`} className="group bg-white rounded-[0.75rem] overflow-hidden shadow-sm border border-[#c3c6d6] hover:shadow-2xl hover:-translate-y-2 hover:border-[#003d9b]/30 transition-all duration-250 flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-[#ffffff] p-4 flex items-center justify-center overflow-hidden">
          {lens.badge && (
            <span
              className="absolute top-3 right-3 text-[#005f71] px-2 py-1 rounded-[0.125rem] whitespace-nowrap z-10"
              style={{ background: "#50dcff", fontSize: "12px", lineHeight: "16px", letterSpacing: "0.05em", fontWeight: 600 }}
            >
              {lens.badge}
            </span>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lens.imageUrl || "/placeholder-lens.jpg"}
            alt={lens.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        {/* Info */}
        <div className="p-4 flex flex-col flex-grow">
          <span className="text-[#434654]" style={{ fontFamily: "'Inter'", fontSize: "12px", lineHeight: "16px", letterSpacing: "0.05em", fontWeight: 600 }}>
            {lens.brand}
          </span>
          <h3 className="text-[#191c1e] mt-1 mb-2" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", lineHeight: "28px", fontWeight: 600 }}>
            {lens.name}
          </h3>
          {/* Stars */}
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={s <= Math.round(lens.rating) ? "text-[#6a3600]" : "text-[#c3c6d6]"}
                style={{ fontSize: "16px", fontVariationSettings: s <= Math.round(lens.rating) ? "'FILL' 1" : "'FILL' 0" }}
              >
                ★
              </span>
            ))}
            <span className="text-[#434654] ml-2" style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600 }}>
              ({lens.reviewCount})
            </span>
          </div>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-[#003d9b]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", lineHeight: "28px", fontWeight: 600 }}>
              {lens.price.toLocaleString("tr-TR")} ₺
            </span>
            <button
              className="bg-[#ff9900] text-white p-3 rounded-full hover:bg-[#e68a00] hover:scale-110 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
              onClick={(e) => e.preventDefault()}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>add_shopping_cart</span>
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // Grid variant (category page)
  return (
    <Link
      href={`/urun/${lens.id}`}
      className="group bg-[#ffffff] rounded-[0.75rem] p-4 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-250 border border-transparent hover:border-[#003d9b]/25 flex flex-col"
    >
      {/* Image */}
      <div className="relative mb-4 aspect-square bg-white rounded-[0.25rem] overflow-hidden flex items-center justify-center p-4 border border-[#edeef0]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={lens.imageUrl || "/placeholder-lens.jpg"}
          alt={lens.name}
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {lens.badge && (
            <span
              className="bg-[#50dcff] text-[#005f71] px-2 py-1 rounded-full uppercase whitespace-nowrap"
              style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em" }}
            >
              {lens.badge}
            </span>
          )}
          {discount > 0 && (
            <span
              className="bg-[#ffdcc3] text-[#2f1500] px-2 py-1 rounded-full whitespace-nowrap"
              style={{ fontSize: "10px", fontWeight: 700 }}
            >
              -%{discount}
            </span>
          )}
        </div>
      </div>
      {/* Info */}
      <div className="space-y-2 flex flex-col flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[#434654] uppercase" style={{ fontSize: "10px", letterSpacing: "0.1em", fontWeight: 600, fontFamily: "'Inter'" }}>
              {lens.brand}
            </p>
            <h3
              className="text-[#191c1e] group-hover:text-[#003d9b] transition-colors"
              style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", lineHeight: "28px", fontWeight: 600 }}
            >
              {lens.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-[#6a3600] shrink-0">
            <span className="material-symbols-outlined" style={{ fontSize: "14px", fontVariationSettings: "'FILL' 1" }}>star</span>
            <span style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, fontFamily: "'Inter'" }}>{lens.rating}</span>
          </div>
        </div>
        <p className="text-[#434654] line-clamp-2 flex-1" style={{ fontSize: "14px", lineHeight: "20px" }}>
          {lens.description}
        </p>
        <div className="pt-4 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {lens.originalPrice && (
              <span className="text-[#737685] line-through" style={{ fontSize: "11px", fontWeight: 600, fontFamily: "'Inter'" }}>
                {lens.originalPrice.toLocaleString("tr-TR")} ₺
              </span>
            )}
            <span className="text-[#003d9b]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "24px", lineHeight: "32px", fontWeight: 600 }}>
              {lens.price.toLocaleString("tr-TR")} ₺
            </span>
          </div>
          <button
            className="bg-[#6a3600] text-white font-bold px-4 py-2 rounded-[0.5rem] hover:bg-[#8c4a00] hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap shadow-sm hover:shadow-md"
            onClick={(e) => e.preventDefault()}
            style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: 600, fontFamily: "'Inter'" }}
          >
            Sepete Ekle
          </button>
        </div>
      </div>
    </Link>
  );
}
