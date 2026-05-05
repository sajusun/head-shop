import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { ArrowRight, Zap, Shield, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector(state => state.products);
  const scrollRef = useRef(null);
  const topRatedRef = useRef(null);
  const autoScrollDir = useRef(1); // 1 = forward, -1 = reverse

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Auto-scroll for Top Rated — bounce forward/reverse every 10s
  useEffect(() => {
    const el = topRatedRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const maxScroll = scrollWidth - clientWidth;

      if (scrollLeft >= maxScroll - 10) {
        autoScrollDir.current = -1; // reached end → go back
      } else if (scrollLeft <= 10) {
        autoScrollDir.current = 1;  // reached start → go forward
      }

      el.scrollTo({
        left: scrollLeft + autoScrollDir.current * clientWidth,
        behavior: 'smooth',
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const featuredProducts = products.slice(0, 8);
  const topRatedProducts = products
    .filter(p => p.rating >= 4)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 20);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollTo = direction === 'left'
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth;
      ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-12 lg:pt-20 pb-20 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6"
            >
              New Collection 2024
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-black text-text leading-tight mb-8"
            >
              Elevate Your <span className="text-primary italic">Lifestyle</span> With Premium Goods.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-500 mb-10 leading-relaxed"
            >
              Discover our curated collection of high-quality products designed for the modern individual. Quality meets aesthetic.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/products">
                <Button size="lg" className="rounded-full px-10">
                  Shop Now <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link to="/gallery">
                <Button size="lg" variant="outline" className="rounded-full px-10">
                  View Gallery
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-0"></div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-0"></div>
      </section>

      {/* Top Rated Products — Auto Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group/toprated">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-accent font-black uppercase tracking-widest text-xs mb-2 block">Customer Favorites</span>
            <h2 className="text-4xl lg:text-5xl font-black text-text mb-1">Top Rated Collection</h2>
            <p className="text-gray-500">Our community's most loved pieces, chosen for their exceptional quality and design.</p>
          </div>
          <Link to="/products" className="text-primary font-bold flex items-center gap-2 hover:underline shrink-0 ml-4">
            View All <ArrowRight size={18} />
          </Link>
        </div>

        <div className="relative">
          {/* Left Button */}
          <button
            onClick={() => scroll(topRatedRef, 'left')}
            className="absolute -left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-gray-100 flex items-center justify-center text-text hover:bg-primary hover:text-white hover:border-primary transition-all shadow-xl z-10 opacity-0 group-hover/toprated:opacity-100 hidden lg:flex"
          >
            <ChevronLeft size={24} />
          </button>
          {/* Right Button */}
          <button
            onClick={() => scroll(topRatedRef, 'right')}
            className="absolute -right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-gray-100 flex items-center justify-center text-text hover:bg-primary hover:text-white hover:border-primary transition-all shadow-xl z-10 opacity-0 group-hover/toprated:opacity-100 hidden lg:flex"
          >
            <ChevronRight size={24} />
          </button>

          {loading ? (
            <div className="flex gap-8 overflow-hidden pb-4">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="min-w-[300px] aspect-square bg-gray-100 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div
              ref={topRatedRef}
              className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {topRatedProducts.map(product => (
                <div key={product.id} className="min-w-[280px] sm:min-w-[320px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Flash Sale Section */}
      <section className="bg-primary/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-red-500 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span> Flash Sale
              </span>
              <h2 className="text-4xl font-black text-text mb-4">Limited Time Offers</h2>
              <p className="text-gray-500">Unbeatable deals on our premium collection. Don't miss out!</p>
            </div>
            <Link to="/products" className="mt-4 md:mt-0 text-sm font-bold text-primary bg-white px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all">
              View All Deals
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products
              .filter(p => p.offerPrice !== null)
              .slice(0, 4)
              .map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Featured Products (Slider) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black text-text mb-2">Featured Products</h2>
            <p className="text-gray-500">Handpicked items just for you</p>
          </div>
          <Link to="/products" className="text-primary font-bold flex items-center gap-2 hover:underline">
            View All <ArrowRight size={18} />
          </Link>
        </div>

        <div className="relative">
          {/* Slider Buttons */}
          <button 
            onClick={() => scroll(scrollRef, 'left')}
            className="absolute -left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-gray-100 flex items-center justify-center text-text hover:bg-primary hover:text-white hover:border-primary transition-all shadow-xl z-10 opacity-0 group-hover:opacity-100 hidden lg:flex"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll(scrollRef, 'right')}
            className="absolute -right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md border border-gray-100 flex items-center justify-center text-text hover:bg-primary hover:text-white hover:border-primary transition-all shadow-xl z-10 opacity-0 group-hover:opacity-100 hidden lg:flex"
          >
            <ChevronRight size={24} />
          </button>

          {loading ? (
            <div className="flex gap-8 overflow-hidden pb-4">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="min-w-[300px] aspect-square bg-gray-100 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <div 
              ref={scrollRef}
              className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredProducts.map(product => (
                <div key={product.id} className="min-w-[280px] sm:min-w-[320px] snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features - About Page Bottom Section Style */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-text mb-4">Why Choose Herd?</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">We combine cutting-edge technology with minimalist design to bring you the best experience.</p>
        </div>  
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
          {[
            { icon: <Zap size={48} className="text-accent" />, title: "Fast Delivery", desc: "Get your orders in record time with our express shipping." },
            { icon: <Shield size={48} className="text-primary" />, title: "Secure Payment", desc: "Your transactions are protected by industry-leading security." },
            { icon: <Truck size={48} className="text-secondary" />, title: "Free Shipping", desc: "Enjoy free shipping on all orders over $100." }
          ].map((feature, i) => (
            <div key={i} className="group text-center">
              <div className="relative mb-8 mx-auto w-40 h-40">
                {/* Aura Glow */}
                <div className="absolute inset-0 bg-primary/10 rounded-full scale-100 group-hover:scale-125 transition-transform duration-500 blur-xl opacity-50 group-hover:opacity-100"></div>
                <div className="absolute inset-0 bg-gray-50 rounded-full scale-105 group-hover:scale-110 transition-transform duration-500"></div>
                
                {/* Icon Container */}
                <div className="relative w-full h-full rounded-full bg-white flex items-center justify-center border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="group-hover:scale-110 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  {/* Subtle inner gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-text mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed px-4">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
