"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
// 🔒 REÇETELİ LENS DEVRE DIŞI — isExpired ve isNearExpiry kaldırıldı
// import { useAuth, Address, isExpired, isNearExpiry } from "@/contexts/AuthContext";
import { useAuth, Address } from "@/contexts/AuthContext";
import { Product } from "@/lib/data";
import { useCart } from "@/contexts/CartContext";
import LogoutModal from "@/components/LogoutModal";

// 🔒 REÇETELİ LENS DEVRE DIŞI — "prescriptions" Section tipi kaldırıldı
// type Section = "favorites" | "prescriptions" | "orders" | "addresses" | "emails" | "settings";
type Section = "favorites" | "orders" | "addresses" | "emails" | "settings";

const statusLabel: Record<string, { label: string; color: string; bg: string }> = {
  yeni:      { label: "Yeni", color: "#1d4ed8", bg: "#dbeafe" },
  isleniyor: { label: "Hazırlanıyor", color: "#b45309", bg: "#fef3c7" },
  kargoda:   { label: "Kargoda", color: "#003d9b", bg: "#dae2ff" },
  teslim:    { label: "Teslim Edildi", color: "#16a34a", bg: "#dcfce7" },
  iptal:     { label: "İptal", color: "#dc2626", bg: "#fee2e2" },
};

