import { RETURN_POLICY } from '@/lib/return-policy';
import LegalPage from '@/components/legal/LegalPage';
import { SITE } from '@/lib/config';
import { CAYMA_SURESI_GUN, COMPANY, alan } from '@/lib/legal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İade & Cayma Hakkı',
  description: `NOVELLA iade koşulları. ${CAYMA_SURESI_GUN} gün içinde koşulsuz cayma hakkı.`,
  alternates: { canonical: `${SITE.url}/iade` },
};

export default function IadePage() {
  return (
    <LegalPage
      title="İade & Cayma Hakkı"
      intro={`Ürünü beğenmediyseniz ${CAYMA_SURESI_GUN} gün içinde sebep belirtmeden iade edebilirsiniz.`}
    >
      <h2>Cayma hakkınız</h2>
      <p>
        Mesafeli Sözleşmeler Yönetmeliği uyarınca, ürünü teslim aldığınız
        tarihten itibaren <strong>{CAYMA_SURESI_GUN} gün</strong> içinde hiçbir
        gerekçe göstermeden ve cezai şart ödemeden sözleşmeden cayma hakkına
        sahipsiniz.
      </p>

      <h2>İade koşulları</h2>
      <p>{RETURN_POLICY.condition}</p>

      <h2>Cayma hakkının kullanılamayacağı ürünler</h2>
      <p>{RETURN_POLICY.hygiene}</p>

      <h2>İade nasıl yapılır?</h2>
      <p>
        En hızlı yol: <a href="/iade/talep">iade talep formunu</a> doldurun,
        talebiniz anında bize ulaşsın.
      </p>
      <ol>
        <li>
          <a
            href={`https://api.whatsapp.com/send?phone=${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          {COMPANY.email ? (
            <>
              {' '}
              veya <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            </>
          ) : null}{' '}
          üzerinden sipariş numaranızla iade talebinizi iletin.
        </li>
        <li>Size gönderim bilgilerini iletelim. Cayma bildiriminiz için ayrıca onay beklemeniz gerekmez.</li>
        <li>
          Ürünü zarar görmeyecek şekilde paketleyip cayma bildiriminizden itibaren 14 gün içinde geri gönderin.
        </li>
        <li>
          İade takibini paylaşın; kontrol süreci aşağıdaki yasal geri ödeme süresini uzatmaz.
        </li>
      </ol>

      <h2>İade kargo ücreti</h2>
      <p>{RETURN_POLICY.shipping}</p>
      <h2>Para iadesi</h2>
      <p>{RETURN_POLICY.refund}</p>

      <h2>Değişim</h2>
      <p>
        Beden veya model değişimi için iade sürecini başlatıp yeni siparişinizi
        vermeniz en hızlı yol olur. Talebinizi WhatsApp&apos;tan iletirseniz
        süreci sizin için hızlandırabiliriz.
      </p>

      <h2>İade adresi</h2>
      <div className="legal-box">
        <p style={{ marginBottom: 0 }}>
          {alan(COMPANY.unvan, 'ticaret unvanı')}
          <br />
          {alan(COMPANY.adres, 'iade adresi')}
        </p>
      </div>
      <p>
        Cayma bildiriminizi yazılı olarak iletip gönderim belgenizi saklayın. İade sürecinde desteğe ihtiyacınız varsa bize ulaşabilirsiniz.
      </p>
    </LegalPage>
  );
}
