import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Button from '../components/Button';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isInternalAdmin = window.location.pathname.startsWith('/admin') || searchParams.get('role') === 'admin';
  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: '',
    token: searchParams.get('token') || '',
    email: searchParams.get('email') || '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!formData.token || !formData.email) {
      setError('Invalid reset link. Please request a new one.');
    }
  }, [formData.token, formData.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, formData);
      setSuccess(true);
      setTimeout(() => {
        navigate(isInternalAdmin ? '/admin/login' : '/auth');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
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
        <div className="bg-white p-8 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-500 text-sm">
              Please enter your new password below to secure your account.
            </p>
          </div>

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-green-500" size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
              <p className="text-gray-500 text-sm mb-6">
                Your password has been updated. Redirecting you to login...
              </p>
              <Link to={isInternalAdmin ? "/admin/login" : "/auth"} className="text-primary font-bold hover:underline">
                Go to Login now
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password_confirmation}
                    onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={!formData.token || !formData.email}
                className="w-full py-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold mt-4"
              >
                Reset Password
              </Button>
            </form>
          )}

          {!success && (
            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
              <Link to={isInternalAdmin ? "/admin/login" : "/auth"} className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-900 transition-colors">
                <ArrowLeft size={12} />
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
