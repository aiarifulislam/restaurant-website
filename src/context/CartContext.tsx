import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { CartItem, CartItemCustomization, Food } from '@/types';
import * as cartService from '@/services/cartService';
import { calculateItemUnitPrice, calculateItemTotalPrice } from '@/utils/pricing';

interface CartState {
  items: CartItem[];
  promoCode: string | null;
}

type CartAction =
  | { type: 'LOAD'; items: CartItem[] }
  | { type: 'ADD'; food: Food; customization: CartItemCustomization; quantity: number }
  | { type: 'REMOVE'; itemId: string }
  | { type: 'UPDATE_QUANTITY'; itemId: string; quantity: number }
  | { type: 'UPDATE_ITEM'; itemId: string; customization: CartItemCustomization; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'SET_PROMO'; promoCode: string | null };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'LOAD':
      return { ...state, items: action.items };

    case 'ADD': {
      const unitPrice = calculateItemUnitPrice(action.food, action.customization);
      const totalPrice = calculateItemTotalPrice(action.food, action.customization, action.quantity);
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        food: action.food,
        quantity: action.quantity,
        customization: action.customization,
        unitPrice,
        totalPrice,
      };
      return { ...state, items: [...state.items, newItem] };
    }

    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.itemId) };

    case 'UPDATE_QUANTITY': {
      const updated = state.items.map((item) => {
        if (item.id === action.itemId) {
          return cartService.updateCartItemQuantity(item, action.quantity);
        }
        return item;
      });
      return { ...state, items: updated };
    }

    case 'UPDATE_ITEM': {
      const updated = state.items.map((item) => {
        if (item.id === action.itemId) {
          const newUnitPrice = calculateItemUnitPrice(item.food, action.customization);
          const newTotalPrice = calculateItemTotalPrice(item.food, action.customization, action.quantity);
          return {
            ...item,
            customization: action.customization,
            quantity: action.quantity,
            unitPrice: newUnitPrice,
            totalPrice: newTotalPrice,
          };
        }
        return item;
      });
      return { ...state, items: updated };
    }

    case 'CLEAR':
      return { ...state, items: [], promoCode: null };

    case 'SET_PROMO':
      return { ...state, promoCode: action.promoCode };

    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  promoCode: string | null;
  itemCount: number;
  addItem: (food: Food, customization: CartItemCustomization, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItem: (itemId: string, customization: CartItemCustomization, quantity: number) => void;
  clearCart: () => void;
  setPromoCode: (code: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], promoCode: null });

  useEffect(() => {
    const items = cartService.loadCart();
    if (items.length > 0) {
      dispatch({ type: 'LOAD', items });
    }
  }, []);

  useEffect(() => {
    cartService.saveCart(state.items);
  }, [state.items]);

  const addItem = (food: Food, customization: CartItemCustomization, quantity: number) => {
    dispatch({ type: 'ADD', food, customization, quantity });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE', itemId });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE', itemId });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', itemId, quantity });
    }
  };

  const updateItem = (itemId: string, customization: CartItemCustomization, quantity: number) => {
    dispatch({ type: 'UPDATE_ITEM', itemId, customization, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR' });
  };

  const setPromoCode = (code: string | null) => {
    dispatch({ type: 'SET_PROMO', promoCode: code });
  };

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        promoCode: state.promoCode,
        itemCount,
        addItem,
        removeItem,
        updateQuantity,
        updateItem,
        clearCart,
        setPromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}