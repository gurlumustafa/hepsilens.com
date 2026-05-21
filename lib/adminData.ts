export type OrderStatus = "yeni" | "isleniyor" | "kargoda" | "teslim" | "iptal";
export type TicketStatus = "acik" | "yanitlandi" | "kapali";
export type TicketPriority = "dusuk" | "normal" | "yuksek" | "kritik";
export type PrescriptionStatus = "bekleniyor" | "yuklendi" | "onaylandi" | "reddedildi";

export type PrescriptionFile = {
  name: string;
  size: string;
  uploadedAt: string;
  url: string;
  type: "pdf" | "image";
};

export type Order = {
  id: string;
  orderCode: string;
  customer: string;
  email: string;
  phone: string;
  product: string;
  quantity: number;
  amount: number;
  status: OrderStatus;
  date: string;
  // Adres
  address: string;
  neighborhood: string;
  district: string;
  city: string;
  postalCode: string;
  // Reçete
  requiresPrescription: boolean;
  prescriptionStatus?: PrescriptionStatus;
  prescriptionFile?: PrescriptionFile;
  // Kargo
  trackingCode?: string;
  carrier?: string;
  estimatedDelivery?: string;
  shippedAt?: string;
  // Ödeme
  paymentMethod: string;
  installments?: number;
  cardLast4?: string;
  // Notlar
  customerNote?: string;
  adminNote?: string;
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
  {
    id: "HL-2026-0091", orderCode: "#2091",
    customer: "Zeynep Arslan", email: "zeynep@gmail.com", phone: "0532 111 2233",
    product: "Acuvue Oasys 1-Day (30'lu)", quantity: 1, amount: 389.90,
    status: "yeni", date: "2026-05-21 09:14",
    address: "Bağcılar Cad. No: 42 D: 8", neighborhood: "Kirazlı Mah.", district: "Bağcılar", city: "İstanbul", postalCode: "34200",
    requiresPrescription: true, prescriptionStatus: "bekleniyor",
    paymentMethod: "Kredi Kartı", installments: 3, cardLast4: "4521",
    customerNote: "Kapı zili çalışmıyor, lütfen telefon edin.",
  },
  {
    id: "HL-2026-0090", orderCode: "#2090",
    customer: "Murat Demir", email: "murat@gmail.com", phone: "0541 234 5678",
    product: "Dailies Total1 (30'lu)", quantity: 2, amount: 469.00,
    status: "yeni", date: "2026-05-21 08:52",
    address: "Atatürk Bulvarı No: 156 D: 3", neighborhood: "Kavaklıdere Mah.", district: "Çankaya", city: "Ankara", postalCode: "06700",
    requiresPrescription: true, prescriptionStatus: "yuklendi",
    prescriptionFile: { name: "recete_murat_demir.jpg", size: "312 KB", uploadedAt: "2026-05-21 08:55", url: "#", type: "image" },
    paymentMethod: "Kredi Kartı", installments: 6, cardLast4: "7843",
  },
  {
    id: "HL-2026-0089", orderCode: "#2089",
    customer: "Selin Kaya", email: "selin@hotmail.com", phone: "0555 987 6543",
    product: "FreshLook Colorblends", quantity: 1, amount: 219.90,
    status: "isleniyor", date: "2026-05-21 07:30",
    address: "Cumhuriyet Cad. No: 78 D: 2", neighborhood: "Alsancak Mah.", district: "Konak", city: "İzmir", postalCode: "35220",
    requiresPrescription: false,
    paymentMethod: "Kapıda Ödeme",
    customerNote: "Hafta içi sabah 10-12 arası teslim.",
  },
  {
    id: "HL-2026-0088", orderCode: "#2088",
    customer: "Ali Vural", email: "ali@outlook.com", phone: "0507 345 6789",
    product: "Biofinity (6'lı)", quantity: 1, amount: 549.50,
    status: "kargoda", date: "2026-05-20 16:22",
    address: "Gürsu Cad. No: 5 D: 10", neighborhood: "Hamitler Mah.", district: "Osmangazi", city: "Bursa", postalCode: "16110",
    requiresPrescription: true, prescriptionStatus: "onaylandi",
    prescriptionFile: { name: "recete_ali_vural.pdf", size: "189 KB", uploadedAt: "2026-05-20 14:30", url: "#", type: "pdf" },
    trackingCode: "7318529461", carrier: "Yurtiçi Kargo", estimatedDelivery: "2026-05-22", shippedAt: "2026-05-20 18:00",
    paymentMethod: "Kredi Kartı", installments: 1, cardLast4: "9012",
  },
  {
    id: "HL-2026-0087", orderCode: "#2087",
    customer: "Fatma Şahin", email: "fatma@gmail.com", phone: "0533 876 5432",
    product: "Air Optix Night & Day", quantity: 1, amount: 628.00,
    status: "kargoda", date: "2026-05-20 14:10",
    address: "Konyaaltı Cad. No: 33 D: 5", neighborhood: "Muratpaşa Mah.", district: "Muratpaşa", city: "Antalya", postalCode: "07050",
    requiresPrescription: true, prescriptionStatus: "onaylandi",
    prescriptionFile: { name: "recete_fatma_sahin.jpg", size: "428 KB", uploadedAt: "2026-05-20 12:15", url: "#", type: "image" },
    trackingCode: "6241837592", carrier: "Aras Kargo", estimatedDelivery: "2026-05-22", shippedAt: "2026-05-20 16:30",
    paymentMethod: "Kredi Kartı", installments: 3, cardLast4: "2256",
  },
  {
    id: "HL-2026-0086", orderCode: "#2086",
    customer: "Kemal Öztürk", email: "kemal@gmail.com", phone: "0545 123 4567",
    product: "Acuvue Oasys for Astigmatism", quantity: 1, amount: 712.90,
    status: "teslim", date: "2026-05-19 11:05",
    address: "Vali Konağı Cad. No: 12 D: 7", neighborhood: "Nişantaşı Mah.", district: "Şişli", city: "İstanbul", postalCode: "34367",
    requiresPrescription: true, prescriptionStatus: "onaylandi",
    prescriptionFile: { name: "recete_kemal_ozturk.pdf", size: "215 KB", uploadedAt: "2026-05-19 09:40", url: "#", type: "pdf" },
    trackingCode: "8847291036", carrier: "MNG Kargo", estimatedDelivery: "2026-05-21", shippedAt: "2026-05-19 15:00",
    paymentMethod: "Kredi Kartı", installments: 12, cardLast4: "3388",
  },
  {
    id: "HL-2026-0085", orderCode: "#2085",
    customer: "Ayşe Yıldız", email: "ayse@yahoo.com", phone: "0551 654 3210",
    product: "Dailies Aquacomfort Plus", quantity: 2, amount: 187.50,
    status: "teslim", date: "2026-05-19 09:33",
    address: "Gaziantep Bulvarı No: 88 D: 1", neighborhood: "Şahinbey Mah.", district: "Şahinbey", city: "Gaziantep", postalCode: "27500",
    requiresPrescription: true, prescriptionStatus: "onaylandi",
    prescriptionFile: { name: "recete_ayse_yildiz.jpg", size: "367 KB", uploadedAt: "2026-05-19 08:00", url: "#", type: "image" },
    trackingCode: "5193748261", carrier: "PTT Kargo", estimatedDelivery: "2026-05-21", shippedAt: "2026-05-19 13:00",
    paymentMethod: "Havale/EFT",
  },
  {
    id: "HL-2026-0084", orderCode: "#2084",
    customer: "Hasan Çelik", email: "hasan@gmail.com", phone: "0543 222 3344",
    product: "Optiflex Monthly (3'lü)", quantity: 3, amount: 299.00,
    status: "iptal", date: "2026-05-18 17:44",
    address: "Mevlana Cad. No: 23 D: 4", neighborhood: "Karatay Mah.", district: "Karatay", city: "Konya", postalCode: "42030",
    requiresPrescription: false,
    paymentMethod: "Kredi Kartı", installments: 6, cardLast4: "6677",
    adminNote: "Müşteri talep etti — stok yok nedeniyle iptal edildi.",
  },
  {
    id: "HL-2026-0083", orderCode: "#2083",
    customer: "Merve Toprak", email: "merve@gmail.com", phone: "0536 789 0123",
    product: "Biofinity Toric (6'lı)", quantity: 1, amount: 824.00,
    status: "teslim", date: "2026-05-18 12:19",
    address: "Moda Cad. No: 15 D: 3", neighborhood: "Moda Mah.", district: "Kadıköy", city: "İstanbul", postalCode: "34710",
    requiresPrescription: true, prescriptionStatus: "onaylandi",
    prescriptionFile: { name: "recete_merve_toprak.pdf", size: "298 KB", uploadedAt: "2026-05-18 10:30", url: "#", type: "pdf" },
    trackingCode: "3829475162", carrier: "Yurtiçi Kargo", estimatedDelivery: "2026-05-20", shippedAt: "2026-05-18 16:00",
    paymentMethod: "Kredi Kartı", installments: 3, cardLast4: "5544",
  },
  {
    id: "HL-2026-0082", orderCode: "#2082",
    customer: "Burak Aydın", email: "burak@icloud.com", phone: "0544 456 7890",
    product: "FreshLook Dimensions", quantity: 2, amount: 234.90,
    status: "teslim", date: "2026-05-17 15:07",
    address: "Bağlum Cad. No: 67 D: 2", neighborhood: "Keçiören Mah.", district: "Keçiören", city: "Ankara", postalCode: "06100",
    requiresPrescription: false,
    trackingCode: "2918374651", carrier: "Aras Kargo", estimatedDelivery: "2026-05-19", shippedAt: "2026-05-17 18:00",
    paymentMethod: "Kapıda Ödeme",
    customerNote: "Ev adresine teslim, komşuya bırakmayın.",
  },
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

export const PRESCRIPTION_STATUS_LABELS: Record<PrescriptionStatus, string> = {
  bekleniyor: "Reçete Bekleniyor",
  yuklendi:   "Yüklendi — İnceleniyor",
  onaylandi:  "Reçete Onaylandı",
  reddedildi: "Reçete Reddedildi",
};

export const PRESCRIPTION_STATUS_COLORS: Record<PrescriptionStatus, { bg: string; text: string; icon: string }> = {
  bekleniyor: { bg: "#fffbeb", text: "#92400e",  icon: "hourglass_empty" },
  yuklendi:   { bg: "#dbeafe", text: "#1d4ed8",  icon: "pending" },
  onaylandi:  { bg: "#dcfce7", text: "#166534",  icon: "verified" },
  reddedildi: { bg: "#fee2e2", text: "#991b1b",  icon: "cancel" },
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
