"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  productId: number;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: { icon: "16px", btn: "28px" },
  md: { icon: "18px", btn: "32px" },
  lg: { icon: "22px", btn: "40px" },
};

export default function FavoriteButton({ productId, size = "md", className = "" }: Props) {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const router = useRouter();
  const active = isFavorite(productId);
  const { icon, btn } = sizes[size];

  function handle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { router.push("/hesap/giris"); return; }
    toggleFavorite(productId);
  }

  return (
    <button
      onClick={handle}
      title={user ? (active ? "Favorilerden Çıkar" : "Favorilere Ekle") : "Favorilere eklemek için giriş yapın"}
      className={`flex items-center justify-center rounded-full transition-all duration-200 ${className}`}
      style={{
        width: btn, height: btn,
        background: active ? "#fee2e2" : "rgba(255,255,255,0.92)",
        backdropFilter: "blur(4px)",
        border: active ? "1.5px solid #fca5a5" : "1.5px solid rgba(0,0,0,0.08)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
      }}
    >
      <span
        className="material-symbols-outlined transition-all duration-200"
        style={{
          fontSize: icon,
          color: active ? "#dc2626" : "#737685",
          fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
          transform: active ? "scale(1.1)" : "scale(1)",
        }}
      >
        favorite
      </span>
    </button>
  );
}
