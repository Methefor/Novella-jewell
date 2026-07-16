import LegalPage from '@/components/legal/LegalPage';
import { SHIPPING, SITE } from '@/lib/config';
import { CAYMA_SURESI_GUN, COMPANY, TESLIMAT_SURESI_GUN, alan } from '@/lib/legal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi',
  description:
    'NOVELLA mesafeli satış sözleşmesi. Taraflar, konu, cayma hakkı ve yükümlülükler.',
  alternates: { canonical: `${SITE.url}/mesafeli-satis-sozlesmesi` },
  robots: { index: false, follow: true },
};

const esik = SHIPPING.freeThreshold.toLocaleString('tr-TR');
const ucret = SHIPPING.fee.toLocaleString('tr-TR', { minimumFractionDigits: 2 });

export default function MesafeliSatisPage() {
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
          <dt>Vergi dairesi / no</dt>
          <dd>
            {alan(COMPANY.vergiDairesi, 'vergi dairesi')} /{' '}
            {alan(COMPANY.vergiNo, 'vergi no')}
          </dd>
          <dt>E-posta</dt>
          <dd>{alan(COMPANY.email, 'e-posta')}</dd>
          <dt>Telefon</dt>
          <dd>+{SITE.whatsapp}</dd>
        </dl>
      </div>

      <h3>1.2. Alıcı</h3>
      <p>
        Sipariş formunda ad, soyad, adres, telefon ve e-posta bilgilerini
        beyan eden kişidir. Alıcı, beyan ettiği bilgilerin doğruluğundan
        sorumludur.
      </p>

      <h2>Madde 2 — Sözleşmenin konusu</h2>
      <p>
        İşbu sözleşmenin konusu, Alıcı&apos;nın {SITE.url} adresinden elektronik
        ortamda siparişini verdiği, nitelikleri ve satış fiyatı sipariş
        sayfasında belirtilen ürünlerin satışı ve teslimi ile ilgili olarak
        6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli
        Sözleşmeler Yönetmeliği hükümleri uyarınca tarafların hak ve
        yükümlülüklerinin belirlenmesidir.
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
          Satıcı, sipariş konusu ürünün tedarik edilemeyeceğinin anlaşılması
          hâlinde Alıcı&apos;yı bilgilendirir ve ödenen bedeli 14 gün içinde
          iade eder.
        </li>
        <li>
          Ürünün tesliminden sonra Alıcı&apos;ya ait kredi kartının Alıcı&apos;nın
          kusurundan kaynaklanmayan bir şekilde yetkisiz kişilerce haksız veya
          hukuka aykırı olarak kullanılması nedeniyle ilgili banka veya finans
          kuruluşunun ürün bedelini Satıcı&apos;ya ödememesi hâlinde, ürün
          Alıcı&apos;ya teslim edilmişse Alıcı ürünü Satıcı&apos;ya iade eder;
          bu durumda kargo giderleri Alıcı&apos;ya aittir.
        </li>
        <li>
          Mücbir sebepler (doğal afet, salgın, kargo hizmetlerinin durması vb.)
          nedeniyle teslim gerçekleşemezse Satıcı Alıcı&apos;yı bilgilendirir.
          Alıcı siparişi iptal etme veya engel ortadan kalkana kadar erteleme
          hakkına sahiptir.
        </li>
        <li>
          Alıcı, ürünü teslim aldığı anda kontrol etmek ve hasar durumunda
          kargo görevlisine tutanak tutturmakla yükümlüdür.
        </li>
      </ol>

      <h2>Madde 5 — Cayma hakkı</h2>
      <p>
        Alıcı, ürünü teslim aldığı tarihten itibaren{' '}
        <strong>{CAYMA_SURESI_GUN} gün</strong> içinde hiçbir gerekçe
        göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına
        sahiptir.
      </p>
      <p>
        Cayma bildirimi, bu süre içinde Satıcı&apos;ya yazılı olarak (WhatsApp
        veya e-posta) yöneltilir. Satıcı, cayma bildirimini aldığı tarihten
        itibaren <strong>14 gün</strong> içinde ödenen bedeli iade eder.
      </p>
      <p>
        Alıcı, cayma süresi içinde ürünü işleyişine ve teknik özelliklerine
        uygun kullanmalıdır. Aksi hâlde meydana gelen değer kaybından
        sorumludur.
      </p>

      <h2>Madde 6 — Cayma hakkının kullanılamayacağı ürünler</h2>
      <p>
        Mesafeli Sözleşmeler Yönetmeliği m.15 uyarınca aşağıdaki ürünlerde
        cayma hakkı kullanılamaz:
      </p>
      <ul>
        <li>
          Alıcı&apos;nın istekleri veya kişisel ihtiyaçları doğrultusunda
          hazırlanan ürünler (isim baskılı veya kişiselleştirilmiş takılar),
        </li>
        <li>
          Tesliminden sonra ambalajı açılmış olan ve iadesi sağlık ve hijyen
          açısından uygun olmayan ürünler (küpeler).
        </li>
      </ul>
      <p>
        Bu istisnalar, ürünün ayıplı olması hâlinde uygulanmaz. Ayıplı üründe
        Alıcı&apos;nın 6502 sayılı Kanun m.11 kapsamındaki seçimlik hakları
        saklıdır.
      </p>

      <h2>Madde 7 — Kişisel verilerin korunması</h2>
      <p>
        Alıcı&apos;nın kişisel verileri, 6698 sayılı KVKK kapsamında,{' '}
        <a href="/kvkk">Aydınlatma Metni</a>&apos;nde belirtilen amaç ve
        sınırlar dâhilinde işlenir. Ödeme bilgileri Satıcı tarafından
        saklanmaz; ödeme Shopier altyapısı üzerinden gerçekleştirilir.
      </p>

      <h2>Madde 8 — Uyuşmazlıkların çözümü</h2>
      <p>
        İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığı tarafından
        her yıl ilan edilen parasal sınırlar dâhilinde Alıcı&apos;nın veya
        Satıcı&apos;nın yerleşim yerindeki Tüketici Hakem Heyetleri ile
        Tüketici Mahkemeleri yetkilidir.
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
