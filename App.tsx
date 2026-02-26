import React, { useEffect } from 'react';
import * as RouterDOM from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import AnnouncementBar from './components/common/AnnouncementBar';
import LeadPopup from './components/LeadPopup';
import WhatsAppFloat from './components/WhatsAppFloat';
import CustomCursor from './components/CustomCursor';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import { ErrorBoundary } from './components/ErrorBoundary';
import Login from './pages/Login';
import Contact from './pages/Contact';
import InfoPage from './pages/InfoPage';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import ProfileDashboard from './pages/ProfileDashboard';
import ProfileSecurity from './pages/account/ProfileSecurity';
import ProfileAddresses from './pages/account/ProfileAddresses';
import ProfilePayments from './pages/account/ProfilePayments';
import ProfileWallet from './pages/account/ProfileWallet';
import ReturnOrder from './pages/ReturnOrder';
import MobileBottomNav from './components/MobileBottomNav';

import { SearchProvider } from './context/SearchContext';
import { CartProvider } from './context/CartProvider';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';

// Lazy Load Admin Modules
const AdminLayout = React.lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./admin/AdminDashboard'));
const AdminProducts = React.lazy(() => import('./admin/Products'));
const AdminOrders = React.lazy(() => import('./admin/Orders'));
const AdminCustomers = React.lazy(() => import('./admin/Customers'));
const AdminSettings = React.lazy(() => import('./admin/AdminSettings'));
const AdminAnalytics = React.lazy(() => import('./admin/Analytics'));
const AdminHelp = React.lazy(() => import('./admin/Help'));
// AdminLogin removed - unified login flow
const AdminLogs = React.lazy(() => import('./admin/Logs'));
const AdminReturns = React.lazy(() => import('./admin/Returns'));
const Tracking = React.lazy(() => import('./admin/Tracking'));
const AdminMarketing = React.lazy(() => import('./admin/Marketing'));
const AdminReviews = React.lazy(() => import('./admin/Reviews'));
const AdminCMS = React.lazy(() => import('./admin/CMS'));
const AdminCoupons = React.lazy(() => import('./admin/Coupons'));
const AdminCouponsDebug = React.lazy(() => import('./admin/CouponsDebug'));
const StockManager = React.lazy(() => import('./admin/stock/StockManager'));
const StockLayout = React.lazy(() => import('./admin/stock/StockLayout'));

// Fix missing members in react-router-dom by casting module
const { HashRouter, Routes, Route, useLocation, useNavigate } = RouterDOM;
const Router = HashRouter;

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};


const AuthHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 App Auth Event:', event);
      if (event === 'SIGNED_IN') {
        const isUserAdmin = session?.user?.email === 'reachkreateup@gmail.com' || session?.user?.email === 'kreateuptech@gmail.com';

        // Only redirect if we are on the login page or any path that is essentially a "landing" after auth
        if (location.pathname === '/login' || location.pathname === '/admin') {
          if (isUserAdmin) {
            navigate('/admin/dashboard');
          } else {
            navigate('/profile');
          }
        }
      }
      if (event === 'SIGNED_OUT') {
        const protectedPaths = ['/admin', '/profile', '/orders', '/checkout'];
        if (protectedPaths.some(path => location.pathname.startsWith(path))) {
          navigate('/');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (isLoading) return;

    // Redirect unauthenticated users trying to access protected routes
    if (!user) {
      const protectedPaths = ['/admin', '/profile', '/orders', '/checkout'];
      if (protectedPaths.some(path => location.pathname.startsWith(path))) {
        navigate('/login');
      }
    }
  }, [user, isLoading, navigate, location.pathname]);

  return null;
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ children, adminOnly = false }) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-12 h-12 border-4 border-fario-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <RouterDOM.Navigate to="/" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <RouterDOM.Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={`flex flex-col min-h-screen font-sans text-gray-800 antialiased ${isAdmin ? 'bg-[#f8fafc]' : 'bg-white'} selection:bg-fario-purple/30 selection:text-white transition-colors duration-300`}>
      <ScrollToTop />
      <AuthHandler />
      <AnnouncementBar />
      {!isAdmin && location.pathname !== '/login' && <CustomCursor />}
      {!isAdmin && location.pathname !== '/login' && <Header />}

      <main className={`flex-grow ${!isAdmin && location.pathname !== '/login' ? 'pb-24 md:pb-0' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location}>
            {/* Unified Admin Routes */}
            <Route path="/admin">
              <Route index element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="tracking" element={<Tracking />} />
                <Route path="marketing" element={<AdminMarketing />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="coupons-debug" element={<AdminCouponsDebug />} />
                <Route path="cms" element={<AdminCMS />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="returns" element={<AdminReturns />} />
                <Route path="logs" element={<AdminLogs />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="help" element={<AdminHelp />} />
              </Route>
              <Route path="stock" element={
                <ProtectedRoute adminOnly>
                  <StockLayout />
                </ProtectedRoute>
              }>
                <Route index element={<StockManager />} />
              </Route>
            </Route>

            {/* Client Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={
              <ErrorBoundary>
                <ProductDetail />
              </ErrorBoundary>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfileDashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile/security" element={
              <ProtectedRoute>
                <ProfileSecurity />
              </ProtectedRoute>
            } />
            <Route path="/profile/addresses" element={
              <ProtectedRoute>
                <ProfileAddresses />
              </ProtectedRoute>
            } />
            <Route path="/profile/payments" element={
              <ProtectedRoute>
                <ProfilePayments />
              </ProtectedRoute>
            } />
            <Route path="/profile/wallet" element={
              <ProtectedRoute>
                <ProfileWallet />
              </ProtectedRoute>
            } />
            <Route path="/story" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/info/:slug" element={<InfoPage />} />
            <Route path="/return/:orderId" element={
              <ProtectedRoute>
                <ReturnOrder />
              </ProtectedRoute>
            } />

          </Routes>
        </AnimatePresence>
      </main>

      {!isAdmin && location.pathname !== '/login' && <Footer />}
      {!isAdmin && location.pathname !== '/login' && <LeadPopup />}
      {!isAdmin && location.pathname !== '/login' && <WhatsAppFloat />}
      <MobileBottomNav />
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.remove('dark');

    // Sync Admin Accent globally
    const adminAccent = localStorage.getItem('fario_theme_accent');
    if (adminAccent) {
      document.documentElement.style.setProperty('--accent', adminAccent);
    }
  }, []);

  return (
    <ErrorBoundary>
      <SearchProvider>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <WishlistProvider>
                <Router>
                  <AppContent />
                </Router>
              </WishlistProvider>
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </SearchProvider>
    </ErrorBoundary>
  );
};

export default App;