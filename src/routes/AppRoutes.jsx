import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useSelector, useDispatch } from 'react-redux';
import ScrollToTop from '../components/ScrollToTop';
import { fetchCart } from '../features/cart/cartSlice';

// Lazy loading pages
const HomePage = lazy(() => import('../pages/HomePage'));
const ProductListingPage = lazy(() => import('../pages/ProductListingPage'));
const ProductDetailsPage = lazy(() => import('../pages/ProductDetailsPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const UserLoginPage = lazy(() => import('../pages/UserLoginPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const FavoritesPage = lazy(() => import('../pages/FavoritesPage'));
const GalleryPage = lazy(() => import('../pages/GalleryPage'));
const OrdersPage = lazy(() => import('../pages/OrdersPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const OrderSuccessPage = lazy(() => import('../pages/OrderSuccessPage'));
const OrderFailPage = lazy(() => import('../pages/OrderFailPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('../pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('../pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminBlogs = lazy(() => import('../pages/admin/AdminBlogs'));
const AdminCategories = lazy(() => import('../pages/admin/AdminCategories'));
const AdminNewsletter = lazy(() => import('../pages/admin/AdminNewsletter'));
const AdminContact = lazy(() => import('../pages/admin/AdminContact'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));
const AdminAttributes = lazy(() => import('../pages/admin/AdminAttributes'));
const AdminLayout = lazy(() => import('../components/admin/AdminLayout'));
const AdminLoginPage = lazy(() => import('../pages/admin/AdminLoginPage'));

// add public pages for footer
const AccessibilityPage = lazy(() => import('../pages/AccessibilityPage'));
const CookieSettingsPage = lazy(() => import('../pages/CookieSettingsPage'));
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicyPage'));
const TermsOfUsePage = lazy(() => import('../pages/TermsOfUsePage'));
const ShippingPolicyPage = lazy(() => import('../pages/ShippingPolicyPage'));
const ReturnsExchangesPage = lazy(() => import('../pages/ReturnsExchangesPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const BlogPage = lazy(() => import('../pages/BlogPage'));
const BlogDetailsPage = lazy(() => import('../pages/BlogDetailsPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const SocialCallbackPage = lazy(() => import('../pages/SocialCallbackPage'));

const PrivateRoute = ({ children }) => {
  const { user } = useSelector(state => state.auth);
  const location = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

const AdminRoute = ({ children }) => {
  const { user, token } = useSelector(state => state.adminAuth);
  
  // Robust check: use Redux state or fallback to localStorage
  const currentUser = user || JSON.parse(localStorage.getItem('admin_user'));
  const currentToken = token || localStorage.getItem('admin_token');

  if (!currentUser || !currentToken || currentUser.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  return (

    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductListingPage />} />
          <Route path="product/:slug" element={<ProductDetailsPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order/success" element={<OrderSuccessPage />} />
          <Route path="order/fail" element={<OrderFailPage />} />
          <Route path="login" element={<UserLoginPage />} />
          <Route path="auth/:provider/callback" element={<SocialCallbackPage />} />

  {/* Public Legal & Settings Pages */}
          <Route path="accessibility" element={<AccessibilityPage />} />
          <Route path="cookie-settings" element={<CookieSettingsPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-of-use" element={<TermsOfUsePage />} />
          <Route path="shipping-policy" element={<ShippingPolicyPage />} />
          <Route path="returns-exchanges" element={<ReturnsExchangesPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="journal" element={<BlogPage />} />
          <Route path="journal/:slug" element={<BlogDetailsPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />

          <Route 
            path="profile" 
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="orders" 
            element={
              <PrivateRoute>
                <OrdersPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="settings" 
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            } 
          />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="journal" element={<AdminBlogs />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="contact" element={<AdminContact />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="attributes" element={<AdminAttributes />} />
          {/* Add other admin sub-routes here */}
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
