"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Order } from "@/lib/adminData";

const navItems = [
  { href: "/admin",            icon: "dashboard",     label: "Genel Bakış" },
  { href: "/admin/urunler",    icon: "inventory_2",   label: "Ürünler" },
  { href: "/admin/banner",     icon: "image",         label: "Banner" },
  { href: "/admin/populer",    icon: "trending_up",   label: "Popüler" },
  { href: "/admin/siparisler", icon: "shopping_bag",  label: "Siparişler" },
  { href: "/admin/destek",     icon: "support_agent", label: "Destek" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();

  const [ready, setReady]               = useState(false);
  const [collapsed, setCollapsed]       = useState(false);
  const [isMobile, setIsMobile]         = useState(false);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [newOrders, setNewOrders]       = useState(2);
  const [openTickets]                   = useState(4);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [readIds, setReadIds]           = useState<number[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders?status=yeni")
      .then(r => r.json())
      .then(d => setRecentOrders((d.orders || []).slice(0, 5)))
      .catch(console.error);
  }, []);

  /* ── Mobile detection ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Auth guard ── */
  useEffect(() => {
    if (pathname === "/admin/giris") { setReady(true); return; }
    const ok = localStorage.getItem("hl_admin_auth") === "1";
    if (!ok) { router.replace("/admin/giris"); } else { setReady(true); }
  }, [pathname, router]);

  /* ── Close drawer on route change ── */
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  /* ── Yeni sipariş simülasyonu ── */
  useEffect(() => {
    const t = setTimeout(() => {
      // Yeni siparişleri API'dan çek
    fetch("/api/admin/orders?status=yeni")
      .then(r => r.json())
      .then(d => setRecentOrders((d.orders || []).slice(0, 5)))
      .catch(console.error);
      setNewOrders(n => n + 1);
    }, 12000);
    return () => clearTimeout(t);
  }, []);

  const markAllRead = () => {
    setReadIds(recentOrders.map(o => o.id));
    setNewOrders(0);
    setNotifOpen(false);
  };

  const unreadCount = recentOrders.filter(o => !readIds.includes(o.id as number)).length;

  const handleLogout = () => {
    localStorage.removeItem("hl_admin_auth");
    router.replace("/admin/giris");
  };

  const currentLabel = navItems.find(n =>
    n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)
  )?.label ?? "Yönetici Paneli";

  if (!ready) return null;
  if (pathname === "/admin/giris") return <>{children}</>;

  /* ══════════════════════════════════════
     MOBILE LAYOUT
  ══════════════════════════════════════ */
  if (isMobile) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", background: "#f0f2f5", fontFamily: "'Inter', sans-serif" }}>

        {/* Mobile topbar */}
        <header style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0 16px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={() => setDrawerOpen(true)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#374151", display: "flex", padding: "6px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>menu</span>
            </button>
            <div>
              <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "15px", fontWeight: 800, color: "#111827", lineHeight: 1 }}>Hepsilens</p>
              <p style={{ fontSize: "10px", color: "#003d9b", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>{currentLabel}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {/* Notification */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setNotifOpen(o => !o)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280", display: "flex", padding: "8px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "22px", fontVariationSettings: unreadCount > 0 ? "'FILL' 1" : "'FILL' 0", color: unreadCount > 0 ? "#003d9b" : "#6b7280" }}>notifications</span>
              </button>
              {unreadCount > 0 && (
                <span style={{ position: "absolute", top: "4px", right: "4px", background: "#dc2626", color: "white", borderRadius: "999px", fontSize: "9px", fontWeight: 800, padding: "1px 4px" }}>{unreadCount}</span>
              )}
              {notifOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", width: "min(320px, calc(100vw - 24px))", background: "white", borderRadius: "14px", border: "1px solid #e5e7eb", boxShadow: "0 12px 40px rgba(0,0,0,0.15)", overflow: "hidden", zIndex: 999 }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>Bildirimler</p>
                    {unreadCount > 0 && <button onClick={markAllRead} style={{ fontSize: "11px", color: "#003d9b", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600 }}>Tümünü oku</button>}
                  </div>
                  <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                    {recentOrders.map(o => {
                      const isRead = readIds.includes(o.id);
                      return (
                        <Link key={o.id} href="/admin/siparisler" onClick={() => { setReadIds(p => [...p, o.id]); setNotifOpen(false); }} style={{ display: "flex", gap: "10px", padding: "12px 16px", textDecoration: "none", background: isRead ? "white" : "#f0f9ff", borderBottom: "1px solid #f9fafb" }}>
                          <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: isRead ? "#f3f4f6" : "#dae2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "16px", color: isRead ? "#9ca3af" : "#003d9b", fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>{o.order_no}</p>
                            <p style={{ fontSize: "11px", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.customer_name} · ₺{o.total_amount.toLocaleString("tr-TR")}</p>
                          </div>
                          {!isRead && <div style={{ width: "8px", height: "8px", borderRadius: "999px", background: "#003d9b", marginTop: "4px", flexShrink: 0 }} />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {/* Avatar */}
            <div style={{ width: "32px", height: "32px", borderRadius: "999px", background: "#003d9b", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "white", fontVariationSettings: "'FILL' 1" }}>person</span>
            </div>
          </div>
        </header>

        {/* Drawer backdrop */}
        {drawerOpen && (
          <div onClick={() => setDrawerOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 400 }} />
        )}

        {/* Drawer */}
        <aside style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: "280px", background: "#12151a", zIndex: 500, transform: drawerOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.25s ease", display: "flex", flexDirection: "column" }}>
          {/* Drawer header */}
          <div style={{ padding: "20px 16px", borderBottom: "1px solid #2a2d36", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "18px", fontWeight: 800, color: "white" }}>Hepsilens</p>
              <p style={{ fontSize: "10px", color: "#50dcff", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Yönetici Paneli</p>
            </div>
            <button onClick={() => setDrawerOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#737685", display: "flex" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>close</span>
            </button>
          </div>
          {/* Nav */}
          <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: "2px" }}>
            {navItems.map(item => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              const badge = item.href === "/admin/siparisler" ? newOrders : item.href === "/admin/destek" ? openTickets : 0;
              return (
                <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", background: active ? "#003d9b" : "transparent", color: active ? "white" : "#9ca3af", textDecoration: "none", fontSize: "14px", fontWeight: active ? 700 : 500 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "20px", fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {badge > 0 && <span style={{ background: "#dc2626", color: "white", borderRadius: "999px", fontSize: "10px", fontWeight: 800, padding: "1px 6px" }}>{badge}</span>}
                </Link>
              );
            })}
          </nav>
          {/* Drawer footer */}
          <div style={{ padding: "12px 8px", borderTop: "1px solid #2a2d36", display: "flex", flexDirection: "column", gap: "2px" }}>
            <Link href="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "#6b7280", textDecoration: "none", fontSize: "14px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>open_in_new</span>
              <span>Siteyi Görüntüle</span>
            </Link>
            <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", color: "#ef4444", background: "transparent", border: "none", cursor: "pointer", fontSize: "14px", width: "100%" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>logout</span>
              <span>Çıkış Yap</span>
            </button>
          </div>
        </aside>

        {/* Content */}
        <main style={{ flex: 1, overflow: "auto", padding: "16px", paddingBottom: "76px" }}>
          {children}
        </main>

        {/* Bottom nav */}
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "60px", background: "#12151a", display: "flex", alignItems: "stretch", borderTop: "1px solid #2a2d36", zIndex: 300 }}>
          {navItems.map(item => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const badge = item.href === "/admin/siparisler" ? newOrders : item.href === "/admin/destek" ? openTickets : 0;
            return (
              <Link key={item.href} href={item.href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", color: active ? "#50dcff" : "#5a5f6e", textDecoration: "none", position: "relative", paddingBottom: "2px" }}>
                {badge > 0 && !active && (
                  <span style={{ position: "absolute", top: "8px", right: "calc(50% - 14px)", background: "#dc2626", borderRadius: "999px", width: "7px", height: "7px" }} />
                )}
                <span className="material-symbols-outlined" style={{ fontSize: "22px", fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                <span style={{ fontSize: "9px", fontWeight: active ? 700 : 500, letterSpacing: "0.02em" }}>{item.label}</span>
                {active && <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: "2px", background: "#50dcff", borderRadius: "999px" }} />}
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  /* ══════════════════════════════════════
     DESKTOP LAYOUT
  ══════════════════════════════════════ */
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", background: "#f0f2f5", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>

      {/* Sidebar */}
      <aside style={{ width: collapsed ? "64px" : "240px", background: "#12151a", display: "flex", flexDirection: "column", transition: "width 0.2s ease", flexShrink: 0, overflow: "hidden" }}>
        <div style={{ padding: collapsed ? "20px 0" : "20px", borderBottom: "1px solid #2a2d36", display: "flex", alignItems: "center", gap: "10px", justifyContent: collapsed ? "center" : "space-between" }}>
          {!collapsed && (
            <Link href="/" target="_blank" style={{ textDecoration: "none" }}>
              <span style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "20px", fontWeight: 800, color: "white" }}>Hepsilens</span>
              <span style={{ fontSize: "10px", color: "#50dcff", display: "block", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Yönetici Paneli</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#737685", padding: "4px", display: "flex" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>{collapsed ? "menu_open" : "menu"}</span>
          </button>
        </div>
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {navItems.map(item => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const badge = item.href === "/admin/siparisler" ? newOrders : item.href === "/admin/destek" ? openTickets : 0;
            return (
              <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: "10px", padding: collapsed ? "10px 0" : "10px 12px", borderRadius: "10px", background: active ? "#003d9b" : "transparent", color: active ? "white" : "#9ca3af", textDecoration: "none", fontSize: "13px", fontWeight: active ? 700 : 500, transition: "all 0.15s", justifyContent: collapsed ? "center" : "flex-start", position: "relative" }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "#1e2128"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px", fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0", flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                {!collapsed && badge > 0 && <span style={{ background: "#dc2626", color: "white", borderRadius: "999px", fontSize: "10px", fontWeight: 800, padding: "1px 6px", minWidth: "18px", textAlign: "center" }}>{badge}</span>}
                {collapsed && badge > 0 && <span style={{ position: "absolute", top: "6px", right: "6px", background: "#dc2626", borderRadius: "999px", width: "8px", height: "8px" }} />}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "12px 8px", borderTop: "1px solid #2a2d36", display: "flex", flexDirection: "column", gap: "2px" }}>
          <Link href="/" target="_blank" style={{ display: "flex", alignItems: "center", gap: "10px", padding: collapsed ? "10px 0" : "10px 12px", borderRadius: "10px", color: "#6b7280", textDecoration: "none", fontSize: "13px", fontWeight: 500, justifyContent: collapsed ? "center" : "flex-start" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#1e2128"; (e.currentTarget as HTMLElement).style.color = "#50dcff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6b7280"; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>open_in_new</span>
            {!collapsed && <span>Siteyi Görüntüle</span>}
          </Link>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "10px", padding: collapsed ? "10px 0" : "10px 12px", borderRadius: "10px", color: "#6b7280", background: "transparent", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 500, justifyContent: collapsed ? "center" : "flex-start", width: "100%" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#1e2128"; (e.currentTarget as HTMLElement).style.color = "#ef4444"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6b7280"; }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>logout</span>
            {!collapsed && <span>Çıkış Yap</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ background: "white", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <p style={{ fontSize: "13px", color: "#6b7280" }}>{currentLabel}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ position: "relative" }}>
              <button onClick={() => setNotifOpen(o => !o)} style={{ background: notifOpen ? "#f0f4ff" : "transparent", border: notifOpen ? "1px solid #dae2ff" : "1px solid transparent", borderRadius: "8px", cursor: "pointer", color: notifOpen ? "#003d9b" : "#6b7280", display: "flex", alignItems: "center", padding: "6px 8px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "22px", fontVariationSettings: unreadCount > 0 ? "'FILL' 1" : "'FILL' 0" }}>notifications</span>
              </button>
              {unreadCount > 0 && (
                <span style={{ position: "absolute", top: "-4px", right: "-4px", background: "#dc2626", color: "white", borderRadius: "999px", fontSize: "9px", fontWeight: 800, padding: "1px 5px" }}>{unreadCount}</span>
              )}
              {notifOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: "320px", background: "white", borderRadius: "14px", border: "1px solid #e5e7eb", boxShadow: "0 12px 40px rgba(0,0,0,0.12)", overflow: "hidden", zIndex: 999 }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>Bildirimler</p>
                    {unreadCount > 0 && <button onClick={markAllRead} style={{ fontSize: "11px", color: "#003d9b", background: "transparent", border: "none", cursor: "pointer", fontWeight: 600 }}>Tümünü okundu işaretle</button>}
                  </div>
                  <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                    {recentOrders.map(o => {
                      const isRead = readIds.includes(o.id);
                      return (
                        <Link key={o.id} href="/admin/siparisler" onClick={() => { setReadIds(p => [...p, o.id]); setNotifOpen(false); }} style={{ display: "flex", gap: "10px", padding: "12px 16px", textDecoration: "none", background: isRead ? "white" : "#f0f9ff", borderBottom: "1px solid #f9fafb" }}>
                          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: isRead ? "#f3f4f6" : "#dae2ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: isRead ? "#9ca3af" : "#003d9b", fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>Yeni sipariş: {o.order_no}</p>
                            <p style={{ fontSize: "11px", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.customer_name} · ₺{o.total_amount.toLocaleString("tr-TR")}</p>
                            <p style={{ fontSize: "10px", color: "#9ca3af", marginTop: "2px" }}>{new Date(o.created_at).toLocaleDateString("tr-TR")}</p>
                          </div>
                          {!isRead && <div style={{ width: "8px", height: "8px", borderRadius: "999px", background: "#003d9b", marginTop: "6px", flexShrink: 0 }} />}
                        </Link>
                      );
                    })}
                  </div>
                  <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6" }}>
                    <Link href="/admin/siparisler" onClick={() => setNotifOpen(false)} style={{ fontSize: "12px", color: "#003d9b", fontWeight: 600, textDecoration: "none" }}>Tüm siparişleri gör →</Link>
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "999px", background: "#003d9b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "white", fontVariationSettings: "'FILL' 1" }}>person</span>
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", lineHeight: 1 }}>Engin</p>
                <p style={{ fontSize: "11px", color: "#6b7280" }}>Süper Yönetici</p>
              </div>
            </div>
          </div>
        </header>
        <main style={{ flex: 1, overflow: "auto", padding: "24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
