import LegalPage from '@/components/legal/LegalPage';
import { SHIPPING, SITE } from '@/lib/config';
import { CAYMA_SURESI_GUN, COMPANY, TESLIMAT_SURESI_GUN, alan } from '@/lib/legal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ön Bilgilendirme Formu',
  description:
    'Mesafeli Sözleşmeler Yönetmeliği uyarınca sipariş öncesi bilgilendirme formu.',
  alternates: { canonical: `${SITE.url}/on-bilgilendirme` },
  robots: { index: false, follow: true },
};

const esik = SHIPPING.freeThreshold.toLocaleString('tr-TR');
const ucret = SHIPPING.fee.toLocaleString('tr-TR', { minimumFractionDigits: 2 });

export default function OnBilgilendirmePage() {
  return (
    <LegalPage
      title="Ön Bilgilendirme Formu"
      intro="Mesafeli Sözleşmeler Yönetmeliği m.5 uyarınca, siparişinizi onaylamadan önce bilmeniz gereken hususlar."
    >
      <h2>1. Satıcı bilgileri</h2>
      <div className="legal-box">
        <dl className="legal-dl">
          <dt>Ticaret unvanı</dt>
          <dd>{alan(COMPANY.unvan, 'ticaret unvanı')}</dd>
          <dt>Adres</dt>
          <dd>{alan(COMPANY.adres, 'açık adres')}</dd>
          <dt>Vergi dairesi / no</dt>
          <dd>
            {alan(COMPANY.vergiDairesi, 'vergi dairesi')} /{' '}
            {alan(COMPANY.vergiNo, 'vergi no')}
          </dd>
          <dt>E-posta</dt>
          <dd>{alan(COMPANY.email, 'e-posta')}</dd>
          <dt>WhatsApp</dt>
          <dd>+{SITE.whatsapp}</dd>
        </dl>
      </div>

      <h2>2. Sözleşme konusu ürün</h2>
      <p>
        Sözleşmenin konusu, sipariş sırasında sepetinizde yer alan ve ödeme
        sayfasında nitelikleri ile satış fiyatı belirtilen ürünlerdir. Ürünlerin
        temel nitelikleri (malzeme, ölçü, renk, kaplama) ilgili ürün sayfasında
        yer almaktadır.
      </p>
      <p>
        Ürünlerimiz <strong>316L paslanmaz çelik</strong> esaslıdır. Kaplamalı
        ürünlerde kaplama cinsi ürün sayfasında belirtilir.
      </p>

      <h2>3. Fiyat ve ödeme</h2>
      <ul>
        <li>
          Ürün fiyatlarına <strong>KDV dahildir</strong>.
        </li>
        <li>
          Sipariş toplamı <strong>{esik} ₺</strong> ve üzerindeyse kargo
          ücretsizdir; altındaysa <strong>{ucret} ₺</strong> kargo ücreti
          eklenir.
        </li>
        <li>
          Ödenecek toplam tutar (ürün bedeli + varsa kargo) siparişi
          onaylamadan önce ödeme sayfasında açıkça gösterilir.
        </li>
        <li>
          Ödeme, <strong>Shopier</strong> güvenli ödeme altyapısı üzerinden
          kredi kartı / banka kartı ile yapılır. Kart bilgileriniz sitemize
          hiçbir zaman iletilmez ve tarafımızca saklanmaz.
        </li>
      </ul>

      <h2>4. Teslimat</h2>
      <ul>
        <li>Teslimat, siparişte belirttiğiniz adrese kargo ile yapılır.</li>
        <li>
          Siparişiniz ödeme onayından sonra 1–3 iş günü içinde kargoya verilir.
        </li>
        <li>
          Teslimat süresi her hâlükârda{' '}
          <strong>en fazla {TESLIMAT_SURESI_GUN} gündür</strong>. Bu süre
          aşılırsa sözleşmeyi feshedebilir ve ödemenizin iadesini
          isteyebilirsiniz.
        </li>
        <li>Kargo ücreti ödeme sayfasında ayrıca gösterilir.</li>
      </ul>
      <p>
        Ayrıntılar için <a href="/kargo">Kargo &amp; Teslimat</a> sayfamıza
        bakabilirsiniz.
      </p>

      <h2>5. Cayma hakkı</h2>
      <p>
        Ürünü teslim aldığınız tarihten itibaren{' '}
        <strong>{CAYMA_SURESI_GUN} gün</strong> içinde, hiçbir gerekçe
        göstermeden ve cezai şart ödemeden sözleşmeden cayma hakkına
        sahipsiniz.
      </p>
      <p>
        Cayma bildiriminizi WhatsApp veya e-posta ile iletebilirsiniz. Cayma
        hakkını kullandığınızda ödemeniz en geç 14 gün içinde iade edilir.
      </p>
      <p>
        Fikir değişikliğine bağlı iadelerde <strong>iade kargo ücreti
        alıcıya</strong>; hatalı, kusurlu veya yanlış gönderilen üründe{' '}
        <strong>satıcıya</strong> aittir.
      </p>

      <h3>Cayma hakkının kullanılamayacağı hâller</h3>
      <p>Yönetmelik m.15 uyarınca:</p>
      <ul>
        <li>
          Tüketicinin istekleri doğrultusunda kişiye özel hazırlanan ürünler
          (isim baskılı / özel harf veya tarih işlenmiş takılar),
        </li>
        <li>
          Ambalajı açılmış olması hâlinde sağlık ve hijyen açısından iadeye
          uygun olmayan ürünler (küpeler).
        </li>
      </ul>
      <p>
        Bu istisnalar, ürünün <strong>ayıplı</strong> (hatalı/kusurlu) olması
        hâlinde uygulanmaz.
      </p>

      <h2>6. Şikâyet ve itiraz</h2>
      <p>
        Uyuşmazlık hâlinde, yerleşim yerinizin bulunduğu Tüketici Hakem
        Heyeti&apos;ne veya Tüketici Mahkemesi&apos;ne başvurabilirsiniz.
        Parasal sınırlar her yıl Ticaret Bakanlığı tarafından güncellenir.
      </p>

      <h2>7. Onay</h2>
      <p>
        Ödeme sayfasında bu formu onayladığınızda, yukarıdaki hususlarda
        bilgilendirildiğinizi kabul etmiş sayılırsınız. Onayınız kayıt altına
        alınır.
      </p>
      <p>
        Sipariş şartlarının tamamı için{' '}
        <a href="/mesafeli-satis-sozlesmesi">Mesafeli Satış Sözleşmesi</a>
        &apos;ni inceleyebilirsiniz.
      </p>
    </LegalPage>
  );
}
