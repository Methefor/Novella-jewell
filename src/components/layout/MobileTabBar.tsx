'use client';

import SearchModal from '@/components/search/SearchModal';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { motion } from 'framer-motion';
import { Heart, Home, LayoutGrid, Search, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

/** Alt çubuğun gizlendiği rotalar — bu sayfaların kendi alt aksiyon barı var. */
const HIDDEN_ROUTES = /^\/(admin|odeme|sepet|urun)(\/|$)/;

type TabId = 'home' | 'collections' | 'search' | 'wishlist' | 'cart';

export default function MobileTabBar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const cartCount = useCartStore((s) => s.items.length);
  const isDrawerOpen = useCartStore((s) => s.isDrawerOpen);
  const openDrawer = useCartStore((s) => s.openDrawer);

  if (HIDDEN_ROUTES.test(pathname)) return null;

  const active: TabId | null = searchOpen
    ? 'search'
    : isDrawerOpen
      ? 'cart'
      : pathname === '/'
        ? 'home'
        : pathname.startsWith('/favoriler')
          ? 'wishlist'
          : pathname.startsWith('/koleksiyonlar') || pathname.startsWith('/collections')
            ? 'collections'
            : null;

  return (
    <>
      <nav
        aria-label="Ana gezinme"
        className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
      >
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease }}
          className="flex w-full max-w-[360px] items-center justify-between rounded-full border border-border bg-white p-2 shadow-[0_8px_24px_rgba(24,18,10,0.10)]"
        >
          <TabLink active={active === 'home'} href="/" label="Ana Sayfa" Icon={Home} />
          <TabLink
            active={active === 'collections'}
            href="/koleksiyonlar"
            label="Koleksiyonlar"
            Icon={LayoutGrid}
          />
          <TabButton
            active={active === 'search'}
            label="Ara"
            Icon={Search}
            onClick={() => setSearchOpen(true)}
          />
          <TabLink
            active={active === 'wishlist'}
            href="/favoriler"
            label="Favoriler"
            Icon={Heart}
            badge={wishlistCount}
          />
          <TabButton
            active={active === 'cart'}
            label="Sepet"
            Icon={ShoppingBag}
            onClick={openDrawer}
            badge={cartCount}
          />
        </motion.div>
      </nav>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

type TabVisualProps = {
  active: boolean;
  label: string;
  Icon: typeof Home;
  badge?: number;
};

function TabInner({ active, label, Icon, badge }: TabVisualProps) {
  return (
    <span className="relative flex items-center gap-1.5">
      {active && (
        <motion.span
          layoutId="mobile-tab-pill"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          className="absolute inset-0 -mx-3.5 -my-2 rounded-full bg-gold"
        />
      )}
      <span className="relative flex items-center gap-1.5">
        <Icon
          className={`h-[19px] w-[19px] transition-colors ${
            active ? 'text-[#4a3f22]' : 'text-black/40'
          }`}
          strokeWidth={active ? 2 : 1.75}
        />
        {active && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            className="overflow-hidden whitespace-nowrap text-[12px] font-medium text-[#4a3f22]"
          >
            {label}
          </motion.span>
        )}
      </span>
      {!active && badge != null && badge > 0 && (
        <span className="absolute -right-1.5 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black text-[8px] font-medium text-white">
          {badge}
        </span>
      )}
    </span>
  );
}

function TabLink({ active, label, Icon, badge, href }: TabVisualProps & { href: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className="flex min-h-11 min-w-11 items-center justify-center rounded-full px-3.5 py-2"
    >
      <TabInner active={active} label={label} Icon={Icon} badge={badge} />
    </Link>
  );
}

function TabButton({
  active,
  label,
  Icon,
  badge,
  onClick,
}: TabVisualProps & { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex min-h-11 min-w-11 items-center justify-center rounded-full px-3.5 py-2"
    >
      <TabInner active={active} label={label} Icon={Icon} badge={badge} />
    </button>
  );
}
