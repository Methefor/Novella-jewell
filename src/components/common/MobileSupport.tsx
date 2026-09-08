'use client';
import { MessageCircle, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { SITE } from '@/lib/config';

export default function MobileSupport() {
  const pathname = usePathname();
  // Product pages already have a purchase bar and product-specific WhatsApp link.
  if (/^\/(admin|odeme|sepet|urun)(\/|$)/.test(pathname)) return null;
  return <aside aria-label="Hızlı destek" className="fixed right-4 z-30 flex rounded-full border border-black/10 bg-white shadow-lg lg:hidden bottom-[calc(env(safe-area-inset-bottom)+5.5rem)]">
    <a href={`tel:+${SITE.whatsapp}`} aria-label="Novella’yı telefonla ara" className="grid h-12 w-12 place-items-center rounded-l-full focus-visible:ring-2 focus-visible:ring-black"><Phone className="h-4 w-4" /></a>
    <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex h-12 items-center gap-2 rounded-r-full bg-[#16130f] px-4 text-xs font-medium text-white focus-visible:ring-2 focus-visible:ring-black"><MessageCircle className="h-4 w-4" />WhatsApp destek</a>
  </aside>;
}
