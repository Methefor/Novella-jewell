import { RETURN_POLICY } from '@/lib/return-policy';
import { PRODUCT_CARE } from '@/lib/product-care';
import { SHIPPING } from '@/lib/config';
import { CAYMA_SURESI_GUN, TESLIMAT_SURESI_GUN } from '@/lib/legal';

/**
 * SSS içeriği — TEK KAYNAK.
 *
 * Bu dizi hem görünen sayfayı hem de Google'a giden FAQPage JSON-LD'yi besler.
 * Tek yerden yazılır, ikisi asla ayrışmaz.
 *
 * ⚠️ Cevaplar sitedeki gerçek politikalarla tutarlı olmalı. Kargo eşiği,
 * cayma süresi vb. config'ten okunur; elle sayı yazılırsa çelişir.
 *
 * Google'ın SSS zengin sonucu uygunluk koşulları ayrıdır; bu işaretleme
 * bir e-ticaret sitesi için açılır SSS sonucu garantisi vermez.
 */

export interface SSSKalem {
  soru: string;
  cevap: string;
}

export interface SSSGrup {
  baslik: string;
  kalemler: SSSKalem[];
}

const esik = SHIPPING.freeThreshold.toLocaleString('tr-TR');
const ucret = SHIPPING.fee.toLocaleString('tr-TR', {
  minimumFractionDigits: 2,
});

export const SSS: SSSGrup[] = [
  {
    baslik: 'Ürün & Malzeme',
    kalemler: [
      {
        soru: 'Çelik takı kararır mı?',
        cevap:
          PRODUCT_CARE.finish,
      },
      {
        soru: 'Alerji yapar mı?',
        cevap:
          PRODUCT_CARE.allergy,
      },
      {
        soru: 'Suyla temas eder mi, duşta çıkarmam gerekir mi?',
        cevap:
          PRODUCT_CARE.water,
      },
      {
        soru: 'Altın/gümüş kaplama dökülür mü?',
        cevap:
          PRODUCT_CARE.finish,
      },
    ],
  },
  {
    baslik: 'Sipariş & Kargo',
    kalemler: [
      {
        soru: 'Kargo ücreti ne kadar?',
        cevap: `${esik} ₺ ve üzeri siparişlerde kargo ücretsizdir. Altındaki siparişlerde ${ucret} ₺ kargo ücreti uygulanır. Tutar, siparişi onaylamadan önce sepette net gösterilir.`,
      },
      {
        soru: 'Siparişim ne zaman elime ulaşır?',
        cevap: `Siparişiniz ödemesi onaylandıktan sonra 1–3 iş günü içinde kargoya verilir. Kargodaki süre bulunduğunuz ile göre genellikle 1–3 iş günüdür. Yasal olarak teslimat en geç ${TESLIMAT_SURESI_GUN} gün içinde tamamlanır.`,
      },
      {
        soru: 'Kargomu nasıl takip ederim?',
        cevap:
          'Siparişiniz kargoya verildiğinde takip bilgileri e-posta ile gönderilir. Sipariş Takibi sayfasından sipariş numaranız ve e-posta adresinizle durumunu görüntüleyebilir, destek için bize ulaşabilirsiniz.',
      },
      {
        soru: 'Siparişimi hediye olarak gönderebilir miyim?',
        cevap:
          'Seçtiğiniz ürünü hediye edebilirsiniz. Her sipariş, ürün ve Novella kartvizitiyle birlikte özel kutusunda hazırlanır. Şu anda kişisel hediye notu veya el yazısı kart hizmetimiz bulunmuyor.',
      },
    ],
  },
  {
    baslik: 'İade & Değişim',
    kalemler: [
      {
        soru: 'İade edebilir miyim?',
        cevap: `Evet. Ürünü teslim aldığınız tarihten itibaren ${CAYMA_SURESI_GUN} gün içinde, sebep belirtmeden iade edebilirsiniz. ${RETURN_POLICY.condition}`,
      },
      {
        soru: 'Hangi ürünler iade edilemez?',
        cevap:
          RETURN_POLICY.hygiene,
      },
      {
        soru: 'Beden değişimi yapabilir miyim?',
        cevap:
          'Yüzüklerimizin çoğu açık uçlu ve ayarlanabilir olduğu için çoğu ölçüye uyar. Yine de beden değişimi için iade sürecini başlatıp yeni siparişinizi vermeniz en hızlı yoldur. WhatsApp’tan yazarsanız süreci hızlandırabiliriz.',
      },
      {
        soru: 'Param ne zaman iade edilir?',
        cevap:
          RETURN_POLICY.refund,
      },
    ],
  },
  {
    baslik: 'Ödeme & Güvenlik',
    kalemler: [
      {
        soru: 'Hangi ödeme yöntemlerini kullanabilirim?',
        cevap:
          'Kredi kartı ve banka kartı ile güvenli ödeme yapabilirsiniz. Kart bilgileriniz sitemize hiçbir zaman iletilmez ve tarafımızca saklanmaz.',
      },
      {
        soru: 'Kart bilgilerim güvende mi?',
        cevap:
          'Evet. Ödeme adımında PCI-DSS uyumlu güvenli ödeme sayfasına yönlendirilirsiniz. Kart numaranız, son kullanma tarihiniz ve CVV bilginiz sitemize hiç ulaşmaz.',
      },
    ],
  },
];

/** Görünen sayfa gruplu ister; JSON-LD tek düz liste ister. */
export const SSS_DUZ: SSSKalem[] = SSS.flatMap((g) => g.kalemler);
