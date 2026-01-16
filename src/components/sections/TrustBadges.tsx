'use client';

import { motion } from 'framer-motion';
import { Gem, MessageCircle, Package, RefreshCw, Truck } from 'lucide-react';

const badges = [
  {
    icon: Gem,
    title: 'Kaliteli Malzeme',
    description: 'Premium çelik ve altın kaplama garantisi',
  },
  {
    icon: Package,
    title: 'Özenli Paketleme',
    description: 'Her ürün özel kutusunda, hediye paketi seçeneği',
  },
  {
    icon: Truck,
    title: 'Hızlı Kargo',
    description: 'Türkiye geneli ücretsiz ve hızlı teslimat',
  },
  {
    icon: MessageCircle,
    title: '7/24 İletişim',
    description: 'WhatsApp ve Instagram anında destek',
  },
  {
    icon: RefreshCw,
    title: 'Kolay İade',
    description: '7 gün içinde ücretsiz iade ve değişim',
  },
];

export default function TrustBadges() {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-6">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-gold/20 to-gold/5 group-hover:from-gold/30 group-hover:to-gold/10 transition-all duration-300">
                <badge.icon className="w-8 h-8 text-gold" />
              </div>

              {/* Title */}
              <h3 className="text-h6 font-heading font-semibold text-black mb-2">
                {badge.title}
              </h3>

              {/* Description */}
              <p className="text-body-sm text-gray-600 leading-relaxed">
                {badge.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
