import type { Order, OrderStatus, CartItem, DeliveryMethod, Customer, Address, PaymentMethod } from '@/types';

const ORDERS_STORAGE_KEY = 'lacucina_orders';

function generateOrderNumber(): string {
  const prefix = 'LC';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`.slice(0, 10);
}

export function loadOrders(): Order[] {
  try {
    const data = localStorage.getItem(ORDERS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export async function createOrder(
  items: CartItem[],
  customer: Customer,
  deliveryMethod: DeliveryMethod,
  address: Address | undefined,
  paymentMethod: PaymentMethod,
  totals: { subtotal: number; discount: number; deliveryFee: number; tax: number; total: number }
): Promise<Order> {
  await new Promise((r) => setTimeout(r, 800));

  const order: Order = {
    id: `order-${Date.now()}`,
    orderNumber: generateOrderNumber(),
    customer,
    items: items.map((item) => ({
      id: item.id,
      food: item.food,
      quantity: item.quantity,
      customization: item.customization,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    })),
    subtotal: totals.subtotal,
    discount: totals.discount,
    deliveryFee: totals.deliveryFee,
    tax: totals.tax,
    total: totals.total,
    status: 'received',
    deliveryMethod,
    address,
    payment: {
      method: paymentMethod,
      status: paymentMethod === 'cash' ? 'pending' : 'completed',
      last4: paymentMethod === 'card' ? '4242' : undefined,
      amount: totals.total,
    },
    estimatedPreparationTime: 20,
    estimatedDeliveryTime: deliveryMethod === 'delivery' ? 40 : 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const orders = loadOrders();
  orders.unshift(order);
  saveOrders(orders);

  return order;
}

export async function getOrderById(orderId: string): Promise<Order | undefined> {
  await new Promise((r) => setTimeout(r, 200));
  const orders = loadOrders();
  return orders.find((o) => o.id === orderId);
}

export async function getOrders(): Promise<Order[]> {
  await new Promise((r) => setTimeout(r, 300));
  return loadOrders();
}

export async function cancelOrder(orderId: string): Promise<Order> {
  await new Promise((r) => setTimeout(r, 500));
  const orders = loadOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) throw new Error('Order not found');
  
  const cancellableStatuses: OrderStatus[] = ['received', 'confirmed'];
  if (!cancellableStatuses.includes(orders[index].status)) {
    throw new Error('Order cannot be cancelled at this stage');
  }
  
  orders[index].status = 'cancelled';
  orders[index].updatedAt = new Date().toISOString();
  orders[index].payment.status = 'refunded';
  saveOrders(orders);
  return orders[index];
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  await new Promise((r) => setTimeout(r, 300));
  const orders = loadOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) throw new Error('Order not found');
  orders[index].status = status;
  orders[index].updatedAt = new Date().toISOString();
  saveOrders(orders);
  return orders[index];
}