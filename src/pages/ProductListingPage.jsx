import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, setSearchQuery, setCategoryFilter } from '../features/products/productSlice';
import { fetchCategories } from '../features/categories/categorySlice';
import ProductCard from '../components/ProductCard';
import { Search, LayoutGrid, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '../components/common/Pagination';

const ProductListingPage = () => {
  const dispatch = useDispatch();
  const { items: products, loading, searchQuery, categoryFilter, pagination } = useSelector(state => state.products);
  const [showCategoryPanel, setShowCategoryPanel] = useState(false);
  const [sortBy, setSortBy] = useState('Newest');
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(() => Math.max(Number(searchParams.get('page')) || 1, 1));
  const [perPage, setPerPage] = useState(24);
  const panelRef = useRef(null);

  const sortMap = {
    'Newest': 'latest',
    'Price: Low to High': 'price_low',
    'Price: High to Low': 'price_high',
  };

  const toSlug = (value) => value.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  const updateSearchParams = useCallback((updates) => {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === '1') {
          nextParams.delete(key);
        } else {
          nextParams.set(key, value);
        }
      });

      return nextParams;
    });
  }, [setSearchParams]);

  useEffect(() => {
    dispatch(fetchCategories({ type: 'product', per_page: 100 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({
      page: currentPage,
      per_page: perPage,
      search: searchQuery,
      category: categoryFilter === 'All' ? '' : toSlug(categoryFilter),
      sort: sortMap[sortBy],
    }));
  }, [dispatch, currentPage, perPage, searchQuery, categoryFilter, sortBy]);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query !== null) {
      dispatch(setSearchQuery(query));
    }

    setCurrentPage(Math.max(Number(searchParams.get('page')) || 1, 1));
  }, [dispatch, searchParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    updateSearchParams({ page: '1' });
  }, [searchQuery, categoryFilter, sortBy, updateSearchParams]);

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

  const { items: allCategories } = useSelector(state => state.categories);
  const categories = useMemo(() => ['All', ...allCategories.map(cat => cat.name)], [allCategories]);

  const totalProducts = pagination?.total ?? products.length;
  const pageStart = pagination?.from ?? (products.length ? 1 : 0);
  const pageEnd = pagination?.to ?? products.length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    updateSearchParams({ page: String(page) });
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
              onChange={(e) => {
                dispatch(setSearchQuery(e.target.value));
                updateSearchParams({ q: e.target.value, page: '1' });
              }}
              className="w-full pl-12 pr-14 py-4 bg-white border border-gray-100 rounded-3xl text-base font-medium shadow-xl shadow-primary/5 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={20} />
            {searchQuery && (
              <button
                onClick={() => {
                  dispatch(setSearchQuery(''));
                  updateSearchParams({ q: '', page: '1' });
                }}
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
              className={`flex items-center gap-2.5 px-5 py-3.5 rounded-2xl border transition-all font-bold text-sm ${categoryFilter !== 'All' || showCategoryPanel
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
                          className={`p-4 rounded-2xl text-left transition-all border ${categoryFilter === category
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
                className={`px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${sortBy === option
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
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Showing <span className="text-text font-black">{pageStart}-{pageEnd}</span> of <span className="text-text font-black">{totalProducts}</span> treasures
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
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination 
            pagination={{ ...pagination, per_page: perPage }} 
            onPageChange={handlePageChange} 
            onPerPageChange={setPerPage}
            variant="public"
          />
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
              updateSearchParams({ q: '', page: '1' });
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
