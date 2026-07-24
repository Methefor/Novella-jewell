/**
 * ŞİRKET BİLGİLERİ — TEK KAYNAK
 * ═══════════════════════════════════════════════════════════════
 *
 * 🔴 SATIŞ AÇILMADAN ÖNCE AŞAĞIDAKİ ALANLARI DOLDUR.
 *
 * Bu bilgiler tüm yasal sayfalarda (Mesafeli Satış Sözleşmesi, Ön
 * Bilgilendirme, KVKK, Gizlilik, İletişim) otomatik olarak kullanılır.
 * Tek yerden değiştirirsin, 8 sayfa birden güncellenir.
 *
 * Yasal dayanak: 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında
 * Kanun m.3 — hizmet sağlayıcının tanıtıcı bilgilerini sunması zorunludur.
 *
 * DOLDURULMAYAN alanlar sitede "[DOLDURULACAK: ...]" şeklinde görünür.
 * Bu bilinçli bir tercih — sessizce boş kalıp yanlışlıkla yayına
 * çıkmasındansa göze batması daha güvenli.
 */

export const COMPANY = {
  /** Ticaret unvanı — şahıs şirketi olarak tam adın */
  unvan: 'Metehan Arslan',

  /** Vitrin adı (müşterinin gördüğü) */
  markaAdi: 'NOVELLA',

  /** Açık adres — mahalle, cadde, no, ilçe/il */
  adres: 'Hürriyet Mahallesi Reşat Nuri Güntekin Caddesi No:7 Mavi Manzara Sitesi, Süleymanpaşa/Tekirdağ',

  /** Vergi dairesi — örn. "Süleymanpaşa" */
  vergiDairesi: 'Süleymanpaşa',

  /** Vergi kimlik no veya TC kimlik no (şahıs şirketi) */
  vergiNo: '31460457134',

  /** MERSİS numarası — şahıs şirketiyse boş bırakılabilir */
  mersisNo: '',

  /** Müşteri hizmetleri e-postası */
  email: 'novella.jewellery.tr@gmail.com',

  /** Telefon — WhatsApp numarası SITE.whatsapp'tan gelir, bu ayrı olabilir */
  telefon: '0545 112 50 59',

  /** Esnaf/tacir ayrımı — cayma hakkı metinlerinde kullanılır */
  ticariUnvanTipi: 'sahis' as 'sahis' | 'limited' | 'anonim',
} as const;

/**
 * Bir alan boşsa sitede göze batan bir uyarı gösterir.
 * Böylece eksik bilgiyle yayına çıkmak zor olur.
 */
export function alan(value: string, etiket: string): string {
  return value.trim() !== '' ? value : `[DOLDURULACAK: ${etiket}]`;
}

/** Yasal sayfaların son güncellenme tarihi — metinleri değiştirirsen güncelle. */
export const YASAL_GUNCELLEME = '24 Temmuz 2026';

/** Cayma hakkı süresi (gün) — Mesafeli Sözleşmeler Yönetmeliği m.9: en az 14 gün. */
export const CAYMA_SURESI_GUN = 14;

/** Teslimat taahhüdü (gün) — TKHK m.48: en fazla 30 gün. */
export const TESLIMAT_SURESI_GUN = 30;
