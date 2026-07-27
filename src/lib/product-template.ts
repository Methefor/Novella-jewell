import type {
  CollectionSlug,
  ProductCategory,
  ProductMaterial,
} from '@/types/product';

export const NOVELLA_CORE_FEATURES = [
  '316L paslanmaz çelik',
  'Suya dayanıklı',
  'Kararmaya karşı dirençli',
  'Günlük kullanıma uygun',
] as const;

export const NOVELLA_CARE_NOTE =
  'Parfüm, saç spreyi ve yoğun kimyasallarla doğrudan teması azaltın. Kullanım sonrası yumuşak, kuru bir bezle silerek kutusunda saklayın.';

export const DEFAULT_PRODUCT_TEMPLATE: {
  category: ProductCategory;
  collection: CollectionSlug;
  material: ProductMaterial;
  features: string[];
} = {
  category: 'yuzuk',
  collection: 'klasikler',
  material: 'celik',
  features: [...NOVELLA_CORE_FEATURES],
};

