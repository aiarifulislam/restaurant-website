import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
}

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function Rating({ value, size = 'md', showCount = false, count }: RatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {stars.map((star) => {
          const filled = star <= Math.floor(value);
          const partial = !filled && star <= value;
          return (
            <Star
              key={star}
              className={`${sizeMap[size]} ${
                filled
                  ? 'text-amber-400 fill-amber-400'
                  : partial
                  ? 'text-amber-400 fill-amber-200'
                  : 'text-gray-300'
              }`}
            />
          );
        })}
      </div>
      <span className="text-sm font-medium text-gray-700 ml-1">{value.toFixed(1)}</span>
      {showCount && count !== undefined && (
        <span className="text-sm text-gray-500">({count})</span>
      )}
    </div>
  );
}