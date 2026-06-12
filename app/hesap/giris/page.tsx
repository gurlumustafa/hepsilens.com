"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const GOOGLE_ERRORS: Record<string, string> = {
  google_denied:  "Google girişi iptal edildi.",
  state_mismatch: "Güvenlik doğrulaması başarısız, lütfen tekrar deneyin.",
  token_exchange: "Google ile bağlantı kurulamadı (redirect_uri eşleşmiyor olabilir).",
  no_email:       "Google hesabınızdan e-posta alınamadı.",
  server_error:   "Sunucu hatası, lütfen tekrar deneyin.",
};

function googleErrorMessage(code: string | null): string {
  if (!code) return "";
  if (GOOGLE_ERRORS[code]) return GOOGLE_ERRORS[code];
  if (code.startsWith("db_"))      return `Veritabanı hatası: ${decodeURIComponent(code.slice(3))}`;
  if (code.startsWith("session_")) return `Oturum hatası: ${decodeURIComponent(code.slice(8))}`;
  if (code.startsWith("token_fetch_")) return `Google bağlantı hatası: ${decodeURIComponent(code.slice(12))}`;
  if (code.startsWith("userinfo_")) return `Kullanıcı bilgisi alınamadı: ${decodeURIComponent(code.slice(9))}`;
  return `Hata: ${code}`;
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
      <path d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.1c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.2 7.4-10.5 7.4-17.5z" fill="#4285F4"/>
      <path d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.2 1.5-5 2.3-8 2.3-6.1 0-11.3-4.1-13.1-9.7H2.7v6.2C6.7 42.8 14.8 48 24 48z" fill="#34A853"/>
      <path d="M10.9 28.8A14.8 14.8 0 0 1 10 24c0-1.7.3-3.3.8-4.8v-6.2H2.7A24 24 0 0 0 0 24c0 3.9.9 7.5 2.7 10.8l8.2-6z" fill="#FBBC05"/>
      <path d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.6-6.6C35.8 2.4 30.5 0 24 0 14.8 0 6.7 5.2 2.7 13.2l8.2 6.2C12.7 13.6 17.9 9.5 24 9.5z" fill="#EA4335"/>
    </svg>
  );
}

function GirisContent() {
  const { register, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillEmail  = searchParams.get("email") ?? "";
  const googleError   = searchParams.get("error");
  const modeParam     = searchParams.get("mode");

  const [mode, setMode]       = useState<"login" | "register">(
    modeParam === "login" || modeParam === "register" ? modeParam : "login"
  );

  useEffect(() => {
    const currentMode = searchParams.get("mode");
    if (currentMode === "login" || currentMode === "register") {
      setMode(currentMode);
    }
  }, [searchParams]);

  const [name, setName]       = useState("");
  const [email, setEmail]     = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError]     = useState(googleErrorMessage(googleError));
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim())       return setError("Ad Soyad gereklidir.");
    if (!email.includes("@")) return setError("Geçerli bir e-posta girin.");
    if (password.length < 6)  return setError("Şifre en az 6 karakter olmalıdır.");
    if (password !== confirm)  return setError("Şifreler eşleşmiyor.");
    setLoading(true);
    const res = await register(name.trim(), email.trim(), password);
    setLoading(false);
    if (res?.error) return setError(res.error);
    router.push("/hesap");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) return setError("Geçerli bir e-posta girin.");
    if (!password)             return setError("Şifre gereklidir.");
    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);
    if (res?.error) return setError(res.error);
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

            {/* ── Google butonu ────────────────────────────────── */}
            <a
              href="/api/auth/google"
              className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border-2 border-[#e5e7eb] bg-white hover:bg-[#f8f9fb] hover:border-[#c3c6d6] active:scale-[0.98] transition-all font-semibold text-[#374151] mb-4"
              style={{ fontSize: "14px", fontFamily: "'Inter'" }}
            >
              <GoogleIcon />
              Google ile {mode === "register" ? "Kayıt Ol" : "Giriş Yap"}
            </a>

            {/* Ayraç */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-[#edeef3]" />
              <span className="text-[#9ca3af] font-medium" style={{ fontSize: "11px" }}>veya e-posta ile</span>
              <div className="flex-1 h-px bg-[#edeef3]" />
            </div>

            {/* ── E-posta / Şifre formu ─────────────────────── */}
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
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                style={{ background: "#003d9b", fontSize: "14px", fontFamily: "'Inter'", letterSpacing: "0.03em" }}
              >
                {loading ? "Yükleniyor…" : (mode === "register" ? "Hesap Oluştur" : "Giriş Yap")}
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
