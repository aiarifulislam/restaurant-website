import { restaurantConfig } from '@/config/restaurant';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: January 2024</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-gray">
        <h2>1. Information We Collect</h2>
        <p className="text-gray-600">When you use {restaurantConfig.name}'s services, we may collect personal information including your name, email address, phone number, delivery address, and payment information.</p>

        <h2>2. How We Use Your Information</h2>
        <p className="text-gray-600">We use your information to process orders, deliver food, communicate about your orders, improve our services, and send promotional offers (with your consent).</p>

        <h2>3. Information Sharing</h2>
        <p className="text-gray-600">We do not sell your personal information. We may share information with delivery partners and payment processors solely to fulfill your orders.</p>

        <h2>4. Data Security</h2>
        <p className="text-gray-600">We implement appropriate security measures to protect your personal information. Payment card data is processed securely and never stored on our servers.</p>

        <h2>5. Cookies</h2>
        <p className="text-gray-600">We use cookies to improve your browsing experience, analyze site traffic, and personalize content. You can control cookie settings in your browser.</p>

        <h2>6. Your Rights</h2>
        <p className="text-gray-600">You have the right to access, correct, or delete your personal information. Contact us at {restaurantConfig.email} to exercise these rights.</p>

        <h2>7. Contact Us</h2>
        <p className="text-gray-600">If you have questions about this privacy policy, please contact us at {restaurantConfig.email} or {restaurantConfig.phone}.</p>
      </div>
    </div>
  );
}