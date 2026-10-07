import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function QuantitySelector({ value, onChange, min = 1, max = 99, size = 'md', className }: QuantitySelectorProps) {
  const sizes = {
    sm: { btn: 'w-7 h-7', icon: 'w-3.5 h-3.5', text: 'text-sm w-8' },
    md: { btn: 'w-9 h-9', icon: 'w-4 h-4', text: 'text-base w-10' },
    lg: { btn: 'w-11 h-11', icon: 'w-5 h-5', text: 'text-lg w-12' },
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`${sizes[size].btn} flex items-center justify-center rounded-full border border-gray-200 
          hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Decrease quantity"
      >
        <Minus className={sizes[size].icon} />
      </button>
      <span className={`${sizes[size].text} text-center font-semibold text-gray-900`}>
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${sizes[size].btn} flex items-center justify-center rounded-full border border-gray-200 
          hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
        aria-label="Increase quantity"
      >
        <Plus className={sizes[size].icon} />
      </button>
    </div>
  );
}