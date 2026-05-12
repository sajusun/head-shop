import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchActivePromotions } from '../features/promotions/promotionSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';

const PromotionSlider = () => {
  const dispatch = useDispatch();
  const { active: promotions = [], loading = false } = useSelector(state => state.promotions || {});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchActivePromotions());
  }, [dispatch]);

  const defaultHero = {
    title: "Minimalist Aesthetic Collection",
    subtitle: "Experience the perfect blend of form and function with our latest lifestyle essentials.",
    type: "New Arrival",
    banner: null,
    discount_percentage: 0
  };

  const displayPromotions = promotions.length > 0 ? promotions : [defaultHero];

  useEffect(() => {
    if (currentIndex >= displayPromotions.length && displayPromotions.length > 0) {
      setCurrentIndex(0);
    }
  }, [displayPromotions, currentIndex]);

  useEffect(() => {
    if (displayPromotions.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % displayPromotions.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [displayPromotions]);

  const next = () => setCurrentIndex(prev => (prev + 1) % displayPromotions.length);
  const prev = () => setCurrentIndex(prev => (prev - 1 + displayPromotions.length) % displayPromotions.length);

  if (loading && promotions.length === 0) {
    return (
      <div className="w-full aspect-[21/9] bg-white rounded-[1rem] border border-gray-100 flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Loading Experiences...</p>
        </div>
      </div>
    );
  }

  const current = displayPromotions[currentIndex] || defaultHero;

  return (
    <div className="relative group bg-white rounded-card border border-gray-100 overflow-hidden shadow-soft hover:shadow-premium transition-shadow duration-700">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[21/10] md:aspect-[21/8] lg:aspect-[21/7] w-full flex flex-col md:flex-row"
        >
          {/* Content Section */}
          <div className="flex-1 p-8 md:p-16 lg:p-24 flex flex-col justify-center order-2 md:order-1 relative z-10">
            {/* Decorative Background for Content */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-white to-gray-50/30 -z-10"></div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="px-4 py-1 rounded-full bg-black text-white text-[9px] font-black uppercase tracking-[0.2em]">
                {current.type}
              </span>
              {current.discount_percentage > 0 && (
                <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1">
                  <Tag size={10} /> {current.discount_percentage}% OFF
                </span>
              )}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-5xl lg:text-7xl font-black text-black leading-tight mb-6 tracking-tighter"
            >
              {current.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm md:text-lg text-gray-500 mb-10 max-w-xl leading-relaxed"
            >
              {current.subtitle || current.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-6"
            >
              <Link to="/products">
                <Button size="lg" className="rounded-button px-10 h-14 bg-black text-white hover:bg-primary transition-all shadow-xl shadow-black/10 text-sm font-black uppercase tracking-widest">
                  Explore Now <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>

              {current.products?.length > 0 && (
                <div className="hidden lg:flex items-center -space-x-3">
                  {current.products.slice(0, 3).map((p, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-50 overflow-hidden shadow-md transform hover:scale-110 transition-all">
                      <img src={p.thumbnail || p.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <span className="pl-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Trending Now
                  </span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Image Section */}
          <div className="flex-1 h-64 md:h-auto relative order-1 md:order-2 overflow-hidden">
            <div className="absolute inset-0 p-4 md:p-8">
              <div className="w-full h-full rounded-card overflow-hidden bg-gray-50 border border-gray-100/50 relative group-hover:scale-[1.02] transition-transform duration-1000 ease-out">
                {current.banner ? (
                  <img src={current.banner} alt={current.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-gray-100 to-white flex items-center justify-center p-12">
                    <Sparkles className="text-gray-200" size={120} strokeWidth={0.5} />
                  </div>
                )}
                {/* Subtle Overlay to blend with white content on small screens */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {displayPromotions.length > 1 && (
        <>
          <div className="absolute right-12 bottom-12 flex items-center gap-3 z-20">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-md border border-gray-100 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-md border border-gray-100 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-lg"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute left-12 bottom-12 flex gap-1.5 z-20">
            {displayPromotions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-10 bg-black' : 'w-4 bg-black/10'
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
