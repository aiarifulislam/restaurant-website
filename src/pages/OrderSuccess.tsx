import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, CreditCard, Package } from 'lucide-react';
import type { Order } from '@/types';
import { getOrderById } from '@/services/orderService';
import { formatPrice } from '@/utils/pricing';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

export default function OrderSuccess() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId).then((o) => {
        if (o) setOrder(o);
        setLoading(false);
      });
    }
  }, [orderId]);

  if (loading) return <LoadingPage />;
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <button onClick={() => navigate('/menu')} className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium">
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-500">Thank you for your order. We're preparing it now.</p>
        </div>

        {/* Order card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide">Order Number</span>
                <div className="font-bold text-lg text-gray-900">{order.orderNumber}</div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold capitalize">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Timing */}
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-gray-500">Estimated {order.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup'}:</span>
                <span className="font-medium text-gray-900 ml-1">
                  {order.deliveryMethod === 'delivery' ? order.estimatedDeliveryTime : order.estimatedPreparationTime} minutes
                </span>
              </div>
            </div>

            {/* Delivery */}
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <span className="text-gray-500 capitalize">{order.deliveryMethod}:</span>
                {order.address ? (
                  <span className="text-gray-900 ml-1">{order.address.street}, {order.address.city} {order.address.postalCode}</span>
                ) : (
                  <span className="text-gray-900 ml-1">{order.customer.firstName}'s choice - Pickup from restaurant</span>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="flex items-center gap-3 text-sm">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <span className="text-gray-500">Payment:</span>
              <span className="text-gray-900 capitalize">{order.payment.method === 'card' ? `Card ending ${order.payment.last4}` : 'Cash on delivery'}</span>
            </div>

            {/* Items */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" /> Items
              </h3>
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">{item.quantity}x {item.food.name}</span>
                  <span className="text-gray-900 font-medium">{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 mt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                {order.discount > 0 && <div className="flex justify-between"><span className="text-green-600">Discount</span><span className="text-green-600">-{formatPrice(order.discount)}</span></div>}
                <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>{order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{formatPrice(order.tax)}</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100"><span className="text-gray-900">Total</span><span className="text-gray-900">{formatPrice(order.total)}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/track-order/${order.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
          >
            Track Order
          </Link>
          <Link
            to={`/orders/${order.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            View Order
          </Link>
          <Link
            to="/menu"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}