import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, MapPin, Heart, Package, Settings, LogOut, Edit2, Plus, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import type { Address } from '@/types';

type Tab = 'info' | 'addresses' | 'settings';

export default function Profile() {
  const { customer, isAuthenticated, logout, updateCustomer, addAddress, removeAddress } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('info');
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(customer?.firstName || '');
  const [lastName, setLastName] = useState(customer?.lastName || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [phone, setPhone] = useState(customer?.phone || '');

  // Address form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ street: '', apartment: '', city: 'New York', postalCode: '', instructions: '', label: '' });

  if (!isAuthenticated || !customer) {
    navigate('/login');
    return <LoadingPage />;
  }

  const handleSave = async () => {
    await updateCustomer({ ...customer, firstName, lastName, email, phone });
    setEditing(false);
    addToast('Profile updated successfully', 'success');
  };

  const handleAddAddress = async () => {
    if (!newAddr.street.trim()) return;
    await addAddress({ ...newAddr, id: '', isDefault: false } as Address);
    setShowAddAddress(false);
    setNewAddr({ street: '', apartment: '', city: 'New York', postalCode: '', instructions: '', label: '' });
    addToast('Address added', 'success');
  };

  const handleRemoveAddress = async (id: string) => {
    await removeAddress(id);
    addToast('Address removed', 'info');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    addToast('Logged out successfully', 'info');
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'info', label: 'Personal Info', icon: <User className="w-4 h-4" /> },
    { key: 'addresses', label: 'Addresses', icon: <MapPin className="w-4 h-4" /> },
    { key: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
              {customer.firstName[0]}{customer.lastName[0]}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{customer.firstName} {customer.lastName}</h1>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  tab === t.key ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
            <Link to="/orders" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
              <Package className="w-4 h-4" /> My Orders
            </Link>
            <Link to="/favorites" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
              <Heart className="w-4 h-4" /> Favorites
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              {tab === 'info' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                    {!editing ? (
                      <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button onClick={() => setEditing(false)} className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg">
                          <X className="w-4 h-4" /> Cancel
                        </button>
                        <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-lg">
                          <Save className="w-4 h-4" /> Save
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                      {editing ? (
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900">{customer.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                      {editing ? (
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900">{customer.lastName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                      {editing ? (
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900">{customer.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                      {editing ? (
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-900">{customer.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {tab === 'addresses' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Saved Addresses</h2>
                    <button onClick={() => setShowAddAddress(true)} className="flex items-center gap-1.5 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <Plus className="w-4 h-4" /> Add Address
                    </button>
                  </div>
                  {customer.addresses.length === 0 ? (
                    <p className="text-gray-500 text-sm py-8 text-center">No saved addresses yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {customer.addresses.map((addr) => (
                        <div key={addr.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-xl">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{addr.label || 'Address'}</span>
                              {addr.isDefault && <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-medium">Default</span>}
                            </div>
                            <p className="text-sm text-gray-500">{addr.street}{addr.apartment ? `, ${addr.apartment}` : ''}, {addr.city} {addr.postalCode}</p>
                          </div>
                          <button onClick={() => handleRemoveAddress(addr.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {showAddAddress && (
                    <div className="mt-6 p-4 border-2 border-primary-200 rounded-xl bg-primary-50/50 animate-fade-in">
                      <h3 className="font-semibold text-gray-900 mb-4">New Address</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <input value={newAddr.label} onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })} placeholder="Label (Home, Work)" className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        <input value={newAddr.street} onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} placeholder="Street *" className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        <input value={newAddr.apartment} onChange={(e) => setNewAddr({ ...newAddr, apartment: e.target.value })} placeholder="Apt/Suite" className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        <input value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} placeholder="City" className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        <input value={newAddr.postalCode} onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })} placeholder="Postal Code" className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setShowAddAddress(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600">Cancel</button>
                        <button onClick={handleAddAddress} disabled={!newAddr.street.trim()} className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium disabled:opacity-50">Save Address</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === 'settings' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h2>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Notifications</div>
                        <div className="text-sm text-gray-500">Order updates and promotions</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    <div className="p-4 border border-red-200 rounded-xl">
                      <div className="font-medium text-red-600 mb-1">Delete Account</div>
                      <div className="text-sm text-gray-500 mb-3">This action cannot be undone.</div>
                      <button className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}