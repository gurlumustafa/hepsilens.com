"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { useAuth, Address, isExpired, isNearExpiry } from "@/contexts/AuthContext";
import { lenses, accessories } from "@/lib/data";
import { useCart } from "@/contexts/CartContext";
import LogoutModal from "@/components/LogoutModal";

type Section = "favorites" | "prescriptions" | "orders" | "addresses" | "emails" | "settings";

const statusLabel: Record<string, { label: string; color: string; bg: string }> = {
  preparing: { label: "Hazırlanıyor", color: "#b45309", bg: "#fef3c7" },
  shipped: { label: "Kargoda", color: "#003d9b", bg: "#dae2ff" },
  delivered: { label: "Teslim Edildi", color: "#16a34a", bg: "#dcfce7" },
  cancelled: { label: "İptal", color: "#dc2626", bg: "#fee2e2" },
};

const navItems: { id: Section; icon: string; label: string }[] = [
  { id: "favorites", icon: "favorite", label: "Favorilerim" },
  { id: "prescriptions", icon: "receipt_long", label: "Reçetelerim" },
  { id: "orders", icon: "shopping_bag", label: "Siparişlerim" },
  { id: "addresses", icon: "location_on", label: "Adreslerim" },
  { id: "emails", icon: "notifications", label: "Bildirim Tercihleri" },
  { id: "settings", icon: "manage_accounts", label: "Ayarlar" },
];

// ── Reçete Yükleme Formu (sadece dosya) ──────────────────────────────
function PrescriptionForm({ onSubmit, onCancel }: {
  onSubmit: (p: { fileName: string; doctorName: string; issueDate: string; notes: string }) => void;
  onCancel: () => void;
}) {
  const [fileName, setFileName] = useState("");

  return (
    <div className="border border-[#edeef3] rounded-xl p-5 bg-[#fafbff] flex flex-col gap-4">
      <h3 className="font-bold text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px" }}>
        Yeni Reçete Yükle
      </h3>

      <label
        className="cursor-pointer group flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl py-10 transition-all"
        style={{ borderColor: fileName ? "#003d9b" : "#c3c6d6" }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "#003d9b")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = fileName ? "#003d9b" : "#c3c6d6")}
      >
        <div className="w-14 h-14 rounded-2xl bg-[#f0f4ff] group-hover:bg-[#dae2ff] flex items-center justify-center transition-colors">
          <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "28px" }}>
            {fileName ? "description" : "cloud_upload"}
          </span>
        </div>
        <div className="text-center">
          <p className="font-semibold text-[#191c1e]" style={{ fontSize: "14px" }}>
            {fileName || "Reçete dosyasını seçin"}
          </p>
          <p className="text-[#737685] mt-0.5" style={{ fontSize: "12px" }}>PDF, JPG veya PNG · maks. 5 MB</p>
        </div>
        {!fileName && (
          <span className="px-5 py-2 rounded-full bg-[#003d9b] text-white font-bold" style={{ fontSize: "12px" }}>
            Dosya Seç
          </span>
        )}
        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")} />
      </label>

      <div className="flex gap-2">
        <button
          onClick={() => {
            if (fileName) onSubmit({
              fileName,
              doctorName: "",
              issueDate: new Date().toISOString().split("T")[0],
              notes: "",
            });
          }}
          disabled={!fileName}
          className="flex-1 py-2.5 rounded-xl font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "#003d9b", fontSize: "13px", fontFamily: "'Inter'" }}
        >
          Kaydet
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-[#c3c6d6] text-[#434654] hover:bg-[#f3f4f6] transition-colors font-semibold"
          style={{ fontSize: "13px" }}
        >
          İptal
        </button>
      </div>
    </div>
  );
}

