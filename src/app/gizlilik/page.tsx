import LegalPage from '@/components/legal/LegalPage';
import { SITE } from '@/lib/config';
import { COMPANY, alan } from '@/lib/legal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description:
    'NOVELLA gizlilik politikası. Verilerinizi nasıl topluyor, kullanıyor ve koruyoruz.',
  alternates: { canonical: `${SITE.url}/gizlilik` },
};

export default function GizlilikPage() {
  return (
    <LegalPage
      title="Gizlilik Politikası"
      intro="Verilerinizi ne için topluyoruz, kimlerle paylaşıyoruz ve nasıl koruyoruz — sade bir dille."
    >
      <h2>Özet</h2>
      <div className="legal-box">
        <ul style={{ marginBottom: 0 }}>
          <li>Verilerinizi satmıyoruz.</li>
          <li>Kart bilgilerinizi görmüyor ve saklamıyoruz.</li>
          <li>
            Yalnızca siparişinizi teslim etmek için gereken kadar veri
            topluyoruz.
          </li>
          <li>Zorunlu olmayan çerezler ancak izin verirseniz çalışır.</li>
        </ul>
      </div>

      <h2>Hangi bilgileri topluyoruz?</h2>

      <h3>Siz verdiğinizde</h3>
      <p>
        Sipariş verirken ad, soyad, e-posta, telefon ve teslimat adresinizi
        alıyoruz. Bunlar olmadan siparişi size ulaştıramayız.
      </p>

      <h3>Otomatik olarak</h3>
      <p>
        Siteyi ziyaret ettiğinizde IP adresiniz, tarayıcı türünüz ve gezdiğiniz
        sayfalar sunucu kayıtlarına düşer. Bunları site güvenliği ve hata
        ayıklama için kullanırız.
      </p>

      <h2>Ödeme bilgileriniz</h2>
      <p>
        Ödemeleriniz <strong>Shopier</strong> güvenli ödeme altyapısı üzerinden
        alınır. Kart numaranız, son kullanma tarihiniz ve CVV bilginiz
        sitemize <strong>hiçbir zaman iletilmez</strong>, sunucumuza düşmez ve
        tarafımızca saklanmaz. Bu bilgiler yalnızca Shopier&apos;in PCI-DSS
        uyumlu sistemlerinde işlenir.
      </p>

      <h2>Kimlerle paylaşıyoruz?</h2>
      <ul>
        <li>
          <strong>Kargo firması</strong> — paketinizi teslim edebilmek için ad,
          adres ve telefonunuz.
        </li>
        <li>
          <strong>Shopier</strong> — ödemenizi alabilmek için ad, e-posta ve
          tutar.
        </li>
        <li>
          <strong>Vercel</strong> — sitenin barındırıldığı altyapı sağlayıcısı.
        </li>
        <li>
          <strong>Google Analytics</strong> — yalnızca çerez izni verdiyseniz,
          anonim ziyaret istatistikleri için.
        </li>
      </ul>
      <p>
        Bunların dışında hiçbir üçüncü tarafla veri paylaşmıyoruz. Verilerinizi
        reklam ağlarına satmıyor veya kiralamıyoruz.
      </p>

      <h2>Ne kadar süre saklıyoruz?</h2>
      <p>
        Sipariş ve fatura kayıtlarını vergi mevzuatı gereği 10 yıl saklamak
        zorundayız. İletişim kayıtlarını talebiniz sonuçlandıktan 3 yıl sonra
        siliyoruz.
      </p>

      <h2>Güvenlik</h2>
      <p>
        Site trafiği <strong>HTTPS</strong> ile şifrelenir. Yönetim erişimleri
        sınırlıdır ve ödeme bilgileri hiç bize ulaşmadığı için sızdırılma riski
        taşımaz. Yine de internet üzerinden yapılan hiçbir aktarımın %100
        güvenli olmadığını belirtmek isteriz.
      </p>

      <h2>Çerezler</h2>
      <p>
        Sitede zorunlu çerezler (sepetinizin hatırlanması gibi) ve izne bağlı
        çerezler kullanıyoruz. Ayrıntılar için{' '}
        <a href="/cerez-politikasi">Çerez Politikası</a> sayfamıza bakın.
      </p>

      <h2>Çocukların gizliliği</h2>
      <p>
        Sitemiz 18 yaş altındaki kişilere yönelik değildir ve bilerek çocuklara
        ait veri toplamayız.
      </p>

      <h2>Haklarınız</h2>
      <p>
        Verilerinize erişme, düzeltme ve silinmesini isteme haklarınız vardır.
        Ayrıntılar ve başvuru yolu için{' '}
        <a href="/kvkk">KVKK Aydınlatma Metni</a> sayfamıza bakabilirsiniz.
      </p>

      <h2>Değişiklikler</h2>
      <p>
        Bu politikayı güncellediğimizde sayfanın altındaki tarih değişir. Önemli
        değişikliklerde sitede duyuru yaparız.
      </p>

      <h2>İletişim</h2>
      <p>
        Gizlilikle ilgili sorularınız için{' '}
        {COMPANY.email ? (
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        ) : (
          alan(COMPANY.email, 'e-posta')
        )}{' '}
        adresine yazabilir veya{' '}
        <a
          href={`https://api.whatsapp.com/send?phone=${SITE.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
        &apos;tan ulaşabilirsiniz.
      </p>
    </LegalPage>
  );
}
