'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Instagram } from 'lucide-react';

const WHATSAPP_NUMBER = '905451125059';
const INSTAGRAM_USERNAME = 'jewelry.novella';

export default function ContactButtons() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;
  const instagramUrl = `https://instagram.com/${INSTAGRAM_USERNAME}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg transition-all hover:bg-green-600 hover:shadow-xl"
        aria-label="WhatsApp ile iletişime geç"
      >
        <MessageCircle className="h-7 w-7 text-white" />
        <span className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full whitespace-nowrap rounded-lg bg-black px-3 py-2 font-inter text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
          WhatsApp: 0545 112 50 59
        </span>
      </motion.a>

      {/* Instagram Button */}
      <motion.a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 shadow-lg transition-all hover:shadow-xl"
        aria-label="Instagram'da bizi takip et"
      >
        <Instagram className="h-7 w-7 text-white" />
        <span className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full whitespace-nowrap rounded-lg bg-black px-3 py-2 font-inter text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
          Instagram DM
        </span>
      </motion.a>
    </div>
  );
}

