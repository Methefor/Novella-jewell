import Link from 'next/link';

/** Veritabanı çalışıyor ve katalog gerçekten boş: bir arıza değil, normal bir vitrin durumu. */
export default function CatalogEmpty() {
  return (
    <section className="px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-label mb-4">Yakında</p>
        <h2 className="font-serif text-3xl font-light tracking-[-0.025em] md:text-4xl">
          Şu anda vitrinde ürün bulunmuyor
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-black/60">
          Yeni parçalarımızı hazırlıyoruz. Kısa süre sonra tekrar uğrayın.
        </p>
        <Link
          href="/iletisim"
          className="mt-7 inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gold-dark"
        >
          Bize yazın
        </Link>
      </div>
    </section>
  );
}
