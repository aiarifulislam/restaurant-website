import type { CartItem, CartItemCustomization, Food } from '@/types';
import {
  calculateItemUnitPrice,
  calculateItemTotalPrice,
  calculateCartSubtotal,
  calculateDiscount,
  calculateDeliveryFee,
  calculateTax,
  calculateOrderTotal,
} from '@/utils/pricing';

const CART_STORAGE_KEY = 'lacucina_cart';

export function loadCart(): CartItem[] {
  try {
    const data = localStorage.getItem(CART_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function addToCart(food: Food, customization: CartItemCustomization, quantity: number): CartItem {
  const unitPrice = calculateItemUnitPrice(food, customization);
  const totalPrice = calculateItemTotalPrice(food, customization, quantity);

  return {
    id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    food,
    quantity,
    customization,
    unitPrice,
    totalPrice,
  };
}

export function updateCartItemQuantity(item: CartItem, quantity: number): CartItem {
  return {
    ...item,
    quantity,
    totalPrice: calculateItemTotalPrice(item.food, item.customization, quantity),
  };
}

export function getCartSummary(items: CartItem[], promoCode?: string) {
  const subtotal = calculateCartSubtotal(items);
  const discount = calculateDiscount(subtotal, promoCode);
  const deliveryFee = calculateDeliveryFee(subtotal);
  const tax = calculateTax(subtotal, discount);
  const total = calculateOrderTotal(subtotal, discount, deliveryFee, tax);

  return { subtotal, discount, deliveryFee, tax, total };
}

export function validatePromoCode(code: string): { valid: boolean; discount: number; message: string } {
  const normalizedCode = code.toUpperCase();
  if (normalizedCode === 'WELCOME20') {
    return { valid: true, discount: 20, message: '20% discount applied!' };
  }
  if (normalizedCode === 'SAVE10') {
    return { valid: true, discount: 10, message: '10% discount applied!' };
  }
  return { valid: false, discount: 0, message: 'Invalid promo code' };
}