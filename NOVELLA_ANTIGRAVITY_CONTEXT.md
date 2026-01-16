# NOVELLA PREMIUM JEWELRY - ANTIGRAVITY PROJECT CONTEXT

## 🎯 PROJECT STATUS: ACTIVE DEVELOPMENT

**Last Updated:** 2025-01-08  
**Current Phase:** Sanity Integration + Code Refactoring  
**Next Milestone:** Connect Sanity to Frontend

---

## 📊 PROJECT OVERVIEW

**Brand:** NOVELLA  
**Tagline:** Her Parça Bir Hikaye (Every Piece is a Story)  
**Business:** Premium jewelry e-commerce  
**Target:** Women 18-60 years old  
**Style:** Minimalist, warm, luxury but accessible

### **Platform Distribution**
- Instagram: 40% (organic reach)
- Shopier: 30% (main sales)
- Website: 20% (premium showcase)
- TikTok: 10% (GenZ engagement)

### **Links**
- Website: https://github.com/Methefor/Novella-bestsite
- Instagram: https://www.instagram.com/jewelry.novella/
- Shopier: https://www.shopier.com/novellatr

---

## 🛠️ TECH STACK

### **Frontend**
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Animations:** Anime.js (6KB, replacing Framer Motion)

### **Backend & CMS**
- **CMS:** Sanity.io v4 ✅ INSTALLED
- **Project ID:** Check .env.local
- **Dataset:** production (public)
- **Studio Route:** /admin

### **Current Data Sources**
- **Products:** Google Sheets → JSON sync (16 products)
- **Transitioning to:** Sanity CMS (in progress)

---

## 📁 PROJECT STRUCTURE

```
Novella-bestsite/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage
│   │   ├── products/                   # Product pages
│   │   │   └── [slug]/                # Dynamic product detail
│   │   ├── admin/                      # Sanity Studio ✅
│   │   │   └── [[...tool]]/
│   │   └── api/
│   ├── components/
│   │   ├── sections/
│   │   │   ├── FeaturedProducts.tsx   # ⚠️ NEEDS FIX
│   │   │   └── ...
│   │   └── ui/
│   ├── data/
│   │   ├── products.json              # Google Sheets sync
│   │   └── products.ts                # ⚠️ NEEDS REFACTOR
│   ├── lib/                            # Utils
│   ├── sanity/
│   │   ├── schemas/                   # ✅ READY
│   │   │   ├── product.ts
│   │   │   ├── category.ts
│   │   │   └── index.ts
│   │   ├── schemaTypes/               # ✅ CONFIGURED
│   │   │   └── index.ts
│   │   ├── env.ts
│   │   └── structure.ts
│   └── types/
├── scripts/
│   └── sync-products.ts              # Google Sheets sync
├── public/
│   └── products/                     # Product images
├── .env.local                        # ✅ Sanity credentials added
└── sanity.config.ts                  # ✅ Configured
```

---

## 🚨 CURRENT ISSUES

### **Priority 1: Import Errors** (URGENT)

**File:** `src/data/products.ts`

**Errors:**
```typescript
// FeaturedProducts.tsx
Attempted import error: 'getBestSellers' is not exported

// products/[slug]/page.tsx
Attempted import error: 'PRODUCTS' is not exported
```

**Required Exports:**
```typescript
export const PRODUCTS: Product[]
export function getBestSellers(limit?: number): Product[]
export function getNewArrivals(limit?: number): Product[]
export function getProductBySlug(slug: string): Product | undefined
export function getProductsByCategory(category: string): Product[]
export function getAllProducts(): Product[]
```

---

### **Priority 2: Sanity Integration** (NEXT)

**Required Files:**

1. **`src/lib/sanity.ts`** - Sanity client
```typescript
import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const builder = imageUrlBuilder(client)
export const urlFor = (source: any) => builder.image(source)
```

2. **`src/lib/sanity-queries.ts`** - GROQ queries
```typescript
import { client } from './sanity'

export async function getAllProducts() {
  return client.fetch(`
    *[_type == "product" && status == "published"] | order(_createdAt desc) {
      _id,
      name,
      slug,
      price,
      originalPrice,
      "category": category->name,
      "images": images[].asset->url,
      description,
      material,
      featured,
      isNew,
      isBestSeller,
      rating,
      reviewCount,
      totalStock
    }
  `)
}

export async function getBestSellers(limit = 8) {
  return client.fetch(`
    *[_type == "product" && isBestSeller == true && status == "published"] 
    | order(reviewCount desc) [0...${limit}] {
      // ... same fields
    }
  `)
}

// ... more queries
```

3. **Update `src/data/products.ts`** - Use Sanity
```typescript
import { getAllProducts, getBestSellers as getSanityBestSellers } from '@/lib/sanity-queries'

// Cache strategy
export async function getBestSellers(limit = 8) {
  return getSanityBestSellers(limit)
}

// ... update all functions
```

---

## 🎨 DESIGN SYSTEM

