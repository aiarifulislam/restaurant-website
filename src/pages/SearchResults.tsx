import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import type { Food } from '@/types';
import { searchFoods } from '@/services/foodService';
import { FoodGrid } from '@/components/food/FoodGrid';
import { Modal } from '@/components/ui/Modal';
import { FoodDetails } from '@/components/food/FoodDetails';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchFoods(query).then((r) => {
        setResults(r);
        setLoading(false);
      });
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
          {query && <p className="text-gray-500">{results.length} results for "{query}"</p>}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!query ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Search for food</h3>
            <p className="text-gray-500 mb-6">Use the search bar to find your favorite dishes</p>
            <Link to="/menu" className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium">Browse Menu</Link>
          </div>
        ) : (
          <FoodGrid foods={results} loading={loading} emptyMessage={`No results for "${query}"`} />
        )}
      </div>
      <Modal isOpen={!!selectedFood} onClose={() => setSelectedFood(null)} size="xl">
        {selectedFood && <FoodDetails food={selectedFood} onClose={() => setSelectedFood(null)} />}
      </Modal>
    </div>
  );
}