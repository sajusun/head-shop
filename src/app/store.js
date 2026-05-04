import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/products/productSlice';
import cartReducer from '../features/cart/cartSlice';
import favoriteReducer from '../features/favorites/favoriteSlice';
import reviewReducer from '../features/reviews/reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    favorites: favoriteReducer,
    reviews: reviewReducer,
  },
});
