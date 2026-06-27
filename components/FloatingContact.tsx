"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const subjects = [
  "Sipariş Hakkında",
  "Ürün Sorusu",
  "Kargo ve Teslimat",
  "İade / Değişim",
  "Reçete ve Numaralar",
  "Teknik Destek",
  "Diğer",
];

export default function FloatingContact() {
  const { user } = useAuth();
  const [open, setOpen]       = useState(false);
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [form, setForm]       = useState<FormState>({ name: "", email: "", phone: "", subject: subjects[0], message: "" });
  const [errors, setErrors]   = useState<Partial<FormState>>({});
  const panelRef              = useRef<HTMLDivElement>(null);

  // Giriş yapmış kullanıcı bilgilerini otomatik doldur
  useEffect(() => {
    if (user && !user.is_anonymous) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
      }));
    }
  }, [user]);

  // Dışarı tıklayınca kapat
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // ESC ile kapat
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function f(k: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [k]: e.target.value }));
      if (errors[k]) setErrors((prev) => ({ ...prev, [k]: "" }));
    };
  }

  function validate() {
    const e: Partial<FormState> = {};
    if (!form.name.trim())    e.name    = "Ad Soyad gerekli";
    if (!form.email.trim())   e.email   = "E-posta gerekli";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Geçerli bir e-posta girin";
    if (!form.message.trim()) e.message = "Mesaj gerekli";
    // phone isteğe bağlı — boş bırakılabilir
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    setApiError(null);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Destek talebi gönderilirken bir hata oluştu.");
      }

      setSent(true);
    } catch (err: any) {
      console.error("[handleSubmit]", err);
      setApiError(err.message || "Bağlantı hatası oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm({
      name: user && !user.is_anonymous ? user.name || "" : "",
      email: user && !user.is_anonymous ? user.email || "" : "",
      phone: user && !user.is_anonymous ? user.phone || "" : "",
      subject: subjects[0],
      message: ""
    });
    setErrors({});
    setApiError(null);
    setLoading(false);
    setSent(false);
    setOpen(false);
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end gap-3">

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          className="w-[340px] bg-white rounded-2xl shadow-2xl border border-[#edeef3] overflow-hidden animate-fade-slide"
          style={{ maxHeight: "calc(100vh - 120px)", display: "flex", flexDirection: "column" }}
        >
          {/* Başlık */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0f1f5]"
            style={{ background: "linear-gradient(135deg, #003d9b 0%, #0052cc 100%)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}>headset_mic</span>
              </div>
              <div>
                <p className="font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "14px" }}>Bize Ulaşın</p>
                <p className="text-white/70" style={{ fontSize: "11px" }}>Genellikle 1 iş günü içinde yanıt veririz</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/15 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
            </button>
          </div>

          {/* İçerik */}
          <div className="overflow-y-auto flex-1 px-5 py-4">
            {sent ? (
              /* Başarı ekranı */
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-green-600" style={{ fontSize: "34px", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <p className="font-bold text-[#191c1e] mb-1" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "16px" }}>Mesajınız Alındı!</p>
                <p className="text-[#737685]" style={{ fontSize: "13px", lineHeight: "20px" }}>
                  En kısa sürede <strong className="text-[#191c1e]">{form.email}</strong> adresine geri döneceğiz.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-5 px-5 py-2 rounded-xl bg-[#f0f4ff] text-[#003d9b] font-bold hover:bg-[#dae2ff] transition-colors"
                  style={{ fontSize: "13px" }}
                >
                  Kapat
                </button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

                {/* Ad Soyad */}
                <div className="flex flex-col gap-1">
                  <label className="text-[#434654] font-semibold" style={{ fontSize: "11px" }}>Ad Soyad *</label>
                  <input
                    value={form.name}
                    onChange={f("name")}
                    placeholder="Adınız Soyadınız"
                    className="bg-[#f8f9fb] border rounded-xl px-3.5 py-2.5 outline-none transition-all"
                    style={{
                      fontSize: "13px",
                      borderColor: errors.name ? "#fca5a5" : "#c3c6d6",
                    }}
                    onFocus={e => (e.target.style.borderColor = "#003d9b")}
                    onBlur={e  => (e.target.style.borderColor = errors.name ? "#fca5a5" : "#c3c6d6")}
                  />
                  {errors.name && <p className="text-red-500" style={{ fontSize: "11px" }}>{errors.name}</p>}
                </div>

                {/* Telefon */}
                <div className="flex flex-col gap-1">
                  <label className="text-[#434654] font-semibold" style={{ fontSize: "11px" }}>Telefon</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={f("phone")}
                    placeholder="05XX XXX XX XX"
                    className="bg-[#f8f9fb] border rounded-xl px-3.5 py-2.5 outline-none transition-all"
                    style={{ fontSize: "13px", borderColor: "#c3c6d6" }}
                    onFocus={e => (e.target.style.borderColor = "#003d9b")}
                    onBlur={e  => (e.target.style.borderColor = "#c3c6d6")}
                  />
                </div>

                {/* E-posta */}
                <div className="flex flex-col gap-1">
                  <label className="text-[#434654] font-semibold" style={{ fontSize: "11px" }}>E-posta *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={f("email")}
                    placeholder="ornek@eposta.com"
                    className="bg-[#f8f9fb] border rounded-xl px-3.5 py-2.5 outline-none transition-all"
                    style={{ fontSize: "13px", borderColor: errors.email ? "#fca5a5" : "#c3c6d6" }}
                    onFocus={e => (e.target.style.borderColor = "#003d9b")}
                    onBlur={e  => (e.target.style.borderColor = errors.email ? "#fca5a5" : "#c3c6d6")}
                  />
                  {errors.email && <p className="text-red-500" style={{ fontSize: "11px" }}>{errors.email}</p>}
                </div>

                {/* Konu */}
                <div className="flex flex-col gap-1">
                  <label className="text-[#434654] font-semibold" style={{ fontSize: "11px" }}>Konu</label>
                  <select
                    value={form.subject}
                    onChange={f("subject")}
                    className="bg-[#f8f9fb] border border-[#c3c6d6] rounded-xl px-3.5 py-2.5 outline-none focus:border-[#003d9b] transition-all cursor-pointer"
                    style={{ fontSize: "13px" }}
                  >
                    {subjects.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {/* Mesaj */}
                <div className="flex flex-col gap-1">
                  <label className="text-[#434654] font-semibold" style={{ fontSize: "11px" }}>Mesaj *</label>
                  <textarea
                    value={form.message}
                    onChange={f("message")}
                    placeholder="Sorunuzu veya mesajınızı buraya yazın..."
                    rows={4}
                    className="bg-[#f8f9fb] border rounded-xl px-3.5 py-2.5 outline-none transition-all resize-none"
                    style={{ fontSize: "13px", borderColor: errors.message ? "#fca5a5" : "#c3c6d6", lineHeight: "20px" }}
                    onFocus={e => (e.target.style.borderColor = "#003d9b")}
                    onBlur={e  => (e.target.style.borderColor = errors.message ? "#fca5a5" : "#c3c6d6")}
                  />
                  {errors.message && <p className="text-red-500" style={{ fontSize: "11px" }}>{errors.message}</p>}
                </div>

                {apiError && (
                  <p className="text-red-500 text-center font-medium" style={{ fontSize: "11px" }}>
                    {apiError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 mt-1 disabled:opacity-50 disabled:pointer-events-none"
                  style={{ background: "#003d9b", fontSize: "13px", fontFamily: "'Inter'" }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>send</span>
                      Gönder
                    </>
                  )}
                </button>

                <p className="text-center text-[#737685]" style={{ fontSize: "10px" }}>
                  Mesajınız <strong>destek@hepsilens.com</strong>&apos;a iletilir
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating buton */}
      <button
        onClick={() => { setOpen((o) => !o); if (sent) { setSent(false); } }}
        className="w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all active:scale-95 hover:scale-105"
        style={{
          background: open ? "#191c1e" : "linear-gradient(135deg, #003d9b 0%, #0052cc 100%)",
          boxShadow: "0 8px 24px rgba(0,61,155,0.35)",
          transition: "all 0.2s ease",
        }}
        aria-label="İletişim"
      >
        <span
          className="material-symbols-outlined text-white transition-transform duration-200"
          style={{ fontSize: "26px", fontVariationSettings: "'FILL' 1", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          {open ? "close" : "chat"}
        </span>
      </button>
    </div>
  );
}
