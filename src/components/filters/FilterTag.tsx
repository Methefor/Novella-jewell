/**
 * NOVELLA - Filter Tag
 * Aktif filtre etiketleri
 */

'use client';

import { X } from 'lucide-react';

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

export default function FilterTag({ label, onRemove }: FilterTagProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/20 border border-gold/40 rounded-full text-sm text-gold">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="p-0.5 hover:bg-gold/30 rounded-full transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
