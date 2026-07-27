import type { CollectionSlug, ProductCategory, ProductColor } from '@/types/product';

const categoryNames = { yuzuk: 'Yüzük', bilezik: 'Bileklik', kupe: 'Küpe' };
const collectionNames = {
  barcelona: 'Barcelona',
  stockholm: 'Stockholm',
  paris: 'Paris',
  klasikler: 'Novella',
};
const colorNames = {
  altin: 'altın tonuyla',
  gumus: 'gümüş tonuyla',
  'rose-gold': 'rose gold tonuyla',
  siyah: 'siyah tonuyla',
  beyaz: 'aydınlık tonuyla',
  'cok-renkli': 'renkli detaylarıyla',
};

export function buildProductCopy(input: {
  detail: string;
  category: ProductCategory;
  collection: CollectionSlug;
  color: ProductColor;
}) {
  const detail = input.detail.trim().replace(/\.$/, '');
  const words = detail
    .split(/[\s,/-]+/)
    .filter((word) => word.length > 2)
    .slice(0, 3)
    .map((word) => word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1));
  const name = `${collectionNames[input.collection]} ${words.join(' ')} ${categoryNames[input.category]}`;
  const description =
    `${detail.charAt(0).toLocaleUpperCase('tr-TR') + detail.slice(1)} tasarımı, ` +
    `${colorNames[input.color]} stilinize zarif ama fark edilir bir karakter kazandırır. ` +
    `Tek başına güçlü bir görünüm sunarken diğer Novella parçalarıyla kolayca katmanlanır. ` +
    `316L paslanmaz çelik yapısı suya dayanıklı, kararmaya karşı dirençli ve günlük kullanım için uygundur.`;
  return { name, description };
}

