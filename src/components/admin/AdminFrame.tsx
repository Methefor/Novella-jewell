'use client';

import {
  BarChart3,
  CalendarDays,
  Copy,
  LayoutDashboard,
  Megaphone,
  Package,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Tags,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type NavItem = { href: string; label: string; icon: LucideIcon; external?: boolean };

const NAV: NavItem[] = [
  { href: '/admin', label: 'Genel Bakış', icon: LayoutDashboard },
  { href: '/admin/siparisler', label: 'Siparişler', icon: ShoppingBag },
  { href: '/admin/urunler', label: 'Ürünler', icon: Package },
  { href: '/admin/analitik', label: 'Analitik', icon: BarChart3 },
  { href: '/admin/stok', label: 'Stok', icon: Tags },
  { href: '/admin/reklam-hazirlik', label: 'Reklam Hazırlığı', icon: Megaphone },
  { href: '/admin/kampanyalar', label: 'Kampanyalar', icon: Sparkles },
  { href: '/admin/icerik-takvimi', label: 'İçerik Takvimi', icon: CalendarDays },
  { href: '/admin/mukerrer-urunler', label: 'Mükerrer Kontrolü', icon: Copy },
  { href: '/admin/guvenlik', label: 'Güvenlik', icon: ShieldCheck },
];

function isActive(pathname: string, href: string) {
  return href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
}

/** Yönetim ekranları için sol ikon çubuğu (mobilde üstte kaydırılabilir şerit). */
export default function AdminFrame({ children, userSlot }: { children: ReactNode; userSlot?: ReactNode }) {
  const pathname = usePathname() ?? '';
  const items: NavItem[] = [...NAV, { href: '/', label: 'Mağazayı aç', icon: Store, external: true }];

  return (
    <div className="relative min-h-screen bg-[#f6f2eb]">
      <div aria-hidden className="pointer-events-none fixed -right-32 -top-40 h-[520px] w-[520px] rounded-full bg-[#ecd9ae] opacity-55 blur-[90px]" />
      <div aria-hidden className="pointer-events-none fixed -bottom-44 -left-36 h-[460px] w-[460px] rounded-full bg-[#e9c9a4] opacity-40 blur-[90px]" />

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[72px] flex-col items-center gap-2 border-r border-white/70 bg-white/55 py-5 backdrop-blur-xl lg:flex">
        <Link href="/admin" aria-label="Novella yönetim" className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-[#171713] font-heading text-lg text-[#e5d3a8]">N</Link>
        <nav aria-label="Yönetim menüsü" className="flex flex-1 flex-col items-center gap-1.5">
          {items.map(({ href, label, icon: Icon, external }) => {
            const active = !external && isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                target={external ? '_blank' : undefined}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
                className={`group relative grid h-11 w-11 place-items-center rounded-2xl transition-all duration-300 hover:-translate-y-0.5 ${active ? 'bg-[#171713] text-white shadow-lg' : 'text-[#7b7466] hover:bg-white hover:text-[#171713]'}`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-[#171713] px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-2">{userSlot}</div>
      </aside>

      <nav aria-label="Yönetim menüsü" className="sticky top-0 z-50 flex items-center gap-1.5 overflow-x-auto border-b border-white/70 bg-white/70 px-3 py-2 backdrop-blur-xl lg:hidden">
        {items.map(({ href, label, icon: Icon, external }) => {
          const active = !external && isActive(pathname, href);
          return (
            <Link key={href} href={href} target={external ? '_blank' : undefined} aria-current={active ? 'page' : undefined} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium ${active ? 'bg-[#171713] text-white' : 'text-[#7b7466]'}`}>
              <Icon className="h-4 w-4" strokeWidth={1.8} />{label}
            </Link>
          );
        })}
        <div className="ml-auto shrink-0 pl-2">{userSlot}</div>
      </nav>

      <div className="relative lg:pl-[72px]">{children}</div>
    </div>
  );
}
