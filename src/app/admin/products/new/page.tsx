'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    featured: false,
    bestseller: false,
    new: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement Sanity product creation
      // For now, just redirect
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? value === ''
            ? ''
            : Number(value)
          : value,
    }));
  };

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/admin/products"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-cormorant text-4xl font-bold text-white md:text-5xl">
            Yeni Ürün Ekle
          </h1>
          <p className="mt-2 font-inter text-white/60">
            Sanity CMS üzerinden ürün ekleyin
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-6 font-cormorant text-xl font-semibold text-white">
            Temel Bilgiler
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                Ürün Adı *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                placeholder="Örn: Minimal Çelik Kolye"
              />
            </div>

            <div>
              <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                placeholder="minimal-celik-kolye"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                Açıklama
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                placeholder="Ürün açıklaması..."
              />
            </div>

            <div>
              <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                Fiyat (₺) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                placeholder="299"
              />
            </div>

            <div>
              <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                Kategori *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-inter text-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              >
                <option value="">Kategori seçin</option>
                <option value="Kolye">Kolye</option>
                <option value="Bilezik">Bilezik</option>
                <option value="Küpe">Küpe</option>
                <option value="Yüzük">Yüzük</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-inter text-sm font-medium text-white/80">
                Stok Miktarı
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="glass w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="mb-6 font-cormorant text-xl font-semibold text-white">
            Özellikler
          </h2>

          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-5 w-5 rounded border-white/20 text-gold focus:ring-gold"
              />
              <span className="font-inter text-white/80">Öne Çıkan Ürün</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="bestseller"
                checked={formData.bestseller}
                onChange={handleChange}
                className="h-5 w-5 rounded border-white/20 text-gold focus:ring-gold"
              />
              <span className="font-inter text-white/80">Çok Satan</span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="new"
                checked={formData.new}
                onChange={handleChange}
                className="h-5 w-5 rounded border-white/20 text-gold focus:ring-gold"
              />
              <span className="font-inter text-white/80">Yeni Ürün</span>
            </label>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 font-cormorant text-xl font-semibold text-white">
            Görseller
          </h2>
          <p className="mb-4 font-inter text-sm text-white/60">
            Görseller Sanity Studio üzerinden yüklenmelidir.
          </p>
          <a
            href="https://sanity.io/manage"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gold/20 border border-gold/30 px-4 py-2 font-inter text-sm font-medium text-gold transition-all hover:bg-gold/30"
          >
            Sanity Studio'yu Aç
          </a>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/products"
            className="rounded-lg bg-white/5 px-6 py-3 font-inter font-medium text-white/70 transition-all hover:bg-white/10"
          >
            İptal
          </Link>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className="flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 font-inter font-semibold text-black transition-all hover:shadow-lg hover:shadow-gold/30 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
          </motion.button>
        </div>
      </form>
    </div>
  );
}

