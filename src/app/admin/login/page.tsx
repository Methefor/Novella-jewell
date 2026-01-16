'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email veya şifre hatalı');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong w-full max-w-md rounded-3xl p-8 md:p-12"
      >
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-gradient">
              <Lock className="h-8 w-8 text-black" />
            </div>
          </div>
          <h1 className="mb-2 font-cormorant text-3xl font-bold text-white md:text-4xl">
            Admin Girişi
          </h1>
          <p className="font-inter text-sm text-white/60">
            NOVELLA Yönetim Paneli
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-3">
              <p className="font-inter text-sm text-red-400">{error}</p>
            </div>
          )}

          <div>
            <label className="mb-2 block font-inter text-sm font-medium text-white/80">
              Email
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-5 w-5 text-white/40" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-12 pr-4 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                placeholder="admin@novella.com.tr"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-inter text-sm font-medium text-white/80">
              Şifre
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Lock className="h-5 w-5 text-white/40" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-12 pr-4 font-inter text-white placeholder:text-white/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full rounded-full bg-gold-gradient py-4 font-inter font-semibold text-black shadow-lg transition-all hover:shadow-xl hover:shadow-gold/30 disabled:opacity-50"
          >
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="font-inter text-sm text-white/60 transition-colors hover:text-gold"
          >
            ← Ana Sayfaya Dön
          </a>
        </div>
      </motion.div>
    </div>
  );
}

