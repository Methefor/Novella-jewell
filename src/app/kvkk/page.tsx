import LegalPage from '@/components/legal/LegalPage';
import { SITE } from '@/lib/config';
import { COMPANY, alan } from '@/lib/legal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  description:
    '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.',
  alternates: { canonical: `${SITE.url}/kvkk` },
};

export default function KvkkPage() {
  return (
    <LegalPage
      title="KVKK Aydınlatma Metni"
      intro="6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 10. maddesi uyarınca, kişisel verilerinizi nasıl işlediğimizi açıklıyoruz."
    >
      <h2>1. Veri sorumlusu</h2>
      <div className="legal-box">
        <dl className="legal-dl">
          <dt>Veri sorumlusu</dt>
          <dd>{alan(COMPANY.unvan, 'ticaret unvanı')}</dd>
          <dt>Adres</dt>
          <dd>{alan(COMPANY.adres, 'açık adres')}</dd>
          <dt>Başvuru e-postası</dt>
          <dd>{alan(COMPANY.email, 'e-posta')}</dd>
        </dl>
      </div>

      <h2>2. İşlenen kişisel verileriniz</h2>

      <h3>Sipariş verdiğinizde</h3>
      <ul>
        <li>
          <strong>Kimlik:</strong> Ad, soyad
        </li>
        <li>
          <strong>İletişim:</strong> E-posta, telefon numarası, teslimat adresi,
          il/ilçe
        </li>
        <li>
          <strong>Müşteri işlem:</strong> Sipariş numarası, sipariş içeriği,
          sipariş tutarı, sipariş tarihi, sipariş notu
        </li>
        <li>
          <strong>Onay kayıtları:</strong> Sözleşme ve aydınlatma metni onay
          bilgisi
        </li>
      </ul>

      <h3>Siteyi ziyaret ettiğinizde</h3>
      <ul>
        <li>
          <strong>İşlem güvenliği:</strong> IP adresi, tarayıcı ve cihaz
          bilgisi, ziyaret edilen sayfalar
        </li>
        <li>
          <strong>Pazarlama:</strong> Çerez kayıtları (yalnızca açık rızanız
          varsa)
        </li>
      </ul>

      <h3>İşlemediğimiz veriler</h3>
      <p>
        <strong>Kart bilgilerinizi görmüyor ve saklamıyoruz.</strong> Ödeme,
        güvenli ödeme sistemi üzerinden yapılır; kart numaranız, son kullanma
        tarihiniz ve CVV bilginiz hiçbir zaman sitemize iletilmez.
      </p>

      <h2>3. İşleme amaçlarımız</h2>
      <ul>
        <li>Siparişinizin alınması, hazırlanması ve kargoya verilmesi,</li>
        <li>Ödemenin alınması ve gerektiğinde iade edilmesi,</li>
        <li>Sipariş ve kargo süreci hakkında sizinle iletişim kurulması,</li>
        <li>İade ve cayma taleplerinizin karşılanması,</li>
        <li>
          Yasal saklama ve faturalandırma yükümlülüklerinin yerine getirilmesi,
        </li>
        <li>Site güvenliğinin sağlanması,</li>
        <li>
          Açık rızanız varsa: ziyaret istatistikleri ve pazarlama faaliyetleri.
        </li>
      </ul>

      <h2>4. Hukuki sebepler (KVKK m.5)</h2>
      <ul>
        <li>
          <strong>Sözleşmenin kurulması ve ifası (m.5/2-c):</strong> Sipariş,
          teslimat ve iade süreçleri.
        </li>
        <li>
          <strong>Hukuki yükümlülük (m.5/2-ç):</strong> Vergi ve ticaret
          mevzuatı kapsamında kayıt ve saklama.
        </li>
        <li>
          <strong>Meşru menfaat (m.5/2-f):</strong> Site güvenliği ve
          dolandırıcılık önleme.
        </li>
        <li>
          <strong>Açık rıza (m.5/1):</strong> Zorunlu olmayan çerezler ve
          pazarlama iletişimi.
        </li>
      </ul>

      <h2>5. Kimlere aktarılıyor?</h2>
      <p>
        Kişisel verileriniz <strong>satılmaz</strong> ve pazarlama amacıyla
        üçüncü kişilerle paylaşılmaz. Yalnızca hizmetin gerektirdiği ölçüde
        aşağıdaki taraflara aktarılır:
      </p>
      <ul>
        <li>
          <strong>Kargo firması:</strong> Ad, soyad, adres, telefon — teslimat
          için zorunlu.
        </li>
        <li>
          <strong>PayTR (ödeme kuruluşu):</strong> Ad, soyad, e-posta, sipariş
          tutarı — ödemenin alınması için zorunlu.
        </li>
        <li>
          <strong>Barındırma sağlayıcısı (Vercel):</strong> Sitenin çalışması
          için teknik olarak işlenen log kayıtları.
        </li>
        <li>
          <strong>Yetkili kamu kurumları:</strong> Yalnızca yasal talep hâlinde.
        </li>
      </ul>
      <p>
        Barındırma altyapısının yurt dışında bulunması nedeniyle veriler KVKK
        m.9 kapsamında yurt dışına aktarılabilir.
      </p>

      <h2>6. Saklama süresi</h2>
      <ul>
        <li>
          <strong>Sipariş ve fatura kayıtları:</strong> Vergi mevzuatı gereği{' '}
          <strong>10 yıl</strong>.
        </li>
        <li>
          <strong>İletişim kayıtları:</strong> Talebin sonuçlanmasından itibaren{' '}
          <strong>3 yıl</strong>.
        </li>
        <li>
          <strong>Çerez kayıtları:</strong> Çerez Politikası&apos;nda belirtilen
          süreler.
        </li>
      </ul>
      <p>
        Süre dolduğunda verileriniz silinir, yok edilir veya anonim hâle
        getirilir.
      </p>

      <h2>7. Haklarınız (KVKK m.11)</h2>
      <p>Veri sorumlusuna başvurarak şunları talep edebilirsiniz:</p>
      <ul>
        <li>Kişisel verinizin işlenip işlenmediğini öğrenme,</li>
        <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
        <li>
          İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme,
        </li>
        <li>Yurt içinde/dışında aktarıldığı üçüncü kişileri bilme,</li>
        <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
        <li>Şartları oluşmuşsa silinmesini veya yok edilmesini isteme,</li>
        <li>
          Düzeltme/silme işlemlerinin aktarıldığı kişilere bildirilmesini
          isteme,
        </li>
        <li>
          Otomatik sistemlerle analiz sonucu aleyhinize bir sonuç çıkmasına
          itiraz etme,
        </li>
        <li>
          Kanuna aykırı işleme nedeniyle zarara uğradıysanız tazminat talep
          etme.
        </li>
      </ul>

      <h2>8. Başvuru yolu</h2>
      <p>
        Taleplerinizi{' '}
        {COMPANY.email ? (
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        ) : (
          alan(COMPANY.email, 'e-posta')
        )}{' '}
        adresine iletebilirsiniz. Başvurunuz en geç <strong>30 gün</strong>{' '}
        içinde ücretsiz olarak sonuçlandırılır. İşlemin ayrıca maliyet
        gerektirmesi hâlinde Kurul&apos;ca belirlenen tarifedeki ücret
        alınabilir.
      </p>
      <p>
        Başvurunuzun reddedilmesi veya süresinde yanıt alamamanız hâlinde
        Kişisel Verileri Koruma Kurulu&apos;na şikâyette bulunabilirsiniz.
      </p>
    </LegalPage>
  );
}
