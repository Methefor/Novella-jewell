import CookieSettingsButton from '@/components/legal/CookieSettingsButton';
import LegalPage from '@/components/legal/LegalPage';
import { SITE } from '@/lib/config';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Çerez Politikası',
  description:
    'NOVELLA çerez politikası. Hangi çerezleri neden kullanıyoruz ve nasıl kapatabilirsiniz.',
  alternates: { canonical: `${SITE.url}/cerez-politikasi` },
};

export default function CerezPolitikasiPage() {
  return (
    <LegalPage
      title="Çerez Politikası"
      intro="Çerez, sitenin tarayıcınıza kaydettiği küçük bir metin dosyasıdır. Hangilerini neden kullandığımızı ve nasıl kapatacağınızı burada anlatıyoruz."
    >
      <h2>Kullandığımız çerezler</h2>

      <h3>Zorunlu çerezler (izin gerektirmez)</h3>
      <p>
        Bunlar olmadan site çalışmaz, bu yüzden KVKK m.5/2-f kapsamında açık
        rıza aranmaz.
      </p>
      <ul>
        <li>
          <strong>Sepet bilgisi</strong> — eklediğiniz ürünlerin sayfa
          değiştirdiğinizde kaybolmaması için. Tarayıcınızda saklanır, sunucuya
          gönderilmez.
        </li>
        <li>
          <strong>Favorileriniz</strong> — beğendiğiniz ürünlerin
          hatırlanması için.
        </li>
        <li>
          <strong>Çerez tercihiniz</strong> — bu sayfadaki seçiminizin
          hatırlanması için (1 yıl).
        </li>
      </ul>

      <h3>Analitik çerezler (izne bağlı)</h3>
      <p>
        Yalnızca <strong>onay verirseniz</strong> çalışır. Kaç kişinin siteyi
        ziyaret ettiğini ve hangi sayfaların ilgi gördüğünü anlamamızı sağlar.
      </p>
      <ul>
        <li>
          <strong>Google Analytics</strong> — anonim ziyaret istatistikleri.
          Çerez süresi: 2 yıla kadar.
        </li>
      </ul>
      <p>
        Onay vermezseniz Google Analytics <strong>hiç yüklenmez</strong> —
        sadece pasif kalmaz, script hiç çalışmaz.
      </p>

      <h2>Üçüncü taraf çerezleri</h2>
      <p>
        Ödeme sırasında PayTR&apos;nin güvenli ödeme ekranı açıldığında, PayTR
        kendi çerezlerini kullanabilir. Bu çerezler PayTR&apos;nin gizlilik
        politikasına tabidir ve bizim kontrolümüzde değildir.
      </p>

      <h2>Tercihinizi değiştirme</h2>
      <p>
        Çerez tercihinizi istediğiniz zaman değiştirebilirsiniz. Aşağıdaki
        butona basarsanız seçim ekranı yeniden açılır.
      </p>

      <CookieSettingsButton />

      <h2>Tarayıcınızdan kapatma</h2>
      <p>
        Çerezleri tarayıcı ayarlarınızdan da yönetebilir veya tamamen
        engelleyebilirsiniz. Ancak zorunlu çerezleri engellerseniz sepet gibi
        temel özellikler çalışmayabilir.
      </p>
      <ul>
        <li>
          <strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Üçüncü taraf
          çerezleri
        </li>
        <li>
          <strong>Safari:</strong> Ayarlar → Safari → Gizlilik ve Güvenlik
        </li>
        <li>
          <strong>Firefox:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler
        </li>
      </ul>

      <h2>Daha fazlası</h2>
      <p>
        Kişisel verilerinizin nasıl işlendiğine dair ayrıntılar için{' '}
        <a href="/kvkk">KVKK Aydınlatma Metni</a> ve{' '}
        <a href="/gizlilik">Gizlilik Politikası</a> sayfalarımıza
        bakabilirsiniz.
      </p>
    </LegalPage>
  );
}
