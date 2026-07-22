'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * Sayfa geçişinde yumuşak giriş animasyonu.
 *
 * Bilinçli olarak AnimatePresence + exit animasyonu YOK: App Router'da
 * children exit animasyonu bitmeden değiştiği için mode="wait" sayfayı
 * boş bırakabiliyordu (ör. sepetten /sepet'e geçişte içerik görünmüyordu).
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
