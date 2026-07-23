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
      <p>Ürünün iade edilebilmesi için:</p>
      <ul>
        <li>Kullanılmamış ve denenmiş olmanın ötesine geçmemiş olması,</li>
        <li>Orijinal kutusu, kesesi ve varsa etiketiyle birlikte gönderilmesi,</li>
        <li>Hasar görmemiş olması gerekir.</li>
      </ul>
      <p>
        Takıyı takıp deneyebilirsiniz — bu iade hakkınızı ortadan kaldırmaz.
        Ancak ürünün kullanımdan kaynaklı değer kaybı varsa (çizik, deformasyon,
        kopmuş zincir) iade tutarından bu kayıp düşülebilir.
      </p>

      <h2>Cayma hakkının kullanılamayacağı ürünler</h2>
      <p>
        Yönetmeliğin 15. maddesi uyarınca aşağıdaki ürünlerde cayma hakkı
        kullanılamaz:
      </p>
      <ul>
        <li>
          <strong>Kişiye özel üretilen ürünler:</strong> İsim baskısı, özel harf
          veya tarih işlenmiş takılar sizin talebiniz doğrultusunda üretildiği
          için iade alınamaz. Bu ürünlerde sipariş öncesi yazımı iki kez kontrol
          etmenizi rica ederiz.
        </li>
        <li>
          <strong>Hijyen gerektiren ürünler:</strong> Küpeler, ambalajı
          açılmışsa sağlık ve hijyen nedeniyle iade alınamaz. Küpe siparişinizde
          bir sorun varsa kutuyu açmadan bize ulaşın.
        </li>
      </ul>
      <p>
        Bu istisnalar <strong>hatalı, kusurlu veya siparişten farklı</strong>{' '}
        gönderilen ürünler için geçerli değildir — o durumda her koşulda iade
        veya değişim hakkınız vardır.
      </p>

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
        <li>Size iade kargo kodunu ve gönderim adresini iletelim.</li>
        <li>
          Ürünü orijinal kutusuyla paketleyip anlaşmalı kargo şubesine teslim
          edin.
        </li>
        <li>
          Ürün elimize ulaşıp kontrol edildikten sonra iadeniz onaylanır.
        </li>
      </ol>

      <h2>İade kargo ücreti</h2>
      <ul>
        <li>
          <strong>Fikrinizi değiştirdiyseniz:</strong> İade kargo ücreti size
          aittir.
        </li>
        <li>
          <strong>Ürün hatalı, kusurlu veya yanlış geldiyse:</strong> İade kargo
          ücreti bize aittir, anlaşmalı kargomuzla ücretsiz gönderirsiniz.
        </li>
      </ul>

      <h2>Para iadesi</h2>
      <p>
        İadeniz onaylandıktan sonra ödemeniz <strong>en geç 14 gün</strong>{' '}
        içinde, ödemeyi yaptığınız kartın bağlı olduğu hesaba iade edilir.
        Bankanızın işleme alma süresi nedeniyle tutarın hesabınıza yansıması
        birkaç iş günü daha sürebilir — bu süre bankanızın inisiyatifindedir.
      </p>
      <p>
        Kargo ücreti ödediyseniz ve tüm siparişi iade ediyorsanız, kargo ücreti
        de iade edilir.
      </p>

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
        Lütfen iade göndermeden önce bizimle iletişime geçin. Haber verilmeden
        gönderilen iadeler işleme alınamayabilir.
      </p>
    </LegalPage>
  );
}
