import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import type { Food } from '@/types';
import { getFoods } from '@/services/foodService';
import { useAuth } from '@/context/AuthContext';
import { FoodGrid } from '@/components/food/FoodGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { FoodDetails } from '@/components/food/FoodDetails';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

export default function Favorites() {
  const { customer, isAuthenticated } = useAuth();
  const [allFoods, setAllFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  useEffect(() => {
    getFoods().then((f) => {
      setAllFoods(f);
      setLoading(false);
    });
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <EmptyState
            icon={<Heart className="w-10 h-10" />}
            title="Sign in to see favorites"
            description="Log in to save and view your favorite dishes."
            action={<Link to="/login" className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold">Sign In</Link>}
          />
        </div>
      </div>
    );
  }

  if (loading) return <LoadingPage />;

  const favoriteFoods = allFoods.filter((f) => customer?.favorites.includes(f.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites</h1>
        {favoriteFoods.length === 0 ? (
          <EmptyState
            icon={<Heart className="w-10 h-10" />}
            title="No favorites yet"
            description="Browse our menu and tap the heart icon to save your favorite dishes."
            action={<Link to="/menu" className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold">Browse Menu</Link>}
          />
        ) : (
          <FoodGrid foods={favoriteFoods} />
        )}
      </div>
      <Modal isOpen={!!selectedFood} onClose={() => setSelectedFood(null)} size="xl">
        {selectedFood && <FoodDetails food={selectedFood} onClose={() => setSelectedFood(null)} />}
      </Modal>
    </div>
  );
}