import { EMAIL, SITE } from '@/lib/config';
import type { OrderRow } from '@/db/schema';
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
export async function sendOrderConfirmationEmail(order: OrderRow): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY yok — onay e-postası atlandı', {
      orderNo: order.orderNo,
    });
    return;
  }

  const resend = new Resend(apiKey);
  const c = order.customer;
  const waLink = `https://api.whatsapp.com/send?phone=${SITE.whatsapp}`;

  const satirlar = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #EFE9DD;color:#1A1712">${i.ad} × ${i.adet}</td>
          <td style="padding:8px 0;border-bottom:1px solid #EFE9DD;text-align:right;color:#1A1712;white-space:nowrap">${(
            i.birimFiyat * i.adet
          ).toLocaleString('tr-TR')} ₺</td>
        </tr>`
    )
    .join('');

  const html = `<!doctype html><html lang="tr"><body style="margin:0;background:#FAF8F5;font-family:Inter,-apple-system,Segoe UI,sans-serif;color:#1A1712">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <div style="font-family:Georgia,serif;font-size:15px;letter-spacing:6px;color:#9E8E63;text-transform:uppercase">NOVELLA</div>
    <h1 style="font-family:Georgia,serif;font-weight:400;font-size:26px;margin:18px 0 6px">Siparişiniz alındı</h1>
    <p style="color:#6B6252;margin:0 0 24px">Ödemeniz onaylandı. Siparişiniz hazırlanıp kargoya verildiğinde WhatsApp üzerinden bilgilendirileceksiniz.</p>

    <div style="background:#fff;border:1px solid #E7DFD0;border-radius:12px;padding:20px 22px;margin-bottom:20px">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#9A907D">Sipariş numarası</p>
      <p style="margin:0 0 18px;font-size:20px;font-weight:600;color:#1A1712">${order.orderNo}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">${satirlar}
        <tr>
          <td style="padding:12px 0 0;font-weight:600">Toplam</td>
          <td style="padding:12px 0 0;text-align:right;font-weight:600">${Number(
            order.total
          ).toLocaleString('tr-TR')} ₺</td>
        </tr>
      </table>
    </div>

    <div style="background:#fff;border:1px solid #E7DFD0;border-radius:12px;padding:20px 22px;margin-bottom:24px">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#9A907D">Teslimat adresi</p>
      <p style="margin:0;color:#1A1712;line-height:1.6">${c.adSoyad}<br>${c.adres}<br>${c.ilce ? c.ilce + ' / ' : ''}${c.il}<br>${c.telefon}</p>
    </div>

    <a href="${waLink}" style="display:inline-block;background:#0A0A0A;color:#fff;text-decoration:none;padding:13px 26px;border-radius:999px;font-size:14px;font-weight:500">Sorunuz için WhatsApp</a>

    <p style="color:#9A907D;font-size:12px;margin-top:32px">${SITE.name} · ${SITE.tagline}</p>
  </div>
</body></html>`;

  await resend.emails.send({
    from: EMAIL.from,
    to: c.email,
    subject: `Siparişiniz alındı — ${order.orderNo}`,
    html,
  });
}
