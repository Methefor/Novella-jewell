# Sanity Schema Tanımları

Bu dosya Sanity Studio'da oluşturulacak schema'ları içerir.

## Sanity Studio Kurulumu

```bash
npm install -g @sanity/cli
sanity init
```

Veya mevcut projeye eklemek için:
```bash
npx sanity init
```

## Product Schema

```javascript
// schemas/product.js
export default {
  name: 'product',
  title: 'Ürün',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Ürün Adı',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 4
    },
    {
      name: 'price',
      title: 'Fiyat (₺)',
      type: 'number',
      validation: Rule => Rule.required().positive()
    },
    {
      name: 'category',
      title: 'Kategori',
      type: 'reference',
      to: [{type: 'category'}],
      validation: Rule => Rule.required()
    },
    {
      name: 'images',
      title: 'Görseller',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      validation: Rule => Rule.min(1)
    },
    {
      name: 'stock',
      title: 'Stok Miktarı',
      type: 'number',
      initialValue: 0
    },
    {
      name: 'featured',
      title: 'Öne Çıkan',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'bestseller',
      title: 'Çok Satan',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'new',
      title: 'Yeni Ürün',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'seoTitle',
      title: 'SEO Başlık',
      type: 'string'
    },
    {
      name: 'seoDescription',
      title: 'SEO Açıklama',
      type: 'text',
      rows: 3
    }
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      category: 'category.name'
    },
    prepare({title, media, category}) {
      return {
        title,
        media,
        subtitle: category
      }
    }
  }
}
```

## Category Schema

```javascript
// schemas/category.js
export default {
  name: 'category',
  title: 'Kategori',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Kategori Adı',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3
    }
  ]
}
```

## Schema Index

```javascript
// schemas/index.js
import product from './product'
import category from './category'

export const schemaTypes = [product, category]
```

## Sanity Config

```javascript
// sanity.config.js
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'NOVELLA Jewelry',

  projectId: 'YOUR_PROJECT_ID',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
```

