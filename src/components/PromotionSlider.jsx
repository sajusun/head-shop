import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchActivePromotions } from '../features/promotions/promotionSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';

const PromotionSlider = () => {
  const dispatch = useDispatch();
  const { active: promotions = [], loading = false } = useSelector(state => state.promotions || {});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchActivePromotions());
  }, [dispatch]);

  // Reset index if promotions change and current index is out of bounds
  useEffect(() => {
    if (currentIndex >= promotions.length && promotions.length > 0) {
      setCurrentIndex(0);
    }
  }, [promotions, currentIndex]);

  useEffect(() => {
    if (promotions.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % promotions.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [promotions]);

  const next = () => setCurrentIndex(prev => (prev + 1) % promotions.length);
  const prev = () => setCurrentIndex(prev => (prev - 1 + promotions.length) % promotions.length);

  if (loading && promotions.length === 0) {
    return (
      <div className="w-full aspect-[21/9] bg-gray-50 animate-pulse rounded-[3rem] flex items-center justify-center">
        <p className="text-gray-300 font-black uppercase tracking-[0.5em] text-xs">Loading Spotlight...</p>
      </div>
    );
  }

  if (promotions.length === 0) return null;

  const current = promotions[currentIndex];
  if (!current) return null;

  return (
    <div className="relative group overflow-hidden rounded-[3rem] bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="relative aspect-[21/9] w-full"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            {current.banner ? (
              <img src={current.banner} alt={current.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center px-12 md:px-24">
            <div className="max-w-2xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest mb-6"
              >
                {current.type} {current.discount_percentage > 0 ? `• ${current.discount_percentage}% OFF` : ''}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter"
              >
                {current.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-300 mb-10 font-medium leading-relaxed"
              >
                {current.subtitle || current.description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4"
              >
                <Link to="/products">
                  <Button size="lg" className="rounded-full px-10 h-14 bg-white text-black hover:bg-primary hover:text-white transition-all shadow-2xl shadow-white/10">
                    Explore Now <ArrowRight size={20} className="ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {promotions.length > 1 && (
        <>
          <button 
            onClick={prev}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={next}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
            {promotions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1 transition-all rounded-full ${
                  i === currentIndex ? 'w-10 bg-white' : 'w-4 bg-white/30'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PromotionSlider;
