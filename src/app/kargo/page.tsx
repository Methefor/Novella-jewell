import LegalPage from '@/components/legal/LegalPage';
import { SHIPPING, SITE } from '@/lib/config';
import { TESLIMAT_SURESI_GUN } from '@/lib/legal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kargo & Teslimat',
  description: `NOVELLA kargo ve teslimat koşulları. ${SHIPPING.freeThreshold} ₺ üzeri siparişlerde kargo ücretsiz.`,
  alternates: { canonical: `${SITE.url}/kargo` },
};

// Fiyatlar config'den okunur — sitede tek bir yerde tanımlıdır.
const ucret = SHIPPING.fee.toLocaleString('tr-TR', {
  minimumFractionDigits: 2,
});
const esik = SHIPPING.freeThreshold.toLocaleString('tr-TR');

export default function KargoPage() {
  return (
    <LegalPage
      title="Kargo & Teslimat"
      intro={`${esik} ₺ ve üzeri siparişlerde kargo bizden. Altındaki siparişlerde kargo ücreti ${ucret} ₺'dir.`}
    >
      <h2>Kargo ücreti</h2>
      <ul>
        <li>
          <strong>{esik} ₺ ve üzeri:</strong> Kargo ücretsiz.
        </li>
        <li>
          <strong>{esik} ₺ altı:</strong> {ucret} ₺ kargo ücreti uygulanır.
        </li>
      </ul>
      <p>
        Kargo ücreti sepet ve ödeme sayfasında, siparişi onaylamadan önce net
        olarak gösterilir. Sürpriz ek ücret çıkmaz.
      </p>

      <h2>Hazırlık ve teslim süresi</h2>
      <p>
        Siparişiniz ödemesi onaylandıktan sonra <strong>1–3 iş günü</strong>{' '}
        içinde hazırlanır ve kargoya verilir. Kargodaki süre bulunduğunuz ile
        göre genellikle <strong>1–3 iş günü</strong> sürer.
      </p>
      <p>
        Yasal olarak siparişiniz en geç{' '}
        <strong>{TESLIMAT_SURESI_GUN} gün</strong> içinde teslim edilir. Bu süre
        aşılırsa siparişinizi iptal etme ve ödemenizin iadesini isteme hakkınız
        vardır.
      </p>
      <p>
        Hafta sonu ve resmî tatillerde kargo çıkışı yapılmaz. Cuma günü öğleden
        sonra verilen siparişler pazartesi işleme alınır.
      </p>

      <h2>Teslimat bölgesi</h2>
      <p>
        Türkiye&apos;nin tamamına gönderim yapıyoruz. Şu an için yurt dışına
        gönderimimiz bulunmamaktadır.
      </p>

      <h2>Kargo takibi</h2>
      <p>
        Siparişiniz kargoya verildiğinde takip numaranız WhatsApp üzerinden
        paylaşılır. Sipariş numaranızla bize her zaman{' '}
        <a
          href={`https://api.whatsapp.com/send?phone=${SITE.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp&apos;tan
        </a>{' '}
        ulaşıp durumunu sorabilirsiniz.
      </p>

      <h2>Paketleme</h2>
      <p>
        Her sipariş, üzerine not yazabileceğiniz özel kutusunda ve keten kesesi
        içinde gönderilir. Hediye olarak gönderiyorsanız sipariş notuna
        yazmanız yeterli — fatura tutarını görünmeyecek şekilde ayarlıyoruz.
      </p>

      <h2>Hasarlı teslimat</h2>
      <p>
        Kargo paketinde ezilme, yırtılma veya ıslanma görürseniz{' '}
        <strong>teslim almadan önce</strong> kargo görevlisine tutanak
        tutturun. Tutanaksız teslim alınan hasarlı ürünlerde sorumluluk kargo
        firmasına geçtiği için süreç uzayabilir.
      </p>
      <p>
        Paketi açtığınızda ürünün hasarlı olduğunu fark ederseniz, kutuyu
        açarken çekilmiş bir video veya fotoğrafla birlikte 48 saat içinde bize
        ulaşın. Hasarlı ürünün kargo masrafı bize aittir.
      </p>

      <h2>Adres hataları</h2>
      <p>
        Sipariş sırasında girilen adresin doğruluğu alıcının sorumluluğundadır.
        Hatalı adres nedeniyle iade dönen siparişlerin yeniden gönderim ücreti
        alıcıya aittir. Adresinizi yanlış girdiyseniz kargoya verilmeden önce
        bize ulaşın, ücretsiz düzeltelim.
      </p>
    </LegalPage>
  );
}
