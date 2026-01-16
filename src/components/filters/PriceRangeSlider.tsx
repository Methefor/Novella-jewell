/**
 * NOVELLA - Price Range Slider
 * Dual-handle fiyat aralığı seçici
 */

'use client';

import { useEffect, useState } from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
}

export default function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), localValue.max);
    setLocalValue({ ...localValue, min: newMin });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), localValue.min);
    setLocalValue({ ...localValue, max: newMax });
  };

  const handleMinCommit = () => {
    onChange(localValue);
  };

  const handleMaxCommit = () => {
    onChange(localValue);
  };

  const minPercentage = ((localValue.min - min) / (max - min)) * 100;
  const maxPercentage = ((localValue.max - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      {/* Value Display */}
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="text-white/60">Min: </span>
          <span className="text-white font-medium">{localValue.min}₺</span>
        </div>
        <div className="text-sm">
          <span className="text-white/60">Max: </span>
          <span className="text-white font-medium">{localValue.max}₺</span>
        </div>
      </div>

      {/* Dual Slider */}
      <div className="relative h-2">
        {/* Track */}
        <div className="absolute inset-0 bg-white/10 rounded-full" />

        {/* Active Range */}
        <div
          className="absolute h-full bg-gold rounded-full"
          style={{
            left: `${minPercentage}%`,
            right: `${100 - maxPercentage}%`,
          }}
        />

        {/* Min Handle */}
        <input
          type="range"
          min={min}
          max={max}
          step={50}
          value={localValue.min}
          onChange={handleMinChange}
          onMouseUp={handleMinCommit}
          onTouchEnd={handleMinCommit}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-900 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-gold [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gray-900"
        />

        {/* Max Handle */}
        <input
          type="range"
          min={min}
          max={max}
          step={50}
          value={localValue.max}
          onChange={handleMaxChange}
          onMouseUp={handleMaxCommit}
          onTouchEnd={handleMaxCommit}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-900 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-gold [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gray-900"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: 'Tümü', min: min, max: max },
          { label: '0-300₺', min: min, max: 300 },
          { label: '300-500₺', min: 300, max: 500 },
          { label: '500+₺', min: 500, max: max },
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => onChange({ min: preset.min, max: preset.max })}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              localValue.min === preset.min && localValue.max === preset.max
                ? 'bg-gold text-black border-gold'
                : 'bg-white/5 text-white/60 border-white/10 hover:border-gold/50'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
