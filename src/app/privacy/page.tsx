import { Metadata } from 'next';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | NOVELLA',
  description: 'NOVELLA gizlilik politikası ve kişisel verilerin korunması',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
              <Shield className="h-8 w-8 text-gold" />
            </div>
          </div>
          <h1 className="mb-4 font-cormorant text-4xl font-bold text-white md:text-5xl">
            Gizlilik Politikası
          </h1>
          <p className="mx-auto max-w-2xl font-inter text-lg text-white/60">
            Kişisel verilerinizin korunması bizim için önemlidir
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-8">
          <div className="glass rounded-2xl p-8">
            <h2 className="mb-4 font-cormorant text-2xl font-semibold text-white">
              Veri Toplama
            </h2>
            <p className="mb-4 font-inter text-white/70">
              NOVELLA olarak, hizmetlerimizi sunabilmek için aşağıdaki kişisel
              verilerinizi topluyoruz:
            </p>
            <ul className="space-y-2 font-inter text-white/70">
              <li>• Ad, soyad, e-posta adresi</li>
              <li>• Telefon numarası</li>
              <li>• Adres bilgileri (teslimat için)</li>
              <li>• Sipariş geçmişi</li>
            </ul>
          </div>

          <div className="glass rounded-2xl p-8">
            <h2 className="mb-4 font-cormorant text-2xl font-semibold text-white">
              Veri Kullanımı
            </h2>
            <p className="mb-4 font-inter text-white/70">
              Toplanan verileriniz aşağıdaki amaçlarla kullanılmaktadır:
            </p>
            <ul className="space-y-2 font-inter text-white/70">
              <li>• Sipariş işleme ve teslimat</li>
              <li>• Müşteri hizmetleri</li>
              <li>• Kampanya ve duyurular (izin verdiğiniz takdirde)</li>
              <li>• Yasal yükümlülüklerin yerine getirilmesi</li>
            </ul>
          </div>

          <div className="glass rounded-2xl p-8">
            <h2 className="mb-4 font-cormorant text-2xl font-semibold text-white">
              Veri Güvenliği
            </h2>
            <p className="font-inter text-white/70">
              Kişisel verileriniz SSL sertifikası ile korunmaktadır. Verileriniz
              üçüncü taraflarla paylaşılmaz ve yalnızca hizmet sunumu için
              gerekli olduğu ölçüde işlenir.
            </p>
          </div>

          <div className="glass rounded-2xl p-8">
            <h2 className="mb-4 font-cormorant text-2xl font-semibold text-white">
              Çerezler (Cookies)
            </h2>
            <p className="font-inter text-white/70">
              Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler
              kullanmaktadır. Çerezler, sepet bilgilerinizi saklamak ve site
              kullanımınızı analiz etmek için kullanılır.
            </p>
          </div>

          <div className="glass rounded-2xl p-8">
            <h2 className="mb-4 font-cormorant text-2xl font-semibold text-white">
              Haklarınız
            </h2>
            <p className="mb-4 font-inter text-white/70">
              KVKK kapsamında aşağıdaki haklara sahipsiniz:
            </p>
            <ul className="space-y-2 font-inter text-white/70">
              <li>• Kişisel verilerinize erişim</li>
              <li>• Verilerinizin düzeltilmesi</li>
              <li>• Verilerinizin silinmesi</li>
              <li>• İşleme itiraz etme</li>
            </ul>
          </div>

          <div className="glass-strong rounded-2xl p-8 text-center">
            <h3 className="mb-4 font-cormorant text-2xl font-semibold text-white">
              İletişim
            </h3>
            <p className="mb-6 font-inter text-white/70">
              Gizlilik politikamız hakkında sorularınız için bizimle iletişime
              geçebilirsiniz.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="mailto:info@novella.com.tr"
                className="rounded-full bg-gold-gradient px-6 py-3 font-inter font-semibold text-black"
              >
                E-posta Gönder
              </a>
              <a
                href="https://wa.me/905451125059"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 px-6 py-3 font-inter font-semibold text-white transition-all hover:bg-white/20"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

