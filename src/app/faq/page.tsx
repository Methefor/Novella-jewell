import { Metadata } from 'next';
import { HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sık Sorulan Sorular | NOVELLA',
  description: 'NOVELLA hakkında sık sorulan sorular ve cevapları',
};

const faqs = [
  {
    question: 'Ürünleriniz gerçekten paslanmaz çelik mi?',
    answer:
      'Evet, tüm ürünlerimiz 316L kalite paslanmaz çelikten üretilmektedir. Bu kalite, günlük kullanımda paslanma, kararma ve alerji yapmaz.',
  },
  {
    question: 'Kargo süresi ne kadar?',
    answer:
      'Siparişleriniz 1-2 iş günü içinde hazırlanır ve kargoya verilir. Türkiye geneli kargo süresi 2-4 iş günüdür. İstanbul içi siparişler genellikle 1-2 gün içinde teslim edilir.',
  },
  {
    question: 'Ücretsiz kargo var mı?',
    answer:
      'Evet, Türkiye geneli tüm siparişlerde ücretsiz kargo hizmeti sunuyoruz.',
  },
  {
    question: 'İade ve değişim nasıl yapılır?',
    answer:
      '14 gün içinde koşulsuz iade ve değişim hakkınız vardır. Ürün orijinal ambalajında ve kullanılmamış olmalıdır. İade kargo ücreti müşteriye aittir.',
  },
  {
    question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
    answer:
      'Shopier üzerinden kredi kartı, banka kartı ile ödeme yapabilir veya WhatsApp üzerinden sipariş verebilirsiniz.',
  },
  {
    question: 'Ürünleriniz garanti kapsamında mı?',
    answer:
      'Evet, tüm ürünlerimiz 1 yıl üretici garantisi kapsamındadır. Üretim hatası durumunda ücretsiz değişim yapılır.',
  },
  {
    question: 'Özel tasarım yapıyor musunuz?',
    answer:
      'Evet, özel tasarım hizmeti sunuyoruz. Detaylı bilgi için WhatsApp (0545 112 50 59) veya Instagram DM üzerinden iletişime geçebilirsiniz.',
  },
  {
    question: 'Hediye paketi seçeneği var mı?',
    answer:
      'Evet, sipariş notlarında "hediye paketi" yazarsanız ürününüz özel hediye paketinde gönderilir.',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
              <HelpCircle className="h-8 w-8 text-gold" />
            </div>
          </div>
          <h1 className="mb-4 font-cormorant text-4xl font-bold text-white md:text-5xl">
            Sık Sorulan Sorular
          </h1>
          <p className="mx-auto max-w-2xl font-inter text-lg text-white/60">
            Merak ettiğiniz soruların cevaplarını burada bulabilirsiniz
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6 transition-all hover:bg-white/10"
            >
              <h3 className="mb-3 font-cormorant text-xl font-semibold text-white">
                {faq.question}
              </h3>
              <p className="font-inter leading-relaxed text-white/70">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="glass-strong mx-auto max-w-2xl rounded-2xl p-8">
            <h3 className="mb-4 font-cormorant text-2xl font-semibold text-white">
              Sorunuz mu var?
            </h3>
            <p className="mb-6 font-inter text-white/70">
              Aradığınız cevabı bulamadıysanız, bizimle iletişime geçin.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="https://wa.me/905451125059"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-green-500 px-6 py-3 font-inter font-semibold text-white transition-all hover:bg-green-600"
              >
                WhatsApp ile İletişim
              </a>
              <a
                href="https://instagram.com/jewelry.novella"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 px-6 py-3 font-inter font-semibold text-white transition-all hover:bg-white/20"
              >
                Instagram DM
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

