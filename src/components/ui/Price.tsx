import { formatPrice } from '@/utils/pricing';
import { cn } from '@/utils/cn';

interface PriceProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Price({ price, originalPrice, size = 'md', className }: PriceProps) {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className={cn('font-bold text-gray-900', sizeClasses[size])}>
        {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <span className="text-sm text-gray-400 line-through">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
}