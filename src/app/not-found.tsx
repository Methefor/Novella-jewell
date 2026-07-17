import Link from 'next/link';

/**
 * Özel 404 — markalı ve kurtarıcı.
 *
 * Neden önemli: silinen kolye ürünlerinin eski linkleri ve yazım hataları
 * buraya düşüyor. Next.js'in çıplak varsayılan 404'ü çıkışsız bir duvar;
 * bu sayfa ziyaretçiyi mağazaya geri çeviriyor.
 *
 * Not: metadata'da robots noindex — 404 sayfaları aranmaya değmez.
 */
export const metadata = {
  title: 'Sayfa Bulunamadı',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center bg-champagne relative overflow-hidden px-6">
      <div className="absolute inset-0 texture-gold" aria-hidden="true" />

      <div className="relative text-center max-w-md">
        <p
          className="font-serif font-light text-gold-dark mb-2"
          style={{ fontSize: 'clamp(4rem, 12vw, 7rem)', lineHeight: 1 }}
        >
          404
        </p>

        <h1
          className="font-serif font-light text-black mb-4 text-balance"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', letterSpacing: '-0.02em' }}
        >
          Bu sayfa kaybolmuş.
        </h1>

        <p className="font-sans font-light text-black/55 mb-8 text-balance leading-relaxed">
          Aradığınız sayfa taşınmış veya artık burada değil. Ama koleksiyonumuz
          tam yerinde — bir göz atmak ister misiniz?
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/koleksiyonlar"
            className="inline-flex items-center justify-center min-h-[46px] px-7 bg-black text-white rounded-full hover:bg-gold transition-colors duration-300 text-sm font-medium tracking-wide"
          >
            Koleksiyonu Keşfet
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center min-h-[46px] px-7 text-black border border-gold/45 rounded-full hover:border-gold hover:bg-white/50 transition-colors duration-300 text-sm font-medium"
          >
            Ana Sayfa
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-black/45">
          <Link href="/collections/yeni-gelenler" className="hover:text-gold-dark transition-colors">
            Yeni Gelenler
          </Link>
          <span aria-hidden="true" className="text-black/20">·</span>
          <Link href="/hikayemiz" className="hover:text-gold-dark transition-colors">
            Hikayemiz
          </Link>
          <span aria-hidden="true" className="text-black/20">·</span>
          <Link href="/sss" className="hover:text-gold-dark transition-colors">
            Sık Sorulanlar
          </Link>
        </div>
      </div>
    </main>
  );
}
