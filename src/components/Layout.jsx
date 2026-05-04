import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search, LogOut, X, Settings } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { fetchProducts } from '../features/products/productSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef(null);
  const menuTimeoutRef = useRef(null);
  
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const products = useSelector(state => state.products.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleMenuEnter = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setShowUserMenu(true);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setShowUserMenu(false);
    }, 300);
  };

  // Load products globally if not already loaded
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Suggestions logic
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery, products]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSuggestionClick = (slug) => {
    setSearchQuery('');
    setShowSuggestions(false);
    navigate(`/product/${slug}`);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/products?q=${searchQuery}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
                <ShoppingBag size={24} />
              </div>
              <span className="text-xl font-black text-text tracking-tighter">HERD SHOP</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Home</Link>
              <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Products</Link>
              <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">About</Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative hidden sm:block" ref={searchRef}>
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleSearchSubmit}
                  className="pl-10 pr-10 py-2 bg-gray-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-48 lg:w-64"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-text"
                  >
                    <X size={14} />
                  </button>
                )}

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full mt-2 w-full lg:w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-[60]"
                    >
                      <div className="p-2">
                        {suggestions.map(product => (
                          <button
                            key={product.id}
                            onClick={() => handleSuggestionClick(product.slug)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                          >
                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                              <img src={product.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-text truncate">{product.name}</p>
                              <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                      <Link 
                        to={`/products?q=${searchQuery}`}
                        onClick={() => setShowSuggestions(false)}
                        className="block p-3 bg-gray-50 text-center text-xs font-bold text-primary hover:bg-gray-100 transition-colors border-t border-gray-100"
                      >
                        See all results for "{searchQuery}"
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center border-l border-gray-200 pl-2 sm:pl-4 gap-1 sm:gap-2">
                <Link to="/favorites" className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                  <Heart size={20} />
                </Link>
                
                <Link to="/cart" className="p-2 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-full transition-all relative">
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {user ? (
                  <div 
                    className="relative"
                    onMouseEnter={handleMenuEnter}
                    onMouseLeave={handleMenuLeave}
                  >
                    <button className={`flex items-center gap-2 p-1 pl-2 rounded-full transition-all ${showUserMenu ? 'bg-gray-100' : 'hover:bg-gray-100'}`}>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                        {user.avatar ? <img src={user.avatar} alt={user.name} /> : <User size={18} />}
                      </div>
                    </button>
                    
                    <div className={`absolute right-0 top-full pt-2 w-48 transition-all duration-200 z-50 ${
                      showUserMenu ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}>
                      <div className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden">
                        <div className="p-4 border-b border-gray-50">
                          <p className="text-sm font-bold text-text truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link to="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <User size={16} /> Profile Dashboard
                          </Link>
                          <Link to="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <Settings size={16} /> Settings
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <LogOut size={16} /> Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link to="/login" className="p-2 text-gray-600 hover:text-primary hover:bg-primary/5 rounded-full transition-all">
                    <User size={20} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="page-transition">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {/* Column 1: Brand */}
            <div className="space-y-6">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white transition-transform group-hover:rotate-12">
                  <ShoppingBag size={22} />
                </div>
                <span className="text-xl font-black text-text tracking-tighter">HERD SHOP</span>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Premium lifestyle goods curated for the modern individual. Quality, aesthetic, and purpose in every piece.
              </p>
              <div className="flex gap-6 pt-2">
                <a href="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">Instagram</a>
                <a href="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">Twitter</a>
                <a href="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">Facebook</a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-sm font-black text-text uppercase tracking-widest mb-8">Company</h4>
              <ul className="space-y-4">
                <li><Link to="/about" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">Our Story</Link></li>
                <li><Link to="/gallery" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">Visual Gallery</Link></li>
                <li><Link to="/products" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">Shop All</Link></li>
                <li><Link to="/journal" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">Journal (Blog)</Link></li>
              </ul>
            </div>

            {/* Column 3: Customer Care */}
            <div>
              <h4 className="text-sm font-black text-text uppercase tracking-widest mb-8">Support</h4>
              <ul className="space-y-4">
                <li><Link to="/orders" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">Track My Order</Link></li>
                <li><Link to="/shipping-policy" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">Shipping Policy</Link></li>
                <li><Link to="/returns-exchanges" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">Returns & Exchanges</Link></li>
                <li><Link to="/contact" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">Contact Us</Link></li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
              <h4 className="text-sm font-black text-text uppercase tracking-widest mb-8">Legal</h4>
              <ul className="space-y-4">
                <li><Link to="/privacy-policy" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">Privacy Policy</Link></li>
                <li><Link to="/terms-of-use" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">Terms of Use</Link></li>
                <li><Link to="/cookie-settings" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">Cookie Settings</Link></li>
                <li><Link to="/accessibility" className="text-gray-500 hover:text-primary transition-colors text-sm font-medium">Accessibility</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest italic">© 2024 Herd Shop. Designed for Excellence.</p>
            <div className="flex items-center gap-8">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 object-contain" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2014_logo_detail.svg" alt="Visa" className="h-5 object-contain" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" className="h-8 object-contain" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
