// sanity/schemas/product.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Ürünler',
  type: 'document',
  icon: () => '💎',
  fields: [
    // Ürün Adı
    defineField({
      name: 'name',
      title: 'Ürün Adı',
      type: 'string',
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    
    // Slug (URL için)
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    
    // Kategori
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    
    // Fiyat
    defineField({
      name: 'price',
      title: 'Fiyat (TL)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    
    // İndirimli Fiyat
    defineField({
      name: 'originalPrice',
      title: 'Eski Fiyat (İndirim varsa)',
      type: 'number',
      validation: (Rule) => Rule.positive(),
    }),
    
    // Ürün Görselleri (Çoklu)
    defineField({
      name: 'images',
      title: 'Ürün Görselleri',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true, // Crop için
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1).max(10),
    }),
    
    // Malzeme
    defineField({
      name: 'material',
      title: 'Malzeme',
      type: 'string',
      options: {
        list: [
          { title: 'Çelik', value: 'steel' },
          { title: 'Altın Kaplama', value: 'gold-plated' },
          { title: 'Gümüş Kaplama', value: 'silver-plated' },
          { title: 'Rose Gold Kaplama', value: 'rose-gold-plated' },
          { title: 'Paslanmaz Çelik', value: 'stainless-steel' },
          { title: 'Pirinç', value: 'brass' },
        ],
      },
    }),
    
    // Açıklama
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.max(500),
    }),
    
    // Detaylı Açıklama (Zengin Metin)
    defineField({
      name: 'detailedDescription',
      title: 'Detaylı Açıklama',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    
    // Varyantlar (Renk, Beden vb)
    defineField({
      name: 'variants',
      title: 'Varyantlar',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'id',
              title: 'Varyant ID',
              type: 'string',
            },
            {
              name: 'color',
              title: 'Renk',
              type: 'string',
              options: {
                list: [
                  { title: 'Altın', value: 'gold' },
                  { title: 'Gümüş', value: 'silver' },
                  { title: 'Rose Gold', value: 'rose-gold' },
                  { title: 'Siyah', value: 'black' },
                ],
              },
            },
            {
              name: 'size',
              title: 'Beden/Ölçü',
              type: 'string',
            },
            {
              name: 'stock',
              title: 'Stok',
              type: 'number',
              validation: (Rule) => Rule.min(0),
            },
            {
              name: 'sku',
              title: 'SKU',
              type: 'string',
            },
          ],
        },
      ],
    }),
    
    // Toplam Stok
    defineField({
      name: 'totalStock',
      title: 'Toplam Stok',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    
    // Öne Çıkan Ürün
    defineField({
      name: 'featured',
      title: 'Öne Çıkan',
      type: 'boolean',
      initialValue: false,
    }),
    
    // Yeni Ürün
    defineField({
      name: 'isNew',
      title: 'Yeni Ürün',
      type: 'boolean',
      initialValue: false,
    }),
    
    // En Çok Satan
    defineField({
      name: 'isBestSeller',
      title: 'En Çok Satan',
      type: 'boolean',
      initialValue: false,
    }),
    
    // Kişiselleştirilebilir
    defineField({
      name: 'isCustomizable',
      title: 'Kişiselleştirilebilir',
      type: 'boolean',
      initialValue: false,
    }),
    
    // Değerlendirme (Rating)
    defineField({
      name: 'rating',
      title: 'Ortalama Puan',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5),
    }),
    
    // Yorum Sayısı
    defineField({
      name: 'reviewCount',
      title: 'Yorum Sayısı',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    
    // Özellikler (Bullet Points)
    defineField({
      name: 'features',
      title: 'Özellikler',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    
    // SEO - Meta Title
    defineField({
      name: 'metaTitle',
      title: 'SEO Başlık',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    
    // SEO - Meta Description
    defineField({
      name: 'metaDescription',
      title: 'SEO Açıklama',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    
    // Yayın Durumu
    defineField({
      name: 'status',
      title: 'Durum',
      type: 'string',
      options: {
        list: [
          { title: 'Taslak', value: 'draft' },
          { title: 'Yayında', value: 'published' },
          { title: 'Stokta Yok', value: 'out-of-stock' },
          { title: 'Arşiv', value: 'archived' },
        ],
      },
      initialValue: 'draft',
    }),
  ],
  
  // Önizleme Ayarları
  preview: {
    select: {
      title: 'name',
      subtitle: 'category.name',
      media: 'images.0',
      price: 'price',
    },
    prepare(selection) {
      const { title, subtitle, price } = selection;
      return {
        title,
        subtitle: `${subtitle} - ${price}₺`,
        media: selection.media,
      };
    },
  },
});