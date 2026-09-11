import { PRODUCT_CARE } from '@/lib/product-care';
import { RETURN_POLICY } from '@/lib/return-policy';

export interface RehberYazisi {
  slug: string; baslik: string; ozet: string;
  bolumler: { baslik: string; paragraflar: string[] }[];
  tarih: string;
}

export const REHBER_YAZILARI: RehberYazisi[] = [
  {
    slug: 'celik-taki-kararir-mi', baslik: 'Çelik Takı Kararır mı? Malzeme ve Kaplama Farkı',
    ozet: 'Paslanmaz çeliğin dayanıklılığı, kaplamanın görünümü ve kullanım koşullarının takı üzerindeki etkisi.', tarih: '2026-09-01',
    bolumler: [
      { baslik: 'Dayanıklılık sınırsız koruma değildir', paragraflar: ['Paslanmaz çeliğin yüzeyindeki koruyucu tabaka korozyona direncine katkı sağlar. Ancak takının kaplaması, taşları ve birleştirme noktaları farklı bakım ihtiyaçlarına sahip olabilir.', PRODUCT_CARE.finish] },
      { baslik: 'Malzeme ile kaplamayı ayrı değerlendirin', paragraflar: ['Çelik tabanlı bir takı altın veya gümüş tonlu bir kaplamaya sahip olabilir. Tabanın çelik olması, kaplamanın aşınmayacağı anlamına gelmez. Ürüne özel malzeme ve kaplama bilgilerini açıklamasında kontrol edin.', PRODUCT_CARE.water] },
      { baslik: 'Metal hassasiyeti', paragraflar: [PRODUCT_CARE.allergy, 'Malzeme adı tek başına bitmiş ürünün nikel salınımı veya kişisel uygunluğu hakkında test sonucu değildir.'] },
    ],
  },
  {
    slug: 'taki-bakim-rehberi', baslik: 'Takı Bakım Rehberi: Temizlik ve Saklama',
    ozet: 'Takılarınızın yüzeyini korumak için günlük kullanım, nazik temizlik ve saklama önerileri.', tarih: '2026-09-01',
    bolumler: [
      { baslik: 'Günlük kullanım', paragraflar: [PRODUCT_CARE.water, 'Parfüm, saç spreyi ve temizlik ürünlerini takının üzerine uygulamayın. Takınızı sürtünme ve darbelerden koruyun.'] },
      { baslik: 'Temizlik', paragraflar: ['Yumuşak, aşındırıcı olmayan bir bez kullanın. Taşlı, yapıştırmalı veya kaplamalı ürünleri uzun süre suda bekletmeyin; ürüne özel bakım bilgilerini izleyin. Sert fırça ve aşındırıcı temizleyiciler yüzeyi çizebilir.'] },
      { baslik: 'Saklama', paragraflar: ['Takılarınızı kuru bir kutuda veya kumaş kesede, birbirine sürtünmeyecek şekilde saklayın. Kullanım sonrası nemini gidermek ve parçaları ayrı tutmak yüzeyin korunmasına yardımcı olur.'] },
    ],
  },
  {
    slug: '316l-celik-nedir', baslik: '316L Çelik Nedir? Takı Alırken Nelere Bakılmalı?',
    ozet: '316L paslanmaz çelik, kaplama bilgisi ve ürün seçerken kontrol edebileceğiniz özellikler.', tarih: '2026-09-01',
    bolumler: [
      { baslik: 'Malzeme adı ne anlatır?', paragraflar: ['316L, düşük karbonlu bir paslanmaz çelik sınıfıdır. Krom, nikel ve molibden içeren bir alaşımdır. L düşük karbonu ifade eder; nikel içermediği anlamına gelmez.', PRODUCT_CARE.allergy] },
      { baslik: 'Bitmiş ürünü değerlendirin', paragraflar: ['Cerrahi çelik veya 316L ifadesi tek başına takının steril, implant kullanımına uygun veya her cilt için güvenli olduğunu göstermez. Kaplama, taş, ölçü ve bakım bilgilerini ürün bazında değerlendirin.', 'Bir ürün hakkında belirtilmeyen malzeme veya ölçü bilgisi varsa sipariş vermeden önce iletişim sayfamızdan bize sorabilirsiniz.'] },
    ],
  },
  {
    slug: 'kupe-hijyeni-ve-yeni-delinmis-kulak', baslik: 'Küpe Seçimi: Hijyen ve Malzeme Bilgisi',
    ozet: 'Küpe alırken malzeme, koruyucu ambalaj ve kullanım amacını nasıl değerlendirebilirsiniz?', tarih: '2026-09-01',
    bolumler: [
      { baslik: 'Kullanım amacı', paragraflar: ['NOVELLA moda takıları için sterilite veya implant uygunluğu taahhüdü verilmez. Yeni delinmiş kulak ve iyileşme sürecindeki kullanım için ürün adından tıbbi uygunluk sonucu çıkarmayın; işlemi yapan yetkin uzmanın bakım ve ürün seçimi yönlendirmesini izleyin.', PRODUCT_CARE.allergy] },
      { baslik: 'Ambalaj ve iade', paragraflar: [RETURN_POLICY.hygiene, 'Ürün veya ambalajıyla ilgili sorun fark ederseniz sipariş numaranızla bize ulaşın. Ayrıntılı koşullar İade ve Cayma Hakkı sayfasındadır.'] },
    ],
  },
];
export function getRehberYazisi(slug: string): RehberYazisi | undefined { return REHBER_YAZILARI.find((y) => y.slug === slug); }
