import { restaurantConfig } from '@/config/restaurant';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About {restaurantConfig.name}</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">{restaurantConfig.tagline}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Founded in 2010, {restaurantConfig.name} was born from a passion for authentic Italian cuisine
                and a dream to bring the flavors of Italy to our local community.
              </p>
              <p>
                What started as a small family restaurant has grown into a beloved neighborhood
                establishment, known for our commitment to quality ingredients, traditional recipes,
                and warm hospitality.
              </p>
              <p>
                Every dish we serve is crafted with care, using recipes passed down through generations
                and the freshest locally sourced ingredients. From our wood-fired pizzas to our
                handmade pasta, we bring the taste of Italy to your table.
              </p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop"
              alt="Restaurant interior"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">What We Stand For</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { emoji: '🌿', title: 'Fresh Ingredients', desc: 'We source the finest local and imported ingredients to ensure every dish meets our high standards.' },
              { emoji: '👨‍🍳', title: 'Expert Craftsmanship', desc: 'Our chefs bring decades of culinary expertise, combining tradition with innovation.' },
              { emoji: '❤️', title: 'Made with Love', desc: 'Every dish is prepared with passion and attention to detail, because we care about your experience.' },
            ].map((v) => (
              <div key={v.title} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <span className="text-4xl block mb-4">{v.emoji}</span>
                <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Meet the Chef</h2>
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-2xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&h=300&fit=crop"
              alt="Head Chef"
              className="w-48 h-48 rounded-2xl object-cover shadow-lg"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-900">Chef Marco Bellini</h3>
              <p className="text-primary-600 font-medium text-sm mb-3">Executive Chef & Founder</p>
              <p className="text-gray-600 leading-relaxed">
                With over 25 years of culinary experience across Italy and the United States,
                Chef Marco brings an unmatched depth of knowledge and passion to every dish.
                Trained in Bologna and Florence, he has dedicated his career to preserving
                authentic Italian flavors while embracing modern techniques.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}