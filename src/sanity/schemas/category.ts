// sanity/schemas/category.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'category',
  title: 'Kategoriler',
  type: 'document',
  icon: () => '📁',
  fields: [
    // Kategori Adı
    defineField({
      name: 'name',
      title: 'Kategori Adı',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    
    // Slug
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
    
    // Açıklama
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
    }),
    
    // Kategori Görseli
    defineField({
      name: 'image',
      title: 'Kategori Görseli',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    
    // Sıralama
    defineField({
      name: 'order',
      title: 'Sıralama',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    
    // Ana Sayfada Göster
    defineField({
      name: 'showOnHomepage',
      title: 'Ana Sayfada Göster',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
});