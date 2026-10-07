// ==================== Food Types ====================
export interface FoodCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
}

export interface FoodSize {
  id: string;
  name: string;
  priceModifier: number;
}

export interface FoodExtra {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export interface FoodOption {
  id: string;
  name: string;
  type: 'size' | 'extra' | 'addon';
  choices: FoodSize[] | FoodExtra[];
}

export interface Food {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  image: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  ingredients: string[];
  allergens: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  preparationTime: number;
  tags: string[];
  available: boolean;
  sizes: FoodSize[];
  extras: FoodExtra[];
  removableIngredients: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  isNew: boolean;
}

// ==================== Cart Types ====================
export interface CartItemCustomization {
  size?: FoodSize;
  extras: FoodExtra[];
  removedIngredients: string[];
  specialInstructions: string;
}

export interface CartItem {
  id: string;
  food: Food;
  quantity: number;
  customization: CartItemCustomization;
  unitPrice: number;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  promoCode?: string;
}

// ==================== Customer Types ====================
export interface Address {
  id: string;
  label: string;
  street: string;
  apartment: string;
  city: string;
  postalCode: string;
  instructions: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addresses: Address[];
  favorites: string[];
}

// ==================== Order Types ====================
export type OrderStatus =
  | 'received'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'picked_up'
  | 'cancelled';

export type DeliveryMethod = 'delivery' | 'pickup';

export type PaymentMethod = 'card' | 'cash';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  food: Food;
  quantity: number;
  customization: CartItemCustomization;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderPayment {
  method: PaymentMethod;
  status: PaymentStatus;
  last4?: string;
  amount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  promoCode?: string;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  address?: Address;
  payment: OrderPayment;
  estimatedPreparationTime: number;
  estimatedDeliveryTime: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// ==================== Checkout Types ====================
export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface DeliveryInfo {
  method: DeliveryMethod;
  address: Address;
  instructions: string;
}

export interface PaymentInfo {
  method: PaymentMethod;
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

export type CheckoutStep = 'info' | 'delivery' | 'summary' | 'payment';

// ==================== UI Types ====================
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  isVegetarian: boolean;
  isVegan: boolean;
  isSpicy: boolean;
  isPopular: boolean;
  minRating: number;
  availableOnly: boolean;
}

export interface SearchState {
  query: string;
  results: Food[];
  isSearching: boolean;
}

// ==================== Restaurant Config ====================
export interface RestaurantConfig {
  name: string;
  tagline: string;
  description: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  openingHours: { day: string; hours: string }[];
  deliveryFee: number;
  minimumOrder: number;
  freeDeliveryThreshold: number;
  estimatedDeliveryTime: string;
  estimatedPreparationTime: string;
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  taxRate: number;
}