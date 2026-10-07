import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatPrice } from '@/utils/pricing';
import { validatePromoCode, getCartSummary } from '@/services/cartService';
import { Modal } from '@/components/ui/Modal';
import { FoodDetails } from '@/components/food/FoodDetails';

export default function Cart() {
  const { items, updateQuantity, removeItem, promoCode, setPromoCode } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const summary = getCartSummary(items, promoCode || undefined);

  const handleApplyPromo = () => {
    const result = validatePromoCode(promoInput);
    if (result.valid) {
      setPromoCode(promoInput.toUpperCase());
      setPromoError('');
      addToast(result.message, 'success');
    } else {
      setPromoError(result.message);
    }
  };

  const handleRemove = (itemId: string, name: string) => {
    removeItem(itemId);
    addToast(`${name} removed from cart`, 'info');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <EmptyState
            icon={<ShoppingBag className="w-10 h-10" />}
            title="Your cart is empty"
            description="Looks like you haven't added any items to your cart yet. Browse our menu to find something delicious!"
            action={
              <Link to="/menu" className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                Explore Menu
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={item.food.image} alt={item.food.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.food.name}</h3>
                        {item.customization.size && (
                          <p className="text-sm text-gray-500 mt-0.5">Size: {item.customization.size.name}</p>
                        )}
                        {item.customization.extras.length > 0 && (
                          <p className="text-sm text-gray-500">
                            Extras: {item.customization.extras.map((e) => e.name).join(', ')}
                          </p>
                        )}
                        {item.customization.removedIngredients.length > 0 && (
                          <p className="text-sm text-red-500">
                            No: {item.customization.removedIngredients.join(', ')}
                          </p>
                        )}
                        {item.customization.specialInstructions && (
                          <p className="text-sm text-gray-400 italic mt-1">"{item.customization.specialInstructions}"</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-gray-900">{formatPrice(item.totalPrice)}</div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-gray-400">{formatPrice(item.unitPrice)} each</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(q) => updateQuantity(item.id, q)}
                        min={1}
                        size="sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingItem(item.id)}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemove(item.id, item.food.name)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label={`Remove ${item.food.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
              <h2 className="font-semibold text-gray-900 text-lg mb-6">Order Summary</h2>

              {/* Promo code */}
              <div className="mb-6">
                {promoCode ? (
                  <div className="flex items-center justify-between bg-green-50 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">{promoCode}</span>
                    </div>
                    <button onClick={() => setPromoCode(null)} className="text-green-600 hover:text-green-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
                        placeholder="Promo code"
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && <p className="text-xs text-red-500 mt-1.5">{promoError}</p>}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-700">{formatPrice(summary.subtotal)}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600">-{formatPrice(summary.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="text-gray-700">
                    {summary.deliveryFee === 0 ? <span className="text-green-600">Free</span> : formatPrice(summary.deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-700">{formatPrice(summary.tax)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-gray-900">{formatPrice(summary.total)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors shadow-sm"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>

              <Link to="/menu" className="block text-center text-sm text-primary-600 hover:text-primary-700 mt-4 font-medium">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Edit modal - simplified re-use of FoodDetails */}
      <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} size="xl">
        {editingItem && (() => {
          const item = items.find((i) => i.id === editingItem);
          if (!item) return null;
          return <FoodDetails food={item.food} onClose={() => setEditingItem(null)} />;
        })()}
      </Modal>
    </div>
  );
}