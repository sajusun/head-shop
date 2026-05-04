import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductBySlug, clearCurrentProduct } from '../features/products/productSlice';
import { fetchReviews } from '../features/reviews/reviewSlice';
import { addToCart } from '../features/cart/cartSlice';
import { toggleFavorite } from '../features/favorites/favoriteSlice';
import { Heart, ShoppingBag, Share2, ArrowLeft, Star, MessageSquare } from 'lucide-react';
import Button from '../components/Button';
import RatingStars from '../components/RatingStars';
import ReviewItem from '../features/reviews/ReviewItem';
import ReviewForm from '../features/reviews/ReviewForm';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: allProducts, currentProduct: product, loading, error } = useSelector(state => state.products);
  const { items: reviews, loading: reviewsLoading } = useSelector(state => state.reviews);
  const favorites = useSelector(state => state.favorites.items);
  const isFavorite = favorites.some(item => item.id === product?.id);
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = useMemo(() => {
    if (!product || !allProducts.length) return [];
    return allProducts
      .filter(item => item.id !== product.id && item.category === product.category)
      .slice(0, 4);
  }, [product, allProducts]);

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
    return () => dispatch(clearCurrentProduct());
  }, [dispatch, slug]);

  useEffect(() => {
    if (product) {
      dispatch(fetchReviews(product.id));
    }
  }, [dispatch, product]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error || !product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="aspect-square bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                <img src={product.image} alt="" className="w-full h-full object-cover opacity-50" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={handleShare}
                className="p-2.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:text-primary hover:border-primary transition-all"
              >
                <Share2 size={20} />
              </button>
              <button 
                onClick={() => dispatch(toggleFavorite(product))}
                className={`p-2.5 border rounded-full transition-all ${
                  isFavorite ? 'bg-red-50 border-red-500 text-red-500' : 'bg-white border-gray-200 text-gray-600 hover:text-red-500 hover:border-red-500'
                }`}
              >
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          <h1 className="text-4xl font-black text-text mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-1">
              <RatingStars rating={product.rating} size={18} />
              <span className="text-sm font-bold text-text ml-1">{product.rating}</span>
            </div>
            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <MessageSquare size={16} /> {reviews.length} reviews
            </span>
            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
            <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-8">
            {product.offerPrice ? (
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-primary">${product.offerPrice}</span>
                <span className="text-xl text-gray-400 line-through decoration-red-400/50">${product.price}</span>
                <span className="bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter">
                  Save ${ (product.price - product.offerPrice).toFixed(2) }
                </span>
              </div>
            ) : (
              <div className="text-4xl font-black text-text">${product.price}</div>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-10 text-lg">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <div className="flex items-center border border-gray-200 rounded-xl p-1 bg-white">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              >-</button>
              <span className="w-12 text-center font-bold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              >+</button>
            </div>
            <Button 
              size="lg" 
              className="flex-1 gap-2 rounded-xl"
              onClick={() => dispatch(addToCart({ ...product, quantity }))}
            >
              <ShoppingBag size={20} /> Add to Cart
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Related Products Section */}
      <section className="border-t border-gray-100 pt-20 mb-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-text mb-2">Related Products</h2>
            <p className="text-gray-500">You might also like these premium items from {product.category}</p>
          </div>
          <Link to="/products" className="text-primary font-bold hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map(item => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="border-t border-gray-100 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-black text-text mb-8">Customer Reviews</h2>
            <div className="bg-gray-50 p-8 rounded-3xl mb-8">
              <div className="text-center">
                <div className="text-6xl font-black text-text mb-2">{product.rating}</div>
                <RatingStars rating={product.rating} size={20} className="justify-center mb-4" />
                <p className="text-gray-500 text-sm">Based on {reviews.length} reviews</p>
              </div>
              <div className="mt-8 space-y-3">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-500 w-4">{star}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full" 
                        style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : 5}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <ReviewForm productId={product.id} />
          </div>

          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-text">Recent Reviews</h3>
              <select className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer">
                <option>Newest first</option>
                <option>Highest rating</option>
                <option>Lowest rating</option>
              </select>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {reviews.map(review => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <ReviewItem review={review} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {reviews.length === 0 && (
                <div className="text-center py-12 text-gray-400 italic">
                  No reviews yet. Be the first to review this product!
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsPage;
