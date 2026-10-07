import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/utils/pricing';
import { getCartSummary } from '@/services/cartService';
import { EmptyState } from '@/components/ui/EmptyState';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, promoCode } = useCart();
  const navigate = useNavigate();
  const summary = getCartSummary(items, promoCode || undefined);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Cart</h2>
            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
              {items.length}
            </span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close cart">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag className="w-10 h-10" />}
              title="Cart is empty"
              description="Add some delicious items to get started!"
              action={
                <Link to="/menu" onClick={onClose} className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
                  Browse Menu
                </Link>
              }
            />
          ) : (
            <div className="p-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    <img src={item.food.image} alt={item.food.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{item.food.name}</h4>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 flex-shrink-0" aria-label="Remove">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {item.customization.size && (
                      <p className="text-xs text-gray-500">{item.customization.size.name}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{formatPrice(item.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="text-gray-700">{formatPrice(summary.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className="text-gray-700">{summary.deliveryFee === 0 ? <span className="text-green-600">Free</span> : formatPrice(summary.deliveryFee)}</span></div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-100">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatPrice(summary.total)}</span>
              </div>
            </div>
            <button
              onClick={() => { onClose(); navigate('/checkout'); }}
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors shadow-sm"
            >
              Checkout · {formatPrice(summary.total)}
            </button>
            <Link to="/cart" onClick={onClose} className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}