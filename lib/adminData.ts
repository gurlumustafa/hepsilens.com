export type OrderStatus = "yeni" | "isleniyor" | "kargoda" | "teslim" | "iptal";
export type TicketStatus = "acik" | "yanitlandi" | "kapali";
export type TicketPriority = "dusuk" | "normal" | "yuksek" | "kritik";

export type Order = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  product: string;

  amount: number;
  status: OrderStatus;
  date: string;
  city: string;
  requiresPrescription: boolean;
};

export type SupportTicket = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  date: string;
  category: string;
};

export const mockOrders: Order[] = [
  { id: "HL-2026-0091", customer: "Zeynep Arslan", email: "zeynep@gmail.com", phone: "0532 111 2233", product: "Acuvue Oasys 1-Day (30'lu)", amount: 389.90, status: "yeni", date: "2026-05-21 09:14", city: "İstanbul", requiresPrescription: true },
  { id: "HL-2026-0090", customer: "Murat Demir", email: "murat@gmail.com", phone: "0541 234 5678", product: "Dailies Total1 (30'lu)", amount: 469.00, status: "yeni", date: "2026-05-21 08:52", city: "Ankara", requiresPrescription: true },
  { id: "HL-2026-0089", customer: "Selin Kaya", email: "selin@hotmail.com", phone: "0555 987 6543", product: "FreshLook Colorblends", amount: 219.90, status: "isleniyor", date: "2026-05-21 07:30", city: "İzmir", requiresPrescription: false },
  { id: "HL-2026-0088", customer: "Ali Vural", email: "ali@outlook.com", phone: "0507 345 6789", product: "Biofinity (6'lı)", amount: 549.50, status: "kargoda", date: "2026-05-20 16:22", city: "Bursa", requiresPrescription: true },
  { id: "HL-2026-0087", customer: "Fatma Şahin", email: "fatma@gmail.com", phone: "0533 876 5432", product: "Air Optix Night & Day", amount: 628.00, status: "kargoda", date: "2026-05-20 14:10", city: "Antalya", requiresPrescription: true },
  { id: "HL-2026-0086", customer: "Kemal Öztürk", email: "kemal@gmail.com", phone: "0545 123 4567", product: "Acuvue Oasys for Astigmatism", amount: 712.90, status: "teslim", date: "2026-05-19 11:05", city: "İstanbul", requiresPrescription: true },
  { id: "HL-2026-0085", customer: "Ayşe Yıldız", email: "ayse@yahoo.com", phone: "0551 654 3210", product: "Dailies Aquacomfort Plus", amount: 187.50, status: "teslim", date: "2026-05-19 09:33", city: "Gaziantep", requiresPrescription: true },
  { id: "HL-2026-0084", customer: "Hasan Çelik", email: "hasan@gmail.com", phone: "0543 222 3344", product: "Optiflex Monthly (3'lü)", amount: 299.00, status: "iptal", date: "2026-05-18 17:44", city: "Konya", requiresPrescription: false },
  { id: "HL-2026-0083", customer: "Merve Toprak", email: "merve@gmail.com", phone: "0536 789 0123", product: "Biofinity Toric (6'lı)", amount: 824.00, status: "teslim", date: "2026-05-18 12:19", city: "İstanbul", requiresPrescription: true },
  { id: "HL-2026-0082", customer: "Burak Aydın", email: "burak@icloud.com", phone: "0544 456 7890", product: "FreshLook Dimensions", amount: 234.90, status: "teslim", date: "2026-05-17 15:07", city: "Ankara", requiresPrescription: false },
];

