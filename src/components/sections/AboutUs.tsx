'use client';

import { motion } from 'framer-motion';
import { Globe, Package, Truck } from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: 'Türkiye Geneli Kargo',
    desc: 'Tüm Türkiye\'ye hızlı ve güvenli kargo hizmeti.',
  },
  {
    icon: Truck,
    title: 'Hızlı Teslimat',
    desc: 'Siparişleriniz 1-3 iş günü içinde kapınıza gelir.',
  },
  {
    icon: Package,
    title: 'Özenli Paketleme',
    desc: 'Her takı, hediye kutusunda özenle hazırlanır.',
  },
];

const blocks = [
  {
    id: 'a1',
    title: 'Değerlerimiz',
    text: 'Novella olarak her tasarımda zarafeti, özgünlüğü ve kaliteyi ön planda tutuyoruz. Müşterilerimizin mutluluğu bizim en büyük önceliğimizdir.',
  },
  {
    id: 'a2',
    title: 'Hakkımızda',
    text: 'Novella, butik takı dünyasında kendine özgü bir yer edinen bir marka olarak her koleksiyonunu özenle tasarlar. Her parça, bir hikaye anlatır. Hammadden tasarıma, paketlemeden teslimat sürecine kadar detaylara verdiğimiz önem bizi farklı kılar.',
  },
  {
    id: 'a3',
    title: 'Misyonumuz',
    text: 'Her kadının kendini özel hissetmesini sağlamak için yüksek kaliteli takıları erişilebilir fiyatlarla sunmak. Novella\'yı takan her kadın, içindeki zarafeti dünyaya yansıtır.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function AboutUs() {
  return (
    <section
      id="about"
      className="relative"
      style={{
        backgroundImage: "url('/products/Pattern.png')",
        backgroundSize: 'auto',
        backgroundRepeat: 'repeat',
        backgroundColor: '#F8F6F3',
      }}
    >
      {/* Top features bar */}
      <div className="border-y border-[#E8E5E0] bg-white/80 backdrop-blur-sm">
        <motion.div
          className="container-custom py-8 md:py-12 grid md:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={itemVariants}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#C9A86A]/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[#C9A86A]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1A1A1A] mb-1">{title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Text blocks */}
      <motion.div
        className="container-custom py-12 md:py-20 grid md:grid-cols-3 gap-8 md:gap-10 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {blocks.map(({ id, title, text }) => (
          <motion.div key={id} variants={itemVariants} className="space-y-4">
            <h2 className="font-serif text-2xl text-[#1A1A1A]">{title}</h2>
            <div className="w-12 h-0.5 bg-[#C9A86A]" />
            <p className="text-[#6B6B6B] leading-relaxed text-sm">{text}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
