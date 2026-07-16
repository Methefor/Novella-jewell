import LegalPage from '@/components/legal/LegalPage';
import { SITE } from '@/lib/config';
import { COMPANY, alan } from '@/lib/legal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İletişim',
  description:
    'NOVELLA ile iletişime geçin. WhatsApp, e-posta ve şirket bilgilerimiz.',
  alternates: { canonical: `${SITE.url}/iletisim` },
};

export default function IletisimPage() {
  const waLink = `https://api.whatsapp.com/send?phone=${SITE.whatsapp}`;

  return (
    <LegalPage
      title="İletişim"
      intro="Sorunuz, siparişiniz veya iade talebiniz için bize ulaşın. WhatsApp'tan genellikle aynı gün içinde dönüş yapıyoruz."
      hideUpdated
    >
      <h2>Bize ulaşın</h2>

      <div className="legal-box">
        <dl className="legal-dl">
          <dt>WhatsApp</dt>
          <dd>
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              +{SITE.whatsapp}
            </a>
          </dd>

          <dt>Instagram</dt>
          <dd>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer">
              @jewelry.novella
            </a>
          </dd>

          <dt>E-posta</dt>
          <dd>
            {COMPANY.email ? (
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            ) : (
              alan(COMPANY.email, 'e-posta adresi')
            )}
          </dd>

          {COMPANY.telefon && (
            <>
              <dt>Telefon</dt>
              <dd>{COMPANY.telefon}</dd>
            </>
          )}
        </dl>
      </div>

      <h2>Satıcı bilgileri</h2>
      <p>
        6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun uyarınca
        satıcıya ait tanıtıcı bilgiler aşağıdadır.
      </p>

      <div className="legal-box">
        <dl className="legal-dl">
          <dt>Ticaret unvanı</dt>
          <dd>{alan(COMPANY.unvan, 'ticaret unvanı')}</dd>

          <dt>Adres</dt>
          <dd>{alan(COMPANY.adres, 'açık adres')}</dd>

          <dt>Vergi dairesi</dt>
          <dd>{alan(COMPANY.vergiDairesi, 'vergi dairesi')}</dd>

          <dt>Vergi / TC kimlik no</dt>
          <dd>{alan(COMPANY.vergiNo, 'vergi no')}</dd>

          {COMPANY.mersisNo && (
            <>
              <dt>MERSİS no</dt>
              <dd>{COMPANY.mersisNo}</dd>
            </>
          )}

          <dt>Web sitesi</dt>
          <dd>{SITE.url}</dd>
        </dl>
      </div>

      <h2>Çalışma saatleri</h2>
      <p>
        Mesajlarınızı hafta içi 09:00–18:00 arasında yanıtlıyoruz. Bu saatler
        dışında gelen mesajlara ilk iş günü dönüş yapılır.
      </p>

      <h2>Şikâyet ve itirazlar</h2>
      <p>
        Siparişinizle ilgili bir sorun yaşarsanız önce bizimle iletişime
        geçmenizi rica ederiz — çoğu konuyu hızlıca çözebiliyoruz. Çözüm
        sağlanamadığı takdirde, 6502 sayılı Tüketicinin Korunması Hakkında Kanun
        uyarınca yerleşim yerinizin bulunduğu <strong>Tüketici Hakem
        Heyeti</strong>&apos;ne veya <strong>Tüketici Mahkemesi</strong>&apos;ne
        başvurabilirsiniz.
      </p>
    </LegalPage>
  );
}
