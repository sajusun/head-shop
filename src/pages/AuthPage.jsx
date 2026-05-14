import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ShoppingBag } from 'lucide-react';
import { login, loginWith2FA, register, socialLogin } from '../features/auth/authSlice';
import { adminLogin, adminLoginWith2FA } from '../features/auth/adminAuthSlice';
import { syncCartWithDB } from '../features/cart/cartSlice';
import Button from '../components/Button';
import Input from '../components/Input';
import ToastContainer from '../components/notifications/ToastContainer';

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

  const { data: settings } = useSelector((state) => state.settings);
  const authState = useSelector((state) => state.auth);
  const adminAuthState = useSelector((state) => state.adminAuth);
  const { loading, error, requires2FA, tempEmail } = isAdminLogin ? adminAuthState : authState;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRoleError('');

    if (requires2FA) {
      const action = isAdminLogin ? adminLoginWith2FA : loginWith2FA;
      const resultAction = await dispatch(
        action({
          email: tempEmail || formData.email,
          password: formData.password,
          code: twoFactorCode,
        })
      );
      if (action.fulfilled.match(resultAction)) {
        if (isAdminLogin) {
          navigate('/admin');
        } else {
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

    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (currentCart.length > 0) {
      dispatch(syncCartWithDB(currentCart));
    }

    if (isLogin && resultAction.payload.requires_2fa) return;

    const user = resultAction.payload.user;
    const from = location.state?.from || (user?.role === 'admin' ? '/admin' : '/profile');
    navigate(from, { replace: true });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSocialLogin = (provider) => {
    dispatch(socialLogin(provider));
  };

  const pageHeader = isAdminLogin ? (
    <div className="text-center mb-6">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Admin Portal</h1>
      <p className="text-xs text-gray-400">Secure administrator access</p>
    </div>
  ) : (
    <div className="mb-5 text-center">
      {requires2FA ? (
        <>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary mb-2 mx-auto">
            <ShieldCheck className="w-3 h-3" aria-hidden />
            Two-factor authentication
          </div>
          <h1 className="text-xl font-bold text-text tracking-tight">Verify it&apos;s you</h1>
          <p className="text-xs text-gray-500 mt-1">Enter the 6-digit code from your authenticator app.</p>
        </>
      ) : (
        <h1 className="text-xl sm:text-2xl font-bold text-text tracking-tight">
          {isLogin ? 'Sign in' : 'Create your account'}
        </h1>
      )}
    </div>
  );

  const formBlock = (
    <>
      {pageHeader}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {requires2FA ? (
          <div className="space-y-3">
            <Input
              label="Verification code"
              name="code"
              placeholder="000000"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              required
              autoFocus
              className="h-11 rounded-lg border-gray-200 text-center text-base font-mono tracking-[0.3em]"
            />
            <Button
              type="submit"
              size="lg"
              className="w-full h-11 rounded-lg text-sm font-bold shadow-md shadow-primary/15"
              loading={loading}
            >
              Verify & sign in
            </Button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              Back to login
            </button>
          </div>
        ) : (
          <>
            {!isLogin && canRegister && (
              <Input
                label="Full name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="h-11 rounded-lg border-gray-200"
              />
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-11 rounded-lg border-gray-200"
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
                className="h-11 rounded-lg border-gray-200"
              />
              {isLogin && (
                <div className="flex justify-end mt-1">
                  <Link
                    to={isAdminLogin ? '/admin/forgot-password' : '/forgot-password'}
                    className="text-xs font-semibold text-gray-500 hover:text-primary transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
            </div>

            {(error || roleError) && (
              <p
                className="text-xs font-medium text-red-600 text-center bg-red-50 border border-red-100 py-2 px-3 rounded-lg"
                role="alert"
              >
                {error || roleError}
              </p>
            )}

            <div className="space-y-2 pt-0.5">
              <Button
                type="submit"
                size="lg"
                className="w-full h-11 rounded-lg text-sm font-bold shadow-md shadow-primary/15"
                loading={loading}
              >
                {isAdminLogin ? 'Sign in' : isLogin ? 'Sign in' : 'Create account'}
              </Button>

              {!isAdminLogin && (
                <>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                      <span className="bg-white px-3 text-gray-400 font-semibold">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('google')}
                      className="flex items-center justify-center gap-2 px-2 py-2.5 rounded-lg border border-gray-100 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
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
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin('github')}
                      className="flex items-center justify-center gap-2 px-2 py-2.5 rounded-lg border border-gray-100 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </form>

      <div className="mt-5 pt-4 border-t border-gray-50">
        {canRegister ? (
          <p className="text-center text-gray-500 text-xs">
            {isLogin ? 'New to the store? ' : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setRoleError('');
                setIsLogin(!isLogin);
              }}
              className="font-bold text-text hover:text-primary transition-colors"
            >
              {isLogin ? 'Create an account' : 'Sign in'}
            </button>
          </p>
        ) : (
          <p className="text-center text-gray-500 text-xs">
            <Link to="/login" className="font-bold hover:text-primary transition-colors">
              Customer sign in
            </Link>
          </p>
        )}

        {!isAdminLogin && (
          <p className="mt-2 text-center">
            <Link
              to="/admin/login"
              className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-700 transition-colors"
            >
              Staff / admin access
            </Link>
          </p>
        )}
      </div>
    </>
  );

  if (isAdminLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full bg-white p-6 sm:p-9 rounded-section shadow-soft border border-gray-100">
          {formBlock}
        </div>
      </div>
    );
  }

  const siteName = settings?.site_name || 'HERD SHOP';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-6 sm:py-8 font-sans">
      <div className="w-full max-w-[380px] sm:max-w-md">
        <div className="bg-white rounded-section border border-gray-100 shadow-premium px-6 py-6 sm:px-8 sm:py-7">
          <Link to="/" className="flex flex-col items-center gap-2 mb-5 group">
            {settings?.site_logo ? (
              <img
                src={settings.site_logo}
                alt={siteName}
                className="h-10 w-auto max-w-[180px] object-contain"
              />
            ) : (
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:rotate-6 transition-transform">
                <ShoppingBag size={22} strokeWidth={2} />
              </div>
            )}
            <span className="text-lg font-black text-text tracking-tighter uppercase text-center leading-tight">{siteName}</span>
          </Link>

          {formBlock}

          <p className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-5 leading-snug">
            By continuing you agree to our{' '}
            <Link to="/terms-of-use" className="text-gray-600 hover:text-primary transition-colors underline-offset-2 hover:underline">
              Terms
            </Link>{' '}
            &{' '}
            <Link to="/privacy-policy" className="text-gray-600 hover:text-primary transition-colors underline-offset-2 hover:underline">
              Privacy
            </Link>
            .
          </p>
        </div>

        <p className="text-center mt-4">
          <Link to="/" className="text-[11px] font-semibold text-gray-500 hover:text-primary transition-colors">
            ← Back to store
          </Link>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AuthPage;
