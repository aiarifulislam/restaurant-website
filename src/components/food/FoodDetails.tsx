import { useState } from 'react';
import { X, Clock, Check, Leaf, AlertTriangle, ShoppingCart } from 'lucide-react';
import type { Food, FoodExtra, FoodSize, CartItemCustomization } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { calculateItemUnitPrice, formatPrice } from '@/utils/pricing';

interface FoodDetailsProps {
  food: Food;
  onClose: () => void;
}

export function FoodDetails({ food, onClose }: FoodDetailsProps) {
  const [selectedSize, setSelectedSize] = useState<FoodSize | undefined>(food.sizes[0]);
  const [selectedExtras, setSelectedExtras] = useState<FoodExtra[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { addItem } = useCart();
  const { addToast } = useToast();

  const customization: CartItemCustomization = {
    size: selectedSize,
    extras: selectedExtras,
    removedIngredients,
    specialInstructions,
  };

  const unitPrice = calculateItemUnitPrice(food, customization);
  const totalPrice = unitPrice * quantity;

  const toggleExtra = (extra: FoodExtra) => {
    setSelectedExtras((prev) =>
      prev.find((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const toggleRemovedIngredient = (ingredient: string) => {
    setRemovedIngredients((prev) =>
      prev.includes(ingredient) ? prev.filter((i) => i !== ingredient) : [...prev, ingredient]
    );
  };

  const handleAddToCart = () => {
    addItem(food, customization, quantity);
    addToast(`${food.name} added to cart`, 'success');
    onClose();
  };

  return (
    <div className="flex flex-col lg:flex-row max-h-[90vh] lg:max-h-[80vh]">
      {/* Image */}
      <div className="relative lg:w-1/2 flex-shrink-0 bg-gray-100">
        <div className="aspect-[4/3] lg:aspect-auto lg:h-full">
          {!imgLoaded && !imgError && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
          {imgError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
              <span className="text-6xl">🍽️</span>
            </div>
          ) : (
            <img
              src={food.image}
              alt={food.name}
              className={`w-full h-full object-cover ${imgLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {food.isVegetarian && <Badge variant="veg" size="md"><Leaf className="w-3.5 h-3.5 mr-1" />Vegetarian</Badge>}
          {food.isVegan && <Badge variant="vegan" size="md"><Leaf className="w-3.5 h-3.5 mr-1" />Vegan</Badge>}
          {food.isSpicy && <Badge variant="spicy" size="md">🌶️ Spicy</Badge>}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col overflow-y-auto p-6 lg:p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">{food.category}</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">{food.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <Rating value={food.rating} showCount count={food.reviewCount} />
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" /> {food.preparationTime} min
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">{food.longDescription}</p>

        {/* Size selection */}
        {food.sizes.length > 1 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Choose Size</h3>
            <div className="flex flex-wrap gap-2">
              {food.sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                    selectedSize?.id === size.id
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {size.name}
                  {size.priceModifier !== 0 && (
                    <span className="ml-1 text-xs opacity-70">
                      ({size.priceModifier > 0 ? '+' : ''}{formatPrice(size.priceModifier)})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Extras */}
        {food.extras.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Add Extras</h3>
            <div className="space-y-2">
              {food.extras.map((extra) => {
                const selected = selectedExtras.find((e) => e.id === extra.id);
                return (
                  <button
                    key={extra.id}
                    onClick={() => toggleExtra(extra)}
                    disabled={!extra.available}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                      selected
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-100 hover:border-gray-200'
                    } ${!extra.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                        selected ? 'border-primary-600 bg-primary-600' : 'border-gray-300'
                      }`}>
                        {selected && <Check className="w-3 h-3 text-white" />}
                      </span>
                      <span className="font-medium text-gray-800">{extra.name}</span>
                    </span>
                    <span className="text-gray-500">+{formatPrice(extra.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Remove ingredients */}
        {food.removableIngredients.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Remove Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {food.removableIngredients.map((ingredient) => {
                const removed = removedIngredients.includes(ingredient);
                return (
                  <button
                    key={ingredient}
                    onClick={() => toggleRemovedIngredient(ingredient)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      removed
                        ? 'border-red-300 bg-red-50 text-red-700 line-through'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {ingredient}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Special instructions */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Special Instructions</h3>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            placeholder="e.g., Extra crispy, less spicy, no salt..."
            rows={2}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Ingredients & allergens */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ingredients</h4>
            <div className="flex flex-wrap gap-1.5">
              {food.ingredients.map((ing) => (
                <span key={ing} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{ing}</span>
              ))}
            </div>
          </div>
          {food.allergens.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Allergens</h4>
              <div className="flex flex-wrap gap-1.5">
                {food.allergens.map((a) => (
                  <span key={a} className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs">
                    <AlertTriangle className="w-3 h-3" />{a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Nutrition */}
        <div className="mb-8">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Nutrition per serving</h4>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Calories', value: food.nutrition.calories, unit: 'kcal' },
              { label: 'Protein', value: food.nutrition.protein, unit: 'g' },
              { label: 'Carbs', value: food.nutrition.carbs, unit: 'g' },
              { label: 'Fat', value: food.nutrition.fat, unit: 'g' },
            ].map((n) => (
              <div key={n.label} className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-sm font-bold text-gray-900">{n.value}<span className="text-xs font-normal text-gray-500">{n.unit}</span></div>
                <div className="text-xs text-gray-500">{n.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quantity & Add to Cart */}
        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={20} />
            <div className="text-right">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-2xl font-bold text-gray-900">{formatPrice(totalPrice)}</div>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!food.available}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart · {formatPrice(totalPrice)}
          </button>
        </div>
      </div>
    </div>
  );
}