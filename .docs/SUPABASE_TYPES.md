# Supabase TypeScript Tür Anlık Görüntüsü

Bu dosya, Supabase veritabanı şemasından `supabase gen types typescript` ile üretilen TypeScript türlerini barındırır. Şu an proje veritabanı olarak Neon Postgres ve Drizzle ORM kullanıldığı için gerçek Supabase türleri henüz üretilmemiştir.

> **Önemli:** Gerçek türleri `supabase gen types typescript` ile üretmeden önce kullanıcıdan onay alınmalıdır. `.env.*` dosyalarına dokunulmaz; `supabase` CLI ortam değişkenleri Vercel veya `.env.local` üzerinden okunur.

## Tür Üretim Komutu

Supabase proje kimliği (`<project-ref>`) ve bağlantı bilgileri bilindiğinde:

```bash
# Yerel Supabase projesi için
npx supabase gen types typescript --local > .docs/SUPABASE_TYPES.md

# Bağlı uzak proje için
npx supabase gen types typescript --project-id <project-ref> --schema public > .docs/SUPABASE_TYPES.md
```

## Yer Tutucu

Aşağıdaki blok, gerçek üretim sonrasında dosyanın tamamının değiştirileceğini belirtir. Şu anki `orders` tablosunun Drizzle karşılığı referans olarak bırakılmıştır.

```typescript
// TODO: supabase gen types typescript çıktısı ile değiştir.
// Şu anki orders tablosu (Drizzle/Neon) referansı:
export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string; // uuid
          order_no: string;
          status: 'pending' | 'paid' | 'failed';
          items: Array<{
            slug: string;
            ad: string;
            adet: number;
            birimFiyat: number;
          }>;
          total: string; // numeric
          customer: {
            adSoyad: string;
            email: string;
            telefon: string;
            adres: string;
            il: string;
            ilce?: string;
            not?: string;
          };
          shopier_payment_id: string | null;
          random_nr: string;
          created_at: string; // timestamp with time zone
          paid_at: string | null;
        };
      };
    };
  };
}
```

## Kullanım

Supabase istemcisi eklendiğinde, bu dosyadan üretilen türler `supabase.from<Database['public']['Tables']['orders']['Row']>('orders')` gibi çağrılarda kullanılabilir. Şu anki Drizzle tabanlı kod için `src/db/schema.ts` kaynak gerçekliği korunur.
