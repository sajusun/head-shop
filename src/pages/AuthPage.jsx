import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ShoppingBag } from 'lucide-react';
import { login, logout, register } from '../features/auth/authSlice';
import Button from '../components/Button';
import Input from '../components/Input';

const AuthPage = ({ mode = 'user' }) => {
  const isAdminLogin = mode === 'admin';
  const canRegister = !isAdminLogin;
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [roleError, setRoleError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRoleError('');

    const action = isLogin || isAdminLogin ? login : register;
    const resultAction = await dispatch(action(formData));

    if (!action.fulfilled.match(resultAction)) return;

    const user = resultAction.payload.user;

    if (isAdminLogin) {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        dispatch(logout());
        setRoleError('This account is not allowed to access the admin panel.');
      }
      return;
    }

    navigate(user?.role === 'admin' ? '/admin' : '/profile');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fillDemoCredentials = () => {
    setFormData(
      isAdminLogin
        ? { email: 'admin@herdshop.com', password: 'admin123', name: '' }
        : { email: 'user@herdshop.com', password: 'user123', name: '' }
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-50">
        <div className="p-8 sm:p-16">
          <div className="max-w-sm mx-auto">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white mb-8">
              {isAdminLogin ? <ShieldCheck size={28} /> : <ShoppingBag size={28} />}
            </div>

            <h1 className="text-3xl font-black text-text mb-2">
              {isAdminLogin ? 'Admin Login' : isLogin ? 'User Login' : 'Create Account'}
            </h1>
            <p className="text-gray-500 mb-10">
              {isAdminLogin
                ? 'Sign in with an administrator account to manage the store.'
                : isLogin
                  ? 'Enter your details to access your customer account.'
                  : 'Start your journey with premium products.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && canRegister && (
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              )}

              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder={isAdminLogin ? 'admin@herdshop.com' : 'user@herdshop.com'}
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
              />

              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
              {roleError && <p className="text-sm text-red-500 font-medium">{roleError}</p>}

              <div className="space-y-3">
                <Button type="submit" size="lg" className="w-full rounded-2xl h-14" loading={loading}>
                  {isAdminLogin ? 'Login as Admin' : isLogin ? 'Login' : 'Register'}
                </Button>

                {(isLogin || isAdminLogin) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full rounded-2xl h-14 border-dashed border-2 hover:bg-gray-50"
                    onClick={fillDemoCredentials}
                  >
                    {isAdminLogin ? 'Use Admin Demo' : 'Use User Demo'}
                  </Button>
                )}
              </div>
            </form>

            {canRegister ? (
              <p className="mt-8 text-center text-gray-500 text-sm">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  onClick={() => {
                    setRoleError('');
                    setIsLogin(!isLogin);
                  }}
                  className="text-primary font-bold hover:underline"
                >
                  {isLogin ? 'Create one' : 'Login here'}
                </button>
              </p>
            ) : (
              <p className="mt-8 text-center text-gray-500 text-sm">
                Customer account?{' '}
                <Link to="/login" className="text-primary font-bold hover:underline">
                  Go to user login
                </Link>
              </p>
            )}

            {!isAdminLogin && (
              <p className="mt-3 text-center text-gray-500 text-sm">
                Store manager?{' '}
                <Link to="/admin/login" className="text-primary font-bold hover:underline">
                  Admin login
                </Link>
              </p>
            )}
          </div>
        </div>

        <div className="hidden lg:flex bg-primary p-16 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white leading-tight mb-6">
              {isAdminLogin
                ? 'Manage products, orders, and customers with confidence.'
                : '"The best way to predict the future is to create it."'}
            </h2>
            <p className="text-white/70">
              {isAdminLogin
                ? 'Dedicated access for HERD SHOP administrators.'
                : 'Join 10,000+ members getting exclusive access to limited edition releases and members-only pricing.'}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                </div>
              ))}
            </div>
            <span className="text-white/80 text-sm font-medium">
              {isAdminLogin ? 'Secure admin workspace' : 'Join our growing community'}
            </span>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
