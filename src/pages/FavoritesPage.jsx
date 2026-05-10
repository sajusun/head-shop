import React from 'react';
import { useSelector } from 'react-redux';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const FavoritesPage = () => {
  const { items } = useSelector(state => state.favorites);
  const navigate = useNavigate();
  const itemCount = items?.length || 0;
  const itemLabel = itemCount === 1 ? 'item' : 'items';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <div className="mb-8 md:mb-10">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              className="rounded-2xl flex items-center gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} /> Back
            </Button>

            <Link to="/products" className="hidden sm:block">
              <Button className="rounded-2xl flex items-center gap-2">
                <ShoppingBag size={18} /> Continue Shopping
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-text leading-tight">My Favorites</h1>
              <p className="text-gray-500 mt-1">
                {itemCount} {itemLabel} saved for later
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-semibold text-gray-700">
                <Heart size={16} className="text-red-500" />
                Wishlist
              </span>
              <Link to="/products" className="sm:hidden">
                <Button className="rounded-2xl flex items-center gap-2">
                  <ShoppingBag size={18} /> Shop
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {itemCount > 0 ? (
        <AnimatePresence>
          <motion.div
            key="favorites-grid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {items.map(product => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 md:py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm"
        >
          <div>
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-red-500 shadow-sm border border-red-100">
              <Heart size={44} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-text mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-10 max-w-md mx-auto">
              Browse products and tap the heart icon to save your favorites for later.
            </p>
            <Link to="/products">
              <Button size="lg" className="rounded-full px-10">
                Discover Products
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FavoritesPage;
