import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Settings, Package, Heart, LogOut, ChevronRight } from 'lucide-react';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth);
  const favorites = useSelector(state => state.favorites.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const menuItems = [
    { icon: <Package size={18} />, label: 'My Orders', path: '/orders' },
    { icon: <Heart size={18} />, label: 'Favorites', path: '/favorites' },
    { icon: <Settings size={18} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4 overflow-hidden border-4 border-white shadow-lg">
              {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <User size={40} />}
            </div>
            <h2 className="text-xl font-bold text-text">{user.name}</h2>
            <p className="text-sm text-gray-500 mb-6">{user.email}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full rounded-xl"
              onClick={() => navigate('/settings')}
            >
              Edit Profile
            </Button>
          </div>

          <nav className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-2">
            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                  item.active ? 'bg-primary/5 text-primary' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 font-bold text-sm">
                  {item.icon} {item.label}
                </div>
                <ChevronRight size={16} />
              </button>
            ))}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all"
            >
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="mb-12">
            <h1 className="text-3xl font-black text-text mb-2">Favorite Items</h1>
            <p className="text-gray-500">You have {favorites.length} items saved in your wishlist</p>
          </div>

          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {favorites.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-[40px] p-20 text-center border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Heart className="text-gray-300" size={32} />
              </div>
              <h3 className="text-xl font-bold text-text mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 mb-8">Save items you're interested in for later.</p>
              <Button onClick={() => navigate('/products')}>Explore Products</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
