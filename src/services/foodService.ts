import { foods } from '@/data/foods';
import { categories } from '@/data/categories';
import type { Food, FoodCategory, FilterState } from '@/types';

// Simulate API delay
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getFoods(): Promise<Food[]> {
  await delay(300);
  return [...foods];
}

export async function getFoodById(id: string): Promise<Food | undefined> {
  await delay(200);
  return foods.find((f) => f.id === id);
}

export async function getFoodBySlug(slug: string): Promise<Food | undefined> {
  await delay(200);
  return foods.find((f) => f.slug === slug);
}

export async function getCategories(): Promise<FoodCategory[]> {
  await delay(200);
  return [...categories];
}

export async function getFoodsByCategory(categorySlug: string): Promise<Food[]> {
  await delay(300);
  return foods.filter((f) => f.categorySlug === categorySlug);
}

export async function searchFoods(query: string): Promise<Food[]> {
  await delay(300);
  const q = query.toLowerCase();
  return foods.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export async function getPopularFoods(): Promise<Food[]> {
  await delay(300);
  return foods.filter((f) => f.isPopular);
}

export async function getNewFoods(): Promise<Food[]> {
  await delay(300);
  return foods.filter((f) => f.isNew);
}

export async function getFilteredFoods(filters: Partial<FilterState>, sortBy?: string): Promise<Food[]> {
  await delay(300);
  let result = [...foods];

  if (filters.category && filters.category !== 'all') {
    result = result.filter((f) => f.categorySlug === filters.category);
  }
  if (filters.isVegetarian) {
    result = result.filter((f) => f.isVegetarian);
  }
  if (filters.isVegan) {
    result = result.filter((f) => f.isVegan);
  }
  if (filters.isSpicy) {
    result = result.filter((f) => f.isSpicy);
  }
  if (filters.isPopular) {
    result = result.filter((f) => f.isPopular);
  }
  if (filters.minRating && filters.minRating > 0) {
    result = result.filter((f) => f.rating >= filters.minRating!);
  }
  if (filters.availableOnly) {
    result = result.filter((f) => f.available);
  }
  if (filters.priceRange) {
    result = result.filter(
      (f) => f.price >= filters.priceRange![0] && f.price <= filters.priceRange![1]
    );
  }

  if (sortBy) {
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }
  }

  return result;
}