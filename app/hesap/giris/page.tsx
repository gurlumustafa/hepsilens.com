"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

function GirisContent() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get("email") ?? "";

  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Ad Soyad gereklidir.");
    if (!email.includes("@")) return setError("Geçerli bir e-posta girin.");
    if (password.length < 6) return setError("Şifre en az 6 karakter olmalıdır.");
    if (password !== confirm) return setError("Şifreler eşleşmiyor.");
    register(name.trim(), email.trim());
    router.push("/hesap");
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) return setError("Geçerli bir e-posta girin.");
    if (!password) return setError("Şifre gereklidir.");
    // Mock: demo amaçlı her credentials kabul edilir
    register(email.split("@")[0], email.trim());
    router.push("/hesap");
  }



  return (
    <div className="min-h-screen pt-[72px] flex items-center justify-center px-4" style={{ background: "#f8f9fb" }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <span className="font-bold text-[#003d9b]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "28px" }}>
              Hepsilens
            </span>
          </Link>
          <p className="text-[#737685] mt-1" style={{ fontSize: "14px" }}>
            {mode === "register" ? "Hesap oluştur, lenslerini yönet." : "Hesabına giriş yap."}
          </p>
        </div>

        {/* Kart */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#edeef3] overflow-hidden">

          {/* Tab */}
          <div className="flex border-b border-[#edeef3]">
            {(["register", "login"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(""); }}
                className="flex-1 py-4 font-bold transition-colors relative"
                style={{
                  fontSize: "13px",
                  fontFamily: "'Inter'",
                  color: mode === m ? "#003d9b" : "#737685",
                  background: mode === m ? "#fafbff" : "white",
                }}
              >
                {m === "register" ? "Kayıt Ol" : "Giriş Yap"}
                {mode === m && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#003d9b] rounded-t-full" />}
              </button>
            ))}
          </div>

          <div className="p-6">
            <form onSubmit={mode === "register" ? handleRegister : handleLogin} className="flex flex-col gap-4">

              {mode === "register" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#434654] font-semibold" style={{ fontSize: "12px" }}>Ad Soyad</label>
                  <input
                    className="w-full bg-[#f8f9fb] border border-[#c3c6d6] rounded-xl px-4 py-3 outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/15 transition-all"
                    style={{ fontSize: "14px" }}
                    placeholder="Adınız Soyadınız"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[#434654] font-semibold" style={{ fontSize: "12px" }}>E-posta</label>
                <input
                  type="email"
                  className="w-full bg-[#f8f9fb] border border-[#c3c6d6] rounded-xl px-4 py-3 outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/15 transition-all"
                  style={{ fontSize: "14px" }}
                  placeholder="ornek@eposta.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#434654] font-semibold" style={{ fontSize: "12px" }}>Şifre</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    className="w-full bg-[#f8f9fb] border border-[#c3c6d6] rounded-xl px-4 py-3 pr-11 outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/15 transition-all"
                    style={{ fontSize: "14px" }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737685] hover:text-[#191c1e] transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{showPass ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              {mode === "register" && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#434654] font-semibold" style={{ fontSize: "12px" }}>Şifre Tekrar</label>
                  <input
                    type="password"
                    className="w-full bg-[#f8f9fb] border border-[#c3c6d6] rounded-xl px-4 py-3 outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/15 transition-all"
                    style={{ fontSize: "14px" }}
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <span className="material-symbols-outlined text-red-500 shrink-0" style={{ fontSize: "16px" }}>error</span>
                  <p className="text-red-600" style={{ fontSize: "13px" }}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: "#003d9b", fontSize: "14px", fontFamily: "'Inter'", letterSpacing: "0.03em" }}
              >
                {mode === "register" ? "Hesap Oluştur" : "Giriş Yap"}
              </button>
            </form>

            {mode === "register" && (
              <p className="text-center text-[#737685] mt-4" style={{ fontSize: "11px", lineHeight: "16px" }}>
                Kayıt olarak{" "}
                <Link href="/gizlilik" className="text-[#003d9b] hover:underline">Gizlilik Politikası</Link>
                {" "}ve{" "}
                <Link href="/kullanim-sartlari" className="text-[#003d9b] hover:underline">Kullanım Şartları</Link>
                &apos;nı kabul etmiş sayılırsınız.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GirisPage() {
  return (
    <Suspense fallback={<div className="pt-[72px] min-h-screen flex items-center justify-center"><p className="text-[#737685]">Yükleniyor...</p></div>}>
      <GirisContent />
    </Suspense>
  );
}
