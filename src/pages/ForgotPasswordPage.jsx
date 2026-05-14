import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Clock,
  Lock,
} from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import ToastContainer from '../components/notifications/ToastContainer';

const infoItems = [
  {
    icon: Mail,
    label: 'Email delivery',
    sub: 'Reset links are only sent to the address registered on your account.',
  },
  {
    icon: Clock,
    label: 'Time-limited link',
    sub: 'Links expire so old requests cannot be reused.',
  },
  {
    icon: Lock,
    label: 'Secure next step',
    sub: 'You will set a new password on our encrypted reset page.',
  },
];

const paymentRow = (
  <div className="flex items-center gap-8 opacity-60">
    <img src="https://icon2.cleanpng.com/20180419/ile/avu920jgz.webp" alt="Stripe" className="h-6" />
    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
    <img src="https://www.logo.wine/a/logo/Visa_Inc./Visa_Inc.-Logo.wine.svg" alt="Visa" className="h-6" />
    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" className="h-6" />
  </div>
);

const ForgotPasswordPage = () => {
  const location = useLocation();
  const isInternalAdmin = location.pathname.startsWith('/admin');
  const loginPath = isInternalAdmin ? '/admin/login' : '/login';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const { data: settings } = useSelector((state) => state.settings);
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const siteName = settings?.site_name || 'HERD SHOP';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { email });
      setMessage(response.data.message || 'If an account exists with this email, you will receive a reset link shortly.');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formCard = (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Link
        to={loginPath}
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" aria-hidden />
        Back to sign in
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-[1.65rem] font-bold text-text tracking-tight mb-2">Forgot password?</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Enter the email you use for your account. If it matches our records, we will send a link to choose a new
          password.
        </p>
      </div>

      {message ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-start gap-3"
          role="status"
        >
          <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" size={18} aria-hidden />
          <p className="text-sm text-green-800 leading-relaxed">{message}</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-2 text-red-700 text-sm"
              role="alert"
            >
              <AlertCircle size={16} className="shrink-0" aria-hidden />
              {error}
            </motion.div>
          )}

          <Input
            id="email"
            label="Email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-12 rounded-xl border-gray-200"
          />

          <Button type="submit" size="lg" loading={loading} className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">
            Send reset link
          </Button>
        </form>
      )}

      <div className="mt-8 pt-6 border-t border-gray-50 text-center">
        <p className="text-sm text-gray-500">
          Remembered your password?{' '}
          <Link to={loginPath} className="font-bold text-text hover:text-primary transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );

  if (isInternalAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-section shadow-soft border border-gray-100">
          {formCard}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 group">
              {settings?.site_logo ? (
                <img src={settings.site_logo} alt={siteName} className="h-10 w-auto object-contain" />
              ) : (
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                  <ShoppingBag size={24} />
                </div>
              )}
              <span className="text-xl font-black text-text tracking-tighter uppercase">{siteName}</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                to="/products"
                className="hidden sm:inline text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                Products
              </Link>
              <Link
                to="/cart"
                className="p-2 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-full transition-all relative"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 lg:items-start">
            <div className="lg:col-span-5 space-y-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden />
                Back to store
              </Link>

              <div className="bg-white border border-gray-100 rounded-section shadow-soft p-8 sm:p-10">
                <p className="text-[11px] font-black text-text uppercase tracking-widest text-primary mb-3">Security</p>
                <h2 className="text-3xl sm:text-4xl font-black text-text tracking-tight leading-tight">Reset with confidence.</h2>
                <p className="mt-4 text-gray-500 text-sm leading-relaxed">
                  Password recovery uses the same safeguards as checkout and account settings—clear steps, no guesswork.
                </p>

                <ul className="mt-8 space-y-5 pt-8 border-t border-gray-50">
                  {infoItems.map(({ icon: Icon, label, sub }) => (
                    <li key={label} className="flex gap-4 items-start">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-primary">
                        <Icon className="w-[18px] h-[18px]" strokeWidth={2} aria-hidden />
                      </span>
                      <div>
                        <p className="text-sm font-black text-text">{label}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{sub}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white rounded-section border border-gray-100 shadow-premium p-8 sm:p-10 max-w-xl mx-auto lg:max-w-none lg:mx-0">
                {formCard}
              </div>
              <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6 leading-relaxed px-2">
                Need help?{' '}
                <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors underline-offset-2 hover:underline">
                  Contact support
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto bg-white border-t border-gray-100 pt-8 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest italic text-center md:text-left">
            © 2026 {siteName}. Designed for Excellence.
          </p>
          {paymentRow}
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default ForgotPasswordPage;
