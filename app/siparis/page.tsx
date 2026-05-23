"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth, isExpired, Prescription } from "@/contexts/AuthContext";
import { lenses } from "@/lib/data";

type PayMethod = "card" | "cod" | "transfer";

// Hangi sepet ürünleri reçete gerektiriyor?
function useRxCheck() {
  const { items } = useCart();
  return items.some((item) => {
    const lens = lenses.find((l) => l.id === item.id);
    return lens && lens.color === "clear";
  });
}

export default function SiparisPage() {
  const router = useRouter();
  const { items, total, count, clearCart } = useCart();
  const { user, prescriptions, addresses, addPrescription } = useAuth();
  const needsRx = useRxCheck();

  // Teslimat
  const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0];
  const [contact, setContact] = useState({
    fullName: user?.name ?? "",
    email:    user?.email ?? "",
    phone:    user?.phone ?? "",
  });
  const [addrMode, setAddrMode] = useState<"saved" | "new">(defaultAddr && addresses.length > 0 ? "saved" : "new");
  const [selectedAddrId, setSelectedAddrId] = useState<string>(defaultAddr?.id ?? "");
  const [newAddr, setNewAddr] = useState({ city: "", district: "", postalCode: "", fullAddress: "" });

  // Reçete
  const validRx = prescriptions.filter((p) => !isExpired(p.expiryDate));
  const [rxSource, setRxSource] = useState<"profile" | "upload" | null>(
    needsRx ? (validRx.length > 0 ? "profile" : "upload") : null
  );
  const [selectedRxId, setSelectedRxId] = useState<string>(validRx[0]?.id ?? "");
  const [uploadedRx, setUploadedRx] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Ödeme
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  // Tamamlandı
  const [placed, setPlaced] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [orderNo] = useState(`HL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`);

  const shipping = total >= 500 ? 0 : 39;
  const grandTotal = total + shipping;

  // Reçete hazır mı?
  const rxReady = !needsRx
    || (rxSource === "profile" && !!selectedRxId)
    || (rxSource === "upload" && !!uploadedRx);

  // Adres hazır mı?
  const addrReady = addrMode === "saved"
    ? !!selectedAddrId
    : !!(newAddr.city && newAddr.district && newAddr.fullAddress);

  // Kart bilgileri hazır mı?
  const cardReady = payMethod !== "card"
    || (
      card.number.replace(/\s/g, "").length === 16 &&
      card.name.trim().length > 0 &&
      card.expiry.length === 5 &&
      card.cvv.length === 3
    );

  const canSubmit = !!(
    contact.fullName &&
    contact.phone &&
    addrReady &&
    rxReady &&
    cardReady &&
    items.length > 0
  );

  function handlePlace() {
    if (!canSubmit) return;
    if (rxSource === "upload" && uploadedRx) {
      addPrescription({ fileName: uploadedRx, doctorName: "", issueDate: new Date().toISOString().split("T")[0], notes: "" });
    }
    setPlaced(true);
    clearCart();
  }

  // ── Sipariş onaylandı ekranı ────────────────────────────────────
  if (placed) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center px-4" style={{ background: "#f8f9fb" }}>
        <div className="bg-white rounded-2xl border border-[#edeef3] p-10 max-w-md w-full text-center shadow-sm">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <span className="material-symbols-outlined text-green-600" style={{ fontSize: "40px", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h1 className="text-[#191c1e] mb-2" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "24px", fontWeight: 700 }}>
            Siparişiniz Alındı!
          </h1>
          <p className="text-[#737685] mb-1" style={{ fontSize: "14px" }}>Sipariş numaranız:</p>
          <p className="font-bold text-[#003d9b] mb-5" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px" }}>{orderNo}</p>
          <p className="text-[#737685] mb-8" style={{ fontSize: "13px", lineHeight: "20px" }}>
            Siparişiniz hazırlanmaya başlandı. Kargo bilgileri e-posta adresinize gönderilecektir.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/" className="w-full py-3 rounded-xl font-bold text-white text-center hover:opacity-90 transition-opacity" style={{ background: "#003d9b", fontSize: "13px" }}>
              Anasayfaya Dön
            </Link>
            {user && (
              <Link href="/hesap?s=orders" className="w-full py-3 rounded-xl font-semibold border border-[#c3c6d6] text-[#434654] text-center hover:bg-[#f3f4f6] transition-colors" style={{ fontSize: "13px" }}>
                Siparişlerimi Görüntüle
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Boş sepet ────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "64px" }}>shopping_cart</span>
          <p className="font-bold text-[#191c1e] mt-4" style={{ fontSize: "18px" }}>Sepetiniz boş</p>
          <Link href="/urunler" className="mt-4 inline-block px-6 py-2.5 rounded-xl bg-[#003d9b] text-white font-bold hover:opacity-90" style={{ fontSize: "13px" }}>
            Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[72px] pb-16 px-4 md:px-8 max-w-[1280px] mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 py-5">
        <Link href="/" className="text-[#737685] hover:text-[#003d9b] transition-colors flex items-center gap-1" style={{ fontSize: "13px", fontWeight: 600 }}>
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>home</span>
          Anasayfa
        </Link>
        <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "16px" }}>chevron_right</span>
        <span className="text-[#003d9b]" style={{ fontSize: "13px", fontWeight: 600 }}>Sipariş Tamamla</span>
      </nav>

      <h1 className="text-[#191c1e] mb-8" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "28px", fontWeight: 700 }}>
        Sipariş Tamamla
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── Sol: Sipariş Özeti ─────────────────────────────────── */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-[#edeef3] p-5">
            <h2 className="font-bold text-[#191c1e] mb-4" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "16px" }}>
              Sipariş Özeti ({count} ürün)
            </h2>
            <div className="flex flex-col gap-3">
              {items.map((item) => {
                const isRxItem = lenses.find((l) => l.id === item.id)?.color === "clear";
                return (
                  <Link
                    key={item.id}
                    href={`/urun/${item.id}`}
                    className="flex gap-3 py-3 border-b border-[#f0f1f5] last:border-0 group hover:bg-[#f8f9fb] rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div className="w-14 h-14 rounded-lg bg-[#f4f5f9] border border-[#edeef3] flex items-center justify-center shrink-0 group-hover:border-[#003d9b] transition-colors">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.imageUrl || "/placeholder-lens.jpg"} alt={item.name} className="w-12 h-12 object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#737685] uppercase" style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em" }}>{item.brand}</p>
                      <p className="font-semibold text-[#191c1e] truncate group-hover:text-[#003d9b] transition-colors" style={{ fontSize: "13px" }}>{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[#737685]" style={{ fontSize: "12px" }}>× {item.quantity}</p>
                        {isRxItem && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold" style={{ fontSize: "9px" }}>REÇETE</span>
                        )}
                      </div>
                    </div>
                    <p className="font-bold text-[#003d9b] shrink-0" style={{ fontSize: "14px", fontFamily: "'Plus Jakarta Sans'" }}>
                      {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
                    </p>
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-[#edeef3] flex flex-col gap-2">
              <div className="flex justify-between text-[#737685]" style={{ fontSize: "13px" }}>
                <span>Ara toplam</span>
                <span>{total.toLocaleString("tr-TR")} ₺</span>
              </div>
              <div className="flex justify-between text-[#737685]" style={{ fontSize: "13px" }}>
                <span>Kargo</span>
                <span className={shipping === 0 ? "text-green-600 font-semibold" : ""}>{shipping === 0 ? "Ücretsiz" : `${shipping} ₺`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[#737685]" style={{ fontSize: "11px" }}>
                  500 ₺ üzeri siparişlerde ücretsiz kargo
                </p>
              )}
              <div className="flex justify-between font-bold text-[#191c1e] pt-2 border-t border-[#f0f1f5]" style={{ fontSize: "16px" }}>
                <span>Toplam</span>
                <span className="text-[#003d9b]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px" }}>
                  {grandTotal.toLocaleString("tr-TR")} ₺
                </span>
              </div>
            </div>
          </div>

          {/* Güven rozetleri */}
          <div className="bg-white rounded-xl border border-[#edeef3] p-4 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: "lock", label: "Güvenli Ödeme" },
              { icon: "local_shipping", label: "Hızlı Kargo" },
              { icon: "replay", label: "14 Gün İade" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                <p className="text-[#737685]" style={{ fontSize: "10px", fontWeight: 600 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sağ: Form ─────────────────────────────────────────── */}
        <div className="lg:col-span-7 flex flex-col gap-5">

          {/* 1. Teslimat Bilgileri */}
          <Section title="1. İletişim Bilgileri" icon="person">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Ad Soyad *" value={contact.fullName} onChange={(v) => setContact({ ...contact, fullName: v })} placeholder="Adınız Soyadınız" />
              <Field label="Telefon *" value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v })} placeholder="05XX XXX XX XX" type="tel" />
              <div className="sm:col-span-2">
                <Field label="E-posta" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} placeholder="ornek@eposta.com" type="email" />
              </div>
            </div>
          </Section>

          {/* 2. Teslimat Adresi */}
          <Section title="2. Teslimat Adresi" icon="location_on">
            {addresses.length > 0 && (
              <div className="flex gap-2 mb-4">
                {(["saved", "new"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setAddrMode(m)}
                    className="flex-1 py-2 rounded-lg font-semibold transition-colors border"
                    style={{
                      fontSize: "12px",
                      background: addrMode === m ? "#003d9b" : "white",
                      color: addrMode === m ? "white" : "#434654",
                      borderColor: addrMode === m ? "#003d9b" : "#c3c6d6",
                    }}
                  >
                    {m === "saved" ? "Kayıtlı Adres" : "Yeni Adres"}
                  </button>
                ))}
              </div>
            )}

            {addrMode === "saved" && addresses.length > 0 ? (
              <div className="flex flex-col gap-2">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors"
                    style={{ borderColor: selectedAddrId === addr.id ? "#003d9b" : "#edeef3", background: selectedAddrId === addr.id ? "#f0f4ff" : "white" }}
                  >
                    <input type="radio" name="addr" className="mt-1 accent-[#003d9b]"
                      checked={selectedAddrId === addr.id}
                      onChange={() => setSelectedAddrId(addr.id)} />
                    <div>
                      <p className="font-bold text-[#191c1e]" style={{ fontSize: "13px" }}>{addr.title}</p>
                      <p className="text-[#737685]" style={{ fontSize: "12px" }}>{addr.fullName} · {addr.phone}</p>
                      <p className="text-[#737685]" style={{ fontSize: "12px" }}>{addr.fullAddress}, {addr.district} / {addr.city}{addr.postalCode ? ` ${addr.postalCode}` : ""}</p>
                    </div>
                    {addr.isDefault && (
                      <span className="ml-auto shrink-0 px-2 py-0.5 rounded-full bg-[#dae2ff] text-[#003d9b] font-bold" style={{ fontSize: "9px" }}>Varsayılan</span>
                    )}
                  </label>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Şehir *" value={newAddr.city} onChange={(v) => setNewAddr({ ...newAddr, city: v })} placeholder="İstanbul" />
                <Field label="İlçe *" value={newAddr.district} onChange={(v) => setNewAddr({ ...newAddr, district: v })} placeholder="Kadıköy" />
                <Field label="Posta Kodu" value={newAddr.postalCode} onChange={(v) => setNewAddr({ ...newAddr, postalCode: v.replace(/\D/g, "").slice(0, 5) })} placeholder="34000" />
                <div className="sm:col-span-2">
                  <Field label="Tam Adres *" value={newAddr.fullAddress} onChange={(v) => setNewAddr({ ...newAddr, fullAddress: v })} placeholder="Mahalle, cadde, bina, daire..." />
                </div>
              </div>
            )}
          </Section>

          {/* 3. Reçete (gerekiyorsa) */}
          {needsRx && (
            <Section title="3. Reçete" icon="receipt_long" accent="amber">
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
                <span className="material-symbols-outlined text-amber-600 shrink-0 mt-0.5" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>warning</span>
                <p style={{ fontSize: "12px", color: "#92400e", lineHeight: "18px" }}>
                  Sepetinizdeki şeffaf lensler tıbbi sınıf ürün olduğundan geçerli bir reçete gerekmektedir.
                  Reçeteler maksimum <strong>6 ay</strong> sonrasına kadar geçerlidir.
                </p>
              </div>

              {/* Reçete kaynağı seçimi */}
              {validRx.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {([
                    { v: "profile", label: "Profilimden Seç" },
                    { v: "upload",  label: "Yeni Yükle" },
                  ] as const).map(({ v, label }) => (
                    <button key={v} onClick={() => setRxSource(v)}
                      className="flex-1 py-2 rounded-lg font-semibold transition-colors border"
                      style={{
                        fontSize: "12px",
                        background: rxSource === v ? "#003d9b" : "white",
                        color: rxSource === v ? "white" : "#434654",
                        borderColor: rxSource === v ? "#003d9b" : "#c3c6d6",
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {/* Profilden seç */}
              {rxSource === "profile" && validRx.length > 0 && (
                <div className="flex flex-col gap-2">
                  {validRx.map((rx: Prescription) => (
                    <label key={rx.id}
                      className="flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors"
                      style={{ borderColor: selectedRxId === rx.id ? "#003d9b" : "#edeef3", background: selectedRxId === rx.id ? "#f0f4ff" : "white" }}>
                      <input type="radio" name="rx" className="accent-[#003d9b]"
                        checked={selectedRxId === rx.id}
                        onChange={() => setSelectedRxId(rx.id)} />
                      <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>description</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#191c1e] truncate" style={{ fontSize: "13px" }}>{rx.fileName}</p>
                        <p className="text-[#737685]" style={{ fontSize: "11px" }}>Son geçerlilik: {rx.expiryDate}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold shrink-0" style={{ fontSize: "10px" }}>Geçerli</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Yeni yükle */}
              {(rxSource === "upload" || validRx.length === 0) && (
                <label
                  className="cursor-pointer group flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl py-8 transition-all"
                  style={{ borderColor: uploadedRx ? "#003d9b" : "#c3c6d6" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#003d9b")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = uploadedRx ? "#003d9b" : "#c3c6d6")}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#f0f4ff] group-hover:bg-[#dae2ff] flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "24px" }}>
                      {uploadedRx ? "description" : "cloud_upload"}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-[#191c1e]" style={{ fontSize: "13px" }}>{uploadedRx || "Reçetenizi yükleyin"}</p>
                    <p className="text-[#737685]" style={{ fontSize: "11px" }}>PDF, JPG veya PNG · maks. 5 MB</p>
                  </div>
                  {!uploadedRx && (
                    <span className="px-5 py-2 rounded-full bg-[#003d9b] text-white font-bold" style={{ fontSize: "12px" }}>Dosya Seç</span>
                  )}
                  <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                    onChange={(e) => setUploadedRx(e.target.files?.[0]?.name ?? null)} />
                </label>
              )}
              {uploadedRx && (
                <button onClick={() => setUploadedRx(null)} className="mt-2 text-[#737685] hover:text-red-500 transition-colors text-sm font-semibold">
                  × Reçeteyi Kaldır
                </button>
              )}
            </Section>
          )}

          {/* 4. Ödeme */}
          <Section title={`${needsRx ? "4" : "3"}. Ödeme Yöntemi`} icon="credit_card">
            <div className="flex flex-col gap-2 mb-4">
              {([
                { v: "card",     icon: "credit_card",     label: "Kredi / Banka Kartı", soon: false },
                { v: "cod",      icon: "payments",        label: "Kapıda Ödeme",         soon: true  },
                { v: "transfer", icon: "account_balance", label: "Havale / EFT",         soon: true  },
              ] as { v: PayMethod; icon: string; label: string; soon: boolean }[]).map(({ v, icon, label, soon }) => (
                <label key={v}
                  className="flex items-center gap-3 p-4 rounded-xl border transition-colors"
                  style={{
                    borderColor: !soon && payMethod === v ? "#003d9b" : "#edeef3",
                    background: !soon && payMethod === v ? "#f0f4ff" : soon ? "#fafafa" : "white",
                    cursor: soon ? "not-allowed" : "pointer",
                    opacity: soon ? 0.6 : 1,
                  }}>
                  <input type="radio" name="pay" className="accent-[#003d9b]"
                    checked={!soon && payMethod === v}
                    disabled={soon}
                    onChange={() => !soon && setPayMethod(v)} />
                  <span className="material-symbols-outlined" style={{ fontSize: "20px", color: !soon && payMethod === v ? "#003d9b" : "#737685" }}>{icon}</span>
                  <span className="font-semibold text-[#191c1e]" style={{ fontSize: "13px" }}>{label}</span>
                  {soon && (
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#b45309] font-bold" style={{ fontSize: "10px" }}>
                      Yakında
                    </span>
                  )}
                </label>
              ))}
            </div>

            {payMethod === "card" && (
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="col-span-2">
                  <Field label="Kart Numarası" value={card.number}
                    onChange={(v) => setCard({ ...card, number: v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim() })}
                    placeholder="0000 0000 0000 0000" />
                </div>
                <div className="col-span-2">
                  <Field label="Kart Üzerindeki Ad" value={card.name} onChange={(v) => setCard({ ...card, name: v })} placeholder="AD SOYAD" />
                </div>
                <Field label="Son Kullanma" value={card.expiry}
                  onChange={(v) => setCard({ ...card, expiry: v.replace(/\D/g, "").slice(0, 4).replace(/(.{2})/, "$1/") })}
                  placeholder="AA/YY" />
                <Field label="CVV" value={card.cvv} onChange={(v) => setCard({ ...card, cvv: v.replace(/\D/g, "").slice(0, 3) })} placeholder="***" type="password" />
              </div>
            )}
            {payMethod === "transfer" && (
              <div className="bg-[#f8f9fb] rounded-xl border border-[#edeef3] p-4 mt-2">
                <p className="font-semibold text-[#191c1e] mb-1" style={{ fontSize: "13px" }}>Banka Bilgileri</p>
                <p className="text-[#737685]" style={{ fontSize: "12px" }}>Banka: Hepsilens A.Ş. · Garanti BBVA</p>
                <p className="text-[#737685]" style={{ fontSize: "12px" }}>IBAN: TR12 0006 2000 1234 5678 9012 34</p>
                <p className="text-[#737685] mt-1" style={{ fontSize: "11px" }}>Açıklama kısmına sipariş numaranızı yazmayı unutmayın.</p>
              </div>
            )}
          </Section>

          {/* Sipariş ver butonu */}
          {!canSubmit && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <span className="material-symbols-outlined text-amber-600 shrink-0" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>info</span>
              <p style={{ fontSize: "12px", color: "#92400e" }}>
                {(!contact.fullName || !contact.phone)
                  ? "İletişim bilgilerini doldurun."
                  : !addrReady
                  ? "Teslimat adresini ekleyin."
                  : !rxReady
                  ? "Reçete gerektiren ürün var — reçete yükleyin veya profilden seçin."
                  : !cardReady
                  ? "Kart bilgilerini eksiksiz doldurun."
                  : "Tüm alanları doldurun."}
              </p>
            </div>
          )}

          <button
            onClick={handlePlace}
            disabled={!canSubmit}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            className="w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 active:scale-95"
            style={{
              background: canSubmit
                ? (btnHover ? "#b45309" : "#d97706")
                : "#c3c6d6",
              color: canSubmit ? "#ffffff" : "#737685",
              cursor: canSubmit ? "pointer" : "not-allowed",
              fontSize: "16px",
              fontFamily: "'Inter'",
              letterSpacing: "0.03em",
              boxShadow: canSubmit
                ? (btnHover ? "0 8px 24px rgba(217,119,6,0.45)" : "0 4px 16px rgba(217,119,6,0.3)")
                : "none",
              transform: canSubmit && btnHover ? "scale(1.02) translateY(-2px)" : "scale(1) translateY(0)",
              transition: "all 0.18s ease",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            Siparişi Onayla — {grandTotal.toLocaleString("tr-TR")} ₺
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Yardımcı bileşenler ───────────────────────────────────────────────

function Section({ title, icon, accent, children }: {
  title: string;
  icon: string;
  accent?: "amber";
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#edeef3] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f0f1f5]"
        style={{ background: accent === "amber" ? "#fffbeb" : "#fafbff" }}>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "20px", color: accent === "amber" ? "#b45309" : "#003d9b", fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
        <h2 className="font-bold text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px" }}>{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#434654] font-semibold" style={{ fontSize: "11px" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-[#f8f9fb] border border-[#c3c6d6] rounded-xl px-4 py-2.5 outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/15 transition-all"
        style={{ fontSize: "14px" }}
      />
    </div>
  );
}
