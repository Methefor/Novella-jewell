# Katkı Rehberi

Novella Jewell ticari bir projedir. Katkılar, depo sahibi tarafından yetkilendirilen kişilerce yapılır.

## Geliştirme akışı

1. Güncel `main` dalından kısa ve açıklayıcı bir çalışma dalı oluşturun.
2. Değişikliği tek bir sorumluluk etrafında tutun.
3. Gizli anahtar, müşteri verisi veya üretim verisi eklemeyin.
4. Aşağıdaki kontrolleri çalıştırın:

```bash
npm run lint
npm run type-check
npm run build
```

5. Veritabanı değişikliklerinde Drizzle migration dosyasını da ekleyin.
6. Kullanıcı arayüzü değişikliklerinde mobil ve masaüstü görünümü doğrulayın.
7. Pull request açıklamasında amaç, kapsam, doğrulama ve varsa dağıtım etkisini belirtin.

## Commit biçimi

Kısa, emir kipinde ve değişikliğin amacını anlatan Conventional Commit başlıkları tercih edilir:

```text
feat: add campaign content drafts
fix: preserve product image order
docs: refresh repository guide
```

## Ürün görselleri

- Gerçek ürünün biçimi, rengi ve yüzey ayrıntıları değiştirilmez.
- Ana görsel seçimi katalog ve reklam kullanımına uygun olmalıdır.
- Görseller sıkıştırılır; gereksiz büyük dosyalar depoya eklenmez.
- Eksik veya düşük kaliteli görselli ürünler reklama hazır kabul edilmez.

## Veritabanı ve ödeme güvenliği

- Fiyat ve stok bilgisi ödeme sırasında sunucuda yeniden doğrulanır.
- `NEXT_PUBLIC_` önekli değişkenlerde secret tutulmaz.
- Migration dosyaları silinmez veya geçmişe dönük değiştirilmez; yeni migration eklenir.
- Ödeme callback rotalarında bütünlük kontrolü atlanmaz.

## İnceleme ölçütleri

Bir değişiklik; iş kuralı, güvenlik, erişilebilirlik, performans, SEO ve mobil deneyim açısından incelenir.
