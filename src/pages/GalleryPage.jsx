import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { LayoutGrid, Maximize2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const GalleryPage = () => {
  const { items: products } = useSelector(state => state.products);

  // Creating an expanded list of images for a rich gallery feel
  const galleryImages = products.flatMap(p => [
    { id: `${p.id}-1`, url: p.image, title: p.name, category: p.category, slug: p.slug },
    // Adding some placeholder lifestyle shots for variety if needed, 
    // but for now we'll just use the product images
  ]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-text mb-4"
        >
          Visual Gallery
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-500 max-w-2xl mx-auto text-lg"
        >
          A curated collection of our finest products and design philosophy. Quality you can see, feel, and experience.
        </motion.p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
      >
        {galleryImages.map((image, index) => (
          <motion.div 
            key={image.id}
            variants={itemVariants}
            className="relative group rounded-3xl overflow-hidden cursor-pointer"
          >
            <img 
              src={image.url} 
              alt={image.title} 
              className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">
                  {image.category}
                </span>
                <h3 className="text-white text-xl font-bold mb-4">{image.title}</h3>
                
                <div className="flex gap-4">
                  <Link 
                    to={`/product/${image.slug}`}
                    className="flex items-center gap-2 text-white bg-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-opacity-90 transition-all"
                  >
                    View Product <ExternalLink size={16} />
                  </Link>
                  <button className="p-2 bg-white/10 text-white rounded-xl hover:bg-white/20 backdrop-blur-md">
                    <Maximize2 size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Subtle Gradient Shadow (Always visible) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none opacity-60 group-hover:opacity-0 transition-opacity"></div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {galleryImages.length === 0 && (
        <div className="py-32 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <LayoutGrid className="text-gray-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-text mb-2">No images found</h3>
          <p className="text-gray-500">We're still curating our collection. Please check back later!</p>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
