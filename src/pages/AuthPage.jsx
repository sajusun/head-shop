import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = isLogin ? login : register;
    const resultAction = await dispatch(action(formData));
    if (action.fulfilled.match(resultAction)) {
      navigate('/profile');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-50">
        
        {/* Form Side */}
        <div className="p-8 sm:p-16">
          <div className="max-w-sm mx-auto">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white mb-8">
              <ShoppingBag size={28} />
            </div>
            
            <h1 className="text-3xl font-black text-text mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-500 mb-10">
              {isLogin ? 'Enter your details to access your account' : 'Start your journey with premium products'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
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
                placeholder="john@example.com" 
                value={formData.email} 
                onChange={handleChange}
                required 
              />
              <Input 
                label="Password" 
                name="password" 
                type="password" 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={handleChange}
                required 
              />
              
              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

              <div className="space-y-3">
                <Button type="submit" size="lg" className="w-full rounded-2xl h-14" loading={loading}>
                  {isLogin ? 'Login' : 'Register'}
                </Button>
                
                {isLogin && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="lg" 
                    className="w-full rounded-2xl h-14 border-dashed border-2 hover:bg-gray-50"
                    onClick={() => {
                      setFormData({ email: 'john@example.com', password: 'password' });
                      // We'll let the user click submit or we can trigger it
                    }}
                  >
                    Use Demo Credentials
                  </Button>
                )}
              </div>
            </form>

            <p className="mt-8 text-center text-gray-500 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-bold hover:underline"
              >
                {isLogin ? 'Create one' : 'Login here'}
              </button>
            </p>
          </div>
        </div>

        {/* Brand Side */}
        <div className="hidden lg:flex bg-primary p-16 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white leading-tight mb-6">
              "The best way to predict the future is to create it."
            </h2>
            <p className="text-primary-foreground/80 text-white/70">Join 10,000+ members getting exclusive access to limited edition releases and members-only pricing.</p>
          </div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-gray-200 overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                </div>
              ))}
            </div>
            <span className="text-white/80 text-sm font-medium">Join our growing community</span>
          </div>

          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
