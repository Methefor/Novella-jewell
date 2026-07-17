'use client';

/**
 * global-error — KÖK layout'ta (layout.tsx) oluşan hataları yakalar.
 *
 * error.tsx yalnızca sayfa içi hataları yakalar; layout'un kendisi çökerse
 * devreye bu girer. Kök layout'un yerini aldığı için KENDİ <html>/<body>'sini
 * render etmek zorunda. Fontlar/globals.css yüklenmemiş olabileceğinden
 * kritik stiller inline verildi — hiçbir dış bağımlılığa güvenmiyor.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAF8F5',
          color: '#0A0A0A',
          fontFamily: 'Inter, -apple-system, sans-serif',
          textAlign: 'center',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 64,
              fontWeight: 300,
              color: '#9E8E63',
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            NOVELLA
          </div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontSize: 28,
              margin: '0 0 12px',
            }}
          >
            Beklenmedik bir hata oluştu
          </h1>
          <p
            style={{
              color: 'rgba(10,10,10,0.55)',
              fontWeight: 300,
              lineHeight: 1.6,
              margin: '0 0 28px',
            }}
          >
            Bir şeyler ters gitti. Lütfen tekrar deneyin; sorun sürerse birazdan
            yeniden bekleriz.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              border: 'none',
              cursor: 'pointer',
              background: '#0A0A0A',
              color: '#fff',
              padding: '13px 30px',
              borderRadius: 9999,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Tekrar Dene
          </button>
        </div>
      </body>
    </html>
  );
}
