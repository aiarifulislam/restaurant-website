import type { Customer, Address } from '@/types';

const AUTH_STORAGE_KEY = 'lacucina_auth';
const CUSTOMER_STORAGE_KEY = 'lacucina_customer';

const mockCustomer: Customer = {
  id: 'cust-1',
  firstName: 'Marco',
  lastName: 'Rossi',
  email: 'marco.rossi@email.com',
  phone: '+1 (555) 987-6543',
  addresses: [
    {
      id: 'addr-1',
      label: 'Home',
      street: '456 Elm Street',
      apartment: 'Apt 12B',
      city: 'New York',
      postalCode: '10001',
      instructions: 'Ring doorbell twice',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Office',
      street: '789 Broadway',
      apartment: 'Suite 500',
      city: 'New York',
      postalCode: '10003',
      instructions: 'Leave at reception',
      isDefault: false,
    },
  ],
  favorites: [],
};

export async function login(email: string, _password: string): Promise<Customer> {
  await new Promise((r) => setTimeout(r, 500));
  const customer = { ...mockCustomer, email };
  localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
  return customer;
}

export async function register(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<Customer> {
  await new Promise((r) => setTimeout(r, 500));
  const customer: Customer = {
    id: `cust-${Date.now()}`,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    addresses: [],
    favorites: [],
  };
  localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
  return customer;
}

export async function resetPassword(_email: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 500));
}

export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(CUSTOMER_STORAGE_KEY);
}

export function getStoredCustomer(): Customer | null {
  try {
    const data = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

export async function updateCustomer(customer: Customer): Promise<Customer> {
  await new Promise((r) => setTimeout(r, 300));
  localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
  return customer;
}

export async function addAddress(address: Address): Promise<Address> {
  await new Promise((r) => setTimeout(r, 300));
  const newAddr = { ...address, id: `addr-${Date.now()}` };
  const customer = getStoredCustomer();
  if (customer) {
    customer.addresses.push(newAddr);
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
  }
  return newAddr;
}

export async function removeAddress(addressId: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 300));
  const customer = getStoredCustomer();
  if (customer) {
    customer.addresses = customer.addresses.filter((a) => a.id !== addressId);
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
  }
}