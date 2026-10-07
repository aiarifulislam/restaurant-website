import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, Clock, CreditCard, Star, ChevronRight, ChevronLeft, Quote } from 'lucide-react';
import type { Food, FoodCategory } from '@/types';
import { getPopularFoods, getCategories } from '@/services/foodService';
import { FoodCard } from '@/components/food/FoodCard';
import { CategoryCard } from '@/components/food/CategoryCard';
import { restaurantConfig } from '@/config/restaurant';
import { Modal } from '@/components/ui/Modal';
import { FoodDetails } from '@/components/food/FoodDetails';

export default function Home() {
  const [popularFoods, setPopularFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [reviewIdx, setReviewIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getPopularFoods(), getCategories()]).then(([foods, cats]) => {
      setPopularFoods(foods);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const reviews = [
    { name: 'Sarah M.', rating: 5, text: 'Best Italian food in the city! The carbonara is absolutely divine. We order at least once a week.', avatar: '👩' },
    { name: 'James K.', rating: 5, text: 'Incredible quality and fast delivery. The pizzas taste like they were just pulled from a wood-fired oven in Naples.', avatar: '👨' },
    { name: 'Emily R.', rating: 5, text: 'The family feast was perfect for our dinner party. Generous portions and everything was still hot on arrival.', avatar: '👩‍🦰' },
    { name: 'Michael T.', rating: 4, text: 'Love the variety and the app is so easy to use. The tiramisu alone is worth the visit. Highly recommended!', avatar: '👨‍🦱' },
  ];

  const nextReview = () => setReviewIdx((i) => (i + 1) % reviews.length);
  const prevReview = () => setReviewIdx((i) => (i - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    const timer = setInterval(nextReview, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                🍕 Authentic Italian Cuisine
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Delicious Food,
                <br />
                <span className="text-primary-600">Made Fresh</span> for You
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Experience the finest Italian cuisine crafted with passion, premium ingredients,
                and generations of culinary tradition. From our kitchen to your doorstep.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/menu')}
                  className="px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors shadow-sm shadow-primary-200 flex items-center gap-2"
                >
                  Order Now <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/menu')}
                  className="px-8 py-3.5 border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
                >
                  View Menu
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-gray-200">
                {[
                  { value: '4.9', label: 'Rating', icon: '⭐' },
                  { value: '15K+', label: 'Orders', icon: '📦' },
                  { value: '30 min', label: 'Delivery', icon: '🚚' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-primary-100/50 transform rotate-6" />
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop"
                  alt="Delicious food"
                  className="relative rounded-3xl shadow-2xl w-full h-full object-cover"
                />
                {/* Floating cards */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-3 animate-float">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">🚚</div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">Free Delivery</div>
                    <div className="text-xs text-gray-500">On orders $40+</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-3 animate-float-delayed">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">⭐</div>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">Top Rated</div>
                    <div className="text-xs text-gray-500">4.9 average</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <Truck className="w-6 h-6" />, title: 'Free Delivery', desc: 'On orders over $40' },
              { icon: <Clock className="w-6 h-6" />, title: 'Fast Service', desc: '30–45 min delivery' },
              { icon: <CreditCard className="w-6 h-6" />, title: 'Secure Payment', desc: 'Multiple options' },
            ].map((feature) => (
              <div key={feature.title} className="flex items-center gap-4 py-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{feature.title}</div>
                  <div className="text-gray-500 text-sm">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Explore Our Categories</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">From wood-fired pizzas to fresh seafood, discover something for every taste</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Foods */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Most Popular</h2>
              <p className="text-gray-500">Our customers' favorite dishes</p>
            </div>
            <Link
              to="/menu"
              className="hidden sm:flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-4 space-y-3"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-200 rounded w-full" /><div className="h-9 bg-gray-200 rounded-full w-24 ml-auto" /></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popularFoods.slice(0, 8).map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
          <div className="mt-8 text-center sm:hidden">
            <Link to="/menu" className="inline-flex items-center gap-1 text-primary-600 font-medium">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Special Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: '20% OFF',
                subtitle: 'First Order',
                description: 'Use code WELCOME20 at checkout',
                color: 'from-red-500 to-orange-500',
                emoji: '🎉',
              },
              {
                title: 'Combo Deals',
                subtitle: 'Save Big',
                description: 'Pizza + Wings from $24.99',
                color: 'from-blue-500 to-indigo-500',
                emoji: '🍕',
              },
              {
                title: 'Family Feast',
                subtitle: '$49.99',
                description: '2 pizzas, garlic bread, salad & 4 drinks',
                color: 'from-green-500 to-emerald-500',
                emoji: '👨‍👩‍👧‍👦',
              },
            ].map((offer) => (
              <div
                key={offer.title}
                className={`relative bg-gradient-to-br ${offer.color} rounded-2xl p-8 text-white overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform`}
                onClick={() => navigate('/menu')}
              >
                <div className="absolute -right-4 -top-4 text-8xl opacity-20">{offer.emoji}</div>
                <div className="relative">
                  <span className="text-sm font-medium opacity-80">{offer.subtitle}</span>
                  <h3 className="text-3xl font-bold mt-1 mb-2">{offer.title}</h3>
                  <p className="text-sm opacity-90">{offer.description}</p>
                  <button className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">What Our Customers Say</h2>
          <div className="relative">
            <Quote className="w-10 h-10 text-primary-200 mx-auto mb-6" />
            <p className="text-lg text-gray-600 leading-relaxed mb-6 max-w-2xl mx-auto">
              "{reviews[reviewIdx].text}"
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">{reviews[reviewIdx].avatar}</span>
              <div>
                <div className="font-semibold text-gray-900">{reviews[reviewIdx].name}</div>
                <div className="flex gap-0.5">
                  {Array.from({ length: reviews[reviewIdx].rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-8">
              <button onClick={prevReview} className="p-2 rounded-full border border-gray-200 hover:bg-white transition-colors" aria-label="Previous review">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5 items-center">
                {reviews.map((_, i) => (
                  <button key={i} onClick={() => setReviewIdx(i)} className={`w-2 h-2 rounded-full transition-colors ${i === reviewIdx ? 'bg-primary-600 w-6' : 'bg-gray-300'}`} aria-label={`Review ${i + 1}`} />
                ))}
              </div>
              <button onClick={nextReview} className="p-2 rounded-full border border-gray-200 hover:bg-white transition-colors" aria-label="Next review">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Visit Us</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <div className="font-semibold text-gray-900">Address</div>
                    <div className="text-gray-500">{restaurantConfig.address}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-xl">📞</span>
                  <div>
                    <div className="font-semibold text-gray-900">Phone</div>
                    <div className="text-gray-500">{restaurantConfig.phone}</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-xl">📧</span>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-500">{restaurantConfig.email}</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Opening Hours</h2>
              <div className="space-y-2">
                {restaurantConfig.openingHours.map((h) => (
                  <div key={h.day} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{h.day}</span>
                    <span className="text-gray-500">{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Hungry? Order Now!</h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
            Fresh, delicious food delivered to your doorstep in 30–45 minutes
          </p>
          <button
            onClick={() => navigate('/menu')}
            className="px-10 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-lg"
          >
            Browse Menu
          </button>
        </div>
      </section>

      {/* Food detail modal */}
      <Modal isOpen={!!selectedFood} onClose={() => setSelectedFood(null)} size="xl">
        {selectedFood && <FoodDetails food={selectedFood} onClose={() => setSelectedFood(null)} />}
      </Modal>
    </div>
  );
}