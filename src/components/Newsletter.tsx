'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Gift } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Email toplama API entegrasyonu
    setIsSubmitted(true);
    setEmail('');

    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <section className="relative overflow-hidden bg-[#0F0F0F] py-20">
      {/* Background Elements */}
      <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-rose-gold/10 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="glass-strong mx-auto max-w-4xl overflow-hidden rounded-3xl">
          <div className="grid gap-8 p-8 md:grid-cols-2 md:p-12 lg:gap-12">
            {/* Left Side - Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              {/* Icon */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut',
                }}
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/20"
              >
                <Gift className="h-8 w-8 text-gold" />
              </motion.div>

              <h2 className="mb-4 font-cormorant text-4xl font-bold text-white md:text-5xl">
                İlk Siparişinize
                <br />
                <span className="text-gradient">%10 İndirim</span>
              </h2>

              <p className="mb-6 font-inter text-lg leading-relaxed text-white/70">
                Yeni ürünler, özel kampanyalar ve hikayelerimizden haberdar olmak
                için e-bültenimize abone olun.
              </p>

              {/* Benefits */}
              <div className="space-y-3">
                {[
                  'İlk siparişte %10 indirim',
                  'Özel kampanyalardan ilk siz haberdar olun',
                  'Yeni koleksiyonlara erken erişim',
                ].map((benefit, i) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20">
                      <span className="text-gold">✓</span>
                    </div>
                    <span className="font-inter text-sm text-white/80">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Input */}
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Mail className="h-5 w-5 text-white/40" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="E-posta adresiniz"
                      className="glass w-full rounded-full border border-white/10 bg-white/5 py-4 pl-12 pr-4 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full rounded-full bg-gold-gradient py-4 font-inter font-semibold text-black shadow-lg transition-all hover:shadow-xl hover:shadow-gold/30"
                  >
                    %10 İndirim Kodunu Al
                  </motion.button>

                  {/* Privacy */}
                  <p className="text-center font-inter text-xs text-white/40">
                    Abone olarak{' '}
                    <a href="#" className="text-gold hover:underline">
                      Gizlilik Politikamızı
                    </a>{' '}
                    kabul etmiş olursunuz.
                  </p>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <div className="mb-4 flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-green-500/20">
                    <span className="text-4xl">✓</span>
                  </div>
                  <h3 className="mb-2 font-cormorant text-2xl font-bold text-white">
                    Teşekkürler!
                  </h3>
                  <p className="mb-4 font-inter text-white/70">
                    İndirim kodunuz e-posta adresinize gönderildi.
                  </p>
                  <div className="glass inline-block rounded-full px-6 py-3">
                    <span className="font-inter text-lg font-bold text-gold">NOVELLA10</span>
                  </div>
                </motion.div>
              )}

              {/* Social Proof */}
              <div className="mt-8 flex items-center justify-center gap-2 text-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-[#0F0F0F] bg-gradient-to-br from-gold/20 to-rose-gold/20"
                    />
                  ))}
                </div>
                <p className="font-inter text-sm text-white/60">
                  <span className="font-semibold text-white">500+</span> kişi abone oldu
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
