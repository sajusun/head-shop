import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ShoppingBag } from 'lucide-react';
import { login, loginWith2FA, logout, register } from '../features/auth/authSlice';
import { adminLogin, adminLogout } from '../features/auth/adminAuthSlice';
import Button from '../components/Button';
import Input from '../components/Input';

const AuthPage = ({ mode = 'user' }) => {
  const isAdminLogin = mode === 'admin';
  const canRegister = !isAdminLogin;
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [roleError, setRoleError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const authState = useSelector(state => state.auth);
  const adminAuthState = useSelector(state => state.adminAuth);
  const { loading, error, requires2FA, tempEmail } = isAdminLogin ? adminAuthState : authState;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRoleError('');

    if (requires2FA) {
      const resultAction = await dispatch(loginWith2FA({
        email: tempEmail || formData.email,
        password: formData.password,
        code: twoFactorCode
      }));
      if (loginWith2FA.fulfilled.match(resultAction)) {
        navigate('/profile', { replace: true });
      }
      return;
    }

    if (isAdminLogin) {
      const resultAction = await dispatch(adminLogin(formData));
      if (adminLogin.fulfilled.match(resultAction)) {
        navigate('/admin');
      }
      return;
    }

    const action = isLogin ? login : register;
    const resultAction = await dispatch(action(formData));

    if (!action.fulfilled.match(resultAction)) return;

    // If it was a login and requires 2FA, don't redirect yet
    if (isLogin && resultAction.payload.requires_2fa) return;

    const user = resultAction.payload.user;

    // Smart Redirect for user
    const from = location.state?.from || (user?.role === 'admin' ? '/admin' : '/profile');
    navigate(from, { replace: true });
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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50/30">
      <div className="max-w-md w-full bg-white p-8 sm:p-12 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isAdminLogin ? 'Admin Portal' : isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm text-gray-400">
            {isAdminLogin
              ? 'Secure administrator access'
              : isLogin ? 'Sign in to your account' : 'Join the Herd community'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {requires2FA ? (
            <div className="space-y-5">
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 text-center mb-6">
                <p className="text-sm text-gray-600">Please enter the 6-digit code from your authenticator app to continue.</p>
              </div>
              <Input
                label="Verification Code"
                name="code"
                placeholder="000000"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                required
                autoFocus
              />
              <Button type="submit" size="lg" className="w-full rounded-xl h-12 bg-gray-900 hover:bg-gray-800" loading={loading}>
                Verify & Sign In
              </Button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
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
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <div>
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {isLogin && (
                  <div className="flex justify-end mt-2">
                    <Link
                      to={isAdminLogin ? "/admin/forgot-password" : "/forgot-password"}
                      className="text-xs font-semibold text-gray-400 hover:text-primary transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}
              </div>

              {(error || roleError) && (
                <p className="text-xs text-red-500 font-medium text-center bg-red-50 py-2 rounded-lg">
                  {error || roleError}
                </p>
              )}

              <div className="space-y-3 pt-2">
                <Button type="submit" size="lg" className="w-full rounded-xl h-12 bg-gray-900 hover:bg-gray-800" loading={loading}>
                  {isAdminLogin ? 'Sign In' : isLogin ? 'Sign In' : 'Sign Up'}
                </Button>

                {/* <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full rounded-xl h-12 border-gray-200 text-gray-500 font-medium"
                  onClick={fillDemoCredentials}
                >
                  Demo Account
                </Button> */}
              </div>
            </>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50">
          {canRegister ? (
            <p className="text-center text-gray-400 text-sm">
              {isLogin ? "New here?" : 'Already a member?'}{' '}
              <button
                onClick={() => {
                  setRoleError('');
                  setIsLogin(!isLogin);
                }}
                className="text-gray-900 font-bold hover:underline"
              >
                {isLogin ? 'Create account' : 'Sign in'}
              </button>
            </p>
          ) : (
            <p className="text-center text-gray-400 text-sm">
              <Link to="/login" className="font-bold hover:underline">
                User Login
              </Link>
            </p>
          )}

          {!isAdminLogin && (
            <div className="mt-2 text-center">
              <Link to="/admin/login" className="text-xs text-gray-300 hover:text-gray-900 transition-colors">
                Admin Access
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
