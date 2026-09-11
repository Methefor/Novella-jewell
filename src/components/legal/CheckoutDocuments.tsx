import LegalPage from '@/components/legal/LegalPage';
import { SHIPPING, SITE } from '@/lib/config';
import { CAYMA_SURESI_GUN, COMPANY, TESLIMAT_SURESI_GUN, alan } from '@/lib/legal';
import { RETURN_POLICY } from '@/lib/return-policy';
const esik = SHIPPING.freeThreshold.toLocaleString('tr-TR');
const ucret = SHIPPING.fee.toLocaleString('tr-TR', { minimumFractionDigits: 2 });

export function OnBilgilendirmePage() {
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
          <dt>Vergi dairesi</dt>
          <dd>{alan(COMPANY.vergiDairesi, 'vergi dairesi')}</dd>
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
          Ödenecek toplam tutar (ürün bedeli + varsa kargo) siparişi onaylamadan
          önce ödeme sayfasında açıkça gösterilir.
        </li>
        <li>
          Ödeme, kredi kartı / banka kartı ile güvenli ödeme sayfası üzerinden
          yapılır. Kart bilgileriniz sitemize hiçbir zaman iletilmez ve
          tarafımızca saklanmaz.
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
        göstermeden ve cezai şart ödemeden sözleşmeden cayma hakkına sahipsiniz.
      </p>
      <p>{RETURN_POLICY.notification}</p>
      <p>{RETURN_POLICY.shipping}</p>
      <p>{RETURN_POLICY.refund}</p>

      <h3>Cayma hakkının kullanılamayacağı hâller</h3>
      <p>{RETURN_POLICY.hygiene}</p>

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

export function MesafeliSatisPage() {
  return (
    <LegalPage
      title="Mesafeli Satış Sözleşmesi"
      intro="Bu sözleşme, siparişinizi onayladığınız anda aranızda kurulan satış sözleşmesinin şartlarını düzenler."
    >
      <h2>Madde 1 — Taraflar</h2>

      <h3>1.1. Satıcı</h3>
      <div className="legal-box">
        <dl className="legal-dl">
          <dt>Unvan</dt>
          <dd>{alan(COMPANY.unvan, 'ticaret unvanı')}</dd>
          <dt>Adres</dt>
          <dd>{alan(COMPANY.adres, 'açık adres')}</dd>
          <dt>Vergi dairesi</dt>
          <dd>{alan(COMPANY.vergiDairesi, 'vergi dairesi')}</dd>
          <dt>E-posta</dt>
          <dd>{alan(COMPANY.email, 'e-posta')}</dd>
          <dt>Telefon</dt>
          <dd>+{SITE.whatsapp}</dd>
        </dl>
      </div>

      <h3>1.2. Alıcı</h3>
      <p>
        Sipariş formunda ad, soyad, adres, telefon ve e-posta bilgilerini beyan
        eden kişidir. Alıcı, beyan ettiği bilgilerin doğruluğundan sorumludur.
      </p>

      <h2>Madde 2 — Sözleşmenin konusu</h2>
      <p>
        İşbu sözleşmenin konusu, Alıcı&apos;nın {SITE.url} adresinden elektronik
        ortamda siparişini verdiği, nitelikleri ve satış fiyatı sipariş
        sayfasında belirtilen ürünlerin satışı ve teslimi ile ilgili olarak 6502
        sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
        Yönetmeliği hükümleri uyarınca tarafların hak ve yükümlülüklerinin
        belirlenmesidir.
      </p>

      <h2>Madde 3 — Sözleşme konusu ürün ve bedel</h2>
      <p>
        Ürünün türü, miktarı, marka/modeli, rengi ve satış bedeli, siparişin
        tamamlandığı andaki sipariş özetinde belirtildiği gibidir.
      </p>
      <ul>
        <li>Fiyatlara KDV dahildir.</li>
        <li>
          {esik} ₺ ve üzeri siparişlerde kargo ücretsizdir; altındaki
          siparişlerde {ucret} ₺ kargo ücreti Alıcı&apos;ya aittir.
        </li>
        <li>
          Ödenecek toplam tutar, sipariş onayından önce Alıcı&apos;ya açıkça
          gösterilir.
        </li>
      </ul>

      <h2>Madde 4 — Genel hükümler</h2>
      <ol>
        <li>
          Alıcı, sipariş vermeden önce Ön Bilgilendirme Formu&apos;nu okuyup
          onayladığını kabul eder. Onay, elektronik ortamda kayıt altına alınır.
        </li>
        <li>
          Sözleşme konusu ürün, Alıcı&apos;nın belirttiği adrese, yasal{' '}
          {TESLIMAT_SURESI_GUN} günlük süreyi aşmamak kaydıyla teslim edilir.
        </li>
        <li>
          Edimin yerine getirilmesinin imkânsızlaştığı anlaşılırsa Satıcı, durumu öğrendiği tarihten itibaren üç gün içinde Alıcı’yı kalıcı veri saklayıcısıyla bilgilendirir; teslimat masrafları dâhil ödemeleri bildirimden itibaren 14 gün içinde iade eder. Stokta bulunmama tek başına imkânsızlık sayılmaz.
        </li>
        <li>
          Ürünün tesliminden sonra Alıcı&apos;ya ait kredi kartının
          Alıcı&apos;nın kusurundan kaynaklanmayan bir şekilde yetkisiz
          kişilerce haksız veya hukuka aykırı olarak kullanılması nedeniyle
          ilgili banka veya finans kuruluşunun ürün bedelini Satıcı&apos;ya
          ödememesi hâlinde, ürün Alıcı&apos;ya teslim edilmişse Alıcı ürünü
          Satıcı&apos;ya iade eder; bu durumda kargo giderleri Alıcı&apos;ya
          aittir.
        </li>
        <li>
          Mücbir sebepler (doğal afet, salgın, kargo hizmetlerinin durması vb.)
          nedeniyle teslim gerçekleşemezse Satıcı Alıcı&apos;yı bilgilendirir.
          Alıcı siparişi iptal etme veya engel ortadan kalkana kadar erteleme
          hakkına sahiptir.
        </li>
        <li>
          Teslimatta görülen hasarı belgelemeniz çözümü hızlandırır. Tutanak, video veya 48 saat içinde bildirim bulunmaması tüketicinin yasal haklarını ortadan kaldırmaz.
        </li>
      </ol>

      <h2>Madde 5 — Cayma hakkı</h2>
      <p>
        Alıcı, ürünü teslim aldığı tarihten itibaren{' '}
        <strong>{CAYMA_SURESI_GUN} gün</strong> içinde hiçbir gerekçe
        göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına
        sahiptir.
      </p>
      <p>{RETURN_POLICY.notification}</p>
      <p>{RETURN_POLICY.shipping}</p>
      <p>{RETURN_POLICY.refund}</p>
      <p>{RETURN_POLICY.condition}</p>

      <h2>Madde 6 — Cayma hakkının kullanılamayacağı ürünler</h2>
      <p>{RETURN_POLICY.hygiene}</p>

      <h2>Madde 7 — Kişisel verilerin korunması</h2>
      <p>
        Alıcı&apos;nın kişisel verileri, 6698 sayılı KVKK kapsamında,{' '}
        <a href="/kvkk">Aydınlatma Metni</a>&apos;nde belirtilen amaç ve
        sınırlar dâhilinde işlenir. Ödeme bilgileri Satıcı tarafından saklanmaz;
        ödeme güvenli ödeme sistemi üzerinden gerçekleştirilir.
      </p>

      <h2>Madde 8 — Uyuşmazlıkların çözümü</h2>
      <p>
        İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığı tarafından her
        yıl ilan edilen parasal sınırlar dâhilinde Alıcı&apos;nın veya
        Satıcı&apos;nın yerleşim yerindeki Tüketici Hakem Heyetleri ile Tüketici
        Mahkemeleri yetkilidir.
      </p>

      <h2>Madde 9 — Yürürlük</h2>
      <p>
        Alıcı, sipariş sayfasında işbu sözleşmeyi onayladığında tüm şartları
        kabul etmiş sayılır. Sözleşme, siparişin Satıcı tarafından teyit
        edilmesiyle yürürlüğe girer ve elektronik ortamda saklanır.
      </p>
    </LegalPage>
  );
}

export function KvkkPage() {
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
          bilgisi, onay tarihi, metin sürümü ve siparişe ait metin kopyası
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
        Kişisel verileriniz <strong>satılmaz</strong> ve yalnızca aşağıda açıklanan amaç ve hukuki sebeplerle, hizmetin gerektirdiği ölçüde
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
        <li><strong>Veritabanı ve e-posta sağlayıcıları (Neon, Resend):</strong> Sipariş, onay kayıtları ve işlem bildirimlerinin saklanması ve iletilmesi.</li>
        <li><strong>Hesap hizmeti (Clerk):</strong> Hesap açmanız hâlinde kimlik doğrulama ve hesap yönetimi.</li>
        <li><strong>Google Analytics ve Meta:</strong> Yalnızca isteğe bağlı çerezleri kabul ederseniz ziyaret ve alışveriş olayları; kart ve teslimat bilgileri bu olaylara eklenmez.</li>
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
