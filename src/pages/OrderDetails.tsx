import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, CreditCard } from 'lucide-react';
import type { Order } from '@/types';
import { getOrderById, cancelOrder } from '@/services/orderService';
import { formatPrice } from '@/utils/pricing';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/context/ToastContext';
import { Modal } from '@/components/ui/Modal';
import { restaurantConfig } from '@/config/restaurant';

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId).then((o) => {
        if (o) setOrder(o);
        setLoading(false);
      });
    }
  }, [orderId]);

  const handleCancel = async () => {
    if (!order) return;
    setCancelling(true);
    try {
      const updated = await cancelOrder(order.id);
      setOrder(updated);
      addToast('Order cancelled successfully', 'info');
    } catch {
      addToast('Cannot cancel order at this stage', 'error');
    } finally {
      setCancelling(false);
      setShowCancel(false);
    }
  };

  if (loading) return <LoadingPage />;
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <Link to="/orders" className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium">View Orders</Link>
        </div>
      </div>
    );
  }

  const canCancel = ['received', 'confirmed'].includes(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-2">
            {canCancel && (
              <button onClick={() => setShowCancel(true)} className="px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
                Cancel Order
              </button>
            )}
            <Link to={`/track-order/${order.id}`} className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors">
              Track Order
            </Link>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-lg">{order.status === 'cancelled' ? '❌' : '✅'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900 capitalize">{order.status.replace(/_/g, ' ')}</span>
              <p className="text-xs text-gray-500">Last updated: {new Date(order.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={item.food.image} alt={item.food.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{item.food.name}</div>
                  <div className="text-xs text-gray-500">
                    {item.customization.size?.name}
                    {item.customization.extras.length > 0 && ` · ${item.customization.extras.map(e => e.name).join(', ')}`}
                  </div>
                  <div className="text-xs text-gray-400">Qty: {item.quantity} × {formatPrice(item.unitPrice)}</div>
                </div>
                <div className="font-semibold text-gray-900">{formatPrice(item.totalPrice)}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between"><span className="text-green-600">Discount</span><span className="text-green-600">-{formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>{order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{formatPrice(order.tax)}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100"><span className="text-gray-900">Total</span><span className="text-gray-900">{formatPrice(order.total)}</span></div>
          </div>
        </div>

        {/* Delivery & Payment */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              {order.deliveryMethod === 'delivery' ? <MapPin className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              {order.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}
            </h3>
            {order.address ? (
              <p className="text-sm text-gray-600">{order.address.street}{order.address.apartment ? `, ${order.address.apartment}` : ''}, {order.address.city} {order.address.postalCode}</p>
            ) : (
              <p className="text-sm text-gray-600">{restaurantConfig.address}</p>
            )}
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Payment
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {order.payment.method === 'card' ? `Card ending ${order.payment.last4}` : 'Cash on delivery'}
            </p>
            <p className="text-xs text-gray-400 mt-1 capitalize">Status: {order.payment.status}</p>
          </div>
        </div>
      </div>

      {/* Cancel confirmation */}
      <Modal isOpen={showCancel} onClose={() => setShowCancel(false)} title="Cancel Order" size="sm">
        <div className="p-6">
          <p className="text-gray-600 mb-6">Are you sure you want to cancel order #{order.orderNumber}? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setShowCancel(false)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
              Keep Order
            </button>
            <button onClick={handleCancel} disabled={cancelling} className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50">
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}