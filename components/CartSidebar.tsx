"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function CartSidebar() {
  const { items, count, total, sidebarOpen, closeSidebar, removeItem, updateQty, clearCart } = useCart();
  const [checkoutHover, setCheckoutHover] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // ESC ile kapat + scroll kilidi
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeSidebar(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [sidebarOpen, closeSidebar]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={closeSidebar}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(15,18,35,0.55)",
          backdropFilter: "blur(2px)",
          opacity: sidebarOpen ? 1 : 0,
          pointerEvents: sidebarOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Sidebar panel */}
      <div
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 9999,
          width: "min(420px, 100vw)",
          background: "#ffffff",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
          transform: sidebarOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#edeef3]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#191c1e]" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "18px", fontWeight: 700, color: "#191c1e" }}>
              Sepetim
            </h2>
            {count > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#6a3600] text-white flex items-center justify-center font-bold" style={{ fontSize: "11px" }}>
                {count}
              </span>
            )}
          </div>
          <button
            onClick={closeSidebar}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#737685] hover:bg-[#f3f4f6] hover:text-[#191c1e] transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>close</span>
          </button>
        </div>

        {/* İçerik */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#f3f4f6] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "40px" }}>shopping_cart</span>
            </div>
            <div>
              <p className="font-bold text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "16px" }}>Sepetiniz boş</p>
              <p className="text-[#737685] mt-1" style={{ fontSize: "13px" }}>Ürün eklemek için alışverişe başlayın.</p>
            </div>
            <Link
              href="/urunler"
              onClick={closeSidebar}
              className="px-6 py-2.5 rounded-xl bg-[#003d9b] text-white font-bold hover:opacity-90 transition-opacity"
              style={{ fontSize: "13px" }}
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <>
            {/* Ürün listesi */}
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-[#f8f9fb] rounded-xl p-3 border border-[#edeef3]">
                  {/* Görsel */}
                  <div className="w-16 h-16 rounded-lg bg-white border border-[#edeef3] flex items-center justify-center shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl || "/placeholder-lens.jpg"}
                      alt={item.name}
                      className="w-14 h-14 object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Bilgi */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[#737685] uppercase" style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em" }}>{item.brand}</p>
                    <p className="font-semibold text-[#191c1e] truncate" style={{ fontSize: "13px", fontFamily: "'Plus Jakarta Sans'" }}>{item.name}</p>
                    <p className="font-bold text-[#003d9b] mt-0.5" style={{ fontSize: "14px", fontFamily: "'Plus Jakarta Sans'" }}>
                      {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
                    </p>

                    {/* Miktar kontrolü */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-[#c3c6d6] rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#434654] hover:bg-[#f3f4f6] transition-colors"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>remove</span>
                        </button>
                        <span className="w-7 text-center font-bold text-[#191c1e]" style={{ fontSize: "13px" }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#434654] hover:bg-[#f3f4f6] transition-colors"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>add</span>
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-[#737685] hover:text-red-500 transition-colors"
                        title="Kaldır"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Alt: Özet + Buton */}
            <div className="border-t border-[#edeef3] px-5 py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[#737685] font-semibold" style={{ fontSize: "13px" }}>Toplam ({count} ürün)</span>
                <span className="font-bold text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px" }}>
                  {total.toLocaleString("tr-TR")} ₺
                </span>
              </div>
              {total < 500 && (
                <div className="flex items-center gap-2 bg-[#f0f4ff] rounded-lg px-3 py-2">
                  <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "16px" }}>local_shipping</span>
                  <p className="text-[#003d9b]" style={{ fontSize: "12px", fontWeight: 500 }}>
                    Ücretsiz kargo için <strong>{(500 - total).toLocaleString("tr-TR")} ₺</strong> daha ekle
                  </p>
                </div>
              )}
              {total >= 500 && (
                <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                  <span className="material-symbols-outlined text-green-600" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <p className="text-green-700 font-semibold" style={{ fontSize: "12px" }}>Ücretsiz kargo kazandınız!</p>
                </div>
              )}
              <Link
                href="/siparis"
                onClick={closeSidebar}
                onMouseEnter={() => setCheckoutHover(true)}
                onMouseLeave={() => setCheckoutHover(false)}
                className="w-full py-3.5 rounded-xl font-bold text-white text-center flex items-center justify-center gap-2 active:scale-95"
                style={{
                  background: checkoutHover ? "#15803d" : "#16a34a",
                  fontSize: "14px",
                  fontFamily: "'Inter'",
                  letterSpacing: "0.03em",
                  boxShadow: checkoutHover ? "0 8px 24px rgba(22,163,74,0.45)" : "0 4px 16px rgba(22,163,74,0.3)",
                  transform: checkoutHover ? "translateY(-2px)" : "translateY(0)",
                  transition: "all 0.18s ease",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Siparişi Tamamla
              </Link>
              <button
                onClick={clearCart}
                className="text-center text-[#737685] hover:text-red-500 transition-colors font-semibold"
                style={{ fontSize: "12px" }}
              >
                Sepeti Temizle
              </button>
            </div>
          </>
        )}
      </div>
    </>,
    document.body
  );
}
