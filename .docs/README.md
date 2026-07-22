# `.docs/` — Proje Bilgi Tabanı

Bu klasör, Novella Jewell projesine dair mimari kararları, API dokümantasyonunu, veritabanı tür anlık görüntüsünü ve geliştirme/ dağıtım çalışma kitaplıklarını barındırır. Amaç: yeni geliştiricilerin (ve yapay zeka yardımcılarının) projeye hızlı bağlam kazanması ve büyük değişiklikler öncesinde doğru kaynaklara başvurulmasıdır.

> **Güvenlik notu:** Bu dosyalarda API anahtarı, şifre, token veya `.env.*` içeriği asla saklanmaz. Sadece ortam değişkeni adları ve yapılandırma açıklamaları yazılır.

## Dosyalar

| Dosya               | Amaç                                                                                                                 | Ne Zaman Güncellenir                                                      |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `ARCHITECTURE.md`   | Sistem genel görünümü, teknoloji yığını, klasör yapısı ve veri erişim kuralları.                                     | Yeni bir veri katmanı, rota veya önemli bir yapısal değişiklik yapılınca. |
| `API.md`            | `src/app/api/**` altındaki rota işleyicilerinin listesi, yöntemleri ve yetkilendirme notları.                        | Yeni API rotası eklenince, var olanının sözleşmesi değişince.             |
| `SUPABASE_TYPES.md` | Supabase TypeScript tür anlık görüntüsü için yer tutucu. Gerçek türler `supabase gen types typescript` ile üretilir. | Supabase şeması/türleri güncellenince.                                    |
| `WORKFLOWS.md`      | CI/CD, dağıtım ve veritabanı göçü çalışma kitaplığı.                                                                 | Yeni bir script, dağıtım adımı veya göç prosedürü eklenince.              |
| `DECISIONS.md`      | Mimari karar kayıtları (ADR). Yeni bir önemli teknik seçim yapılınca ekleme yapılır.                                 | Karar değişirse veya yeni ADR eklenince.                                  |
| `02-abonelikler.md` | Üçüncü taraf hizmet maliyetleri ve yenileme takibi.                                                                  | Yeni abonelik, fiyat değişikliği veya yenileme tarihi değişince.          |

## Kullanım

1. **Projeye ilk başlayanlar** önce `ARCHITECTURE.md`, ardından `API.md` okumalıdır.
2. **Şema veya API sorusu** varsa `@.docs/ARCHITECTURE.md`, `@.docs/SUPABASE_TYPES.md` veya `@.docs/API.md` referans alınır.
3. **Kod değişikliği öncesi** `.docs/` içinde ilgili dosyanın güncel olup olmadığı kontrol edilir; güncellenmiyorsa commit açıklamasında belirtilir.
4. **Yeni belge eklenirken** bu `README.md`daki tablo da güncellenir.

## İlgili Kurallar

- `.windsurfrules` dosyasındaki bağlam ve bilgi tabanı kuralları geçerlidir.
- Commit önerisi öncesi `npm run lint` ve `npm run type-check` çalıştırılır.
