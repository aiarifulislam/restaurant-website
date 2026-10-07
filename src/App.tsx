import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { Layout } from '@/components/layout/Layout';
import { LoadingPage } from '@/components/ui/LoadingSpinner';

// Lazy-loaded pages
const Home = lazy(() => import('@/pages/Home'));
const Menu = lazy(() => import('@/pages/Menu'));
const FoodDetailsPage = lazy(() => import('@/pages/FoodDetailsPage'));
const SearchResults = lazy(() => import('@/pages/SearchResults'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const OrderSuccess = lazy(() => import('@/pages/OrderSuccess'));
const Orders = lazy(() => import('@/pages/Orders'));
const OrderDetails = lazy(() => import('@/pages/OrderDetails'));
const OrderTracking = lazy(() => import('@/pages/OrderTracking'));
const Profile = lazy(() => import('@/pages/Profile'));
const Favorites = lazy(() => import('@/pages/Favorites'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));

function PageLoader() {
  return (
    <Layout>
      <LoadingPage />
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public pages */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/menu" element={<Layout><Menu /></Layout>} />
                <Route path="/menu/:category" element={<Layout><Menu /></Layout>} />
                <Route path="/food/:id" element={<Layout><FoodDetailsPage /></Layout>} />
                <Route path="/search" element={<Layout><SearchResults /></Layout>} />
                <Route path="/cart" element={<Layout><Cart /></Layout>} />
                <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
                <Route path="/order-success/:orderId" element={<Layout><OrderSuccess /></Layout>} />
                <Route path="/orders" element={<Layout><Orders /></Layout>} />
                <Route path="/orders/:orderId" element={<Layout><OrderDetails /></Layout>} />
                <Route path="/track-order/:orderId" element={<Layout><OrderTracking /></Layout>} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                <Route path="/favorites" element={<Layout><Favorites /></Layout>} />
                <Route path="/about" element={<Layout><About /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />
                <Route path="/faq" element={<Layout><FAQ /></Layout>} />
                <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
                <Route path="/terms" element={<Layout><Terms /></Layout>} />

                {/* Auth pages (no header/footer) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* 404 */}
                <Route path="*" element={
                  <Layout>
                    <div className="min-h-[60vh] flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-6xl mb-4 block">😕</span>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
                        <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
                        <a href="/" className="px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                          Go Home
                        </a>
                      </div>
                    </div>
                  </Layout>
                } />
              </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}