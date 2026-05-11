import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ShoppingBag } from 'lucide-react';
import { login, loginWith2FA, logout, register, socialLogin } from '../features/auth/authSlice';
import { adminLogin, adminLogout, adminLoginWith2FA } from '../features/auth/adminAuthSlice';
import { syncCartWithDB } from '../features/cart/cartSlice';
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
      const action = isAdminLogin ? adminLoginWith2FA : loginWith2FA;
      const resultAction = await dispatch(action({
        email: tempEmail || formData.email,
        password: formData.password,
        code: twoFactorCode
      }));
      if (action.fulfilled.match(resultAction)) {
        if (isAdminLogin) {
          navigate('/admin');
        } else {
          // Sync cart with DB after login
          const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
          if (currentCart.length > 0) {
            dispatch(syncCartWithDB(currentCart));
          }
          navigate('/profile', { replace: true });
        }
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
    
    // Sync cart with DB after login
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (currentCart.length > 0) {
      dispatch(syncCartWithDB(currentCart));
    }

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

  const handleSocialLogin = (provider) => {
    dispatch(socialLogin(provider));
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

                {!isAdminLogin && (
                  <>
                    <div className="relative my-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-4 text-gray-400 font-medium">Or continue with</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleSocialLogin('google')}
                        className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-all active:scale-[0.98]"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                          />
                        </svg>
                        <span className="text-sm font-semibold text-gray-600">Google</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSocialLogin('github')}
                        className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-all active:scale-[0.98]"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-600">GitHub</span>
                      </button>
                    </div>
                  </>
                )}
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