// ── Adres Formu ──────────────────────────────────────────────────────
function AddressForm({ onSubmit, onCancel }: {
  onSubmit: (a: Omit<Address, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ title: "", fullName: "", phone: "", city: "", district: "", postalCode: "", fullAddress: "", isDefault: false });
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="border border-[#edeef3] rounded-xl p-5 bg-[#fafbff] flex flex-col gap-3">
      <h3 className="font-bold text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px" }}>Yeni Adres Ekle</h3>
      <div className="grid grid-cols-2 gap-3">
        {([
          { label: "Adres Başlığı", key: "title", placeholder: "Ev, İş..." },
          { label: "Ad Soyad", key: "fullName", placeholder: "Adınız Soyadınız" },
          { label: "Şehir", key: "city", placeholder: "İstanbul" },
          { label: "İlçe", key: "district", placeholder: "Kadıköy" },
          { label: "Posta Kodu", key: "postalCode", placeholder: "34000" },
        ] as { label: string; key: keyof typeof form; placeholder: string }[]).map(({ label, key, placeholder }) => (
          <div key={String(key)} className="flex flex-col gap-1.5">
            <label className="text-[#434654] font-semibold" style={{ fontSize: "11px" }}>{label}</label>
            <input
              className="bg-white border border-[#c3c6d6] rounded-lg px-3 py-2 outline-none focus:border-[#003d9b] transition-colors"
              style={{ fontSize: "13px" }} placeholder={placeholder}
              value={String(form[key])} onChange={f(key)}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[#434654] font-semibold" style={{ fontSize: "11px" }}>Tam Adres</label>
        <input className="bg-white border border-[#c3c6d6] rounded-lg px-3 py-2 outline-none focus:border-[#003d9b] transition-colors"
          style={{ fontSize: "13px" }} placeholder="Mahalle, cadde, apartman, daire..."
          value={form.fullAddress} onChange={(e) => setForm({ ...form, fullAddress: e.target.value })} />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="w-4 h-4 accent-[#003d9b]"
          checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
        <span className="text-[#434654]" style={{ fontSize: "13px" }}>Varsayılan adres olarak ayarla</span>
      </label>
      <div className="flex gap-2">
        <button
          onClick={() => { if (form.title && form.fullName && form.city) onSubmit(form); }}
          className="flex-1 py-2.5 rounded-xl font-bold text-white hover:opacity-90 active:scale-95 transition-all"
          style={{ background: "#003d9b", fontSize: "13px", fontFamily: "'Inter'" }}
        >
          Kaydet
        </button>
        <button onClick={onCancel} className="px-5 py-2.5 rounded-xl border border-[#c3c6d6] text-[#434654] hover:bg-[#f3f4f6] transition-colors font-semibold" style={{ fontSize: "13px" }}>
          İptal
        </button>
      </div>
    </div>
  );
}

// ── İç bileşen (useSearchParams için Suspense gerekir) ────────────────
function HesapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    user, loaded, prescriptions, orders, addresses, emailPreferences, favorites,
    logout, updateUser, addPrescription, removePrescription,
    addAddress, removeAddress, setDefaultAddress, updateEmailPreferences, toggleFavorite,
  } = useAuth();

  const validSections: Section[] = ["favorites", "prescriptions", "orders", "addresses", "emails", "settings"];
  const paramSection = searchParams.get("s") as Section | null;
  const [section, setSection] = useState<Section>(
    paramSection && validSections.includes(paramSection) ? paramSection : "favorites"
  );
  const [showPrescForm, setShowPrescForm] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (loaded && !user) router.replace("/hesap/giris");
  }, [loaded, user, router]);

  if (!loaded) return (
    <div className="pt-[72px] min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#003d9b] border-t-transparent animate-spin" />
        <p className="text-[#737685]" style={{ fontSize: "13px" }}>Yükleniyor...</p>
      </div>
    </div>
  );
  if (!user) return null;

  function showSaved(msg = "Değişiklikler kaydedildi.") {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(""), 3000);
  }

  // ── Sidebar ──────────────────────────────────────────────────────
  const Sidebar = () => (
    <aside className="lg:w-60 shrink-0">
      <div className="bg-white rounded-xl border border-[#edeef3] p-5 mb-3">
        <div className="w-14 h-14 rounded-full bg-[#dae2ff] flex items-center justify-center mb-3 mx-auto">
          <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1" }}>person</span>
        </div>
        <p className="font-bold text-[#191c1e] text-center truncate" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px" }}>{user.name}</p>
        {user.email && <p className="text-[#737685] text-center truncate mt-0.5" style={{ fontSize: "12px" }}>{user.email}</p>}
        {user.isAnonymous && (
          <span className="block text-center mt-2 text-[#737685] bg-[#f0f1f5] rounded-full px-3 py-0.5" style={{ fontSize: "10px", fontWeight: 600 }}>
            Misafir Hesap
          </span>
        )}
      </div>

      <nav className="bg-white rounded-xl border border-[#edeef3] overflow-hidden">
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setSection(item.id)}
            className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors border-b border-[#f0f1f5] last:border-0 text-left"
            style={{
              background: section === item.id ? "#f0f4ff" : "white",
              color: section === item.id ? "#003d9b" : "#434654",
              fontWeight: section === item.id ? 700 : 500,
              fontSize: "13px",
              fontFamily: "'Inter'",
              borderLeft: section === item.id ? "3px solid #003d9b" : "3px solid transparent",
            }}>
            <span className="material-symbols-outlined shrink-0" style={{ fontSize: "18px", fontVariationSettings: section === item.id ? "'FILL' 1" : "'FILL' 0" }}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
        <button
          onClick={() => setLogoutOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-50 transition-colors text-left border-t border-[#f0f1f5]"
          style={{ fontSize: "13px", fontFamily: "'Inter'", fontWeight: 500 }}
        >
          <span className="material-symbols-outlined shrink-0" style={{ fontSize: "18px" }}>logout</span>
          Çıkış Yap
        </button>
      </nav>
    </aside>
  );

  // ── Reçetelerim ───────────────────────────────────────────────────
  const Prescriptions = () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", fontWeight: 700 }}>Reçetelerim</h2>
        {!showPrescForm && (
          <button onClick={() => setShowPrescForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-white hover:opacity-90 transition-all"
            style={{ background: "#003d9b", fontSize: "12px", fontFamily: "'Inter'" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
            Reçete Yükle
          </button>
        )}
      </div>

      {showPrescForm && (
        <PrescriptionForm
          onSubmit={(p) => { addPrescription(p); setShowPrescForm(false); showSaved("Reçete kaydedildi."); }}
          onCancel={() => setShowPrescForm(false)}
        />
      )}

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl px-5 py-4">
        <span className="material-symbols-outlined text-blue-600 shrink-0 mt-0.5" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>info</span>
        <p style={{ fontSize: "13px", color: "#1e40af", lineHeight: "20px" }}>
          Reçeteler maksimum <strong>6 ay</strong> sonrasına kadar kullanılabilmektedir. Lütfen reçetenizin geçerliliğini kontrol ediniz.
        </p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#edeef3]">
          <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "48px" }}>receipt_long</span>
          <p className="text-[#737685] mt-3" style={{ fontSize: "14px" }}>Henüz reçete yüklemediniz.</p>
          <button onClick={() => setShowPrescForm(true)} className="mt-4 px-6 py-2.5 rounded-xl font-bold text-white hover:opacity-90 transition-all" style={{ background: "#003d9b", fontSize: "13px" }}>
            İlk Reçetenizi Yükleyin
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {prescriptions.map((p) => {
            const expired = isExpired(p.expiryDate);
            const nearExp = isNearExpiry(p.expiryDate);
            return (
              <div key={p.id} className="bg-white rounded-xl border p-5 flex items-start gap-4"
                style={{ borderColor: expired ? "#fca5a5" : nearExp ? "#fcd34d" : "#edeef3" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: expired ? "#fee2e2" : nearExp ? "#fef3c7" : "#dae2ff" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px", color: expired ? "#dc2626" : nearExp ? "#b45309" : "#003d9b", fontVariationSettings: "'FILL' 1" }}>
                    {expired ? "warning" : "description"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-[#191c1e] truncate" style={{ fontSize: "14px" }}>{p.fileName}</p>
                    {(expired || nearExp) && (
                      <span className="px-2.5 py-0.5 rounded-full shrink-0 font-bold" style={{
                        fontSize: "10px",
                        color: expired ? "#dc2626" : "#b45309",
                        background: expired ? "#fee2e2" : "#fef3c7",
                      }}>
                        {expired ? "Süresi Doldu" : "Yakında Doluyor"}
                      </span>
                    )}
                  </div>
                  {(expired || nearExp) && (
                    <p className="mt-1.5 font-medium" style={{ fontSize: "11px", color: expired ? "#dc2626" : "#b45309" }}>
                      ⚠ {expired ? "Bu reçete geçerliliğini yitirmiştir. Yenilemeniz gerekmektedir." : "Süresi 30 gün içinde dolacak. Lütfen kontrol ediniz."}
                    </p>
                  )}
                </div>
                <button onClick={() => removePrescription(p.id)} className="text-[#737685] hover:text-red-500 transition-colors shrink-0" title="Sil">
                  <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── Siparişlerim ──────────────────────────────────────────────────
  const Orders = () => {
    const [reordered, setReordered] = useState<string | null>(null);

    function handleReorder(orderId: string) {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;
      order.items.forEach((item) => {
        const product = allProducts.find((p) => p.name === item.name);
        if (product) {
          for (let i = 0; i < item.qty; i++) {
            addItem({ id: product.id, name: product.name, brand: product.brand, price: product.price, imageUrl: product.imageUrl });
          }
        }
      });
      setReordered(orderId);
      setTimeout(() => setReordered(null), 2000);
    }

    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", fontWeight: 700 }}>Siparişlerim</h2>
        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-[#edeef3]">
            <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "48px" }}>shopping_bag</span>
            <p className="text-[#737685] mt-3" style={{ fontSize: "14px" }}>Henüz siparişiniz bulunmuyor.</p>
            <Link href="/urunler" className="mt-4 inline-block px-6 py-2.5 rounded-xl font-bold text-white hover:opacity-90" style={{ background: "#003d9b", fontSize: "13px" }}>
              Alışverişe Başla
            </Link>
          </div>
        ) : orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-[#edeef3] p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-[#191c1e]" style={{ fontSize: "14px" }}>#{order.id}</p>
                <p className="text-[#737685]" style={{ fontSize: "12px" }}>{order.date}</p>
              </div>
              <span className="px-3 py-1 rounded-full font-bold" style={{ fontSize: "11px", color: statusLabel[order.status].color, background: statusLabel[order.status].bg }}>
                {statusLabel[order.status].label}
              </span>
            </div>

            <div className="border-t border-[#f0f1f5] pt-3 flex flex-col gap-2">
              {order.items.map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <span className="text-[#434654]" style={{ fontSize: "13px" }}>{item.name} × {item.qty}</span>
                  <span className="font-semibold text-[#191c1e]" style={{ fontSize: "13px" }}>{item.price.toLocaleString("tr-TR")} ₺</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#f0f1f5] pt-3 mt-3 flex items-center justify-between gap-2 flex-wrap">
              <span className="font-bold text-[#003d9b]" style={{ fontSize: "16px", fontFamily: "'Plus Jakarta Sans'" }}>
                {order.total.toLocaleString("tr-TR")} ₺
              </span>
              <div className="flex items-center gap-2">
                {order.trackingNo && (
                  <Link
                    href={`/siparis-takip?no=${order.trackingNo}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition-all hover:bg-[#dae2ff]"
                    style={{ fontSize: "12px", fontFamily: "'Inter'", background: "#f0f4ff", color: "#003d9b" }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>local_shipping</span>
                    Kargo Takip
                  </Link>
                )}
                <button
                  onClick={() => handleReorder(order.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition-all active:scale-95"
                  style={{
                    fontSize: "12px",
                    fontFamily: "'Inter'",
                    background: reordered === order.id ? "#dcfce7" : "#f0f4ff",
                    color: reordered === order.id ? "#16a34a" : "#003d9b",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                    {reordered === order.id ? "check_circle" : "shopping_cart"}
                  </span>
                  {reordered === order.id ? "Sepete Eklendi!" : "Tekrarla"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ── Adreslerim ────────────────────────────────────────────────────
  const Addresses = () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", fontWeight: 700 }}>Adreslerim</h2>
        {!showAddrForm && (
          <button onClick={() => setShowAddrForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-white hover:opacity-90 transition-all"
            style={{ background: "#003d9b", fontSize: "12px", fontFamily: "'Inter'" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
            Yeni Adres
          </button>
        )}
      </div>

      {showAddrForm && (
        <AddressForm
          onSubmit={(a) => { addAddress(a); setShowAddrForm(false); showSaved("Adres kaydedildi."); }}
          onCancel={() => setShowAddrForm(false)}
        />
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#edeef3]">
          <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "48px" }}>location_off</span>
          <p className="text-[#737685] mt-3" style={{ fontSize: "14px" }}>Henüz kayıtlı adresiniz yok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-xl border p-5 relative"
              style={{ borderColor: addr.isDefault ? "#003d9b" : "#edeef3" }}>
              {addr.isDefault && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#dae2ff] text-[#003d9b] font-bold" style={{ fontSize: "10px" }}>
                  Varsayılan
                </span>
              )}
              <p className="font-bold text-[#191c1e] mb-1" style={{ fontSize: "14px" }}>{addr.title}</p>
              <p className="text-[#434654]" style={{ fontSize: "13px" }}>{addr.fullName} · {addr.phone}</p>
              <p className="text-[#737685] mt-1" style={{ fontSize: "13px" }}>{addr.fullAddress}, {addr.district} / {addr.city}</p>
              <div className="flex gap-3 mt-3">
                {!addr.isDefault && (
                  <button onClick={() => setDefaultAddress(addr.id)} className="text-[#003d9b] hover:underline font-semibold" style={{ fontSize: "12px" }}>
                    Varsayılan Yap
                  </button>
                )}
                <button onClick={() => removeAddress(addr.id)} className="text-red-500 hover:underline font-semibold ml-auto" style={{ fontSize: "12px" }}>
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Bildirim Tercihleri ───────────────────────────────────────────
  const EmailPrefs = () => (
    <div className="flex flex-col gap-4">
      <h2 className="text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", fontWeight: 700 }}>Bildirim Tercihleri</h2>
      <div className="bg-white rounded-xl border border-[#edeef3] divide-y divide-[#f0f1f5]">
        {([
          { key: "campaigns" as const, icon: "mail", label: "E-posta Bildirimleri", desc: "Kampanya, indirim, sipariş güncellemeleri ve bülten e-postaları" },
          { key: "smsNotifications" as const, icon: "sms", label: "SMS Bildirimleri", desc: "Kargo takibi ve sipariş güncellemelerini SMS ile alın" },
        ]).map(({ key, icon, label, desc }) => (
          <div key={key} className="flex items-center justify-between px-5 py-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#f0f4ff] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#003d9b]" style={{ fontSize: "20px" }}>{icon}</span>
              </div>
              <div>
                <p className="font-semibold text-[#191c1e]" style={{ fontSize: "14px" }}>{label}</p>
                <p className="text-[#737685]" style={{ fontSize: "12px" }}>{desc}</p>
              </div>
            </div>
            <button
              onClick={() => { updateEmailPreferences({ [key]: !emailPreferences[key] }); showSaved(); }}
              className="relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0 ml-4"
              style={{ background: emailPreferences[key] ? "#003d9b" : "#c3c6d6" }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200"
                style={{ left: emailPreferences[key] ? "calc(100% - 22px)" : "2px" }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Ayarlar ───────────────────────────────────────────────────────
  const Settings = () => {
    const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone });
    const [passForm, setPassForm] = useState({ current: "", next: "", confirm: "" });

    return (
      <div className="flex flex-col gap-5">
        <h2 className="text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", fontWeight: 700 }}>Hesap Ayarları</h2>

        <div className="bg-white rounded-xl border border-[#edeef3] p-5 flex flex-col gap-4">
          <h3 className="font-bold text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px" }}>Kişisel Bilgiler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              { label: "Ad Soyad", key: "name", type: "text", placeholder: "Adınız Soyadınız" },
              { label: "E-posta", key: "email", type: "email", placeholder: "eposta@ornek.com" },
              { label: "Telefon", key: "phone", type: "tel", placeholder: "05XX XXX XX XX" },
            ] as { label: string; key: keyof typeof form; type: string; placeholder: string }[]).map(({ label, key, type, placeholder }) => (
              <div key={String(key)} className="flex flex-col gap-1.5">
                <label className="text-[#434654] font-semibold" style={{ fontSize: "12px" }}>{label}</label>
                <input type={type}
                  className="bg-[#f8f9fb] border border-[#c3c6d6] rounded-xl px-4 py-2.5 outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/15 transition-all"
                  style={{ fontSize: "14px" }} placeholder={placeholder}
                  value={String(form[key])}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <button onClick={() => { updateUser(form); showSaved(); }}
            className="self-start px-6 py-2.5 rounded-xl font-bold text-white hover:opacity-90 transition-all"
            style={{ background: "#003d9b", fontSize: "13px", fontFamily: "'Inter'" }}>
            Kaydet
          </button>
        </div>

        {!user.isAnonymous && (
          <div className="bg-white rounded-xl border border-[#edeef3] p-5 flex flex-col gap-4">
            <h3 className="font-bold text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px" }}>Şifre Değiştir</h3>
            <div className="flex flex-col gap-3 max-w-sm">
              {([
                { label: "Mevcut Şifre", key: "current" },
                { label: "Yeni Şifre", key: "next" },
                { label: "Yeni Şifre Tekrar", key: "confirm" },
              ] as { label: string; key: keyof typeof passForm }[]).map(({ label, key }) => (
                <div key={String(key)} className="flex flex-col gap-1.5">
                  <label className="text-[#434654] font-semibold" style={{ fontSize: "12px" }}>{label}</label>
                  <input type="password"
                    className="bg-[#f8f9fb] border border-[#c3c6d6] rounded-xl px-4 py-2.5 outline-none focus:border-[#003d9b] transition-all"
                    style={{ fontSize: "14px" }}
                    value={passForm[key]}
                    onChange={(e) => setPassForm({ ...passForm, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <button onClick={() => showSaved("Şifre güncellendi.")}
              className="self-start px-6 py-2.5 rounded-xl font-bold text-white hover:opacity-90 transition-all"
              style={{ background: "#6a3600", fontSize: "13px", fontFamily: "'Inter'" }}>
              Şifreyi Güncelle
            </button>
          </div>
        )}

        {/* Hesabı Sil */}
        <div className="bg-white rounded-xl border border-red-100 p-5">
          {!deleteConfirm ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-red-600" style={{ fontSize: "14px" }}>Hesabı Sil</p>
                <p className="text-[#737685]" style={{ fontSize: "12px" }}>Hesabınız ve tüm verileriniz kalıcı olarak silinir.</p>
              </div>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="px-4 py-2 rounded-xl border border-red-300 text-red-500 hover:bg-red-50 transition-colors font-semibold"
                style={{ fontSize: "13px" }}
              >
                Hesabı Sil
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 shrink-0 mt-0.5" style={{ fontSize: "22px", fontVariationSettings: "'FILL' 1" }}>warning</span>
                <div>
                  <p className="font-bold text-red-600" style={{ fontSize: "14px" }}>Hesabınızı silmek istediğinizden emin misiniz?</p>
                  <p className="text-[#737685] mt-1" style={{ fontSize: "13px" }}>
                    Bu işlem geri alınamaz. Tüm reçeteleriniz, adresleriniz ve sipariş geçmişiniz kalıcı olarak silinecektir.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { logout(); router.push("/"); }}
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors active:scale-95"
                  style={{ fontSize: "13px" }}
                >
                  Evet, Hesabımı Sil
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#c3c6d6] text-[#434654] hover:bg-[#f3f4f6] transition-colors font-semibold"
                  style={{ fontSize: "13px" }}
                >
                  Vazgeç
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-[#737685] text-center" style={{ fontSize: "12px" }}>
          Üyelik tarihi: {user.memberSince} · ID: {user.id.slice(0, 8).toUpperCase()}
        </p>
      </div>
    );
  };

  // ── Favorilerim ───────────────────────────────────────────────────
  const allProducts = [...lenses, ...accessories];
  const favoriteProducts = allProducts.filter((p) => (favorites ?? []).includes(p.id));
  const { addItem } = useCart();

  const Favorites = () => {
    const [confirmId, setConfirmId] = useState<number | null>(null);

    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-[#191c1e]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", fontWeight: 700 }}>Favorilerim</h2>
        {favoriteProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-[#edeef3]">
            <span className="material-symbols-outlined text-[#c3c6d6]" style={{ fontSize: "48px" }}>favorite_border</span>
            <p className="font-bold text-[#191c1e] mt-3" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "16px" }}>Henüz favori ürün eklemediniz</p>
            <Link href="/urunler" className="mt-4 inline-block px-6 py-2.5 rounded-xl font-bold text-white hover:opacity-90" style={{ background: "#003d9b", fontSize: "13px" }}>
              Ürünlere Göz At
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {favoriteProducts.map((product) => {
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
              const confirming = confirmId === product.id;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border overflow-hidden flex flex-col hover:shadow-md transition-all"
                  style={{ borderColor: confirming ? "#fca5a5" : "#edeef3" }}
                >
                  <Link href={`/urun/${product.id}`} className="relative block bg-[#f8f9fb] p-6 flex items-center justify-center" style={{ height: "180px" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.imageUrl || "/placeholder-lens.jpg"} alt={product.name}
                      className="max-h-36 object-contain mix-blend-multiply" />
                    {discount > 0 && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#ffdcc3] text-[#2f1500] font-bold" style={{ fontSize: "10px" }}>
                        -%{discount}
                      </span>
                    )}
                  </Link>

                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <p className="text-[#737685] uppercase" style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em" }}>{product.brand}</p>
                    <Link href={`/urun/${product.id}`} className="font-bold text-[#191c1e] hover:text-[#003d9b] transition-colors line-clamp-2" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "14px", lineHeight: "20px" }}>
                      {product.name}
                    </Link>
                    <div className="flex items-baseline gap-2 mt-auto pt-2">
                      <span className="font-bold text-[#003d9b]" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "18px" }}>{product.price.toLocaleString("tr-TR")} ₺</span>
                      {product.originalPrice && (
                        <span className="text-[#737685] line-through" style={{ fontSize: "11px" }}>{product.originalPrice.toLocaleString("tr-TR")} ₺</span>
                      )}
                    </div>

                    {confirming ? (
                      /* Onay alanı */
                      <div className="mt-1 rounded-lg bg-red-50 border border-red-200 p-3 flex flex-col gap-2">
                        <p className="text-red-700 font-semibold text-center" style={{ fontSize: "12px" }}>
                          Favorilerden çıkarılsın mı?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { toggleFavorite(product.id); setConfirmId(null); }}
                            className="flex-1 py-1.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors active:scale-95"
                            style={{ fontSize: "12px" }}
                          >
                            Evet, Çıkar
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="flex-1 py-1.5 rounded-lg border border-[#c3c6d6] text-[#434654] font-semibold hover:bg-[#f3f4f6] transition-colors"
                            style={{ fontSize: "12px" }}
                          >
                            İptal
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Normal butonlar */
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => addItem({ id: product.id, name: product.name, brand: product.brand, price: product.price, imageUrl: product.imageUrl })}
                          className="flex-1 py-2 rounded-lg font-bold text-white flex items-center justify-center gap-1 bg-[#d97706] hover:bg-[#b45309] active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
                          style={{ fontSize: "12px" }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>add_shopping_cart</span>
                          Sepete Ekle
                        </button>
                        <button
                          onClick={() => setConfirmId(product.id)}
                          className="w-9 h-9 rounded-lg flex items-center justify-center border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                          title="Favorilerden Çıkar"
                        >
                          <span className="material-symbols-outlined text-red-500" style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}>favorite</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const sections: Record<Section, React.ReactNode> = {
    favorites: <Favorites />,
    prescriptions: <Prescriptions />,
    orders: <Orders />,
    addresses: <Addresses />,
    emails: <EmailPrefs />,
    settings: <Settings />,
  };

  return (
    <div className="pt-[72px] pb-16 px-4 md:px-8 max-w-[1280px] mx-auto">
      <div className="mt-8 flex flex-col lg:flex-row gap-6">
        <Sidebar />
        <main className="flex-1 min-w-0">
          {savedMsg && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 animate-fade-slide">
              <span className="material-symbols-outlined text-green-600" style={{ fontSize: "18px", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <p className="text-green-700 font-semibold" style={{ fontSize: "13px" }}>{savedMsg}</p>
            </div>
          )}
          {sections[section]}
        </main>
      </div>
      <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </div>
  );
}

export default function HesapPage() {
  return (
    <Suspense fallback={<div className="pt-[72px] min-h-screen flex items-center justify-center"><p className="text-[#737685]">Yükleniyor...</p></div>}>
      <HesapContent />
    </Suspense>
  );
}
