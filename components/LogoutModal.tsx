"use client";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type Props = { isOpen: boolean; onClose: () => void };

export default function LogoutModal({ isOpen, onClose }: Props) {
  const { logout } = useAuth();
  const router = useRouter();

  if (!isOpen) return null;

  const handleConfirmLogout = () => {
    logout();
    onClose();
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "rgba(15,18,35,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 w-full text-center"
        style={{ maxWidth: "360px", animation: "quickViewIn 0.2s ease" }}
        onClick={(e) => e.stopPropagation()}
      >
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
            onClick={handleConfirmLogout}
            className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors active:scale-95"
            style={{ fontSize: "14px" }}
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
