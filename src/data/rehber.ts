// Bakım ve bilgi rehberi — SEO odaklı içerik.
// "çelik takı kararır mı" gibi aramalardan organik trafik hedefler.

export interface RehberYazisi {
  slug: string;
  baslik: string;
  ozet: string;
  /** Her eleman bir bölüm: başlık + paragraflar */
  bolumler: { baslik: string; paragraflar: string[] }[];
  tarih: string; // ISO
}

export const REHBER_YAZILARI: RehberYazisi[] = [
  {
    slug: 'celik-taki-kararir-mi',
    baslik: 'Çelik Takı Kararır mı? 316L Paslanmaz Çelik Gerçeği',
    ozet:
      'Çelik takıların kararıp kararmadığı, 316L cerrahi çeliğin diğer metallerden farkı ve neden ömür boyu parlak kaldığı.',
    tarih: '2026-07-22',
    bolumler: [
      {
        baslik: 'Kısa cevap: Hayır, 316L çelik kararmaz',
        paragraflar: [
          '316L paslanmaz çelik, yüzeyinde kendiliğinden oluşan görünmez bir krom oksit tabakası taşır. Bu tabaka metali havayla, suyla ve terle temastan korur — gümüşün kararmasına yol açan oksitlenme 316L çelikte gerçekleşmez.',
          'Bu yüzden 316L çelik, "cerrahi çelik" olarak da bilinir: vücut piercingleri ve tıbbi implantlarda kullanılan malzemeyle aynı ailedendir.',
        ],
      },
      {
        baslik: 'Gümüş ve kaplama takılarla farkı',
        paragraflar: [
          'Gümüş takılar havadaki kükürtle tepkimeye girip zamanla sararır ve kararır; düzenli parlatma ister. Ucuz kaplama takılarda ise ince kaplama tabakası aşındıkça altındaki metal ortaya çıkar ve cildi yeşile boyayabilir.',
          '316L çelik masif bir malzemedir — kaplamanın altında "ortaya çıkacak" başka bir metal yoktur. Denizde, duşta ve sporda takılı kalabilir.',
        ],
      },
      {
        baslik: 'Alerji yapar mı?',
        paragraflar: [
          '316L çeliğin nikel salınımı Avrupa standartlarının çok altındadır; bu nedenle hassas ciltlerde ve yeni delinmiş kulaklarda güvenle kullanılır. Bilinen ağır nikel alerjiniz varsa yine de ilk günlerde cildinizi gözlemlemenizi öneririz.',
        ],
      },
    ],
  },
  {
    slug: 'taki-bakim-rehberi',
    baslik: 'Takı Bakım Rehberi: Parlaklığı Ömür Boyu Koruyun',
    ozet:
      'Çelik takılarınızı ilk günkü gibi tutmanın basit yolları: temizlik, saklama ve kaçınmanız gerekenler.',
    tarih: '2026-07-22',
    bolumler: [
      {
        baslik: 'Günlük kullanım',
        paragraflar: [
          '316L çelik takılarınızı çıkarmanıza gerek yok: duş, deniz, havuz ve spor sorun değildir. Yine de parfüm, saç spreyi ve ağartıcı gibi yoğun kimyasalları doğrudan takının üzerine sıkmamaya özen gösterin.',
        ],
      },
      {
        baslik: 'Temizlik',
        paragraflar: [
          'Ayda bir, ılık sabunlu suda birkaç dakika bekletip yumuşak bir bezle kurulamanız yeterli. Diş fırçası gibi sert fırçalar ve aşındırıcı temizleyiciler mat iz bırakabilir — kullanmayın.',
        ],
      },
      {
        baslik: 'Saklama',
        paragraflar: [
          'Takılarınızı geldiği kutuda veya kumaş kesede, birbirine sürtmeyecek şekilde saklayın. Bu, yüzey çizilmelerini önlemenin en kolay yoludur.',
        ],
      },
    ],
  },
  {
    slug: '316l-celik-nedir',
    baslik: '316L Çelik Nedir? Takıda Cerrahi Çeliğin Avantajları',
    ozet:
      '316L (cerrahi) çeliğin bileşimi, neden takı için ideal olduğu ve satın alırken nelere dikkat etmeniz gerektiği.',
    tarih: '2026-07-22',
    bolumler: [
      {
        baslik: '316L bileşimi',
        paragraflar: [
          '316L, düşük karbonlu bir östenitik paslanmaz çelik alaşımıdır: yaklaşık %16-18 krom, %10-14 nikel ve %2-3 molibden içerir. Sondaki "L" (low carbon), düşük karbon oranını belirtir — bu, korozyon direncini daha da artırır.',
          'Molibden katkısı, 316L\'yi tuzlu suya karşı özellikle dirençli yapar. Deniz tutkunları için takıda 316L tercih edilmesinin nedeni budur.',
        ],
      },
      {
        baslik: 'Neden takı için ideal?',
        paragraflar: [
          'Kararmaz, paslanmaz, rengi solmaz. Hipoalerjeniktir. Altın görünümü isteyenler için PVD kaplama ile altın tonu verilir — PVD, klasik kaplamalardan kat kat dayanıklıdır.',
          'Satın alırken "çelik" ifadesi yeterli değildir; 201 veya 304 gibi daha düşük alaşımlar da "çelik" olarak satılabilir. Ürün açıklamasında "316L" ibaresini arayın.',
        ],
      },
    ],
  },
  {
    slug: 'kupe-hijyeni-ve-yeni-delinmis-kulak',
    baslik: 'Küpe Hijyeni: Yeni Delinmiş Kulaklar İçin Doğru Küpe Seçimi',
    ozet:
      'Yeni delinmiş kulaklarda hangi küpeler güvenli, hijyen kuralları ve iyileşme döneminde dikkat edilmesi gerekenler.',
    tarih: '2026-07-22',
    bolumler: [
      {
        baslik: 'Yeni delinmiş kulakta malzeme seçimi',
        paragraflar: [
          'İyileşme dönemindeki kulak deliği açık bir yara gibidir; bu dönemde nikel salınımı yüksek metaller kızarıklık ve kaşıntıya yol açabilir. 316L cerrahi çelik ve titanyum, bu dönem için en güvenli seçeneklerdir.',
        ],
      },
      {
        baslik: 'Hijyen kuralları',
        paragraflar: [
          'Küpeyi takmadan önce ellerinizi yıkayın, küpe çubuğunu alkollü mendille silin. Başkasıyla küpe paylaşmayın. Yeni aldığınız küpeleri de ilk kullanımdan önce silmeniz iyi bir alışkanlıktır.',
          'Bu nedenle ambalajı açılmış küpeler hijyen gereği iade edilemez — tüm mağazalarda olduğu gibi NOVELLA\'da da bu kural, sizden önce kimsenin küpenize dokunmadığının güvencesidir.',
        ],
      },
    ],
  },
];

export function getRehberYazisi(slug: string): RehberYazisi | undefined {
  return REHBER_YAZILARI.find((y) => y.slug === slug);
}
