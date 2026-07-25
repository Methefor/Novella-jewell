# Abonelikler ve Maliyet Takibi

Bu dosya, Novella Jewell projesinin üçüncü taraf hizmet maliyetlerini, yenileme tarihlerini ve önemli notlarını tutar. Yeni bir hizmet eklendiğinde veya fiyat değiştiğinde burayı güncelle.

| Hizmet                             | Amaç                                          | Maliyet                                | Yenileme | Notlar                                                                                                                         |
| ---------------------------------- | --------------------------------------------- | -------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Vercel**                         | Next.js uygulamasının barındırılması ve CI/CD | Hobby (0₺) / Pro (aylık)               | —        | Şu an Hobby plan; trafik arttığında Pro'ya geçilebilir.                                                                        |
| **Neon Postgres (Vercel Storage)** | Siparişlerin kalıcı veritabanı                | Vercel Storage fiyatlandırması (aylık) | —        | `DATABASE_URL` üzerinden Vercel tarafından otomatik sağlanır.                                                                  |
| **Resend**                         | Sipariş onay e-postası                        | **0₺ — free tier** (günde 100 e-posta) | —        | Domain doğrulaması yapılınca gönderici adresi `lib/config.ts` > `EMAIL.from` tek satırda değişir.                              |
| **PayTR**                          | Ödeme altyapısı                               | Komisyon başına (mağaza anlaşmalı)     | —        | `PAYTR_MERCHANT_ID`, `PAYTR_MERCHANT_KEY`, `PAYTR_MERCHANT_SALT` Vercel env'de tutulur. `NEXT_PUBLIC_` öneki asla kullanılmaz. |
| **Domain (Namecheap / registrar)** | Marka domaini                                 | ~$11.25 / yıl                          | Yıllık   | Domain alındığında `NEXT_PUBLIC_SITE_URL` Vercel'de gerçek adrese güncellenir.                                                 |

## Güvenlik notları

- API anahtarları ve secret'lar `.env.local` ve Vercel Environment Variables'da tutulur; depoda (`.env.example` hariç) asla yazılmaz.
- `NEXT_PUBLIC_` önekli değişkenler tarayıcı bundle'ına gömülür. Bu yüzden `PAYTR_MERCHANT_KEY` ve `PAYTR_MERCHANT_SALT` gibi secret'lar `NEXT_PUBLIC_` öneksiz tanımlanır.
- Eski dark/gold site env çöplüğünden kalan `NEXT_PUBLIC_SHOPIER_API_KEY` gibi değişkenler Vercel'den en kısa sürede kaldırılmalıdır.
