import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useSelector } from 'react-redux';
import ScrollToTop from '../components/ScrollToTop';

// Lazy loading pages
const HomePage = lazy(() => import('../pages/HomePage'));
const ProductListingPage = lazy(() => import('../pages/ProductListingPage'));
const ProductDetailsPage = lazy(() => import('../pages/ProductDetailsPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const AuthPage = lazy(() => import('../pages/AuthPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const FavoritesPage = lazy(() => import('../pages/FavoritesPage'));
const GalleryPage = lazy(() => import('../pages/GalleryPage'));
const OrdersPage = lazy(() => import('../pages/OrdersPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));

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

const PrivateRoute = ({ children }) => {
  const { user } = useSelector(state => state.auth);
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
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
          <Route path="login" element={<AuthPage />} />

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
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
