import { useNavigate } from 'react-router-dom';
import type { FoodCategory } from '@/types';

interface CategoryCardProps {
  category: FoodCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/menu/${category.slug}`)}
      className="group flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-primary-50 transition-colors"
    >
      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform shadow-sm">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <div className="text-center">
        <span className="text-2xl mb-1 block">{category.icon}</span>
        <span className="text-sm font-semibold text-gray-800 group-hover:text-primary-700 transition-colors">
          {category.name}
        </span>
      </div>
    </button>
  );
}