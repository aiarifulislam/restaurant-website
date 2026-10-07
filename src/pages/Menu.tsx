import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import type { Food, FoodCategory, FilterState } from '@/types';
import { getFilteredFoods, getCategories, searchFoods } from '@/services/foodService';
import { FoodGrid } from '@/components/food/FoodGrid';
import { Modal } from '@/components/ui/Modal';
import { FoodDetails } from '@/components/food/FoodDetails';
import { cn } from '@/utils/cn';

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
];

export default function Menu() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(categorySlug || 'all');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [filters, setFilters] = useState<Partial<FilterState>>({
    isVegetarian: false,
    isVegan: false,
    isSpicy: false,
    isPopular: false,
    minRating: 0,
    availableOnly: true,
    priceRange: [0, 50],
  });

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (categorySlug) setActiveCategory(categorySlug);
  }, [categorySlug]);

  const loadFoods = useCallback(async () => {
    setLoading(true);
    try {
      let result: Food[];
      if (searchQuery) {
        result = await searchFoods(searchQuery);
      } else {
        result = await getFilteredFoods({ ...filters, category: activeCategory }, sortBy);
      }
      setFoods(result);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeCategory, filters, sortBy]);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  const clearFilters = () => {
    setFilters({
      isVegetarian: false,
      isVegan: false,
      isSpicy: false,
      isPopular: false,
      minRating: 0,
      availableOnly: true,
      priceRange: [0, 50],
    });
    setSearchQuery('');
  };

  const hasActiveFilters = filters.isVegetarian || filters.isVegan || filters.isSpicy || filters.isPopular || (filters.minRating ?? 0) > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Menu</h1>
          <p className="text-gray-500">Explore our delicious selection of dishes</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food, categories..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors border',
                showFilters || hasActiveFilters
                  ? 'bg-primary-50 border-primary-200 text-primary-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-primary-600 text-white rounded-full text-xs flex items-center justify-center">
                  {[filters.isVegetarian, filters.isVegan, filters.isSpicy, filters.isPopular, (filters.minRating ?? 0) > 0].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 animate-fade-in border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700">Clear all</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { key: 'isVegetarian', label: '🥬 Vegetarian' },
                { key: 'isVegan', label: '🌱 Vegan' },
                { key: 'isSpicy', label: '🌶️ Spicy' },
                { key: 'isPopular', label: '⭐ Popular' },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setFilters((f) => ({ ...f, [filter.key]: !(f as any)[filter.key] }))}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-sm font-medium transition-all border',
                    (filters as any)[filter.key]
                      ? 'bg-primary-50 border-primary-200 text-primary-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  )}
                >
                  {filter.label}
                </button>
              ))}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white">
                <span className="text-sm text-gray-600">Min Rating:</span>
                <select
                  value={filters.minRating || 0}
                  onChange={(e) => setFilters((f) => ({ ...f, minRating: Number(e.target.value) }))}
                  className="text-sm bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value={0}>Any</option>
                  <option value={3}>3+</option>
                  <option value={4}>4+</option>
                  <option value={4.5}>4.5+</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Category tabs */}
        {!searchQuery && (
          <div className="flex overflow-x-auto gap-2 pb-4 mb-6 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                'flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-colors border',
                activeCategory === 'all'
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  'flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-colors border flex items-center gap-1.5',
                  activeCategory === cat.slug
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                )}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            {loading ? 'Loading...' : `${foods.length} item${foods.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Food Grid */}
        <FoodGrid
          foods={foods}
          loading={loading}
          emptyMessage={searchQuery ? `No results for "${searchQuery}"` : 'No items in this category'}
        />
      </div>

      {/* Food detail modal */}
      <Modal isOpen={!!selectedFood} onClose={() => setSelectedFood(null)} size="xl">
        {selectedFood && <FoodDetails food={selectedFood} onClose={() => setSelectedFood(null)} />}
      </Modal>
    </div>
  );
}