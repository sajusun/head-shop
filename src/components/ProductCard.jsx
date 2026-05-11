import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, ShoppingCart, Share2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../features/favorites/favoriteSlice';
import { addToCart, addToCartDB } from '../features/cart/cartSlice';
import Button from './Button';
import RatingStars from './RatingStars';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const favorites = useSelector(state => state.favorites.items);
  const isFavorite = user && favorites.some(item => item.id === product.id);
  const image = product.thumbnail || product.image;
  const category = product.category?.name || product.category;
  const rating = product.rating?.average ?? product.rating ?? 0;
  const offerPrice = product.offer_price ?? product.offerPrice;
  const price = product.price;

  const handleShare = async (e) => {
    e.preventDefault();
    const shareUrl = `${window.location.origin}/product/${product.slug}`;
    
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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="aspect-square overflow-hidden bg-gray-100 relative">
          <img 
            src={image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Sale Badge */}
          {offerPrice && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg z-10 animate-pulse">
              {Math.round(((price - offerPrice) / price) * 100)}% OFF
            </div>
          )}

          {!offerPrice && product.is_promo && (
            <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span> PROMO
            </div>
          )}
          {!offerPrice && !product.is_promo && product.ranking_score > 50 && (
            <div className="absolute top-3 left-3 bg-accent text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg z-10">
              TRENDING
            </div>
          )}
          {!offerPrice && product.ranking_score <= 50 && product.sales_count > 10 && (
            <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg z-10">
              BEST SELLER
            </div>
          )}

          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                if (!user) {
                  navigate('/login', { state: { from: location.pathname } });
                  return;
                }
                dispatch(toggleFavorite(product));
              }}
              className={`p-2 rounded-full shadow-lg backdrop-blur-md transition-all duration-200 ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/80 text-gray-600 hover:text-primary shadow-lg backdrop-blur-md transition-all duration-200"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">{category}</span>
            <RatingStars rating={rating} size={14} />
          </div>
          <h3 className="font-bold text-text mb-1 truncate group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {offerPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-primary">${offerPrice}</span>
                  <span className="text-sm text-gray-400 line-through decoration-red-400/50">${price}</span>
                </div>
              ) : (
                <span className="text-xl font-black text-text">${price}</span>
              )}
            </div>
            <Button
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                const variants = product.variants || [];
                const defaultVariant = variants.length > 0 ? variants[0] : null;
                
                const cartPayload = {
                  ...product,
                  product_variant_id: defaultVariant?.id,
                  selectedColor: defaultVariant?.color?.name || null,
                  selectedSize: defaultVariant?.size?.short || defaultVariant?.size?.name || null,
                  price: defaultVariant?.price || product.price,
                  offer_price: defaultVariant?.offer_price || product.offer_price,
                  effective_price: defaultVariant ? (defaultVariant.offer_price ?? defaultVariant.price) : (product.offer_price ?? product.price)
                };
                
                dispatch(addToCart(cartPayload));
                if (user) {
                  dispatch(addToCartDB(cartPayload));
                }
              }}
              className="rounded-full w-10 h-10 p-0 shadow-lg shadow-primary/20"
            >
              <ShoppingCart size={18} />
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
