'use client';

import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F3] px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="font-serif text-2xl text-black mb-3">Bir hata oluştu</h2>
        <p className="text-black/60 mb-6 text-sm">
          Sayfa yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin veya ana
          sayfaya dönün.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-full hover:bg-gold transition-colors text-sm font-medium"
          >
            Sayfayı Yenile
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-black border border-black/18 rounded-full hover:border-black/55 transition-colors text-sm font-medium"
          >
            Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
