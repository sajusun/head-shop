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
              <div className="flex gap-3 pt-2">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 8px rgba(220,39,67,0.2)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(220,39,67,0.35)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(220,39,67,0.2)'; }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="white" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2"/>
                    <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Twitter / X"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 12, background: '#000', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'; }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 12, background: '#1877F2', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 8px rgba(24,119,242,0.25)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(24,119,242,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(24,119,242,0.25)'; }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="YouTube"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 12, background: '#FF0000', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 8px rgba(255,0,0,0.2)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,0,0,0.35)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,0,0,0.2)'; }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="black"/>
                  </svg>
                </a>
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
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg" alt="Visa" className="h-5 object-contain" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MasterCard" className="h-8 object-contain" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
