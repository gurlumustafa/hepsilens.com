"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type Props = { isOpen: boolean; onClose: () => void };

export default function LogoutModal({ isOpen, onClose }: Props) {
  const { logout } = useAuth();
  const router = useRouter();
  const [phase, setPhase] = useState<"confirm" | "leaving">("confirm");
  const [count, setCount] = useState(3);

  // Faz değişince countdown başlat
  useEffect(() => {
    if (phase !== "leaving") return;
    const id = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(id);
          logout();
          router.push("/");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, logout, router]);

  // Modal kapanınca sıfırla
  useEffect(() => {
    if (!isOpen) { setPhase("confirm"); setCount(3); }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(15,18,35,0.6)", backdropFilter: "blur(4px)" }}
      onClick={phase === "confirm" ? onClose : undefined}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 w-full text-center"
        style={{ maxWidth: "360px", animation: "quickViewIn 0.2s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
        {phase === "confirm" ? (
          <>
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-red-500" style={{ fontSize: "32px", fontVariationSettings: "'FILL' 1" }}>
                logout
              </span>
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", fontWeight: 700, color: "#191c1e" }}>
              Çıkış yapmak istiyor musunuz?
            </h2>
            <p className="text-[#737685] mt-2 mb-7" style={{ fontSize: "14px", lineHeight: "20px" }}>
              Hesabınızdan çıkış yapılacak.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-[#c3c6d6] text-[#434654] font-semibold hover:bg-[#f3f4f6] transition-colors"
                style={{ fontSize: "14px" }}
              >
                Vazgeç
              </button>
              <button
                onClick={() => setPhase("leaving")}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors active:scale-95"
                style={{ fontSize: "14px" }}
              >
                Çıkış Yap
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-[#dae2ff] flex items-center justify-center mx-auto mb-5">
              <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "32px", fontVariationSettings: "'FILL' 1" }}>
                waving_hand
              </span>
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", fontWeight: 700, color: "#191c1e" }}>
              Güle güle!
            </h2>
            <p className="text-[#737685] mt-2 mb-6" style={{ fontSize: "14px", lineHeight: "20px" }}>
              Çıkış yapılıyor, ana sayfaya yönlendiriliyorsunuz.
            </p>
            <div className="w-14 h-14 rounded-full bg-[#f0f4ff] border-4 border-[#003d9b]/20 flex items-center justify-center mx-auto">
              <span className="font-bold text-[#003d9b]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "22px" }}>
                {count}
              </span>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
