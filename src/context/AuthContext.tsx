import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Customer, Address } from '@/types';
import * as authService from '@/services/authService';

interface AuthContextType {
  customer: Customer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
  updateCustomer: (customer: Customer) => Promise<void>;
  addAddress: (address: Address) => Promise<void>;
  removeAddress: (addressId: string) => Promise<void>;
  toggleFavorite: (foodId: string) => void;
  isFavorite: (foodId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = authService.getStoredCustomer();
    if (stored) {
      setCustomer(stored);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const c = await authService.login(email, password);
    setCustomer(c);
  };

  const register = async (data: { firstName: string; lastName: string; email: string; phone: string; password: string }) => {
    const c = await authService.register(data);
    setCustomer(c);
  };

  const logout = () => {
    authService.logout();
    setCustomer(null);
  };

  const updateCustomerFn = async (updated: Customer) => {
    const c = await authService.updateCustomer(updated);
    setCustomer(c);
  };

  const addAddress = async (address: Address) => {
    const newAddr = await authService.addAddress(address);
    if (customer) {
      setCustomer({ ...customer, addresses: [...customer.addresses, newAddr] });
    }
  };

  const removeAddress = async (addressId: string) => {
    await authService.removeAddress(addressId);
    if (customer) {
      setCustomer({ ...customer, addresses: customer.addresses.filter((a) => a.id !== addressId) });
    }
  };

  const toggleFavorite = (foodId: string) => {
    if (!customer) return;
    const favorites = customer.favorites.includes(foodId)
      ? customer.favorites.filter((id) => id !== foodId)
      : [...customer.favorites, foodId];
    const updated = { ...customer, favorites };
    setCustomer(updated);
    authService.updateCustomer(updated);
  };

  const isFavorite = (foodId: string): boolean => {
    return customer?.favorites.includes(foodId) ?? false;
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        isAuthenticated: !!customer,
        isLoading,
        login,
        register,
        logout: logout,
        updateCustomer: updateCustomerFn,
        addAddress,
        removeAddress,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}