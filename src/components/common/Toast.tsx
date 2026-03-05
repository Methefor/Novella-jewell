/**
 * NOVELLA - Toast Notification Component
 * Global toast notifications - Luxury cream styling + progress bar
 */

'use client';

import { useToastStore, type ToastType } from '@/hooks/useToast';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
  warning: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

const styles: Record<ToastType, { container: string; icon: string }> = {
  success: {
    container: 'bg-[#F8F6F3] border border-[#6b8e7f] text-[#1A1A1A]',
    icon: 'text-[#6b8e7f]',
  },
  error: {
    container: 'bg-[#F8F6F3] border border-[#c85c5c] text-[#1A1A1A]',
    icon: 'text-[#c85c5c]',
  },
  warning: {
    container: 'bg-[#F8F6F3] border border-[#C9A86A] text-[#1A1A1A]',
    icon: 'text-[#C9A86A]',
  },
  info: {
    container: 'bg-[#F8F6F3] border border-[#7b9cb8] text-[#1A1A1A]',
    icon: 'text-[#7b9cb8]',
  },
};

const progressColors: Record<ToastType, string> = {
  success: 'bg-[#6b8e7f]',
  error: 'bg-[#c85c5c]',
  warning: 'bg-[#C9A86A]',
  info: 'bg-[#7b9cb8]',
};

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={`
              relative overflow-hidden
              flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg
              min-w-[300px] max-w-md
              ${styles[toast.type].container}
            `}
          >
            <span className={styles[toast.type].icon}>{icons[toast.type]}</span>
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-black/5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Progress bar */}
            <motion.div
              className={`absolute bottom-0 left-0 h-0.5 rounded-full ${progressColors[toast.type]}`}
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{
                duration: (toast.duration || 4000) / 1000,
                ease: 'linear',
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
