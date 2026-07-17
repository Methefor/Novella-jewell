'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Ruler, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Yüzük beden rehberi.
 *
 * Online takıda en büyük iade sebebi yüzüğün olmaması. Basit bir "parmağını
 * ölç" rehberi + çevrim tablosu iadeleri düşürür.
 *
 * Türk kuyumcu ölçü sistemi: parmak çevresi (mm) esas alınır. Numara ≈
 * iç çap (mm). Tablo Türkiye'de yaygın kullanılan aralığı kapsar.
 *
 * NOT: Ürünlerin çoğu açık uçlu/ayarlanabilir — bu rehber "kesin ölçü şart"
 * baskısı yapmaz, "yaklaşık şu aralık" der. Ayarlanabilir üründe zaten esneme
 * payı var.
 */

// Parmak çevresi (mm) → yaklaşık numara (iç çap mm)
const OLCU_TABLOSU = [
  { cevre: '44–46 mm', numara: '14', tarif: 'İnce' },
  { cevre: '47–49 mm', numara: '15', tarif: 'İnce–Orta' },
  { cevre: '50–52 mm', numara: '16', tarif: 'Orta (en yaygın)' },
  { cevre: '53–55 mm', numara: '17', tarif: 'Orta–Geniş' },
  { cevre: '56–58 mm', numara: '18', tarif: 'Geniş' },
  { cevre: '59–61 mm', numara: '19', tarif: 'Çok geniş' },
];

export default function BedenRehberi() {
  const [acik, setAcik] = useState(false);

  useEffect(() => {
    if (!acik) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAcik(false);
    };
    window.addEventListener('keydown', onKey);
    const onceki = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = onceki;
    };
  }, [acik]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAcik(true)}
        className="inline-flex items-center gap-1.5 text-sm text-black/50 hover:text-gold-dark transition-colors"
      >
        <Ruler className="w-4 h-4" />
        Beden rehberi
      </button>

      <AnimatePresence>
        {acik && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Yüzük beden rehberi"
            onClick={(e) => {
              if (e.target === e.currentTarget) setAcik(false);
            }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.35, ease }}
              className="bg-cream w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[88vh] overflow-y-auto"
            >
              {/* Başlık */}
              <div className="sticky top-0 bg-cream/95 backdrop-blur-sm px-6 pt-6 pb-4 flex items-start justify-between border-b border-border">
                <div>
                  <h2 className="font-serif font-light text-2xl text-black">
                    Yüzük Beden Rehberi
                  </h2>
                  <p className="text-sm text-black/50 mt-1">
                    Parmağını ölç, doğru bedeni bul.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAcik(false)}
                  aria-label="Kapat"
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-black/5 text-black/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-5 legal-prose">
                {/* Nasıl ölçülür */}
                <h3>Evde nasıl ölçülür?</h3>
                <ol>
                  <li>
                    Bir kağıt şeridi veya ipi parmağının en kalın yerine (boğum)
                    sar.
                  </li>
                  <li>
                    Şeridin birleştiği noktayı kalemle işaretle, cetvelle{' '}
                    <strong>milimetre</strong> cinsinden ölç.
                  </li>
                  <li>
                    Ölçtüğün çevreyi aşağıdaki tablodan bedenle eşleştir.
                  </li>
                </ol>
                <p className="text-sm text-black/50">
                  İpucu: Akşam ölç — parmaklar gün içinde hafif şişer, akşam
                  ölçüsü daha güvenli olur.
                </p>

                {/* Tablo */}
                <h3>Ölçü tablosu</h3>
                <div className="overflow-x-auto -mx-1">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="text-left border-b border-border">
                        <th className="py-2 pr-4 font-medium text-black">
                          Parmak çevresi
                        </th>
                        <th className="py-2 pr-4 font-medium text-black">
                          Numara
                        </th>
                        <th className="py-2 font-medium text-black">Genişlik</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OLCU_TABLOSU.map((s) => (
                        <tr key={s.numara} className="border-b border-border/60">
                          <td className="py-2.5 pr-4 text-black/70">
                            {s.cevre}
                          </td>
                          <td className="py-2.5 pr-4 font-medium text-gold-dark">
                            {s.numara}
                          </td>
                          <td className="py-2.5 text-black/55">{s.tarif}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Ayarlanabilir not */}
                <div className="legal-box mt-5">
                  <p style={{ marginBottom: 0 }}>
                    <strong>Ayarlanabilir modeller:</strong> Açık uçlu
                    yüzüklerimiz hafifçe genişletilip daraltılabilir, bu yüzden
                    çoğu ölçüye uyar. Yine de takarken zorlamayın — çelik esner
                    ama zorlanınca formu bozulabilir.
                  </p>
                </div>

                <p className="text-sm text-black/50">
                  Emin değil misin? WhatsApp&apos;tan yaz, birlikte doğru bedeni
                  bulalım.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
