/**
 * NOVELLA - Customization Modal
 * İsim baskısı modal component
 */

'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  onSave: (text: string) => void;
}

export default function CustomizationModal({
  isOpen,
  onClose,
  productName,
  onSave,
}: CustomizationModalProps) {
  const [customText, setCustomText] = useState('');
  const maxLength = 15;

  if (!isOpen) return null;

  const handleSave = () => {
    if (customText.trim()) {
      onSave(customText);
      setCustomText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-black">İsim Baskısı</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-sm text-black/60">{productName}</div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Yazdırmak istediğiniz isim veya kelime
          </label>
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value.slice(0, maxLength))}
            placeholder="Örn: Ayşe, Mehmet, Love..."
            className="
              w-full px-4 py-3 border-2 border-cream-300 rounded-lg
              focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none
              text-black
            "
            maxLength={maxLength}
          />
          <div className="mt-1 text-xs text-black/60 text-right">
            {customText.length} / {maxLength} karakter
          </div>
        </div>

        {customText && (
          <div className="p-4 bg-cream-50 rounded-lg">
            <p className="text-sm text-black/60 mb-2">Önizleme:</p>
            <p className="font-serif text-2xl text-gold text-center">
              {customText}
            </p>
          </div>
        )}

        <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
          <p className="font-medium mb-1">💡 Bilgi:</p>
          <ul className="space-y-1 text-xs">
            <li>• İsim baskısı ücretsizdir</li>
            <li>• Teslimat süresi 2-3 iş günü uzar</li>
            <li>• Türkçe karakterler desteklenmektedir</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-cream-300 rounded-lg text-black hover:bg-cream-50 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={!customText}
            className="flex-1 px-4 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
