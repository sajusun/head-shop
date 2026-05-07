import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { LayoutGrid, Maximize2, ExternalLink, X, ChevronLeft, ChevronRight, Camera, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const GalleryPage = () => {
  const { items: products } = useSelector(state => state.products);
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // High-quality lifestyle images to complement product shots
  const lifestyleImages = [
    { id: 'l1', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200', title: 'Minimalist Tech', category: 'Lifestyle', type: 'lifestyle' },
    { id: 'l2', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200', title: 'Acoustic Vibes', category: 'Lifestyle', type: 'lifestyle' },
    { id: 'l3', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200', title: 'Urban Motion', category: 'Lifestyle', type: 'lifestyle' },
    { id: 'l4', url: 'https://images.unsplash.com/photo-1526170315870-ef68460d2870?auto=format&fit=crop&q=80&w=1200', title: 'Modern Precision', category: 'Lifestyle', type: 'lifestyle' },
  ];

  const productImages = products.map(p => ({
    id: p.id,
    url: p.thumbnail || p.image,
    title: p.name,
    category: typeof p.category === 'object' ? p.category.name : (p.category || 'Collection'),
    slug: p.slug,
    type: 'product'
  }));

  const allGalleryItems = useMemo(() => [...lifestyleImages, ...productImages], [products]);
  
  const categories = ['all', ...new Set(allGalleryItems.map(item => item.category))];

  const filteredItems = useMemo(() => {
    if (filter === 'all') return allGalleryItems;
    return allGalleryItems.filter(item => item.category === filter);
  }, [filter, allGalleryItems]);

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e) => {
    e.stopPropagation();
    const nextIdx = (selectedIndex + 1) % filteredItems.length;
    setSelectedIndex(nextIdx);
    setSelectedImage(filteredItems[nextIdx]);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    const prevIdx = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedIndex(prevIdx);
    setSelectedImage(filteredItems[prevIdx]);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-text">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-40 scale-105"
            alt="Gallery Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-text/50 to-text"></div>
        </div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 backdrop-blur-md border border-primary/30">
              <Sparkles size={12} /> Visual Experience
            </span>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter">
              The Gallery<span className="text-primary">.</span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
              Explore our world through a curated visual journey of premium craftsmanship, 
              innovative design, and the lifestyle that defines us.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === cat 
                ? 'bg-text text-white shadow-xl shadow-text/20 scale-105' 
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div 
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative group rounded-[2.5rem] overflow-hidden cursor-none"
                onClick={() => openLightbox(item, index)}
              >
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-1000"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-text/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-3 block">
                      {item.category}
                    </span>
                    <h3 className="text-white text-2xl font-black mb-6 tracking-tight">{item.title}</h3>
                    
                    <div className="flex items-center gap-4">
                      {item.type === 'product' && (
                        <Link 
                          to={`/product/${item.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 text-text bg-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                        >
                          Shop Now <ExternalLink size={14} />
                        </Link>
                      )}
                      <button className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-primary transition-all backdrop-blur-md border border-white/20">
                        <Maximize2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Custom Cursor for Group */}
                <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <div className="w-20 h-20 bg-primary rounded-full flex flex-col items-center justify-center text-white shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-500">
                    <span className="text-[8px] font-black uppercase tracking-widest">View</span>
                    <Maximize2 size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <Camera className="text-gray-200" size={48} />
            </div>
            <h3 className="text-2xl font-black text-text mb-2 tracking-tight">Gallery is empty</h3>
            <p className="text-gray-500 font-medium">This category hasn't been curated yet.</p>
          </div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-text/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-4 z-50"
              onClick={closeLightbox}
            >
              <X size={32} />
            </button>

            <button 
              className="absolute left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all p-4 hover:bg-white/5 rounded-full z-50"
              onClick={prevImage}
            >
              <ChevronLeft size={48} />
            </button>

            <button 
              className="absolute right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all p-4 hover:bg-white/5 rounded-full z-50"
              onClick={nextImage}
            >
              <ChevronRight size={48} />
            </button>

            <div className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center">
              <motion.img 
                key={selectedImage.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
                src={selectedImage.url} 
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-3xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />

              <div className="mt-8 text-center" onClick={(e) => e.stopPropagation()}>
                <span className="text-primary font-black text-xs uppercase tracking-[0.3em] mb-2 block">
                  {selectedImage.category}
                </span>
                <h2 className="text-3xl font-black text-white tracking-tight mb-6">{selectedImage.title}</h2>
                {selectedImage.type === 'product' && (
                  <Link to={`/product/${selectedImage.slug}`} onClick={closeLightbox}>
                    <Button className="rounded-2xl px-10">Shop Product</Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 text-xs font-black tracking-widest uppercase">
              {selectedIndex + 1} / {filteredItems.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
