'use client';

import { SSS } from '@/data/sss';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

export default function SssClient() {
  // Açık soru: "grupIndex-kalemIndex". Aynı anda tek soru açık.
  const [acik, setAcik] = useState<string | null>('0-0');

  return (
    <div className="space-y-10">
      {SSS.map((grup, gi) => (
        <section key={grup.baslik}>
          <h2
            className="font-serif font-light text-black mb-4"
            style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}
          >
            {grup.baslik}
          </h2>

          <div className="divide-y divide-border border-y border-border">
            {grup.kalemler.map((kalem, ki) => {
              const anahtar = `${gi}-${ki}`;
              const isAcik = acik === anahtar;
              return (
                <div key={kalem.soru}>
                  <button
                    type="button"
                    onClick={() => setAcik(isAcik ? null : anahtar)}
                    aria-expanded={isAcik}
                    className="w-full flex items-center justify-between gap-4 py-4 text-left group"
                  >
                    <span className="font-sans font-medium text-black text-[15px]">
                      {kalem.soru}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 text-black/40 transition-transform duration-300 ${
                        isAcik ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isAcik && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease }}
                        className="overflow-hidden"
                      >
                        <p className="pb-4 pr-8 font-sans font-light text-black/65 leading-relaxed text-[15px]">
                          {kalem.cevap}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
