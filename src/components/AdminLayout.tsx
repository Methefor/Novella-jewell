'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  LogOut,
  Package,
  ShoppingBag,
  Settings,
  Home,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/products', label: 'Ürünler', icon: Package },
  { href: '/admin/orders', label: 'Siparişler', icon: ShoppingBag },
  { href: '/admin/settings', label: 'Ayarlar', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F]">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#0F0F0F]">
      {/* Sidebar */}
      <aside className="glass-strong fixed inset-y-0 left-0 w-64 border-r border-white/10 p-6">
        <div className="mb-8">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-gradient">
              <span className="font-cormorant text-xl font-bold text-black">N</span>
            </div>
            <div>
              <h2 className="font-cormorant text-xl font-bold text-white">
                NOVELLA
              </h2>
              <p className="font-inter text-[10px] text-white/60">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="space-y-2">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`glass flex items-center gap-3 rounded-lg px-4 py-3 font-inter text-sm transition-all ${
                  isActive
                    ? 'bg-gold/20 text-gold border border-gold/30'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Link
            href="/"
            className="glass mb-3 flex items-center gap-3 rounded-lg px-4 py-3 font-inter text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white"
          >
            <Home className="h-5 w-5" />
            Ana Sayfa
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="glass flex w-full items-center gap-3 rounded-lg px-4 py-3 font-inter text-sm text-white/70 transition-all hover:bg-red-500/20 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        <div className="min-h-screen p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

