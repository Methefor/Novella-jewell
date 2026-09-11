import { ArrowUpRight, Gift } from 'lucide-react';
import Link from 'next/link';

export default function LinkToPackaging() {
  return (
    <Link href="/#novella-kutusu" className="flex items-center gap-3 rounded-xl border border-gold/25 bg-cream px-4 py-3 text-sm transition-colors hover:bg-champagne">
      <Gift className="h-5 w-5 shrink-0 text-gold-dark" aria-hidden="true" />
      <span className="flex-1">
        Kutusunu yakından görün
        <span className="mt-0.5 block text-xs text-black/60">Seçtiğiniz ürün + Novella kartviziti</span>
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
    </Link>
  );
}
