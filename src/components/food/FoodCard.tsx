import { useState } from 'react';
import { Heart, Plus, Clock, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Food } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Rating } from '@/components/ui/Rating';
import { Price } from '@/components/ui/Price';
import { Badge } from '@/components/ui/Badge';
interface FoodCardProps {
  food: Food;
}

export function FoodCard({ food }: FoodCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const favorited = isFavorite(food.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (food.sizes.length > 1 || food.extras.length > 0) {
      navigate(`/food/${food.id}`);
      return;
    }
    const defaultCustomization = {
      size: food.sizes[0],
      extras: [],
      removedIngredients: [],
      specialInstructions: '',
    };
    addItem(food, defaultCustomization, 1);
    addToast(`${food.name} added to cart`, 'success');
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleFavorite(food.id);
    addToast(favorited ? `${food.name} removed from favorites` : `${food.name} added to favorites`, 'info');
  };

  const discount = food.originalPrice ? Math.round(((food.originalPrice - food.price) / food.originalPrice) * 100) : 0;

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100"
      onClick={() => navigate(`/food/${food.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/food/${food.id}`); }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        {imgError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
            <span className="text-4xl">{food.category === 'Pizza' ? '🍕' : food.category === 'Burgers' ? '🍔' : food.category === 'Pasta' ? '🍝' : '🍽️'}</span>
          </div>
        ) : (
          <img
            src={food.image}
            alt={food.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {discount > 0 && <Badge variant="discount">-{discount}%</Badge>}
          {food.isNew && <Badge variant="new">New</Badge>}
          {food.isVegetarian && <Badge variant="veg"><Leaf className="w-3 h-3 mr-0.5" />Veg</Badge>}
          {food.isVegan && <Badge variant="vegan"><Leaf className="w-3 h-3 mr-0.5" />Vegan</Badge>}
          {food.isSpicy && <Badge variant="spicy">🌶️ Spicy</Badge>}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
        </button>

        {/* Prep time */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-600">
          <Clock className="w-3 h-3" />
          {food.preparationTime} min
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-1">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{food.category}</span>
        </div>
        <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">{food.name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">{food.description}</p>

        <div className="flex items-center justify-between mb-3">
          <Rating value={food.rating} showCount count={food.reviewCount} size="sm" />
        </div>

        <div className="flex items-center justify-between">
          <Price price={food.price} originalPrice={food.originalPrice} size="sm" />
          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-sm font-medium transition-colors shadow-sm"
            aria-label={`Add ${food.name} to cart`}
          >
            <Plus className="w-4 h-4" />
            {food.sizes.length > 1 || food.extras.length > 0 ? 'Customize' : `$${food.price.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}