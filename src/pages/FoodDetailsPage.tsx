import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Food } from '@/types';
import { getFoodById } from '@/services/foodService';
import { FoodDetails } from '@/components/food/FoodDetails';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

export default function FoodDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getFoodById(id).then((f) => {
        if (f) setFood(f);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <LoadingPage />;
  if (!food) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">😕</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Food Not Found</h2>
          <p className="text-gray-500 mb-6">The item you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/menu')} className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium">
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
          ← Back
        </button>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <FoodDetails food={food} onClose={() => navigate(-1)} />
        </div>
      </div>
    </div>
  );
}