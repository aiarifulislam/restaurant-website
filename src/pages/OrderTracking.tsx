import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, Package, ChefHat, Truck, PartyPopper } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { getOrderById } from '@/services/orderService';
import { formatPrice } from '@/utils/pricing';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { restaurantConfig } from '@/config/restaurant';

const deliverySteps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'received', label: 'Order Received', icon: <Package className="w-5 h-5" /> },
  { status: 'confirmed', label: 'Confirmed', icon: <CheckCircle className="w-5 h-5" /> },
  { status: 'preparing', label: 'Preparing', icon: <ChefHat className="w-5 h-5" /> },
  { status: 'ready', label: 'Ready', icon: <Clock className="w-5 h-5" /> },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: <Truck className="w-5 h-5" /> },
  { status: 'delivered', label: 'Delivered', icon: <PartyPopper className="w-5 h-5" /> },
];

const pickupSteps: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'received', label: 'Order Received', icon: <Package className="w-5 h-5" /> },
  { status: 'confirmed', label: 'Confirmed', icon: <CheckCircle className="w-5 h-5" /> },
  { status: 'preparing', label: 'Preparing', icon: <ChefHat className="w-5 h-5" /> },
  { status: 'ready', label: 'Ready for Pickup', icon: <Clock className="w-5 h-5" /> },
  { status: 'picked_up', label: 'Picked Up', icon: <PartyPopper className="w-5 h-5" /> },
];

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
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
          <Link to="/orders" className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium">View Orders</Link>
        </div>
      </div>
    );
  }

  const steps = order.deliveryMethod === 'delivery' ? deliverySteps : pickupSteps;
  const currentIdx = steps.findIndex((s) => s.status === order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Tracking</h1>
          <p className="text-gray-500">Order #{order.orderNumber}</p>
        </div>

        {/* Status card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          {isCancelled ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❌</span>
              </div>
              <h3 className="text-xl font-bold text-red-600 mb-2">Order Cancelled</h3>
              <p className="text-gray-500">This order has been cancelled.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900">Status</h2>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold capitalize">
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Timeline */}
              <div className="relative">
                {steps.map((step, i) => {
                  const isComplete = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <div key={step.status} className="flex gap-4 mb-8 last:mb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isComplete ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-primary-100' : ''}`}>
                          {step.icon}
                        </div>
                        {i < steps.length - 1 && (
                          <div className={`w-0.5 flex-1 min-h-[24px] mt-2 ${isComplete ? 'bg-primary-600' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className="pt-2">
                        <div className={`font-medium text-sm ${isComplete ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.label}
                        </div>
                        {isCurrent && (
                          <div className="text-xs text-gray-500 mt-0.5">Just now</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Order info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Items</span><span className="text-gray-700">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-semibold text-gray-900">{formatPrice(order.total)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="text-gray-700 capitalize">{order.deliveryMethod}</span></div>
            {order.deliveryMethod === 'delivery' && order.address && (
              <div className="flex justify-between"><span className="text-gray-500">Address</span><span className="text-gray-700">{order.address.street}, {order.address.city}</span></div>
            )}
            {order.deliveryMethod === 'pickup' && (
              <div className="flex justify-between"><span className="text-gray-500">Pickup</span><span className="text-gray-700">{restaurantConfig.address}</span></div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Link to={`/orders/${order.id}`} className="flex-1 py-3 border border-gray-200 rounded-xl text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            View Order
          </Link>
          <Link to="/menu" className="flex-1 py-3 bg-primary-600 text-white rounded-xl text-center text-sm font-semibold hover:bg-primary-700 transition-colors">
            Order Again
          </Link>
        </div>
      </div>
    </div>
  );
}