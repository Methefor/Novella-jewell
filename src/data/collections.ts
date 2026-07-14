import type { CollectionSlug } from '@/types/product';

export interface Collection {
  slug: CollectionSlug;
  sehir: string;
  ton: string;
  hikaye: string;
  aciklamaKisa: string;
}

export const COLLECTIONS: Collection[] = [
  {
    slug: 'barcelona',
    sehir: 'Barcelona',
    ton: 'Sıcak · Cesur',
    hikaye:
      "Gaudí'nin şehrinde öğleden sonra, taş cepheler altına döner. Barcelona koleksiyonu o saatin ışığını taşır: sıcak, cesur, gözden kaçmayan. Bir kez takarsın, gün boyu güneşi üzerinde gezdirirsin.",
    aciklamaKisa: 'Akdeniz ısısını taşıyan cesur parçalar.',
  },
  {
    slug: 'stockholm',
    sehir: 'Stockholm',
    ton: 'Minimal · Sessiz',
    hikaye:
      "Kuzeyin ışığı azdır ama nettir. Stockholm koleksiyonu da öyle: ince hatlar, sessiz parlaklık, fazlalıksız zarafet. Kalabalıkta bağırmaz — yaklaşan görür.",
    aciklamaKisa: 'İnce hatlar, sessiz parlaklık, sonsuz uyum.',
  },
  {
    slug: 'paris',
    sehir: 'Paris',
    ton: 'Klasik · Romantik',
    hikaye:
      "Bazı şehirler modası geçmeyi reddeder. Paris koleksiyonu inciyi ve klasik formu bugüne taşır: annenizin takabileceği kadar zamansız, sizin takacağınız kadar güncel.",
    aciklamaKisa: 'Zamansız klasikler — her nesle uyar.',
  },
  {
    slug: 'klasikler',
    sehir: '',
    ton: 'Evrensel',
    hikaye:
      'Şehri olmayan parçalar da vardır — her yere ait oldukları için. Klasikler koleksiyonu motif, desen ve karakterini şehirden değil kendinden alan parçaları bir araya getirir.',
    aciklamaKisa: 'Her yere ait oldukları için hiçbir yere bağlı değiller.',
  },
];

export const getCollectionBySlug = (slug: CollectionSlug): Collection | undefined =>
  COLLECTIONS.find((c) => c.slug === slug);

export const getAllCollections = (): Collection[] => COLLECTIONS;