### **Color Palette**
```css
--lux-gold: #C9A961        /* Primary accent */
--rose-gold: #B8847E       /* Secondary accent */
--cream: #F5F2ED           /* Background */
--cream-light: #FDFBF8     /* Cards */
--charcoal: #2A2827        /* Text */
--gray-warm: #857F7A       /* Secondary text */
```

### **Typography**
- **Headings:** Playfair Display (elegant serif)
- **Body:** Inter (modern sans-serif)
- **Labels:** Montserrat (uppercase, spaced)

### **Animations (Anime.js)**
```javascript
import anime from 'animejs'

// Premium hover effect
anime({
  targets: '.product-card',
  scale: 1.05,
  boxShadow: '0 20px 60px rgba(201, 169, 97, 0.3)',
  duration: 400,
  easing: 'easeOutCubic'
})

// Scroll reveal
anime({
  targets: '.reveal',
  translateY: [60, 0],
  opacity: [0, 1],
  easing: 'easeOutExpo',
  duration: 1200,
  delay: anime.stagger(100)
})
```

---

## 🎯 NEXT TASKS (PRIORITY ORDER)

### **IMMEDIATE (Today)**
- [x] Sanity installed
- [x] Schemas created (product, category)
- [ ] Fix products.ts exports ← **YOU ARE HERE**
- [ ] Create sanity.ts client
- [ ] Create sanity-queries.ts
- [ ] Test Sanity admin panel

### **THIS WEEK**
- [ ] Migrate products.ts to Sanity
- [ ] Add Anime.js animations
- [ ] Update homepage with Sanity data
- [ ] Optimize images with Cloudinary
- [ ] SEO metadata automation

### **NEXT WEEK**
- [ ] Shopier webhook integration
- [ ] Instagram feed sync
- [ ] Real-time stock updates
- [ ] Order tracking system

---

## 💡 ANTIGRAVITY USAGE GUIDE

### **Effective Prompts**

✅ **Good Examples:**
```
@src/data/products.ts dosyasını düzelt. getBestSellers ve PRODUCTS export'ları ekle.

@src/lib/sanity.ts oluştur. Sanity client ve image URL builder ekle. TypeScript tipli.

@src/components/sections/Hero.tsx'e anime.js ile fade-in animasyon ekle.
```

❌ **Bad Examples:**
```
Ürün sayfası yap (too vague)
Animasyon ekle (not specific)
Bir şey yanlış (no context)
```

### **File References**
Always use `@filepath` syntax:
```
@src/data/products.ts
@src/app/page.tsx
@sanity/schemas/product.ts
```

### **Code Style Preferences**
- TypeScript strict mode
- Async/await over promises
- Descriptive variable names
- JSDoc comments for complex functions
- Premium UX patterns
- Performance-first

---

## 🔑 ENVIRONMENT VARIABLES

```bash
# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google Sheets (current data source)
GOOGLE_SHEETS_CREDENTIALS=...
GOOGLE_SHEET_ID=1Ucj_cDanLCKSXrgb4_1w0luDOmUHdBM0DTvsyI6D-Gw

# Sanity (✅ configured)
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=...

# Shopier (pending)
SHOPIER_API_KEY=
SHOPIER_API_SECRET=

# Instagram (pending)
INSTAGRAM_ACCESS_TOKEN=
```

---

## 📦 INSTALLED PACKAGES

```json
{
  "dependencies": {
    "next": "15.1.3",
    "react": "19.x",
    "typescript": "^5",
    "tailwindcss": "^3",
    "zustand": "^4",
    "animejs": "^3.2.2",
    "sanity": "^4.22.0",
    "@sanity/vision": "^4.22.0",
    "@sanity/image-url": "^1",
    "next-sanity": "^11.6.12"
  }
}
```

---

## 🚀 COMMON COMMANDS

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build           # Production build
npm run lint            # Check code quality

# Data sync
npm run sync            # Sync from Google Sheets

# Sanity
# Admin panel: http://localhost:3000/admin

# Testing
npm run type-check      # TypeScript validation
```

---

## 🆘 TROUBLESHOOTING

### **Issue: Import errors**
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### **Issue: Sanity connection failed**
Check `.env.local` for correct credentials

### **Issue: Build warnings**
These are expected (Next.js 15 + React 19 compatibility)

---

## 📈 SUCCESS METRICS

### **Technical**
- [x] Next.js 15 setup
- [x] Sanity integration
- [ ] Zero TypeScript errors
- [ ] Lighthouse score 95+
- [ ] Build time < 30s

### **Business**
- Google Sheets: 16 products
- Target: 200+ products
- Admin efficiency: < 2 min to add product
- Image optimization: < 100KB per image

---

## 🎬 CONVERSATION STARTERS

When starting a new Antigravity conversation:

```
NOVELLA projesinde çalışıyorum. 
@NOVELLA_ANTIGRAVITY_CONTEXT.md dosyasını context olarak oku.

[Your specific task here]
```

---

**STATUS:** Ready for active development 🚀  
**FOCUS:** Fix products.ts exports → Sanity integration → Anime.js animations