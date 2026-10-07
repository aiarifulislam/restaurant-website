import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Clock, ChevronRight } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { getOrders } from '@/services/orderService';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatPrice } from '@/utils/pricing';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import { cn } from '@/utils/cn';

type OrderFilter = 'all' | 'active' | 'completed' | 'cancelled';

const statusColors: Record<string, string> = {
  received: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  preparing: 'bg-yellow-100 text-yellow-700',
  ready: 'bg-green-100 text-green-700',
  out_for_delivery: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  picked_up: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const filterMap: Record<OrderFilter, OrderStatus[]> = {
  all: [],
  active: ['received', 'confirmed', 'preparing', 'ready', 'out_for_delivery'],
  completed: ['delivered', 'picked_up'],
  cancelled: ['cancelled'],
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderFilter>('all');
  const navigate = useNavigate();

  useEffect(() => {
    getOrders().then((o) => {
      setOrders(o);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingPage />;

  const filtered = filter === 'all' ? orders : orders.filter((o) => filterMap[filter].includes(o.status));

  const filters: { key: OrderFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: orders.length },
    { key: 'active', label: 'Active', count: orders.filter((o) => filterMap.active.includes(o.status)).length },
    { key: 'completed', label: 'Completed', count: orders.filter((o) => filterMap.completed.includes(o.status)).length },
    { key: 'cancelled', label: 'Cancelled', count: orders.filter((o) => filterMap.cancelled.includes(o.status)).length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border flex-shrink-0',
                filter === f.key
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              )}
            >
              {f.label}
              {f.count > 0 && (
                <span className={cn(
                  'px-1.5 py-0.5 rounded-full text-xs',
                  filter === f.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                )}>{f.count}</span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Package className="w-10 h-10" />}
            title="No orders found"
            description={filter === 'all' ? "You haven't placed any orders yet." : `No ${filter} orders.`}
            action={
              <Link to="/menu" className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold">
                Browse Menu
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-gray-900">#{order.orderNumber}</span>
                      <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize', statusColors[order.status])}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex items-center gap-3 mb-3 overflow-x-auto pb-1">
                  {order.items.slice(0, 4).map((item) => (
                    <div key={item.id} className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={item.food.image} alt={item.food.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-sm text-gray-500">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} · <span className="capitalize">{order.deliveryMethod}</span>
                  </div>
                  <div className="font-bold text-gray-900">{formatPrice(order.total)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}