"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminGiris() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Zaten giriş yapıldıysa direkt yönlendir
  useEffect(() => {
    if (localStorage.getItem("hl_admin_auth") === "1") {
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (email === "engin@gmail.com" && password === "123456") {
        localStorage.setItem("hl_admin_auth", "1");
        router.replace("/admin");
      } else {
        setError("E-posta veya şifre hatalı.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Arkaplan deseni */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div style={{ position: "relative", width: "380px" }}>
        {/* Kart */}
        <div style={{ background: "white", borderRadius: "24px", padding: "40px 36px", boxShadow: "0 32px 80px rgba(0,0,0,0.35)" }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#003d9b", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "white", fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
            </div>
            <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "22px", fontWeight: 800, color: "#111827" }}>Hepsilens</p>
            <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>Yönetici Paneli Girişi</p>
          </div>

          {/* Hata */}
          {error && (
            <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: "10px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#dc2626", fontVariationSettings: "'FILL' 1" }}>error</span>
              <p style={{ fontSize: "13px", color: "#991b1b", fontWeight: 500 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* E-posta */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151" }}>E-posta</label>
              <div style={{ position: "relative" }}>
                <span className="material-symbols-outlined" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "18px", color: "#9ca3af" }}>mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@hepsilens.com"
                  required
                  style={{ width: "100%", paddingLeft: "40px", paddingRight: "12px", paddingTop: "10px", paddingBottom: "10px", border: "1px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", color: "#111827", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => (e.target.style.borderColor = "#003d9b")}
                  onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            {/* Şifre */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "#374151" }}>Şifre</label>
              <div style={{ position: "relative" }}>
                <span className="material-symbols-outlined" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "18px", color: "#9ca3af" }}>lock</span>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ width: "100%", paddingLeft: "40px", paddingRight: "44px", paddingTop: "10px", paddingBottom: "10px", border: "1px solid #e5e7eb", borderRadius: "10px", fontSize: "14px", color: "#111827", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => (e.target.style.borderColor = "#003d9b")}
                  onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", alignItems: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{showPass ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "12px", borderRadius: "12px", border: "none",
                background: loading ? "#93c5fd" : "#003d9b", color: "white",
                fontSize: "14px", fontWeight: 700, cursor: loading ? "wait" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                marginTop: "4px", transition: "background 0.2s",
              }}
            >
              {loading
                ? <><span className="material-symbols-outlined" style={{ fontSize: "18px", animation: "spin 1s linear infinite" }}>progress_activity</span> Giriş yapılıyor…</>
                : <><span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>login</span> Giriş Yap</>
              }
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "11px", color: "#9ca3af", marginTop: "24px" }}>
            Hepsilens Yönetici Paneli · Yetkisiz erişim yasaktır
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
