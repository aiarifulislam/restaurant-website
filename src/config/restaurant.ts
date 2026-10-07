import type { RestaurantConfig } from '@/types';

export const restaurantConfig: RestaurantConfig = {
  name: 'La Cucina',
  tagline: 'Authentic Italian Flavors, Crafted with Passion',
  description:
    'Experience the finest Italian cuisine made with fresh, locally sourced ingredients. From handmade pasta to wood-fired pizzas, every dish tells a story of tradition and taste.',
  logo: '/logo.svg',
  address: '123 Via Roma, Milan District, New York, NY 10001',
  phone: '+1 (555) 123-4567',
  email: 'info@lacucina.com',
  website: 'https://lacucina.com',
  openingHours: [
    { day: 'Monday', hours: '11:00 AM – 10:00 PM' },
    { day: 'Tuesday', hours: '11:00 AM – 10:00 PM' },
    { day: 'Wednesday', hours: '11:00 AM – 10:00 PM' },
    { day: 'Thursday', hours: '11:00 AM – 10:00 PM' },
    { day: 'Friday', hours: '11:00 AM – 11:00 PM' },
    { day: 'Saturday', hours: '10:00 AM – 11:00 PM' },
    { day: 'Sunday', hours: '10:00 AM – 9:00 PM' },
  ],
  deliveryFee: 3.99,
  minimumOrder: 15.0,
  freeDeliveryThreshold: 40.0,
  estimatedDeliveryTime: '30–45 min',
  estimatedPreparationTime: '15–25 min',
  social: {
    facebook: 'https://facebook.com/lacucina',
    instagram: 'https://instagram.com/lacucina',
    twitter: 'https://twitter.com/lacucina',
  },
  taxRate: 0.08,
};