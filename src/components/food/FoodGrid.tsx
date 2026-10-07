import type { Food } from '@/types';
import { FoodCard } from './FoodCard';
import { SkeletonGrid } from '@/components/ui/SkeletonCard';

interface FoodGridProps {
  foods: Food[];
  loading?: boolean;
  emptyMessage?: string;
}

export function FoodGrid({ foods, loading, emptyMessage = 'No items found' }: FoodGridProps) {
  if (loading) {
    return <SkeletonGrid count={8} />;
  }

  if (foods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-5xl mb-4">🍽️</span>
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {foods.map((food) => (
        <FoodCard key={food.id} food={food} />
      ))}
    </div>
  );
}