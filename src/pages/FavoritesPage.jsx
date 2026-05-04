import React from 'react';
import { useSelector } from 'react-redux';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const FavoritesPage = () => {
  const { items } = useSelector(state => state.favorites);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-text mb-2">My Favorites</h1>
          <p className="text-gray-500">You have {items.length} items saved in your wishlist</p>
        </div>
        
        <Link to="/products">
          <Button variant="outline" className="rounded-xl flex items-center gap-2">
            <ArrowLeft size={18} /> Back to Shop
          </Button>
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {items.map(product => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[40px] border border-gray-100 shadow-sm">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 text-red-500">
            <Heart size={48} />
          </div>
          <h2 className="text-3xl font-black text-text mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-10 max-w-md mx-auto">
            Explore our premium products and tap the heart icon to save items you love for later.
          </p>
          <Link to="/products">
            <Button size="lg" className="rounded-full px-10">
              Discover Products
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
