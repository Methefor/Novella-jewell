'use client';

import { motion } from 'framer-motion';
import { Instagram, Send, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

const footerLinks = {
  shop: [
    { label: 'Tüm Ürünler', href: '/products' },
    { label: 'Kolye', href: '/categories/kolye' },
    { label: 'Bilezik', href: '/categories/bilezik' },
    { label: 'Küpe', href: '/categories/kupe' },
    { label: 'Yüzük', href: '/categories/yuzuk' },
  ],
  company: [
    { label: 'Hakkımızda', href: '#about' },
    { label: 'Hikayemiz', href: '#about' },
    { label: 'İletişim', href: '#contact' },
    { label: 'Blog', href: '/blog' },
  ],
  help: [
    { label: 'SSS', href: '/faq' },
    { label: 'Kargo & Teslimat', href: '/shipping' },
    { label: 'İade & Değişim', href: '/returns' },
    { label: 'Gizlilik Politikası', href: '/privacy' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/jewelry.novella', label: 'Instagram' },
  { icon: Send, href: 'https://tiktok.com/@novella.tr', label: 'TikTok' },
  {
    icon: Phone,
    href: 'https://wa.me/905451125059',
    label: 'WhatsApp',
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0F0F0F]">
      {/* Background Glow */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-rose-gold/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-6 flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient">
                <span className="font-cormorant text-2xl font-bold text-black">N</span>
              </div>
              <div>
                <h2 className="font-cormorant text-2xl font-bold text-white">NOVELLA</h2>
                <p className="font-inter text-xs text-white/60">Her Parça Bir Hikaye</p>
              </div>
            </Link>

            <p className="mb-6 max-w-md font-inter text-sm leading-relaxed text-white/70">
              Premium kalitede çelik takılar ile tarzınızı yansıtın. Tekirdağ'dan
              Türkiye'ye uzanan yolculuğumuzda, kaliteyi ve estetiği bir araya
              getiriyoruz.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="glass flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-all hover:bg-gold hover:text-black"
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="mb-4 font-cormorant text-lg font-semibold text-white">
              Alışveriş
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-inter text-sm text-white/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-cormorant text-lg font-semibold text-white">
              Kurumsal
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-inter text-sm text-white/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-cormorant text-lg font-semibold text-white">
              Yardım
            </h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-inter text-sm text-white/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="glass mb-8 overflow-hidden rounded-2xl">
          <div className="grid gap-6 p-8 md:grid-cols-3">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold/20">
                <Phone className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h4 className="mb-1 font-inter text-sm font-semibold text-white">
                  WhatsApp
                </h4>
                <a
                  href="https://wa.me/905451125059"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-inter text-sm text-white/60 transition-colors hover:text-gold"
                >
                  +90 545 112 50 59
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold/20">
                <Mail className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h4 className="mb-1 font-inter text-sm font-semibold text-white">
                  E-posta
                </h4>
                <a
                  href="mailto:info@novella.com.tr"
                  className="font-inter text-sm text-white/60 transition-colors hover:text-gold"
                >
                  info@novella.com.tr
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gold/20">
                <Instagram className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h4 className="mb-1 font-inter text-sm font-semibold text-white">
                  Sosyal Medya
                </h4>
                <div className="flex gap-2">
                  <a
                    href="https://instagram.com/jewelry.novella"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-inter text-sm text-white/60 transition-colors hover:text-gold"
                  >
                    Instagram
                  </a>
                  <span className="text-white/40">•</span>
                  <a
                    href="https://tiktok.com/@novella.tr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-inter text-sm text-white/60 transition-colors hover:text-gold"
                  >
                    TikTok
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 md:flex-row">
          <p className="font-inter text-sm text-white/60">
            © 2025 NOVELLA. Tüm hakları saklıdır.
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-4">
            <span className="font-inter text-xs text-white/40">Güvenli Ödeme:</span>
            <div className="flex items-center gap-2">
              {['💳', '🔒', '✓'].map((icon, i) => (
                <div
                  key={i}
                  className="glass flex h-8 w-8 items-center justify-center rounded text-sm"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