export const mockTickets: SupportTicket[] = [
  { id: "TKT-0041", name: "Zeynep Arslan", email: "zeynep@gmail.com", phone: "0532 111 2233", subject: "Reçete yükleme sorunu", message: "Reçetemi yüklemeye çalışıyorum fakat 'dosya desteklenmiyor' hatası alıyorum. PNG formatında yükledim.", status: "acik", priority: "yuksek", date: "2026-05-21 09:20", category: "Teknik" },
  { id: "TKT-0040", name: "Ahmet Korkmaz", email: "ahmet@gmail.com", phone: "0541 234 5678", subject: "Yanlış ürün geldi", message: "Acuvue Oasys 1-Day sipariş ettim fakat Dailies geldi. Değişim yapmak istiyorum.", status: "acik", priority: "kritik", date: "2026-05-21 08:45", category: "Sipariş" },
  { id: "TKT-0039", name: "Burcu Sarı", email: "burcu@hotmail.com", phone: "0555 987 6543", subject: "Kargo takip kodu çalışmıyor", message: "Sipariş HL-2026-0085 için gelen kargo takip kodu web sitesinde bulunamıyor diyor.", status: "yanitlandi", priority: "normal", date: "2026-05-20 14:30", category: "Kargo" },
  { id: "TKT-0038", name: "Caner Yıldız", email: "caner@gmail.com", phone: "0507 345 6789", subject: "İade talebi", message: "Sipariş numarasını yanlış girdim ve farklı numara geldi. İade etmek istiyorum, nasıl yapabilirim?", status: "acik", priority: "normal", date: "2026-05-20 11:15", category: "İade" },
  { id: "TKT-0037", name: "Derya Kılıç", email: "derya@outlook.com", phone: "0533 876 5432", subject: "Taksit seçeneği sorusu", message: "Vakıfbank kartıyla 12 taksit yapabilir miyim? Sitede göremedim.", status: "yanitlandi", priority: "dusuk", date: "2026-05-19 16:22", category: "Ödeme" },
  { id: "TKT-0036", name: "Emre Çetin", email: "emre@gmail.com", phone: "0545 123 4567", subject: "Sipariş iptal", message: "HL-2026-0084 nolu siparişimi iptal etmek istiyorum, henüz kargoya verilmedi.", status: "kapali", priority: "normal", date: "2026-05-18 18:00", category: "Sipariş" },
  { id: "TKT-0035", name: "Filiz Doğan", email: "filiz@gmail.com", phone: "0551 654 3210", subject: "Lens alerjisi şikayeti", message: "Aldığım lensler gözümü çok yakıyor ve kızarıklık oluşuyor. Ne yapmalıyım?", status: "yanitlandi", priority: "yuksek", date: "2026-05-18 10:05", category: "Sağlık" },
  { id: "TKT-0034", name: "Gökhan Arslan", email: "gokhan@gmail.com", phone: "0543 222 3344", subject: "Kampanya kodu çalışmıyor", message: "LENS10 kodunu girdim ama indirim uygulanmadı.", status: "kapali", priority: "dusuk", date: "2026-05-17 13:44", category: "Teknik" },
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  yeni: "Yeni",
  isleniyor: "İşleniyor",
  kargoda: "Kargoda",
  teslim: "Teslim Edildi",
  iptal: "İptal",
};

export const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  yeni:      { bg: "#dbeafe", text: "#1d4ed8" },
  isleniyor: { bg: "#fef3c7", text: "#92400e" },
  kargoda:   { bg: "#ccf4f9", text: "#00687b" },
  teslim:    { bg: "#dcfce7", text: "#166534" },
  iptal:     { bg: "#fee2e2", text: "#991b1b" },
};

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  acik: "Açık",
  yanitlandi: "Yanıtlandı",
  kapali: "Kapalı",
};

export const TICKET_STATUS_COLORS: Record<TicketStatus, { bg: string; text: string }> = {
  acik:       { bg: "#fee2e2", text: "#991b1b" },
  yanitlandi: { bg: "#fef3c7", text: "#92400e" },
  kapali:     { bg: "#f1f5f9", text: "#64748b" },
};

export const TICKET_PRIORITY_LABELS: Record<TicketPriority, string> = {
  dusuk: "Düşük",
  normal: "Normal",
  yuksek: "Yüksek",
  kritik: "Kritik",
};

export const TICKET_PRIORITY_COLORS: Record<TicketPriority, string> = {
  dusuk:  "#64748b",
  normal: "#003d9b",
  yuksek: "#b45309",
  kritik: "#dc2626",
};
