'use client';

import { Component, ReactNode } from 'react';
import { AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0F0F0F] px-4">
          <div className="glass-strong mx-auto max-w-md rounded-2xl p-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <h2 className="mb-2 font-cormorant text-2xl font-semibold text-white">
              Bir Hata Oluştu
            </h2>
            <p className="mb-6 font-inter text-white/60">
              Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya
              ana sayfaya dönün.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="rounded-full bg-gold-gradient px-6 py-3 font-inter font-semibold text-black"
              >
                Sayfayı Yenile
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-3 font-inter font-semibold text-white transition-all hover:bg-white/20"
              >
                <Home className="h-4 w-4" />
                Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

