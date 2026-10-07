import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What are your delivery hours?',
    a: 'We deliver Monday through Thursday from 11:00 AM to 10:00 PM, Friday and Saturday from 11:00 AM to 11:00 PM, and Sunday from 10:00 AM to 9:00 PM.',
  },
  {
    q: 'Is there a minimum order amount?',
    a: 'Yes, the minimum order for delivery is $15.00. There is no minimum for pickup orders.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Our typical delivery time is 30-45 minutes, depending on your location and current order volume. You can track your order in real-time through our website.',
  },
  {
    q: 'Do you offer free delivery?',
    a: 'Yes! We offer free delivery on all orders over $40. Standard delivery fee is $3.99.',
  },
  {
    q: 'Can I customize my order?',
    a: 'Absolutely! You can customize sizes, add extras, remove ingredients, and add special instructions for most menu items.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express) as well as cash on delivery.',
  },
  {
    q: 'Can I cancel my order?',
    a: 'You can cancel your order free of charge if it hasn\'t entered the preparation stage. Once preparation has begun, cancellation may not be possible.',
  },
  {
    q: 'Do you accommodate food allergies?',
    a: 'We list allergens for all our dishes. You can also add special instructions when ordering. However, please note that our kitchen handles all major allergens.',
  },
  {
    q: 'Do you have vegetarian/vegan options?',
    a: 'Yes! We have a variety of vegetarian and vegan options clearly marked on our menu. Look for the vegetarian and vegan badges.',
  },
  {
    q: 'How do I use a promo code?',
    a: 'You can apply a promo code in the cart or at checkout. Enter the code in the promo code field and click "Apply" to see the discount.',
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-500">Find answers to common questions</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === i && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}