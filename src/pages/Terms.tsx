import { restaurantConfig } from '@/config/restaurant';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-sm text-gray-500">Last updated: January 2024</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-gray">
        <h2>1. Acceptance of Terms</h2>
        <p className="text-gray-600">By using {restaurantConfig.name}'s website and services, you agree to these Terms & Conditions. Please read them carefully before placing an order.</p>

        <h2>2. Orders & Payment</h2>
        <p className="text-gray-600">All orders are subject to availability. Prices displayed include applicable taxes. Delivery fees and minimum order requirements apply. Payment is required at the time of ordering for card payments, or upon delivery for cash payments.</p>

        <h2>3. Delivery</h2>
        <p className="text-gray-600">We aim to deliver within the estimated timeframe but delays may occur due to traffic, weather, or high demand. Free delivery is available for orders over ${restaurantConfig.freeDeliveryThreshold}.</p>

        <h2>4. Cancellation Policy</h2>
        <p className="text-gray-600">Orders can be cancelled free of charge before preparation begins. Once preparation has started, cancellation may not be possible. Refunds for cancelled orders will be processed within 5-10 business days.</p>

        <h2>5. Food Allergies</h2>
        <p className="text-gray-600">While we provide allergen information for our dishes, we cannot guarantee a completely allergen-free environment. Please inform us of any allergies when placing your order.</p>

        <h2>6. Intellectual Property</h2>
        <p className="text-gray-600">All content on this website, including images, text, and logos, is the property of {restaurantConfig.name} and may not be used without permission.</p>

        <h2>7. Contact</h2>
        <p className="text-gray-600">For any questions regarding these terms, please contact us at {restaurantConfig.email}.</p>
      </div>
    </div>
  );
}