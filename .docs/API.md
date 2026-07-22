# API Dokümantasyonu

Bu belge, `src/app/api/**` altındaki Next.js Route Handler'larını listeler. Sadece sunucu tarafında çalışan uç noktalardır; doğrudan veritabanına veya gizli ortam değişkenlerine erişirler.

## Uç Noktalar

### `POST /api/checkout`

Sipariş oluşturur, veritabanına `pending` kaydeder ve PayTR iFrame ödeme formu URL'sini döner.

**İstek gövdesi (Zod şeması):**

```json
{
  "items": [
    {
      "productId": "string",
      "variantId": "string",
      "quantity": 1,
      "customization": "string (opsiyonel, max 60 karakter)"
    }
  ],
  "customer": {
    "name": "string (2-60 karakter)",
    "surname": "string (2-60 karakter)",
    "email": "string (e-posta)",
    "phone": "string (10-20 karakter)",
    "address": "string (10-400 karakter)",
    "city": "string (2-60 karakter)",
    "district": "string (2-60 karakter)",
    "note": "string (max 500 karakter, opsiyonel)"
  },
  "consent": {
    "sozlesme": true,
    "kvkk": true
  }
}
```

**Doğrulama:**

- `items` en az 1 öğe içermeli; her öğe `quantity` 1-20 arasında tam sayı.
- `consent.sozlesme` ve `consent.kvkk` `true` olmalı (Mesafeli Sözleşmeler Yönetmeliği m.6).
- Fiyat, kargo ve toplam client'tan alınmaz; `src/lib/checkout/buildOrder.ts` içinde sunucudaki `PRODUCTS` verisinden yeniden hesaplanır.

**Başarılı yanıt (200):**

```json
{
  "type": "iframe",
  "iframeUrl": "https://www.paytr.com/odeme/guvenli/{iframe_token}"
}
```

(Eski Shopier entegrasyonu `redirect` veya `form` da dönebilir; `OdemeClient` üçünü de destekler.)

**Olası hata yanıtları:**

| Durum Kodu | Anlamı                                                |
| ---------- | ----------------------------------------------------- |
| `400`      | Gövde geçersiz veya stok yetersiz.                    |
| `503`      | `DATABASE_URL` tanımlı değil; sipariş kaydedilemiyor. |
| `500`      | Ödeme başlatma sırasında beklenmeyen hata.            |

**Yetkilendirme:**

- Herkese açık uç nokta. Ödeme sağlayıcı kimlik bilgileri (`PAYTR_MERCHANT_ID`, `PAYTR_MERCHANT_KEY`, `PAYTR_MERCHANT_SALT`) sunucu tarafında okunur ve `NEXT_PUBLIC_` öneki taşımaz.

---

### `GET|POST /api/odeme/callback`

PayTR, ödeme sonucunu bu adrese (Bildirim URL) `POST` olarak bildirir. İmza doğrulanır; başarılıysa sipariş `paid` yapılır, onay e-postası gönderilir ve PayTR'e `OK` yanıtı döner. Müşterinin gördüğü başarı/hata sayfası ayrı olarak `merchant_ok_url` / `merchant_fail_url` ile ayarlanır.

**Parametreler (`application/x-www-form-urlencoded` body):**

- `merchant_oid`: Sipariş numarası (`order_no`).
- `status`: Ödeme durumu (`success` veya `failed`).
- `total_amount`: Tahsil edilen toplam tutar (100 ile çarpılmış, kuruş cinsinden).
- `payment_amount`: 1. adımda gönderilen sipariş tutarı (kuruş).
- `hash`: PayTR'den gelen HMAC-SHA256 imzası.
- `payment_type`: Ödeme şekli (`card` veya `eft`).
- `failed_reason_code` / `failed_reason_msg`: Başarısız işlemde neden (opsiyonel).
- Eski Shopier akışında `platform_order_id`, `payment_id`, `random_nr` gibi alanlar da desteklenir.

**İş akışı:**

1. Query string ve varsa form body parametreleri birleştirilir.
2. `provider.verifyCallback(params)` ile HMAC-SHA256 imzası kontrol edilir; başarısızsa imza hatası loglanır.
3. `status` değerine göre `markOrderPaid` veya `markOrderFailed` çalıştırılır.
4. `paid` durumuna ilk kez geçtiyse `sendOrderConfirmationEmail` çağrılır (hata olsa bile sipariş akışı kırılmaz).
5. PayTR sağlayıcısı aktifse düz `OK` metni döner; eski Shopier akışında `/odeme/sonuc` sayfasına yönlendirme yapılır.

**Olası yanıtlar / yönlendirmeler:**

| Durum           | Hedef                                                                    |
| --------------- | ------------------------------------------------------------------------ |
| PayTR başarılı  | `OK` metni (Bildirim URL yanıtı)                                         |
| PayTR başarısız | `OK` metni (sipariş `failed` yapılır)                                    |
| İmza hatası     | PayTR: `OK` döner, Shopier: `/odeme/sonuc?status=error&reason=signature` |

**Yetkilendirme:**

- Herkese açık uç nokta; güvenlik PayTR `hash` doğrulamasına dayanır.
- Aynı callback birden fazla gelirse idempotent davranır (`status='pending'` iken `paid` güncellemesi yalnızca bir kez etki eder).

## Genel Notlar

- Tüm API rotaları `NextRequest`/`NextResponse` ile Next.js App Router Route Handler olarak yazılmıştır.
- Hata durumlarında `console.error` ile sunucu loguna ayrıntı yazılır; müşteriye genel, güvenli mesajlar döner.
- Yeni bir ödeme sağlayıcısı eklendiğinde `src/lib/checkout/index.ts` değiştirilir ve bu belge güncellenir.
