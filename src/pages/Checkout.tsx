import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, MapPin, User, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatPrice } from '@/utils/pricing';
import { getCartSummary } from '@/services/cartService';
import { createOrder } from '@/services/orderService';
import { restaurantConfig } from '@/config/restaurant';
import type { CheckoutStep, DeliveryMethod, PaymentMethod, Address } from '@/types';

const steps: { id: CheckoutStep; label: string; icon: React.ReactNode }[] = [
  { id: 'info', label: 'Information', icon: <User className="w-4 h-4" /> },
  { id: 'delivery', label: 'Delivery', icon: <MapPin className="w-4 h-4" /> },
  { id: 'summary', label: 'Summary', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'payment', label: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
];

export default function Checkout() {
  const { items, promoCode, clearCart } = useCart();
  const { customer } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('info');
  const [isProcessing, setIsProcessing] = useState(false);

  const [firstName, setFirstName] = useState(customer?.firstName || '');
  const [lastName, setLastName] = useState(customer?.lastName || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [phone, setPhone] = useState(customer?.phone || '');

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [address, setAddress] = useState<Address>(customer?.addresses.find(a => a.isDefault) || {
    id: '', label: '', street: '', apartment: '', city: 'New York', postalCode: '', instructions: '', isDefault: false,
  });
  const [pickupNote, setPickupNote] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const summary = getCartSummary(items, promoCode || undefined);

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <EmptyState
            icon={<ShoppingBag className="w-10 h-10" />}
            title="No items to checkout"
            description="Add some items to your cart first."
            action={
              <button onClick={() => navigate('/menu')} className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold">
                Browse Menu
              </button>
            }
          />
        </div>
      </div>
    );
  }

  const stepIdx = steps.findIndex((s) => s.id === currentStep);

  const canProceed = () => {
    switch (currentStep) {
      case 'info': return firstName.trim() && lastName.trim() && email.trim() && phone.trim();
      case 'delivery': return deliveryMethod === 'pickup' || address.street.trim();
      case 'summary': return true;
      case 'payment': return paymentMethod === 'cash' || (cardNumber.trim() && cardName.trim() && expiry.trim() && cvv.trim());
      default: return false;
    }
  };

  const goNext = () => {
    if (stepIdx < steps.length - 1) {
      setCurrentStep(steps[stepIdx + 1].id);
    }
  };

  const goBack = () => {
    if (stepIdx > 0) {
      setCurrentStep(steps[stepIdx - 1].id);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const cust = customer || { id: 'guest', firstName, lastName, email, phone, addresses: [], favorites: [] };
      const order = await createOrder(
        items,
        cust,
        deliveryMethod,
        deliveryMethod === 'delivery' ? address : undefined,
        paymentMethod,
        summary
      );
      clearCart();
      navigate(`/order-success/${order.id}`);
    } catch {
      addToast('Failed to place order. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNum = (v: string) => {
    const clean = v.replace(/\D/g, '').slice(0, 16);
    return clean.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiryVal = (v: string) => {
    const clean = v.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
    return clean;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Steps indicator */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => {
                  if (i < stepIdx) setCurrentStep(step.id);
                }}
                disabled={i > stepIdx}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  i === stepIdx
                    ? 'bg-primary-600 text-white'
                    : i < stepIdx
                    ? 'bg-green-100 text-green-700 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-default'
                }`}
              >
                {i < stepIdx ? <Check className="w-4 h-4" /> : step.icon}
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${i < stepIdx ? 'bg-green-300' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              {/* Step 1: Customer Information */}
              {currentStep === 'info' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name *</label>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name *</label>
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone *</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Delivery */}
              {currentStep === 'delivery' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Method</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {(['delivery', 'pickup'] as DeliveryMethod[]).map((method) => (
                      <button
                        key={method}
                        onClick={() => setDeliveryMethod(method)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          deliveryMethod === method
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{method === 'delivery' ? '🚚' : '🏪'}</div>
                        <div className="font-semibold text-gray-900 capitalize">{method}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {method === 'delivery' ? `Est. ${restaurantConfig.estimatedDeliveryTime}` : `Est. ${restaurantConfig.estimatedPreparationTime}`}
                        </div>
                      </button>
                    ))}
                  </div>

                  {deliveryMethod === 'delivery' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
                        <input type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="123 Main St" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Apt/Suite</label>
                          <input type="text" value={address.apartment} onChange={(e) => setAddress({ ...address, apartment: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Apt 1" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                          <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code</label>
                        <input type="text" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="10001" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Instructions</label>
                        <textarea value={address.instructions} onChange={(e) => setAddress({ ...address, instructions: e.target.value })} rows={2} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Ring the doorbell..." />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <p className="font-medium text-gray-900">Pickup Address</p>
                        <p className="text-sm text-gray-500 mt-1">{restaurantConfig.address}</p>
                        <p className="text-sm text-gray-500">Est. preparation: {restaurantConfig.estimatedPreparationTime}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Instructions</label>
                        <textarea value={pickupNote} onChange={(e) => setPickupNote(e.target.value)} rows={2} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Any notes for pickup..." />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Summary */}
              {currentStep === 'summary' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={item.food.image} alt={item.food.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900">{item.food.name}</div>
                          <div className="text-xs text-gray-500">
                            {item.customization.size?.name} {item.customization.extras.length > 0 && `· ${item.customization.extras.map(e => e.name).join(', ')}`}
                          </div>
                          <div className="text-xs text-gray-400">Qty: {item.quantity}</div>
                        </div>
                        <div className="font-semibold text-gray-900">{formatPrice(item.totalPrice)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm">
                    <div className="flex justify-between mb-1"><span className="text-gray-500">Delivery:</span><span className="text-gray-700 capitalize">{deliveryMethod}</span></div>
                    {deliveryMethod === 'delivery' && address.street && (
                      <div className="flex justify-between"><span className="text-gray-500">Address:</span><span className="text-gray-700">{address.street}, {address.city}</span></div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 'payment' && (
                <div className="animate-fade-in">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {(['card', 'cash'] as PaymentMethod[]).map((method) => (
                      <button
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          paymentMethod === method
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{method === 'card' ? '💳' : '💵'}</div>
                        <div className="font-semibold text-gray-900 capitalize">{method === 'card' ? 'Bank Card' : 'Cash on Delivery'}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {method === 'card' ? 'Visa, Mastercard, Amex' : 'Pay when you receive'}
                        </div>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNum(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="JOHN DOE"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry</label>
                          <input
                            type="text"
                            value={expiry}
                            onChange={(e) => setExpiry(formatExpiryVal(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                          <input
                            type="text"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        🔒 Your payment information is secure. Card data is not stored.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'cash' && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600">Pay with cash when your order is delivered or picked up.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                {stepIdx > 0 ? (
                  <button onClick={goBack} className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                ) : <div />}
                {stepIdx < steps.length - 1 ? (
                  <button onClick={goNext} disabled={!canProceed()} className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button onClick={handlePlaceOrder} disabled={!canProceed() || isProcessing} className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                    {isProcessing ? 'Processing...' : `Place Order · ${formatPrice(summary.total)}`}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Order Total</h3>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="text-gray-700">{formatPrice(summary.subtotal)}</span></div>
                {summary.discount > 0 && <div className="flex justify-between"><span className="text-green-600">Discount</span><span className="text-green-600">-{formatPrice(summary.discount)}</span></div>}
                <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className="text-gray-700">{summary.deliveryFee === 0 ? <span className="text-green-600">Free</span> : formatPrice(summary.deliveryFee)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Tax</span><span className="text-gray-700">{formatPrice(summary.tax)}</span></div>
                <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold"><span className="text-gray-900">Total</span><span className="text-gray-900">{formatPrice(summary.total)}</span></div>
              </div>
              <div className="text-xs text-gray-400">
                {items.length} item{items.length !== 1 ? 's' : ''} in cart
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}