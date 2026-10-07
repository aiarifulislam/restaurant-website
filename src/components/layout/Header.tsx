import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  Heart,
  User,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { restaurantConfig } from '@/config/restaurant';
import { CartDrawer } from '@/components/cart/CartDrawer';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              {restaurantConfig.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Favorites */}
            <Link
              to="/favorites"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hidden sm:flex"
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <Link
              to={isAuthenticated ? '/profile' : '/login'}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hidden sm:flex"
              aria-label={isAuthenticated ? 'Profile' : 'Login'}
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 lg:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-4 animate-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for food..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-fade-in">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">
              <Link
                to="/favorites"
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <span className="flex items-center gap-3">
                  <Heart className="w-4 h-4" /> Favorites
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
              <Link
                to={isAuthenticated ? '/profile' : '/login'}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                <span className="flex items-center gap-3">
                  <User className="w-4 h-4" /> {isAuthenticated ? 'Profile' : 'Login'}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </nav>
        </div>
      )}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}