const navItems: { id: Section; icon: string; label: string }[] = [
  { id: "favorites", icon: "favorite", label: "Favorilerim" },
  // 🔒 REÇETELİ LENS DEVRE DIŞI — { id: "prescriptions", icon: "receipt_long", label: "Reçetelerim" },
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
    <div className="rounded-xl p-5 flex flex-col gap-4 border" style={{ background: "var(--ds-surface-2)", borderColor: "var(--ds-border-subtle)" }}>
      <h3 className="font-bold" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px", color: "var(--ds-text-1)" }}>
        Yeni Reçete Yükle
      </h3>

      <label
        className="cursor-pointer group flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl py-10 transition-all"
        style={{ borderColor: fileName ? "var(--ds-primary)" : "var(--ds-border)" }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--ds-primary)")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = fileName ? "var(--ds-primary)" : "var(--ds-border)")}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors" style={{ background: "var(--ds-primary-soft)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "28px", color: "var(--ds-primary)" }}>
            {fileName ? "description" : "cloud_upload"}
          </span>
        </div>
        <div className="text-center">
          <p className="font-semibold" style={{ fontSize: "14px", color: "var(--ds-text-1)" }}>
            {fileName || "Reçete dosyasını seçin"}
          </p>
          <p className="mt-0.5" style={{ fontSize: "12px", color: "var(--ds-text-3)" }}>PDF, JPG veya PNG · maks. 5 MB</p>
        </div>
        {!fileName && (
          <span className="px-5 py-2 rounded-full font-bold text-white" style={{ fontSize: "12px", background: "var(--ds-primary)" }}>
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
          style={{ background: "var(--ds-primary)", fontSize: "13px", fontFamily: "'Inter'" }}
        >
          Kaydet
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl font-semibold transition-colors border"
          style={{ fontSize: "13px", borderColor: "var(--ds-border)", color: "var(--ds-text-2)", background: "transparent" }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--ds-surface-3)"}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
        >
          İptal
        </button>
      </div>
    </div>
  );
}

// ── Adres Formu ──────────────────────────────────────────────────────
function AddressForm({ onSubmit, onCancel }: {
  onSubmit: (a: Omit<Address, "id">) => Promise<{ error?: string }>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ title: "", full_name: "", phone: "", city: "", district: "", postal_code: "", full_address: "", is_default: false });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const canSubmit = !!(form.title && form.full_name && form.city && form.district && form.full_address);

  async function handleSave() {
    if (!canSubmit) {
      setFormError("Lütfen zorunlu alanları doldurun: başlık, ad soyad, şehir, ilçe, tam adres.");
      return;
    }
    setSaving(true);
    setFormError("");
    const result = await onSubmit(form);
    setSaving(false);
    if (result.error) setFormError(result.error);
  }

  return (
    <div className="rounded-xl p-5 flex flex-col gap-3 border" style={{ background: "var(--ds-surface-2)", borderColor: "var(--ds-border-subtle)" }}>
      <h3 className="font-bold" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px", color: "var(--ds-text-1)" }}>Yeni Adres Ekle</h3>
      <div className="grid grid-cols-2 gap-3">
        {([
          { label: "Adres Başlığı *", key: "title", placeholder: "Ev, İş..." },
          { label: "Ad Soyad *", key: "full_name", placeholder: "Adınız Soyadınız" },
          { label: "Şehir *", key: "city", placeholder: "İstanbul" },
          { label: "İlçe *", key: "district", placeholder: "Kadıköy" },
          { label: "Posta Kodu", key: "postal_code", placeholder: "34000" },
        ] as { label: string; key: keyof typeof form; placeholder: string }[]).map(({ label, key, placeholder }) => (
          <div key={String(key)} className="flex flex-col gap-1.5">
            <label className="font-semibold" style={{ fontSize: "11px", color: "var(--ds-text-2)" }}>{label}</label>
            <input
              className="rounded-lg px-3 py-2 outline-none transition-colors"
              style={{
                fontSize: "13px",
                background: "var(--ds-surface)",
                border: "1px solid var(--ds-border)",
                color: "var(--ds-text-1)",
              }}
              placeholder={placeholder}
              value={String(form[key])} onChange={f(key)}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-semibold" style={{ fontSize: "11px", color: "var(--ds-text-2)" }}>Tam Adres *</label>
        <input
          className="rounded-lg px-3 py-2 outline-none transition-colors"
          style={{
            fontSize: "13px",
            background: "var(--ds-surface)",
            border: "1px solid var(--ds-border)",
            color: "var(--ds-text-1)",
          }}
          placeholder="Mahalle, cadde, apartman, daire..."
          value={form.full_address} onChange={(e) => setForm({ ...form, full_address: e.target.value })} />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="w-4 h-4 accent-[#003d9b]"
          checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} />
        <span style={{ fontSize: "13px", color: "var(--ds-text-2)" }}>Varsayılan adres olarak ayarla</span>
      </label>
      {formError && (
        <p className="text-red-500 font-semibold" style={{ fontSize: "12px" }}>{formError}</p>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 py-2.5 rounded-xl font-bold text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "var(--ds-primary)", fontSize: "13px", fontFamily: "'Inter'" }}
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl font-semibold transition-colors border"
          style={{ fontSize: "13px", borderColor: "var(--ds-border)", color: "var(--ds-text-2)", background: "transparent" }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--ds-surface-3)"}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
        >
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
    user, loaded, orders, addresses, favorites,
    // 🔒 REÇETELİ LENS DEVRE DIŞI — prescriptions, addPrescription, removePrescription kaldırıldı
    // prescriptions, addPrescription, removePrescription,
    logout, updateUser,
    addAddress, removeAddress, setDefaultAddress, toggleFavorite,
  } = useAuth();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  useEffect(() => {
    if (favorites.length === 0) { setFavoriteProducts([]); return; }
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        const all: Product[] = d.products || [];
        setFavoriteProducts(all.filter((p) => favorites.includes(p.id)));
      })
      .catch(console.error);
  }, [favorites]);

  // 🔒 REÇETELİ LENS DEVRE DIŞI — "prescriptions" validSections'dan kaldırıldı
  const validSections: Section[] = ["favorites", "orders", "addresses", "emails", "settings"];
  const paramSection = searchParams.get("s") as Section | null;
  const [section, setSection] = useState<Section>(
    paramSection && validSections.includes(paramSection) ? paramSection : "favorites"
  );
  // 🔒 REÇETELİ LENS DEVRE DIŞI — const [showPrescForm, setShowPrescForm] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (loaded && !user) router.replace("/hesap/giris?mode=login");
  }, [loaded, user, router]);

  if (!loaded) return (
    <div className="pt-[72px] min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--ds-primary)", borderTopColor: "transparent" }} />
        <p style={{ fontSize: "13px", color: "var(--ds-text-3)" }}>Yükleniyor...</p>
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
      <div className="rounded-xl p-5 mb-3 border" style={{ background: "var(--ds-surface)", borderColor: "var(--ds-border-subtle)" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3 mx-auto" style={{ background: "var(--ds-primary-soft)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "28px", fontVariationSettings: "'FILL' 1", color: "var(--ds-primary)" }}>person</span>
        </div>
        <p className="font-bold text-center truncate" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px", color: "var(--ds-text-1)" }}>{user.name}</p>
        {user.email && <p className="text-center truncate mt-0.5" style={{ fontSize: "12px", color: "var(--ds-text-3)" }}>{user.email}</p>}
        {user.is_anonymous && (
          <span className="block text-center mt-2 rounded-full px-3 py-0.5" style={{ fontSize: "10px", fontWeight: 600, color: "var(--ds-text-3)", background: "var(--ds-surface-3)" }}>
            Misafir Hesap
          </span>
        )}
      </div>

      <nav className="rounded-xl overflow-hidden border" style={{ background: "var(--ds-surface)", borderColor: "var(--ds-border-subtle)" }}>
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setSection(item.id)}
            className="w-full flex items-center gap-3 px-4 py-3.5 transition-colors border-b last:border-0 text-left"
            style={{
              background: section === item.id ? "var(--ds-primary-hover)" : "transparent",
              color: section === item.id ? "var(--ds-primary)" : "var(--ds-text-2)",
              fontWeight: section === item.id ? 700 : 500,
              fontSize: "13px",
              fontFamily: "'Inter'",
              borderLeft: section === item.id ? "3px solid var(--ds-primary)" : "3px solid transparent",
              borderBottomColor: "var(--ds-border-subtle)",
            }}>
            <span className="material-symbols-outlined shrink-0" style={{ fontSize: "18px", fontVariationSettings: section === item.id ? "'FILL' 1" : "'FILL' 0" }}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
        <button
          onClick={() => setLogoutOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-red-500 hover:bg-red-50 transition-colors text-left border-t"
          style={{ fontSize: "13px", fontFamily: "'Inter'", fontWeight: 500, borderTopColor: "var(--ds-border-subtle)" }}
        >
          <span className="material-symbols-outlined shrink-0" style={{ fontSize: "18px" }}>logout</span>
          Çıkış Yap
        </button>
      </nav>
    </aside>
  );

  // ═══════════════════════════════════════════════════════════════════════
  // 🔒 REÇETELİ LENS DEVRE DIŞI — Reçetelerim bileşeni tümüyle yorum satırında
  // Yeniden etkinleştirmek için aşağıdaki yorum bloğunu açın ve Section tipine
  // "prescriptions" ekleyin, navItems'e geri ekleyin, sections'a geri ekleyin.
  // ═══════════════════════════════════════════════════════════════════════
  /* 🔒 PRESCRIPTIONS BİLEŞENİ — DEVRE DIŞI
  const Prescriptions = () => (
    <div className="flex flex-col gap-4">
      ... (tüm reçete yükleme ve listeleme UI)
    </div>
  );
  */ // 🔒 PRESCRIPTIONS BİLEŞENİ SONU

  // ── Siparişlerim ──────────────────────────────────────────────────
  const Orders = () => {
    const [reordered, setReordered] = useState<number | null>(null);

    function handleReorder(orderId: number) {
      const order = orders.find((o) => o.id === orderId);
      if (!order || !order.items) return;
      order.items.forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
          addItem({ id: 0, name: item.product_name, brand: item.product_brand ?? "", price: item.unit_price, imageUrl: undefined });
        }
      });
      setReordered(orderId);
      setTimeout(() => setReordered(null), 2000);
    }

    return (
      <div className="flex flex-col gap-4">
        <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", fontWeight: 700, color: "var(--ds-text-1)" }}>Siparişlerim</h2>
        {orders.length === 0 ? (
          <div className="text-center py-16 rounded-xl border" style={{ background: "var(--ds-surface)", borderColor: "var(--ds-border-subtle)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--ds-border)" }}>shopping_bag</span>
            <p className="mt-3" style={{ fontSize: "14px", color: "var(--ds-text-3)" }}>Henüz siparişiniz bulunmuyor.</p>
            <Link href="/urunler" className="mt-4 inline-block px-6 py-2.5 rounded-xl font-bold text-white hover:opacity-90" style={{ background: "var(--ds-primary)", fontSize: "13px" }}>
              Alışverişe Başla
            </Link>
          </div>
        ) : orders.map((order) => (
          <div key={order.id} className="rounded-xl p-5 border" style={{ background: "var(--ds-surface)", borderColor: "var(--ds-border-subtle)" }}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold" style={{ fontSize: "14px", color: "var(--ds-text-1)" }}>#{order.order_no}</p>
                <p style={{ fontSize: "12px", color: "var(--ds-text-3)" }}>{new Date(order.created_at).toLocaleDateString("tr-TR")}</p>
              </div>
              <span className="px-3 py-1 rounded-full font-bold" style={{ fontSize: "11px", color: statusLabel[order.status]?.color, background: statusLabel[order.status]?.bg }}>
                {statusLabel[order.status]?.label ?? order.status}
              </span>
            </div>

            <div className="border-t pt-3 flex flex-col gap-2" style={{ borderColor: "var(--ds-border-subtle)" }}>
              {(order.items ?? []).map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span style={{ fontSize: "13px", color: "var(--ds-text-2)" }}>{item.product_name} × {item.quantity}</span>
                  <span className="font-semibold" style={{ fontSize: "13px", color: "var(--ds-text-1)" }}>{item.unit_price.toLocaleString("tr-TR")} ₺</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 mt-3 flex items-center justify-between gap-2 flex-wrap" style={{ borderColor: "var(--ds-border-subtle)" }}>
              <span className="font-bold" style={{ fontSize: "16px", fontFamily: "'Plus Jakarta Sans'", color: "var(--ds-primary)" }}>
                {order.total_amount.toLocaleString("tr-TR")} ₺
              </span>
              <div className="flex items-center gap-2">
                {order.tracking_code && (
                  <Link
                    href={`/siparis-takip?no=${order.tracking_code}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition-all"
                    style={{ fontSize: "12px", fontFamily: "'Inter'", background: "var(--ds-primary-soft)", color: "var(--ds-primary)" }}
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
                    background: reordered === order.id ? "#dcfce7" : "var(--ds-primary-soft)",
                    color: reordered === order.id ? "#16a34a" : "var(--ds-primary)",
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
        <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", fontWeight: 700, color: "var(--ds-text-1)" }}>Adreslerim</h2>
        {!showAddrForm && (
          <button onClick={() => setShowAddrForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-white hover:opacity-90 transition-all"
            style={{ background: "var(--ds-primary)", fontSize: "12px", fontFamily: "'Inter'" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
            Yeni Adres
          </button>
        )}
      </div>

      {showAddrForm && (
        <AddressForm
          onSubmit={async (a) => {
            const result = await addAddress(a);
            if (!result.error) { setShowAddrForm(false); showSaved("Adres kaydedildi."); }
            return result;
          }}
          onCancel={() => setShowAddrForm(false)}
        />
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-16 rounded-xl border" style={{ background: "var(--ds-surface)", borderColor: "var(--ds-border-subtle)" }}>
          <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--ds-border)" }}>location_off</span>
          <p className="mt-3" style={{ fontSize: "14px", color: "var(--ds-text-3)" }}>Henüz kayıtlı adresiniz yok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="rounded-xl p-5 relative border"
              style={{ background: "var(--ds-surface)", borderColor: addr.is_default ? "var(--ds-primary)" : "var(--ds-border-subtle)" }}>
              {addr.is_default && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full font-bold" style={{ fontSize: "10px", background: "var(--ds-primary-soft)", color: "var(--ds-primary)" }}>
                  Varsayılan
                </span>
              )}
              <p className="font-bold mb-1" style={{ fontSize: "14px", color: "var(--ds-text-1)" }}>{addr.title}</p>
              <p style={{ fontSize: "13px", color: "var(--ds-text-2)" }}>{addr.full_name} · {addr.phone}</p>
              <p className="mt-1" style={{ fontSize: "13px", color: "var(--ds-text-3)" }}>{addr.full_address}, {addr.district} / {addr.city}</p>
              <div className="flex gap-3 mt-3">
                {!addr.is_default && (
                  <button onClick={() => setDefaultAddress(addr.id)} className="hover:underline font-semibold" style={{ fontSize: "12px", color: "var(--ds-primary)" }}>
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
      <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", fontWeight: 700, color: "var(--ds-text-1)" }}>Bildirim Tercihleri</h2>
      <div className="rounded-xl border divide-y" style={{ background: "var(--ds-surface)", borderColor: "var(--ds-border-subtle)", divideColor: "var(--ds-border-subtle)" }}>
        {([
          { key: "notif_email" as const, icon: "mail", label: "E-posta Bildirimleri", desc: "Kampanya, indirim, sipariş güncellemeleri ve bülten e-postaları" },
          { key: "notif_sms" as const, icon: "sms", label: "SMS Bildirimleri", desc: "Kargo takibi ve sipariş güncellemelerini SMS ile alın" },
        ]).map(({ key, icon, label, desc }) => (
          <div key={key} className="flex items-center justify-between px-5 py-5" style={{ borderBottomColor: "var(--ds-border-subtle)" }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--ds-primary-soft)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "var(--ds-primary)" }}>{icon}</span>
              </div>
              <div>
                <p className="font-semibold" style={{ fontSize: "14px", color: "var(--ds-text-1)" }}>{label}</p>
                <p style={{ fontSize: "12px", color: "var(--ds-text-3)" }}>{desc}</p>
              </div>
            </div>
            <button
              onClick={() => { updateUser({ [key]: !user[key] }); showSaved(); }}
              className="relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0 ml-4"
              style={{ background: user[key] ? "var(--ds-primary)" : "var(--ds-border)" }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200"
                style={{ left: user[key] ? "calc(100% - 22px)" : "2px" }}
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
        <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", fontWeight: 700, color: "var(--ds-text-1)" }}>Hesap Ayarları</h2>

        <div className="rounded-xl p-5 flex flex-col gap-4 border" style={{ background: "var(--ds-surface)", borderColor: "var(--ds-border-subtle)" }}>
          <h3 className="font-bold" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px", color: "var(--ds-text-1)" }}>Kişisel Bilgiler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              { label: "Ad Soyad", key: "name", type: "text", placeholder: "Adınız Soyadınız" },
              { label: "E-posta", key: "email", type: "email", placeholder: "eposta@ornek.com" },
              { label: "Telefon", key: "phone", type: "tel", placeholder: "05XX XXX XX XX" },
            ] as { label: string; key: keyof typeof form; type: string; placeholder: string }[]).map(({ label, key, type, placeholder }) => (
              <div key={String(key)} className="flex flex-col gap-1.5">
                <label className="font-semibold" style={{ fontSize: "12px", color: "var(--ds-text-2)" }}>{label}</label>
                <input type={type}
                  className="rounded-xl px-4 py-2.5 outline-none transition-all"
                  style={{
                    fontSize: "14px",
                    background: "var(--ds-surface-2)",
                    border: "1px solid var(--ds-border)",
                    color: "var(--ds-text-1)",
                  }}
                  placeholder={placeholder}
                  value={String(form[key])}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <button onClick={() => { updateUser(form); showSaved(); }}
            className="self-start px-6 py-2.5 rounded-xl font-bold text-white hover:opacity-90 transition-all"
            style={{ background: "var(--ds-primary)", fontSize: "13px", fontFamily: "'Inter'" }}>
            Kaydet
          </button>
        </div>

        {!user.is_anonymous && (
          <div className="rounded-xl p-5 flex flex-col gap-4 border" style={{ background: "var(--ds-surface)", borderColor: "var(--ds-border-subtle)" }}>
            <h3 className="font-bold" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px", color: "var(--ds-text-1)" }}>Şifre Değiştir</h3>
            <div className="flex flex-col gap-3 max-w-sm">
              {([
                { label: "Mevcut Şifre", key: "current" },
                { label: "Yeni Şifre", key: "next" },
                { label: "Yeni Şifre Tekrar", key: "confirm" },
              ] as { label: string; key: keyof typeof passForm }[]).map(({ label, key }) => (
                <div key={String(key)} className="flex flex-col gap-1.5">
                  <label className="font-semibold" style={{ fontSize: "12px", color: "var(--ds-text-2)" }}>{label}</label>
                  <input type="password"
                    className="rounded-xl px-4 py-2.5 outline-none transition-all"
                    style={{
                      fontSize: "14px",
                      background: "var(--ds-surface-2)",
                      border: "1px solid var(--ds-border)",
                      color: "var(--ds-text-1)",
                    }}
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
        <div className="rounded-xl p-5 border border-red-100" style={{ background: "var(--ds-surface)" }}>
          {!deleteConfirm ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-red-600" style={{ fontSize: "14px" }}>Hesabı Sil</p>
                <p style={{ fontSize: "12px", color: "var(--ds-text-3)" }}>Hesabınız ve tüm verileriniz kalıcı olarak silinir.</p>
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
                  <p className="mt-1" style={{ fontSize: "13px", color: "var(--ds-text-3)" }}>
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
                  className="flex-1 py-2.5 rounded-xl font-semibold transition-colors border"
                  style={{ fontSize: "13px", borderColor: "var(--ds-border)", color: "var(--ds-text-2)", background: "transparent" }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "var(--ds-surface-2)"}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
                >
                  Vazgeç
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center" style={{ fontSize: "12px", color: "var(--ds-text-3)" }}>
          Üyelik tarihi: {new Date(user.member_since).toLocaleDateString("tr-TR")} · ID: #{user.id}
        </p>
      </div>
    );
  };

  // ── Favorilerim ───────────────────────────────────────────────────
  const { addItem } = useCart();

  const Favorites = () => {
    const [confirmId, setConfirmId] = useState<number | null>(null);

    return (
      <div className="flex flex-col gap-4">
        <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", fontWeight: 700, color: "var(--ds-text-1)" }}>Favorilerim</h2>
        {favoriteProducts.length === 0 ? (
          <div className="text-center py-16 rounded-xl border" style={{ background: "var(--ds-surface)", borderColor: "var(--ds-border-subtle)" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--ds-border)" }}>favorite_border</span>
            <p className="font-bold mt-3" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "16px", color: "var(--ds-text-1)" }}>Henüz favori ürün eklemediniz</p>
            <Link href="/urunler" className="mt-4 inline-block px-6 py-2.5 rounded-xl font-bold text-white hover:opacity-90" style={{ background: "var(--ds-primary)", fontSize: "13px" }}>
              Ürünlere Göz At
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {favoriteProducts.map((product) => {
              const discount = product.original_price
                ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;
              const confirming = confirmId === product.id;

              return (
                <div
                  key={product.id}
                  className="rounded-xl overflow-hidden flex flex-col hover:shadow-md transition-all border"
                  style={{ background: "var(--ds-surface)", borderColor: confirming ? "#fca5a5" : "var(--ds-border-subtle)" }}
                >
                  <Link href={`/urun/${product.id}`} className="relative block p-6 flex items-center justify-center" style={{ height: "180px", background: "var(--ds-surface-2)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image_url || "/placeholder-lens.jpg"} alt={product.name}
                      className="max-h-36 object-contain mix-blend-multiply" />
                    {discount > 0 && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#ffdcc3] text-[#2f1500] font-bold" style={{ fontSize: "10px" }}>
                        -%{discount}
                      </span>
                    )}
                  </Link>

                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <p className="uppercase" style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", color: "var(--ds-text-3)" }}>{product.brand}</p>
                    <Link href={`/urun/${product.id}`} className="font-bold hover:text-[color:var(--ds-primary)] transition-colors line-clamp-2" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "14px", lineHeight: "20px", color: "var(--ds-text-1)" }}>
                      {product.name}
                    </Link>
                    <div className="flex items-baseline gap-2 mt-auto pt-2">
                      <span className="font-bold" style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "18px", color: "var(--ds-primary)" }}>{product.price.toLocaleString("tr-TR")} ₺</span>
                      {product.original_price && (
                        <span className="line-through" style={{ fontSize: "11px", color: "var(--ds-text-3)" }}>{product.original_price.toLocaleString("tr-TR")} ₺</span>
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
                            className="flex-1 py-1.5 rounded-lg font-semibold transition-colors border"
                            style={{ fontSize: "12px", borderColor: "var(--ds-border)", color: "var(--ds-text-2)", background: "transparent" }}
                          >
                            İptal
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Normal butonlar */
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => addItem({ id: product.id, name: product.name, brand: product.brand, price: product.price, imageUrl: product.image_url })}
                          className="flex-1 py-2 rounded-lg font-bold text-white flex items-center justify-center gap-1 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
                          style={{ fontSize: "12px", background: "#d97706" }}
                          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = "#b45309"}
                          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = "#d97706"}
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
    // 🔒 REÇETELİ LENS DEVRE DIŞI — prescriptions: <Prescriptions />,
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
    <Suspense fallback={<div className="pt-[72px] min-h-screen flex items-center justify-center"><p style={{ color: "var(--ds-text-3)" }}>Yükleniyor...</p></div>}>
      <HesapContent />
    </Suspense>
  );
}
