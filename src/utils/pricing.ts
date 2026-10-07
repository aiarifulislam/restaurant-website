import type { CartItem, CartItemCustomization, Food } from '@/types';
import { restaurantConfig } from '@/config/restaurant';

export function calculateItemUnitPrice(food: Food, customization: CartItemCustomization): number {
  let price = food.price;

  if (customization.size) {
    price += customization.size.priceModifier;
  }

  for (const extra of customization.extras) {
    price += extra.price;
  }

  return Math.round(price * 100) / 100;
}

export function calculateItemTotalPrice(food: Food, customization: CartItemCustomization, quantity: number): number {
  const unitPrice = calculateItemUnitPrice(food, customization);
  return Math.round(unitPrice * quantity * 100) / 100;
}

export function calculateCartSubtotal(items: CartItem[]): number {
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
  return Math.round(total * 100) / 100;
}

export function calculateDiscount(subtotal: number, promoCode?: string): number {
  if (!promoCode) return 0;
  const code = promoCode.toUpperCase();
  if (code === 'WELCOME20') return Math.round(subtotal * 0.2 * 100) / 100;
  if (code === 'SAVE10') return Math.round(subtotal * 0.1 * 100) / 100;
  return 0;
}

export function calculateDeliveryFee(subtotal: number): number {
  if (subtotal >= restaurantConfig.freeDeliveryThreshold) return 0;
  return restaurantConfig.deliveryFee;
}

export function calculateTax(subtotal: number, discount: number): number {
  const taxable = subtotal - discount;
  return Math.round(taxable * restaurantConfig.taxRate * 100) / 100;
}

export function calculateOrderTotal(
  subtotal: number,
  discount: number,
  deliveryFee: number,
  tax: number
): number {
  return Math.round((subtotal - discount + deliveryFee + tax) * 100) / 100;
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}