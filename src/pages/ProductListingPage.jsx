import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setSearchQuery, setCategoryFilter } from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, LayoutGrid, ChevronDown, X, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductListingPage = () => {
  const dispatch = useDispatch();
  const { items: products, loading, searchQuery, categoryFilter } = useSelector(state => state.products);
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);
  const [sortBy, setSortBy] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const panelRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowCategoryPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Simple sorting logic
    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);

    return result;
  }, [products, searchQuery, categoryFilter, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      
      {/* Search & Header Section */}
      <div className="flex flex-col items-center mb-10 space-y-6">
        <div className="w-full max-w-2xl relative">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search products by name or category..." 
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-12 pr-14 py-4 bg-white border border-gray-100 rounded-3xl text-base font-medium shadow-xl shadow-primary/5 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={20} />
            {searchQuery && (
              <button 
                onClick={() => dispatch(setSearchQuery(''))}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Category Trigger */}
          <div className="relative" ref={panelRef}>
            <button
              onClick={() => setShowCategoryPanel(!showCategoryPanel)}
              className={`flex items-center gap-2.5 px-5 py-3.5 rounded-2xl border transition-all font-bold text-sm ${
                categoryFilter !== 'All' || showCategoryPanel
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                : 'bg-white text-text border-gray-100 hover:border-primary hover:text-primary shadow-sm'
              }`}
            >
              <LayoutGrid size={16} />
              {categoryFilter === 'All' ? 'Categories' : categoryFilter}
              <ChevronDown size={14} className={`transition-transform duration-300 ${showCategoryPanel ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showCategoryPanel && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[320px] sm:w-[480px] bg-white rounded-[32px] shadow-2xl border border-gray-50 overflow-hidden z-[60]"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-black text-text">Browse Categories</h3>
                      <button onClick={() => setShowCategoryPanel(false)} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={18} className="text-gray-400" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => {
                            dispatch(setCategoryFilter(category));
                            setShowCategoryPanel(false);
                          }}
                          className={`p-4 rounded-2xl text-left transition-all border ${
                            categoryFilter === category
                            ? 'bg-primary/5 border-primary/20 text-primary'
                            : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 text-gray-600'
                          }`}
                        >
                          <p className="font-bold text-sm">{category}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 flex justify-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Herd Shop Collections</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sort Option */}
          <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-1 shadow-sm">
            {['Newest', 'Price: Low to High', 'Price: High to Low'].map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                  sortBy === option
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-400 hover:text-text'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-gray-400">
            Showing <span className="text-text font-black">{paginatedProducts.length}</span> of <span className="text-text font-black">{filteredProducts.length}</span> treasures
          </p>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-gray-100 animate-pulse rounded-[32px]"></div>
          ))}
        </div>
      ) : paginatedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {paginatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-6 border-t border-gray-100">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-gray-100 hover:border-primary hover:text-primary disabled:opacity-30 transition-all"
              >
                <ChevronDown className="rotate-90" size={18} />
              </button>

              <div className="flex items-center gap-1.5">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${
                        currentPage === pageNumber
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'bg-white text-gray-500 border border-gray-100 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border border-gray-100 hover:border-primary hover:text-primary disabled:opacity-30 transition-all"
              >
                <ChevronDown className="-rotate-90" size={18} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Search className="text-primary" size={40} />
          </div>
          <h3 className="text-2xl font-black text-text mb-4">No treasures found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            Try adjusting your search or explore a different category to find what you're looking for.
          </p>
          <button 
            onClick={() => {
              dispatch(setSearchQuery(''));
              dispatch(setCategoryFilter('All'));
            }}
            className="mt-8 px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;
