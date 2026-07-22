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
 * SEO notu: FAQPage schema, Google'da soruların açılır cevaplarla zengin
 * sonuç olarak görünmesini sağlayabilir — tıklama oranını artırır.
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
          'Hayır. Ürünlerimiz 316L cerrahi çelikten üretilir; gümüş gibi kararmaz, kaplama takılar gibi birkaç ayda rengini bırakmaz. İlk günkü tonunu korur.',
      },
      {
        soru: 'Alerji yapar mı?',
        cevap:
          '316L çelik, nikel salınımı çok düşük olan bir alaşımdır ve ameliyat aletlerinde kullanılır. Bu sayede hassas ciltlerde bile genellikle kızarıklık yapmaz. Yine de bilinen bir metal alerjiniz varsa ilk kullanımda dikkatli olmanızı öneririz.',
      },
      {
        soru: 'Suyla temas eder mi, duşta çıkarmam gerekir mi?',
        cevap:
          'Çıkarmanıza gerek yok. Duşta, denizde ve havuzda takabilirsiniz; çeliğin krom oksit tabakası oksitlenmeye karşı korur. Yine de parfüm ve sert kimyasallardan uzak tutmak, parlaklığını daha uzun korur.',
      },
      {
        soru: 'Altın/gümüş kaplama dökülür mü?',
        cevap:
          'Kaplamalı modellerimizde kaplama, günlük kullanıma uygun kalınlıktadır. Parfüm, deniz suyu ve sürtünmeden uzak tutulduğunda uzun ömürlüdür. Kaplamasız 316L çelik modellerimizde ise dökülecek bir kaplama yoktur.',
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
          'Siparişiniz kargoya verildiğinde takip numaranız WhatsApp üzerinden paylaşılır. Sipariş numaranızla bize her zaman WhatsApp’tan ulaşıp durumunu sorabilirsiniz.',
      },
      {
        soru: 'Siparişimi hediye olarak gönderebilir miyim?',
        cevap:
          'Evet. Her sipariş, üzerine not yazabileceğiniz özel kutusunda ve keten kesesinde gelir. Hediye olarak gönderiyorsanız sipariş notuna yazmanız yeterli; fatura tutarını görünmeyecek şekilde ayarlıyoruz.',
      },
    ],
  },
  {
    baslik: 'İade & Değişim',
    kalemler: [
      {
        soru: 'İade edebilir miyim?',
        cevap: `Evet. Ürünü teslim aldığınız tarihten itibaren ${CAYMA_SURESI_GUN} gün içinde, sebep belirtmeden iade edebilirsiniz. Ürünün kullanılmamış ve orijinal kutusuyla birlikte olması gerekir.`,
      },
      {
        soru: 'Hangi ürünler iade edilemez?',
        cevap:
          'Kişiye özel üretilen (isim baskılı) ürünler ve ambalajı açılmış küpeler, hijyen ve kişiselleştirme nedeniyle iade alınamaz. Bu istisnalar hatalı, kusurlu veya yanlış gönderilen ürünler için geçerli değildir.',
      },
      {
        soru: 'Beden değişimi yapabilir miyim?',
        cevap:
          'Yüzüklerimizin çoğu açık uçlu ve ayarlanabilir olduğu için çoğu ölçüye uyar. Yine de beden değişimi için iade sürecini başlatıp yeni siparişinizi vermeniz en hızlı yoldur. WhatsApp’tan yazarsanız süreci hızlandırabiliriz.',
      },
      {
        soru: 'Param ne zaman iade edilir?',
        cevap:
          'İadeniz onaylandıktan sonra ödemeniz en geç 14 gün içinde, ödemeyi yaptığınız kartın bağlı olduğu hesaba iade edilir. Bankanızın işleme süresine göre hesabınıza yansıması birkaç iş günü daha sürebilir.',
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
