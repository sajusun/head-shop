import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Button from '../components/Button';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const isInternalAdmin = window.location.pathname.startsWith('/admin');

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

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50/50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Link 
          to={isInternalAdmin ? "/admin/login" : "/auth"} 
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <div className="bg-white p-8 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
            <p className="text-gray-500 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {message ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-start gap-3 mb-6"
            >
              <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-green-700 leading-relaxed">{message}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50 border border-red-100 p-3 rounded-lg flex items-center gap-2 text-red-700 text-sm"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}

              <div>
                <label htmlFor="email" className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full py-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold"
              >
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-xs text-gray-400">
              Remembered your password? {' '}
              <Link to={isInternalAdmin ? "/admin/login" : "/auth"} className="text-primary font-bold hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
