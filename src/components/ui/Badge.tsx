import { cn } from '@/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'discount' | 'spicy' | 'veg' | 'vegan' | 'new';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  discount: 'bg-red-500 text-white',
  spicy: 'bg-orange-100 text-orange-700',
  veg: 'bg-green-100 text-green-700',
  vegan: 'bg-emerald-100 text-emerald-700',
  new: 'bg-blue-500 text-white',
};

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}