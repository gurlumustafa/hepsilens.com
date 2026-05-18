"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

/* ── section: bülten ── */
export default function NewsletterSection() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = email.trim() ? `?email=${encodeURIComponent(email.trim())}` : "";
    router.push(`/hesap/giris${params}`);
  }

  return (
    <section id="bülten" className="max-w-[1280px] mx-auto px-10 py-6">
      <div
        className="relative overflow-hidden rounded-[1rem] p-5 flex flex-col md:flex-row items-center justify-between gap-8"
        style={{ background: "linear-gradient(135deg, #003d9b 0%, #0052cc 60%, #00687b 100%)" }}
      >
        {/* Dekoratif daire */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 bg-white pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-10 bg-white pointer-events-none" />

        <div className="relative max-w-xl">
          <h2
            className="text-white mb-3 leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "28px", lineHeight: "36px", fontWeight: 700 }}
          >
            Görüşlerinizi duyurmak ve fırsatlardan anında haberdar olmak için şimdi kayıt olun!
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="relative flex w-full md:w-auto flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="E-posta adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/15 border border-white/30 text-white rounded-[0.75rem] px-4 py-3.5 outline-none w-full md:w-64 placeholder-white/50 focus:ring-2 focus:ring-white/40 focus:bg-white/20 transition-all duration-200"
            style={{ fontSize: "14px" }}
          />
          <button
            type="submit"
            className="bg-white text-[#003d9b] px-6 py-3.5 rounded-[0.75rem] font-bold hover:bg-[#dae2ff] hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap"
            style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "14px", fontWeight: 700 }}
          >
            Kayıt Ol
          </button>
        </form>
      </div>
    </section>
  );
}
