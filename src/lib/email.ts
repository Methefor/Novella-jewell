import type { OrderRow } from '@/db/schema';
import { EMAIL, SITE } from '@/lib/config';
import { CAYMA_SURESI_GUN, COMPANY, TESLIMAT_SURESI_GUN } from '@/lib/legal';
import { getProductBySlug } from '@/lib/products';
import { Resend } from 'resend';

/**
 * Sipariş onay e-postası — Resend.
 *
 * RESEND_API_KEY yoksa sessizce atlar (loglar). Gönderim başarısız olursa
 * hata fırlatır ama ÇAĞIRAN try/catch ile sarar — sipariş akışı e-posta
 * yüzünden asla kırılmaz (Mesafeli Sözleşmeler m.7 gereği kalıcı bildirim
 * hedeflenir ama ödeme akışının bütünlüğü önceliklidir).
 *
 * ⚠️ Domain doğrulaması yokken Resend test göndericisi yalnızca hesap
 * sahibinin e-postasına teslim eder. Bkz. lib/config.ts EMAIL.from
 */
export async function sendOrderConfirmationEmail(
  order: OrderRow
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY yok — onay e-postası atlandı', {
      orderNo: order.orderNo,
    });
    return;
  }

  const resend = new Resend(apiKey);
  const c = order.customer;

  const subtotal = order.items.reduce(
    (sum, i) => sum + i.birimFiyat * i.adet,
    0
  );
  const total = Number(order.total);
  const rawShipping = total - subtotal;
  const shipping = rawShipping > 1 ? rawShipping : 0;
  const orderDate = new Date(order.createdAt).toLocaleDateString('tr-TR');

  const itemRows = order.items.map((i) => buildItemRow(i)).join('');

  const waLink = `https://api.whatsapp.com/send?phone=${SITE.whatsapp}&text=${encodeURIComponent(
    `Merhaba! Siparişim hakkında bilgi almak istiyorum. Sipariş no: ${order.orderNo}`
  )}`;
  const instagramLink = SITE.instagram;
  const supportEmail = COMPANY.email.trim() || '';

  const html = `<!doctype html>
<html lang="tr">
<body style="margin:0;background:#FAF8F5;font-family:Inter,-apple-system,Segoe UI,sans-serif;color:#1A1712">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding:40px 16px">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background:#FAF8F5">

          <!-- Başlık -->
          <tr>
            <td style="padding-bottom:24px;border-bottom:1px solid #E7DFD0">
              <div style="font-family:Georgia,serif;font-size:18px;letter-spacing:8px;color:#9E8E63;text-transform:uppercase">NOVELLA</div>
            </td>
          </tr>

          <!-- Teşekkür -->
          <tr>
            <td style="padding:28px 0 18px">
              <h1 style="font-family:Georgia,serif;font-weight:400;font-size:28px;margin:0 0 10px;color:#1A1712">Siparişiniz alındı</h1>
              <p style="color:#6B6252;margin:0;line-height:1.6">Teşekkür ederiz. Ödemeniz onaylandı ve siparişiniz hazırlanmaya başladı.</p>
            </td>
          </tr>

          <!-- Sipariş numarası -->
          <tr>
            <td style="padding:18px 20px;background:#fff;border:1px solid #E7DFD0;border-radius:12px">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#9A907D">Sipariş numarası / Tarih</p>
              <p style="margin:0 0 6px;font-size:22px;font-weight:600;color:#1A1712">${order.orderNo}</p>
              <p style="margin:0;font-size:13px;color:#6B6252">${orderDate}</p>
            </td>
          </tr>

          <!-- Ürün tablosu -->
          <tr>
            <td style="padding-top:20px">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#fff;border:1px solid #E7DFD0;border-radius:12px;overflow:hidden">
                <thead>
                  <tr>
                    <th align="left" style="padding:16px 18px;border-bottom:1px solid #E7DFD0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9A907D;font-weight:500">Ürün</th>
                    <th align="right" style="padding:16px 18px;border-bottom:1px solid #E7DFD0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#9A907D;font-weight:500;width:100px">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Özet -->
          <tr>
            <td style="padding-top:20px">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#fff;border:1px solid #E7DFD0;border-radius:12px">
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #E7DFD0">
                    <span style="color:#6B6252">Ara toplam</span>
                    <span style="float:right;color:#1A1712">${formatTRY(subtotal)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #E7DFD0">
                    <span style="color:#6B6252">Kargo</span>
                    <span style="float:right;color:#1A1712">${shipping === 0 ? 'Ücretsiz' : formatTRY(shipping)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px">
                    <span style="color:#1A1712;font-weight:600">Toplam</span>
                    <span style="float:right;color:#1A1712;font-weight:600;font-size:18px">${formatTRY(total)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Adres -->
          <tr>
            <td style="padding-top:20px">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#fff;border:1px solid #E7DFD0;border-radius:12px">
                <tr>
                  <td style="padding:18px">
                    <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#9A907D">Teslimat adresi</p>
                    <p style="margin:0;color:#1A1712;line-height:1.6;font-size:14px">
                      <strong>${c.adSoyad}</strong><br>
                      ${c.adres}<br>
                      ${c.ilce ? c.ilce + ' / ' : ''}${c.il}<br>
                      ${c.telefon}
                    </p>
                    ${c.not ? `<p style="margin:12px 0 0;color:#6B6252;font-size:13px"><strong>Sipariş notu:</strong> ${escapeHtml(c.not)}</p>` : ''}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sıradaki adımlar -->
          <tr>
            <td style="padding-top:20px">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#FBF9F5;border:1px solid #E7DFD0;border-radius:12px">
                <tr>
                  <td style="padding:18px">
                    <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#9A907D">Sıradaki adımlar</p>
                    <p style="margin:0 0 6px;color:#1A1712;font-size:14px">✓ Sipariş alındı</p>
                    <p style="margin:0 0 6px;color:#6B6252;font-size:14px">○ Sipariş hazırlanıyor</p>
                    <p style="margin:0 0 6px;color:#6B6252;font-size:14px">○ Kargoya veriliyor</p>
                    <p style="margin:0;color:#6B6252;font-size:14px">○ Teslimat</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Destek -->
          <tr>
            <td style="padding-top:24px;text-align:center">
              <p style="margin:0 0 14px;color:#6B6252;font-size:14px">Siparişiniz hakkında güncelleme almak veya bilgi için:</p>
              <a href="${waLink}" style="display:inline-block;background:#0A0A0A;color:#fff;text-decoration:none;padding:13px 26px;border-radius:999px;font-size:14px;font-weight:500;margin-bottom:10px">WhatsApp&apos;tan yazın</a>
              ${supportEmail ? `<p style="margin:10px 0 0;font-size:13px"><a href="mailto:${supportEmail}" style="color:#9E8E63;text-decoration:none">${supportEmail}</a></p>` : ''}
              <p style="margin:8px 0 0;font-size:13px"><a href="${instagramLink}" style="color:#9E8E63;text-decoration:none">Instagram: @jewelry.novella</a></p>
            </td>
          </tr>

          <!-- Yasal not -->
          <tr>
            <td style="padding-top:28px;border-top:1px solid #E7DFD0">
              <p style="margin:0;color:#9A907D;font-size:12px;line-height:1.6">
                Cayma hakkınız ${CAYMA_SURESI_GUN} gündür. Tahmini teslimat süresi en fazla ${TESLIMAT_SURESI_GUN} iş günüdür.
                Ürün tesliminden sonra iade/değişim taleplerinizi WhatsApp üzerinden iletebilirsiniz.
              </p>
              <p style="margin:14px 0 0;color:#9A907D;font-size:12px">${SITE.name} · ${SITE.tagline}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await resend.emails.send({
    from: EMAIL.from,
    to: c.email,
    subject: `Siparişiniz alındı — ${order.orderNo}`,
    html,
  });
}

function buildItemRow(item: {
  slug: string;
  ad: string;
  adet: number;
  birimFiyat: number;
}): string {
  const product = getProductBySlug(item.slug);
  const imagePath =
    product?.images?.[0] ?? product?.variants[0]?.images?.[0] ?? '';
  const imageUrl = imagePath ? absoluteUrl(imagePath) : '';
  const productUrl = `${SITE.url}/urun/${item.slug}`;
  const lineTotal = item.birimFiyat * item.adet;

  return `<tr>
    <td style="padding:14px 18px;border-bottom:1px solid #E7DFD0">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          ${imageUrl ? `<td width="64" valign="top" style="padding-right:14px"><a href="${productUrl}"><img src="${imageUrl}" alt="${escapeHtml(item.ad)}" width="64" height="64" style="border-radius:8px;object-fit:cover;border:0;display:block"></a></td>` : ''}
          <td valign="top">
            <a href="${productUrl}" style="color:#1A1712;text-decoration:none;font-weight:500;font-size:14px">${escapeHtml(item.ad)}</a>
            <p style="margin:4px 0 0;color:#9A907D;font-size:13px">Adet: ${item.adet}</p>
          </td>
        </tr>
      </table>
    </td>
    <td align="right" valign="top" style="padding:14px 18px;border-bottom:1px solid #E7DFD0;color:#1A1712;font-weight:500;white-space:nowrap">${formatTRY(lineTotal)}</td>
  </tr>`;
}

function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${SITE.url}${path}`;
}

function formatTRY(n: number): string {
  return (
    n.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' ₺'
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
