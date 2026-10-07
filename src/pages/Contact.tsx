import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { restaurantConfig } from '@/config/restaurant';
import { useToast } from '@/context/ToastContext';

export default function Contact() {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      addToast('Please fill in all required fields', 'warning');
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 500));
    addToast('Message sent successfully! We\'ll get back to you soon.', 'success');
    setName(''); setEmail(''); setSubject(''); setMessage('');
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-500">We'd love to hear from you</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            <div className="space-y-6">
              {[
                { icon: <MapPin className="w-5 h-5" />, label: 'Address', value: restaurantConfig.address },
                { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: restaurantConfig.phone },
                { icon: <Mail className="w-5 h-5" />, label: 'Email', value: restaurantConfig.email },
                { icon: <Clock className="w-5 h-5" />, label: 'Hours', value: 'Mon-Thu: 11AM-10PM | Fri-Sat: 11AM-11PM | Sun: 10AM-9PM' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
                    <div className="text-gray-500 text-sm">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="mt-8 h-64 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Map placeholder</p>
                <p className="text-xs">Google Maps integration point</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Your message..." />
              </div>
              <button type="submit" disabled={sending} className="flex items-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 shadow-sm">
                <Send className="w-4 h-4" /> {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}